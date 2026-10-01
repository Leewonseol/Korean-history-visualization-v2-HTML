/* ==========================================================================
   필터가 적용된 temporal contact 집합 만들기
   - 근거(evidence): model/evidence.js의 단일 선택기만 사용. 기본 = DIRECT + NORMALIZED.
   - 기간(window), layer, level(관계 시점의 양 끝 level), theater, certainty, 사료 유형
   이 함수가 화면(networkView)과 분석(analysis/*)의 공통 입력을 만든다.

   기간 판정 방식(mode):
     display                 화면 표시용. 표시 범위(미상 경계는 기사일 등 anchor로 대체)가 기간과 겹치면 표시.
     CERTAIN_ORDER           분석 기본값. 관계 시각이 '확실히' 기간 안에 있을 때만(tMin·tMax 모두 알려져야 함).
     TEMPORALLY_NOT_EXCLUDED 시간 정보상 기간 안에 있을 수 있으면 포함(미상 경계는 열린 것으로 간주).
                             시간 정보와 모순되지 않을 뿐, 실제로 그 기간·순서였음을 입증하지 않는다.
   ========================================================================== */
import { MIN_BOUND, MAX_BOUND } from "./dates.js";
import { evidenceScope, allows } from "./evidence.js";

export const ORDER_MODES = {
  CERTAIN_ORDER: "확실한 순서 — 날짜만으로 순서가 확정되는 관계·단계만",
  TEMPORALLY_NOT_EXCLUDED: "시간상 배제되지 않음 — 시간 정보와 모순되지 않지만 실제 순서를 입증하지는 않음"
};

export function inWindow(c, from, to, mode = "display") {
  if (mode === "CERTAIN_ORDER") {
    if (c.tMin === null || c.tMax === null) return false;
    return c.timeKind === "duration" ? (c.tMin <= to && c.tMax >= from) : (c.tMin >= from && c.tMax <= to);
  }
  if (mode === "TEMPORALLY_NOT_EXCLUDED") {
    const lo = c.tMin ?? MIN_BOUND, hi = c.tMax ?? MAX_BOUND;
    return lo <= to && hi >= from;
  }
  if (mode !== "display") throw new Error(`unknown window mode ${mode}`);
  if (c.startDate === null) return false;
  return c.startDate <= to && c.endDate >= from;
}

/**
 * @param {object} idx  buildIndexes 결과
 * @param {object} f    { from, to, mode?, includeLegacy?, includeInterpretation?, pathOnly?,
 *                        layers:Set, levels:Set, theaters:Set, certainties:Set, sourceTypes:Set, eventIds?:Set }
 */
export function filterContacts(idx, f) {
  const mode = f.mode || "display";
  const scope = evidenceScope(f);
  return idx.contacts.filter((c) => {
    if (!allows(scope, c)) return false;
    if (!inWindow(c, f.from, f.to, mode)) return false;
    if (f.pathOnly && !c.pathEligible) return false;
    if (f.eventIds && !f.eventIds.has(c.eventId)) return false;
    if (f.layers && !f.layers.has(c.layer)) return false;
    if (f.certainties && !f.certainties.has(c.certainty)) return false;
    if (f.theaters && !c.theater.some((t) => f.theaters.has(t))) return false;
    if (f.sourceTypes && !c.sourceTypes.some((t) => f.sourceTypes.has(t))) return false;
    if (f.levels) {
      const ls = idx.levelAt(c.source, c.anchor), lt = idx.levelAt(c.target, c.anchor);
      if (!f.levels.has(ls) || !f.levels.has(lt)) return false;
    }
    return true;
  });
}

/**
 * 분석 입력: 같은 필터에서 CERTAIN_ORDER(또는 TEMPORALLY_NOT_EXCLUDED) 기간 판정 + 경로 대상 관계만.
 * 화면에는 보이지만 분석에서 빠진 관계를 목록으로 돌려 missingness 편향을 검사할 수 있게 한다.
 */
export function analysisContacts(idx, f, mode = "CERTAIN_ORDER") {
  const shown = filterContacts(idx, { ...f, mode: "display" });
  const used = filterContacts(idx, { ...f, mode, pathOnly: true });
  const usedIds = new Set(used.map((c) => c.id));
  const excluded = shown.filter((c) => !usedIds.has(c.id));
  const excludedAboutList = excluded.filter((c) => !c.pathEligible);
  const excludedUncertainList = excluded.filter((c) => c.pathEligible);
  return {
    contacts: used, mode, scope: evidenceScope(f), shown,
    excludedAbout: excludedAboutList.length, excludedUncertain: excludedUncertainList.length,
    excludedAboutList, excludedUncertainList
  };
}

// 사건 단위 필터(타임라인·사건 목록용): 관계가 하나도 없는 사건도 근거/theater/certainty/사료유형으로 거른다.
export function eventPasses(idx, ev, f) {
  if (!allows(evidenceScope(f), ev)) return false;
  if (f.theaters && !(ev.theater || []).some((t) => f.theaters.has(t))) return false;
  if (f.certainties && !f.certainties.has(ev.certainty)) return false;
  if (f.sourceTypes) {
    const types = ev.sourceIds.map((s) => idx.sourcesById[s] && idx.sourcesById[s].sourceType);
    if (!types.some((t) => f.sourceTypes.has(t))) return false;
  }
  return true;
}

export function nodesOf(contacts) {
  const s = new Set();
  for (const c of contacts) { s.add(c.source); s.add(c.target); }
  return s;
}
