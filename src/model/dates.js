/* ==========================================================================
   날짜 유틸리티 — 실록 음력 날짜 문자열
   형식: 'YYYY-MM-DD' (평달) / 'YYYY-MML-DD' (윤달) / day '00' = 월 단위 정밀도
   문자열 사전순 비교가 곧 시간순 비교가 되도록 설계했다.
     '1433-08-10' < '1433-08L-01' < '1433-09-01'  ('-'(0x2D) < 'L'(0x4C))
   ========================================================================== */

const RE = /^(\d{4})-(\d{2})(L?)-(\d{2})$/;

export function parseDate(s) {
  const m = RE.exec(s || "");
  if (!m) return null;
  const y = +m[1], mo = +m[2], d = +m[4];
  if (mo === 0 && d === 0 && !m[3]) return { y, m: 0, leap: false, d: 0 }; // 연 단위 정밀도 'YYYY-00-00'
  if (mo < 1 || mo > 12 || d < 0 || d > 30) return null;
  return { y, m: mo, leap: m[3] === "L", d };
}

export function isValidDate(s) { return parseDate(s) !== null; }

// 범위 경계 문자열: 실제 날짜 + 월 단위('YYYY-MM-00'/'YYYY-MM-99') + 연 단위('YYYY-00-00'/'YYYY-99-99')
const BOUND = /^(\d{4})-(\d{2})(L?)-(\d{2})$/;
export function isValidBound(s) {
  const m = BOUND.exec(s || "");
  if (!m) return false;
  const mo = +m[2], d = +m[4];
  if (mo === 0) return d === 0 && !m[3];
  if (mo === 99) return d === 99 && !m[3];
  if (mo < 1 || mo > 12) return false;
  return (d >= 0 && d <= 30) || d === 99;
}
// 일 단위로 확정된 실제 날짜인가(경계 표기가 아닌)
export function isDayPrecise(s) { const p = parseDate(s); return !!p && p.m > 0 && p.d > 0; }
export const MIN_BOUND = "0000-00-00";
export const MAX_BOUND = "9999-99-99";

export function cmp(a, b) { return a < b ? -1 : a > b ? 1 : 0; }
export function maxDate(a, b) { return a > b ? a : b; }
export function minDate(a, b) { return a < b ? a : b; }
export function yearOf(s) { return +String(s).slice(0, 4); }

// 근사 월 인덱스(음력 1개월 = 1). 윤달은 해당 평달 뒤 0.5개월 위치로 근사한다.
// 기간 길이·지연시간 계산에만 쓰며 정확한 일수 계산이 아니다.
export function monthIndex(s) {
  // 경계 문자열('YYYY-00-00', 'YYYY-99-99')도 받도록 관대하게 해석한다.
  const m = /^(\d{4})-(\d{2})(L?)-(\d{2})$/.exec(s || "");
  if (!m) return NaN;
  const mo = Math.min(Math.max(+m[2], 1), 12), d = Math.min(Math.max(+m[4], 0), 30);
  return +m[1] * 12 + (mo - 1) + (m[3] ? 0.5 : 0) + Math.max(d - 1, 0) / 30;
}
export function monthsBetween(a, b) { return monthIndex(b) - monthIndex(a); }

// 연 단위 경계(분석 기간 필터용)
export function yearStart(y) { return `${y}-00-00`; }   // 어떤 날짜보다도 앞
export function yearEnd(y) { return `${y}-99-99`; }     // 어떤 날짜보다도 뒤

// 커서 날짜로부터 n개월 이전의 대략적 경계 문자열
export function shiftMonths(s, n) {
  const p = parseDate(s);
  if (!p) return s;
  let total = p.y * 12 + (p.m - 1) + n;
  const y = Math.floor(total / 12), m = (total % 12) + 1;
  return `${y}-${String(m).padStart(2, "0")}-${String(p.d).padStart(2, "0")}`;
}

export function formatDate(s) {
  if (s && /-99-99$/.test(s)) return `${s.slice(0, 4)}년 말(경계)`;
  if (s && /-99$/.test(s)) return formatDate(s.slice(0, -2) + "00").replace("(일 미상)", " 말(경계)");
  const p = parseDate(s);
  if (!p) return s || "—";
  if (p.m === 0) return `${p.y}년(월일 미상)`;
  const mm = `${p.leap ? "윤" : ""}${p.m}월`;
  return p.d === 0 ? `${p.y}년 ${mm}(일 미상)` : `${p.y}년 ${mm} ${p.d}일`;
}

// 범위 표기: dateMin~dateMax (null = 그쪽 경계 미상)
export function formatRange(min, max, precision) {
  if (precision === "YEAR" && min) return `${min.slice(0, 4)}년(연중 시점 미상)`;
  if (precision === "MONTH" && min) return formatDate(min);
  if (min && max && min === max) return formatDate(min);
  if (!min && max) return `${formatDate(max)} 이전(정확한 시점 미상)`;
  if (min && !max) return `${formatDate(min)} 이후(정확한 시점 미상)`;
  if (!min && !max) return "시점 미상";
  return `${formatDate(min)} ~ ${formatDate(max)}`;
}
