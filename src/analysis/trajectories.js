/* ==========================================================================
   Centrality trajectory: 분석 기간 안의 연도별 slice에서 temporal metric을 다시 계산
   slice_y = [y-00-00, y-99-99] ∩ [from, to]
   각 slice는 독립적으로 계산된다(이전 연도의 경로를 이어받지 않음).
   ========================================================================== */
import { filterContacts } from "../model/temporalNetwork.js";
import { computeMetrics } from "./centrality.js";
import { yearOf, yearStart, yearEnd, maxDate, minDate } from "../model/dates.js";

export function yearlyTrajectories(idx, filters, nodeIds, keys = ["degree", "betweenness"]) {
  const y0 = yearOf(filters.from < "1000" ? idx.events[0].eventDate : filters.from);
  const y1 = yearOf(filters.to);
  const years = [];
  for (let y = Math.max(y0, idx.years[0]); y <= Math.min(y1, idx.years[idx.years.length - 1]); y++) years.push(y);
  const series = {};
  nodeIds.forEach((n) => { series[n] = {}; keys.forEach((k) => (series[n][k] = [])); });
  for (const y of years) {
    const from = maxDate(filters.from, yearStart(y)), to = minDate(filters.to, yearEnd(y));
    const cs = filterContacts(idx, { ...filters, from, to });
    const { metrics } = computeMetrics(cs, { from, to }, { communicability: false });
    for (const n of nodeIds) for (const k of keys) series[n][k].push(metrics[n] ? metrics[n][k] : 0);
  }
  return { years, series };
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
