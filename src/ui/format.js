/* 패널 공통 렌더링 헬퍼 */
import { CERTAINTY, LAYERS, LEVELS, SOURCE_TYPES, SOURCE_LEVELS, VERIFICATION, CAUSAL_STATUS, DOCUMENT_TYPES,
  PROVENANCE, EVIDENCE_STATUS, DERIVATION_RULES, DIRECTION_POLICY, SOURCE_USAGE } from "../data/vocab.js";
import { formatDate, formatRange } from "../model/dates.js";

export const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

export function personLink(idx, id, date) {
  const p = idx.peopleById[id];
  if (!p) return `<span class="missing">${esc(id)}</span>`;
  const lv = date ? idx.levelAt(id, date) : p.defaultLevel;
  return `<button type="button" class="plink" data-person="${esc(id)}" title="${esc(LEVELS[lv] ? LEVELS[lv].label : "")}">${esc(p.canonicalName)}<sup>${lv}</sup></button>`;
}
export function eventLink(idx, id) {
  const e = idx.eventsById[id];
  return e ? `<button type="button" class="elink" data-event="${esc(id)}">${esc(eventDateLabel(e))} ${esc(e.title)}</button>` : esc(id);
}
// 사건 날짜 짧은 표기(가짜 정밀도 없이)
export function eventDateLabel(e) {
  if (e.datePrecision === "YEAR") return `${e.dateMin.slice(0, 4)}년`;
  if (e.datePrecision === "MONTH") return `${e.dateMin.slice(0, 7)}월`;
  if (e.dateMin == null && e.dateMax) return `~${e.dateMax}`;
  if (e.dateMin && e.dateMax && e.dateMin !== e.dateMax) return `${e.dateMin}~${e.dateMax.slice(5)}`;
  return e.dateMin || e.recordDate || "?";
}
export function evidenceBadge(prov) {
  const g = PROVENANCE[prov] ? PROVENANCE[prov].group : "unknown";
  return `<span class="ev-badge evb-${esc(g)}" title="${esc(EVIDENCE_STATUS[g])}">${esc(PROVENANCE[prov] ? PROVENANCE[prov].label : prov)}</span>`;
}
export function certBadge(c) {
  const x = CERTAINTY[c] || { badge: c, label: c };
  return `<span class="badge badge-${esc(c)}" title="${esc(x.label)}">${esc(x.badge)}</span>`;
}
export function layerChip(l) {
  return `<span class="layer-chip" style="--c:${LAYERS[l] ? LAYERS[l].color : "#999"}">${esc(LAYERS[l] ? LAYERS[l].label : l)}</span>`;
}
export function sourceLink(idx, id) {
  const s = idx.sourcesById[id];
  if (!s) return esc(id);
  const doc = s.documentType && s.documentType !== "article" ? ` · ${DOCUMENT_TYPES[s.documentType]}` : "";
  const u = idx.sourceUsage && idx.sourceUsage[id];
  return `<a href="${esc(s.url)}" target="_blank" rel="noopener" class="src-link">${esc(s.title)}</a>
    <span class="src-meta">${esc(SOURCE_TYPES[s.sourceType])} · ${esc(SOURCE_LEVELS[s.sourceLevel])}${doc} · <span class="verif verif-${esc(s.verification)}">${esc(VERIFICATION[s.verification] || "")}</span>${u ? ` · <span class="usage usage-${esc(u.status)}" title="${esc(u.message)}">${esc(SOURCE_USAGE[u.status])}</span>` : ""}</span>`;
}
// 관계 한 줄: Layer · Direction · Source · Evidence status · Certainty · Causal status (+ 시각 범위, 경로 대상 여부)
export function relationLine(idx, c, opts = {}) {
  const arrow = c.direction === "undirected" ? "↔" : "→";
  const dirTitle = c.direction === "undirected" ? `양방향 — 근거: ${c.directionEvidence || "없음"}` : `방향 있음(layer 정책: ${DIRECTION_POLICY[c.layer]})`;
  const srcs = c.sourceIds.map((s) => `<span class="src-id" title="${esc(idx.sourcesById[s] ? idx.sourcesById[s].title : s)}">${esc(s)}</span>`).join(" ");
  return `<li class="rel-line ev-${esc(c.evidenceStatus)}">
    <span class="rel-date" title="${c.exact ? "일 단위 확정" : "범위·미상 — 정확한 순서 불명"}">${esc(formatRange(c.tMin, c.tMax))}${c.timeKind === "duration" ? " (지속)" : ""}</span>
    ${personLink(idx, c.source, c.anchor)} <span title="${esc(dirTitle)}">${arrow}</span> ${personLink(idx, c.target, c.anchor)}
    ${layerChip(c.layer)} <code>${esc(c.relationType)}</code>
    <div class="rel-meta">
      <span class="k">방향</span> ${c.direction === "undirected" ? "양방향(pack 근거)" : "방향 있음"}
      · <span class="k">근거 상태</span> ${evidenceBadge(c.provenance)}${c.derivationRule ? ` <code title="${esc(DERIVATION_RULES[c.derivationRule])}">${esc(c.derivationRule)}</code>` : ""}
      · <span class="k">확실성</span> ${certBadge(c.certainty)}
      · <span class="k">인과</span> <span class="causal" title="${esc(CAUSAL_STATUS[c.causalStatus] || "")}">${esc(c.causalStatus)}</span>
      ${c.pathEligible ? "" : ` · <span class="about-tag" title="'~에 관한' 관계: 경로·중심성 계산에서 제외">경로 제외</span>`}
      <br><span class="k">사료</span> ${srcs}
    </div>
    ${opts.showEvent ? `<div class="rel-event">${eventLink(idx, c.eventId)}</div>` : ""}
    ${c.note ? `<div class="rel-note">${esc(c.note)}</div>` : ""}
  </li>`;
}
export { formatDate, formatRange };
