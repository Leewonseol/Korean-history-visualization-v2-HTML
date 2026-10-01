/* ==========================================================================
   근거 선택기(evidence selector) — 단일 소스
   화면 렌더링 · 경로 탐색 · 지표 · 연도별 집계 · research-gen · audit 출력 · 스토리 근거 조회가
   모두 이 모듈로만 근거 등급을 거른다(다른 곳에 근거 필터 로직을 두지 않는다).

   기본 범위 = DIRECT + NORMALIZED (pack v1 검증). LEGACY·INTERPRETATION은 명시적 opt-in.
   INTERPRETATION은 기본 분석 코드 경로에서 assertScope()로 차단된다.
   ========================================================================== */
import { evidenceClassOf, EVIDENCE_CLASS } from "../data/vocab.js";

export const DEFAULT_EVIDENCE = Object.freeze({ includeLegacy: false, includeInterpretation: false });

/** 필터 상태(UI state.f 등)에서 근거 범위 객체를 만든다. */
export function evidenceScope(f = {}) {
  const includeLegacy = !!f.includeLegacy, includeInterpretation = !!f.includeInterpretation;
  const classes = new Set(["DIRECT", "NORMALIZED"]);
  if (includeLegacy) classes.add("LEGACY");
  if (includeInterpretation) classes.add("INTERPRETATION");
  return Object.freeze({
    includeLegacy, includeInterpretation, classes,
    key: [...classes].join("+"),
    label: [...classes].map((c) => EVIDENCE_CLASS[c].short).join(" + ")
  });
}
export const DEFAULT_SCOPE = evidenceScope(DEFAULT_EVIDENCE);
const asScope = (s) => (s && s.classes ? s : evidenceScope(s || DEFAULT_EVIDENCE));

/** 어떤 레코드든 근거 등급: contact/claim은 evidenceClass, 나머지는 provenance에서 계산 */
export function classOf(item) {
  if (!item) return "UNKNOWN";
  if (item.evidenceClass) return item.evidenceClass;
  return evidenceClassOf(item.provenance);
}
export const allows = (scope, item) => asScope(scope).classes.has(classOf(item));

/** 공통 선택 함수 */
export function select(items, scope) { const s = asScope(scope); return (items || []).filter((x) => s.classes.has(classOf(x))); }

/** 범위 밖 근거가 섞여 들어오면 즉시 실패(기본 분석 경로에서 해석·legacy가 몰래 섞이는 것을 막는다). */
export function assertScope(items, scope, where = "analysis") {
  const s = asScope(scope);
  for (const x of items || []) {
    const c = classOf(x);
    if (c === "UNKNOWN") throw new Error(`[evidence] ${where}: 근거 등급 불명 레코드 ${x.id || ""}`);
    if (c === "INTERPRETATION" && !s.includeInterpretation) throw new Error(`[evidence] ${where}: interpretation mode가 꺼져 있는데 해석 레코드 ${x.id || ""}가 들어옴`);
    if (c === "LEGACY" && !s.includeLegacy) throw new Error(`[evidence] ${where}: legacy가 꺼져 있는데 legacy 레코드 ${x.id || ""}가 들어옴`);
  }
  return true;
}

/** 등급별 개수(UI·문서 headline용 — 하드코딩하지 않는다) */
export function countByClass(items) {
  const out = { DIRECT: 0, NORMALIZED: 0, LEGACY: 0, INTERPRETATION: 0, UNKNOWN: 0 };
  for (const x of items || []) out[classOf(x)]++;
  return out;
}
