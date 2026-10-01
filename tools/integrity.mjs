#!/usr/bin/env node
/* ==========================================================================
   역사 무결성(historical integrity) 테스트 — node tools/integrity.mjs
   validateData()가 '형식'을 본다면, 여기서는 감사(research/audit_pre_fix.md)에서 정한
   역사 데이터 규칙을 데이터 전체에 대해 직접 확인한다. 기준을 완화하지 않는다.
   ========================================================================== */
import assert from "node:assert/strict";
import fs from "node:fs";
import { DATA } from "../src/data/index.js";
import { validateData, sourceUsage, PROJECT_YEARS } from "../src/model/validate.js";
import { buildIndexes } from "../src/model/indexes.js";
import { filterContacts, analysisContacts } from "../src/model/temporalNetwork.js";
import { evidenceScope, DEFAULT_SCOPE, assertScope, countByClass } from "../src/model/evidence.js";
import { computeMetrics } from "../src/analysis/centrality.js";
import { temporalPath, feedbackLoops } from "../src/analysis/temporalPaths.js";
import { yearlyTrajectories } from "../src/analysis/trajectories.js";
import { missingnessReport } from "../src/analysis/missingness.js";
import { mergeSensitivity, pathIdentityAssumptions } from "../src/analysis/identitySensitivity.js";
import { NORMALIZATION_RULES, packLabelsOf, labelLayerCheck, evidenceClassOf } from "../src/data/vocab.js";
import { loadPack, resolveLocator } from "./pack-v1.mjs";
import { generateAudit3 } from "./audit-round3.mjs";
import { resultCaveats } from "../src/analysis/caveats.js";
import { PROVENANCE, DERIVATION_RULES, DIRECTION_POLICY, CAUSAL_STATUS, evidenceStatusOf, NARRATIVE_STATUS } from "../src/data/vocab.js";
import { isDayPrecise, yearOf } from "../src/model/dates.js";
import { generateResearch } from "./research-gen.mjs";

let passed = 0;
const test = (name, fn) => { try { fn(); passed++; console.log("ok  ", name); } catch (e) { console.log("FAIL", name, "\n     ", e.message.split("\n").slice(0, 8).join("\n      ")); process.exitCode = 1; } };
const idx = buildIndexes(DATA);
const SRC = Object.fromEntries(DATA.SOURCES.map((s) => [s.id, s]));
const isPack = (s) => SRC[s] && SRC[s].verification === "pack_v1";
const rels = DATA.EVENTS.flatMap((e) => (e.relations || []).map((r, i) => ({ e, r, id: `${e.id}#${i}` })));
const fail = (list, msg) => assert.equal(list.length, 0, `${msg}: ${list.slice(0, 10).join(", ")}${list.length > 10 ? ` … (+${list.length - 10})` : ""}`);
const W = { from: "1432-00-00", to: "1449-99-99" };

/* ---------- A. provenance ---------- */
test("A1 모든 사건·관계·인물·증언·스토리 문장에 알려진 provenance(unknown 금지)", () => {
  const bad = [];
  DATA.EVENTS.forEach((e) => (!PROVENANCE[e.provenance] || e.provenance === "unknown_provenance") && bad.push(e.id));
  rels.forEach(({ r, id }) => (!PROVENANCE[r.provenance] || r.provenance === "unknown_provenance") && bad.push(id));
  DATA.PEOPLE.forEach((p) => !PROVENANCE[p.provenance] && bad.push(p.personId));
  DATA.PERSON_ATTESTATIONS.forEach((a) => !PROVENANCE[a.provenance] && bad.push(a.id));
  DATA.STORY_SCENES.forEach((s) => s.statements.forEach((st, i) => !PROVENANCE[st.provenance] && bad.push(`${s.id}.${i}`)));
  fail(bad, "provenance 없음/불명");
});
test("A2 pack 관계는 pack v1 사료를 인용하고, legacy 사건 안에는 pack 관계가 없다(v2 관계의 pack 오표기 금지)", () => {
  const bad = rels.filter(({ e, r }) => {
    const g = evidenceStatusOf(r.provenance), src = r.sourceIds && r.sourceIds.length ? r.sourceIds : e.sourceIds;
    return g === "verified" && (!src.some(isPack) || evidenceStatusOf(e.provenance) !== "verified");
  }).map((x) => x.id);
  fail(bad, "pack 오표기");
});
test("A3 pack_v1_derived는 등록된 정규화 규칙(R1~R7)만 사용", () => {
  fail(rels.filter(({ r }) => r.provenance === "pack_v1_derived" && !DERIVATION_RULES[r.derivationRule]).map((x) => x.id), "규칙 없는 derived");
});
test("A4 해석 관계는 provenance·certainty 모두 interpretation으로 표시(확정 사실로 위장 금지)", () => {
  fail(rels.filter(({ r }) => (r.provenance === "interpretation") !== (r.certainty === "interpretation")).map((x) => x.id), "해석 표기 불일치");
});
test("A5 v2(legacy) 전용 사료만 인용하는 관계는 legacy", () => {
  fail(rels.filter(({ e, r }) => {
    const src = r.sourceIds && r.sourceIds.length ? r.sourceIds : e.sourceIds;
    return src.every((s) => !isPack(s)) && evidenceStatusOf(r.provenance) !== "legacy";
  }).map((x) => x.id), "legacy 사료인데 legacy 아님");
});

/* ---------- H. 관계 근거 필드 ---------- */
test("H1 모든 관계: sourceIds·evidenceStatus·provenance·certainty·causalStatus 보유 (사료 없는 관계 0)", () => {
  const bad = idx.contacts.filter((c) => !c.sourceIds.length || !c.evidenceStatus || c.evidenceStatus === "unknown" || !c.provenance || !c.certainty || !CAUSAL_STATUS[c.causalStatus]);
  fail(bad.map((c) => c.id), "근거 필드 누락");
});
test("H2 시간 선후를 인과로 바꾸지 않음: EXPLICIT_CAUSAL·PROCEDURAL_SEQUENCE는 검증 근거+원문 근거 필요, causal 링크는 EXPLICIT_CAUSAL만, causedBy 폐기", () => {
  const bad = [];
  idx.contacts.forEach((c) => {
    if (c.causalStatus !== "UNKNOWN" && c.evidenceStatus !== "verified") bad.push(`${c.id}(비검증 ${c.causalStatus})`);
    if (["EXPLICIT_CAUSAL", "PROCEDURAL_SEQUENCE"].includes(c.causalStatus) && !c.causalEvidence) bad.push(`${c.id}(근거 없음)`);
    if (c.layer === "COMMAND" && c.causalStatus === "EXPLICIT_CAUSAL") bad.push(`${c.id}(명령 관계를 인과로)`);
  });
  DATA.EVENTS.forEach((e) => {
    if ("causedBy" in e) bad.push(`${e.id}.causedBy`);
    (e.eventLinks || []).forEach((l) => {
      const t = `${e.id}->${l.eventId}`;
      if (l.linkType === "causal" && l.causalStatus !== "EXPLICIT_CAUSAL") bad.push(t);
      if (l.linkType !== "causal" && l.causalStatus === "EXPLICIT_CAUSAL") bad.push(t);
      if (l.causalStatus !== "UNKNOWN" && evidenceStatusOf(l.provenance) !== "verified") bad.push(`${t}(legacy 인과)`);
      if (["EXPLICIT_CAUSAL", "PROCEDURAL_SEQUENCE"].includes(l.causalStatus) && !l.causalEvidence) bad.push(`${t}(근거 없음)`);
    });
  });
  fail(bad, "선후→인과");
});

/* ---------- B. 방향 정책 ---------- */
test("B1 layer별 방향 정책: directed layer에 undirected 없음, declared layer의 undirected는 pack 근거 보유", () => {
  const bad = idx.contacts.filter((c) => c.direction === "undirected" &&
    (DIRECTION_POLICY[c.layer] !== "declared" || !c.directionEvidence || c.evidenceStatus !== "verified"));
  fail(bad.map((c) => c.id), "방향 정책 위반");
});

/* ---------- C. 날짜 정밀도 ---------- */
test("C1 가짜 정밀도 금지: YEAR/MONTH 사건은 경계 표기, exact 관계는 일 단위 날짜뿐", () => {
  const bad = [];
  DATA.EVENTS.forEach((e) => {
    if (e.datePrecision === "YEAR" && !(/-00-00$/.test(e.dateMin) && /-99-99$/.test(e.dateMax))) bad.push(e.id);
    if (e.datePrecision === "MONTH" && !(/-00$/.test(e.dateMin) && /-99$/.test(e.dateMax))) bad.push(e.id);
    if (e.datePrecision === "DAY" && !(isDayPrecise(e.dateMin) && isDayPrecise(e.dateMax))) bad.push(e.id);
  });
  idx.contacts.forEach((c) => c.exact && !isDayPrecise(c.tMin) && bad.push(c.id));
  fail(bad, "정밀도 위반");
});
test("C2 '기사일 이전' 사건: 현장 행위를 기사일로 확정하지 않음(기사일 확정 관계는 조정 접수 보고·전달만)", () => {
  const COURT = new Set(["JO_SEJONG", "ORG_JOSEON_COURT"]);
  const bad = idx.contacts.filter((c) => idx.eventsById[c.eventId].dateBasis === "before_record_date" && c.exact &&
    !(COURT.has(c.target) && ["REPORT", "DIPLOMACY"].includes(c.layer) && c.tMin === idx.eventsById[c.eventId].recordDate));
  fail(bad.map((c) => c.id), "현장 행위에 기사일 정밀도");
});
test("C3 기본 분석 데이터셋은 시각이 확정된(CERTAIN_ORDER) DIRECT+NORMALIZED 관계만 — 연·월·미상 관계에 순서를 매기지 않음", () => {
  const a = analysisContacts(idx, W, "CERTAIN_ORDER");
  fail(a.contacts.filter((c) => c.tMin === null || c.tMax === null || !["DIRECT", "NORMALIZED"].includes(c.evidenceClass) || !c.pathEligible).map((c) => c.id), "CERTAIN_ORDER 입력 위반");
});

/* ---------- D. coverage ---------- */
test("D1 coverage 레지스트리가 1432~1449 전 연도를 덮고 1444는 NOT_COVERED", () => {
  assert.deepEqual(DATA.COVERAGE.map((c) => c.year), PROJECT_YEARS);
  const c44 = DATA.COVERAGE.find((c) => c.year === 1444);
  assert.equal(c44.coverageStatus, "NOT_COVERED");
  assert.equal(c44.sourceIds.length, 0);
  assert.match(c44.note, /뜻이 아님/);
});
test("D2 NOT_COVERED 연도에 검증 사건 없음, 검증 사건이 있는 연도는 VERIFIED_WITH_EVENTS/PARTIAL", () => {
  const bad = [];
  for (const e of DATA.EVENTS) {
    const y = yearOf(idx.sortDateOf(e)), c = idx.coverageByYear[y];
    if (evidenceStatusOf(e.provenance) === "verified" && !["VERIFIED_WITH_EVENTS", "PARTIAL"].includes(c.coverageStatus)) bad.push(e.id);
  }
  fail(bad, "coverage 불일치");
});
test("D3 UI·생성 문서 어디에도 '사건 없음'을 사실로 표시하지 않음(부정문 안내만 허용)", () => {
  const files = ["src/app.js", "index.html", ...fs.readdirSync("src/ui").map((f) => `src/ui/${f}`)];
  const bad = [];
  for (const f of files) fs.readFileSync(f, "utf8").split("\n").forEach((line, i) => {
    const code = line.replace(/\/\*.*?\*\/|\/\/.*$|^\s*\*.*$|^\s*-\s.*$/g, "");
    if (/사건\s*없음|사건이\s*없(습니다|음|다)/.test(code) && !/아님|아니/.test(code)) bad.push(`${f}:${i + 1}`);
  });
  const gen = generateResearch(DATA);
  for (const [k, body] of Object.entries(gen["chronology_1432_1449.md"])) {
    if (/사건\s*없음/.test(body) && !/아님/.test(body)) bad.push(`chronology ${k}`);
  }
  fail(bad, "'사건 없음' 표기");
});
test("D4 연구 문서 생성기가 연도마다 coverageStatus를 레지스트리에서 출력", () => {
  const gen = generateResearch(DATA)["chronology_1432_1449.md"];
  for (const c of DATA.COVERAGE) {
    assert.ok(gen[`Y${c.year}`].includes(`Coverage: \`${c.coverageStatus}\``), `${c.year} coverage 미출력`);
    assert.ok(gen[`Y${c.year}`].includes("Sources:") && gen[`Y${c.year}`].includes("Note:"), `${c.year} Sources/Note 미출력`);
  }
  assert.ok(gen.Y1444.includes("NOT_COVERED") && gen.Y1444.includes("미조사/미수록"));
});

/* ---------- E. 사료 상태 ---------- */
test("E1 모든 사료에 사용 상태가 있고, 내용 미확인(not_accessed) 사료는 어디에도 근거로 쓰이지 않음", () => {
  const u = sourceUsage(DATA);
  assert.equal(Object.keys(u).length, DATA.SOURCES.length);
  const na = new Set(DATA.SOURCES.filter((s) => s.verification === "not_accessed").map((s) => s.id));
  const used = [
    ...DATA.EVENTS.flatMap((e) => [...e.sourceIds, ...(e.relatedSourceIds || []), ...(e.relations || []).flatMap((r) => r.sourceIds || [])]),
    ...DATA.PERSON_ATTESTATIONS.flatMap((a) => a.sourceIds), ...DATA.STORY_SCENES.flatMap((s) => s.statements.flatMap((x) => x.sourceIds)),
    ...DATA.COVERAGE.flatMap((c) => [...c.sourceIds, ...c.geographySourceIds]), ...DATA.PLACES.flatMap((p) => [...(p.sourceIds || []), ...((p.parentBasis && p.parentBasis.sourceIds) || [])])
  ].filter((s) => na.has(s));
  fail(used, "not_accessed 사료 사용");
});
test("E2 경고를 숨기지 않음: 『서정록』 원문은 REGISTERED_UNCHECKED 경고, 백과 서지는 BIBLIOGRAPHIC_ONLY 안내", () => {
  const r = validateData(DATA);
  assert.equal(r.sourceUsage.SRC_SEOJEONGNOK.status, "REGISTERED_UNCHECKED");
  assert.ok(r.warnings.some((w) => w.includes("SRC_SEOJEONGNOK") && w.includes("REGISTERED_UNCHECKED")));
  assert.equal(r.sourceUsage.SRC_ENCY_SEOJEONGNOK.status, "BIBLIOGRAPHIC_ONLY");
  assert.ok(r.notices.some((n) => n.includes("SRC_ENCY_SEOJEONGNOK")));
  const legacy = DATA.SOURCES.filter((s) => s.verification === "inherited_v2");
  assert.ok(legacy.every((s) => r.sourceUsage[s.id].status === "LEGACY"));
});

/* ---------- F. 동일성 ---------- */
test("F1 이름 표기 근거와 동일성 분리: 한자는 pack 인명록 표기만, 편집자 한자 없음", () => {
  const bad = DATA.PEOPLE.filter((p) => p.hanja && !(p.nameFormVerified && p.nameFormSource === "pack_v1_authority")).map((p) => p.personId);
  fail(bad, "근거 없는 한자");
  const editorial = ["世宗", "崔士康", "盧閈", "申商", "宣德帝", "忽剌溫", "兀良哈", "議政府", "六曹", "兵曹", "禮曹", "司憲府", "江界府", "慈城郡", "三軍都鎭撫"];
  fail(DATA.PEOPLE.filter((p) => editorial.includes(p.hanja)).map((p) => p.personId), "편집자 한자 잔존");
  fail(DATA.PEOPLE.filter((p) => "hanjaVerified" in p).map((p) => p.personId), "폐기 필드 hanjaVerified");
});
test("F2 동명이인 미해결 노드는 자동 병합되지 않음(홍사석 1437 · 김효성 1443 · 이진 1437)", () => {
  const pairs = [["JO_HONGSASEOK", "JO_HONGSASEOK_1437", "1437"], ["JO_KIMHYOSEONG", "JO_KIMHYOSEONG_1443", "1443"], ["JO_LEEJIN", "JO_LEEJIN_1437", "1437"]];
  for (const [base, split, year] of pairs) {
    assert.equal(idx.identityOf[split].status, "UNRESOLVED_DISTINCT", split);
    assert.ok(idx.peopleById[base].possibleSameAs.includes(split) && idx.peopleById[split].possibleSameAs.includes(base), `${base}↔${split} 상호 선언`);
    const appear = (p) => [...(idx.eventsByPerson[p] || []), ...(idx.mentionsByPerson[p] || [])];   // 참여 + 언급
    const baseYears = appear(base).map((e) => idx.sortDateOf(idx.eventsById[e]).slice(0, 4));
    assert.ok(!baseYears.includes(year), `${base}가 ${year} 사건에 남아 있음(병합)`);
    assert.ok(appear(split).length > 0, `${split} 등장 없음`);
    assert.ok(!idx.contacts.some((c) => (c.source === base && c.target === split) || (c.source === split && c.target === base)), "동일성 가설을 관계로 만들지 않음");
  }
});
test("F3 자동 병합 시도를 검증기가 거부: 같은 이름 노드를 선언 없이 만들면 오류", () => {
  const bad = structuredClone(DATA);
  const p = bad.PEOPLE.find((x) => x.personId === "JO_HONGSASEOK_1437");
  p.canonicalName = "홍사석"; p.possibleSameAs = []; p.identityStatus = null;
  bad.PEOPLE.find((x) => x.personId === "JO_HONGSASEOK").possibleSameAs = [];
  assert.ok(validateData(bad).errors.some((e) => e.includes("중복 의심") && e.includes("JO_HONGSASEOK_1437")));
  const bad2 = structuredClone(DATA);
  bad2.PEOPLE.find((x) => x.personId === "JO_KIMHYOSEONG_1443").possibleSameAs = [];
  assert.ok(validateData(bad2).errors.some((e) => e.includes("UNRESOLVED_DISTINCT인데 possibleSameAs 없음") || e.includes("상호 선언")));
});
test("F4 동일성 상태: 모든 노드에 identityStatus(선언 또는 계산), 집단·기관은 COLLECTIVE_OR_OFFICE", () => {
  const bad = DATA.PEOPLE.filter((p) => !idx.identityOf[p.personId] || (p.entityType !== "person" && idx.identityOf[p.personId].status !== "COLLECTIVE_OR_OFFICE"));
  fail(bad.map((p) => p.personId), "identityStatus");
});

/* ---------- G. 장소 ---------- */
test("G1 좌표 없음(coordinateStatus로 구분), 장소 한자 없음, 상위 장소는 pack 근거가 있을 때만", () => {
  const bad = [];
  for (const p of DATA.PLACES) {
    if (p.coordinate) bad.push(`${p.placeId}.coordinate`);
    if (!["pack_no_coordinate", "estimated_not_allowed", "historically_uncertain"].includes(p.coordinateStatus)) bad.push(`${p.placeId}.coordinateStatus`);
    if (p.hanja) bad.push(`${p.placeId}.hanja`);
    if (p.parentPlaceId && !(p.parentBasis && p.parentBasis.sourceIds.length && p.parentBasis.sourceIds.every(isPack))) bad.push(`${p.placeId}.parent`);
  }
  fail(bad, "장소 규칙");
});
test("G2 근거 없는 PL_PAJEOGANG 상위 관계 3건 제거", () => {
  fail(DATA.PLACES.filter((p) => p.parentPlaceId === "PL_PAJEOGANG").map((p) => p.placeId), "PL_PAJEOGANG 하위");
  assert.deepEqual(DATA.PLACES.filter((p) => p.parentPlaceId).map((p) => p.placeId).sort(), ["PL_HOERYEONG", "PL_SAMSU", "PL_SEOKBO"]);
});

/* ---------- I. 스토리 ---------- */
test("I1 모든 스토리 문장: eventIds·sourceIds·narrativeStatus, 검증 문장은 검증 사건·pack 사료만", () => {
  const bad = [];
  DATA.STORY_SCENES.forEach((s) => s.statements.forEach((st, i) => {
    const t = `${s.id}.${i}`;
    if (!st.eventIds.length || !st.sourceIds.length || !NARRATIVE_STATUS[st.narrativeStatus]) bad.push(t);
    if (evidenceStatusOf(st.provenance) === "verified" &&
      (st.eventIds.some((e) => evidenceStatusOf(idx.eventsById[e].provenance) !== "verified") || !st.sourceIds.every(isPack))) bad.push(t);
  }));
  DATA.STORY_SCENES.forEach((s) => "narration" in s && bad.push(`${s.id}.narration`));
  fail(bad, "스토리 근거");
});

/* ---------- 역사 서술 주의사항 ---------- */
test("K1 기본 데이터셋은 pack v1 검증 관계만(legacy·해석은 토글로만)", () => {
  fail(filterContacts(idx, W).filter((c) => c.evidenceStatus !== "verified").map((c) => c.id), "기본 표시에 비검증");
});
test("K2 이만주 측 반박 주장은 확정 사실이 아님(COUNTER_CLAIM은 contemporary_claim/disputed)", () => {
  fail(idx.contacts.filter((c) => c.layer === "COUNTER_CLAIM" && !["contemporary_claim", "disputed"].includes(c.certainty)).map((c) => c.id), "주장→사실");
});
test("K3 여진 집단 병합·종속 금지: 이만주→다른 여진 세력 COMMAND 관계 없음, 홀라온·오량합·우디거는 별개 노드", () => {
  const other = new Set(DATA.PEOPLE.filter((p) => ["JIANZHOU_LEFT", "PAJEOGANG_OTHER", "HOLLAON", "ORYANGHAP", "UDIGE", "ODORI"].includes(p.affiliation)).map((p) => p.personId));
  fail(idx.contacts.filter((c) => c.source === "JZ_MANJU" && c.layer === "COMMAND" && other.has(c.target)).map((c) => c.id), "이만주 종속 관계");
  const affs = ["GRP_HOLLAON", "GRP_ORYANGHAP_1435", "GRP_1443_UDIGE"].map((id) => idx.peopleById[id].affiliation);
  assert.equal(new Set(affs).size, 3);
});
test("K4 조선 측 전과·피해 수치는 '조선 측 보고'로 표시", () => {
  const bad = [];
  DATA.EVENTS.forEach((e) => (e.outcomes || []).forEach((o, i) => {
    if (["killed", "wounded", "captured"].includes(o.type) && o.quantity != null && !o.reportedBy && evidenceStatusOf(e.provenance) === "verified") bad.push(`${e.id}.outcome${i}`);
  }));
  fail(bad, "보고 주체 없는 수치");
});
test("K5 관직·역할은 증언(attestation)으로만 — 종료일 역산 없음, legacy 증언은 level 계산 제외", () => {
  fail(DATA.PERSON_ATTESTATIONS.filter((a) => "endDate" in a || "startDate" in a).map((a) => a.id), "구간 상태");
  for (const a of DATA.PERSON_ATTESTATIONS.filter((x) => evidenceStatusOf(x.provenance) !== "verified")) {
    const at = idx.attestationAt(a.personId, a.attestedDate);
    assert.ok(!at || at.id !== a.id, `${a.id} legacy 증언이 level 계산에 쓰임`);
  }
});
test("K6 주인공을 데이터·알고리즘으로 지정하지 않음", () => {
  fail(DATA.PEOPLE.filter((p) => ["protagonist", "isMain", "rank", "importance"].some((k) => k in p)).map((p) => p.personId), "주인공 필드");
});

/* ---------- T. 원문 추적(trace) — 정규화 관계 감사 가능성 ---------- */
const pack = loadPack();
const quoteOk = (ev) => ev && resolveLocator(pack, ev.locator) === ev.quote;
test("T1 모든 trace·구성원·보조 근거·인과 근거·동일성 근거의 quote가 pack 원문 해당 줄과 글자 그대로 일치", () => {
  const bad = [];
  for (const t of DATA.RELATION_TRACES) {
    if (!quoteOk(t)) bad.push(`${t.relationId}:${t.locator}`);
    [...t.members, ...t.support].forEach((m) => quoteOk(m) || bad.push(`${t.relationId}:${m.locator}`));
  }
  for (const c of idx.contacts) if (c.causalEvidence && !quoteOk(c.causalEvidence)) bad.push(`${c.id}:causal`);
  DATA.EVENTS.forEach((e) => (e.eventLinks || []).forEach((l) => l.causalEvidence && !quoteOk(l.causalEvidence) && bad.push(`${e.id}->${l.eventId}:causal`)));
  DATA.PEOPLE.forEach((p) => (p.identityEvidence || []).forEach((x) => quoteOk(x) || bad.push(`${p.personId}:identity`)));
  fail(bad, "원문과 다른 quote");
});
test("T2 DIRECT·NORMALIZED 관계는 모두 trace가 있고, 등급이 trace의 규칙 유무와 일치(DIRECT = 규칙 없음)", () => {
  const tr = new Map(DATA.RELATION_TRACES.map((t) => [t.relationId, t]));
  const bad = [];
  rels.forEach(({ r, id }) => {
    const cls = evidenceClassOf(r.provenance);
    if (cls !== "DIRECT" && cls !== "NORMALIZED") return;
    const t = tr.get(id);
    if (!t) return bad.push(`${id}(trace 없음)`);
    if ((cls === "DIRECT") !== (t.rules.length === 0)) bad.push(`${id}(${cls} vs rules ${t.rules.join("+")})`);
    if (t.normalizedSubject !== r.source || t.normalizedObject !== r.target) bad.push(`${id}(endpoint)`);
  });
  fail(bad, "trace 불일치");
});
test("T3 R6: pack 라벨→layer 표 — 일대일이면 R6 없음, 일대일이 아니면 R6 필수, 표 밖 layer 금지", () => {
  const bad = [];
  for (const t of DATA.RELATION_TRACES) {
    if (!/:RELATIONS:L/.test(t.locator)) continue;
    const r = rels.find((x) => x.id === t.relationId).r;
    const chk = labelLayerCheck(packLabelsOf(t.quote), r.layer);
    if (!chk.ok || chk.oneToOne === t.rules.includes("R6_layer_normalize")) bad.push(`${t.relationId}(${r.layer} / ${packLabelsOf(t.quote).join("/")})`);
  }
  fail(bad, "R6 위반");
});
test("T4 규칙 formal spec 준수: R1 금지 사례(정치체 '조선/Joseon/state' → 세종, 주체 'court' → 세종) 없음, R2는 'via', R3는 구성원 근거, R7은 관계 규칙으로 쓰지 않음", () => {
  const bad = [];
  for (const t of DATA.RELATION_TRACES) {
    if (t.normalizedObject === "JO_SEJONG" && /^(조선|Joseon|state)$/.test(t.sourceObject)) bad.push(`${t.relationId}(정치체→세종)`);
    if (t.normalizedSubject === "JO_SEJONG" && /^(court|central|state|Joseon|조선|central government)$/.test(t.sourceSubject)) bad.push(`${t.relationId}(주체 court→세종)`);
    if (t.objectRule === "R1_court_recipient" && !/court|central|Ming|미기재/.test(t.sourceObject)) bad.push(`${t.relationId}(R1 입력 패턴 밖: ${t.sourceObject})`);
    if (t.rules.includes("R2_carrier_split") && !/via/.test(t.quote)) bad.push(`${t.relationId}(R2 'via' 없음)`);
    if (t.rules.includes("R3_who_expansion") && !t.members.length) bad.push(`${t.relationId}(R3 구성원 근거 없음)`);
    if (t.rules.includes("R7_report_on_record")) bad.push(`${t.relationId}(R7은 시각 규칙)`);
    t.rules.forEach((x) => NORMALIZATION_RULES[x] || bad.push(`${t.relationId}(규칙 ${x})`));
  }
  fail(bad, "규칙 spec 위반");
});
test("T5 인물 한자는 pack 원문(인명록)에 '이름 한자' 형태로 실제로 존재", () => {
  fail(DATA.PEOPLE.filter((p) => p.hanja && !pack.text.includes(p.hanja)).map((p) => p.personId), "pack에 없는 한자");
});

/* ---------- EV. 근거 선택기 단일 소스 ---------- */
test("EV1 근거 필터 로직은 model/evidence.js에만 — UI·분석·연구 생성기에 자체 필터 없음", () => {
  const files = ["src/app.js", ...fs.readdirSync("src/ui").map((f) => `src/ui/${f}`), ...fs.readdirSync("src/analysis").map((f) => `src/analysis/${f}`),
    "src/model/temporalNetwork.js", "tools/research-gen.mjs"];
  const bad = [];
  for (const f of files) fs.readFileSync(f, "utf8").split("\n").forEach((line, i) => {
    if (/evidenceAllowed|\.evidenceStatus\s*===|evidenceStatusOf\(|provenance\s*===\s*"(inherited_v2|interpretation|pack_v1_direct|pack_v1_derived)"/.test(line)) bad.push(`${f}:${i + 1}`);
  });
  fail(bad, "중복 근거 필터");
});
test("EV2 INTERPRETATION은 기본 분석 경로에서 assert로 차단, 명시적 interpretation mode에서만 허용", () => {
  const withInterp = filterContacts(idx, { ...W, includeInterpretation: true, mode: "CERTAIN_ORDER", pathOnly: true });
  assert.ok(withInterp.some((c) => c.evidenceClass === "INTERPRETATION"), "해석 관계가 있어야 검사 가능");
  assert.throws(() => computeMetrics(withInterp, W), /interpretation mode/);
  assert.throws(() => temporalPath(withInterp, ["JO_SEJONG"], "JO_LEESUNMONG", W.from, W.to), /interpretation mode/);
  assert.throws(() => feedbackLoops(withInterp, "JO_SEJONG", W.from, W.to), /interpretation mode/);
  assert.throws(() => assertScope(withInterp, DEFAULT_SCOPE), /interpretation mode/);
  const scope = evidenceScope({ includeInterpretation: true });
  assert.doesNotThrow(() => computeMetrics(withInterp, W, { scope }));
  const legacy = filterContacts(idx, { ...W, includeLegacy: true, mode: "CERTAIN_ORDER", pathOnly: true });
  assert.throws(() => computeMetrics(legacy, W), /legacy/);
});
test("EV3 토글 OFF면 경로·지표·연도 집계·연구 문서 어디에도 legacy·해석이 들어가지 않음", () => {
  const a = analysisContacts(idx, W, "CERTAIN_ORDER");
  const c = countByClass(a.contacts);
  assert.equal(c.LEGACY + c.INTERPRETATION + c.UNKNOWN, 0);
  const traj = yearlyTrajectories(idx, W, ["JO_SEJONG"]);
  assert.ok(traj.years.length > 0);
  const gen = generateResearch(DATA);
  assert.ok(gen["methodology.md"].STATS.includes("기본 지표 입력"), "연구 문서가 기본 입력 근거를 밝혀야 함");
});

/* ---------- MS. missingness ---------- */
test("MS1 missingness 보고: 포함+제외가 화면 관계 수와 맞고, 등급·layer·인물별 분포가 계산됨", () => {
  const a = analysisContacts(idx, W, "CERTAIN_ORDER");
  const m = missingnessReport(a);
  assert.equal(m.included + m.excludedUncertain + m.excludedAbout, a.shown.length);
  const sum = (rows, k) => rows.reduce((x, r) => x + r[k], 0);
  for (const dim of ["byLayer", "byEvidenceClass", "byRelationType", "byTimeShape"]) {
    assert.equal(sum(m[dim], "included"), m.included, dim);
    assert.equal(sum(m[dim], "excluded"), m.excludedUncertain, dim);
  }
});

/* ---------- ID. 동일성 ---------- */
test("ID1 VERIFIED_SAME은 pack 근거가 있는 인물(세종·이천)뿐, 다른 다중 등장 인물은 PROBABLE_SAME(미해결)", () => {
  const vs = DATA.PEOPLE.filter((p) => idx.identityOf[p.personId].status === "VERIFIED_SAME").map((p) => p.personId).sort();
  assert.deepEqual(vs, ["JO_LEECHEON", "JO_SEJONG"]);
  const bad = DATA.PEOPLE.filter((p) => p.entityType === "person" && (idx.verifiedEvents[p.personId] || new Set()).size > 1
    && !["VERIFIED_SAME", "PROBABLE_SAME"].includes(idx.identityOf[p.personId].status)).map((p) => p.personId);
  fail(bad, "다중 등장 인물 동일성 상태");
});
test("ID2 병합 민감도: 미해결 노드를 쪼개면 끊기는 도달 쌍의 경로는 반드시 그 노드의 동일성 가정을 표시", () => {
  const a = analysisContacts(idx, W, "CERTAIN_ORDER");
  const ms = mergeSensitivity(idx, a.contacts, W, { scope: a.scope });
  assert.ok(ms.rows.length > 0, "다중 사건 PROBABLE_SAME 노드가 있어야 함");
  const bad = [];
  for (const r of ms.rows) for (const pair of r.lostExamples) {
    const [s, t] = pair.split(">");
    const p = temporalPath(a.contacts, [s], t, W.from, W.to, "CERTAIN_ORDER", a.scope);
    if (!p) { bad.push(`${pair}(경로 없음)`); continue; }
    const nodesOnPath = new Set(p.steps.slice(1).map((x) => x.from));
    if (nodesOnPath.has(r.id) && !pathIdentityAssumptions(idx, p.steps).some((x) => x.node === r.id)) bad.push(`${pair} via ${r.id}`);
  }
  fail(bad, "동일성 가정 미표시");
});

/* ---------- CV. coverage 범위 ---------- */
test("CV1 모든 연도에 scopeStatus(FULL/PARTIAL/NONE/UNKNOWN): 1432·1449 PARTIAL, 1444 NONE, 연도 문서에 부분 조사 경고", () => {
  const m = Object.fromEntries(DATA.COVERAGE.map((c) => [c.year, c.scopeStatus]));
  assert.equal(m[1432], "PARTIAL"); assert.equal(m[1449], "PARTIAL"); assert.equal(m[1444], "NONE");
  assert.ok(DATA.COVERAGE.every((c) => ["FULL", "PARTIAL", "NONE", "UNKNOWN"].includes(c.scopeStatus)));
  const gen = generateResearch(DATA)["chronology_1432_1449.md"];
  for (const c of DATA.COVERAGE) {
    assert.ok(gen[`Y${c.year}`].includes(`Scope: \`${c.scopeStatus}\``), `${c.year} scope 미출력`);
    if (c.scopeStatus === "PARTIAL") assert.ok(gen[`Y${c.year}`].includes("부분 조사"), `${c.year} 부분 조사 경고 없음`);
  }
  const yearly = generateResearch(DATA)["methodology.md"].YEARLY;
  assert.ok(yearly.includes("조사 범위가 완전하지 않") && yearly.includes("NA"));
});

/* ---------- WA. 예상된 경고 ---------- */
test("WA1 경고는 허용 목록과 정확히 일치(예상 밖 0, stale 0), 새 경고는 예상 밖으로 분류", () => {
  const r = validateData(DATA).warningReport;
  assert.equal(r.unexpected.length, 0, r.unexpected.map((w) => w.message).join("; "));
  assert.equal(r.stale.length, 0);
  assert.equal(r.expected.length, DATA.EXPECTED_WARNINGS.length);
  const bad = structuredClone(DATA);
  bad.PEOPLE.push({ ...bad.PEOPLE.find((p) => p.personId === "JO_HAYEON"), personId: "JO_TEST_UNUSED", canonicalName: "테스트 미사용" });
  const r2 = validateData(bad).warningReport;
  assert.ok(r2.unexpected.some((w) => w.key === "JO_TEST_UNUSED"));
  const bad2 = structuredClone(DATA);
  bad2.EXPECTED_WARNINGS = [...bad2.EXPECTED_WARNINGS, { code: "PERSON_UNUSED", key: "NOBODY", reason: "x" }];
  assert.equal(validateData(bad2).warningReport.stale.length, 1);
});

/* ---------- CL. 스토리 claim ---------- */
test("CL1 스토리 claim: 기본 범위에서 보이는 claim은 DIRECT/NORMALIZED뿐, NARRATIVE는 INTERPRETATION", () => {
  const claims = DATA.STORY_SCENES.flatMap((s) => s.statements.flatMap((st) => st.claims));
  assert.ok(claims.length > 0);
  const visible = claims.filter((c) => DEFAULT_SCOPE.classes.has(c.evidenceClass));
  assert.ok(visible.every((c) => ["DIRECT", "NORMALIZED"].includes(c.evidenceClass)));
  assert.ok(claims.filter((c) => c.claimType === "NARRATIVE").every((c) => c.evidenceClass === "INTERPRETATION"));
});

/* ---------- AU. 3차 감사 검토 문서 ---------- */
test("AU1 3차 감사 문서는 데이터에서 재생성한 내용과 같고(동기화), 판정 칸은 비어 있다(자동 판정 없음)", () => {
  const gen = generateAudit3(DATA);
  for (const [f, body] of Object.entries(gen)) assert.equal(fs.readFileSync(`research/audit3/${f}`, "utf8"), body, `${f}가 최신이 아님 — node tools/build-research.mjs`);
  const flagged = DATA.RELATION_TRACES.filter((t) => t.flags.length).length;
  assert.equal((gen["flagged_edges_review.md"].match(/^\*\*판정\*\* ☐ KEEP ☐ DOWNGRADE_TO_INTERPRETATION ☐ SPLIT ☐ REMOVE ☐ NEEDS_SOURCE/gm) || []).length, flagged);
  assert.ok(!/☑|☒|\[x\]/i.test(Object.values(gen).join("\n")), "판정이 자동으로 채워짐");
  const causal = idx.contacts.filter((c) => c.causalStatus === "EXPLICIT_CAUSAL").length + DATA.EVENTS.flatMap((e) => (e.eventLinks || []).filter((l) => l.causalStatus === "EXPLICIT_CAUSAL")).length;
  assert.equal((gen["explicit_causal_audit.md"].match(/^\| \d+ \| (관계|사건 연결) \|/gm) || []).length, causal);
  const probable = DATA.PEOPLE.filter((p) => idx.identityOf[p.personId].status === "PROBABLE_SAME").length;
  assert.equal((gen["probable_same_identity_audit.md"].match(/\| PROBABLE_SAME \|/g) || []).length, probable);
});
test("AU2 검토 라운드 동안 동일성 자동 승격 없음: 최윤덕·황보인 PROBABLE_SAME, VERIFIED_SAME은 세종·이천뿐", () => {
  assert.equal(idx.identityOf.JO_CHOEYUNDEOK.status, "PROBABLE_SAME");
  assert.equal(idx.identityOf.JO_HWANGBOIN.status, "PROBABLE_SAME");
});
test("AU3 결과 해석 경고: 동일성 미해결 수·시각 제외 수·규칙 파생 비중·불완전 연도를 함께 계산", () => {
  const a = analysisContacts(idx, W, "CERTAIN_ORDER");
  const c = resultCaveats(idx, a, W);
  assert.ok(c.unresolvedIdentity > 0 && c.temporallyExcluded === a.excludedUncertain);
  assert.ok(c.normalizedShare > 0 && c.normalizedShare <= 1);
  assert.deepEqual(c.incompleteYears.map((y) => `${y.year}:${y.scopeStatus}`), ["1432:PARTIAL", "1444:NONE", "1449:PARTIAL"]);
  assert.equal(c.legacyIncluded + c.interpretationIncluded, 0);
});

console.log(`\n${passed} passed${process.exitCode ? ", FAILURES above" : ""}`);
