/* ==========================================================================
   진입점: 상태 관리와 모듈 연결
   데이터 흐름: DATA → buildIndexes → (filters) → filterContacts → networkView / analysis / panels
   ========================================================================== */
import { DATA } from "./data/index.js";
import { buildIndexes, PARTICIPANT_FIELDS } from "./model/indexes.js";
import { validateData } from "./model/validate.js";
import { filterContacts, eventPasses } from "./model/temporalNetwork.js";
import { yearStart, yearEnd, minDate, maxDate, shiftMonths, yearOf } from "./model/dates.js";
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
import { esc, layerChip, certBadge, eventLink } from "./ui/format.js";

const $ = (id) => document.getElementById(id);
const idx = buildIndexes(DATA);
const validation = validateData(DATA);

const state = {
  cursor: 0,
  f: defaultFilterState(idx),
  tab: "event",
  selected: null,
  spotlight: null,
  pathUI: { from: "JO_SEJONG", to: "JO_CHOEYUNDEOK", result: undefined, loops: null, loopAnchor: "JO_SEJONG" }
};

/* ---------------- 창(window) 계산 ---------------- */
const cursorDate = () => idx.events[state.cursor].eventDate;
function period() { return { from: yearStart(state.f.yearFrom), to: yearEnd(state.f.yearTo) }; }
function baseFilters() {
  const f = state.f;
  return { layers: f.layers, levels: f.levels, theaters: f.theaters, certainties: f.certainties, sourceTypes: f.sourceTypes };
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
createFilters(idx, state, () => update());
const story = createStoryMode(idx, {
  setCursor: (i) => setCursor(i),
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
  const displayContacts = filterContacts(idx, { ...fb, ...disp });
  const win = analysisWindow();
  const analysisContacts = filterContacts(idx, { ...fb, ...win });
  const metricsResult = computeMetrics(analysisContacts, win);
  const ev = idx.events[state.cursor];
  const evOk = eventPasses(idx, ev, fb) && (!disp.eventIds || disp.eventIds.has(ev.id)) && ev.eventDate >= disp.from && ev.eventDate <= disp.to;
  const parts = new Set();
  if (evOk) PARTICIPANT_FIELDS.forEach((k) => (ev[k] || []).forEach((p) => { if (fb.levels.has(idx.levelAt(p, ev.eventDate))) parts.add(p); }));
  if (state.selected) parts.add(state.selected);

  let placeLinks = null;
  if (state.f.showPlaces) {
    placeLinks = [];
    for (const e of idx.events) {
      const inWin = disp.eventIds ? disp.eventIds.has(e.id) : e.eventDate >= disp.from && e.eventDate <= disp.to;
      if (!inWin || !eventPasses(idx, e, fb)) continue;
      for (const a of e.actors) for (const pl of e.placeIds) placeLinks.push({ actor: a, placeId: pl });
    }
  }
  const metricValues = state.f.metric === "none" ? null
    : Object.fromEntries(metricsResult.nodes.map((n) => [n, metricsResult.metrics[n][state.f.metric] || 0]));

  net.update({ contacts: displayContacts, date: cursorDate(), metricValues, currentEventId: ev.id, selected: state.selected, extraNodes: [...parts], placeLinks });
  last = { displayContacts, analysisContacts, metricsResult, win, disp };
  timeline.render((e) => eventPasses(idx, e, fb));
  $("netStatus").innerHTML = "";
  const st = document.createElement("div");
  st.className = "net-summary";
  st.textContent = `표시: ${disp.eventIds ? "현재 사건" : `${disp.from.replace(/-00-00$/, "")} ~ ${disp.to.replace(/-99-99$/, "")}`} · edge(contact) ${displayContacts.length} · 노드 ${net.cy.nodes(".actor").length}`;
  $("netStatus").appendChild(st);
  if (state.pathUI.result) net.highlightPath(state.pathUI.result.steps);
  applySpotlight();
  renderPanels();
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
  if (state.tab === "event") renderEventPanel($("tab-event"), idx, ev, DATA);
  if (state.tab === "person") {
    const traj = state.selected ? yearlyTrajectories(idx, { ...baseFilters(), ...last.win }, [state.selected]) : null;
    renderPersonPanel($("tab-person"), idx, state.selected, {
      cursorDate: cursorDate(), windowContacts: last.analysisContacts, metrics: last.metricsResult.metrics, trajectory: traj
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
      contactCount: last.analysisContacts.length
    });
  }
}

/* ---------------- temporal path / 루프 ---------------- */
function runPath() {
  const from = $("pathFrom").value, to = $("pathTo").value;
  state.pathUI.from = from; state.pathUI.to = to;
  const win = last.win;
  let sources = [from], t0 = win.from;
  if (from.startsWith("event:")) {
    const ev = idx.eventsById[from.slice(6)];
    sources = [...new Set(ev.actors)];
    t0 = maxDate(win.from, ev.eventDate);
  }
  const res = temporalPath(last.analysisContacts, sources, to, t0, win.to);
  state.pathUI.result = res ? { ...res, ok: isTimeRespecting(res.steps, t0) } : null;
  state.pathUI.loops = null;
  update();
  switchTab("analysis"); renderPanels();
}
function runLoops() {
  const a = $("loopAnchor").value;
  state.pathUI.loopAnchor = a;
  state.pathUI.loops = feedbackLoops(last.analysisContacts, a, last.win.from, last.win.to);
  renderPanels();
}

/* ---------------- edge popover ---------------- */
function showEdgePopover(ids) {
  const cs = ids.map((id) => idx.contacts.find((c) => c.id === id));
  $("netStatus").innerHTML = `<div class="edge-pop"><button type="button" class="close" data-close>×</button>
    <b>${esc(idx.peopleById[cs[0].source].canonicalName)} → ${esc(idx.peopleById[cs[0].target].canonicalName)}</b> ${layerChip(cs[0].layer)}
    <ul class="plain">${cs.map((c) => `<li>${esc(c.startDate)} <code>${esc(c.relationType)}</code> ${certBadge(c.certainty)} ${eventLink(idx, c.eventId)}</li>`).join("")}</ul></div>`;
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
  const ev = idx.events;
  $("dataRange").textContent = `${ev[0].eventDate.slice(0, 4)}–${ev[ev.length - 1].eventDate.slice(0, 4)}`;
  const b = $("validationBadge");
  const nE = validation.errors.length, nW = validation.warnings.length;
  b.textContent = nE ? `데이터 검증 오류 ${nE}` : `데이터 검증 통과${nW ? ` · 경고 ${nW}` : ""}`;
  b.classList.toggle("bad", nE > 0);
  $("validationDetail").innerHTML = `<b>validateData()</b> ${esc(JSON.stringify(validation.stats))}
    <ul>${validation.errors.map((x) => `<li class="err">${esc(x)}</li>`).join("")}${validation.warnings.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>`;
  b.addEventListener("click", () => $("validationDetail").classList.toggle("hidden"));
  if (nE) $("validationDetail").classList.remove("hidden");

  const byVer = {};
  ev.forEach((e) => (byVer[e.verification] = (byVer[e.verification] || 0) + 1));
  const empty = [];
  for (let y = yearOf(ev[0].eventDate); y <= yearOf(ev[ev.length - 1].eventDate); y++) if (!idx.years.includes(y)) empty.push(y);
  $("coverageNote").innerHTML = `사건 ${ev.length}개 — 기존 데이터 이관 ${byVer.inherited_v2 || 0} · <span class="badge badge-unverified_seed">미검증</span> anchor 시드 ${byVer.seed_unverified || 0}.
    아직 데이터에 사건이 없는 연도: ${empty.join(", ") || "없음"}. 1436~1449는 원문 조사 미완 구간입니다(research/chronology_1432_1449.md).`;
})();

update();
window.__app = { state, idx, update, setCursor, last: () => last, net, validation };
