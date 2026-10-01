/* ==========================================================================
   EVENTS.relations → temporal contacts
   네트워크 edge는 오직 여기서만 만들어진다. 손으로 관리하는 EDGES 배열은 없다.
   ========================================================================== */

export function deriveContacts(events, sourcesById) {
  const contacts = [];
  for (const ev of events) {
    (ev.relations || []).forEach((rel, i) => {
      const startDate = rel.startDate || ev.eventDate;
      const endDate = rel.endDate || startDate;
      const sourceIds = rel.sourceIds && rel.sourceIds.length ? rel.sourceIds : ev.sourceIds;
      contacts.push({
        id: `${ev.id}#${i}`,
        eventId: ev.id,
        source: rel.source,
        target: rel.target,
        layer: rel.layer,
        relationType: rel.relationType,
        startDate,
        endDate,
        direction: rel.direction || "directed",
        certainty: rel.certainty || "confirmed",
        causalStatus: rel.causalStatus || "explicit",
        sourceIds,
        sourceTypes: [...new Set(sourceIds.map((s) => sourcesById[s] && sourcesById[s].sourceType).filter(Boolean))],
        theater: ev.theater || [],
        note: rel.note || ""
      });
    });
  }
  contacts.sort((a, b) => (a.startDate < b.startDate ? -1 : a.startDate > b.startDate ? 1 : 0));
  return contacts;
}

// 방향 그래프 분석용 arc: undirected 관계는 양방향 arc 두 개가 된다.
export function toArcs(contacts) {
  const arcs = [];
  for (const c of contacts) {
    arcs.push({ u: c.source, v: c.target, start: c.startDate, end: c.endDate, contact: c });
    if (c.direction === "undirected") arcs.push({ u: c.target, v: c.source, start: c.startDate, end: c.endDate, contact: c });
  }
  return arcs;
}
