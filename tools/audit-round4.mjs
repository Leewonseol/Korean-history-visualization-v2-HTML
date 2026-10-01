#!/usr/bin/env node
/* ==========================================================================
   4차 감사 — 사람 판정용 검토 문서 생성기 (데이터를 바꾸지 않는다)
   사용법: node tools/audit-round4.mjs        → research/audit3/*.md (4차분) 생성
   - 판정 칸은 모두 비워 둔다. 후보·근거 줄은 tools/audit4-notes.mjs의 검토 메모다.
   - 민감도·영향 계산은 메모리 안의 가상 입력으로만 한다(데이터·스키마·temporal model 불변).
   ========================================================================== */
import fs from "node:fs";
import { buildIndexes } from "../src/model/indexes.js";
import { analysisContacts, inWindow } from "../src/model/temporalNetwork.js";
import { computeMetrics } from "../src/analysis/centrality.js";
import { buildAdjacency, earliestArrival, temporalPath, feedbackLoops } from "../src/analysis/temporalPaths.js";
import { NORMALIZATION_RULES, IDENTITY_STATUS } from "../src/data/vocab.js";
import { formatRange } from "../src/model/dates.js";
import { loadPack, packEntryOf } from "./pack-v1.mjs";
import { generateAudit3 } from "./audit-round3.mjs";
import { CAUSAL_NOTES } from "./audit3-notes.mjs";
import { R1_NOTES, RECIPIENT_KINDS, MISSING_NOTES, IDENTITY_REVIEW, CAUSAL_REVIEW } from "./audit4-notes.mjs";

const md = (s) => String(s ?? "").replace(/\|/g, "\\|").replace(/\n/g, " ");
const WIN = { from: "1432-00-00", to: "1449-99-99" };
const KEY = ["JO_SEJONG", "JO_CHOEYUNDEOK", "JO_HWANGBOIN", "JO_KIMJONGSEO", "JO_LEECHEON"];
export const DECISIONS = {
  r1: "☐ KEEP_AS_SEJONG ☐ CHANGE_TO_COURT ☐ CHANGE_TO_INSTITUTION ☐ DOWNGRADE_TO_INTERPRETATION ☐ REMOVE ☐ NEEDS_SOURCE",
  missing: "☐ ADD_AS_DIRECT ☐ ADD_AS_NORMALIZED ☐ INTERPRETATION_ONLY ☐ DO_NOT_ADD ☐ NEEDS_SOURCE",
  identity: "☐ VERIFIED_SAME ☐ PROBABLE_SAME 유지 ☐ SPLIT_REQUIRED ☐ NEEDS_EXTERNAL_AUTHORITY",
  causal: "☐ KEEP_EXPLICIT_CAUSAL ☐ COMMAND_RELATION ☐ PROCEDURAL_SEQUENCE ☐ TEMPORAL_ASSOCIATION ☐ UNKNOWN"
};
const decisionLine = (k) => `**판정** ${DECISIONS[k]}  ·  검토자: ____  ·  메모: ____`;

export function generateAudit4(DATA) {
  const idx = buildIndexes(DATA);
  const pack = loadPack();
  const P = (id) => (idx.peopleById[id] ? idx.peopleById[id].canonicalName : String(id).replace(/^NEW:/, "(새 노드) "));
  const C = Object.fromEntries(idx.contacts.map((c) => [c.id, c]));
  const traces = DATA.RELATION_TRACES;
  const out = {};
  const base = analysisContacts(idx, WIN, "CERTAIN_ORDER");
  const baseTNE = analysisContacts(idx, WIN, "TEMPORALLY_NOT_EXCLUDED");

  /* ---------- 공통 도구 ---------- */
  const entryText = (entryId) => {
    const e = pack.entries[entryId];
    if (!e) return "(pack 항목 없음)";
    const lines = [];
    for (let i = e.line - 1; i < pack.lines.length; i++) {
      const l = pack.lines[i];
      if (i > e.line - 1 && (/^-{10,}$/.test(l) || /^=+$/.test(l))) break;
      lines.push(`${String(i + 1).padStart(4)}| ${l}`);
    }
    return lines.join("\n");
  };
  const details = (entryId) => [`<details><summary>원문 전체 문맥 — pack 항목 ${entryId}</summary>`, "", "```", entryText(entryId), "```", "</details>", ""];
  const entryDate = (entryId) => {
    const s = (pack.entries[entryId] || {}).sections || {};
    return ((s["RECORD DATE"] || s.DATE || s["DATE/RECORD NOTE"] || [])[0] || {}).text || idx.eventsById[eventOfEntry(entryId)]?.recordDate || "—";
  };
  const eventOfEntry = (entryId) => (DATA.EVENTS.find((ev) => packEntryOf(ev.id) === entryId) || {}).id;
  const whoOf = (entryId) => {
    const s = (pack.entries[entryId] || {}).sections || {};
    const ls = s.WHO || s["WHO / FORCE"] || s["WHO / WHAT"] || s["MAJOR COMMANDERS AND FORCE SIZES"] || [];
    return [...new Set(ls.map((x) => x.text.replace(/[一-鿿]+/g, "").replace(/\[.*?\]|\(.*?\)/g, "").split(/[:,]/)[0].trim()).filter((n) => /^[가-힣]/.test(n)))];
  };
  const edgeLine = (c) => `\`${c.source}\` ${P(c.source)} ${c.direction === "undirected" ? "↔" : "→"} \`${c.target}\` ${P(c.target)} · ${c.layer} · \`${c.relationType}\` · 시각 ${formatRange(c.tMin, c.tMax)} · 인과 ${c.causalStatus} · 근거 ${c.evidenceClass}${c.pathEligible ? "" : " · 경로 제외"}`;
  const isNew = (n) => String(n).startsWith("NEW:");

  // 네트워크 요약: edge·node·연결 요소·도달 쌍·지표
  const reachPairs = (cs, mode = "CERTAIN_ORDER") => {
    const adj = buildAdjacency(cs), nodes = [...new Set(cs.flatMap((c) => [c.source, c.target]))], pairs = new Set();
    for (const s of nodes) for (const [v] of earliestArrival(adj, [s], WIN.from, WIN.to, mode).arrival) if (v !== s) pairs.add(`${s}>${v}`);
    return pairs;
  };
  const components = (cs) => {
    const parent = new Map();
    const find = (x) => { while (parent.get(x) !== x) { parent.set(x, parent.get(parent.get(x))); x = parent.get(x); } return x; };
    for (const c of cs) for (const n of [c.source, c.target]) if (!parent.has(n)) parent.set(n, n);
    for (const c of cs) { const a = find(c.source), b = find(c.target); if (a !== b) parent.set(a, b); }
    const sizes = {};
    for (const n of parent.keys()) { const r = find(n); sizes[r] = (sizes[r] || 0) + 1; }
    return Object.values(sizes).sort((a, b) => b - a);
  };
  const summarize = (cs, scope, mode = "CERTAIN_ORDER") => {
    const M = computeMetrics(cs, WIN, { scope, communicability: false, mode }).metrics;
    const comps = components(cs);
    return { edges: cs.length, nodes: Object.keys(M).length, comps, pairs: reachPairs(cs, mode), M };
  };
  const mval = (S, id, k) => (S.M[id] ? S.M[id][k] : null);
  const fmt = (v, d = 2) => (v === null || v === undefined ? "—(노드 없음)" : typeof v === "number" && !Number.isInteger(v) ? v.toFixed(d) : String(v));
  const topBetw = (S, n = 10) => Object.entries(S.M).sort((a, b) => b[1].betweenness - a[1].betweenness || (a[0] < b[0] ? -1 : 1)).slice(0, n);

  // 가상 관계(메모리 안에서만 사용, 데이터에 쓰지 않음)
  const mkHyp = (id, source, target, layer, eventId, tMin, tMax) => ({
    id, eventId, source, target, layer, relationType: "HYPOTHETICAL", tMin, tMax, timeKind: "instant",
    exact: tMin !== null && tMin === tMax, anchor: tMax ?? tMin, timeBasis: "relation", startDate: tMin ?? tMax, endDate: tMax ?? tMin,
    direction: "directed", directionEvidence: null, certainty: "confirmed", causalStatus: "UNKNOWN", provenance: "hypothetical",
    evidenceStatus: "hypothetical", evidenceClass: "NORMALIZED", causalEvidence: null, derivationRule: null, pathEligible: true,
    sourceIds: [], sourceTypes: [], theater: [], note: "4차 감사 가상 관계(데이터 미반영)"
  });
  const baseS = summarize(base.contacts, base.scope);
  const pairsAmongExisting = (pairs) => [...pairs].filter((p) => !p.split(">").some(isNew));
  const impactRows = (S0, S1, focus) => {
    const ids = [...new Set([...KEY, ...focus])];
    const p0 = pairsAmongExisting(S0.pairs), p1 = new Set(pairsAmongExisting(S1.pairs));
    const gained = p0.length === p1.size ? 0 : p1.size - p0.length;
    const rows = [`| 지표 | 현재 | 가상 반영 | 차이 |`, "|---|---|---|---|",
      `| edge 수 | ${S0.edges} | ${S1.edges} | ${S1.edges - S0.edges} |`,
      `| node 수 | ${S0.nodes} | ${S1.nodes} | ${S1.nodes - S0.nodes} |`,
      `| 기존 노드 사이 도달 쌍 | ${p0.length} | ${p1.size} | ${gained >= 0 ? "+" : ""}${gained} |`];
    for (const id of ids) {
      for (const k of ["degree", "betweenness"]) {
        const a = mval(S0, id, k), b = mval(S1, id, k);
        if (a === b && !KEY.includes(id)) continue;
        rows.push(`| ${P(id)} ${k} | ${fmt(a)} | ${fmt(b)} | ${a === null || b === null ? "—" : fmt(b - a)} |`);
      }
    }
    return rows;
  };

  /* ---------- 1. R1 18건 ---------- */
  const r1 = traces.filter((t) => t.rules.includes("R1_court_recipient"));
  const r1Spec = NORMALIZATION_RULES.R1_court_recipient;
  const baseIds = new Set(base.contacts.map((c) => c.id));
  const without = (ids) => base.contacts.filter((c) => !ids.has(c.id));
  const retarget = (ids) => base.contacts.map((c) => (ids.has(c.id) ? { ...c, target: c.target === "JO_SEJONG" ? "ORG_JOSEON_COURT" : "NEW:명 조정", evidenceClass: c.evidenceClass } : c));
  const allR1 = new Set(r1.map((t) => t.relationId));
  const sNoR1 = summarize(without(allR1), base.scope), sCourt = summarize(retarget(allR1), base.scope);
  const sejongIn = (S) => mval(S, "JO_SEJONG", "inDeg");
  const r1Impact = (t) => {
    const c = C[t.relationId];
    if (!baseIds.has(c.id)) return { inBase: false };
    const one = new Set([c.id]);
    const sRem = summarize(without(one), base.scope), sRet = summarize(retarget(one), base.scope);
    return { inBase: true, sRem, sRet };
  };
  const r1Sections = r1.map((t, i) => {
    const c = C[t.relationId], ev = idx.eventsById[c.eventId], entry = t.locator.split(":")[1];
    const n = R1_NOTES[t.relationId] || { candidates: [], alternatives: [] };
    const who = whoOf(entry);
    const imp = r1Impact(t);
    const tgt = c.target;
    const impactTxt = imp.inBase
      ? [`| 경우 | ${P(tgt)} in-degree | ${P(tgt)} betweenness | 세종 betweenness | 전체 도달 쌍 |`, "|---|---|---|---|---|",
        `| 현재 | ${fmt(mval(baseS, tgt, "inDeg"))} | ${fmt(mval(baseS, tgt, "betweenness"))} | ${fmt(mval(baseS, "JO_SEJONG", "betweenness"))} | ${baseS.pairs.size} |`,
        `| 이 관계 제거 | ${fmt(mval(imp.sRem, tgt, "inDeg"))} | ${fmt(mval(imp.sRem, tgt, "betweenness"))} | ${fmt(mval(imp.sRem, "JO_SEJONG", "betweenness"))} | ${imp.sRem.pairs.size} |`,
        `| 수신자를 ${tgt === "JO_SEJONG" ? "조선 조정(ORG_JOSEON_COURT)" : "명 조정(가상 새 노드)"}으로 | ${fmt(mval(imp.sRet, tgt, "inDeg"))} | ${fmt(mval(imp.sRet, tgt, "betweenness"))} | ${fmt(mval(imp.sRet, "JO_SEJONG", "betweenness"))} | ${imp.sRet.pairs.size} |`]
      : [`- 이 관계는 기본 분석 입력(CERTAIN_ORDER)에 들어가지 않는다(시각 ${formatRange(c.tMin, c.tMax)}${c.pathEligible ? "" : " · 경로 제외"}) — 기본 중심성 영향 0. 화면·TEMPORALLY_NOT_EXCLUDED 경로에는 나타난다.`];
    return [`## ${i + 1}. \`${t.relationId}\` — ${md(t.sourceSubject)} → ${md(t.sourceObject)}`, "",
      `| 항목 | 내용 |`, "|---|---|",
      `| 사건 ID | \`${c.eventId}\` ${md(ev.title)} |`,
      `| 날짜 | 기사일 ${ev.recordDate} · 관계 시각 ${formatRange(c.tMin, c.tMax)} · 사건 dateBasis \`${ev.dateBasis}\` |`,
      `| 근거 줄 | \`${t.locator}\` “${md(t.quote)}” |`,
      `| 원문 subject / object | ${md(t.sourceSubject)} / ${md(t.sourceObject)} |`,
      `| 정규화 subject / object | \`${t.normalizedSubject}\` ${P(t.normalizedSubject)} / \`${t.normalizedObject}\` ${P(t.normalizedObject)} |`,
      `| 현재 edge | ${edgeLine(c)} |`,
      `| 적용 규칙 | ${t.rules.map((r) => `\`${r}\``).join(" + ")}${t.flags.length ? ` · 검토 표시 ${t.flags.join(", ")}` : ""} |`,
      `| R1 적용 이유 | 원문 수신자 토큰 '${md(t.sourceObject)}' → ${P(t.normalizedObject)} (${md(r1Spec.title)}) |`,
      `| 같은 pack 항목 WHO에 세종 | ${who.includes("세종") ? "있음" : "**없음**"}${who.length ? ` (WHO: ${md(who.join(", "))})` : " (WHO 절 없음)"} |`, "",
      "**원문 수신자 후보**(검토 메모 — 판정 아님)", "",
      `| ${RECIPIENT_KINDS.join(" | ")} |`, `|${RECIPIENT_KINDS.map(() => "---").join("|")}|`,
      `| ${RECIPIENT_KINDS.map((k) => { const x = n.candidates.find(([kk]) => kk === k); return x ? md(`후보 — ${x[1]}`) : ""; }).join(" | ")} |`, "",
      "**세종으로 정규화하지 않을 경우의 대안 edge**", ...n.alternatives.map((a) => `- ${a}`), "",
      "**현재 edge가 중심성에 미치는 영향**(기본 입력 기준, 메모리 안 계산)", ...impactTxt, "",
      decisionLine("r1"), "", ...details(entry)];
  });
  const r1Sum = r1.map((t, i) => {
    const c = C[t.relationId], who = whoOf(t.locator.split(":")[1]);
    const n = R1_NOTES[t.relationId] || { candidates: [] };
    return `| ${i + 1} | \`${t.relationId}\` | ${idx.eventsById[c.eventId].recordDate} | ${md(t.sourceSubject)} → ${md(t.sourceObject)} | ${P(c.source)} → ${P(c.target)} (${c.layer}) | ${baseIds.has(c.id) ? "포함" : "제외"} | ${who.includes("세종") ? "있음" : "없음"} | ${n.candidates.map(([k]) => k).join(" · ")} |  |`;
  });
  out["r1_manual_review.md"] = [
    "# R1(조정 수신자 → 군주 노드) 18건 수동 검토표", "",
    `> 자동 생성: \`node tools/audit-round4.mjs\` · 대상 ${r1.length}건. **판정 칸은 모두 비어 있다. R1 관련 데이터는 이번 라운드에서 바꾸지 않았다.**`,
    "> 판정 선택지: KEEP_AS_SEJONG / CHANGE_TO_COURT(ORG_JOSEON_COURT) / CHANGE_TO_INSTITUTION(의정부·병조·예조 등 기존 기관 노드) / DOWNGRADE_TO_INTERPRETATION / REMOVE / NEEDS_SOURCE.",
    "> '원문 수신자 후보'와 '대안 edge'는 `tools/audit4-notes.mjs`의 검토 메모다. 영향 수치는 메모리 안에서 관계를 빼거나 수신자를 바꿔 다시 계산한 값이며 데이터에는 반영되지 않았다.", "",
    "## 전체 영향(18건 일괄)", "",
    "| 경우 | 세종 in-degree | 세종 betweenness | 이천 betweenness | 전체 도달 쌍 |", "|---|---|---|---|---|",
    `| 현재(R1 포함) | ${sejongIn(baseS)} | ${fmt(mval(baseS, "JO_SEJONG", "betweenness"))} | ${fmt(mval(baseS, "JO_LEECHEON", "betweenness"))} | ${baseS.pairs.size} |`,
    `| R1 관계 전부 제거 | ${sejongIn(sNoR1)} | ${fmt(mval(sNoR1, "JO_SEJONG", "betweenness"))} | ${fmt(mval(sNoR1, "JO_LEECHEON", "betweenness"))} | ${sNoR1.pairs.size} |`,
    `| R1 수신자 전부 조정(ORG_JOSEON_COURT)으로 | ${sejongIn(sCourt)} | ${fmt(mval(sCourt, "JO_SEJONG", "betweenness"))} | ${fmt(mval(sCourt, "JO_LEECHEON", "betweenness"))} | ${sCourt.pairs.size} |`,
    `| (참고) 조정 노드 betweenness — 위 경우 | — | ${fmt(mval(sCourt, "ORG_JOSEON_COURT", "betweenness"))} | — | — |`, "",
    `- 기본 입력에 들어가는 R1 관계: ${r1.filter((t) => baseIds.has(t.relationId)).length}/${r1.length}. 세종으로 가는 것 ${r1.filter((t) => t.normalizedObject === "JO_SEJONG").length} · 선덕제로 가는 것 ${r1.filter((t) => t.normalizedObject === "MING_XUANDE").length}.`,
    `- 같은 pack 항목 WHO에 세종이 없는 R1 관계: ${r1.filter((t) => !whoOf(t.locator.split(":")[1]).includes("세종")).length}건 — 이 경우 '세종 개인'을 수신자로 볼 항목 내 근거가 없다.`, "",
    "## 요약표", "",
    "| # | relation | 기사일 | 원문 | 현재 edge | 기본 입력 | WHO에 세종 | 수신자 후보(메모) | 판정 |", "|---|---|---|---|---|---|---|---|---|",
    ...r1Sum, "", ...r1Sections.flat()
  ].join("\n") + "\n";

  /* ---------- 2. R7 민감도: CURRENT vs SOURCE_DATED_ONLY ---------- */
  const conventionDated = (c) => { const ev = idx.eventsById[c.eventId]; return c.exact && c.tMin === ev.recordDate && ev.dateBasis !== "pack_event_date"; };
  const A = base.contacts, B = A.filter((c) => !conventionDated(c));
  const SA = baseS, SB = summarize(B, base.scope);
  const bExcl = A.filter(conventionDated);
  const byBasis = (cs) => Object.entries(cs.reduce((m, c) => { const b = idx.eventsById[c.eventId].dateBasis; m[b] = (m[b] || 0) + 1; return m; }, {})).map(([k, v]) => `${k} ${v}`).join(" · ");
  const pathStr = (p) => (p ? `${p.steps.map((x) => `${P(x.from)}→${P(x.to)}(${x.contact.eventId})`).join(" · ")} [${p.flag}]` : "없음");
  const keyPairs = KEY.flatMap((s) => KEY.filter((t) => t !== s).map((t) => [s, t]));
  const pathRows = keyPairs.map(([s, t]) => {
    const pa = temporalPath(A, [s], t, WIN.from, WIN.to, "CERTAIN_ORDER", base.scope), pb = temporalPath(B, [s], t, WIN.from, WIN.to, "CERTAIN_ORDER", base.scope);
    return { s, t, pa, pb };
  }).filter((r) => r.pa || r.pb);
  const loopsA = feedbackLoops(A, "JO_SEJONG", WIN.from, WIN.to, "CERTAIN_ORDER", base.scope);
  const loopsB = feedbackLoops(B, "JO_SEJONG", WIN.from, WIN.to, "CERTAIN_ORDER", base.scope);
  const lostPairs = [...SA.pairs].filter((p) => !SB.pairs.has(p));
  out["r7_temporal_sensitivity.md"] = [
    "# R7 시각 민감도 — CURRENT vs SOURCE_DATED_ONLY", "",
    "> **현재 시간순 분석은 기사일 대입 규칙에 크게 의존함.** 기본 분석 입력의 대부분은 '기사일 = 행위·도달일' 관례로 날짜가 정해진다. 이 관례를 빼면 네트워크가 거의 남지 않는다 — 아래 비교는 그 의존도를 보여 줄 뿐, 어느 쪽이 '맞는' 네트워크라는 판단이 아니다.", "",
    "> 자동 생성: `node tools/audit-round4.mjs`. temporal model·CERTAIN_ORDER 정의·데이터는 바꾸지 않았다. B는 A에서 관계를 빼기만 한 메모리 안 민감도 입력이다.", "",
    "## 정의", "",
    `- **A. CURRENT** — 현재 기본 분석 입력 그대로(1432~1449 전체 창, CERTAIN_ORDER, DIRECT+NORMALIZED, 경로 대상만): ${A.length}건. 이미 빠진 것: 시각 불확실(기사일 이전·미상) ${base.excludedUncertain} · '~에 관한' ${base.excludedAbout}.`,
    `- **B. SOURCE_DATED_ONLY** — A 중 관계 시각이 원문(pack)의 사건 날짜·사건 범위에서 오는 관계만: ${B.length}건.`,
    `  - 제외: 시각이 기사일로 부여된 관계 ${bExcl.length}건(${byBasis(bExcl)}).`,
    "  - 기사일 이전 범위·날짜 미상 관계는 A에서 이미 빠져 있으므로 B에도 없다.",
    `  - 남은 관계의 날짜 근거: ${byBasis(B)} (pack_event_date = pack의 EVENT DATE 줄, pack_event_range = pack의 사건 기간, court_act_on_record_date 1건은 pack DATE/RECORD NOTE가 따로 준 공사 기간).`, "",
    "## 네트워크 전체 비교", "",
    "| 지표 | A. CURRENT | B. SOURCE_DATED_ONLY |", "|---|---|---|",
    `| edge 수 | ${SA.edges} | ${SB.edges} |`,
    `| node 수 | ${SA.nodes} | ${SB.nodes} |`,
    `| connected components(무방향) | ${SA.comps.length} (최대 ${SA.comps[0] || 0}노드) | ${SB.comps.length} (크기 ${SB.comps.join(", ")}) |`,
    `| reachable pair 수(time-respecting) | ${SA.pairs.size} | ${SB.pairs.size} |`,
    `| 세종 기준 feedback loop 수 | ${loopsA.length} | ${loopsB.length} |`, "",
    "## 핵심 인물 비교", "",
    "| 인물 | 동일성 상태 | degree A | degree B | betweenness A | betweenness B | reach A | reach B |", "|---|---|---|---|---|---|---|---|",
    ...KEY.map((id) => `| ${P(id)} | ${idx.identityOf[id].status} | ${fmt(mval(SA, id, "degree"))} | ${fmt(mval(SB, id, "degree"))} | ${fmt(mval(SA, id, "betweenness"))} | ${fmt(mval(SB, id, "betweenness"))} | ${fmt(mval(SA, id, "reach"))} | ${fmt(mval(SB, id, "reach"))} |`), "",
    `- betweenness 상위 10(A): ${topBetw(SA).map(([k, x]) => `${P(k)} ${x.betweenness.toFixed(1)}`).join(", ")}`,
    `- betweenness 상위 10(B): ${topBetw(SB).filter(([, x]) => x.betweenness > 0).map(([k, x]) => `${P(k)} ${x.betweenness.toFixed(1)}`).join(", ") || "모두 0"}`, "",
    "## 주요 경로 변화(핵심 인물 사이, CERTAIN_ORDER)", "",
    "| 출발 → 도착 | A 경로 | B 경로 |", "|---|---|---|",
    ...pathRows.map((r) => `| ${P(r.s)} → ${P(r.t)} | ${md(pathStr(r.pa))} | ${md(pathStr(r.pb))} |`), "",
    `- A에서 도달 가능하던 쌍 중 B에서 끊기는 쌍: ${lostPairs.length}/${SA.pairs.size}`, "",
    "## feedback loop 변화(세종 기준)", "",
    `- A: ${loopsA.length}개 — ${loopsA.map((l) => `${P(l.via)} 경유(${l.closedAt}, ${l.flag})`).join(", ") || "없음"}`,
    `- B: ${loopsB.length}개 — ${loopsB.map((l) => `${P(l.via)} 경유(${l.closedAt}, ${l.flag})`).join(", ") || "없음"}`, "",
    "## B에 남는 관계 전체", "",
    "| relation | edge | 관계 시각 | 사건 dateBasis |", "|---|---|---|---|",
    ...B.map((c) => `| \`${c.id}\` | ${md(P(c.source))} → ${md(P(c.target))} (${c.layer}) | ${formatRange(c.tMin, c.tMax)} | ${idx.eventsById[c.eventId].dateBasis} |`), "",
    "## 해석 시 주의", "",
    "- B는 조정 논의·보고·명령(기사일에 기록된 행위)을 거의 모두 뺀다. 그래서 B는 '현장 행위만 남은 네트워크'에 가깝고, 조정 쪽 행위자의 지표는 구조적으로 0에 가까워진다.",
    "- 따라서 A의 중앙 행위자 중심성(특히 세종)과 A의 경로 순서는 기사일 관례가 맞다는 가정 위에 있다. 이 가정이 틀리면 순서가 바뀌는 것이 아니라 순서를 **알 수 없게** 된다(관계가 TEMPORALLY_NOT_EXCLUDED 쪽으로 옮겨감).",
    "- 이 비교는 관례를 버리자는 제안이 아니다. 관례의 타당성(조정 행위가 실제 기사일에 일어났는지)은 사람이 원문으로 판단한다.", ""
  ].join("\n") + "\n";

  /* ---------- 3. 미반영 pack 관계 줄(인물·기관 사이) 9건 ---------- */
  const covered = new Set(traces.flatMap((t) => [t.locator, ...t.support.map((s) => s.locator)]));
  const missing = [];
  for (const e of Object.values(pack.entries)) for (const l of e.sections.RELATIONS || []) {
    const loc = `pack_v1:${e.id}:RELATIONS:L${l.line}`;
    if (covered.has(loc) || !/->/.test(l.text) || /->\s*(frontier|Yalu|Hoeryŏng|Puryŏng|frontier territory|military livestock)/.test(l.text)) continue;
    missing.push({ loc, entry: e.id, text: l.text, note: MISSING_NOTES[loc] });
  }
  missing.sort((a, b) => (b.note?.highlight ? 1 : 0) - (a.note?.highlight ? 1 : 0));
  const timeOf = (eventId, kind) => {
    const ev = idx.eventsById[eventId];
    if (kind === "record") return [ev.recordDate, ev.recordDate];
    return [ev.dateMin ?? null, ev.dateMax ?? null];
  };
  const hypContacts = (n, loc, times) => {
    const h = n.hyp, srcs = h.sources || [h.source], tgts = h.targets || [h.target];
    const [tMin, tMax] = times || timeOf(h.eventId, h.time);
    return srcs.flatMap((s) => tgts.map((t, j) => mkHyp(`HYP:${loc}:${s}:${j}`, s, t, h.layer, h.eventId, tMin, tMax)));
  };
  const hypImpact = (hs, baseSet, S0, mode = "CERTAIN_ORDER") => {
    const used = hs.filter((c) => inWindow(c, WIN.from, WIN.to, mode));
    if (!used.length) return { used: 0, rows: [`- 가상 관계의 시각(${formatRange(hs[0].tMin, hs[0].tMax)})이 ${mode} 기간 판정을 통과하지 못함 → 이 모드의 지표·경로에 들어가지 않는다(영향 0).`] };
    const S1 = summarize([...baseSet.contacts, ...used], baseSet.scope, mode);
    return { used: used.length, rows: impactRows(S0, S1, hs.flatMap((c) => [c.source, c.target]).filter((x) => !isNew(x))) };
  };
  const baseTNES = summarize(baseTNE.contacts, baseTNE.scope, "TEMPORALLY_NOT_EXCLUDED");
  const missingSections = missing.map((m, i) => {
    const n = m.note || {};
    const evId = n.hyp ? n.hyp.eventId : eventOfEntry(m.entry);
    const extra = [];
    if (n.hyp && n.hyp.time === "variants") {
      const ev = idx.eventsById[evId];
      const existing = idx.contacts.filter((c) => c.source === n.hyp.source && c.target === n.hyp.target);
      extra.push("**이미 있는 같은 방향 관계**", ...existing.map((c) => `- \`${c.id}\` ${edgeLine(c)}`), "",
        `**영향 (a) 시각 = 기사일 이전(명령은 정벌 전, 기사일 ${ev.recordDate}에 보고됨 → tMin 미상)** — CERTAIN_ORDER`,
        ...hypImpact(hypContacts(n, m.loc, [null, ev.recordDate]), base, baseS).rows, "",
        `**영향 (b) 시각 = 기사일 ${ev.recordDate}(R7류 관례를 적용한다고 가정)** — CERTAIN_ORDER`,
        ...hypImpact(hypContacts(n, m.loc, [ev.recordDate, ev.recordDate]), base, baseS).rows, "",
        "**영향 (c) 시각 = 기사일 이전** — TEMPORALLY_NOT_EXCLUDED(시간상 배제되지 않음)",
        ...hypImpact(hypContacts(n, m.loc, [null, ev.recordDate]), baseTNE, baseTNES, "TEMPORALLY_NOT_EXCLUDED").rows, "");
    } else if (n.hyp) {
      const hs = hypContacts(n, m.loc);
      extra.push(`**추가될 경우 영향**(가상 edge ${hs.map((c) => `${P(c.source)}→${P(c.target)}`).join(", ")} · 시각 ${formatRange(hs[0].tMin, hs[0].tMax)}) — CERTAIN_ORDER 기본 입력 기준`,
        ...hypImpact(hs, base, baseS).rows, "",
        hs.some((c) => isNew(c.source) || isNew(c.target)) ? "- 새 노드는 한쪽 끝(출발만 또는 도착만)이라 기존 노드 사이 도달 쌍은 바뀌지 않는다. betweenness 증가분은 새 노드로 가는(또는 새 노드에서 오는) 경로를 중계한 몫이다." : "", "");
    }
    return [`## ${i + 1}. \`${m.loc}\`${n.highlight ? " ★ 우선 검토" : ""}`, "",
      `| 항목 | 내용 |`, "|---|---|",
      `| pack 원문 | “${md(m.text)}” |`,
      `| 날짜 | ${md(entryDate(m.entry))} (사건 \`${evId || "—"}\`${evId ? ` dateBasis \`${idx.eventsById[evId].dateBasis}\`` : ""}) |`,
      `| 관계 표현 | \`${md(n.relationType || "—")}\` |`,
      `| source | ${md(n.source || "—")} |`, `| target | ${md(n.target || "—")} |`,
      `| relation type | ${md(n.relationType || "—")} |`,
      `| 현재 graph에 없는 이유 | ${md(n.why || "—")} |`,
      `| 기존 정규화 규칙으로 표현 가능? | ${md(n.rule || "—")} |`,
      `| 새 규칙 없이 표현 가능? | ${md(n.noNewRule || "—")} |`, "",
      ...extra, decisionLine("missing"), "", ...details(m.entry)];
  });
  out["missing_pack_relations_review.md"] = [
    "# pack에는 있으나 graph에 없는 인물·기관 관계 — 수동 검토표", "",
    `> 자동 생성: \`node tools/audit-round4.mjs\` · 대상 ${missing.length}건(\`pack_relations_not_encoded.md\` 중 인물·기관 사이 관계). **판정 전에는 graph에 추가하지 않는다 — 이번 라운드에서 추가한 관계 없음.**`,
    "> 판정 선택지: ADD_AS_DIRECT / ADD_AS_NORMALIZED / INTERPRETATION_ONLY / DO_NOT_ADD / NEEDS_SOURCE.",
    "> '영향'은 메모리 안에서 가상 edge를 붙여 다시 계산한 값이다(데이터 미반영). '현재 graph에 없는 이유'에 '기록된 제외 사유 없음'이라고 쓴 것은 데이터에 제외 이유가 남아 있지 않다는 뜻이다.", "",
    "## 요약표", "",
    "| # | locator | 원문 | 기존 규칙으로 표현 | 판정 |", "|---|---|---|---|---|",
    ...missing.map((m, i) => `| ${i + 1} | \`${m.loc}\`${m.note?.highlight ? " ★" : ""} | “${md(m.text)}” | ${md((m.note || {}).noNewRule || "—")} |  |`), "",
    ...missingSections.flat()
  ].join("\n") + "\n";

  /* ---------- 4·5. 동일성 수동 검토 ---------- */
  const PATTERNS = { JO_CHOEYUNDEOK: [/최윤덕/, /Choe Yun-deok/, /\bChoe\b(?! Hae| Chi)/, /Choe's/], JO_HWANGBOIN: [/황보인/, /Hwangbo In/] };
  const audit3 = generateAudit3(DATA);
  const sensSection = (pid) => {
    const doc = audit3["identity_sensitivity_merged_vs_split.md"];
    const start = doc.indexOf(`## ${P(pid)} \``);
    const next = doc.indexOf("\n## ", start + 4);
    return doc.slice(start, next === -1 ? undefined : next).trim().replace(/^## /, "### ").replace(/\n### /g, "\n#### ");
  };
  const identityDoc = (pid) => {
    const R = IDENTITY_REVIEW[pid];
    const entries = Object.values(pack.entries).filter((e) => Object.values(e.sections).flat().some((l) => PATTERNS[pid].some((re) => re.test(l.text))));
    const dateOf = (e) => entryDate(e.id);
    const rows = entries.map((e) => {
      const evs = DATA.EVENTS.filter((ev) => packEntryOf(ev.id) === e.id);
      const d = evs.length ? evs.map((ev) => ev.recordDate).sort()[0] : dateOf(e);
      return { e, d, evs, who: whoOf(e.id).filter((n) => !n.startsWith(P(pid))), note: R.entries[e.id] || {} };
    }).sort((a, b) => (a.d < b.d ? -1 : a.d > b.d ? 1 : 0));
    const sameDay = (r) => rows.filter((x) => x !== r && x.d === r.d).map((x) => x.e.id);
    const atts = (idx.attestationsByPerson[pid] || []).map((a) => `${a.attestedDate} ${a.office}(${a.provenance})`);
    return [
      `# ${P(pid)} 동일성 수동 검토`, "",
      `> 자동 생성: \`node tools/audit-round4.mjs\`. 현재 상태 \`${idx.identityOf[pid].status}\`(${IDENTITY_STATUS[idx.identityOf[pid].status]}) — **이번 라운드에서 바꾸지 않았다.**`,
      "> 근거는 pack v1 원문과 프로젝트 내부 authority(pack E절 인명록, `src/data/people.js`)뿐이다. 외부 사료를 찾지 않았다. 지역·직책·자연스러운 점 칸은 `tools/audit4-notes.mjs`의 검토 메모다.", "",
      `- 내부 authority: ${R.authority}`,
      `- 데이터의 관직·역할 증언: ${atts.join("; ") || "없음"}`,
      `- pack 등장 항목 ${rows.length}개 · 기간 ${rows[0].d} ~ ${rows[rows.length - 1].d}`, "",
      "| 날짜 | pack 항목 | 직책(원문) | 활동 지역 | 관련 사건 | 함께 등장한 인물 | 직책 연속성(동일인이면 자연스러운 점) | 다른 인물이면 자연스러운 점 | 시간상 충돌(자동) |",
      "|---|---|---|---|---|---|---|---|---|",
      ...rows.map((r) => `| ${r.d} | ${r.e.id} | ${md(r.note.office || "—")} | ${md(r.note.place || "—")} | ${md(r.evs.map((ev) => `\`${ev.id}\` ${ev.title}`).join(" / ") || "—")} | ${md(r.who.join(", ")) || "—"} | ${md(r.note.same || "—")} | ${md(r.note.diff || "—")} | ${sameDay(r).length ? `같은 날 다른 항목 ${sameDay(r).join(", ")}${[r, ...rows.filter((x) => x !== r && x.d === r.d)].every((x) => /^중앙/.test(x.note.place || "")) ? " — 모두 중앙(같은 자리), 충돌 아님" : " — 장소 비교 필요"}` : "없음"} |`), "",
      "- '시간상 충돌(자동)'은 같은 날짜에 서로 다른 pack 항목에 등장하는지만 검사한다. 같은 날 같은 곳(중앙)이면 충돌이 아니다.",
      `- pack 어디에도 '${P(pid)}의 여러 등장이 같은 사람'이라는 진술은 없다. 연속성은 이름·역할 흐름에서 나온 것이다.`, "",
      `**최종 판정** ${DECISIONS.identity}  ·  검토자: ____  ·  메모: ____`, "",
      "## merged vs split 민감도(3차 감사 계산 재사용)", "",
      sensSection(pid), ""
    ].join("\n") + "\n";
  };
  out["identity_choeyundeok_manual_review.md"] = identityDoc("JO_CHOEYUNDEOK");
  out["identity_hwangboin_manual_review.md"] = identityDoc("JO_HWANGBOIN");

  /* ---------- 6. EXPLICIT_CAUSAL 10건 ---------- */
  const candOf = (x) => { const n = CAUSAL_NOTES[x.ev.locator] || {}; return (n.candidate || {})[x.kind] || (n.candidate || {}).relation || "REVIEW"; };
  const causalItems = [
    ...idx.contacts.filter((c) => c.causalStatus === "EXPLICIT_CAUSAL").map((c) => ({ kind: "relation", id: c.id, edge: edgeLine(c), status: c.causalStatus, ev: c.causalEvidence })),
    ...DATA.EVENTS.flatMap((e) => (e.eventLinks || []).filter((l) => l.causalStatus === "EXPLICIT_CAUSAL")
      .map((l) => ({ kind: "link", id: `${e.id} ← ${l.eventId}`, edge: `사건 연결: \`${l.eventId}\` ${idx.eventsById[l.eventId].title} → \`${e.id}\` ${e.title}`, status: l.causalStatus, ev: l.causalEvidence })))
  ].filter((x) => /^DOWNGRADE/.test(candOf(x)) || (/^REVIEW/.test(candOf(x)) && x.ev.locator.includes(":TITLE:")));
  out["causal_manual_review.md"] = [
    "# EXPLICIT_CAUSAL 수동 검토 — 하향 후보 3건 + 제목 줄만 근거인 REVIEW 7건", "",
    `> 자동 생성: \`node tools/audit-round4.mjs\` · 대상 ${causalItems.length}건(3차 감사 \`explicit_causal_audit.md\`의 DOWNGRADE_CANDIDATE + 근거 locator가 TITLE인 REVIEW). **판정 칸은 모두 비어 있고 causalStatus는 바꾸지 않았다.**`,
    "> 판정 선택지: KEEP_EXPLICIT_CAUSAL / COMMAND_RELATION / PROCEDURAL_SEQUENCE / TEMPORAL_ASSOCIATION / UNKNOWN.",
    "> '본문 인과 표현'·'선후관계'·'명령 관계'·'제목이 추가한 인과' 칸은 `tools/audit4-notes.mjs`의 검토 메모다.", "",
    "## 요약표", "",
    "| # | 종류 | id | 3차 후보 | 근거 locator | 판정 |", "|---|---|---|---|---|---|",
    ...causalItems.map((x, i) => `| ${i + 1} | ${x.kind === "link" ? "사건 연결" : "관계"} | \`${x.id}\` | ${md(candOf(x).split(" — ")[0])} | \`${x.ev.locator}\` |  |`), "",
    ...causalItems.flatMap((x, i) => {
      const entry = x.ev.locator.split(":")[1], r = CAUSAL_REVIEW[x.ev.locator] || {};
      const title = (((pack.entries[entry] || {}).sections || {}).TITLE || [])[0] || {};
      return [`## ${i + 1}. \`${x.id}\``, "",
        "| 항목 | 내용 |", "|---|---|",
        `| 제목 | “${md(title.text)}” (L${title.line}) |`,
        `| 현재 causal edge | ${md(x.edge)} |`,
        `| 현재 causalStatus | \`${x.status}\` |`,
        `| causalEvidence | “${md(x.ev.quote)}” \`${x.ev.locator}\` |`,
        `| 3차 후보(메모) | ${md(candOf(x))} |`,
        `| 본문에 실제 인과 표현이 있는가 | ${md(r.bodyCausal || "—")} |`,
        `| 단순 선후관계인가 | ${md(r.sequence || "—")} |`,
        `| 명령 관계인가 | ${md(r.command || "—")} |`,
        `| 편집 제목이 인과를 추가했는가 | ${md(r.titleAdded || "—")} |`, "",
        decisionLine("causal"), "", "원문 본문:", "", ...details(entry)];
    })
  ].join("\n") + "\n";

  return out;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const { DATA } = await import("../src/data/index.js");
  const files = generateAudit4(DATA);
  for (const [f, body] of Object.entries(files)) fs.writeFileSync(new URL(`../research/audit3/${f}`, import.meta.url), body);
  console.log(Object.keys(files).map((f) => `research/audit3/${f}`).join("\n"));
}
