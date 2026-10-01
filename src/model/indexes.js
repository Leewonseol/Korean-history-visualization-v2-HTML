/* ==========================================================================
   인덱스 구축: id 조회, 시점별 level/관직, 인물별 사건·첫/마지막 등장·사료
   ========================================================================== */
import { deriveContacts } from "./deriveEdges.js";
import { yearOf } from "./dates.js";

// 사건 참여 역할(이 필드에 들어 있으면 그 사건의 '참여자'로 본다; subjects는 언급 대상일 뿐)
export const PARTICIPANT_FIELDS = ["actors", "targets", "beneficiaries", "victims", "decisionMakers", "informationSources"];

export function buildIndexes(data) {
  const { PEOPLE, PLACES, SOURCES, EVENTS, PERSON_STATES } = data;
  const byId = (arr, key) => Object.fromEntries(arr.map((x) => [x[key], x]));
  const peopleById = byId(PEOPLE, "personId");
  const placesById = byId(PLACES, "placeId");
  const sourcesById = byId(SOURCES, "id");

  const events = [...EVENTS].sort((a, b) =>
    a.eventDate < b.eventDate ? -1 : a.eventDate > b.eventDate ? 1 : a.id < b.id ? -1 : 1);
  const eventsById = byId(events, "id");
  const contacts = deriveContacts(events, sourcesById);

  const statesByPerson = {};
  for (const s of PERSON_STATES) (statesByPerson[s.personId] ||= []).push(s);
  for (const arr of Object.values(statesByPerson)) arr.sort((a, b) => (a.startDate < b.startDate ? -1 : 1));

  // 인물별: 참여 사건, 관계, 날짜 목록
  const eventsByPerson = {};
  const contactsByPerson = {};
  const datesByPerson = {};
  const sourcesByPerson = {};
  const addDate = (p, d) => (datesByPerson[p] ||= []).push(d);
  const addSrc = (p, ids) => { const s = (sourcesByPerson[p] ||= new Set()); ids.forEach((i) => s.add(i)); };

  for (const ev of events) {
    const parts = new Set();
    PARTICIPANT_FIELDS.forEach((f) => (ev[f] || []).forEach((p) => parts.add(p)));
    (ev.relations || []).forEach((r) => { parts.add(r.source); parts.add(r.target); });
    for (const p of parts) {
      (eventsByPerson[p] ||= []).push(ev.id);
      addDate(p, ev.eventDate);
      addSrc(p, ev.sourceIds);
    }
  }
  for (const c of contacts) {
    for (const p of [c.source, c.target]) {
      (contactsByPerson[p] ||= []).push(c);
      addDate(p, c.startDate);
      addSrc(p, c.sourceIds);
    }
  }
  const firstSeen = {}, lastSeen = {};
  for (const [p, ds] of Object.entries(datesByPerson)) {
    ds.sort();
    firstSeen[p] = ds[0];
    lastSeen[p] = ds[ds.length - 1];
  }

  function stateAt(personId, date) {
    const arr = statesByPerson[personId];
    if (!arr) return null;
    let found = null;
    for (const s of arr) {
      if (s.startDate <= date && (!s.endDate || s.endDate >= date)) found = s;
    }
    return found;
  }
  function levelAt(personId, date) {
    const s = date ? stateAt(personId, date) : null;
    if (s && s.level) return s.level;
    const p = peopleById[personId];
    return p ? p.defaultLevel : null;
  }

  const years = [...new Set(events.map((e) => yearOf(e.eventDate)))].sort((a, b) => a - b);

  return {
    peopleById, placesById, sourcesById, eventsById, events, contacts,
    statesByPerson, eventsByPerson, contactsByPerson, sourcesByPerson,
    firstSeen, lastSeen, stateAt, levelAt, years
  };
}
