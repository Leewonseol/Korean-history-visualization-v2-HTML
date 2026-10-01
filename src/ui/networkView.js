/* ==========================================================================
   Cytoscape temporal multilayer network view
   - 세로 band = 시점별 level(L0~L6), 외부 행위자(L7)는 오른쪽 별도 영역(세력별 열)
   - 노드 색 = 세력, 모양 = entityType, 크기 = 선택 지표(기본은 균일)
   - edge = (source, target, layer, 선모양) 단위로 집계한 contact 묶음
   ========================================================================== */
import { LEVELS, LAYERS, CERTAINTY, AFFILIATIONS, ENTITY_TYPES } from "../data/vocab.js";

const COL_W = 100, ROW_H = 62, PER_ROW = 8, BAND_GAP = 40, BAND_X0 = 0;
const EXT_X0 = BAND_X0 + PER_ROW * COL_W + 80, EXT_COL_W = 104, EXT_ROW_H = 66, EXT_MAX_ROWS = 11;
const JOSEON_LEVELS = ["L0", "L1", "L2", "L3", "L4", "L5", "L6"];
const EXT_AFFS = ["JIANZHOU_WEI", "PAJEOGANG_OTHER", "JIANZHOU_LEFT", "ODORI", "JURCHEN_UNSPEC", "HOLLAON", "ORYANGHAP", "UDIGE", "MING", "UNKNOWN"];
const isExt = (p) => p.defaultLevel === "L7" || p.defaultLevel === "LU";

export function createNetworkView(container, idx, handlers) {
  /* ---------- 고정 슬롯 계산(멘탈맵 유지): 같은 level 안에서 노드 순서는 시간이 흘러도 그대로 ---------- */
  const levelsOf = (p) => new Set([p.defaultLevel, ...(idx.statesByPerson[p.personId] || []).map((s) => s.level)]);
  const order = (a, b) => (a.affiliation + (idx.firstSeen[a.personId] || "9") + a.personId).localeCompare(b.affiliation + (idx.firstSeen[b.personId] || "9") + b.personId);
  const slot = {}; // `${id}|${level}` -> index
  const bandRows = {};
  for (const L of JOSEON_LEVELS) {
    const members = Object.values(idx.peopleById).filter((p) => levelsOf(p).has(L) && p.defaultLevel !== "L7").sort(order);
    members.forEach((p, i) => (slot[`${p.personId}|${L}`] = i));
    bandRows[L] = Math.max(1, Math.ceil(members.length / PER_ROW));
  }
  const bandY = {};
  let y = 0;
  for (const L of JOSEON_LEVELS) { bandY[L] = y; y += bandRows[L] * ROW_H + BAND_GAP; }
  const placeBandY = y + 20;
  // 외부 행위자: 세력별 열. 한 세력이 많으면 하위 열로 접어 넣는다.
  const extSlot = {}, affX = {};
  let col = 0;
  EXT_AFFS.forEach((aff) => {
    const members = Object.values(idx.peopleById).filter((p) => isExt(p) && p.affiliation === aff).sort(order);
    affX[aff] = EXT_X0 + col * EXT_COL_W;
    members.forEach((p, i) => (extSlot[p.personId] = { col: col + Math.floor(i / EXT_MAX_ROWS), row: i % EXT_MAX_ROWS }));
    col += Math.max(1, Math.ceil(members.length / EXT_MAX_ROWS));
  });
  const xCursor = EXT_X0 + col * EXT_COL_W;

  function positionOf(id, level) {
    if (extSlot[id]) {
      const s = extSlot[id];
      return { x: EXT_X0 + s.col * EXT_COL_W, y: 50 + s.row * EXT_ROW_H + (s.col % 2) * 22 };
    }
    if (level === "L7" || level === "LU") return { x: xCursor, y: 50 };
    const i = slot[`${id}|${level}`] ?? 0;
    return { x: BAND_X0 + (i % PER_ROW) * COL_W + (Math.floor(i / PER_ROW) % 2) * (COL_W / 2), y: bandY[level] + Math.floor(i / PER_ROW) * ROW_H };
  }

  /* ---------- 배경 band 라벨 ---------- */
  const bandNodes = JOSEON_LEVELS.map((L) => ({
    group: "nodes", data: { id: `band:${L}`, label: LEVELS[L].label }, classes: "band",
    position: { x: BAND_X0 - 120, y: bandY[L] + ((bandRows[L] - 1) * ROW_H) / 2 }
  }));
  bandNodes.push({ group: "nodes", data: { id: "band:L7", label: `${LEVELS.L7.label} · ${LEVELS.LU.label}` }, classes: "band band-ext", position: { x: (EXT_X0 + xCursor) / 2, y: -50 } });
  EXT_AFFS.forEach((aff, i) => bandNodes.push({
    group: "nodes", data: { id: `band:aff:${aff}`, label: AFFILIATIONS[aff].label }, classes: "band band-col",
    position: { x: affX[aff], y: -10 + (i % 2) * 26 }
  }));

  const cy = cytoscape({
    container,
    elements: bandNodes,
    layout: { name: "preset" },
    wheelSensitivity: 0.25, minZoom: 0.15, maxZoom: 3,
    style: stylesheet()
  });
  cy.nodes(".band").ungrabify().unselectify();

  cy.on("tap", "node.actor", (e) => handlers.onNodeClick(e.target.id()));
  cy.on("tap", "node.place", (e) => handlers.onPlaceClick && handlers.onPlaceClick(e.target.data("placeId")));
  cy.on("tap", "edge.rel", (e) => handlers.onEdgeClick(e.target.data("contactIds")));
  cy.on("tap", (e) => { if (e.target === cy) handlers.onBackgroundClick(); });

  // 화면 맞춤은 전체 band 영역 기준으로 고정한다(노드가 나타날 때마다 확대/축소하지 않음 → 멘탈맵 유지)
  function fit() { cy.fit(cy.nodes(".band"), 24); }
  fit();

  function update(vm) {
    const { contacts, date, metricValues, currentEventId, selected, extraNodes, placeLinks } = vm;
    // 노드 위치(level band)는 커서 시점의 level로 정한다.
    const ids = new Set(extraNodes);
    for (const c of contacts) { ids.add(c.source); ids.add(c.target); }
    const want = new Map([...ids].map((id) => [id, idx.levelAt(id, date)]));

    cy.batch(() => {
      // 노드
      cy.nodes(".actor").forEach((n) => { if (!want.has(n.id())) n.remove(); });
      let maxV = 0;
      if (metricValues) for (const id of want.keys()) maxV = Math.max(maxV, metricValues[id] || 0);
      for (const [id, level] of want) {
        const p = idx.peopleById[id];
        const size = metricValues && maxV > 0 ? 18 + 40 * Math.sqrt((metricValues[id] || 0) / maxV) : 28;
        const pos = positionOf(id, level);
        let n = cy.getElementById(id);
        if (n.empty()) {
          n = cy.add({ group: "nodes", data: { id }, classes: "actor", position: { ...pos } });
        } else if (n.position("x") !== pos.x || n.position("y") !== pos.y) {
          n.animate({ position: pos }, { duration: 350 });
        }
        n.data({ label: p.canonicalName, color: AFFILIATIONS[p.affiliation].color, shape: ENTITY_TYPES[p.entityType].shape, size, level });
      }
      // 관계 edge(집계)
      const agg = new Map();
      for (const c of contacts) {
        const line = CERTAINTY[c.certainty].line;
        const key = `rel:${c.source}|${c.target}|${c.layer}|${line}`;
        if (!agg.has(key)) agg.set(key, { id: key, source: c.source, target: c.target, layer: c.layer, line, contactIds: [], current: false, last: c.startDate });
        const a = agg.get(key);
        a.contactIds.push(c.id);
        if (c.eventId === currentEventId) a.current = true;
        if (c.startDate > a.last) a.last = c.startDate;
      }
      cy.edges(".rel").forEach((e) => { if (!agg.has(e.id())) e.remove(); });
      for (const a of agg.values()) {
        let e = cy.getElementById(a.id);
        if (e.empty()) e = cy.add({ group: "edges", data: { id: a.id, source: a.source, target: a.target }, classes: "rel" });
        e.data({ color: LAYERS[a.layer].color, line: a.line, n: a.contactIds.length, contactIds: a.contactIds,
          width: 1.6 + Math.log2(a.contactIds.length) * 1.4, label: a.contactIds.length > 1 ? `×${a.contactIds.length}` : "" });
        e.toggleClass("current", a.current);
        e.toggleClass("past", !a.current);
      }
      // 장소 overlay
      cy.elements(".place, .place-edge").remove();
      if (placeLinks) {
        const placeIds = [...new Set(placeLinks.map((l) => l.placeId))];
        placeIds.forEach((pid, i) => cy.add({ group: "nodes", data: { id: `place:${pid}`, placeId: pid, label: idx.placesById[pid].canonicalName },
          classes: "place", position: { x: BAND_X0 + (i % 10) * 100, y: placeBandY + Math.floor(i / 10) * 50 } }));
        const seen = new Set();
        for (const l of placeLinks) {
          const k = `pe:${l.actor}|${l.placeId}`;
          if (seen.has(k) || !want.has(l.actor)) continue;
          seen.add(k);
          cy.add({ group: "edges", data: { id: k, source: l.actor, target: `place:${l.placeId}` }, classes: "place-edge" });
        }
      }
      cy.nodes(".actor").removeClass("selected");
      if (selected) cy.getElementById(selected).addClass("selected");
    });
    clearPath();
  }

  function highlightPath(steps) {
    clearPath();
    cy.elements().addClass("faded");
    cy.nodes(".band").removeClass("faded");
    steps.forEach((s, i) => {
      const c = s.contact;
      const e = cy.edges(".rel").filter((x) => x.data("contactIds").includes(c.id));
      e.removeClass("faded").addClass("path").data("pathLabel", `${i + 1}. ${s.time}`);
      cy.getElementById(s.from).removeClass("faded").addClass("path-node");
      cy.getElementById(s.to).removeClass("faded").addClass("path-node");
    });
  }
  function clearPath() {
    cy.elements().removeClass("faded path path-node");
    cy.edges().data("pathLabel", "");
  }
  function focus(ids) {
    const els = cy.collection(ids.map((i) => cy.getElementById(i)).filter((x) => x.nonempty()));
    if (els.nonempty()) cy.animate({ fit: { eles: els, padding: 80 } }, { duration: 400 });
  }
  return { cy, update, highlightPath, clearPath, focus, fit };
}

function stylesheet() {
  return [
    { selector: "node.actor", style: {
      "background-color": "data(color)", shape: "data(shape)", width: "data(size)", height: "data(size)",
      label: "data(label)", "font-size": 13, "text-valign": "bottom", "text-margin-y": 3, "min-zoomed-font-size": 6, color: "#1f2328",
      "text-background-color": "#ffffff", "text-background-opacity": 0.75, "text-background-padding": 1,
      "text-wrap": "ellipsis", "text-max-width": 110, "border-width": 2, "border-color": "#ffffff"
    } },
    { selector: "node.selected", style: { "border-color": "#e0a100", "border-width": 4 } },
    { selector: "node.band", style: {
      shape: "rectangle", width: 1, height: 1, "background-opacity": 0, label: "data(label)", "font-size": 14, "text-wrap": "wrap", "text-max-width": 110,
      color: "#6b7280", "font-weight": 700, "text-halign": "center", "text-valign": "center", events: "no"
    } },
    { selector: "node.band-col", style: { "font-size": 12, "font-weight": 600, "text-max-width": 105 } },
    { selector: "node.place", style: {
      shape: "diamond", width: 16, height: 16, "background-color": "#9aa0a6", label: "data(label)", "font-size": 10,
      color: "#555", "text-valign": "bottom"
    } },
    { selector: "edge.rel", style: {
      width: "data(width)", "line-color": "data(color)", "target-arrow-color": "data(color)", "target-arrow-shape": "triangle",
      "line-style": "data(line)", "curve-style": "bezier", "arrow-scale": 0.9, label: "data(label)", "font-size": 9,
      color: "#444", "text-background-color": "#fff", "text-background-opacity": 0.7
    } },
    { selector: "edge.past", style: { opacity: 0.4 } },
    { selector: "edge.current", style: { opacity: 1, width: "mapData(n, 1, 10, 3.5, 7)", "z-index": 5 } },
    { selector: "edge.place-edge", style: { width: 1, "line-color": "#b8bcc2", "line-style": "dashed", "target-arrow-shape": "none", opacity: 0.6, "curve-style": "straight" } },
    { selector: ".faded", style: { opacity: 0.08 } },
    { selector: "edge.path", style: { opacity: 1, width: 5, "z-index": 10, label: "data(pathLabel)", "font-size": 11, "font-weight": 700, color: "#000" } },
    { selector: "node.path-node", style: { opacity: 1, "border-color": "#e0a100", "border-width": 4 } }
  ];
}
