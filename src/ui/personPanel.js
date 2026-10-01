/* ==========================================================================
   [인물] 탭 — 시점별 관직·level, 활동기간, 사건·관계·장소, 사료 provenance,
   서사 적합성 판단용 지표(순위·주인공 자동 선정 없음), 연도별 trajectory
   ========================================================================== */
import { LEVELS, AFFILIATIONS, ENTITY_TYPES, CERTAINTY } from "../data/vocab.js";
import { esc, personLink, eventLink, sourceLink, relationLine, certBadge, formatDate } from "./format.js";
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
  const st = idx.stateAt(personId, date);
  const lv = idx.levelAt(personId, date);
  const states = idx.statesByPerson[personId] || [];
  const allContacts = idx.contactsByPerson[personId] || [];
  const prof = personProfile(idx, personId, idx.contacts);
  const winProf = personProfile(idx, personId, ctx.windowContacts);
  const evs = (idx.eventsByPerson[personId] || []).map((id) => idx.eventsById[id]);
  const srcs = [...(idx.sourcesByPerson[personId] || [])];
  const m = ctx.metrics[personId];

  const rows = [
    ["최초 등장", formatDate(prof.firstSeen), ""],
    ["최종 등장", formatDate(prof.lastSeen), ""],
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
    ? yearLineChart({ title: "Temporal degree", years: traj.years, values: traj.series[personId].degree, fmt: (v) => String(v) })
      + yearLineChart({ title: "Temporal betweenness", years: traj.years, values: traj.series[personId].betweenness })
    : "<p class='muted'>분석 기간에 연도 slice가 없습니다.</p>";

  el.innerHTML = `
    <div class="ev-head">
      <div class="ev-title">${esc(p.canonicalName)} ${p.hanja ? `<span class="hanja">${esc(p.hanja)}</span>${p.hanjaVerified ? "" : "<small class='muted' title='원문 대조 전'>*</small>"}` : ""}</div>
      <div class="muted">${esc(ENTITY_TYPES[p.entityType].label)} · <span class="dot" style="background:${AFFILIATIONS[p.affiliation].color}"></span>${esc(AFFILIATIONS[p.affiliation].label)}</div>
    </div>
    ${p.aliases.length ? `<div class="kv"><span class="k">이명</span><span class="v">${p.aliases.map(esc).join(", ")}</span></div>` : ""}
    ${p.identityNote ? `<div class="note">${esc(p.identityNote)} <small>(동일성 확실성: ${esc(p.identityCertainty)})</small></div>` : ""}

    <h4>${formatDate(date)} 시점</h4>
    <div class="kv"><span class="k">level</span><span class="v">${esc(LEVELS[lv].label)}</span></div>
    <div class="kv"><span class="k">관직·역할</span><span class="v">${st ? `${esc(st.office)} ${certBadge(st.certainty)}` : "<span class='muted'>이 시점의 상태 기록 없음(기본 level 사용)</span>"}</span></div>

    ${states.length ? `<h4>관직·level 변화</h4><ul class="plain">${states.map((s) => `<li><span class="rel-date">${esc(s.startDate)}~${esc(s.endDate || "")}</span> ${esc(s.level)} ${esc(s.office)} ${certBadge(s.certainty)}${s.note ? `<div class="rel-note">${esc(s.note)}</div>` : ""}</li>`).join("")}</ul>` : ""}

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
    <ul class="plain">${evs.map((e) => `<li>${eventLink(idx, e.id)} ${certBadge(e.certainty)}</li>`).join("")}</ul>

    <h4>관계 (${allContacts.length})</h4>
    <ul class="plain rels">${allContacts.map((c) => relationLine(idx, c, { showEvent: true })).join("")}</ul>

    <h4>장소</h4>
    <div>${prof.places.map((pl) => `<span class="place-chip">${esc(idx.placesById[pl].canonicalName)}</span>`).join(" ") || "<span class='muted'>—</span>"}</div>

    <h4>사료 provenance (${srcs.length})</h4>
    <ul class="plain sources">${srcs.map((s) => `<li>${sourceLink(idx, s)}</li>`).join("")}</ul>
  `;
}
