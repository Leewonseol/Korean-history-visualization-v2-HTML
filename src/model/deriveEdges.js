/* ==========================================================================
   EVENTS.relations → temporal contacts
   네트워크 edge는 오직 여기서만 만들어진다. 손으로 관리하는 EDGES 배열은 없다.

   시각 표현(가짜 정밀도 금지):
     tMin, tMax   : 관계 시각의 하한·상한(null = 그 쪽 경계 미상). 관계에 없으면 사건 dateMin/dateMax.
     timeKind     : instant(범위 안의 미상 한 시점) / duration(범위 전체 지속)
     exact        : tMin === tMax 이고 일 단위 날짜
     anchor       : 화면 배치·정렬용 대표 시각(tMax → tMin → 사건 recordDate). 분석의 순서 판단에 쓰지 않는다.
     startDate/endDate : 화면 표시용 범위(미상 경계는 anchor로 대체). 분석은 tMin/tMax만 사용.
   근거:
     provenance, evidenceStatus(verified/legacy/interpretation/unknown), derivationRule, certainty, causalStatus
     causalStatus 기본값은 'UNKNOWN' — 여기서 인과 상태를 채워 넣지 않는다.
     evidenceClass(DIRECT / NORMALIZED / LEGACY / INTERPRETATION): 근거 필터는 model/evidence.js만 사용
   ========================================================================== */
import { evidenceStatusOf, evidenceClassOf } from "../data/vocab.js";
import { isDayPrecise } from "./dates.js";

export function deriveContacts(events, sourcesById) {
  const contacts = [];
  for (const ev of events) {
    (ev.relations || []).forEach((rel, i) => {
      const hasOwnTime = "dateMin" in rel || "dateMax" in rel;
      const tMin = hasOwnTime ? (rel.dateMin ?? null) : (ev.dateMin ?? null);
      const tMax = hasOwnTime ? (rel.dateMax ?? null) : (ev.dateMax ?? null);
      const timeKind = rel.timeKind || "instant";
      const exact = tMin !== null && tMin === tMax && isDayPrecise(tMin);
      const anchor = tMax ?? tMin ?? ev.recordDate ?? null;
      const sourceIds = rel.sourceIds && rel.sourceIds.length ? rel.sourceIds : ev.sourceIds;
      const provenance = rel.provenance || "unknown_provenance";
      contacts.push({
        id: `${ev.id}#${i}`,
        eventId: ev.id,
        source: rel.source,
        target: rel.target,
        layer: rel.layer,
        relationType: rel.relationType,
        tMin, tMax, timeKind, exact, anchor,
        timeBasis: hasOwnTime ? "relation" : "event",
        startDate: tMin ?? anchor,
        endDate: tMax ?? anchor,
        direction: rel.direction || "directed",
        directionEvidence: rel.directionEvidence || null,
        certainty: rel.certainty || "confirmed",
        causalStatus: rel.causalStatus ?? null,
        provenance,
        evidenceStatus: evidenceStatusOf(provenance),
        evidenceClass: evidenceClassOf(provenance),
        causalEvidence: rel.causalEvidence || null,
        derivationRule: rel.derivationRule || null,
        pathEligible: rel.pathEligible !== false,
        sourceIds,
        sourceTypes: [...new Set(sourceIds.map((s) => sourcesById[s] && sourcesById[s].sourceType).filter(Boolean))],
        theater: ev.theater || [],
        note: rel.note || ""
      });
    });
  }
  contacts.sort((a, b) => cmpNull(a.anchor, b.anchor) || (a.id < b.id ? -1 : 1));
  return contacts;
}
const cmpNull = (a, b) => (a === b ? 0 : a === null ? 1 : b === null ? -1 : a < b ? -1 : 1);

// 방향 그래프 분석용 arc: undirected 관계는 양방향 arc 두 개가 된다.
export function toArcs(contacts) {
  const arcs = [];
  for (const c of contacts) {
    arcs.push({ u: c.source, v: c.target, contact: c });
    if (c.direction === "undirected") arcs.push({ u: c.target, v: c.source, contact: c });
  }
  return arcs;
}
