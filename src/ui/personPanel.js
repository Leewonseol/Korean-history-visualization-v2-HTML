/* ==========================================================================
   [인물] 탭 — 시점별 관직·level, 활동기간, 사건·관계·장소, 사료 provenance,
   서사 적합성 판단용 지표(순위·주인공 자동 선정 없음), 연도별 trajectory
   ========================================================================== */
import { LEVELS, AFFILIATIONS, ENTITY_TYPES, IDENTITY_STATUS } from "../data/vocab.js";
import { esc, personLink, eventLink, sourceLink, relationLine, certBadge, formatDate, evidenceBadge, eventDateLabel } from "./format.js";
import { evidenceScope, select } from "../model/evidence.js";
import { personProfile } from "../analysis/centrality.js";
import { yearLineChart } from "./charts.js";

export function renderPersonPanel(el, idx, personId, ctx) {
  if (!personId) {
    el.innerHTML = `<p class="muted">네트워크에서 노드를 클릭하거나 사건 패널의 이름을 누르면 인물(집단·기관) 정보를 봅니다.</p>
      <p class="muted">이 도구는 '주인공'을 알고리즘으로 정하지 않습니다. 아래 지표를 비교해 서사적 적합성을 직접 판단하세요.</p>`;
    return;
  }
  const p = idx.peopleById[personId];
  const date = ctx.cursorDate;
  const f = ctx.filters || {};
  const st = idx.attestationAt(personId, date);
  const lv = idx.levelAt(personId, date);
  const scope = evidenceScope(f);
  const atts = select(idx.attestationsByPerson[personId], scope);
  const allContacts = select(idx.contactsByPerson[personId], scope);
  const hiddenContacts = (idx.contactsByPerson[personId] || []).length - allContacts.length;
  const prof = personProfile(idx, personId, allContacts);
  const ident = idx.identityOf[personId];
  const winProf = personProfile(idx, personId, ctx.windowContacts);
  const evs = select((idx.eventsByPerson[personId] || []).map((id) => idx.eventsById[id]), scope);
  const srcs = [...(idx.sourcesByPerson[personId] || [])];
  const m = ctx.metrics[personId];

  const rows = [
    ["최초 등장(검증)", prof.firstSeen ? formatDate(prof.firstSeen) : "<span class='muted'>검증 등장 없음</span>", ""],
    ["최종 등장(검증)", prof.lastSeen ? formatDate(prof.lastSeen) : "—", ""],
    ["활동기간(근사)", `${prof.spanMonths.toFixed(1)}개월`, ""],
    ["사건 참여 수", prof.eventCount, winProf.eventCount],
    ["관계 수", prof.relationCount, winProf.relationCount],
    ["관계 layer 다양성", prof.layerDiversity, winProf.layerDiversity],
    ["장소 다양성", prof.placeDiversity, winProf.placeDiversity],
    ["중앙↔현장 연결 횟수", prof.centralFieldBridges, winProf.centralFieldBridges],
    ["보고 발신 / 수신", `${prof.reportsSent} / ${prof.reportsReceived}`, `${winProf.reportsSent} / ${winProf.reportsReceived}`],
    ["지휘 발신 / 수신", `${prof.commandsGiven} / ${prof.commandsReceived}`, `${winProf.commandsGiven} / ${winProf.commandsReceived}`],
    ["직접 전투·군사행동", prof.combat, winProf.combat],
    ["포상 대상", prof.rewards, winProf.rewards],
    ["처벌·책임추궁 대상", prof.punishments, winProf.punishments],
    ["피해(피해자로 기록된 사건)", prof.harms, winProf.harms],
    ["정책결정 참여", prof.policyParticipation, winProf.policyParticipation]
  ];

  const traj = ctx.trajectory;
  const charts = traj && traj.years.length
    ? yearLineChart({ title: "Temporal degree", years: traj.years, values: traj.series[personId].degree, scope: traj.scope, fmt: (v) => String(v) })
      + yearLineChart({ title: "Temporal betweenness", years: traj.years, values: traj.series[personId].betweenness, scope: traj.scope })
      + `<p class="muted small">연도 slice는 시각이 그 해 안에 확실한 관계만 사용(제외 ${traj.excluded.reduce((a, b) => a + b, 0)}개). 빈 값 = coverage 미수록 연도.</p>`
    : "<p class='muted'>분석 기간에 연도 slice가 없습니다.</p>";

  el.innerHTML = `
    <div class="ev-head">
      <div class="ev-title">${esc(p.canonicalName)} ${p.hanja ? `<span class="hanja" title="표기 근거: ${esc(p.nameFormSource)}">${esc(p.hanja)}</span>` : ""}</div>
      <div class="muted">${esc(ENTITY_TYPES[p.entityType].label)} · <span class="dot" style="background:${AFFILIATIONS[p.affiliation].color}"></span>${esc(AFFILIATIONS[p.affiliation].label)}</div>
    </div>
    ${p.aliases.length ? `<div class="kv"><span class="k">이명</span><span class="v">${p.aliases.map(esc).join(", ")}</span></div>` : ""}
    <div class="kv"><span class="k">동일성</span><span class="v"><span class="identity id-${esc(ident.status)}" title="${esc(IDENTITY_STATUS[ident.status])}">${esc(ident.status)}</span>
      <small class="muted">${ident.basis === "declared" ? "데이터에 선언" : "검증 등장 수로 계산 — 자동 병합 아님"}${["PROBABLE_SAME", "UNRESOLVED", "UNRESOLVED_DISTINCT"].includes(ident.status) ? " · <b>동일성 미해결</b>" : ""}</small></span></div>
    ${(p.identityEvidence || []).length ? `<div class="kv"><span class="k">동일성 근거</span><span class="v small">${p.identityEvidence.map((e) => `“${esc(e.quote)}” <code>${esc(e.locator)}</code>`).join("<br>")}</span></div>` : ""}
    <div class="kv"><span class="k">이름 표기</span><span class="v">${p.nameFormVerified ? "pack v1 인명록 표기" : "<span class='muted'>pack 인명록 표기 없음(한자 미기재)</span>"} · ${evidenceBadge(p.provenance)}</span></div>
    ${(p.possibleSameAs || []).length ? `<div class="kv"><span class="k">동일인 가능성</span><span class="v">${p.possibleSameAs.map((q) => personLink(idx, q)).join(" ")} <small class="muted">미확인 — 병합하지 않음</small></span></div>` : ""}
    ${p.identityNote ? `<div class="note">${esc(p.identityNote)}</div>` : ""}

    <h4>${formatDate(date)} 시점</h4>
    <div class="kv"><span class="k">level</span><span class="v">${esc(LEVELS[lv].label)}</span></div>
    <div class="kv"><span class="k">가장 최근 증언</span><span class="v">${st ? `${esc(st.attestedDate)} ${esc(st.office)}` : "<span class='muted'>이 시점 이전의 pack 증언 없음(기본 level 사용)</span>"}</span></div>
    <p class="muted small">level은 편집자 분류이며, 증언 사이 기간에 관직이 유지됐다고 가정하지 않습니다.</p>

    ${atts.length ? `<h4>관직·역할 증언 <small class="muted">기사일 기준, 구간 아님</small></h4><ul class="plain">${atts.map((a) => `<li><span class="rel-date">${esc(a.attestedDate)}</span> ${esc(a.level)} ${esc(a.office)} ${evidenceBadge(a.provenance)} <small class="muted">${a.sourceIds.map(esc).join(", ")}</small>${a.note ? `<div class="rel-note">${esc(a.note)}</div>` : ""}</li>`).join("")}</ul>` : ""}

    <h4>서사 판단용 지표 <small class="muted">순위 아님</small></h4>
    <table class="kv-table"><tr><th></th><th>전체 데이터</th><th>현재 분석 창</th></tr>
      ${rows.map(([k, a, b]) => `<tr><td>${k}</td><td>${a}</td><td>${b}</td></tr>`).join("")}
    </table>
    ${m ? `<p class="muted small">현재 창 temporal 지표: in ${m.inDeg} · out ${m.outDeg} · closeness ${m.closeness.toFixed(3)} · betweenness ${m.betweenness.toFixed(2)} · broadcast ${m.broadcast.toFixed(3)} · receive ${m.receive.toFixed(3)}</p>` : "<p class='muted small'>현재 분석 창·필터에서 관계 없음</p>"}

    <h4>연도별 centrality trajectory <small class="muted">${traj ? `${traj.years[0] || ""}~${traj.years[traj.years.length - 1] || ""}` : ""}</small></h4>
    <div class="charts">${charts}</div>

    <div class="btn-row">
      <button type="button" class="btn btn-ghost" data-path-from="${esc(personId)}">경로 출발점으로</button>
      <button type="button" class="btn btn-ghost" data-path-to="${esc(personId)}">경로 도착점으로</button>
      <button type="button" class="btn btn-ghost" data-loop="${esc(personId)}">피드백 루프 찾기</button>
    </div>

    <h4>사건 (${evs.length})</h4>
    <ul class="plain">${evs.map((e) => `<li>${eventLink(idx, e.id)} ${certBadge(e.certainty)} ${evidenceBadge(e.provenance)}</li>`).join("")}</ul>

    <h4>관계 (${allContacts.length})</h4>
    ${hiddenContacts ? `<p class="muted small">legacy·해석 관계 ${hiddenContacts}개 숨김 — 왼쪽 '근거' 토글로 표시</p>` : ""}
    <ul class="plain rels">${allContacts.map((c) => relationLine(idx, c, { showEvent: true })).join("")}</ul>

    <h4>장소</h4>
    <div>${prof.places.map((pl) => `<span class="place-chip">${esc(idx.placesById[pl].canonicalName)}</span>`).join(" ") || "<span class='muted'>—</span>"}</div>

    <h4>사료 provenance (${srcs.length})</h4>
    <ul class="plain sources">${srcs.map((s) => `<li>${sourceLink(idx, s)}</li>`).join("")}</ul>
  `;
}
