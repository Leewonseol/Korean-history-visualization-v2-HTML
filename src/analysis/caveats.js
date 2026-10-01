/* ==========================================================================
   결과 해석 경고(caveats) — 중심성·경로 숫자를 단독으로 보여 주지 않기 위한 공통 요약
   - 동일성 미해결 노드 수(분석 노드 중)
   - 시각 불확실로 제외된 관계 수
   - 규칙 파생(NORMALIZED) 관계 비중(DIRECT+NORMALIZED 입력 중)
   - 조사 범위가 불완전한 연도(PARTIAL·NONE) — FULL도 '전수 조사 완료'가 아님
   ========================================================================== */
import { countByClass } from "../model/evidence.js";
import { unresolvedNodeCount } from "./identitySensitivity.js";
import { yearOf } from "../model/dates.js";

export function resultCaveats(idx, analysis, win) {
  const nodes = [...new Set(analysis.contacts.flatMap((c) => [c.source, c.target]))];
  const id = unresolvedNodeCount(idx, nodes);
  const cls = countByClass(analysis.contacts);
  const verified = cls.DIRECT + cls.NORMALIZED;
  const y0 = Math.max(yearOf(win.from) || idx.years[0], idx.years[0]), y1 = Math.min(yearOf(win.to), idx.years[idx.years.length - 1]);
  const incomplete = idx.years.filter((y) => y >= y0 && y <= y1)
    .map((y) => idx.coverageByYear[y]).filter((c) => c.scopeStatus !== "FULL").map((c) => ({ year: c.year, scopeStatus: c.scopeStatus, scope: c.scope }));
  return {
    unresolvedIdentity: id.unresolved, persons: id.persons,
    temporallyExcluded: analysis.excludedUncertain, aboutExcluded: analysis.excludedAbout, included: analysis.contacts.length,
    normalized: cls.NORMALIZED, direct: cls.DIRECT, normalizedShare: verified ? cls.NORMALIZED / verified : 0,
    legacyIncluded: cls.LEGACY, interpretationIncluded: cls.INTERPRETATION,
    incompleteYears: incomplete
  };
}
