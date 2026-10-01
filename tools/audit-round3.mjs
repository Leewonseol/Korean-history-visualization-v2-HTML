#!/usr/bin/env node
/* ==========================================================================
   3차 감사 — 역사적 의미 검증용 '사람 검토 문서' 생성기 (데이터를 바꾸지 않는다)
   사용법: node tools/audit-round3.mjs        → research/audit3/*.md 생성
   - 자동 판정하지 않는다: 판정 칸은 비워 두고, 대안 해석·유지 근거·후보 표시만 제공한다.
   - 사람 메모(대안·유지 근거·연속성·충돌·인과 후보)는 tools/audit3-notes.mjs에 분리돼 있다.
   - 수치는 모두 데이터에서 계산한다. 근거 필터는 model/evidence.js(단일 선택기)만 사용한다.
   ========================================================================== */
import fs from "node:fs";
import { buildIndexes } from "../src/model/indexes.js";
import { analysisContacts } from "../src/model/temporalNetwork.js";
import { DEFAULT_SCOPE, select } from "../src/model/evidence.js";
import { computeMetrics } from "../src/analysis/centrality.js";
import { buildAdjacency, earliestArrival, temporalPath } from "../src/analysis/temporalPaths.js";
import { pathIdentityAssumptions } from "../src/analysis/identitySensitivity.js";
import { NORMALIZATION_RULES, IDENTITY_STATUS } from "../src/data/vocab.js";
import { formatRange } from "../src/model/dates.js";
import { loadPack, packEntryOf } from "./pack-v1.mjs";
import { FLAG_NOTES, FLAG_GROUP_NOTES, IDENTITY_ENTRY_NOTES, CAUSAL_NOTES } from "./audit3-notes.mjs";

const md = (s) => String(s ?? "").replace(/\|/g, "\\|").replace(/\n/g, " ");
const DECISION = "☐ KEEP ☐ DOWNGRADE_TO_INTERPRETATION ☐ SPLIT ☐ REMOVE ☐ NEEDS_SOURCE";
const WIN = { from: "1432-00-00", to: "1449-99-99" };

export function generateAudit3(DATA) {
  const idx = buildIndexes(DATA);
  const pack = loadPack();
  const P = (id) => (idx.peopleById[id] ? idx.peopleById[id].canonicalName : id);
  const C = Object.fromEntries(idx.contacts.map((c) => [c.id, c]));
  const traces = DATA.RELATION_TRACES;
  const round1 = new Set(JSON.parse(fs.readFileSync(new URL("../research/audit3/round1_direct_relations.json", import.meta.url), "utf8")).ids);
  const out = {};

  // pack 항목 원문 전체(헤더 줄부터 다음 구분선 전까지)
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
  const entryDate = (entryId) => {
    const s = (pack.entries[entryId] || {}).sections || {};
    return ((s["RECORD DATE"] || s.DATE || [])[0] || {}).text || "—";
  };
  const edgeLine = (c) => `\`${c.source}\` ${P(c.source)} ${c.direction === "undirected" ? "↔" : "→"} \`${c.target}\` ${P(c.target)} · ${c.layer} · \`${c.relationType}\` · 시각 ${formatRange(c.tMin, c.tMax)} · 확실성 ${c.certainty} · 인과 ${c.causalStatus} · 근거 ${c.evidenceClass}${c.pathEligible ? "" : " · 경로 제외"}`;

  /* ---------- 1. 검토 표시 19건 ---------- */
  const flagged = traces.filter((t) => t.flags.length);
  const noteOf = (id) => { const n = FLAG_NOTES[id] || {}; return n.group ? FLAG_GROUP_NOTES[n.group] : n; };
  out["flagged_edges_review.md"] = [
    "# 검토 표시(flag) 관계 재검토표", "",
    `> 자동 생성: \`node tools/audit-round3.mjs\` · 대상 ${flagged.length}건. **판정 칸은 비어 있다 — 자동 판정하지 않는다.**`,
    "> 판정 선택지: KEEP(유지) / DOWNGRADE_TO_INTERPRETATION(해석으로 내림) / SPLIT(관계 분리) / REMOVE(관계 삭제) / NEEDS_SOURCE(원문 확인 필요).",
    "> 대안·유지 근거는 `tools/audit3-notes.mjs`의 검토 메모이며 판정이 아니다.", "",
    "## 요약표", "", "| # | relation | 현재 edge | 규칙 | 검토 표시 | 판정 | 검토자 |", "|---|---|---|---|---|---|---|",
    ...flagged.map((t, i) => { const c = C[t.relationId]; return `| ${i + 1} | \`${t.relationId}\` | ${md(P(c.source))} → ${md(P(c.target))} (${c.layer}) | ${t.rules.join(" + ")} | ${t.flags.join(", ")} |  |  |`; }),
    "", ...flagged.flatMap((t, i) => {
      const c = C[t.relationId], n = noteOf(t.relationId) || { alternatives: [], keepReasons: [] };
      const entry = t.locator.split(":")[1];
      return [`## ${i + 1}. \`${t.relationId}\` — ${t.flags.join(", ")}`, "",
        `**현재 edge** ${edgeLine(c)}`, "",
        `**적용 규칙** ${t.rules.map((r) => `\`${r}\` (${NORMALIZATION_RULES[r].title})`).join(" + ")}${t.subjectRule ? ` · 주체 규칙 ${t.subjectRule}` : ""}${t.objectRule ? ` · 객체 규칙 ${t.objectRule}` : ""}`, "",
        `**근거 줄** \`${t.locator}\` “${md(t.quote)}” — 원문 주체/객체: ${md(t.sourceSubject)} → ${md(t.sourceObject)}`,
        ...t.members.map((m) => `- 구성원 근거 \`${m.locator}\` “${md(m.quote)}”`), ...t.support.map((m) => `- 보조 근거 \`${m.locator}\` “${md(m.quote)}”`), "",
        "**대안 가능한 해석**", ...n.alternatives.map((a) => `- ${a}`), "",
        "**현재 해석을 유지할 근거**", ...n.keepReasons.map((a) => `- ${a}`), "",
        `**판정** ${DECISION}  ·  검토자: ____  ·  메모: ____`, "",
        `<details><summary>원문 전체 문맥 — pack 항목 ${entry}</summary>`, "", "```", entryText(entry), "```", "</details>", ""];
    })
  ].join("\n") + "\n";

  /* ---------- 2. 최윤덕·황보인 동일성 ---------- */
  const PATTERNS = { JO_CHOEYUNDEOK: [/최윤덕/, /Choe Yun-deok/, /\bChoe\b(?! Hae| Chi)/, /Choe's/], JO_HWANGBOIN: [/황보인/, /Hwangbo In/] };
  const identityRows = (pid) => {
    const rows = [];
    for (const e of Object.values(pack.entries)) {
      for (const [sec, ls] of Object.entries(e.sections)) for (const l of ls) {
        if (!PATTERNS[pid].some((re) => re.test(l.text))) continue;
        const whoLines = e.sections.WHO || e.sections["WHO / FORCE"] || e.sections["MAJOR COMMANDERS AND FORCE SIZES"] || [];
        const who = [...new Set(whoLines.map((x) => x.text.replace(/[\u4e00-\u9fff]+/g, "").replace(/\[.*?\]|\(.*?\)/g, "").split(/[:,]/)[0].trim())
          .filter((n) => /^[가-힣]/.test(n)))].filter((n) => !n.startsWith(P(pid)));
        const eventIds = DATA.EVENTS.filter((ev) => packEntryOf(ev.id) === e.id).map((ev) => ev.id);
        rows.push({ entry: e.id, date: entryDate(e.id), line: l.line, sec, text: l.text,
          title: ((e.sections.TITLE || [])[0] || {}).text || "", who, eventIds,
          note: (IDENTITY_ENTRY_NOTES[pid] || {})[e.id] || {} });
      }
    }
    return rows.sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : a.line - b.line));
  };
  const idTable = (pid) => {
    const rows = identityRows(pid);
    const atts = (idx.attestationsByPerson[pid] || []).map((a) => `${a.attestedDate} ${a.office}(${a.provenance})`);
    return [`## ${P(pid)} \`${pid}\` — 현재 상태 \`${idx.identityOf[pid].status}\` (${IDENTITY_STATUS[idx.identityOf[pid].status]})`, "",
      `- pack 원문 등장 줄 ${rows.length}개 · pack 항목 ${new Set(rows.map((r) => r.entry)).size}개 · 인명록 표기 ${P(pid)} ${idx.peopleById[pid].hanja || ""}`,
      `- 데이터의 관직·역할 증언: ${atts.join("; ") || "없음"}`,
      `- **VERIFIED_SAME으로 승격하지 않는다** — 아래 표의 연속성은 같은 이름·이어지는 역할일 뿐, pack이 '같은 사람'이라고 진술한 줄은 없다.`, "",
      "| 날짜 | pack 항목 · 줄 | 원문 | 직책·역할(원문 표현) | 사건(제목) | 함께 등장한 인물(WHO) | 동일인으로 볼 연속성 | 충돌하는 정황 |",
      "|---|---|---|---|---|---|---|---|",
      ...rows.map((r) => `| ${r.date} | ${r.entry} · ${r.sec} L${r.line} | “${md(r.text)}” | ${md(roleOf(r.text))} | ${md(r.title)} ${r.eventIds.map((x) => `\`${x}\``).join(" ")} | ${md(r.who.join(", ")) || "—"} | ${md(r.note.continuity || "—")} | ${md(r.note.conflict || "—")} |`), ""];
  };
  const roleOf = (t) => {
    const m = /(frontier commander|central-army commander|via [^,.]+|\d[\d,]*$|: \d[\d,]*|mentioned|REPORT|COMMAND[_A-Z]*|ADVICE|DEFENSE_ADVICE|POLICY_ADVICE|MILITARY_ADVICE|INSPECTION|FORTIFICATION|POLICY_REPORT|request)/.exec(t);
    return m ? m[0] : "(직책 미기재)";
  };
  out["identity_choeyundeok_hwangboin.md"] = [
    "# 최윤덕·황보인 동일인 검증표", "",
    "> 자동 생성: `node tools/audit-round3.mjs`. pack v1 원문의 모든 등장 줄(한글 이름·영문 표기)을 모은 표다.",
    "> '연속성'·'충돌' 칸은 `tools/audit3-notes.mjs`의 검토 메모(원문 근거)이며 판정이 아니다. 상태는 **PROBABLE_SAME 유지**(자동 승격 없음).", "",
    ...idTable("JO_CHOEYUNDEOK"), ...idTable("JO_HWANGBOIN"),
    "## 사람 검토 질문", "",
    "- 최윤덕: 1432-12-11 중앙 협의 참여자(직책 미기재)와 1433 '변경 지휘관'·정벌 총지휘를 같은 사람으로 볼 원문 진술이 있는가? (pack에는 없음 — 원문 기사 본문 확인 필요)",
    "- 최윤덕: 1434-08-03·1437-08-20의 건의가 어느 자리(중앙/현지)에서 나온 것인가? 1437 'previous Gangye experience'가 본인 경험을 가리키는가?",
    "- 황보인: 1441~1447 변경 재편 실무자와 1448 대신 논의 참여자가 같은 사람인지(관직 변화) 원문으로 확인 가능한가?",
    "- 두 사람 모두 확인 전까지 VERIFIED_SAME 승격 금지. 다른 사람이라는 근거가 나오면 UNRESOLVED_DISTINCT로 분리 후보.", ""
  ].join("\n") + "\n";

  /* ---------- 2b. 병합 vs 분리 민감도 ---------- */
  const base = analysisContacts(idx, WIN, "CERTAIN_ORDER");
  const split = (contacts, id) => contacts.map((c) => (c.source === id || c.target === id)
    ? { ...c, source: c.source === id ? `${id}@${c.eventId}` : c.source, target: c.target === id ? `${id}@${c.eventId}` : c.target } : c);
  const reach = (cs) => {
    const adj = buildAdjacency(cs), nodes = [...new Set(cs.flatMap((c) => [c.source, c.target]))], pairs = new Set();
    for (const s of nodes) for (const [v] of earliestArrival(adj, [s], WIN.from, WIN.to, "CERTAIN_ORDER").arrival) if (v !== s) pairs.add(`${s}>${v}`);
    return pairs;
  };
  const top = (M, n = 10) => Object.entries(M).sort((a, b) => b[1].betweenness - a[1].betweenness).slice(0, n);
  const baseM = computeMetrics(base.contacts, WIN, { scope: base.scope, communicability: false }).metrics;
  const basePairs = reach(base.contacts);
  const name2 = (id) => { const [p, e] = id.split("@"); return e ? `${P(p)}@${e}` : P(p); };
  const sens = (pid) => {
    const sc = split(base.contacts, pid);
    const sM = computeMetrics(sc, WIN, { scope: base.scope, communicability: false }).metrics;
    const sPairs = reach(sc);
    const lost = [...basePairs].filter((p) => { const [s, t] = p.split(">"); return s !== pid && t !== pid && !sPairs.has(p); });
    const copies = Object.entries(sM).filter(([k]) => k.startsWith(`${pid}@`));
    const m = baseM[pid] || {};
    const examples = lost.slice(0, 8).map((pair) => {
      const [s, t] = pair.split(">");
      const p = temporalPath(base.contacts, [s], t, WIN.from, WIN.to, "CERTAIN_ORDER", base.scope);
      const ia = p ? pathIdentityAssumptions(idx, p.steps) : [];
      return `- ${P(s)} → ${P(t)}: ${p ? p.steps.map((x) => `${P(x.from)}→${P(x.to)}(${x.contact.eventId})`).join(" · ") : "—"}${ia.length ? ` — 동일성 가정: ${ia.map((a) => `${P(a.node)} ${a.inEvent}→${a.outEvent}`).join(", ")}` : ""}`;
    });
    const rankBase = top(baseM).map(([k]) => k), rankSplit = top(sM).map(([k]) => k);
    return [`## ${P(pid)} \`${pid}\``, "",
      "| 지표 | merged(한 노드) | split(사건별 노드 합/최댓값) |", "|---|---|---|",
      `| 노드 수 | 1 | ${copies.length} |`,
      `| degree | ${m.degree ?? 0} | 합 ${copies.reduce((a, [, x]) => a + x.degree, 0)} · 최대 ${Math.max(0, ...copies.map(([, x]) => x.degree))} |`,
      `| temporal betweenness | ${(m.betweenness ?? 0).toFixed(2)} | 합 ${copies.reduce((a, [, x]) => a + x.betweenness, 0).toFixed(2)} · 최대 ${Math.max(0, ...copies.map(([, x]) => x.betweenness)).toFixed(2)} |`,
      `| earliest-arrival closeness | ${(m.closeness ?? 0).toFixed(3)} | 최대 ${Math.max(0, ...copies.map(([, x]) => x.closeness)).toFixed(3)} |`,
      `| 도달 가능 노드 수(reach) | ${m.reach ?? 0} | 최대 ${Math.max(0, ...copies.map(([, x]) => x.reach))} |`,
      `| 다른 노드 사이 도달 쌍 | ${basePairs.size} | ${sPairs.size} (끊김 ${lost.length}) |`, "",
      "> split 열의 reach·도달 쌍은 사건별 복제 노드끼리의 도달도 별개 노드로 세므로 merged보다 클 수 있다. 비교의 핵심은 **끊기는 다른 노드 사이 도달 쌍**과 betweenness다.", "",
      `- split 노드: ${copies.map(([k, x]) => `${name2(k)}(degree ${x.degree}, betw ${x.betweenness.toFixed(1)})`).join(", ")}`,
      `- betweenness 상위 10(merged): ${rankBase.map(P).join(", ")}`,
      `- betweenness 상위 10(split): ${rankSplit.map(name2).join(", ")}`, "",
      `### 분리하면 끊기는 도달 경로 ${lost.length}건 중 예시`, ...examples, ""];
  };
  out["identity_sensitivity_merged_vs_split.md"] = [
    "# 동일성 민감도 — merged vs split", "",
    "> 자동 생성: `node tools/audit-round3.mjs`. 기본 지표 입력(1432~1449 전체 창, CERTAIN_ORDER, DIRECT+NORMALIZED) 기준.",
    "> split = 해당 인물의 등장을 사건별 별도 노드로 나눈 경우(극단적 분리). 실제 동일성은 사람이 판단한다 — 이 비교는 결과가 동일성 가정에 얼마나 의존하는지만 보여 준다.", "",
    `- 기준 입력: ${base.contacts.length} 관계 · 다른 노드 사이 도달 쌍 ${basePairs.size}`, "",
    ...sens("JO_CHOEYUNDEOK"), ...sens("JO_HWANGBOIN")
  ].join("\n") + "\n";

  /* ---------- 3. PROBABLE_SAME 23명 ---------- */
  const probable = DATA.PEOPLE.filter((p) => idx.identityOf[p.personId].status === "PROBABLE_SAME");
  const attestRows = (pid) => {
    const evs = [...(idx.verifiedEvents[pid] || [])].map((id) => idx.eventsById[id]).sort((a, b) => (idx.sortDateOf(a) < idx.sortDateOf(b) ? -1 : 1));
    return evs;
  };
  const probRows = probable.map((p) => {
    const evs = attestRows(p.personId);
    const dates = evs.map((e) => idx.sortDateOf(e));
    const offices = (idx.attestationsByPerson[p.personId] || []).filter((a) => a.provenance !== "inherited_v2").map((a) => `${a.attestedDate} ${a.office}(${a.level})`);
    const entries = [...new Set(evs.map((e) => packEntryOf(e.id)))];
    const withHanja = p.hanja ? entries.filter((en) => (pack.entries[en] ? Object.values(pack.entries[en].sections).flat() : []).some((l) => l.text.includes(p.hanja))) : [];
    const signals = [];
    const years = [...new Set(dates.map((d) => +d.slice(0, 4)))];
    for (let i = 1; i < years.length; i++) if (years[i] - years[i - 1] >= 4) signals.push(`등장 공백 ${years[i - 1]}→${years[i]}`);
    const levels = new Set((idx.attestationsByPerson[p.personId] || []).filter((a) => a.provenance !== "inherited_v2").map((a) => a.level));
    if (levels.size > 1) signals.push(`역할 범주 변화(${[...levels].join("→")})`);
    if ((p.possibleSameAs || []).length) signals.push(`동명 분리 노드 있음(${p.possibleSameAs.join(", ")})`);
    if (p.hanja && withHanja.length < entries.length) signals.push(`한자 표기는 ${withHanja.length}/${entries.length} 항목에만`);
    const legacy = (idx.attestationsByPerson[p.personId] || []).filter((a) => a.provenance === "inherited_v2");
    if (legacy.length) signals.push(`legacy 직함 ${legacy.length}건(검증 아님)`);
    return { p, evs, dates, offices, signals, entries };
  });
  out["probable_same_identity_audit.md"] = [
    "# PROBABLE_SAME 동일성 감사표", "",
    `> 자동 생성: \`node tools/audit-round3.mjs\` · 대상 ${probRows.length}명(pack 검증 사건 2건 이상에 같은 이름으로 등장해 한 노드로 묶인 인물).`,
    "> '검토 신호'는 자동으로 찾은 확인 포인트(공백·역할 변화·표기 차이)이며 충돌 판정이 아니다. 명시적 충돌이 원문에 있으면 사람이 '충돌' 칸에 적는다.",
    "> 확신 근거는 모든 인물에 공통으로 '같은 표기 + pack 인명록 단일 항목'뿐이며 동일성 진술이 없다 — 그래서 PROBABLE_SAME을 유지한다.", "",
    "| name | attestations(검증 사건) | date range | offices(pack 증언) | contexts | 검토 신호(자동) | 충돌(사람 기입) | current status | confidence reason |",
    "|---|---|---|---|---|---|---|---|---|",
    ...probRows.map(({ p, evs, dates, offices, signals }) => `| ${p.canonicalName} ${p.hanja || ""} \`${p.personId}\` | ${evs.length}: ${evs.map((e) => `\`${e.id}\``).join(" ")} | ${dates[0]} ~ ${dates[dates.length - 1]} | ${md(offices.join("; ")) || "pack 직책 기록 없음"} | ${md(evs.map((e) => e.title).join(" / "))} | ${md(signals.join("; ")) || "자동 신호 없음"} |  | PROBABLE_SAME | 같은 표기${p.nameFormVerified ? "(pack 인명록)" : ""}·동일성 진술 없음${(p.possibleSameAs || []).length ? "·동명 분리 사례 있음" : ""} |`), ""
  ].join("\n") + "\n";

  /* ---------- 4. 규칙별 사용 빈도·위험도 ---------- */
  const RECIP = /^RECIPIENT_/;
  const ruleRows = Object.keys(NORMALIZATION_RULES).map((r) => {
    const ts = traces.filter((t) => t.rules.includes(r));
    return { r, uses: ts.length, fromDirect: ts.filter((t) => round1.has(t.relationId)).length,
      recipient: ts.filter((t) => t.flags.some((f) => RECIP.test(f)) || (r === "R1_court_recipient" && t.objectRule === r)).length,
      expansion: ts.filter((t) => r === "R3_who_expansion" && t.members.length).length,
      layer: ts.filter((t) => t.rules.includes("R6_layer_normalize")).length,
      review: ts.filter((t) => t.flags.length).length };
  });
  const r1 = traces.filter((t) => t.rules.includes("R1_court_recipient"));
  const r7rels = idx.contacts.filter((c) => {
    const ev = idx.eventsById[c.eventId];
    return ["DIRECT", "NORMALIZED"].includes(c.evidenceClass) && c.exact && c.tMin === ev.recordDate && ev.dateBasis !== "pack_event_date";
  });
  const basisCount = {};
  select(idx.events, DEFAULT_SCOPE).forEach((e) => (basisCount[e.dateBasis] = (basisCount[e.dateBasis] || 0) + 1));
  out["rule_risk_audit.md"] = [
    "# 정규화 규칙 R1~R7 사용 빈도·위험도 감사", "",
    "> 자동 생성: `node tools/audit-round3.mjs`. '1차 DIRECT → NORMALIZED'는 1차 감사(a461893) 스냅샷 `research/audit3/round1_direct_relations.json`과 비교한 값.",
    "> 한 관계에 규칙이 여러 개 붙을 수 있어 열 합계는 관계 수와 다르다. 위험도 판단은 사람이 한다.", "",
    "| 규칙 | 사용 건수 | 1차 DIRECT → NORMALIZED | 수신자 추정 | 집합→구성원 전개 | layer 선택 개입(R6 동반) | 사람 검토 필요(flag) |", "|---|---|---|---|---|---|---|",
    ...ruleRows.map((x) => `| \`${x.r}\` ${NORMALIZATION_RULES[x.r].title} | ${x.uses} | ${x.fromDirect} | ${x.recipient} | ${x.expansion} | ${x.layer} | ${x.review} |`), "",
    "- 수신자 추정: R1은 원문 수신자 토큰(court 등)을 군주 노드로 바꾼 전부, 그 밖의 규칙은 RECIPIENT_* 검토 표시가 붙은 것.",
    "- 사람 검토 필요: 검토 표시(flag)가 붙은 관계 — `flagged_edges_review.md`.", "",
    "## R1 별도 검토 — '조정 수신자 → 군주 노드'", "",
    `R1이 붙은 관계 ${r1.length}건. 모두 '원문에는 court/central/Ming 등 기관·조정이 수신자, 그래프에서는 군주 개인'이라는 축약이다.`,
    "이 축약은 군주(세종)의 in-degree·도달성·중계 역할을 키운다 — 세종 중심성 해석 시 R1 관계를 빼고 다시 볼 것.", "",
    "| relation | 원문 수신자 토큰 | 정규화 수신자 | 근거 줄 | 검토 표시 |", "|---|---|---|---|---|",
    ...r1.map((t) => `| \`${t.relationId}\` | ${md(t.sourceObject)} | ${P(t.normalizedObject)} | \`${t.locator}\` “${md(t.quote)}” | ${t.flags.join(", ") || "—"} |`), "",
    `- R1 관계 중 세종으로 가는 것 ${r1.filter((t) => t.normalizedObject === "JO_SEJONG").length} · 선덕제로 가는 것 ${r1.filter((t) => t.normalizedObject === "MING_XUANDE").length}`,
    `- 세종의 기본 입력 in-degree 중 R1 관계 비율: ${(() => { const inc = base.contacts.filter((c) => c.target === "JO_SEJONG"); const r1in = inc.filter((c) => idx.traceById[c.id] && idx.traceById[c.id].rules.includes("R1_court_recipient")); return `${r1in.length}/${inc.length}`; })()}`, "",
    "## R7 별도 검토 — '조정 도달 보고의 시각 = 기사일'", "",
    "R7은 2차 감사부터 관계 존재 근거가 아니라 **시각 규칙**으로만 쓴다(관계 규칙 목록에 R7 사용 0건). 대신 아래처럼 시각이 기사일로 정해진 관계가 있다.", "",
    `- 사건 dateBasis(검증 사건): ${Object.entries(basisCount).map(([k, v]) => `${k} ${v}`).join(" · ")}`,
    `- 관계 시각이 '기사일 = 행위·도달일' 관례로 정해진 검증 관계: ${r7rels.length}건 — 사건 dateBasis별 ${Object.entries(r7rels.reduce((m, c) => { const b = idx.eventsById[c.eventId].dateBasis; m[b] = (m[b] || 0) + 1; return m; }, {})).map(([k, v]) => `${k} ${v}`).join(" · ")}`,
    "  - court_act_on_record_date: 조정 논의·명령을 기사일에 일어난 것으로 본 관례 / report_receipt_on_record_date: 보고 접수일 = 기사일 / before_record_date·pack_event_range 안의 기사일 관계: 좁은 의미의 R7(현장 행위와 분리된 조정 도달 시각)",
    `- CERTAIN_ORDER 기본 입력 ${base.contacts.length}건 중 이 관례에 날짜를 의존하는 관계: ${base.contacts.filter((c) => r7rels.some((x) => x.id === c.id)).length}건`, "",
    "| relation | edge | 사건 dateBasis | 관계 시각 |", "|---|---|---|---|",
    ...r7rels.map((c) => `| \`${c.id}\` | ${md(P(c.source))} → ${md(P(c.target))} (${c.layer}) | ${idx.eventsById[c.eventId].dateBasis} | ${c.tMin} |`), "",
    "- 위험: 기사일을 '도달일'로 보는 관례는 같은 날 연쇄(PARTIAL_ORDER)를 만들고, 세종을 거치는 CERTAIN_ORDER 경로가 이 관례에 의존한다.",
    "- court_act_on_record_date·report_receipt_on_record_date 사건의 관계도 같은 관례(기사일 = 행위일)를 쓴다 — 경로 결과 해석 시 함께 고려.", ""
  ].join("\n") + "\n";

  /* ---------- 5. EXPLICIT_CAUSAL 24건 ---------- */
  const causalItems = [
    ...idx.contacts.filter((c) => c.causalStatus === "EXPLICIT_CAUSAL").map((c) => ({ kind: "relation", id: c.id, what: `${P(c.source)} → ${P(c.target)} (${c.layer} · ${c.relationType})`, ev: c.causalEvidence, layer: c.layer })),
    ...DATA.EVENTS.flatMap((e) => (e.eventLinks || []).filter((l) => l.causalStatus === "EXPLICIT_CAUSAL")
      .map((l) => ({ kind: "link", id: `${e.id} ← ${l.eventId}`, what: `${idx.eventsById[l.eventId].title} → ${e.title}`, ev: l.causalEvidence, layer: "—" })))
  ];
  out["explicit_causal_audit.md"] = [
    "# EXPLICIT_CAUSAL 전수 감사", "",
    `> 자동 생성: \`node tools/audit-round3.mjs\` · 대상 ${causalItems.length}건(관계 ${causalItems.filter((x) => x.kind === "relation").length} · 사건 연결 ${causalItems.filter((x) => x.kind === "link").length}).`,
    "> '후보'는 검토 메모(`tools/audit3-notes.mjs`)의 표시이며 데이터는 바꾸지 않았다. STRONG = 원문이 이유를 직접 말함 / REVIEW = 사람 확인 필요 / DOWNGRADE_CANDIDATE = UNKNOWN(또는 COMMAND_RELATION)으로 내릴 후보.", "",
    "| # | 종류 | id | 대상 | 원문 인용(locator) | causal로 본 표현 | 시간 선후·명령 관계와 구분되는 이유 | 후보 | 판정 |",
    "|---|---|---|---|---|---|---|---|---|",
    ...causalItems.map((x, i) => {
      const n = CAUSAL_NOTES[x.ev.locator] || {};
      const cand = (n.candidate || {})[x.kind] || (n.candidate || {}).relation || "REVIEW(메모 없음)";
      const cmd = x.layer === "COMMAND" ? " · COMMAND layer — COMMAND_RELATION 후보" : "";
      return `| ${i + 1} | ${x.kind === "link" ? "사건 연결" : "관계"} | \`${x.id}\` | ${md(x.what)} | “${md(x.ev.quote)}” \`${x.ev.locator}\` | ${md(n.trigger || "—")} | ${md(n.notSequence || "—")} | ${md(cand + cmd)} |  |`;
    }), "",
    `- 후보 집계: STRONG ${causalItems.filter((x) => /^STRONG/.test(((CAUSAL_NOTES[x.ev.locator] || {}).candidate || {})[x.kind] || ((CAUSAL_NOTES[x.ev.locator] || {}).candidate || {}).relation || "")).length} · ` +
      `REVIEW ${causalItems.filter((x) => /^REVIEW/.test(((CAUSAL_NOTES[x.ev.locator] || {}).candidate || {})[x.kind] || ((CAUSAL_NOTES[x.ev.locator] || {}).candidate || {}).relation || "REVIEW")).length} · ` +
      `DOWNGRADE_CANDIDATE ${causalItems.filter((x) => /^DOWNGRADE/.test(((CAUSAL_NOTES[x.ev.locator] || {}).candidate || {})[x.kind] || ((CAUSAL_NOTES[x.ev.locator] || {}).candidate || {}).relation || "")).length}`,
    "- COMMAND layer 관계 중 EXPLICIT_CAUSAL: " + causalItems.filter((x) => x.layer === "COMMAND").length + "건(명령→실행을 인과로 둔 사례 없음).", ""
  ].join("\n") + "\n";

  /* ---------- 미반영 pack 관계 줄 ---------- */
  const covered = new Set(traces.flatMap((t) => [t.locator, ...t.support.map((s) => s.locator)]));
  const notEnc = [];
  for (const e of Object.values(pack.entries)) for (const l of e.sections.RELATIONS || []) {
    const loc = `pack_v1:${e.id}:RELATIONS:L${l.line}`;
    if (covered.has(loc)) continue;
    const toPlace = /->\s*(frontier|Yalu|Hoeryŏng|Puryŏng|frontier territory|military livestock)/.test(l.text);
    const noArrow = !/->/.test(l.text);
    notEnc.push({ loc, text: l.text, kind: noArrow ? "화살표 없는 서술(관계 아님)" : toPlace ? "대상이 지역·물자(인물 관계 아님)" : "인물·기관 사이 관계 — 사람 검토 필요" });
  }
  out["pack_relations_not_encoded.md"] = [
    "# 그래프에 반영되지 않은 pack RELATIONS 줄", "",
    "> 자동 생성: `node tools/audit-round3.mjs`. trace·보조 근거 어디에도 쓰이지 않은 pack 관계 줄 목록. **관계를 새로 추가하지 않는다** — 반영 여부는 사람이 판단한다.",
    "> 이 줄들이 빠져 있다는 것은 해당 인물의 중심성·경로가 과소평가되었을 수 있다는 뜻이다.", "",
    "| locator | 원문 | 분류(자동) | 판정 |", "|---|---|---|---|",
    ...notEnc.map((x) => `| \`${x.loc}\` | “${md(x.text)}” | ${x.kind} |  |`), "",
    `- 합계 ${notEnc.length} · 인물·기관 사이 관계 ${notEnc.filter((x) => x.kind.startsWith("인물")).length}`, ""
  ].join("\n") + "\n";

  return out;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const { DATA } = await import("../src/data/index.js");
  const files = generateAudit3(DATA);
  for (const [f, body] of Object.entries(files)) fs.writeFileSync(new URL(`../research/audit3/${f}`, import.meta.url), body);
  console.log(Object.keys(files).map((f) => `research/audit3/${f}`).join("\n"));
}
