/* ==========================================================================
   [분석] 탭 — 선택 기간·layer·필터에 대한 temporal metrics, 연도별 trajectory,
   layer별 중심성, temporal path / 피드백 루프 탐색
   ========================================================================== */
import { LAYERS } from "../data/vocab.js";
import { METRICS } from "./filters.js";
import { esc, personLink, layerChip, certBadge, evidenceBadge, eventDateLabel, formatRange } from "./format.js";
import { yearLineChart } from "./charts.js";

const COLS = [
  ["inDeg", "in"], ["outDeg", "out"], ["activity", "사건"], ["spanMonths", "기간(월)"], ["persistence", "지속"],
  ["layerCount", "layer"], ["closeness", "closeness"], ["betweenness", "betw."], ["broadcast", "bcast"], ["receive", "recv"]
];
const f3 = (v) => (typeof v === "number" ? (Number.isInteger(v) ? String(v) : v.toFixed(3)) : esc(v));

export function renderAnalysisPanel(el, idx, ctx) {
  const { win, metricsResult, metricKey, trajectory, layerMatrix, pathUI } = ctx;
  const { nodes, metrics, meta } = metricsResult;
  const sortKey = metricKey === "none" ? "degree" : metricKey;
  const ranked = [...nodes].sort((a, b) => (metrics[b][sortKey] || 0) - (metrics[a][sortKey] || 0));

  const table = `<table class="metric-table">
    <tr><th>행위자</th>${COLS.map(([k, l]) => `<th class="${k === sortKey ? "on" : ""}" title="${esc(METRICS[k] || k)}">${l}</th>`).join("")}</tr>
    ${ranked.slice(0, 20).map((n) => `<tr><td>${personLink(idx, n, ctx.cursorDate)}</td>${COLS.map(([k]) => `<td class="${k === sortKey ? "on" : ""}">${f3(metrics[n][k])}</td>`).join("")}</tr>`).join("")}
  </table>`;

  const trajNodes = Object.keys(trajectory.series);
  const charts = trajNodes.map((n) => `<div class="traj-block"><div class="traj-name">${personLink(idx, n, ctx.cursorDate)}</div>
      <div class="charts">${yearLineChart({ title: "degree", years: trajectory.years, values: trajectory.series[n].degree, fmt: String })}
      ${yearLineChart({ title: "betweenness", years: trajectory.years, values: trajectory.series[n].betweenness })}</div></div>`).join("");

  const usedLayers = Object.keys(LAYERS).filter((l) => nodes.some((n) => layerMatrix[n] && layerMatrix[n][l]));
  const layerTop = [...nodes].sort((a, b) => (metrics[b].degree || 0) - (metrics[a].degree || 0)).slice(0, 12);
  const layerTable = `<table class="metric-table layer-table">
    <tr><th>행위자</th>${usedLayers.map((l) => `<th title="${esc(LAYERS[l].label)}"><span class="dot" style="background:${LAYERS[l].color}"></span>${esc(l.slice(0, 5))}</th>`).join("")}</tr>
    ${layerTop.map((n) => `<tr><td>${personLink(idx, n, ctx.cursorDate)}</td>${usedLayers.map((l) => `<td>${(layerMatrix[n] && layerMatrix[n][l]) || ""}</td>`).join("")}</tr>`).join("")}
  </table>`;

  const opt = (id, sel) => `<option value="${esc(id)}" ${id === sel ? "selected" : ""}>${esc(idx.peopleById[id].canonicalName)}</option>`;
  const nodeOpts = (sel) => (ctx.pathNodes || nodes).map((n) => opt(n, sel)).join("");
  const eventOpts = (sel) => idx.events.filter((e) => ctx.eventAllowed(e)).map((e) => `<option value="event:${esc(e.id)}" ${"event:" + e.id === sel ? "selected" : ""}>${esc(eventDateLabel(e))} ${esc(e.title)}</option>`).join("");

  const FLAG = {
    EXACT: "EXACT — 모든 단계가 일 단위 확정 날짜, 순서 확정",
    PARTIAL_ORDER: "PARTIAL_ORDER — 순서는 확실하나 같은 날 연쇄·범위 날짜 포함(정확한 시각 미상)",
    UNCERTAIN: "UNCERTAIN — 날짜만으로 순서가 확정되지 않는 단계 포함(가능한 순서)"
  };
  const flagHtml = (flag) => `<span class="path-flag pf-${esc(flag)}" title="${esc(FLAG[flag])}">${esc(flag)}</span>`;
  const stepsHtml = (steps) => `<ol class="path-steps">${steps.map((s) => `<li><span class="rel-date" title="관계 시각 범위">${esc(formatRange(s.contact.tMin, s.contact.tMax))}</span>
      ${personLink(idx, s.from, s.contact.anchor)} ${s.contact.direction === "undirected" ? "↔" : "→"} ${personLink(idx, s.to, s.contact.anchor)} ${layerChip(s.contact.layer)} <code>${esc(s.contact.relationType)}</code> ${certBadge(s.contact.certainty)} ${evidenceBadge(s.contact.provenance)}</li>`).join("")}</ol>`;

  let pathResult = "";
  if (pathUI.result === null) pathResult = `<p class="warn">선택한 기간·필터·순서 모드에서 시간 순서를 지키는 경로가 없습니다(과거와 미래의 edge를 이어붙이지 않으며, ${pathUI.mode === "strict" ? "날짜 순서가 확정되지 않은 관계는 쓰지 않음" : "가능한 순서까지 허용"}).</p>`;
  else if (pathUI.result) pathResult = `<p>${flagHtml(pathUI.result.flag)} ${pathUI.result.hops} hop · 도착(${pathUI.result.mode === "strict" ? "늦을 수 있는 최댓값" : "가장 이른 가능 시각"}) ${esc(pathUI.result.arrival)} · 시간 순행 검사 <b>${pathUI.result.ok ? "통과" : "실패"}</b></p>${stepsHtml(pathUI.result.steps)}`;

  let loops = "";
  if (pathUI.loops) {
    loops = pathUI.loops.length
      ? pathUI.loops.map((l, i) => `<div class="loop"><button type="button" class="btn btn-ghost btn-sm" data-show-loop="${i}">네트워크에 표시</button> ${flagHtml(l.flag)} ${personLink(idx, l.via, l.closedAt)} 경유, ${esc(l.closedAt)}까지 귀환${stepsHtml(l.steps)}</div>`).join("")
      : `<p class="muted">선택한 기간·필터에서 ${esc(idx.peopleById[pathUI.loopAnchor].canonicalName)}(으)로 돌아오는 시간 순행 루프가 없습니다.</p>`;
  }

  el.innerHTML = `
    <div class="note">분석 창: <b>${esc(win.from)}</b> ~ <b>${esc(win.to)}</b> · 지표 데이터셋 <b>${esc(ctx.datasetLabel)}</b>
      · contact ${ctx.contactCount}개 · 노드 ${meta.N}개
      · communicability α=${meta.alpha != null ? meta.alpha.toFixed(3) : "—"} (slice ${meta.slices ?? 0}개, 일 단위 미확정 관계 ${meta.communicabilityExcludedInexact ?? 0}개 제외)
      <br><span class="small">지표는 <b>strict</b> 판정: 관계 시각이 분석 창 안에 확실히 있고 순서가 확정되는 관계만 사용.
      제외 — 시각 불확실 <b>${ctx.excludedUncertain}</b>개 · '~에 관한' 관계(경로 대상 아님) <b>${ctx.excludedAbout}</b>개.</span>
      <br><span class="muted small">기간 필터와 '타임라인 커서까지' 설정, 근거 토글, layer·level·theater·certainty·사료 유형 필터가 모두 반영됩니다.</span></div>

    <h4>Temporal Path</h4>
    <div class="path-form">
      <label>출발 <select id="pathFrom"><optgroup label="인물·집단">${nodeOpts(pathUI.from)}</optgroup><optgroup label="사건(행위자 전원, 사건일부터)">${eventOpts(pathUI.from)}</optgroup></select></label>
      <label>도착 <select id="pathTo">${nodeOpts(pathUI.to)}</select></label>
      <label>순서 <select id="pathMode"><option value="strict" ${pathUI.mode === "strict" ? "selected" : ""}>확실한 순서(strict)</option><option value="possible" ${pathUI.mode === "possible" ? "selected" : ""}>가능한 순서(possible)</option></select></label>
      <button type="button" id="btnPath" class="btn btn-primary btn-sm">Temporal Path</button>
      <button type="button" id="btnPathClear" class="btn btn-ghost btn-sm">표시 해제</button>
    </div>
    <p class="muted small">시간 순행 경로는 정보·명령이 '흐를 수 있었던' 통로일 뿐 인과관계를 뜻하지 않습니다. 인과는 사건 탭의 causalStatus를 보세요.
      연·월 단위 또는 '기사일 이전' 날짜에는 가짜 순서를 매기지 않습니다: strict는 순서가 확정되는 단계만 잇고, possible은 가능한 순서를 잇되 UNCERTAIN으로 표시합니다.</p>
    ${pathResult}

    <h4>피드백 루프 <small class="muted">anchor → … → anchor, 시간 순행</small></h4>
    <div class="path-form">
      <select id="loopAnchor">${nodeOpts(pathUI.loopAnchor)}</select>
      <button type="button" id="btnLoops" class="btn btn-ghost btn-sm">찾기</button>
    </div>
    ${loops}

    <h4>Temporal metrics <small class="muted">정렬: ${esc(METRICS[sortKey] || sortKey)} (왼쪽 '노드 크기 지표'로 변경)</small></h4>
    ${table}
    <details class="table-view"><summary>지표 정의</summary>
      <ul class="small">
        <li><b>in/out</b>: 창 안 contact 수(방향별, 중복 포함)</li>
        <li><b>사건</b>: 관계로 참여한 서로 다른 사건 수(temporal activity)</li>
        <li><b>기간</b>: 창 안 첫~마지막 활동의 근사 개월 수(active span)</li>
        <li><b>지속</b>: 활동한 연도 수 / 창의 연도 수(node persistence)</li>
        <li><b>layer</b>: 서로 다른 관계 layer 수(정규화 엔트로피는 툴팁 없이 계산만)</li>
        <li><b>closeness</b>: (1/(N−1)) Σ 1/(1+Δ개월), Δ = 가장 이른 도착 − 창 내 첫 contact</li>
        <li><b>betw.</b>: 시간 순행(라벨 최적 foremost, strict 순서) 경로 기반 betweenness</li>
        <li><b>bcast/recv</b>: Grindrod et al.(2011) dynamic communicability 행·열 합 — 일 단위로 확정된 관계만 시간 조각에 배치</li>
      </ul>
      <p class="small">수식과 참고문헌: research/methodology.md</p>
    </details>

    <h4>연도별 centrality trajectory <small class="muted">${trajectory.years[0] || ""}~${trajectory.years[trajectory.years.length - 1] || ""}</small></h4>
    <p class="muted small">${ctx.trajectoryNote} · 연도 slice 제외(시각 불확실): ${trajectory.excluded.map((n, i) => `${trajectory.years[i]}:${n}`).join(" ")}
      · 빈 칸 = coverage 미수록 연도(현재 검증팩에서 미조사/미수록)</p>
    ${charts}

    <h4>layer별 중심성 <small class="muted">노드별 layer 관계 수(in+out)</small></h4>
    ${layerTable}
  `;
}
