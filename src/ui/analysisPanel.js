/* ==========================================================================
   [분석] 탭 — 선택 기간·layer·필터에 대한 temporal metrics, 연도별 trajectory,
   layer별 중심성, temporal path / 피드백 루프 탐색
   ========================================================================== */
import { LAYERS } from "../data/vocab.js";
import { METRICS } from "./filters.js";
import { esc, personLink, layerChip, certBadge, evidenceBadge, eventDateLabel, formatRange, evidenceClassSummary, classBadge, caveatBox } from "./format.js";
import { ORDER_MODES } from "../model/temporalNetwork.js";
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
      <div class="charts">${yearLineChart({ title: "degree", years: trajectory.years, values: trajectory.series[n].degree, scope: trajectory.scope, fmt: String })}
      ${yearLineChart({ title: "betweenness", years: trajectory.years, values: trajectory.series[n].betweenness, scope: trajectory.scope })}</div></div>`).join("");

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
    UNCERTAIN: "UNCERTAIN — 시간 정보상 모순되지 않지만 실제 순서를 입증하지는 않음(순서 미확정 단계 포함)"
  };
  const flagHtml = (flag) => `<span class="path-flag pf-${esc(flag)}" title="${esc(FLAG[flag])}">${esc(flag)}</span>`;
  const stepsHtml = (steps) => `<ol class="path-steps">${steps.map((s) => `<li><span class="rel-date" title="관계 시각 범위">${esc(formatRange(s.contact.tMin, s.contact.tMax))}</span>
      ${personLink(idx, s.from, s.contact.anchor)} ${s.contact.direction === "undirected" ? "↔" : "→"} ${personLink(idx, s.to, s.contact.anchor)} ${layerChip(s.contact.layer)} <code>${esc(s.contact.relationType)}</code> ${certBadge(s.contact.certainty)} ${evidenceBadge(s.contact.provenance)}</li>`).join("")}</ol>`;

  let pathResult = "";
  const idAssume = (list) => (list && list.length ? `<p class="warn small">동일성 가정 ${list.length}곳: ${list.map((a) => `${personLink(idx, a.node)}(${esc(a.inEvent)} → ${esc(a.outEvent)})`).join(", ")}
    — 같은 이름의 다른 사건 등장을 같은 사람으로 이어 붙였습니다(PROBABLE_SAME, 사료로 미확인).</p>` : "");
  if (pathUI.result === null) pathResult = `<p class="warn">선택한 기간·필터·순서 모드에서 시간 순서를 지키는 경로가 없습니다(과거와 미래의 edge를 이어붙이지 않으며, ${pathUI.mode === "CERTAIN_ORDER" ? "날짜 순서가 확정되지 않은 관계는 쓰지 않음" : "시간 정보상 배제되지 않는 순서까지 허용"}).</p>`;
  else if (pathUI.result) pathResult = `<p>${flagHtml(pathUI.result.flag)} ${pathUI.result.hops} hop · 도착(${pathUI.result.mode === "CERTAIN_ORDER" ? "늦을 수 있는 최댓값" : "시간상 배제되지 않는 가장 이른 시각"}) ${esc(pathUI.result.arrival)} · 시간 순행 검사 <b>${pathUI.result.ok ? "통과" : "실패"}</b></p>
    ${pathUI.result.mode === "TEMPORALLY_NOT_EXCLUDED" ? `<p class="warn small">TEMPORALLY_NOT_EXCLUDED: 이 경로는 시간 정보상 모순되지 않을 뿐, 실제로 이 순서로 흘렀음을 입증하지 않습니다.</p>` : ""}
    ${idAssume(pathUI.result.identityAssumptions)}${stepsHtml(pathUI.result.steps)}`;

  let loops = "";
  if (pathUI.loops) {
    loops = pathUI.loops.length
      ? pathUI.loops.map((l, i) => `<div class="loop"><button type="button" class="btn btn-ghost btn-sm" data-show-loop="${i}">네트워크에 표시</button> ${flagHtml(l.flag)} ${personLink(idx, l.via, l.closedAt)} 경유, ${esc(l.closedAt)}까지 귀환${idAssume(l.identityAssumptions)}${stepsHtml(l.steps)}</div>`).join("")
      : `<p class="muted">선택한 기간·필터에서 ${esc(idx.peopleById[pathUI.loopAnchor].canonicalName)}(으)로 돌아오는 시간 순행 루프가 없습니다.</p>`;
  }

  el.innerHTML = `
    <div class="note">분석 창: <b>${esc(win.from)}</b> ~ <b>${esc(win.to)}</b> · 지표 데이터셋 <b>${esc(ctx.datasetLabel)}</b>
      · contact ${ctx.contactCount}개 · 노드 ${meta.N}개
      · communicability α=${meta.alpha != null ? meta.alpha.toFixed(3) : "—"} (slice ${meta.slices ?? 0}개, 일 단위 미확정 관계 ${meta.communicabilityExcludedInexact ?? 0}개 제외)
      <br><span class="small">지표 입력 근거: ${evidenceClassSummary(ctx.evidenceCounts)}</span>
      <br><span class="small">지표는 <b>CERTAIN_ORDER</b> 판정: 관계 시각이 분석 창 안에 확실히 있고 순서가 확정되는 관계만 사용.
      포함 <b>${ctx.contactCount}</b>개 · 제외 — 시각 불확실 <b>${ctx.excludedUncertain}</b>개 · '~에 관한' 관계(경로 대상 아님) <b>${ctx.excludedAbout}</b>개.</span>
      <br><span class="small">동일성 미해결 노드(identity unresolved node count): <b>${ctx.identity.unresolved}</b> / 인물 노드 ${ctx.identity.persons}
      <span class="muted">(PROBABLE_SAME·UNRESOLVED·UNRESOLVED_DISTINCT — 지표는 이 노드들의 병합 가정에 의존할 수 있음)</span></span>
      <br><span class="muted small">기간 필터와 '타임라인 커서까지' 설정, 근거 토글, layer·level·theater·certainty·사료 유형 필터가 모두 반영됩니다.</span></div>

    <h4>Temporal Path</h4>
    <div class="path-form">
      <label>출발 <select id="pathFrom"><optgroup label="인물·집단">${nodeOpts(pathUI.from)}</optgroup><optgroup label="사건(행위자 전원, 사건일부터)">${eventOpts(pathUI.from)}</optgroup></select></label>
      <label>도착 <select id="pathTo">${nodeOpts(pathUI.to)}</select></label>
      <label>순서 <select id="pathMode"><option value="CERTAIN_ORDER" ${pathUI.mode === "CERTAIN_ORDER" ? "selected" : ""}>CERTAIN_ORDER — 확실한 순서</option><option value="TEMPORALLY_NOT_EXCLUDED" ${pathUI.mode === "TEMPORALLY_NOT_EXCLUDED" ? "selected" : ""}>TEMPORALLY_NOT_EXCLUDED — 시간상 배제되지 않음</option></select></label>
      <button type="button" id="btnPath" class="btn btn-primary btn-sm">Temporal Path</button>
      <button type="button" id="btnPathClear" class="btn btn-ghost btn-sm">표시 해제</button>
    </div>
    <p class="muted small">시간 순행 경로는 정보·명령이 '흐를 수 있었던' 통로일 뿐 인과관계를 뜻하지 않습니다. 인과는 사건 탭의 causalStatus를 보세요.
      연·월 단위 또는 '기사일 이전' 날짜에는 가짜 순서를 매기지 않습니다.
      <b>CERTAIN_ORDER</b>: ${esc(ORDER_MODES.CERTAIN_ORDER)}. <b>TEMPORALLY_NOT_EXCLUDED</b>: ${esc(ORDER_MODES.TEMPORALLY_NOT_EXCLUDED)} — 순서가 확정되지 않은 단계가 있으면 UNCERTAIN.</p>
    ${pathUI.result ? caveatBox(ctx.caveats) : ""}
    ${pathResult}

    <h4>피드백 루프 <small class="muted">anchor → … → anchor, 시간 순행</small></h4>
    <div class="path-form">
      <select id="loopAnchor">${nodeOpts(pathUI.loopAnchor)}</select>
      <button type="button" id="btnLoops" class="btn btn-ghost btn-sm">찾기</button>
    </div>
    ${pathUI.loops && pathUI.loops.length ? caveatBox(ctx.caveats, true) : ""}
    ${loops}

    <h4>Temporal metrics <small class="muted">정렬: ${esc(METRICS[sortKey] || sortKey)} (왼쪽 '노드 크기 지표'로 변경)</small></h4>
    ${caveatBox(ctx.caveats)}
    ${table}
    <details class="table-view"><summary>지표 정의</summary>
      <ul class="small">
        <li><b>in/out</b>: 창 안 contact 수(방향별, 중복 포함)</li>
        <li><b>사건</b>: 관계로 참여한 서로 다른 사건 수(temporal activity)</li>
        <li><b>기간</b>: 창 안 첫~마지막 활동의 근사 개월 수(active span)</li>
        <li><b>지속</b>: 활동한 연도 수 / 창의 연도 수(node persistence)</li>
        <li><b>layer</b>: 서로 다른 관계 layer 수(정규화 엔트로피는 툴팁 없이 계산만)</li>
        <li><b>closeness</b>: (1/(N−1)) Σ 1/(1+Δ개월), Δ = 가장 이른 도착 − 창 내 첫 contact</li>
        <li><b>betw.</b>: 시간 순행(라벨 최적 foremost, CERTAIN_ORDER) 경로 기반 betweenness</li>
        <li><b>bcast/recv</b>: Grindrod et al.(2011) dynamic communicability 행·열 합 — 일 단위로 확정된 관계만 시간 조각에 배치</li>
      </ul>
      <p class="small">수식과 참고문헌: research/methodology.md</p>
    </details>

    <h4>연도별 centrality trajectory <small class="muted">${trajectory.years[0] || ""}~${trajectory.years[trajectory.years.length - 1] || ""}</small></h4>
    <p class="muted small">${ctx.trajectoryNote} · 연도 slice 제외(시각 불확실): ${trajectory.excluded.map((n, i) => `${trajectory.years[i]}:${n}`).join(" ")}
      · 빈 칸 = coverage 미수록 연도(현재 검증팩에서 미조사/미수록) · 아래 띠 = 조사 범위(전체/부분/NA). 속 빈 점 = 부분 조사 연도 — 다른 연도와 값의 크기를 단순 비교하지 마세요.</p>
    ${caveatBox(ctx.caveats, true)}
    ${charts}

    ${missingnessHtml(idx, ctx.missingness)}
    ${mergeHtml(idx, ctx.mergeSensitivity)}

    <h4>layer별 중심성 <small class="muted">노드별 layer 관계 수(in+out)</small></h4>
    ${caveatBox(ctx.caveats, true)}
    ${layerTable}
  `;
}

/* 시간 불확실성으로 빠지는 관계의 분포(missingness) */
function missingnessHtml(idx, m) {
  const row = (r, label = r.key) => `<tr><td>${label}</td><td>${r.included}</td><td>${r.excluded}</td><td>${(r.excludedShare * 100).toFixed(0)}%</td></tr>`;
  const tbl = (title, rows, labelFn) => `<table class="metric-table mini"><tr><th>${title}</th><th>포함</th><th>제외</th><th>제외율</th></tr>${rows.map((r) => row(r, labelFn ? labelFn(r.key) : esc(r.key))).join("")}</table>`;
  return `<h4>시간 불확실성 missingness <small class="muted">기본 지표에서 빠지는 관계가 어떤 종류인지</small></h4>
    <p class="small">화면에 보이는 관계 중 포함 <b>${m.included}</b> · 시각 불확실로 제외 <b>${m.excludedUncertain}</b> · '~에 관한' 관계 제외 <b>${m.excludedAbout}</b>.
      제외가 특정 layer·근거 등급·인물에 몰리면 지표가 그쪽을 체계적으로 과소평가할 수 있습니다(판단은 사람이).</p>
    <div class="miss-grid">
      ${tbl("근거 등급", m.byEvidenceClass, (k) => classBadge(k))}
      ${tbl("시각 형태", m.byTimeShape)}
      ${tbl("layer", m.byLayer)}
      ${tbl("relation type", m.byRelationType.slice(0, 12))}
      ${tbl("인물(제외 많은 순)", m.byPerson.map((p) => ({ key: p.id, included: p.included, excluded: p.excluded, excludedShare: p.excludedShare })), (k) => personLink(idx, k))}
    </div>`;
}
/* 동일성 병합 민감도 */
function mergeHtml(idx, ms) {
  if (!ms) return "";
  return `<h4>동일성 병합 민감도 <small class="muted">PROBABLE_SAME 노드를 사건별 등장으로 쪼갰을 때</small></h4>
    <p class="small">기준 도달 쌍 ${ms.baselineReachablePairs}. 쪼개면 다른 노드 사이 도달이 끊기거나 betweenness가 달라지는 노드 <b>${ms.sensitive.length}</b>개 —
      이 노드들의 경로·중심성은 '같은 이름 = 같은 사람' 가정에 의존합니다.</p>
    ${ms.rows.length ? `<table class="metric-table mini"><tr><th>노드</th><th>창 안 사건</th><th>끊기는 도달 쌍</th><th>betw. 병합</th><th>betw. 분리 합</th></tr>
      ${ms.rows.map((r) => `<tr><td>${personLink(idx, r.id)}</td><td>${r.events}</td><td>${r.reachablePairsLost}</td><td>${r.betweennessMerged.toFixed(2)}</td><td>${r.betweennessSplitSum.toFixed(2)}</td></tr>`).join("")}</table>` : "<p class='muted small'>창 안에서 두 사건 이상에 걸친 PROBABLE_SAME 노드 없음.</p>"}`;
}
