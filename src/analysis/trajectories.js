/* ==========================================================================
   Centrality trajectory: 분석 기간 안의 연도별 slice에서 temporal metric을 다시 계산
   slice_y = [y-00-00, y-99-99] ∩ [from, to]
   각 slice는 독립적으로 계산된다(이전 연도의 경로를 이어받지 않음).
   slice 입력은 strict 판정: 관계 시각이 그 해 안에 확실히 있을 때만. 연도 경계를 걸치거나 시각 미상인
   관계는 빠지며 excluded 수로 보고한다. coverage가 NOT_COVERED인 연도는 값 대신 null(미조사)로 둔다.
   ========================================================================== */
import { analysisContacts } from "../model/temporalNetwork.js";
import { computeMetrics } from "./centrality.js";
import { yearOf, yearStart, yearEnd, maxDate, minDate } from "../model/dates.js";

export function yearlyTrajectories(idx, filters, nodeIds, keys = ["degree", "betweenness"]) {
  const y0 = yearOf(filters.from < "1000" ? String(idx.years[0]) : filters.from);
  const y1 = yearOf(filters.to);
  const years = [];
  for (let y = Math.max(y0, idx.years[0]); y <= Math.min(y1, idx.years[idx.years.length - 1]); y++) years.push(y);
  const series = {}, excluded = [], coverage = [];
  nodeIds.forEach((n) => { series[n] = {}; keys.forEach((k) => (series[n][k] = [])); });
  for (const y of years) {
    const from = maxDate(filters.from, yearStart(y)), to = minDate(filters.to, yearEnd(y));
    const cov = idx.coverageByYear[y];
    coverage.push(cov ? cov.coverageStatus : "UNKNOWN");
    if (cov && cov.coverageStatus === "NOT_COVERED") {
      excluded.push(0);
      for (const n of nodeIds) for (const k of keys) series[n][k].push(null);
      continue;
    }
    const a = analysisContacts(idx, { ...filters, from, to }, "strict");
    excluded.push(a.excludedUncertain);
    const { metrics } = computeMetrics(a.contacts, { from, to }, { communicability: false });
    for (const n of nodeIds) for (const k of keys) series[n][k].push(metrics[n] ? metrics[n][k] : 0);
  }
  return { years, series, excluded, coverage };
}

// 노드별 layer별 (in+out) 관계 수
export function layerDegreeMatrix(contacts) {
  const M = {};
  for (const c of contacts) for (const n of [c.source, c.target]) {
    M[n] ||= {};
    M[n][c.layer] = (M[n][c.layer] || 0) + 1;
  }
  return M;
}
