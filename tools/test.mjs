#!/usr/bin/env node
/* 사용법: node tools/test.mjs — 데이터 검증 + temporal 분석 단위 테스트
   (역사 무결성 규칙 전용 검사는 tools/integrity.mjs) */
import assert from "node:assert/strict";
import { DATA } from "../src/data/index.js";
import { validateData } from "../src/model/validate.js";
import { buildIndexes } from "../src/model/indexes.js";
import { filterContacts, analysisContacts } from "../src/model/temporalNetwork.js";
import { temporalPath, isTimeRespecting, feedbackLoops, buildAdjacency, earliestArrival, classifyPath } from "../src/analysis/temporalPaths.js";
import { computeMetrics, dynamicCommunicability } from "../src/analysis/centrality.js";
import { toArcs } from "../src/model/deriveEdges.js";
import { yearlyTrajectories } from "../src/analysis/trajectories.js";
import { isValidBound, isDayPrecise, formatRange } from "../src/model/dates.js";

let passed = 0;
const test = (name, fn) => { try { fn(); passed++; console.log("ok  ", name); } catch (e) { console.log("FAIL", name, "\n     ", e.message); process.exitCode = 1; } };
// 합성 contact: tMin·tMax(null = 미상), timeKind
const C = (source, target, tMin, tMax = tMin, extra = {}) => ({
  id: `${source}${target}${tMin}${tMax}${extra.kind || ""}`, eventId: "X", source, target, layer: "COMMAND",
  tMin, tMax, timeKind: extra.kind || "instant", exact: tMin !== null && tMin === tMax && isDayPrecise(tMin),
  anchor: tMax ?? tMin, startDate: tMin ?? tMax, endDate: tMax ?? tMin,
  direction: extra.dir || "directed", certainty: "confirmed", pathEligible: extra.pathEligible ?? true,
  evidenceStatus: "verified", provenance: "pack_v1_direct", sourceTypes: ["sillok"], theater: ["CENTRAL"]
});
const W = { from: "1432-00-00", to: "1449-99-99" };

/* ---------------- 날짜 ---------------- */
test("날짜 경계 표기: 월·연 단위 sentinel 허용, 잘못된 형식 거부", () => {
  for (const s of ["1433-04-10", "1433-08L-10", "1435-01-00", "1435-01-99", "1434-00-00", "1434-99-99"]) assert.ok(isValidBound(s), s);
  for (const s of ["1434-00-05", "1434-13-01", "1434-99-01", "x"]) assert.ok(!isValidBound(s), s);
  assert.ok(isDayPrecise("1433-04-10") && !isDayPrecise("1435-01-00") && !isDayPrecise("1434-99-99"));
  assert.match(formatRange(null, "1432-12-09"), /이전/);
  assert.match(formatRange("1434-00-00", "1434-99-99", "YEAR"), /연중 시점 미상/);
});

/* ---------------- 데이터 ---------------- */
test("validateData: 오류 0", () => {
  const r = validateData(DATA);
  assert.equal(r.errors.length, 0, r.errors.join("\n"));
});
test("validateData: 결함 데이터를 실제로 잡아낸다", () => {
  const bad = structuredClone(DATA);
  const ev = (id) => bad.EVENTS.find((e) => e.id === id);
  ev("E1432_1209").relations.push({ source: "NOBODY", target: "JO_SEJONG", layer: "POLICY", relationType: "x", provenance: "pack_v1_direct", causalStatus: "unknown", pathEligible: true });
  ev("E1432_1211").recordDate = "1432-12-20";                                   // 사료 게재일과 불일치
  ev("E1432_1221").placeIds = ["PL_NOWHERE"];
  ev("E1433_0215").sourceIds = ["SRC_MISSING"];
  bad.PEOPLE.push({ ...bad.PEOPLE.find((p) => p.personId === "JO_HWANGHUI"), personId: "JO_HWANGHUI_DUP" });
  ev("E1433_0307").actors = [];
  delete ev("E1433_0325").relations[0].causalStatus;                            // 인과 상태 누락
  ev("E1433_0507").relations[0].provenance = undefined;                         // provenance 누락
  ev("E1433_0517").relations[0].direction = "undirected";                       // WELFARE는 방향 필수
  ev("E1434_0803").datePrecision = "DAY"; ev("E1434_0803").dateMin = "1434-08-00"; // 가짜 정밀도
  const errs = validateData(bad).errors.join("\n");
  for (const needle of ["NOBODY", "게재일", "PL_NOWHERE", "SRC_MISSING", "중복 의심", "WHO", "causalStatus 없음", "provenance 없음", "undirected 금지", "DAY 정밀도"]) {
    assert.ok(errs.includes(needle), "검출 실패: " + needle);
  }
});

/* ---------------- time-respecting path (strict) ---------------- */
test("시간 역행 경로 금지: A→B(t2), B→C(t1) 이면 A↛C", () => {
  assert.equal(temporalPath([C("A", "B", "1433-02-01"), C("B", "C", "1433-01-01")], ["A"], "C", W.from, W.to), null);
});
test("시간 순행 경로 허용 + EXACT 플래그", () => {
  const p = temporalPath([C("A", "B", "1433-01-01"), C("B", "C", "1433-02-01")], ["A"], "C", W.from, W.to);
  assert.ok(p && p.hops === 2 && isTimeRespecting(p.steps, W.from) && p.flag === "EXACT");
});
test("같은 날짜 연쇄는 허용하되 PARTIAL_ORDER(같은 날 안의 순서는 사료에 없음)", () => {
  const p = temporalPath([C("A", "B", "1433-01-01"), C("B", "C", "1433-01-01")], ["A"], "C", W.from, W.to);
  assert.ok(p && p.arrival === "1433-01-01" && p.flag === "PARTIAL_ORDER");
});
test("분석 기간 밖 contact는 쓰지 않음", () => {
  assert.equal(temporalPath([C("A", "B", "1433-01-01"), C("B", "C", "1440-01-01")], ["A"], "C", W.from, "1435-99-99"), null);
});
test("duration contact: 도착 후 아직 지속 중이면 사용", () => {
  const p = temporalPath([C("A", "B", "1433-05-01"), C("B", "C", "1433-01-01", "1433-12-01", { kind: "duration" })], ["A"], "C", W.from, W.to);
  assert.ok(p && p.steps[1].time === "1433-05-01" && isTimeRespecting(p.steps, W.from) && p.flag === "PARTIAL_ORDER");
});
test("범위 instant: strict는 순서가 확정될 때만 연결, possible은 UNCERTAIN으로 연결", () => {
  const cs = [C("A", "B", "1433-01-01", "1433-03-01"), C("B", "C", "1433-02-01")];
  assert.equal(temporalPath(cs, ["A"], "C", W.from, W.to, "strict"), null);
  const p = temporalPath(cs, ["A"], "C", W.from, W.to, "possible");
  assert.ok(p && p.flag === "UNCERTAIN" && isTimeRespecting(p.steps, W.from, "possible"));
});
test("범위 instant 뒤 확정 순서: strict 연결 + PARTIAL_ORDER, 도착은 범위 상한", () => {
  const p = temporalPath([C("A", "B", "1433-01-01", "1433-01-20"), C("B", "C", "1433-02-01")], ["A"], "C", W.from, W.to);
  assert.ok(p && p.steps[0].time === "1433-01-20" && p.flag === "PARTIAL_ORDER");
});
test("'기사일 이전'(tMin 미상) 관계: strict 경로에 쓰지 않음, possible에서는 UNCERTAIN", () => {
  const cs = [C("A", "B", null, "1433-02-01"), C("B", "C", "1433-03-01")];
  assert.equal(temporalPath(cs, ["A"], "C", W.from, W.to, "strict"), null);
  assert.equal(temporalPath(cs, ["A"], "C", W.from, W.to, "possible").flag, "UNCERTAIN");
});
test("연·월 단위 관계에 가짜 순서를 매기지 않음: 같은 해 YEAR 관계 두 개는 strict 연결 불가", () => {
  const cs = [C("A", "B", "1434-00-00", "1434-99-99"), C("B", "C", "1434-00-00", "1434-99-99")];
  assert.equal(temporalPath(cs, ["A"], "C", W.from, W.to, "strict"), null);
  assert.equal(classifyPath(temporalPath(cs, ["A"], "C", W.from, W.to, "possible").steps, W.from), "UNCERTAIN");
});
test("isTimeRespecting가 역행 경로를 거부", () => {
  const c1 = C("A", "B", "1433-02-01"), c2 = C("B", "C", "1433-01-01");
  assert.equal(isTimeRespecting([{ from: "A", to: "B", time: "1433-02-01", contact: c1 }, { from: "B", to: "C", time: "1433-01-01", contact: c2 }], W.from), false);
});

/* ---------------- 중심성 ---------------- */
test("temporal betweenness: 순행 연쇄에서만 매개", () => {
  assert.equal(computeMetrics([C("A", "B", "1433-01-01"), C("B", "C", "1433-02-01")], W).metrics.B.betweenness, 1);
  assert.equal(computeMetrics([C("A", "B", "1433-02-01"), C("B", "C", "1433-01-01")], W).metrics.B.betweenness, 0);
});
test("temporal betweenness: 두 개의 동등 경로는 1/2씩", () => {
  const cs = [C("A", "B", "1433-01-01"), C("A", "D", "1433-01-01"), C("B", "C", "1433-02-01"), C("D", "C", "1433-02-01")];
  const m = computeMetrics(cs, W).metrics;
  assert.equal(m.B.betweenness, 0.5); assert.equal(m.D.betweenness, 0.5);
});
test("temporal betweenness: 순서 미확정(범위) 연쇄는 매개로 세지 않음", () => {
  assert.equal(computeMetrics([C("A", "B", "1433-01-01", "1433-03-01"), C("B", "C", "1433-02-01")], W).metrics.B.betweenness, 0);
});
test("broadcast/receive: 시간 순서에 민감, 일 단위 미확정 관계는 slice에 넣지 않음", () => {
  const f = dynamicCommunicability([C("A", "B", "1433-01-01"), C("B", "C", "1433-02-01")], ["A", "B", "C"]);
  const r = dynamicCommunicability([C("A", "B", "1433-02-01"), C("B", "C", "1433-01-01")], ["A", "B", "C"]);
  assert.ok(f.broadcast[0] > r.broadcast[0], "A의 broadcast는 순행일 때 더 커야 함");
  assert.ok(Math.abs(r.broadcast[0] - r.alpha) < 1e-9);
  const u = dynamicCommunicability([C("A", "B", "1434-00-00", "1434-99-99")], ["A", "B"]);
  assert.equal(u.excludedInexact, 1); assert.equal(u.slices, 0);
});

/* ---------------- 실제 데이터 ---------------- */
const idx = buildIndexes(DATA);
test("실제 데이터: 기본 표시는 pack v1 검증 관계만, legacy·해석은 토글로만", () => {
  const def = filterContacts(idx, W);
  assert.ok(def.length > 0 && def.every((c) => c.evidenceStatus === "verified"));
  const leg = filterContacts(idx, { ...W, includeLegacy: true });
  assert.ok(leg.some((c) => c.evidenceStatus === "legacy") && !leg.some((c) => c.evidenceStatus === "interpretation"));
  const all = filterContacts(idx, { ...W, includeLegacy: true, includeInterpretation: true });
  assert.equal(all.length, idx.contacts.length);
});
test("실제 데이터: 분석 입력은 strict·경로 대상만, 제외 수를 보고", () => {
  const a = analysisContacts(idx, W, "strict");
  assert.ok(a.contacts.every((c) => c.pathEligible && c.tMin !== null && c.tMax !== null && c.evidenceStatus === "verified"));
  assert.ok(a.excludedUncertain > 0, "기사일 이전 관계가 제외 수로 보고되어야 함");
  assert.ok(a.excludedAbout > 0, "'~에 관한' 관계가 제외 수로 보고되어야 함");
});
test("실제 데이터: strict earliest-arrival이 brute-force와 일치하고 모든 경로가 시간 순행", () => {
  const cs = analysisContacts(idx, W, "strict").contacts;
  const nodes = [...new Set(cs.flatMap((c) => [c.source, c.target]))];
  const adj = buildAdjacency(cs);
  for (const s of nodes) {
    const { arrival } = earliestArrival(adj, [s], W.from, W.to, "strict");
    const bf = new Map([[s, W.from]]);
    let changed = true;
    while (changed) {
      changed = false;
      for (const a of toArcs(cs)) {
        const au = bf.get(a.u), c = a.contact;
        if (au === undefined) continue;
        let t = null;
        if (c.timeKind === "duration") { if (c.tMax >= au) t = c.tMin > au ? c.tMin : au; }
        else if (c.tMin >= au) t = c.tMax;
        if (t !== null && t <= W.to && (!bf.has(a.v) || t < bf.get(a.v))) { bf.set(a.v, t); changed = true; }
      }
    }
    for (const v of nodes) {
      if (v === s) continue;
      assert.equal(arrival.get(v), bf.get(v), `${s}→${v}`);
      if (arrival.has(v)) {
        const p = temporalPath(cs, [s], v, W.from, W.to, "strict");
        assert.ok(isTimeRespecting(p.steps, W.from, "strict"), `${s}→${v} 경로가 시간 역행`);
        assert.ok(["EXACT", "PARTIAL_ORDER"].includes(p.flag), `${s}→${v} strict 경로가 ${p.flag}`);
      }
    }
  }
});
test("실제 데이터: 피드백 루프는 시간 순행이며 strict에서 UNCERTAIN이 없음", () => {
  const cs = analysisContacts(idx, W, "strict").contacts;
  const loops = feedbackLoops(cs, "JO_SEJONG", W.from, W.to, "strict");
  assert.ok(loops.length > 0, "세종 기준 루프가 하나도 없음");
  for (const l of loops) {
    assert.ok(isTimeRespecting(l.steps, W.from, "strict"));
    assert.notEqual(l.flag, "UNCERTAIN");
  }
});
test("실제 데이터: layer / level / theater 필터", () => {
  const all = filterContacts(idx, W).length;
  const rep = filterContacts(idx, { ...W, layers: new Set(["REPORT"]) }).length;
  assert.ok(rep > 0 && rep < all);
  const lv = filterContacts(idx, { ...W, levels: new Set(["L0", "L1"]) });
  assert.ok(lv.length > 0 && lv.every((c) => ["L0", "L1"].includes(idx.levelAt(c.source, c.anchor))));
  const du = filterContacts(idx, { ...W, theaters: new Set(["DUMAN"]) });
  assert.ok(du.length > 0 && du.every((c) => c.theater.includes("DUMAN")));
});
test("실제 데이터: trajectory — 기간 반영, 미수록 연도(1444)는 0이 아니라 null", () => {
  const a = yearlyTrajectories(idx, W, ["JO_SEJONG"]);
  const b = yearlyTrajectories(idx, { from: "1433-00-00", to: "1434-99-99" }, ["JO_SEJONG"]);
  assert.deepEqual(b.years, [1433, 1434]);
  assert.ok(a.years.length > b.years.length);
  const i44 = a.years.indexOf(1444);
  assert.ok(i44 >= 0 && a.series.JO_SEJONG.degree[i44] === null && a.coverage[i44] === "NOT_COVERED");
});
test("실제 데이터: level은 pack 증언만 사용(legacy 증언 무시)", () => {
  // 이각: pack 1433-04-10 L4, legacy 1435-06-13 L3(v2) → 1436에도 L4
  assert.equal(idx.levelAt("JO_LEEGAK", "1436-01-01"), "L4");
  // 증언 이전 시점은 기본 level
  assert.equal(idx.levelAt("JO_KIMJONGSEO", "1436-11-01"), idx.peopleById.JO_KIMJONGSEO.defaultLevel);
});

console.log(`\n${passed} passed${process.exitCode ? ", FAILURES above" : ""}`);
