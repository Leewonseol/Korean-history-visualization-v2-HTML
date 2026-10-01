/* ==========================================================================
   왼쪽 필터 패널: 기간 · level · layer · theater · certainty · 사료 유형 · 지표
   모든 목록은 vocab과 실제 데이터에서 생성한다(HTML 하드코딩 없음).
   ========================================================================== */
import { LEVELS, LEVEL_ORDER, LAYERS, THEATERS, THEATER_ORDER, CERTAINTY, CERTAINTY_ORDER, SOURCE_TYPES, AFFILIATIONS, ENTITY_TYPES } from "../data/vocab.js";

export const METRICS = {
  none:          "균일(강조 없음)",
  degree:        "Temporal degree (in+out)",
  inDeg:         "Temporal in-degree",
  outDeg:        "Temporal out-degree",
  activity:      "Temporal activity(사건 수)",
  layerCount:    "Layer diversity(수)",
  persistence:   "Node persistence",
  closeness:     "Earliest-arrival temporal closeness",
  betweenness:   "Temporal betweenness",
  broadcast:     "Broadcast(dynamic communicability)",
  receive:       "Receive(dynamic communicability)"
};

export function defaultFilterState(idx) {
  return {
    yearFrom: idx.years[0],
    yearTo: idx.years[idx.years.length - 1],
    limitToCursor: true,
    windowMode: "cumulative",
    levels: new Set(LEVEL_ORDER),
    layers: new Set(Object.keys(LAYERS)),
    theaters: new Set(THEATER_ORDER),
    certainties: new Set(CERTAINTY_ORDER),
    sourceTypes: new Set(Object.keys(SOURCE_TYPES)),
    metric: "none",
    showPlaces: false
  };
}

export function createFilters(idx, state, onChange) {
  const $ = (id) => document.getElementById(id);
  const layerCounts = {};
  idx.contacts.forEach((c) => (layerCounts[c.layer] = (layerCounts[c.layer] || 0) + 1));
  const srcCounts = {};
  idx.events.forEach((e) => e.sourceIds.forEach((s) => { const t = idx.sourcesById[s].sourceType; srcCounts[t] = (srcCounts[t] || 0) + 1; }));

  function checklist(containerId, keys, setName, labelFn, swatchFn) {
    const el = $(containerId);
    el.innerHTML = keys.map((k) => `
      <label class="filter-item" data-key="${k}">
        <input type="checkbox" value="${k}" ${state.f[setName].has(k) ? "checked" : ""}>
        ${swatchFn ? swatchFn(k) : ""}<span>${labelFn(k)}</span>
      </label>`).join("");
    el.addEventListener("change", (e) => {
      if (e.target.type !== "checkbox") return;
      e.target.checked ? state.f[setName].add(e.target.value) : state.f[setName].delete(e.target.value);
      onChange();
    });
  }
  const sw = (color, style = "solid") => `<span class="swatch-line" style="border-top:3px ${style} ${color}"></span>`;

  checklist("filterLevel", LEVEL_ORDER, "levels", (k) => LEVELS[k].label);
  checklist("filterLayer", Object.keys(LAYERS), "layers",
    (k) => `${LAYERS[k].label} <em class="count">${layerCounts[k] || 0}</em>`, (k) => sw(LAYERS[k].color));
  checklist("filterTheater", THEATER_ORDER, "theaters", (k) => THEATERS[k].label);
  checklist("filterCertainty", CERTAINTY_ORDER, "certainties",
    (k) => `${CERTAINTY[k].label}`, (k) => sw("var(--ink-soft)", CERTAINTY[k].line));
  checklist("filterSourceType", Object.keys(SOURCE_TYPES), "sourceTypes",
    (k) => `${SOURCE_TYPES[k]} <em class="count">${srcCounts[k] || 0}</em>`);

  // 전체/해제 버튼
  document.querySelectorAll("[data-all],[data-none]").forEach((b) => b.addEventListener("click", () => {
    const id = b.dataset.all || b.dataset.none;
    const setName = { filterLevel: "levels", filterLayer: "layers" }[id];
    const on = !!b.dataset.all;
    $(id).querySelectorAll("input").forEach((i) => { i.checked = on; on ? state.f[setName].add(i.value) : state.f[setName].delete(i.value); });
    onChange();
  }));

  // 기간 (연도 목록은 EVENTS에서 자동 생성)
  const years = idx.years;
  const allYears = [];
  for (let y = years[0]; y <= years[years.length - 1]; y++) allYears.push(y);
  const opts = (sel) => allYears.map((y) => `<option value="${y}" ${y === sel ? "selected" : ""}>${y}${years.includes(y) ? "" : " (사건 없음)"}</option>`).join("");
  $("periodFrom").innerHTML = opts(state.f.yearFrom);
  $("periodTo").innerHTML = opts(state.f.yearTo);
  $("periodFrom").addEventListener("change", (e) => { state.f.yearFrom = +e.target.value; if (state.f.yearTo < state.f.yearFrom) { state.f.yearTo = state.f.yearFrom; $("periodTo").value = state.f.yearTo; } onChange(); });
  $("periodTo").addEventListener("change", (e) => { state.f.yearTo = +e.target.value; if (state.f.yearFrom > state.f.yearTo) { state.f.yearFrom = state.f.yearTo; $("periodFrom").value = state.f.yearFrom; } onChange(); });
  $("limitToCursor").addEventListener("change", (e) => { state.f.limitToCursor = e.target.checked; onChange(); });
  $("windowMode").addEventListener("click", (e) => {
    const b = e.target.closest("button"); if (!b) return;
    state.f.windowMode = b.dataset.mode;
    $("windowMode").querySelectorAll("button").forEach((x) => x.classList.toggle("on", x === b));
    onChange();
  });

  $("metricSelect").innerHTML = Object.entries(METRICS).map(([k, v]) => `<option value="${k}">${v}</option>`).join("");
  $("metricSelect").addEventListener("change", (e) => { state.f.metric = e.target.value; onChange(); });
  $("showPlaces").addEventListener("change", (e) => { state.f.showPlaces = e.target.checked; onChange(); });

  $("btnResetFilters").addEventListener("click", () => {
    state.f = defaultFilterState(idx);
    createFiltersReset();
    onChange();
  });
  function createFiltersReset() {
    document.querySelectorAll("#panel-filters input[type=checkbox]").forEach((i) => {
      if (i.id === "limitToCursor") i.checked = true;
      else if (i.id === "showPlaces") i.checked = false;
      else i.checked = true;
    });
    $("periodFrom").value = state.f.yearFrom; $("periodTo").value = state.f.yearTo;
    $("metricSelect").value = "none";
    $("windowMode").querySelectorAll("button").forEach((x) => x.classList.toggle("on", x.dataset.mode === "cumulative"));
  }

  // 범례
  $("legend").innerHTML = `
    <div class="legend-title">노드 색 = 세력·소속</div>
    ${Object.entries(AFFILIATIONS).map(([, a]) => `<div class="legend-row"><span class="dot" style="background:${a.color}"></span>${a.label}</div>`).join("")}
    <div class="legend-title">노드 모양 = 행위자 유형 · 세로 위치 = level</div>
    <div class="legend-row"><span class="shape s-ellipse"></span>${ENTITY_TYPES.person.label}</div>
    <div class="legend-row"><span class="shape s-rect"></span>${ENTITY_TYPES.group.label}</div>
    <div class="legend-row"><span class="shape s-hex">⬢</span>${ENTITY_TYPES.institution.label}</div>
    <div class="legend-title">선 모양 = 확실성 (선 색 = layer)</div>
    <div class="legend-row">${sw("var(--ink)", "solid")}사료에 기록된 사실</div>
    <div class="legend-row">${sw("var(--ink)", "dotted")}당대 주장 · 다툼</div>
    <div class="legend-row">${sw("var(--ink)", "dashed")}해석 · 2차자료 · 미검증 시드</div>
    <div class="legend-row muted">흐린 선 = 현재 사건 이전 관계, 굵은 선 = 현재 사건의 관계</div>`;
}
