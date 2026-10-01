/* ==========================================================================
   단일 series 연도별 선 그래프(small multiple). 축 하나, 2px 선, 8px 마커,
   마커 hover 툴팁(SVG <title> + 큰 투명 hit target), 표 보기 제공.
   색은 텍스트가 아닌 선·마커에만 쓴다.
   ========================================================================== */
import { esc } from "./format.js";

export function yearLineChart({ title, years, values, fmt = (v) => (Math.round(v * 100) / 100).toString() }) {
  const W = 300, H = 120, L = 34, R = 10, T = 14, B = 22;
  const max = Math.max(...values, 0);
  const yMax = max > 0 ? max : 1;
  const x = (i) => L + (years.length === 1 ? (W - L - R) / 2 : (i * (W - L - R)) / (years.length - 1));
  const y = (v) => T + (H - T - B) * (1 - v / yMax);
  const pts = values.map((v, i) => `${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(" ");
  const step = Math.ceil(years.length / 6);
  const xt = years.map((yr, i) => (i % step === 0 || i === years.length - 1 ? `<text x="${x(i)}" y="${H - 6}" class="ax">${String(yr).slice(2)}</text>` : "")).join("");
  const markers = values.map((v, i) => `
    <g class="pt"><title>${years[i]}년 · ${esc(title)}: ${fmt(v)}</title>
      <circle cx="${x(i)}" cy="${y(v)}" r="10" class="hit"/>
      <circle cx="${x(i)}" cy="${y(v)}" r="4" class="mk"/></g>`).join("");
  const table = `<table class="mini-table"><tr><th>연도</th>${years.map((yr) => `<td>${yr}</td>`).join("")}</tr>
    <tr><th>값</th>${values.map((v) => `<td>${fmt(v)}</td>`).join("")}</tr></table>`;
  return `<figure class="chart">
    <figcaption>${esc(title)} <span class="muted">최대 ${fmt(max)}</span></figcaption>
    <svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(title)} 연도별 추이">
      <line x1="${L}" x2="${W - R}" y1="${y(0)}" y2="${y(0)}" class="base"/>
      <line x1="${L}" x2="${W - R}" y1="${y(yMax)}" y2="${y(yMax)}" class="grid"/>
      <text x="${L - 4}" y="${y(yMax) + 3}" class="ax ay">${fmt(yMax)}</text>
      <text x="${L - 4}" y="${y(0) + 3}" class="ax ay">0</text>
      ${xt}
      <polyline points="${pts}" class="ln"/>
      ${markers}
    </svg>
    <details class="table-view"><summary>표로 보기</summary>${table}</details>
  </figure>`;
}
