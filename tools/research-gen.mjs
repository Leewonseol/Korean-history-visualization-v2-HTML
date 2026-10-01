/* ==========================================================================
   research/*.md 생성 본문(순수 함수). tools/build-research.mjs가 파일에 쓰고,
   tools/integrity.mjs가 내용 규칙(연도별 coverage 표기, '사건 없음' 금지 등)을 검사한다.
   연도별 조사 상태는 COVERAGE 레지스트리에서 읽는다 — EVENTS 유무로 추론하지 않는다.
   ========================================================================== */
import { buildIndexes } from "../src/model/indexes.js";
import { validateData, sourceUsage } from "../src/model/validate.js";
import {
  LAYERS, SOURCE_TYPES, SOURCE_LEVELS, VERIFICATION, CERTAINTY, AFFILIATIONS, ENTITY_TYPES, THEATERS, DOCUMENT_TYPES,
  COVERAGE_STATUS, PROVENANCE, CAUSAL_STATUS, SOURCE_USAGE, IDENTITY_STATUS
} from "../src/data/vocab.js";
import { yearOf, formatRange } from "../src/model/dates.js";

const md = (s) => String(s ?? "").replace(/\|/g, "\\|").replace(/\n/g, " ");

export function generateResearch(DATA) {
  const idx = buildIndexes(DATA);
  const usage = sourceUsage(DATA);
  const stats = validateData(DATA).stats;
  const P = (id) => (idx.peopleById[id] ? idx.peopleById[id].canonicalName : id);
  const out = { "chronology_1432_1449.md": {}, "sources.md": {}, "people_authority.md": {}, "discrepancies.md": {}, "methodology.md": {} };

  /* ---------- chronology: 연도별 coverage + 데이터셋 사건 ---------- */
  for (const cov of DATA.COVERAGE) {
    const y = cov.year;
    const evs = idx.events.filter((e) => yearOf(idx.sortDateOf(e)) === y);
    const head = [
      `- Coverage: \`${cov.coverageStatus}\` — ${COVERAGE_STATUS[cov.coverageStatus]}${cov.coverageStatus === "NOT_COVERED" ? "" : ` · completeness \`${cov.completeness}\``}${cov.scope !== "full_year" ? ` · 범위 ${cov.scope}` : ""}`,
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
  out["methodology.md"].STATS = [
    `- 사건 ${idx.events.length} · 행위자 ${DATA.PEOPLE.length} · 장소 ${DATA.PLACES.length} · 사료 ${DATA.SOURCES.length} · relation(edge) ${idx.contacts.length} · 관직·역할 증언 ${DATA.PERSON_ATTESTATIONS.length}`,
    `- relation 근거: pack v1 검증 ${stats.relationsVerified} · legacy ${stats.relationsLegacy} · 해석 ${stats.relationsInterpretation} · 출처 불명 ${stats.relationsUnknown} · 사료 없는 relation ${stats.relationsWithoutSource}`,
    `- 일 단위 확정 relation ${idx.contacts.filter((c) => c.exact).length} · 범위/미상 ${idx.contacts.filter((c) => !c.exact).length} · 하한 미상(기사일 이전) ${idx.contacts.filter((c) => c.tMin === null).length}`,
    `- undirected ${idx.contacts.filter((c) => c.direction === "undirected").length} · 경로 제외('~에 관한') ${idx.contacts.filter((c) => !c.pathEligible).length}`,
    "", "| provenance | edge 수 |", "|---|---|", ...Object.keys(PROVENANCE).map((k) => `| ${k} | ${Pv[k] || 0} |`),
    "", "| causalStatus | edge 수 |", "|---|---|", ...Object.keys(CAUSAL_STATUS).map((k) => `| ${k} | ${Cs[k] || 0} |`),
    "", "| layer | edge 수 |", "|---|---|", ...Object.keys(LAYERS).map((l) => `| ${l} (${LAYERS[l].label}) | ${L[l] || 0} |`),
    "", "| certainty | edge 수 |", "|---|---|", ...Object.keys(CERTAINTY).map((c) => `| ${c} | ${Cc[c] || 0} |`)
  ].join("\n");
  return out;
}
