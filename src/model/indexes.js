/* ==========================================================================
   인덱스 구축: id 조회, 시점별 level/관직 증언, 인물별 사건·첫/마지막 등장·사료, 동일성 상태
   ========================================================================== */
import { deriveContacts } from "./deriveEdges.js";
import { evidenceStatusOf } from "../data/vocab.js";

// 사건 참여 역할(이 필드에 들어 있으면 그 사건의 '참여자'로 본다; subjects는 언급 대상일 뿐)
export const PARTICIPANT_FIELDS = ["actors", "targets", "beneficiaries", "victims", "decisionMakers", "informationSources"];

// 사건 정렬·배치용 날짜: 하한 → 상한 → 기사일. 순서 판단(경로)에는 쓰지 않는다.
export const sortDateOf = (ev) => ev.dateMin ?? ev.dateMax ?? ev.recordDate ?? null;

export function buildIndexes(data) {
  const { PEOPLE, PLACES, SOURCES, EVENTS, PERSON_ATTESTATIONS = [], COVERAGE = [] } = data;
  const byId = (arr, key) => Object.fromEntries(arr.map((x) => [x[key], x]));
  const peopleById = byId(PEOPLE, "personId");
  const placesById = byId(PLACES, "placeId");
  const sourcesById = byId(SOURCES, "id");
  const coverageByYear = Object.fromEntries(COVERAGE.map((c) => [c.year, c]));

  const events = [...EVENTS].sort((a, b) => {
    const da = sortDateOf(a) || "", db = sortDateOf(b) || "";
    return da < db ? -1 : da > db ? 1 : a.id < b.id ? -1 : 1;
  });
  const eventsById = byId(events, "id");
  const contacts = deriveContacts(events, sourcesById);
  const evidenceOfEvent = (ev) => evidenceStatusOf(ev.provenance);

  // 관직·역할 증언: 날짜순. pack(verified) 증언만 level 계산에 쓴다.
  const attestationsByPerson = {};
  for (const a of PERSON_ATTESTATIONS) (attestationsByPerson[a.personId] ||= []).push(a);
  for (const arr of Object.values(attestationsByPerson)) arr.sort((a, b) => (a.attestedDate < b.attestedDate ? -1 : 1));

  // 인물별: 참여 사건, 관계, 날짜 목록 (verified 근거와 그 밖을 구분)
  const eventsByPerson = {};
  const mentionsByPerson = {};   // subjects(언급 대상, 참여 아님)
  const contactsByPerson = {};
  const sourcesByPerson = {};
  const datesV = {}, datesAll = {}, verifiedEvents = {};
  const addDate = (p, d, verified) => {
    if (!d) return;
    (datesAll[p] ||= []).push(d);
    if (verified) (datesV[p] ||= []).push(d);
  };
  const addSrc = (p, ids) => { const s = (sourcesByPerson[p] ||= new Set()); ids.forEach((i) => s.add(i)); };

  for (const ev of events) {
    (ev.subjects || []).forEach((p) => (mentionsByPerson[p] ||= []).push(ev.id));
    const verifiedEv = evidenceOfEvent(ev) === "verified";
    const fieldParts = new Set();
    PARTICIPANT_FIELDS.forEach((f) => (ev[f] || []).forEach((p) => fieldParts.add(p)));
    const relParts = new Map();   // personId → 이 사건의 관계 중 verified 관계에 등장하는가
    for (const r of ev.relations || []) for (const p of [r.source, r.target]) {
      relParts.set(p, relParts.get(p) || evidenceStatusOf(r.provenance) === "verified");
    }
    for (const p of new Set([...fieldParts, ...relParts.keys()])) {
      // pack 사건의 WHO 필드 또는 verified 관계로 등장해야 verified 등장
      const verified = verifiedEv && (fieldParts.has(p) || relParts.get(p));
      (eventsByPerson[p] ||= []).push(ev.id);
      if (verified) (verifiedEvents[p] ||= new Set()).add(ev.id);
      addDate(p, sortDateOf(ev), verified);
      addSrc(p, ev.sourceIds);
    }
  }
  for (const c of contacts) {
    for (const p of [c.source, c.target]) {
      (contactsByPerson[p] ||= []).push(c);
      addSrc(p, c.sourceIds);
    }
  }
  const span = (ds) => { if (!ds || !ds.length) return [null, null]; const s = [...ds].sort(); return [s[0], s[s.length - 1]]; };
  const firstSeen = {}, lastSeen = {}, firstSeenAll = {}, lastSeenAll = {};
  for (const p of Object.keys(datesAll)) {
    [firstSeen[p], lastSeen[p]] = span(datesV[p]);
    [firstSeenAll[p], lastSeenAll[p]] = span(datesAll[p]);
  }

  // 동일성 상태: 선언값 우선, 없으면 verified 등장 사건 수로 계산(자동 병합은 하지 않음)
  const identityOf = {};
  for (const p of PEOPLE) {
    const n = verifiedEvents[p.personId] ? verifiedEvents[p.personId].size : 0;
    if (p.identityStatus) identityOf[p.personId] = { status: p.identityStatus, basis: "declared" };
    else identityOf[p.personId] = { status: n > 1 ? "probable_same_person" : "single_attestation", basis: `computed:${n}_verified_events` };
  }

  function attestationAt(personId, date) {
    const arr = attestationsByPerson[personId];
    if (!arr || !date) return null;
    let found = null;
    for (const a of arr) if (evidenceStatusOf(a.provenance) === "verified" && a.attestedDate <= date) found = a;
    return found;
  }
  function levelAt(personId, date) {
    const a = attestationAt(personId, date);
    if (a && a.level) return a.level;
    const p = peopleById[personId];
    return p ? p.defaultLevel : null;
  }

  // 연도 축은 coverage 레지스트리에서 온다(사건 유무로 추론하지 않음)
  const years = COVERAGE.map((c) => c.year).sort((a, b) => a - b);

  return {
    peopleById, placesById, sourcesById, eventsById, events, contacts, coverageByYear,
    attestationsByPerson, eventsByPerson, mentionsByPerson, contactsByPerson, sourcesByPerson, verifiedEvents,
    firstSeen, lastSeen, firstSeenAll, lastSeenAll, identityOf,
    attestationAt, levelAt, years, evidenceOfEvent, sortDateOf, evidenceOf: evidenceStatusOf
  };
}
