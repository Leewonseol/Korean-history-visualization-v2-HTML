#!/usr/bin/env node
/* ==========================================================================
   research/*.md 의 표 부분을 데이터에서 다시 생성한다(손으로 중복 관리하지 않기 위해).
   각 파일의  <!-- GENERATED:name --> … <!-- /GENERATED:name -->  사이만 교체한다.
   사용법: node tools/build-research.mjs
   ========================================================================== */
import fs from "node:fs";
import { DATA } from "../src/data/index.js";
import { buildIndexes } from "../src/model/indexes.js";
import { LAYERS, SOURCE_TYPES, SOURCE_LEVELS, VERIFICATION, CERTAINTY, AFFILIATIONS, ENTITY_TYPES, THEATERS, DOCUMENT_TYPES } from "../src/data/vocab.js";
import { yearOf } from "../src/model/dates.js";

const idx = buildIndexes(DATA);
const md = (s) => String(s ?? "").replace(/\|/g, "\\|").replace(/\n/g, " ");
const P = (id) => (idx.peopleById[id] ? idx.peopleById[id].canonicalName : id);

function replace(file, name, body) {
  const path = new URL(`../research/${file}`, import.meta.url);
  const src = fs.readFileSync(path, "utf8");
  const re = new RegExp(`(<!-- GENERATED:${name} -->)[\\s\\S]*?(<!-- /GENERATED:${name} -->)`);
  if (!re.test(src)) throw new Error(`${file}: marker ${name} 없음`);
  fs.writeFileSync(path, src.replace(re, `$1\n${body.trim()}\n$2`));
}

/* ---------- chronology: 연도별 데이터셋 사건 ---------- */
for (let y = 1432; y <= 1449; y++) {
  const evs = idx.events.filter((e) => yearOf(e.eventDate) === y);
  const body = evs.length
    ? evs.map((e) => {
        const actors = [...new Set([...e.actors, ...e.targets])].map(P).join(", ");
        const places = e.placeIds.map((p) => idx.placesById[p].canonicalName).join(", ") || "불명";
        const src = e.sourceIds.map((s) => `[${s}](${idx.sourcesById[s].url})`).join(", ");
        return `- **${e.eventDate}**${e.recordDate !== e.eventDate ? ` (기록 ${e.recordDate})` : ""} — ${md(e.title)} · \`${e.id}\` · ${CERTAINTY[e.certainty].badge} · ${VERIFICATION[e.verification]}\n  - 인물: ${actors}\n  - 장소: ${places} (${e.theater.map((t) => THEATERS[t].label).join(", ")})\n  - 사료: ${src}`;
      }).join("\n")
    : "- (데이터셋에 이 연도의 사건 없음)";
  replace("chronology_1432_1449.md", `Y${y}`, body);
}

/* ---------- sources ---------- */
const supports = {};
idx.events.forEach((e) => e.sourceIds.forEach((s) => (supports[s] ||= []).push(e.id)));
const rows = DATA.SOURCES.map((s) => `| \`${s.id}\` | [${md(s.title)}](${s.url}) | ${SOURCE_TYPES[s.sourceType]} | ${SOURCE_LEVELS[s.sourceLevel]} | ${s.date || "—"} | ${s.documentType ? DOCUMENT_TYPES[s.documentType] : "—"} | ${md(s.authorOrReporter || "—")} | ${VERIFICATION[s.verification]} | ${(supports[s.id] || []).map((e) => `\`${e}\``).join(" ") || "—"} |`);
replace("sources.md", "SOURCES", `| id | 사료 | 유형 | 수준 | 게재일 | 문서유형 | 작성·보고자 | 검증 상태 | 지지하는 event |\n|---|---|---|---|---|---|---|---|---|\n${rows.join("\n")}`);
const byType = {};
DATA.SOURCES.forEach((s) => (byType[s.sourceType] = (byType[s.sourceType] || 0) + 1));
replace("sources.md", "SOURCE_COUNTS", Object.keys(SOURCE_TYPES).map((t) => `- ${SOURCE_TYPES[t]} (\`${t}\`): ${byType[t] || 0}`).join("\n"));

/* ---------- people authority ---------- */
const pRows = DATA.PEOPLE.map((p) => {
  const states = (idx.statesByPerson[p.personId] || []).map((s) => `${s.startDate}~${s.endDate || ""} ${s.level} ${s.office}`).join("; ");
  const srcs = [...(idx.sourcesByPerson[p.personId] || [])].map((s) => `\`${s}\``).join(" ");
  return `| \`${p.personId}\` | ${md(p.canonicalName)} | ${p.hanja ? md(p.hanja) + (p.hanjaVerified ? "" : "*") : "—"} | ${p.aliases.map(md).join(", ") || "—"} | ${ENTITY_TYPES[p.entityType].label} | ${AFFILIATIONS[p.affiliation].label} | ${p.defaultLevel} | ${md(states) || "—"} | ${idx.firstSeen[p.personId] || "—"} | ${idx.lastSeen[p.personId] || "—"} | ${srcs} | ${md(p.identityNote) || "—"} | ${p.identityCertainty} |`;
});
replace("people_authority.md", "PEOPLE", `| personId | canonicalName | hanja | aliases | entityType | affiliation | 기본 level | 관직·level 변화 | firstSeen | lastSeen | sourceIds | identityNote | identityCertainty |\n|---|---|---|---|---|---|---|---|---|---|---|---|---|\n${pRows.join("\n")}`);
const cnt = {};
DATA.PEOPLE.forEach((p) => (cnt[p.entityType] = (cnt[p.entityType] || 0) + 1));
replace("people_authority.md", "PEOPLE_COUNTS", Object.entries(cnt).map(([k, v]) => `- ${ENTITY_TYPES[k].label}: ${v}`).join("\n") + `\n- 합계: ${DATA.PEOPLE.length}`);

/* ---------- discrepancies ---------- */
replace("discrepancies.md", "DISCREPANCIES", DATA.DISCREPANCIES.map((d) => `### ${d.id} ${d.title}\n- 유형: \`${d.type}\` · 상태: \`${d.status}\`\n- 관련 event: ${d.eventIds.map((e) => `\`${e}\``).join(", ")}\n- ${d.detail}`).join("\n\n"));

/* ---------- 통계(README용) ---------- */
const layerCounts = {};
idx.contacts.forEach((c) => (layerCounts[c.layer] = (layerCounts[c.layer] || 0) + 1));
const certCounts = {};
idx.contacts.forEach((c) => (certCounts[c.certainty] = (certCounts[c.certainty] || 0) + 1));
replace("methodology.md", "STATS", [
  `- 사건 ${idx.events.length} · 행위자 ${DATA.PEOPLE.length} · 장소 ${DATA.PLACES.length} · 사료 ${DATA.SOURCES.length} · relation(edge) ${idx.contacts.length} · 인물 상태 ${DATA.PERSON_STATES.length}`,
  "", "| layer | edge 수 |", "|---|---|",
  ...Object.keys(LAYERS).map((l) => `| ${l} (${LAYERS[l].label}) | ${layerCounts[l] || 0} |`),
  "", "| certainty | edge 수 |", "|---|---|",
  ...Object.keys(CERTAINTY).map((c) => `| ${c} | ${certCounts[c] || 0} |`)
].join("\n"));
console.log("research tables regenerated");
