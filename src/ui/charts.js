/* ==========================================================================
   단일 series 연도별 선 그래프(small multiple). 축 하나, 2px 선, 8px 마커,
   마커 hover 툴팁(SVG <title> + 큰 투명 hit target), 표 보기 제공.
   색은 텍스트가 아닌 선·마커에만 쓴다.
   값이 null인 연도(coverage 미수록)는 선을 끊고 '미수록' 표시 — 0으로 그리지 않는다.
   ========================================================================== */
import { esc } from "./format.js";

export function yearLineChart({ title, years, values, fmt = (v) => (Math.round(v * 100) / 100).toString() }) {
  const W = 300, H = 120, L = 34, R = 10, T = 14, B = 22;
  const max = Math.max(...values.filter((v) => v != null), 0);
  const yMax = max > 0 ? max : 1;
  const x = (i) => L + (years.length === 1 ? (W - L - R) / 2 : (i * (W - L - R)) / (years.length - 1));
  const y = (v) => T + (H - T - B) * (1 - v / yMax);
  const segs = [[]];
  values.forEach((v, i) => { if (v == null) segs.push([]); else segs[segs.length - 1].push(`${x(i).toFixed(1)},${y(v).toFixed(1)}`); });
  const lines = segs.filter((s) => s.length).map((s) => `<polyline points="${s.join(" ")}" class="ln"/>`).join("");
  const step = Math.ceil(years.length / 6);
  const xt = years.map((yr, i) => (i % step === 0 || i === years.length - 1 ? `<text x="${x(i)}" y="${H - 6}" class="ax">${String(yr).slice(2)}</text>` : "")).join("");
  const markers = values.map((v, i) => v == null
    ? `<g class="pt nc"><title>${years[i]}년: 현재 검증팩에서 미조사/미수록(값 없음)</title><text x="${x(i)}" y="${y(0) - 4}" class="ax nc-mark">·</text></g>`
    : `
    <g class="pt"><title>${years[i]}년 · ${esc(title)}: ${fmt(v)}</title>
      <circle cx="${x(i)}" cy="${y(v)}" r="10" class="hit"/>
      <circle cx="${x(i)}" cy="${y(v)}" r="4" class="mk"/></g>`).join("");
  const table = `<table class="mini-table"><tr><th>연도</th>${years.map((yr) => `<td>${yr}</td>`).join("")}</tr>
    <tr><th>값</th>${values.map((v) => `<td>${v == null ? "미수록" : fmt(v)}</td>`).join("")}</tr></table>`;
  return `<figure class="chart">
    <figcaption>${esc(title)} <span class="muted">최대 ${fmt(max)}</span></figcaption>
    <svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(title)} 연도별 추이">
      <line x1="${L}" x2="${W - R}" y1="${y(0)}" y2="${y(0)}" class="base"/>
      <line x1="${L}" x2="${W - R}" y1="${y(yMax)}" y2="${y(yMax)}" class="grid"/>
      <text x="${L - 4}" y="${y(yMax) + 3}" class="ax ay">${fmt(yMax)}</text>
      <text x="${L - 4}" y="${y(0) + 3}" class="ax ay">0</text>
      ${xt}
      ${lines}
      ${markers}
    </svg>
    <details class="table-view"><summary>표로 보기</summary>${table}</details>
  </figure>`;
}
