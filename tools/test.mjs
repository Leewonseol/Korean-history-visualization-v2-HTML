#!/usr/bin/env node
/* 사용법: node tools/test.mjs — 데이터 검증 + temporal 분석 단위 테스트 */
import assert from "node:assert/strict";
import { DATA } from "../src/data/index.js";
import { validateData } from "../src/model/validate.js";
import { buildIndexes } from "../src/model/indexes.js";
import { filterContacts } from "../src/model/temporalNetwork.js";
import { temporalPath, isTimeRespecting, feedbackLoops, buildAdjacency, earliestArrival } from "../src/analysis/temporalPaths.js";
import { computeMetrics, dynamicCommunicability } from "../src/analysis/centrality.js";
import { yearlyTrajectories } from "../src/analysis/trajectories.js";

let passed = 0;
const test = (name, fn) => { try { fn(); passed++; console.log("ok  ", name); } catch (e) { console.log("FAIL", name, "\n     ", e.message); process.exitCode = 1; } };
const C = (source, target, d, extra = {}) => ({ id: `${source}${target}${d}`, eventId: "X", source, target, layer: "COMMAND", startDate: d, endDate: extra.end || d, direction: extra.dir || "directed", certainty: "confirmed", sourceTypes: ["sillok"], theater: ["CENTRAL"] });

/* ---------------- 데이터 ---------------- */
test("validateData: 오류 0", () => {
  const r = validateData(DATA);
  assert.equal(r.errors.length, 0, r.errors.join("\n"));
});
test("validateData: 결함 데이터를 실제로 잡아낸다", () => {
  const bad = structuredClone(DATA);
  bad.EVENTS[0].relations.push({ source: "NOBODY", target: "JO_SEJONG", layer: "POLICY", relationType: "x" });
  bad.EVENTS[1].recordDate = "1432-12-20";                       // 사료 게재일과 불일치
  bad.EVENTS[2].placeIds = ["PL_NOWHERE"];
  bad.EVENTS[3].sourceIds = ["SRC_MISSING"];
  bad.EVENTS[4].relations[0].certainty = "confirmed"; bad.EVENTS[4].relations[0].sourceIds = ["SRC_ENCY_SEOJEONGNOK"];
  bad.PEOPLE.push({ ...bad.PEOPLE[0], personId: "JO_SEJONG_DUP" });
  bad.EVENTS[5].actors = [];
  const errs = validateData(bad).errors.join("\n");
  for (const needle of ["NOBODY", "혼동", "PL_NOWHERE", "SRC_MISSING", "1차/당대 사료가 없음", "중복 의심", "WHO"]) assert.ok(errs.includes(needle), "검출 실패: " + needle);
});

/* ---------------- time-respecting path ---------------- */
test("시간 역행 경로 금지: A→B(t2), B→C(t1) 이면 A↛C", () => {
  const cs = [C("A", "B", "1433-02-01"), C("B", "C", "1433-01-01")];
  assert.equal(temporalPath(cs, ["A"], "C", "1432-00-00", "1449-99-99"), null);
});
test("시간 순행 경로 허용: A→B(t1), B→C(t2)", () => {
  const p = temporalPath([C("A", "B", "1433-01-01"), C("B", "C", "1433-02-01")], ["A"], "C", "1432-00-00", "1449-99-99");
  assert.ok(p && p.hops === 2 && isTimeRespecting(p.steps));
});
test("같은 날짜 연쇄(t1 = t2) 허용", () => {
  const p = temporalPath([C("A", "B", "1433-01-01"), C("B", "C", "1433-01-01")], ["A"], "C", "1432-00-00", "1449-99-99");
  assert.ok(p && p.arrival === "1433-01-01");
});
test("분석 기간 밖 contact는 쓰지 않음", () => {
  const cs = [C("A", "B", "1433-01-01"), C("B", "C", "1440-01-01")];
  assert.equal(temporalPath(cs, ["A"], "C", "1432-00-00", "1435-99-99"), null);
});
test("구간 contact: 도착 후 아직 열려 있으면 사용 가능", () => {
  const cs = [C("A", "B", "1433-05-01"), C("B", "C", "1433-01-01", { end: "1433-12-01" })];
  const p = temporalPath(cs, ["A"], "C", "1432-00-00", "1449-99-99");
  assert.ok(p && p.steps[1].time === "1433-05-01" && isTimeRespecting(p.steps));
});
test("isTimeRespecting가 역행 경로를 거부", () => {
  const c1 = C("A", "B", "1433-02-01"), c2 = C("B", "C", "1433-01-01");
  assert.equal(isTimeRespecting([{ from: "A", to: "B", time: "1433-02-01", contact: c1 }, { from: "B", to: "C", time: "1433-01-01", contact: c2 }]), false);
});

/* ---------------- 중심성 ---------------- */
test("temporal betweenness: 순행 연쇄에서만 매개", () => {
  const fwd = computeMetrics([C("A", "B", "1433-01-01"), C("B", "C", "1433-02-01")], { from: "1432-00-00", to: "1449-99-99" });
  assert.equal(fwd.metrics.B.betweenness, 1);
  const rev = computeMetrics([C("A", "B", "1433-02-01"), C("B", "C", "1433-01-01")], { from: "1432-00-00", to: "1449-99-99" });
  assert.equal(rev.metrics.B.betweenness, 0);
});
test("temporal betweenness: 두 개의 동등 경로는 1/2씩", () => {
  const cs = [C("A", "B", "1433-01-01"), C("A", "D", "1433-01-01"), C("B", "C", "1433-02-01"), C("D", "C", "1433-02-01")];
  const m = computeMetrics(cs, { from: "1432-00-00", to: "1449-99-99" }).metrics;
  assert.equal(m.B.betweenness, 0.5); assert.equal(m.D.betweenness, 0.5);
});
test("broadcast/receive: 시간 순서에 민감", () => {
  const f = dynamicCommunicability([C("A", "B", "1433-01-01"), C("B", "C", "1433-02-01")], ["A", "B", "C"]);
  const r = dynamicCommunicability([C("A", "B", "1433-02-01"), C("B", "C", "1433-01-01")], ["A", "B", "C"]);
  assert.ok(f.broadcast[0] > r.broadcast[0], "A의 broadcast는 순행일 때 더 커야 함");
  assert.ok(Math.abs(r.broadcast[0] - r.alpha) < 1e-9);
});

/* ---------------- 실제 데이터 ---------------- */
const idx = buildIndexes(DATA);
const ALL = { from: "1432-00-00", to: "1449-99-99" };
test("실제 데이터: 모든 earliest-arrival 경로가 시간 순행이며 brute-force와 일치", () => {
  const cs = filterContacts(idx, ALL);
  const nodes = [...new Set(cs.flatMap((c) => [c.source, c.target]))];
  const adj = buildAdjacency(cs);
  for (const s of nodes) {
    const { arrival } = earliestArrival(adj, [s], ALL.from, ALL.to);
    // brute force: 날짜 순 contact를 반복 완화(같은 날 연쇄 포함)
    const bf = new Map([[s, ALL.from]]);
    let changed = true;
    while (changed) {
      changed = false;
      for (const c of cs) {
        const au = bf.get(c.source);
        if (au !== undefined && au <= c.endDate) {
          const t = au > c.startDate ? au : c.startDate;
          if (!bf.has(c.target) || t < bf.get(c.target)) { bf.set(c.target, t); changed = true; }
        }
      }
    }
    for (const v of nodes) {
      if (v === s) continue;
      assert.equal(arrival.get(v), bf.get(v), `${s}→${v}`);
      if (arrival.has(v)) {
        const p = temporalPath(cs, [s], v, ALL.from, ALL.to);
        assert.ok(isTimeRespecting(p.steps, ALL.from), `${s}→${v} 경로가 시간 역행`);
      }
    }
  }
});
test("실제 데이터: 세종→최윤덕→세종 피드백 루프(1433)", () => {
  const loops = feedbackLoops(filterContacts(idx, ALL), "JO_SEJONG", ALL.from, ALL.to);
  const l = loops.find((x) => x.via === "JO_CHOEYUNDEOK");
  assert.ok(l, "루프 없음");
  assert.ok(isTimeRespecting(l.steps));
});
test("실제 데이터: layer 필터가 contact 집합을 바꾼다", () => {
  const all = filterContacts(idx, ALL).length;
  const rep = filterContacts(idx, { ...ALL, layers: new Set(["REPORT"]) }).length;
  assert.ok(rep > 0 && rep < all);
});
test("실제 데이터: level / theater 필터", () => {
  const lv = filterContacts(idx, { ...ALL, levels: new Set(["L0", "L1"]) });
  assert.ok(lv.length > 0 && lv.every((c) => ["L0", "L1"].includes(idx.levelAt(c.source, c.startDate))));
  const du = filterContacts(idx, { ...ALL, theaters: new Set(["DUMAN"]) });
  assert.ok(du.length > 0 && du.every((c) => c.theater.includes("DUMAN")));
});
test("실제 데이터: trajectory가 선택 기간에 따라 달라짐", () => {
  const a = yearlyTrajectories(idx, ALL, ["JO_SEJONG"]);
  const b = yearlyTrajectories(idx, { from: "1433-00-00", to: "1434-99-99" }, ["JO_SEJONG"]);
  assert.deepEqual(b.years, [1433, 1434]);
  assert.ok(a.years.length > b.years.length);
});

console.log(`\n${passed} passed${process.exitCode ? ", FAILURES above" : ""}`);
