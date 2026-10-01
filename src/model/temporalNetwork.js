/* ==========================================================================
   필터가 적용된 temporal contact 집합 만들기
   - 기간(window), layer, level(관계 시점의 양 끝 level), theater, certainty, 사료 유형
   이 함수가 화면(networkView)과 분석(analysis/*)의 공통 입력을 만든다.
   ========================================================================== */

/**
 * @param {object} idx  buildIndexes 결과
 * @param {object} f    { from, to, layers:Set, levels:Set, theaters:Set, certainties:Set, sourceTypes:Set, verifications?:Set, eventIds?:Set }
 */
export function filterContacts(idx, f) {
  return idx.contacts.filter((c) => {
    if (c.endDate < f.from || c.startDate > f.to) return false;
    if (f.eventIds && !f.eventIds.has(c.eventId)) return false;
    if (f.layers && !f.layers.has(c.layer)) return false;
    if (f.certainties && !f.certainties.has(c.certainty)) return false;
    if (f.theaters && !c.theater.some((t) => f.theaters.has(t))) return false;
    if (f.sourceTypes && !c.sourceTypes.some((t) => f.sourceTypes.has(t))) return false;
    if (f.verifications && !f.verifications.has(c.verification)) return false;
    if (f.levels) {
      const ls = idx.levelAt(c.source, c.startDate), lt = idx.levelAt(c.target, c.startDate);
      if (!f.levels.has(ls) || !f.levels.has(lt)) return false;
    }
    return true;
  });
}

// 사건 단위 필터(타임라인·사건 목록용): 관계가 하나도 없는 사건도 theater/certainty/사료유형으로 거른다.
export function eventPasses(idx, ev, f) {
  if (f.theaters && !(ev.theater || []).some((t) => f.theaters.has(t))) return false;
  if (f.certainties && !f.certainties.has(ev.certainty)) return false;
  if (f.verifications && !f.verifications.has(ev.verification)) return false;
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
