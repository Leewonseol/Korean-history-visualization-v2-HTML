/* ==========================================================================
   [사건] 탭 — Lasswell: Who / Gets·Loses What / When / How / Where / Outcome
   + 근거(Source · Evidence status · Provenance · Date precision · Causal status)
   + 관계(relations) · 사건 연결(eventLinks) · 사료 · certainty · discrepancy
   legacy·해석 관계는 해당 토글이 켜져 있을 때만 목록에 나오고, 숨긴 수를 밝힌다.
   ========================================================================== */
import { MECHANISMS, OUTCOME_TYPES, THEATERS, DOCUMENT_TYPES, CAUSAL_STATUS, CERTAINTY, DATE_PRECISION, PROVENANCE, EVIDENCE_STATUS } from "../data/vocab.js";
import { esc, personLink, eventLink, certBadge, sourceLink, relationLine, formatDate, formatRange, evidenceBadge } from "./format.js";
import { evidenceScope, allows, classOf } from "../model/evidence.js";

const ROLE_LABELS = {
  actors: "행위자", targets: "대상", decisionMakers: "결정자", informationSources: "정보원",
  beneficiaries: "수혜자", victims: "피해자", subjects: "언급 대상(관계 아님)"
};
const WHAT_LABELS = { gain: "획득", loss: "상실", burden: "부담", transfer: "전달", recover: "탈환", claim: "요구·주장" };
const DATE_BASIS = {
  pack_event_date: "pack이 사건 날짜를 기록", court_act_on_record_date: "조정 행위 — 기사일을 행위일로 봄(관례)",
  report_receipt_on_record_date: "보고 접수 — 기사일을 접수일로 봄(관례)", before_record_date: "기사일 이전의 미상 시점",
  pack_event_range: "pack이 사건 구간을 기록", year_only_geography: "지리지 연 단위 서술", legacy_month: "v2 월 단위 서술",
  legacy_record_date: "v2 기사일"
};
const LINK_LABELS = { causal: "인과", same_record: "같은 기사", same_campaign: "같은 작전", reference: "언급·선후" };

export function renderEventPanel(el, idx, ev, data, f = {}) {
  const d = ev.dateMax ?? ev.dateMin ?? ev.recordDate;
  const P = (id) => personLink(idx, id, d);
  const roles = Object.entries(ROLE_LABELS)
    .filter(([k]) => (ev[k] || []).length)
    .map(([k, label]) => `<div class="kv"><span class="k">${label}</span><span class="v">${ev[k].map(P).join(" ")}</span></div>`).join("");

  const what = (ev.what || []).map((w) => `<li><span class="what-type wt-${esc(w.type)}">${WHAT_LABELS[w.type] || esc(w.type)}</span>
      ${w.giverId ? P(w.giverId) : "<span class='muted'>(미상)</span>"} → ${w.receiverId ? P(w.receiverId) : "<span class='muted'>(미상)</span>"}:
      ${esc(w.value)}${w.quantity != null ? ` <b>${esc(w.quantity)}${esc(w.unit || "")}</b>` : ""}</li>`).join("");

  const outcomes = (ev.outcomes || []).map((o) => `<li><span class="out-type">${esc(OUTCOME_TYPES[o.type] || o.type)}</span>
      ${o.subjectId ? P(o.subjectId) : ""} ${esc(o.description || "")}
      ${o.quantity != null ? ` <b>${esc(o.quantity)}${esc(o.unit || "")}</b>` : ""}
      ${o.reportedBy ? `<span class="reported" title="독립적으로 검증된 수치가 아님">${esc(o.reportedBy)} 수치</span>` : ""}
      ${o.certainty ? certBadge(o.certainty) : ""}</li>`).join("");

  const places = (ev.placeIds || []).map((p) => {
    const pl = idx.placesById[p];
    return `<span class="place-chip" title="${esc(pl.modernLocationNote || "")}">${esc(pl.canonicalName)}</span>`;
  }).join(" ");

  const allContacts = idx.contacts.filter((c) => c.eventId === ev.id);
  const scope = evidenceScope(f);
  const contacts = allContacts.filter((c) => allows(scope, c));
  const hidden = { legacy: 0, interpretation: 0 };
  allContacts.forEach((c) => { if (!allows(scope, c)) hidden[classOf(c) === "LEGACY" ? "legacy" : "interpretation"]++; });
  const discrepancies = (ev.discrepancies || []).map((id) => (data.DISCREPANCIES || []).find((x) => x.id === id)).filter(Boolean);
  const incoming = idx.events.filter((e) => (e.eventLinks || []).some((l) => l.eventId === ev.id))
    .map((e) => ({ e, l: e.eventLinks.find((x) => x.eventId === ev.id) }));
  const causalSet = [...new Set(allContacts.map((c) => c.causalStatus))];
  const evGroup = PROVENANCE[ev.provenance] ? PROVENANCE[ev.provenance].group : "unknown";

  el.innerHTML = `
    <div class="ev-head">
      <div class="ev-title">${esc(ev.title)} ${certBadge(ev.certainty)}</div>
      <div class="ev-verif evg-${esc(evGroup)}">${evidenceBadge(ev.provenance)} ${esc(EVIDENCE_STATUS[evGroup])}</div>
    </div>
    ${evGroup !== "verified" ? `<p class="warn small">이 사건은 pack v1 검증 데이터가 아닙니다(${esc(PROVENANCE[ev.provenance].label)}). 기본 화면·지표에서 제외됩니다.</p>` : ""}

    <h4>근거</h4>
    <table class="kv-table evidence-table">
      <tr><td>Source</td><td>${ev.sourceIds.map((s) => `<code>${esc(s)}</code>`).join(" ")}${(ev.relatedSourceIds || []).length ? ` <small class="muted">관련(근거 아님): ${ev.relatedSourceIds.map(esc).join(", ")}</small>` : ""}</td></tr>
      <tr><td>Evidence status</td><td>${esc(EVIDENCE_STATUS[evGroup])}</td></tr>
      <tr><td>Provenance</td><td>${evidenceBadge(ev.provenance)}</td></tr>
      <tr><td>Date precision</td><td>${esc(ev.datePrecision)} — ${esc(DATE_PRECISION[ev.datePrecision] || "")}</td></tr>
      <tr><td>Causal status</td><td>${causalSet.length ? causalSet.map((c) => `<span class="causal" title="${esc(CAUSAL_STATUS[c] || "")}">${esc(c)}</span>`).join(" ") : "<span class='muted'>관계 없음</span>"} <small class="muted">(관계별 값 — 아래 목록)</small></td></tr>
      <tr><td>Relation evidence</td><td>${["DIRECT", "NORMALIZED", "LEGACY", "INTERPRETATION"].map((k) => `${k} ${allContacts.filter((c) => classOf(c) === k).length}`).join(" · ")}</td></tr>
    </table>

    <h4 class="lw">WHO <small>누가 행동했는가</small></h4>
    ${roles || "<p class='muted'>—</p>"}

    <h4 class="lw">GETS / LOSES WHAT <small>누가 무엇을 획득·상실·부담했는가</small></h4>
    <ul class="plain">${what}</ul>

    <h4 class="lw">WHEN</h4>
    <div class="kv"><span class="k">사건 시점</span><span class="v">${esc(formatRange(ev.dateMin, ev.dateMax, ev.datePrecision))} <small class="muted">(${esc(ev.datePrecision)})</small></span></div>
    <div class="kv"><span class="k">dateMin / dateMax</span><span class="v"><code>${esc(ev.dateMin ?? "미상")}</code> / <code>${esc(ev.dateMax ?? "미상")}</code></span></div>
    <div class="kv"><span class="k">기사일</span><span class="v">${ev.recordDate ? formatDate(ev.recordDate) : "<span class='muted'>없음(지리지 등)</span>"}</span></div>
    <div class="kv"><span class="k">날짜 근거</span><span class="v">${esc(DATE_BASIS[ev.dateBasis] || ev.dateBasis)}</span></div>
    ${ev.dateNote ? `<div class="note">${esc(ev.dateNote)}</div>` : ""}

    <h4 class="lw">HOW <small>메커니즘</small></h4>
    <div>${(ev.mechanisms || []).map((m) => `<span class="mech">${esc(MECHANISMS[m] || m)}</span>`).join(" ")}</div>
    ${ev.documentType || ev.embeddedDocumentAuthor ? `<div class="kv"><span class="k">인용 문서</span><span class="v">${ev.documentType ? esc(DOCUMENT_TYPES[ev.documentType]) : "유형 미확인"} · 작성자 ${ev.embeddedDocumentAuthor ? P(ev.embeddedDocumentAuthor) : "미상"} <small class="muted">(실록 기사 안에 인용된 문서)</small></span></div>` : ""}

    <h4 class="lw">WHERE</h4>
    <div class="kv"><span class="k">전구</span><span class="v">${(ev.theater || []).map((t) => esc(THEATERS[t].label)).join(" · ")}</span></div>
    <div class="kv"><span class="k">장소</span><span class="v">${places || "<span class='muted'>사료상 불분명</span>"}</span></div>
    ${ev.locationNote ? `<div class="note">${esc(ev.locationNote)}</div>` : ""}

    <h4 class="lw">OUTCOME</h4>
    <ul class="plain">${outcomes}</ul>

    <h4>관계 (표시 ${contacts.length} / 전체 ${allContacts.length})</h4>
    ${hidden.legacy || hidden.interpretation ? `<p class="muted small">숨김: legacy ${hidden.legacy || 0}개 · 해석 ${hidden.interpretation || 0}개 — 왼쪽 '근거' 토글로 표시</p>` : ""}
    ${contacts.length ? `<ul class="plain rels">${contacts.map((c) => relationLine(idx, c)).join("")}</ul>` : allContacts.length ? "" : "<p class='muted'>사료에서 확인된 인물 간 행위가 없어 edge를 만들지 않았습니다(장소·결과만 기록).</p>"}

    ${(ev.eventLinks || []).length || incoming.length ? `<h4>사건 연결 <small class="muted">선후·언급은 인과가 아님</small></h4><ul class="plain">
      ${(ev.eventLinks || []).map((l) => `<li>← ${eventLink(idx, l.eventId)} ${esc(LINK_LABELS[l.linkType] || l.linkType)} · <span class="causal" title="${esc(CAUSAL_STATUS[l.causalStatus])}">${esc(l.causalStatus)}</span> ${evidenceBadge(l.provenance)}<div class="rel-note">${esc(l.note || "")}${l.causalEvidence ? `<br>근거 원문: “${esc(l.causalEvidence.quote)}” <code>${esc(l.causalEvidence.locator)}</code>` : ""}</div></li>`).join("")}
      ${incoming.map(({ e, l }) => `<li>→ ${eventLink(idx, e.id)} ${esc(LINK_LABELS[l.linkType] || l.linkType)} · <span class="causal">${esc(l.causalStatus)}</span></li>`).join("")}
    </ul>` : ""}

    <h4>근거 요약</h4>
    <p class="evidence">${esc(ev.evidenceSummary)}</p>

    <h4>사료</h4>
    <ul class="plain sources">${ev.sourceIds.map((s) => `<li>${sourceLink(idx, s)}</li>`).join("")}</ul>

    <h4>확실성</h4>
    <p>${certBadge(ev.certainty)} ${esc(CERTAINTY[ev.certainty].label)}</p>

    ${discrepancies.length ? `<h4>불일치·쟁점 (discrepancy)</h4>${discrepancies.map((x) => `<div class="disc"><b>${esc(x.id)} ${esc(x.title)}</b> <span class="disc-status">${esc(x.status)}</span><div>${esc(x.detail)}</div></div>`).join("")}` : ""}
  `;
}
