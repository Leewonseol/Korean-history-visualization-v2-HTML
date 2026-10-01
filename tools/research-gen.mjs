/* ==========================================================================
   research/*.md 생성 본문(순수 함수). tools/build-research.mjs가 파일에 쓰고,
   tools/integrity.mjs가 내용 규칙(연도별 coverage 표기, '사건 없음' 금지 등)을 검사한다.
   연도별 조사 상태는 COVERAGE 레지스트리에서 읽는다 — EVENTS 유무로 추론하지 않는다.
   근거 등급 필터는 model/evidence.js(단일 선택기)만 사용한다. 수치는 모두 데이터에서 계산한다(하드코딩 금지).
   반환값의 __files는 파일 전체를 생성하는 문서(normalization_rules.md, normalized_edges_audit.md).
   ========================================================================== */
import { buildIndexes } from "../src/model/indexes.js";
import { validateData, sourceUsage } from "../src/model/validate.js";
import {
  LAYERS, SOURCE_TYPES, SOURCE_LEVELS, VERIFICATION, CERTAINTY, AFFILIATIONS, ENTITY_TYPES, THEATERS, DOCUMENT_TYPES,
  COVERAGE_STATUS, PROVENANCE, CAUSAL_STATUS, SOURCE_USAGE, IDENTITY_STATUS, COVERAGE_SCOPE,
  EVIDENCE_CLASS, EVIDENCE_CLASS_ORDER, NORMALIZATION_RULES, PACK_LABEL_LAYERS, evidenceClassOf, IDENTITY_UNRESOLVED
} from "../src/data/vocab.js";
import { analysisContacts } from "../src/model/temporalNetwork.js";
import { select, countByClass, DEFAULT_SCOPE } from "../src/model/evidence.js";
import { missingnessReport } from "../src/analysis/missingness.js";
import { mergeSensitivity, unresolvedNodeCount } from "../src/analysis/identitySensitivity.js";
import { yearOf, formatRange } from "../src/model/dates.js";

const md = (s) => String(s ?? "").replace(/\|/g, "\\|").replace(/\n/g, " ");

export function generateResearch(DATA) {
  const idx = buildIndexes(DATA);
  const usage = sourceUsage(DATA);
  const stats = validateData(DATA).stats;
  const P = (id) => (idx.peopleById[id] ? idx.peopleById[id].canonicalName : id);
  const out = { "chronology_1432_1449.md": {}, "sources.md": {}, "people_authority.md": {}, "discrepancies.md": {}, "methodology.md": {}, __files: {} };
  const WIN = { from: "1432-00-00", to: "1449-99-99" };
  const base = analysisContacts(idx, WIN, "CERTAIN_ORDER");          // 기본 근거 범위(DIRECT+NORMALIZED)
  const classLine = (c) => EVIDENCE_CLASS_ORDER.map((k) => `${EVIDENCE_CLASS[k].label} ${c[k] || 0}`).join(" · ");

  /* ---------- chronology: 연도별 coverage + 데이터셋 사건 ---------- */
  for (const cov of DATA.COVERAGE) {
    const y = cov.year;
    const evs = idx.events.filter((e) => yearOf(idx.sortDateOf(e)) === y);
    const head = [
      `- Coverage: \`${cov.coverageStatus}\` — ${COVERAGE_STATUS[cov.coverageStatus]}${cov.coverageStatus === "NOT_COVERED" ? "" : ` · completeness \`${cov.completeness}\``}${cov.scope !== "full_year" ? ` · 범위 ${cov.scope}` : ""}`,
      `- Scope: \`${cov.scopeStatus}\` — ${COVERAGE_SCOPE[cov.scopeStatus]}${cov.scopeStatus === "PARTIAL" ? ` **⚠ 부분 조사 연도(${cov.scope}): 사건·관계 수를 FULL 연도와 단순 비교하지 말 것.**` : cov.scopeStatus === "NONE" ? " **⚠ NA — 0이 아님.**" : ""}`,
      `- Sources: ${cov.sourceIds.length ? cov.sourceIds.map((s) => `\`${s}\``).join(", ") : "없음(pack v1 미제공)"}${cov.geographySourceIds.length ? ` · 지리지 ${cov.geographySourceIds.map((s) => `\`${s}\``).join(", ")}` : ""}`,
      `- Note: ${cov.note || "pack v1 검증 기사만 수록. 이 연도의 전체 사건 목록이 아님."}`
    ];
    const line = (e) => {
      const actors = [...new Set([...e.actors, ...e.targets])].map(P).join(", ");
      const places = e.placeIds.map((p) => idx.placesById[p].canonicalName).join(", ") || "pack에 장소 없음";
      const src = e.sourceIds.map((s) => `[${s}](${idx.sourcesById[s].url})`).join(", ");
      return `- **${formatRange(e.dateMin, e.dateMax, e.datePrecision)}** \`${e.datePrecision}\`${e.recordDate && !(e.dateMin === e.recordDate && e.dateMax === e.recordDate) ? ` (기사 ${e.recordDate})` : ""} — ${md(e.title)} · \`${e.id}\` · ${CERTAINTY[e.certainty].badge} · ${PROVENANCE[e.provenance].label}\n  - 인물: ${actors}\n  - 장소: ${places} (${e.theater.map((t) => THEATERS[t].label).join(", ")})\n  - 사료: ${src}`;
    };
    const ver = evs.filter((e) => idx.evidenceOfEvent(e) === "verified"), leg = evs.filter((e) => idx.evidenceOfEvent(e) !== "verified");
    const body = [...head,
      ver.length ? `\n**pack v1 검증 사건 (${ver.length})**\n\n${ver.map(line).join("\n")}` : "",
      leg.length ? `\n**legacy(v2 이관·anchor 시드) 사건 (${leg.length}) — 검증 데이터 아님**\n\n${leg.map(line).join("\n")}` : ""
    ].filter(Boolean).join("\n");
    out["chronology_1432_1449.md"][`Y${y}`] = body;
  }

  /* ---------- sources ---------- */
  const supports = {};
  idx.events.forEach((e) => e.sourceIds.forEach((s) => (supports[s] ||= []).push(e.id)));
  const rows = DATA.SOURCES.map((s) => `| \`${s.id}\` | [${md(s.title)}](${s.url}) | ${SOURCE_TYPES[s.sourceType]} | ${SOURCE_LEVELS[s.sourceLevel]} | ${s.date || "—"} | ${s.documentType ? DOCUMENT_TYPES[s.documentType] : "—"} | ${md(s.authorOrReporter || "—")} | ${VERIFICATION[s.verification]} | \`${usage[s.id].status}\` ${md(usage[s.id].message)} | ${(supports[s.id] || []).map((e) => `\`${e}\``).join(" ") || "—"} |`);
  out["sources.md"].SOURCES = `| id | 사료 | 유형 | 수준 | 게재일 | 문서유형 | 작성·보고자 | 검증 상태 | 사용 상태 | 지지하는 event |\n|---|---|---|---|---|---|---|---|---|---|\n${rows.join("\n")}`;
  const byType = {}, byUsage = {};
  DATA.SOURCES.forEach((s) => { byType[s.sourceType] = (byType[s.sourceType] || 0) + 1; byUsage[usage[s.id].status] = (byUsage[usage[s.id].status] || 0) + 1; });
  out["sources.md"].SOURCE_COUNTS = [
    ...Object.keys(SOURCE_TYPES).map((t) => `- ${SOURCE_TYPES[t]} (\`${t}\`): ${byType[t] || 0}`),
    "", "사용 상태(SOURCE_USAGE):",
    ...Object.keys(SOURCE_USAGE).map((u) => `- \`${u}\` ${SOURCE_USAGE[u]}: ${byUsage[u] || 0}`)
  ].join("\n");

  /* ---------- people authority ---------- */
  const pRows = DATA.PEOPLE.map((p) => {
    const atts = (idx.attestationsByPerson[p.personId] || []).map((a) => `${a.attestedDate} ${a.level} ${a.office} (${PROVENANCE[a.provenance].label})`).join("; ");
    const srcs = [...(idx.sourcesByPerson[p.personId] || [])].map((s) => `\`${s}\``).join(" ");
    const id = idx.identityOf[p.personId];
    return `| \`${p.personId}\` | ${md(p.canonicalName)} | ${p.hanja ? md(p.hanja) : "—"} | ${p.nameFormVerified ? "pack" : "—"} | \`${id.status}\`${id.basis === "declared" ? "" : " (계산)"} | ${(p.possibleSameAs || []).map((q) => `\`${q}\``).join(" ") || "—"} | ${ENTITY_TYPES[p.entityType].label} | ${AFFILIATIONS[p.affiliation].label} | ${p.defaultLevel} | ${md(atts) || "—"} | ${idx.firstSeen[p.personId] || "—"} | ${idx.lastSeen[p.personId] || "—"} | ${PROVENANCE[p.provenance].label} | ${srcs} | ${md(p.identityNote) || "—"} |`;
  });
  out["people_authority.md"].PEOPLE = `| personId | canonicalName | hanja | 표기 근거 | identityStatus | possibleSameAs | entityType | affiliation | 기본 level | 관직·역할 증언 | firstSeen(검증) | lastSeen(검증) | provenance | sourceIds | identityNote |\n|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|\n${pRows.join("\n")}`;
  const cnt = {}, idc = {};
  DATA.PEOPLE.forEach((p) => { cnt[p.entityType] = (cnt[p.entityType] || 0) + 1; const s = idx.identityOf[p.personId].status; idc[s] = (idc[s] || 0) + 1; });
  out["people_authority.md"].PEOPLE_COUNTS = [
    ...Object.entries(cnt).map(([k, v]) => `- ${ENTITY_TYPES[k].label}: ${v}`), `- 합계: ${DATA.PEOPLE.length}`,
    "", "identityStatus:", ...Object.keys(IDENTITY_STATUS).map((k) => `- \`${k}\` ${IDENTITY_STATUS[k]}: ${idc[k] || 0}`)
  ].join("\n");

  /* ---------- discrepancies ---------- */
  out["discrepancies.md"].DISCREPANCIES = DATA.DISCREPANCIES.map((d) => `### ${d.id} ${d.title}\n- 유형: \`${d.type}\` · 상태: \`${d.status}\`\n- 관련 event: ${d.eventIds.map((e) => `\`${e}\``).join(", ")}\n- ${d.detail}`).join("\n\n");

  /* ---------- 통계 ---------- */
  const count = (key) => { const m = {}; idx.contacts.forEach((c) => (m[key(c)] = (m[key(c)] || 0) + 1)); return m; };
  const L = count((c) => c.layer), Cc = count((c) => c.certainty), Pv = count((c) => c.provenance), Cs = count((c) => c.causalStatus);
  const all = countByClass(idx.contacts), baseC = countByClass(base.contacts);
  out["methodology.md"].STATS = [
    `- 사건 ${idx.events.length} · 행위자 ${DATA.PEOPLE.length} · 장소 ${DATA.PLACES.length} · 사료 ${DATA.SOURCES.length} · relation(edge) ${idx.contacts.length} · 관직·역할 증언 ${DATA.PERSON_ATTESTATIONS.length}`,
    `- relation 근거 등급: ${classLine(all)}`,
    `  - '사료 id가 붙어 있음'과 '원문에 관계가 직접 나타남'은 다르다. 사료 id가 비어 있는 relation 수(${stats.relationsWithoutSource})는 형식 검사일 뿐 직접 입증 수가 아니다.`,
    `- 기본 지표 입력(1432~1449 전체 창, CERTAIN_ORDER, ${DEFAULT_SCOPE.label}): ${base.contacts.length} — ${classLine(baseC)}; 시각 불확실 제외 ${base.excludedUncertain} · '~에 관한' 제외 ${base.excludedAbout}`,
    `- 원문 추적(trace)이 있는 관계 ${DATA.RELATION_TRACES.length} (DIRECT+NORMALIZED 전부) — research/normalized_edges_audit.md`,
    `- 일 단위 확정 relation ${idx.contacts.filter((c) => c.exact).length} · 범위/미상 ${idx.contacts.filter((c) => !c.exact).length} · 하한 미상(기사일 이전) ${idx.contacts.filter((c) => c.tMin === null).length}`,
    `- undirected ${idx.contacts.filter((c) => c.direction === "undirected").length} · 경로 제외('~에 관한') ${idx.contacts.filter((c) => !c.pathEligible).length}`,
    "", "| provenance | edge 수 |", "|---|---|", ...Object.keys(PROVENANCE).map((k) => `| ${k} | ${Pv[k] || 0} |`),
    "", "| causalStatus | edge 수 |", "|---|---|", ...Object.keys(CAUSAL_STATUS).map((k) => `| ${k} | ${Cs[k] || 0} |`),
    "", "| layer | edge 수 |", "|---|---|", ...Object.keys(LAYERS).map((l) => `| ${l} (${LAYERS[l].label}) | ${L[l] || 0} |`),
    "", "| certainty | edge 수 |", "|---|---|", ...Object.keys(CERTAINTY).map((c) => `| ${c} | ${Cc[c] || 0} |`)
  ].join("\n");

  /* ---------- missingness (시각 불확실로 기본 지표에서 빠지는 관계) ---------- */
  const m = missingnessReport(base, { topPeople: 15 });
  const mtab = (title, rows, label = (k) => k) => [`| ${title} | 포함 | 제외 | 제외율 |`, "|---|---|---|---|",
    ...rows.map((r) => `| ${md(label(r.key || r.id))} | ${r.included} | ${r.excluded} | ${(r.excludedShare * 100).toFixed(0)}% |`)].join("\n");
  out["methodology.md"].MISSINGNESS = [
    `기본 지표(1432~1449 전체 창, CERTAIN_ORDER, ${DEFAULT_SCOPE.label})에서 화면 관계 ${base.shown.length} 중 포함 **${m.included}** · 시각 불확실로 제외 **${m.excludedUncertain}** · '~에 관한' 관계 제외 **${m.excludedAbout}**.`,
    "제외가 특정 범주에 몰리면 그 범주의 행위자·관계 유형이 지표에서 체계적으로 과소평가될 수 있다(편향 여부 판단은 사람이 한다).",
    "", mtab("근거 등급", m.byEvidenceClass), "", mtab("시각 형태", m.byTimeShape), "", mtab("layer", m.byLayer),
    "", mtab("relation type", m.byRelationType), "", mtab("인물(제외 많은 순)", m.byPerson.map((p) => ({ ...p, key: p.id })), P)
  ].join("\n");

  /* ---------- 연도별 집계(coverage 범위 경고 포함) ---------- */
  const yrows = DATA.COVERAGE.map((c) => {
    const evs = select(idx.events, DEFAULT_SCOPE).filter((e) => yearOf(idx.sortDateOf(e)) === c.year);
    const cs = select(idx.contacts, DEFAULT_SCOPE).filter((x) => x.anchor && yearOf(x.anchor) === c.year);
    const na = c.scopeStatus === "NONE";
    return `| ${c.year} | ${c.scopeStatus}${c.scopeStatus === "PARTIAL" ? ` (${c.scope}) ⚠` : ""} | ${na ? "NA" : evs.length} | ${na ? "NA" : cs.filter((x) => x.evidenceClass === "DIRECT").length} | ${na ? "NA" : cs.filter((x) => x.evidenceClass === "NORMALIZED").length} |`;
  });
  out["methodology.md"].YEARLY = [
    "> ⚠ **조사 범위가 완전하지 않다.** 모든 연도는 seed 기사만 담고 있으며(전수 아님), PARTIAL 연도는 연도의 일부 기간만 조사 범위다.",
    "> 연도 사이의 사건·관계 수 차이를 실제 활동량 차이로 읽지 말 것. NONE 연도는 NA(미조사/미수록)이며 0이 아니다.",
    "", "| 연도 | 조사 범위 | 검증 사건 | 직접 관계 | 규칙 파생 관계 |", "|---|---|---|---|---|", ...yrows
  ].join("\n");

  /* ---------- 동일성 미해결·병합 민감도 ---------- */
  const persons = DATA.PEOPLE.filter((p) => p.entityType === "person").map((p) => p.personId);
  const un = unresolvedNodeCount(idx, persons);
  const ms = mergeSensitivity(idx, base.contacts, WIN, { scope: base.scope });
  out["people_authority.md"].IDENTITY_SENSITIVITY = [
    `- 동일성 미해결 인물 노드(identity unresolved node count): **${un.unresolved}** / 인물 ${un.persons} (${[...IDENTITY_UNRESOLVED].join(" · ")})`,
    `- 기본 지표 입력에서 두 사건 이상에 걸친 PROBABLE_SAME 노드를 사건별로 쪼갰을 때(기준 도달 쌍 ${ms.baselineReachablePairs}):`,
    "", "| 노드 | 창 안 사건 수 | 끊기는 도달 쌍 | betweenness(병합) | betweenness(분리 합) | 예 |", "|---|---|---|---|---|---|",
    ...ms.rows.map((r) => `| ${P(r.id)} \`${r.id}\` | ${r.events} | ${r.reachablePairsLost} | ${r.betweennessMerged.toFixed(2)} | ${r.betweennessSplitSum.toFixed(2)} | ${r.lostExamples.map((x) => x.split(">").map(P).join("→")).join("; ") || "—"} |`),
    "", "끊기는 도달 쌍이 있는 노드의 경로·중심성은 '같은 이름 = 같은 사람' 가정에 의존한다. 분석 탭의 경로 결과는 이런 지점을 '동일성 가정'으로 표시한다."
  ].join("\n");

  /* ---------- 정규화 규칙 명세(파일 전체) ---------- */
  const ruleUse = {};
  DATA.RELATION_TRACES.forEach((t) => t.rules.forEach((r) => (ruleUse[r] = (ruleUse[r] || 0) + 1)));
  out.__files["normalization_rules.md"] = [
    "# 정규화 규칙 formal specification (R1~R7)", "",
    "> 자동 생성: `node tools/build-research.mjs` — 원본은 `src/data/vocab.js`의 `NORMALIZATION_RULES`·`PACK_LABEL_LAYERS`.",
    "> 이 규칙들은 pack v1 원문을 그래프 표현으로 옮기는 **변환 규칙**이며, 새 사실을 만드는 규칙이 아니다. 목록 밖의 변환은 INTERPRETATION이다.", "",
    "## 근거 등급", "", ...EVIDENCE_CLASS_ORDER.map((k) => `- **${k}** — ${EVIDENCE_CLASS[k].label} (provenance: ${EVIDENCE_CLASS[k].provenance.join(", ")})`),
    "", "DIRECT는 pack RELATIONS 줄에 주체·객체가 이름(또는 자리표시자 'state/Joseon/court(주체)' → `ORG_JOSEON_COURT`)으로 그대로 있고 라벨→layer가 일대일인 경우뿐이다.",
    "시각 규칙(R7)은 관계의 존재 근거가 아니라 시각 근거라서 근거 등급을 바꾸지 않는다(dateBasis로 따로 기록).", "",
    ...Object.entries(NORMALIZATION_RULES).flatMap(([id, r]) => [
      `## ${id} — ${r.title}`, "", `| 항목 | 내용 |`, "|---|---|",
      `| rule_id | \`${id}\` |`, `| 바꾸는 부분 | ${r.endpoint} |`, `| 입력 원문 패턴 | ${md(r.inputPattern)} |`,
      `| 생성 가능한 relation | ${md(r.produces)} |`, `| 방향 결정 | ${md(r.direction)} |`, `| 양방향 허용 | ${md(String(r.bidirectional))} |`,
      `| causal edge 생성 | ${r.causalEdge ? "가능" : "불가 — 규칙은 인과를 만들지 않음"} |`,
      `| 금지 사례 | ${r.forbidden.map(md).join("<br>")} |`, `| 예시 | 원문 “${md(r.example.quote)}” → ${md(r.example.edge)} |`,
      `| 현재 적용 관계 수 | ${ruleUse[id] || 0} |`, ""]),
    "## R6 라벨 → layer 표", "", "| pack 라벨 | 허용 layer |", "|---|---|",
    ...Object.entries(PACK_LABEL_LAYERS).map(([k, v]) => `| ${k} | ${v.join(", ")}${v.length > 1 ? " (선택 시 R6)" : ""} |`)
  ].join("\n") + "\n";

  /* ---------- 정규화 관계 감사표(파일 전체): 원문 → 규칙 → 생성된 edge ---------- */
  const relOf = Object.fromEntries(idx.contacts.map((c) => [c.id, c]));
  const traceRow = (t) => {
    const c = relOf[t.relationId];
    return [
      `### \`${t.relationId}\` — ${md(P(c.source))} → ${md(P(c.target))} (${c.layer} · \`${c.relationType}\`)`, "",
      `1. **원문** \`${t.locator}\` (${t.sourceId}): “${md(t.quote)}”`,
      `   - 원문 주체/객체: ${md(t.sourceSubject)} → ${md(t.sourceObject)}`,
      ...t.members.map((x) => `   - 구성원 근거 \`${x.locator}\`: “${md(x.quote)}”`),
      ...t.support.map((x) => `   - 보조 근거 \`${x.locator}\`: “${md(x.quote)}”`),
      `2. **규칙** ${t.rules.map((r) => `\`${r}\``).join(" + ")}${t.subjectRule ? ` · 주체 ${t.subjectRule}` : ""}${t.objectRule ? ` · 객체 ${t.objectRule}` : ""}`,
      `3. **생성된 edge** \`${c.source}\` → \`${c.target}\` · ${c.layer} · 시각 ${formatRange(c.tMin, c.tMax)} · 확실성 ${c.certainty} · 인과 ${c.causalStatus}${c.pathEligible ? "" : " · 경로 제외"}`,
      t.flags.length ? `- ⚑ 검토 표시: ${t.flags.join(", ")}` : "",
      "- 사람 검토: ☐ 원문과 일치 ☐ 규칙 적용 적절 ☐ 수정 필요 — 메모:", ""
    ].filter((x) => x !== "").join("\n");
  };
  const norm = DATA.RELATION_TRACES.filter((t) => t.rules.length), direct = DATA.RELATION_TRACES.filter((t) => !t.rules.length);
  out.__files["normalized_edges_audit.md"] = [
    "# 정규화 관계 감사표 (normalized edges audit)", "",
    "> 자동 생성: `node tools/build-research.mjs` — 원본 `src/data/relationTraces.js`, 원문 `research/pack_v1/source_pack_v1.txt`.",
    "> **이 문서는 '정상' 판정을 내리지 않는다.** 각 관계를 원문 → 규칙 → 생성된 edge 순서로 보여 주고, 사람이 검토란을 채운다.",
    "> quote는 tools/integrity.mjs가 원문 파일의 해당 줄과 글자 그대로 대조한다.", "",
    `- NORMALIZED ${norm.length} · DIRECT ${direct.length} (전체 relation 근거 등급: ${classLine(all)})`,
    `- 규칙별 적용 수: ${Object.keys(NORMALIZATION_RULES).map((r) => `${r} ${ruleUse[r] || 0}`).join(" · ")}`,
    `- 검토 표시(flag)가 붙은 관계: ${DATA.RELATION_TRACES.filter((t) => t.flags.length).length}`, "",
    "## NORMALIZED 관계", "", norm.map(traceRow).join("\n\n"), "",
    "## DIRECT 관계(참고 — 규칙 없이 원문 RELATIONS 줄 그대로)", "", "| relation | 원문 | edge |", "|---|---|---|",
    ...direct.map((t) => { const c = relOf[t.relationId]; return `| \`${t.relationId}\` | \`${t.locator}\` “${md(t.quote)}” | ${md(P(c.source))} → ${md(P(c.target))} (${c.layer}) |`; })
  ].join("\n") + "\n";
  return out;
}
