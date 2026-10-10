#!/usr/bin/env node
/* Independent CSP regression tests. The historical source of truth is unchanged. */
import assert from "node:assert/strict";
import { DATA } from "../src/data/index.js";
import { CONTEXT_EVIDENCE, OPENING_SCENARIOS, LATENT_CONSTRUCTS } from "../src/data/openingContext.js";
import { enumerateOpeningWorlds, checkWorld } from "../src/analysis/openingWorlds.js";

const dec=enumerateOpeningWorlds("DEC_1432");
const jun=enumerateOpeningWorlds("JUN_1433");
assert.deepEqual([dec.allCount,dec.validCount,dec.excludedCount], [72,28,44]);
assert.deepEqual([jun.allCount,jun.validCount,jun.excludedCount], [54,24,30]);
assert.equal(dec.allCount,dec.validCount+dec.excludedCount);
assert.equal(jun.allCount,jun.validCount+jun.excludedCount);
assert.equal(new Set(dec.accepted.map(w=>w.id)).size,dec.validCount);
assert.equal(new Set(jun.accepted.map(w=>w.id)).size,jun.validCount);
assert.ok(dec.accepted.some(w=>w.choices.briefing==="jang" && w.assumptions.length>0));
assert.ok(jun.accepted.some(w=>w.choices.presenter==="plusjang" && w.assumptions.length>0));
assert.ok(jun.excluded.every(w=>w.errors.length>0));
assert.ok(jun.excluded.some(w=>w.choices.presenter==="jangonly"));
assert.ok(jun.accepted.every(w=>w.choices.presenter!=="jangonly" && w.choices.medicine!=="complete"));
assert.ok(dec.accepted.every(w=>w.choices.medicine!=="complete"));
assert.ok(dec.accepted.every(w=>w.choices.briefing==="none" ? w.choices.order==="standalone" : w.choices.order!=="standalone"));
assert.equal(checkWorld(OPENING_SCENARIOS[1],{
  presenter:"jangonly",order:"during",medicine:"silent",prince:"absent"
}).accepted,false);
assert.ok(jun.anchorEvidence.every(x=>CONTEXT_EVIDENCE.some(y=>y.id===x.id)));
assert.ok(CONTEXT_EVIDENCE.every(x=>x.source.startsWith("https://") && x.status && x.limit));
assert.ok(LATENT_CONSTRUCTS.every(x=>x.status==="HYPOTHESIS_ONLY"));
assert.ok(!DATA.EVENTS.some(ev=>CONTEXT_EVIDENCE.some(c=>c.id===ev.id)),
  "Context corpus must remain separate from canonical EVENTS");
assert.ok(!DATA.SOURCES.some(s=>CONTEXT_EVIDENCE.some(c=>c.id===s.id)),
  "Context corpus must remain separate from canonical SOURCES");
assert.equal(jun.probabilityEstimated,false);
assert.equal(dec.method,"FINITE_CONSTRAINT_SATISFACTION");
console.log("opening CSP tests: 1432 =",dec.allCount,dec.validCount,dec.excludedCount,
  "; 1433 =",jun.allCount,jun.validCount,jun.excludedCount,"; PASS");
