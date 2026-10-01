/* ==========================================================================
   [사건] 탭 — Lasswell: Who / Gets·Loses What / When / How / Where / Outcome
   + 관계(relations) · 인과(causedBy) · 사료 · certainty · discrepancy
   ========================================================================== */
import { MECHANISMS, OUTCOME_TYPES, THEATERS, DOCUMENT_TYPES, VERIFICATION, CAUSAL_STATUS, CERTAINTY } from "../data/vocab.js";
import { esc, personLink, eventLink, certBadge, sourceLink, relationLine, formatDate } from "./format.js";

const ROLE_LABELS = {
  actors: "행위자", targets: "대상", decisionMakers: "결정자", informationSources: "정보원",
  beneficiaries: "수혜자", victims: "피해자", subjects: "언급 대상(관계 아님)"
};
const WHAT_LABELS = { gain: "획득", loss: "상실", burden: "부담", transfer: "전달", recover: "탈환", claim: "요구·주장" };
const PRECISION = { day: "일 단위", record_date_only: "사건일 미상 → 기사 게재일", month: "월 단위", year: "연 단위(지리지 등)", unknown: "미상" };

export function renderEventPanel(el, idx, ev, data) {
  const d = ev.eventDate;
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
    return `<span class="place-chip" title="${esc(pl.modernLocationNote || "")}">${esc(pl.canonicalName)}${pl.hanja ? ` <small>${esc(pl.hanja)}</small>` : ""}</span>`;
  }).join(" ");

  const contacts = idx.contacts.filter((c) => c.eventId === ev.id);
  const discrepancies = (ev.discrepancies || []).map((id) => (data.DISCREPANCIES || []).find((x) => x.id === id)).filter(Boolean);
  const effects = idx.events.filter((e) => (e.causedBy || []).some((c) => c.eventId === ev.id));

  el.innerHTML = `
    <div class="ev-head">
      <div class="ev-title">${esc(ev.title)} ${certBadge(ev.certainty)}</div>
      <div class="ev-verif verif-${esc(ev.verification)}">${esc(VERIFICATION[ev.verification])}</div>
    </div>

    <h4 class="lw">WHO <small>누가 행동했는가</small></h4>
    ${roles || "<p class='muted'>—</p>"}

    <h4 class="lw">GETS / LOSES WHAT <small>누가 무엇을 획득·상실·부담했는가</small></h4>
    <ul class="plain">${what}</ul>

    <h4 class="lw">WHEN</h4>
    <div class="kv"><span class="k">사건일</span><span class="v">${formatDate(ev.eventDate)}${ev.eventEndDate ? ` ~ ${formatDate(ev.eventEndDate)}` : ""} <small class="muted">(${PRECISION[ev.datePrecision] || esc(ev.datePrecision)})</small></span></div>
    ${ev.recordDate !== ev.eventDate ? `<div class="kv"><span class="k">기록일</span><span class="v">${formatDate(ev.recordDate)} <small class="muted">실록 게재일 — 사건일과 다름</small></span></div>` : ""}

    <h4 class="lw">HOW <small>메커니즘</small></h4>
    <div>${(ev.mechanisms || []).map((m) => `<span class="mech">${esc(MECHANISMS[m] || m)}</span>`).join(" ")}</div>
    ${ev.documentType || ev.embeddedDocumentAuthor ? `<div class="kv"><span class="k">인용 문서</span><span class="v">${ev.documentType ? esc(DOCUMENT_TYPES[ev.documentType]) : "유형 미확인"} · 작성자 ${ev.embeddedDocumentAuthor ? P(ev.embeddedDocumentAuthor) : "미상"} <small class="muted">(실록 기사 안에 인용된 문서)</small></span></div>` : ""}

    <h4 class="lw">WHERE</h4>
    <div class="kv"><span class="k">전구</span><span class="v">${(ev.theater || []).map((t) => esc(THEATERS[t].label)).join(" · ")}</span></div>
    <div class="kv"><span class="k">장소</span><span class="v">${places || "<span class='muted'>사료상 불분명</span>"}</span></div>
    ${ev.locationNote ? `<div class="note">${esc(ev.locationNote)}</div>` : ""}

    <h4 class="lw">OUTCOME</h4>
    <ul class="plain">${outcomes}</ul>

    <h4>관계 (이 사건에서 파생된 edge ${contacts.length}개)</h4>
    ${contacts.length ? `<ul class="plain rels">${contacts.map((c) => relationLine(idx, c)).join("")}</ul>` : "<p class='muted'>사료에서 확인된 인물 간 행위가 없어 edge를 만들지 않았습니다(장소·결과만 기록).</p>"}

    ${(ev.causedBy || []).length || effects.length ? `<h4>인과 연결</h4><ul class="plain">
      ${(ev.causedBy || []).map((c) => `<li>← ${eventLink(idx, c.eventId)} <span class="causal" title="${esc(CAUSAL_STATUS[c.causalStatus])}">${esc(c.causalStatus)}</span> ${esc(c.note || "")}</li>`).join("")}
      ${effects.map((e) => { const c = e.causedBy.find((x) => x.eventId === ev.id); return `<li>→ ${eventLink(idx, e.id)} <span class="causal">${esc(c.causalStatus)}</span></li>`; }).join("")}
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
