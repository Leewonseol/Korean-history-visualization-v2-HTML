/* 패널 공통 렌더링 헬퍼 */
import { CERTAINTY, LAYERS, LEVELS, SOURCE_TYPES, SOURCE_LEVELS, VERIFICATION, CAUSAL_STATUS, DOCUMENT_TYPES } from "../data/vocab.js";
import { formatDate } from "../model/dates.js";

export const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

export function personLink(idx, id, date) {
  const p = idx.peopleById[id];
  if (!p) return `<span class="missing">${esc(id)}</span>`;
  const lv = date ? idx.levelAt(id, date) : p.defaultLevel;
  return `<button type="button" class="plink" data-person="${esc(id)}" title="${esc(LEVELS[lv] ? LEVELS[lv].label : "")}">${esc(p.canonicalName)}<sup>${lv}</sup></button>`;
}
export function eventLink(idx, id) {
  const e = idx.eventsById[id];
  return e ? `<button type="button" class="elink" data-event="${esc(id)}">${esc(e.eventDate)} ${esc(e.title)}</button>` : esc(id);
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
  return `<a href="${esc(s.url)}" target="_blank" rel="noopener" class="src-link">${esc(s.title)}</a>
    <span class="src-meta">${esc(SOURCE_TYPES[s.sourceType])} · ${esc(SOURCE_LEVELS[s.sourceLevel])}${doc} · <span class="verif verif-${esc(s.verification)}">${esc(VERIFICATION[s.verification] || "")}</span></span>`;
}
export function relationLine(idx, c, opts = {}) {
  return `<li class="rel-line">
    <span class="rel-date">${esc(c.startDate)}${c.endDate !== c.startDate ? "~" + esc(c.endDate) : ""}</span>
    ${personLink(idx, c.source, c.startDate)} → ${personLink(idx, c.target, c.startDate)}
    ${layerChip(c.layer)} <code>${esc(c.relationType)}</code> ${certBadge(c.certainty)}
    <span class="causal" title="${esc(CAUSAL_STATUS[c.causalStatus])}">${esc(c.causalStatus)}</span>
    ${c.verification && c.verification !== "pack_v1" ? `<span class="verif-tag verif-${esc(c.verification)}" title="${esc(VERIFICATION[c.verification])}">${c.verification === "inherited_v2" ? "v2" : "시드"}</span>` : ""}
    ${opts.showEvent ? `<div class="rel-event">${eventLink(idx, c.eventId)}</div>` : ""}
    ${c.note ? `<div class="rel-note">${esc(c.note)}</div>` : ""}
  </li>`;
}
export { formatDate };
