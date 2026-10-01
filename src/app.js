/* ==========================================================================
   진입점: 상태 관리와 모듈 연결
   데이터 흐름: DATA → buildIndexes → (filters) → filterContacts(display) / analysisContacts(CERTAIN_ORDER) → networkView / analysis / panels
   근거 기본값: DIRECT + NORMALIZED(pack v1). legacy·해석은 왼쪽 '근거' 토글로만 포함 — 근거 필터는 model/evidence.js 하나뿐.
   ========================================================================== */
import { DATA } from "./data/index.js";
import { buildIndexes, PARTICIPANT_FIELDS } from "./model/indexes.js";
import { validateData } from "./model/validate.js";
import { filterContacts, analysisContacts, eventPasses } from "./model/temporalNetwork.js";
import { evidenceScope, allows, select, countByClass } from "./model/evidence.js";
import { missingnessReport } from "./analysis/missingness.js";
import { unresolvedNodeCount, pathIdentityAssumptions, mergeSensitivity } from "./analysis/identitySensitivity.js";
import { resultCaveats } from "./analysis/caveats.js";
import { yearStart, yearEnd, minDate, maxDate, shiftMonths, formatDate } from "./model/dates.js";
import { computeMetrics } from "./analysis/centrality.js";
import { temporalPath, isTimeRespecting, feedbackLoops } from "./analysis/temporalPaths.js";
import { yearlyTrajectories, layerDegreeMatrix } from "./analysis/trajectories.js";
import { createNetworkView } from "./ui/networkView.js";
import { createTimeline } from "./ui/timeline.js";
import { createFilters, defaultFilterState } from "./ui/filters.js";
import { renderEventPanel } from "./ui/eventPanel.js";
import { renderPersonPanel } from "./ui/personPanel.js";
import { renderAnalysisPanel } from "./ui/analysisPanel.js";
import { createStoryMode } from "./ui/storyMode.js";
import { esc, layerChip, relationLine, evidenceClassSummary, caveatBox } from "./ui/format.js";
import { NOT_COVERED_LABEL } from "./ui/timeline.js";

const $ = (id) => document.getElementById(id);
const idx = buildIndexes(DATA);
const validation = validateData(DATA);
idx.sourceUsage = validation.sourceUsage;

const state = {
  cursor: 0,
  f: defaultFilterState(idx),
  tab: "event",
  selected: null,
  spotlight: null,
  pathUI: { from: "JO_SEJONG", to: "JO_CHOEYUNDEOK", mode: "CERTAIN_ORDER", result: undefined, loops: null, loopAnchor: "JO_SEJONG" }
};

/* ---------------- 창(window) 계산 ---------------- */
// 커서 날짜 = 현재 사건이 '기록된' 시점(기사일). 기사일이 없으면(지리지) 정렬 날짜.
const cursorDate = () => { const e = idx.events[state.cursor]; return e.recordDate ?? idx.sortDateOf(e); };
function period() { return { from: yearStart(state.f.yearFrom), to: yearEnd(state.f.yearTo) }; }
function baseFilters() {
  const f = state.f;
  return { layers: f.layers, levels: f.levels, theaters: f.theaters, certainties: f.certainties, sourceTypes: f.sourceTypes,
    includeLegacy: f.includeLegacy, includeInterpretation: f.includeInterpretation };
}
function analysisWindow() {
  const p = period();
  return state.f.limitToCursor ? { from: p.from, to: minDate(p.to, cursorDate()) } : p;
}
function displaySpec() {
  const p = period(), d = cursorDate(), f = state.f;
  if (f.windowMode === "event") return { ...p, eventIds: new Set([idx.events[state.cursor].id]) };
  const to = f.limitToCursor ? minDate(p.to, d) : p.to;
  if (f.windowMode === "recent12") return { from: maxDate(p.from, shiftMonths(d, -12)), to: minDate(p.to, d) };
  return { from: p.from, to };
}

/* ---------------- 모듈 생성 ---------------- */
const net = createNetworkView($("cy"), idx, {
  onNodeClick: (id) => selectPerson(id),
  onEdgeClick: (ids) => showEdgePopover(ids),
  onBackgroundClick: () => { $("netStatus").innerHTML = ""; }
});
$("btnFit").addEventListener("click", () => net.fit());
const timeline = createTimeline(idx, state, (i) => setCursor(i));
createFilters(idx, state, () => { update(); story.refresh(); });
const story = createStoryMode(idx, DATA.STORY_SCENES, {
  setCursor: (i) => setCursor(i),
  filters: () => baseFilters(),
  spotlight: (ids) => { state.spotlight = ids ? new Set(ids) : null; applySpotlight(); }
});

function setCursor(i) {
  state.cursor = Math.max(0, Math.min(idx.events.length - 1, i));
  state.pathUI.result = undefined;
  update();
}
function selectPerson(id) {
  state.selected = id;
  switchTab("person");
  update();
}
function switchTab(t) {
  state.tab = t;
  document.querySelectorAll(".tab").forEach((b) => b.classList.toggle("on", b.dataset.tab === t));
  ["event", "person", "analysis"].forEach((k) => $(`tab-${k}`).classList.toggle("hidden", k !== t));
}
document.querySelectorAll(".tab").forEach((b) => b.addEventListener("click", () => { switchTab(b.dataset.tab); renderPanels(); }));

/* ---------------- 메인 갱신 ---------------- */
let last = {};
function update() {
  const fb = baseFilters();
  const disp = displaySpec();
  const displayContacts = filterContacts(idx, { ...fb, ...disp, mode: "display" });
  const win = analysisWindow();
  const analysis = analysisContacts(idx, { ...fb, ...win }, "CERTAIN_ORDER");
  const metricsResult = computeMetrics(analysis.contacts, win, { mode: "CERTAIN_ORDER", scope: analysis.scope });
  const ev = idx.events[state.cursor];
  const evDate = idx.sortDateOf(ev);
  const evOk = eventPasses(idx, ev, fb) && (!disp.eventIds || disp.eventIds.has(ev.id)) && evDate >= disp.from && evDate <= disp.to;
  const parts = new Set();
  if (evOk) PARTICIPANT_FIELDS.forEach((k) => (ev[k] || []).forEach((p) => { if (fb.levels.has(idx.levelAt(p, cursorDate()))) parts.add(p); }));
  if (state.selected) parts.add(state.selected);

  let placeLinks = null;
  if (state.f.showPlaces) {
    placeLinks = [];
    for (const e of idx.events) {
      const d = idx.sortDateOf(e);
      const inWin = disp.eventIds ? disp.eventIds.has(e.id) : d >= disp.from && d <= disp.to;
      if (!inWin || !eventPasses(idx, e, fb)) continue;
      for (const a of e.actors) for (const pl of e.placeIds) placeLinks.push({ actor: a, placeId: pl });
    }
  }
  const metricValues = state.f.metric === "none" ? null
    : Object.fromEntries(metricsResult.nodes.map((n) => [n, metricsResult.metrics[n][state.f.metric] || 0]));

  net.update({ contacts: displayContacts, date: cursorDate(), metricValues, currentEventId: ev.id, selected: state.selected, extraNodes: [...parts], placeLinks });
  // 경로 선택 목록: TEMPORALLY_NOT_EXCLUDED 판정으로 기간 안에 있을 수 있는 경로 대상 관계의 노드(strict에서 고립된 노드도 고를 수 있게)
  const pathNodes = [...new Set(analysisContacts(idx, { ...fb, ...win }, "TEMPORALLY_NOT_EXCLUDED").contacts.flatMap((c) => [c.source, c.target]))]
    .sort((a, b) => idx.peopleById[a].canonicalName.localeCompare(idx.peopleById[b].canonicalName, "ko"));
  const caveats = resultCaveats(idx, analysis, win);
  last = { displayContacts, analysisContacts: analysis.contacts, analysis, metricsResult, win, disp, pathNodes, caveats };
  timeline.render((e) => eventPasses(idx, e, fb));
  $("netStatus").innerHTML = "";
  const st = document.createElement("div");
  st.className = "net-summary";
  const dataset = datasetLabel();
  st.textContent = `표시: ${disp.eventIds ? "현재 사건" : `${disp.from.replace(/-00-00$/, "")} ~ ${disp.to.replace(/-99-99$/, "")}`} · 근거 ${dataset} · edge(contact) ${displayContacts.length} · 노드 ${net.cy.nodes(".actor").length}`;
  $("netStatus").appendChild(st);
  if (state.f.metric !== "none") {
    const cv = document.createElement("div");
    cv.className = "net-summary";
    cv.innerHTML = `노드 크기 = ${esc(state.f.metric)} · ${caveatBox(last.caveats, true)}`;
    $("netStatus").appendChild(cv);
  }
  if (state.pathUI.result) net.highlightPath(state.pathUI.result.steps);
  applySpotlight();
  renderPanels();
}

function datasetLabel() {
  const f = state.f;
  return ["pack v1", f.includeLegacy ? "+ legacy" : "", f.includeInterpretation ? "+ 해석" : ""].filter(Boolean).join(" ");
}

function applySpotlight() {
  if (!state.spotlight) return;
  net.cy.elements().addClass("faded");
  net.cy.nodes(".band").removeClass("faded");
  net.cy.nodes(".actor").filter((n) => state.spotlight.has(n.id())).removeClass("faded");
  net.cy.edges(".rel.current").removeClass("faded");
}

function renderPanels() {
  const ev = idx.events[state.cursor];
  if (state.tab === "event") renderEventPanel($("tab-event"), idx, ev, DATA, baseFilters());
  if (state.tab === "person") {
    const traj = state.selected ? yearlyTrajectories(idx, { ...baseFilters(), ...last.win }, [state.selected]) : null;
    renderPersonPanel($("tab-person"), idx, state.selected, {
      cursorDate: cursorDate(), windowContacts: last.analysisContacts, metrics: last.metricsResult.metrics, trajectory: traj, filters: baseFilters(),
      caveats: last.caveats
    });
  }
  if (state.tab === "analysis") {
    const { nodes, metrics } = last.metricsResult;
    const trajNodes = state.selected && metrics[state.selected] ? [state.selected]
      : [...nodes].sort((a, b) => metrics[b].degree - metrics[a].degree).slice(0, 3);
    const trajectory = yearlyTrajectories(idx, { ...baseFilters(), ...last.win }, trajNodes);
    renderAnalysisPanel($("tab-analysis"), idx, {
      win: last.win, metricsResult: last.metricsResult, metricKey: state.f.metric, trajectory,
      trajectoryNote: state.selected && metrics[state.selected] ? "선택 인물의 연도별 slice 값" : "인물을 선택하지 않아 창 전체 degree 상위 3개를 표시(순위는 주인공 판정이 아님)",
      layerMatrix: layerDegreeMatrix(last.analysisContacts), pathUI: state.pathUI, cursorDate: cursorDate(),
      contactCount: last.analysisContacts.length, excludedUncertain: last.analysis.excludedUncertain, excludedAbout: last.analysis.excludedAbout,
      datasetLabel: datasetLabel(), pathNodes: last.pathNodes, eventAllowed: (e) => allows(evidenceScope(baseFilters()), e),
      evidenceCounts: countByClass(last.analysisContacts), shownCounts: countByClass(last.displayContacts), caveats: last.caveats,
      missingness: missingnessReport(last.analysis),
      identity: unresolvedNodeCount(idx, nodes),
      mergeSensitivity: mergeSensitivity(idx, last.analysisContacts, last.win, { scope: last.analysis.scope })
    });
  }
}

/* ---------------- temporal path / 루프 ---------------- */
function runPath() {
  const from = $("pathFrom").value, to = $("pathTo").value, mode = $("pathMode").value;
  state.pathUI.from = from; state.pathUI.to = to; state.pathUI.mode = mode;
  const win = last.win;
  const a = mode === "CERTAIN_ORDER" ? last.analysis : analysisContacts(idx, { ...baseFilters(), ...win }, "TEMPORALLY_NOT_EXCLUDED");
  let sources = [from], t0 = win.from;
  if (from.startsWith("event:")) {
    // 사건에서 출발: 그 사건의 행위자 전원, 사건 하한 시각부터(하한 미상이면 기간 시작부터 — 더 이른 출발을 가정하지 않음)
    const ev = idx.eventsById[from.slice(6)];
    sources = [...new Set(ev.actors)];
    t0 = ev.dateMin ? maxDate(win.from, ev.dateMin) : win.from;
  }
  const res = temporalPath(a.contacts, sources, to, t0, win.to, mode, a.scope);
  state.pathUI.result = res ? { ...res, ok: isTimeRespecting(res.steps, t0, mode), identityAssumptions: pathIdentityAssumptions(idx, res.steps) } : null;
  state.pathUI.loops = null;
  update();
  switchTab("analysis"); renderPanels();
}
function runLoops() {
  const a = $("loopAnchor").value;
  state.pathUI.loopAnchor = a;
  const mode = $("pathMode") ? $("pathMode").value : state.pathUI.mode;
  state.pathUI.mode = mode;
  const an = mode === "CERTAIN_ORDER" ? last.analysis : analysisContacts(idx, { ...baseFilters(), ...last.win }, "TEMPORALLY_NOT_EXCLUDED");
  state.pathUI.loops = feedbackLoops(an.contacts, a, last.win.from, last.win.to, mode, an.scope)
    .map((l) => ({ ...l, identityAssumptions: pathIdentityAssumptions(idx, l.steps) }));
  renderPanels();
}

/* ---------------- edge popover ---------------- */
function showEdgePopover(ids) {
  const cs = ids.map((id) => idx.contacts.find((c) => c.id === id));
  $("netStatus").innerHTML = `<div class="edge-pop"><button type="button" class="close" data-close>×</button>
    <b>${esc(idx.peopleById[cs[0].source].canonicalName)} → ${esc(idx.peopleById[cs[0].target].canonicalName)}</b> ${layerChip(cs[0].layer)}
    <ul class="plain rels">${cs.map((c) => relationLine(idx, c, { showEvent: true })).join("")}</ul></div>`;
}

/* ---------------- 위임 클릭 ---------------- */
document.addEventListener("click", (e) => {
  const t = e.target.closest("[data-person],[data-event],[data-path-from],[data-path-to],[data-loop],[data-show-loop],[data-close],#btnPath,#btnPathClear,#btnLoops");
  if (!t) return;
  if (t.dataset.person) return selectPerson(t.dataset.person);
  if (t.dataset.event) { setCursor(idx.events.indexOf(idx.eventsById[t.dataset.event])); switchTab("event"); return renderPanels(); }
  if (t.dataset.pathFrom) { state.pathUI.from = t.dataset.pathFrom; switchTab("analysis"); return renderPanels(); }
  if (t.dataset.pathTo) { state.pathUI.to = t.dataset.pathTo; switchTab("analysis"); return renderPanels(); }
  if (t.dataset.loop) { state.pathUI.loopAnchor = t.dataset.loop; switchTab("analysis"); renderPanels(); return runLoops(); }
  if (t.dataset.showLoop) { net.highlightPath(state.pathUI.loops[+t.dataset.showLoop].steps); return; }
  if (t.dataset.close !== undefined) { $("netStatus").innerHTML = ""; return; }
  if (t.id === "btnPath") return runPath();
  if (t.id === "btnPathClear") { state.pathUI.result = undefined; net.clearPath(); return renderPanels(); }
  if (t.id === "btnLoops") return runLoops();
});

/* ---------------- 검증 배지 · 커버리지 안내 ---------------- */
(function header() {
  const cov = DATA.COVERAGE;
  const first = cov[0], lastY = cov[cov.length - 1];
  $("dataRange").textContent = `${first.year}–${lastY.year}`;
  const b = $("validationBadge");
  const nE = validation.errors.length;
  b.addEventListener("click", () => $("validationDetail").classList.toggle("hidden"));
  if (nE) $("validationDetail").classList.remove("hidden");

  const byGroup = {};
  idx.events.forEach((e) => { const g = idx.evidenceOfEvent(e); byGroup[g] = (byGroup[g] || 0) + 1; });
  const nc = cov.filter((c) => c.scopeStatus === "NONE").map((c) => c.year);
  const partial = cov.filter((c) => c.scopeStatus === "PARTIAL").map((c) => `${c.year}(${c.scope})`);
  const wr = validation.warningReport;
  b.textContent = nE ? `데이터 검증 오류 ${nE}` : `데이터 검증 통과 · 예상된 경고 ${wr.expected.length}${wr.unexpected.length ? ` · 예상 밖 경고 ${wr.unexpected.length}` : ""}`;
  b.classList.toggle("bad", nE > 0 || wr.unexpected.length > 0);
  $("validationDetail").innerHTML = `<b>validateData()</b> ${esc(JSON.stringify(validation.stats))}
    <ul>${validation.errors.map((x) => `<li class="err">${esc(x)}</li>`).join("")}
    ${wr.unexpected.map((x) => `<li class="err">예상 밖 경고 [${esc(x.code)}] ${esc(x.message)}</li>`).join("")}
    ${wr.expected.map((x) => `<li class="warn">예상된 경고(known exception) [${esc(x.code)}] ${esc(x.message)} — ${esc(x.reason)}</li>`).join("")}
    ${validation.notices.map((x) => `<li class="muted">${esc(x)}</li>`).join("")}</ul>`;
  if (wr.unexpected.length) $("validationDetail").classList.remove("hidden");
  $("coverageNote").innerHTML = `사건 ${idx.events.length}개 — pack v1 검증 ${byGroup.verified || 0} · legacy(v2 이관·anchor 시드) ${byGroup.legacy || 0}.
    관계 ${idx.contacts.length}개 — ${evidenceClassSummary(countByClass(idx.contacts))}
    <span class="muted">(사료 id가 붙어 있다는 것과 원문에 관계가 직접 나타난다는 것은 다르다 — 기본 지표는 직접+규칙 파생만)</span>.
    <b>${NOT_COVERED_LABEL}:</b> ${nc.join(", ") || "없음"} <span class="muted">(NA — 0이 아님)</span> ·
    <b>부분 조사 연도:</b> ${partial.join(", ") || "없음"} <span class="muted">(사건 수를 다른 연도와 단순 비교하지 말 것)</span>.
    <b>FULL 연도도 '전수 조사 완료'가 아니다</b> — FULL은 연도 전체가 조사 기간 안이라는 뜻일 뿐, 기사는 seed set입니다. 작업 범위 ${formatDate("1432-12-09")} ~ ${formatDate("1449-07-07")}.`;
})();

update();
window.__app = { state, idx, update, setCursor, selectPerson, last: () => last, net, validation, countByClass };
