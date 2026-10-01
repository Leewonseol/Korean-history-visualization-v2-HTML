#!/usr/bin/env node
/* ==========================================================================
   Semantic golden test — node tools/golden.mjs
   tests/golden/fixtures.mjs의 '원문 → 기대 그래프 표현'이 현재 데이터·코드에서 그대로 재현되는지 검사한다.
   원문 quote는 research/pack_v1/source_pack_v1.txt의 해당 줄과 글자 그대로 일치해야 한다.
   ========================================================================== */
import assert from "node:assert/strict";
import { DATA } from "../src/data/index.js";
import { buildIndexes } from "../src/model/indexes.js";
import { filterContacts, analysisContacts } from "../src/model/temporalNetwork.js";
import { toArcs } from "../src/model/deriveEdges.js";
import { temporalPath } from "../src/analysis/temporalPaths.js";
import { computeMetrics } from "../src/analysis/centrality.js";
import { GOLDEN } from "../tests/golden/fixtures.mjs";
import { loadPack, resolveLocator } from "./pack-v1.mjs";

const idx = buildIndexes(DATA);
const pack = loadPack();
const W = { from: "1432-00-00", to: "1449-99-99" };
const C = Object.fromEntries(idx.contacts.map((c) => [c.id, c]));
const trace = (id) => idx.traceById[id];
const pick = (c, keys) => Object.fromEntries(keys.map((k) => [k, k === "traceRules" ? (trace(c.id) ? trace(c.id).rules : null) : c[k]]));

let passed = 0;
for (const g of GOLDEN) {
  try {
    if (g.input.pack) assert.equal(resolveLocator(pack, g.input.pack.locator), g.input.pack.quote, "입력 quote가 pack 원문과 다름");
    const e = g.expected;
    if (g.kind === "contact") {
      const c = C[g.relationId];
      assert.ok(c, `관계 ${g.relationId} 없음`);
      const keys = Object.keys(e).filter((k) => !["inCertainOrderAnalysis", "inDisplay"].includes(k));
      assert.deepEqual(pick(c, keys), Object.fromEntries(keys.map((k) => [k, e[k]])));
      if ("inCertainOrderAnalysis" in e) assert.equal(analysisContacts(idx, W, "CERTAIN_ORDER").contacts.some((x) => x.id === c.id), e.inCertainOrderAnalysis);
      if ("inDisplay" in e) assert.equal(filterContacts(idx, W).some((x) => x.id === c.id), e.inDisplay);
    } else if (g.kind === "contacts") {
      const cs = idx.contacts.filter((c) => c.eventId === g.eventId && Object.entries(g.where).every(([k, v]) => c[k] === v));
      assert.equal(cs.length, e.count);
      for (const c of cs) assert.deepEqual(pick(c, Object.keys(e.each)), e.each, c.id);
      if (e.directionEvidence) assert.ok(cs.every((c) => c.directionEvidence));
      assert.equal(toArcs(cs).length, cs.length * e.arcsPerContact);
    } else if (g.kind === "identity") {
      const c = C[g.relationId];
      assert.equal(c.target, e.target);
      assert.equal(idx.identityOf[e.target].status, e.identityStatus);
      assert.deepEqual(idx.peopleById[e.target].possibleSameAs, e.possibleSameAs);
      const base = e.baseNotInYear;
      const years = [...(idx.eventsByPerson[base.personId] || []), ...(idx.mentionsByPerson[base.personId] || [])].map((id) => idx.sortDateOf(idx.eventsById[id]).slice(0, 4));
      assert.ok(!years.includes(base.year), `${base.personId}가 ${base.year} 사건에 병합됨`);
    } else if (g.kind === "link") {
      const l = idx.eventsById[g.eventId].eventLinks.find((x) => x.eventId === g.linkTo);
      assert.ok(l, "사건 연결 없음");
      assert.equal(l.linkType, e.linkType); assert.equal(l.causalStatus, e.causalStatus);
      if (e.evidenceLocator) { assert.equal(l.causalEvidence.locator, e.evidenceLocator); assert.equal(resolveLocator(pack, l.causalEvidence.locator), l.causalEvidence.quote); }
      if (e.notCausal) assert.ok(!["EXPLICIT_CAUSAL"].includes(l.causalStatus) && l.linkType !== "causal");
    } else if (g.kind === "excluded") {
      const c = C[g.relationId];
      assert.equal(c.evidenceClass, e.evidenceClass);
      assert.equal(filterContacts(idx, W).some((x) => x.id === c.id), e.inDefault);
      if ("inWithLegacy" in e) assert.equal(filterContacts(idx, { ...W, includeLegacy: true }).some((x) => x.id === c.id), e.inWithLegacy);
      if ("inWithInterpretation" in e) assert.equal(filterContacts(idx, { ...W, includeInterpretation: true }).some((x) => x.id === c.id), e.inWithInterpretation);
      if (e.metricsThrowsWithoutScope) assert.throws(() => computeMetrics([c], W), /interpretation mode/);
    } else if (g.kind === "path") {
      const a = analysisContacts(idx, W, g.mode);
      const p = temporalPath(a.contacts, [g.from], g.to, W.from, W.to, g.mode, a.scope);
      if ("result" in e) assert.equal(p, e.result);
      if (e.reverseExists) assert.ok(temporalPath(a.contacts, [g.to], g.from, W.from, W.to, g.mode, a.scope), "반대 방향 경로가 있어야 함");
      if ("certainOrderResult" in e) {
        const s = analysisContacts(idx, W, "CERTAIN_ORDER");
        assert.equal(temporalPath(s.contacts, [g.from], g.to, W.from, W.to, "CERTAIN_ORDER", s.scope), e.certainOrderResult);
      }
      if (e.flag) { assert.ok(p, "경로 없음"); assert.equal(p.flag, e.flag); }
      if (e.firstStepContact) assert.equal(p.steps[0].contact.id, e.firstStepContact);
    } else throw new Error(`unknown kind ${g.kind}`);
    passed++; console.log(`ok   ${g.id} ${g.case}`);
  } catch (err) { console.log(`FAIL ${g.id} ${g.case}\n      ${err.message.split("\n").slice(0, 6).join("\n      ")}`); process.exitCode = 1; }
}
console.log(`\n${passed}/${GOLDEN.length} golden fixtures passed`);
