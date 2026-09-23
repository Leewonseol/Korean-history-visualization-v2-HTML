/* ==========================================================================
   1432~1435 조선-건주여진-명 관계 네트워크 — 애플리케이션 로직
   data.js 에 정의된 PEOPLE / EVENTS / EDGES / PERSON_STATES / STORY_SCENES 사용
   ========================================================================== */

(function () {
  "use strict";

  /* ------------------------------ 유틸리티 ------------------------------ */
  // ISO 날짜 문자열은 사전순 비교가 곧 시간순 비교와 같다.
  function dateLTE(a, b) { return a <= b; }
  function dateGTE(a, b) { return a >= b; }

  const peopleById = {};
  PEOPLE.forEach((p) => { peopleById[p.id] = p; });

  const eventById = {};
  EVENTS.forEach((e) => { eventById[e.id] = e; });

  const edgeById = {};
  EDGES.forEach((e) => { edgeById[e.id] = e; });

  const statesByPerson = {};
  PERSON_STATES.forEach((s) => {
    (statesByPerson[s.personId] = statesByPerson[s.personId] || []).push(s);
  });
  Object.values(statesByPerson).forEach((arr) => arr.sort((a, b) => (a.startDate < b.startDate ? -1 : 1)));

  const edgesByPerson = {};
  EDGES.forEach((e) => {
    (edgesByPerson[e.source] = edgesByPerson[e.source] || []).push(e);
    (edgesByPerson[e.target] = edgesByPerson[e.target] || []).push(e);
  });

  // 인물별 "첫 등장일" 계산 (edge 시작일 또는 person_state 시작일 중 가장 이른 날짜)
  const appearanceDate = {};
  PEOPLE.forEach((p) => {
    let min = null;
    (edgesByPerson[p.id] || []).forEach((e) => { if (!min || e.startDate < min) min = e.startDate; });
    (statesByPerson[p.id] || []).forEach((s) => { if (!min || s.startDate < min) min = s.startDate; });
    appearanceDate[p.id] = min || EVENTS[0].date; // 근거가 전혀 없으면 시작일부터 배경 노드로 표시
  });

  function currentStateFor(personId, date) {
    const arr = statesByPerson[personId];
    if (!arr) return null;
    let found = null;
    for (const s of arr) {
      if (s.startDate <= date) found = s; else break;
    }
    return found;
  }

  /* ------------------------------ 타임라인 인덱스 ------------------------------ */
  // 슬라이더의 각 단계는 EVENTS 배열의 한 사건에 대응한다(사건 발생일 단위 이동).
  let currentIndex = 0;
  const totalSteps = EVENTS.length;

  /* ------------------------------ 필터 상태 ------------------------------ */
  const activeFactions = new Set(FILTER_GROUPS.map((f) => f.id));
  const activeRelations = new Set(Object.keys(RELATION_TYPES));

  /* ------------------------------ 강조(하이라이트) 상태 ------------------------------ */
  let highlightedPerson = null;

  /* ------------------------------ 스토리 모드 상태 ------------------------------ */
  let storyMode = false;
  let storyIndex = 0;
  let storyTimer = null;

  /* ------------------------------ 재생 상태 ------------------------------ */
  let playing = false;
  let playTimer = null;
  let playSpeed = 1;

  /* ============================== Cytoscape 초기화 ============================== */
  const cy = cytoscape({
    container: document.getElementById("cy"),
    wheelSensitivity: 0.25,
    style: buildStylesheet(),
    elements: buildElements(),
    layout: { name: "preset" },
    minZoom: 0.3,
    maxZoom: 2.5
  });
  cy.fit(undefined, 40);
  window.cy = cy; // 디버깅/외부 스크립트 연동 편의를 위한 참조 노출

  function buildElements() {
    const nodes = PEOPLE.map((p) => ({
      data: {
        id: p.id,
        label: p.name,
        cluster: p.cluster,
        isGroup: !!p.isGroup
      },
      position: { x: p.pos.x, y: p.pos.y }
    }));
    const edges = EDGES.map((e) => ({
      data: {
        id: e.id,
        source: e.source,
        target: e.target,
        relationType: e.relationType,
        certainty: e.certainty
      }
    }));
    return { nodes, edges };
  }

  function buildStylesheet() {
    const style = [
      {
        selector: "node",
        style: {
          "background-color": (n) => CLUSTERS[n.data("cluster")].color,
          "label": "data(label)",
          "color": "#ffffff",
          "text-outline-color": (n) => CLUSTERS[n.data("cluster")].color,
          "text-outline-width": 2,
          "font-size": 11,
          "font-family": "Pretendard, sans-serif",
          "width": 34,
          "height": 34,
          "shape": "ellipse",
          "text-valign": "bottom",
          "text-margin-y": 6,
          "text-wrap": "wrap",
          "text-max-width": 90,
          "border-width": 2,
          "border-color": "#ffffff",
          "transition-property": "opacity",
          "transition-duration": 200
        }
      },
      {
        selector: "node[?isGroup]",
        style: {
          "shape": "round-rectangle",
          "width": 46,
          "height": 30,
          "font-size": 10
        }
      },
      { selector: "node.not-appeared", style: { "display": "none" } },
      { selector: "node.dormant", style: { "opacity": 0.35 } },
      { selector: "node.filtered-out", style: { "display": "none" } },
      { selector: "node.dimmed", style: { "opacity": 0.12 } },
      { selector: "node.spotlight", style: { "border-color": "#ffcf40", "border-width": 4 } },

      {
        selector: "edge",
        style: {
          "width": (e) => RELATION_TYPES[e.data("relationType")].width,
          "line-color": (e) => RELATION_TYPES[e.data("relationType")].color,
          "target-arrow-color": (e) => RELATION_TYPES[e.data("relationType")].color,
          "target-arrow-shape": (e) => RELATION_TYPES[e.data("relationType")].arrow,
          "source-arrow-shape": (e) => (RELATION_TYPES[e.data("relationType")].bidirectional ? RELATION_TYPES[e.data("relationType")].arrow : "none"),
          "source-arrow-color": (e) => RELATION_TYPES[e.data("relationType")].color,
          "line-style": (e) => lineStyleFor(e.data("relationType"), e.data("certainty")),
          "curve-style": "bezier",
          "opacity": (e) => (e.data("certainty") === "confirmed" ? 0.95 : 0.8),
          "arrow-scale": 1.1,
          "transition-property": "opacity",
          "transition-duration": 200
        }
      },
      { selector: "edge.not-active", style: { "display": "none" } },
      { selector: "edge.filtered-out", style: { "display": "none" } },
      { selector: "edge.dimmed", style: { "opacity": 0.06 } },
      { selector: "edge.spotlight", style: { "opacity": 1, "width": (e) => RELATION_TYPES[e.data("relationType")].width + 1.5 } }
    ];
    return style;
  }

  function lineStyleFor(relationType, certainty) {
    // 확정되지 않은 관계(당대 주장·미확정)는 항상 점선으로 강제해 시각적으로 구분한다.
    if (certainty === "contemporary_claim" || certainty === "disputed") return "dotted";
    if (certainty === "interpretation") return "dashed";
    return RELATION_TYPES[relationType].style;
  }

  /* ============================== 시간 필터 적용 ============================== */
  function applyTimeAndFilters() {
    const date = EVENTS[currentIndex].date;

    cy.nodes().forEach((n) => {
      const id = n.data("id");
      const appeared = appearanceDate[id] <= date;
      n.removeClass("not-appeared dormant filtered-out");
      if (!appeared) { n.addClass("not-appeared"); return; }

      const factionGroup = CLUSTERS[n.data("cluster")].filterGroup;
      if (!activeFactions.has(factionGroup)) { n.addClass("filtered-out"); return; }

      const hasActiveEdge = (edgesByPerson[id] || []).some((e) => isEdgeActive(e, date) && activeRelations.has(e.relationType));
      n.toggleClass("dormant", !hasActiveEdge);
    });

    cy.edges().forEach((e) => {
      const edge = edgeById[e.data("id")];
      const active = isEdgeActive(edge, date) && activeRelations.has(edge.relationType);
      e.removeClass("not-active filtered-out");
      if (!active) { e.addClass("not-active"); return; }
      const srcOk = !cy.getElementById(edge.source).hasClass("filtered-out") && !cy.getElementById(edge.source).hasClass("not-appeared");
      const tgtOk = !cy.getElementById(edge.target).hasClass("filtered-out") && !cy.getElementById(edge.target).hasClass("not-appeared");
      if (!srcOk || !tgtOk) e.addClass("filtered-out");
    });

    reapplyHighlight();
  }

  function isEdgeActive(edge, date) {
    if (edge.startDate > date) return false;
    if (edge.endDate && edge.endDate < date) return false;
    return true;
  }

  /* ============================== 사건 패널 ============================== */
  function renderEventPanel() {
    const ev = EVENTS[currentIndex];
    document.getElementById("currentDate").textContent = ev.date + (ev.dateNote ? " *" : "");
    document.getElementById("currentEventTitle").textContent = ev.title;

    const src = SOURCES.find((s) => s.id === ev.sourceId);
    const catBadges = ev.categories.map((c) => `<span class="badge badge-category">${EVENT_CATEGORY_LABELS[c] || c}</span>`).join(" ");
    const certLabel = CERTAINTY_LABELS[ev.certainty];
    const peopleChips = ev.people.map((pid) => `<span class="person-chip" data-person="${pid}">${peopleById[pid].name}</span>`).join("");

    document.getElementById("eventPanelBody").innerHTML = `
      <div class="event-card">
        <div><span class="event-date">${ev.date}</span>${ev.reportedDate ? ` <span class="muted">(중앙 보고: ${ev.reportedDate})</span>` : ""}</div>
        <div class="event-title">${ev.title}</div>
        <div>${catBadges} <span class="badge badge-${ev.certainty}">${certLabel.badge}</span></div>
        ${ev.dateNote ? `<div class="muted">* ${ev.dateNote}</div>` : ""}
        <div class="event-summary">${ev.summary}</div>
        <div class="event-people">${peopleChips}</div>
        <a class="source-link" href="${src.url}" target="_blank" rel="noopener">사료 원문 보기 — ${src.label} ↗</a>
      </div>
    `;

    document.getElementById("eventPanelBody").querySelectorAll(".person-chip").forEach((chip) => {
      chip.addEventListener("click", () => selectPerson(chip.dataset.person));
    });
  }

  /* ============================== 인물 상세 패널 ============================== */
  const STATUS_LABELS = {
    MERIT: "공로", DEFENSE: "방어", ACCOUNTABILITY: "책임추궁", ACCOUNTABILITY_OVERSIGHT: "지휘책임(감독)",
    ACCOUNTABILITY_ENFORCER: "책임추궁 주체", REWARDED: "포상", WELFARE: "보상 대상", DISPUTED: "미확정(해명 중)",
    MILITARY_CONFLICT: "군사충돌 대상", MEDIATED: "명 중재 대상", DIPLOMACY: "외교", DIPLOMACY_RESUMED: "통교 재개",
    NEUTRAL_WATCH: "조건부 불가침 대상", COUNTER_CLAIM_MADE: "반박 주장 제기", MIGRATED: "이주", ACCUSED: "문죄 대상",
    ACCUSED_RENEWED: "재차 지목", MEDIATION: "중재자", COMMAND: "지휘", POLICY: "정책결정", POLICY_ADVICE: "정책 자문",
    MILITARY_OPERATION: "군사작전 수행", BACKGROUND: "배경 인물(날짜 미상)"
  };
  const WARN_STATUSES = new Set(["ACCOUNTABILITY", "ACCOUNTABILITY_OVERSIGHT", "ACCOUNTABILITY_ENFORCER", "DISPUTED", "MILITARY_CONFLICT", "ACCUSED", "ACCUSED_RENEWED"]);
  const REWARD_STATUSES = new Set(["MERIT", "REWARDED", "WELFARE"]);

  function statusChip(status) {
    let cls = "status-chip";
    if (WARN_STATUSES.has(status)) cls += " warn";
    else if (REWARD_STATUSES.has(status)) cls += " reward";
    return `<span class="${cls}">${STATUS_LABELS[status] || status}</span>`;
  }

  function selectPerson(personId) {
    highlightedPerson = personId;
    reapplyHighlight();
    if (personId === "JO_SEJONG") renderSejongPanel();
    else renderPersonPanel(personId);
    document.getElementById("btnClearHighlight").classList.remove("hidden");
  }

  function renderPersonPanel(personId) {
    const p = peopleById[personId];
    const date = EVENTS[currentIndex].date;
    const states = statesByPerson[personId] || [];

    const stateItems = states.map((s) => {
      const future = s.startDate > date;
      const range = s.endDate ? `${s.startDate} ~ ${s.endDate}` : `${s.startDate} ~`;
      return `<li style="${future ? "opacity:.45" : ""}">
        <div class="tl-date">${range}</div>
        <div class="tl-role">${s.role}</div>
        <div class="tl-status">${s.status.map(statusChip).join("")}</div>
        <div class="tl-desc">${s.description}</div>
      </li>`;
    }).join("");

    const rel = (edgesByPerson[personId] || []).slice().sort((a, b) => (a.startDate < b.startDate ? -1 : 1));
    const relItems = rel.map((e) => {
      const dir = e.source === personId ? `→ ${peopleById[e.target].name}` : `← ${peopleById[e.source].name}`;
      const rt = RELATION_TYPES[e.relationType];
      const cert = CERTAINTY_LABELS[e.certainty];
      return `<div class="edge-rel-item">
        <span class="rel-type" style="color:${rt.color}">[${rt.label}]</span> ${dir}
        <span class="badge badge-${e.certainty}" style="margin-left:4px">${cert.badge}</span><br>
        <span class="muted">${e.startDate}${e.endDate ? " ~ " + e.endDate : " ~"} · ${e.description}</span>
      </div>`;
    }).join("");

    document.getElementById("detailPanel").querySelector("h2").textContent = "인물 상세";
    document.getElementById("detailPanelBody").innerHTML = `
      <div class="detail-panel-inner">
        <div class="detail-head"><span class="detail-name">${p.name}</span></div>
        <div class="detail-cluster">${CLUSTERS[p.cluster].label}${p.baseNote ? " · " + p.baseNote : ""}</div>
        <ul class="timeline-list">${stateItems || '<li class="muted">기록된 상태 변화가 없습니다.</li>'}</ul>
        <div class="edge-rel-list">
          <h4>관계선 (${rel.length})</h4>
          ${relItems || '<div class="muted">기록된 관계선이 없습니다.</div>'}
        </div>
      </div>
    `;
  }

  function renderSejongPanel() {
    const date = EVENTS[currentIndex].date;
    const stages = (statesByPerson["JO_SEJONG"] || []);
    const items = stages.map((s) => {
      const isCurrent = s.startDate <= date && (!s.endDate || s.endDate >= date);
      const isFuture = s.startDate > date;
      return `<div class="sejong-stage ${isCurrent ? "current" : ""}" data-stage="${s.stage}" style="${isFuture ? "opacity:.4" : ""}">
        <div class="tl-date">${s.startDate}${s.endDate ? " ~ " + s.endDate : " ~"}</div>
        <div class="tl-role">${s.description}</div>
      </div>`;
    }).join("");

    document.getElementById("detailPanel").querySelector("h2").textContent = "세종의 정책결정 변화";
    document.getElementById("detailPanelBody").innerHTML = `
      <div class="detail-panel-inner sejong-panel">
        <div class="detail-head"><span class="detail-name">세종</span></div>
        <div class="detail-cluster">${CLUSTERS.JOSEON_CENTRAL.label} · 국왕 — 침입 보고부터 지휘관 책임 심사까지 13단계</div>
        ${items}
      </div>
    `;
  }

  function clearHighlight() {
    highlightedPerson = null;
    reapplyHighlight();
    document.getElementById("btnClearHighlight").classList.add("hidden");
  }

  function reapplyHighlight() {
    cy.elements().removeClass("dimmed spotlight");
    if (!highlightedPerson) return;
    const node = cy.getElementById(highlightedPerson);
    if (!node || node.empty()) return;
    const neighborhood = node.closedNeighborhood();
    cy.elements().difference(neighborhood).addClass("dimmed");
    neighborhood.addClass("spotlight");
    node.removeClass("dimmed");
  }

  /* ============================== 필터 UI ============================== */
  function buildFilterUI() {
    const factionEl = document.getElementById("filterFaction");
    factionEl.innerHTML = FILTER_GROUPS.map((f) => `
      <label class="filter-item">
        <input type="checkbox" checked data-faction="${f.id}">
        <span class="filter-swatch" style="background:${clusterColorForGroup(f.id)}"></span>${f.label}
      </label>
    `).join("");
    factionEl.querySelectorAll("input").forEach((cb) => {
      cb.addEventListener("change", () => {
        cb.checked ? activeFactions.add(cb.dataset.faction) : activeFactions.delete(cb.dataset.faction);
        applyTimeAndFilters();
      });
    });

    const relEl = document.getElementById("filterRelation");
    relEl.innerHTML = Object.keys(RELATION_TYPES).map((key) => `
      <label class="filter-item">
        <input type="checkbox" checked data-relation="${key}">
        <span class="filter-swatch" style="background:${RELATION_TYPES[key].color}"></span>${RELATION_TYPES[key].label}
      </label>
    `).join("");
    relEl.querySelectorAll("input").forEach((cb) => {
      cb.addEventListener("change", () => {
        cb.checked ? activeRelations.add(cb.dataset.relation) : activeRelations.delete(cb.dataset.relation);
        applyTimeAndFilters();
      });
    });

    document.getElementById("btnResetFilters").addEventListener("click", () => {
      FILTER_GROUPS.forEach((f) => activeFactions.add(f.id));
      Object.keys(RELATION_TYPES).forEach((k) => activeRelations.add(k));
      factionEl.querySelectorAll("input").forEach((cb) => (cb.checked = true));
      relEl.querySelectorAll("input").forEach((cb) => (cb.checked = true));
      applyTimeAndFilters();
    });
  }

  function clusterColorForGroup(groupId) {
    const entry = Object.values(CLUSTERS).find((c) => c.filterGroup === groupId);
    return entry ? entry.color : "#888";
  }

  function buildLegend() {
    document.getElementById("legendCertainty").innerHTML = Object.entries(CERTAINTY_LABELS).map(([key, v]) => `
      <div class="legend-row"><span class="badge badge-${key}">${v.badge}</span>${v.label}</div>
    `).join("");

    document.getElementById("legendRelation").innerHTML = Object.entries(RELATION_TYPES).map(([key, v]) => `
      <div class="legend-row">
        <span class="legend-line" style="border-top-color:${v.color}; border-top-style:${v.style === "solid" ? "solid" : v.style};"></span>
        ${v.label}
      </div>
    `).join("");
  }

  /* ============================== 타임라인 컨트롤 ============================== */
  const slider = document.getElementById("timelineSlider");
  slider.max = totalSteps - 1;

  function goToIndex(i, opts) {
    currentIndex = Math.max(0, Math.min(totalSteps - 1, i));
    slider.value = currentIndex;
    renderEventPanel();
    applyTimeAndFilters();
    if (highlightedPerson) {
      if (highlightedPerson === "JO_SEJONG") renderSejongPanel(); else renderPersonPanel(highlightedPerson);
    }
    if (!opts || !opts.silent) {} // reserved for future use
  }

  slider.addEventListener("input", () => goToIndex(parseInt(slider.value, 10)));

  document.getElementById("btnFirst").addEventListener("click", () => { stopPlay(); goToIndex(0); });
  document.getElementById("btnPrev").addEventListener("click", () => { stopPlay(); goToIndex(currentIndex - 1); });
  document.getElementById("btnNext").addEventListener("click", () => { stopPlay(); goToIndex(currentIndex + 1); });
  document.getElementById("btnClearHighlight").addEventListener("click", clearHighlight);

  document.getElementById("speedSelect").addEventListener("change", (e) => {
    playSpeed = parseFloat(e.target.value);
    if (playing) { stopPlayInterval(); startPlayInterval(); }
  });

  const playBtn = document.getElementById("btnPlayPause");
  playBtn.addEventListener("click", () => (playing ? stopPlay() : startPlay()));

  function startPlay() {
    if (currentIndex >= totalSteps - 1) goToIndex(0);
    playing = true;
    playBtn.textContent = "⏸ 일시정지";
    startPlayInterval();
  }
  function startPlayInterval() {
    const base = 1600; // ms per event at 1x
    playTimer = setInterval(() => {
      if (currentIndex >= totalSteps - 1) { stopPlay(); return; }
      goToIndex(currentIndex + 1);
    }, base / playSpeed);
  }
  function stopPlayInterval() { if (playTimer) clearInterval(playTimer); playTimer = null; }
  function stopPlay() {
    playing = false;
    playBtn.textContent = "▶ 재생";
    stopPlayInterval();
  }

  /* ============================== 스토리 모드 ============================== */
  const storyOverlay = document.getElementById("storyOverlay");
  document.getElementById("btnStoryMode").addEventListener("click", () => enterStoryMode());
  document.getElementById("storyExit").addEventListener("click", () => exitStoryMode());
  document.getElementById("storyPrev").addEventListener("click", () => showStoryScene(storyIndex - 1));
  document.getElementById("storyNext").addEventListener("click", () => showStoryScene(storyIndex + 1));

  function enterStoryMode() {
    stopPlay();
    storyMode = true;
    storyOverlay.classList.remove("hidden");
    showStoryScene(0);
  }

  function exitStoryMode() {
    storyMode = false;
    if (storyTimer) clearTimeout(storyTimer);
    storyOverlay.classList.add("hidden");
    clearHighlight();
  }

  function showStoryScene(i) {
    if (i < 0) i = 0;
    if (i >= STORY_SCENES.length) { exitStoryMode(); return; }
    storyIndex = i;
    const scene = STORY_SCENES[i];

    const idx = EVENTS.findIndex((e) => e.date === scene.toDate);
    goToIndex(idx >= 0 ? idx : currentIndex);

    document.getElementById("storyTitle").textContent = scene.title;
    document.getElementById("storyNarration").textContent = scene.narration;
    document.getElementById("storyStep").textContent = `${i + 1} / ${STORY_SCENES.length}`;

    cy.elements().removeClass("dimmed spotlight");
    const focusIds = new Set(scene.focusNodeIds || []);
    cy.nodes().forEach((n) => {
      if (n.hasClass("not-appeared") || n.hasClass("filtered-out")) return;
      if (!focusIds.has(n.data("id"))) n.addClass("dimmed"); else n.addClass("spotlight");
    });
    cy.edges().forEach((e) => {
      if (e.hasClass("not-active") || e.hasClass("filtered-out")) return;
      const ed = edgeById[e.data("id")];
      if (focusIds.has(ed.source) && focusIds.has(ed.target)) e.addClass("spotlight");
      else e.addClass("dimmed");
    });

    if (storyTimer) clearTimeout(storyTimer);
    storyTimer = setTimeout(() => { if (storyMode) showStoryScene(storyIndex + 1); }, 6500);
  }

  /* ============================== 노드 클릭 / 배경 클릭 ============================== */
  cy.on("tap", "node", (evt) => {
    const id = evt.target.data("id");
    if (evt.target.hasClass("not-appeared") || evt.target.hasClass("filtered-out")) return;
    selectPerson(id);
  });
  cy.on("tap", (evt) => { if (evt.target === cy) clearHighlight(); });

  /* ============================== 초기 렌더 ============================== */
  buildFilterUI();
  buildLegend();
  goToIndex(0);

})();
