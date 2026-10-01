/* ==========================================================================
   단일 series 연도별 선 그래프(small multiple). 축 하나, 2px 선, 8px 마커,
   마커 hover 툴팁(SVG <title> + 큰 투명 hit target), 표 보기 제공.
   색은 텍스트가 아닌 선·마커에만 쓴다.
   값이 null인 연도(coverage 미수록)는 선을 끊고 '미수록' 표시 — 0으로 그리지 않는다.
   scope(연도별 FULL/PARTIAL/NONE/UNKNOWN)를 주면 x축 아래 coverage 띠를 그린다. PARTIAL 연도의 점은 속이 빈
   마커로 그려 FULL 연도와 같은 기준의 값처럼 읽히지 않게 한다.
   ========================================================================== */
import { esc } from "./format.js";

const SCOPE_LABEL = { FULL: "전체", PARTIAL: "부분", NONE: "NA", UNKNOWN: "?" };
export function yearLineChart({ title, years, values, scope = null, fmt = (v) => (Math.round(v * 100) / 100).toString() }) {
  const W = 300, H = scope ? 132 : 120, L = 34, R = 10, T = 14, B = scope ? 34 : 22;
  const max = Math.max(...values.filter((v) => v != null), 0);
  const yMax = max > 0 ? max : 1;
  const x = (i) => L + (years.length === 1 ? (W - L - R) / 2 : (i * (W - L - R)) / (years.length - 1));
  const y = (v) => T + (H - T - B) * (1 - v / yMax);
  const segs = [[]];
  values.forEach((v, i) => { if (v == null) segs.push([]); else segs[segs.length - 1].push(`${x(i).toFixed(1)},${y(v).toFixed(1)}`); });
  const lines = segs.filter((s) => s.length).map((s) => `<polyline points="${s.join(" ")}" class="ln"/>`).join("");
  const step = Math.ceil(years.length / 6);
  const xt = years.map((yr, i) => (i % step === 0 || i === years.length - 1 ? `<text x="${x(i)}" y="${H - (scope ? 18 : 6)}" class="ax">${String(yr).slice(2)}</text>` : "")).join("");
  const band = scope ? years.map((yr, i) => {
    const w = years.length > 1 ? (W - L - R) / (years.length - 1) : 20;
    return `<rect x="${x(i) - w / 2}" y="${H - 10}" width="${w}" height="8" class="cov cov-${scope[i]}"><title>${yr}: 조사 범위 ${scope[i]}${scope[i] === "PARTIAL" ? " — 일부 기간만 조사, FULL 연도와 단순 비교 금지" : scope[i] === "NONE" ? " — 미조사/미수록(NA)" : ""}</title></rect>`;
  }).join("") : "";
  const markers = values.map((v, i) => v == null
    ? `<g class="pt nc"><title>${years[i]}년: 현재 검증팩에서 미조사/미수록(값 없음)</title><text x="${x(i)}" y="${y(0) - 4}" class="ax nc-mark">·</text></g>`
    : `
    <g class="pt${scope && scope[i] === "PARTIAL" ? " partial" : ""}"><title>${years[i]}년 · ${esc(title)}: ${fmt(v)}${scope && scope[i] === "PARTIAL" ? " (부분 조사 연도)" : ""}</title>
      <circle cx="${x(i)}" cy="${y(v)}" r="10" class="hit"/>
      <circle cx="${x(i)}" cy="${y(v)}" r="4" class="mk"/></g>`).join("");
  const table = `<table class="mini-table"><tr><th>연도</th>${years.map((yr) => `<td>${yr}</td>`).join("")}</tr>
    <tr><th>값</th>${values.map((v) => `<td>${v == null ? "미수록" : fmt(v)}</td>`).join("")}</tr>
    ${scope ? `<tr><th>조사 범위</th>${scope.map((x) => `<td>${SCOPE_LABEL[x] || x}</td>`).join("")}</tr>` : ""}</table>`;
  return `<figure class="chart">
    <figcaption>${esc(title)} <span class="muted">최대 ${fmt(max)}</span></figcaption>
    <svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(title)} 연도별 추이">
      <line x1="${L}" x2="${W - R}" y1="${y(0)}" y2="${y(0)}" class="base"/>
      <line x1="${L}" x2="${W - R}" y1="${y(yMax)}" y2="${y(yMax)}" class="grid"/>
      <text x="${L - 4}" y="${y(yMax) + 3}" class="ax ay">${fmt(yMax)}</text>
      <text x="${L - 4}" y="${y(0) + 3}" class="ax ay">0</text>
      ${xt}
      ${lines}
      ${band}
      ${markers}
    </svg>
    <details class="table-view"><summary>표로 보기</summary>${table}</details>
  </figure>`;
}
