/* ==========================================================================
   validateData(data) — 재사용 가능한 데이터 무결성 검사
   브라우저(app.js 시작 시)와 Node CLI(tools/validate.mjs) 양쪽에서 사용한다.
   반환: { errors: string[], warnings: string[], stats: object }
   ========================================================================== */
import {
  LEVELS, LAYERS, CERTAINTY, CAUSAL_STATUS, THEATERS, AFFILIATIONS, ENTITY_TYPES,
  MECHANISMS, OUTCOME_TYPES, SOURCE_TYPES, SOURCE_LEVELS, DOCUMENT_TYPES, VERIFICATION
} from "../data/vocab.js";
import { isValidDate } from "./dates.js";

const WHAT_TYPES = new Set(["gain", "loss", "burden", "transfer", "recover", "claim"]);
const PARTICIPANTS = ["actors", "targets", "beneficiaries", "victims", "decisionMakers", "informationSources", "subjects"];
const NON_PRIMARY_OK = new Set(["secondary_only", "interpretation", "unverified_seed"]);

export function validateData(data) {
  const { PEOPLE, PLACES, SOURCES, EVENTS, PERSON_STATES, DISCREPANCIES = [] } = data;
  const errors = [], warnings = [];
  const E = (m) => errors.push(m), W = (m) => warnings.push(m);

  /* ---------- 1. ID 유일성 ---------- */
  const uniq = (arr, key, label) => {
    const seen = new Set();
    for (const x of arr) {
      if (!x[key]) E(`${label}: ${key} 없음 (${JSON.stringify(x).slice(0, 60)})`);
      else if (seen.has(x[key])) E(`${label}: 중복 ID ${x[key]}`);
      seen.add(x[key]);
    }
    return seen;
  };
  const personIds = uniq(PEOPLE, "personId", "PEOPLE");
  const placeIds = uniq(PLACES, "placeId", "PLACES");
  const sourceIds = uniq(SOURCES, "id", "SOURCES");
  const eventIds = uniq(EVENTS, "id", "EVENTS");
  uniq(PERSON_STATES, "id", "PERSON_STATES");
  const discIds = uniq(DISCREPANCIES, "id", "DISCREPANCIES");
  const sourcesById = Object.fromEntries(SOURCES.map((s) => [s.id, s]));
  const eventsById = Object.fromEntries(EVENTS.map((e) => [e.id, e]));

  /* ---------- 2. 인물 authority: 필드·중복 인물 ---------- */
  const byName = {}, byHanja = {};
  for (const p of PEOPLE) {
    if (!ENTITY_TYPES[p.entityType]) E(`PEOPLE ${p.personId}: entityType '${p.entityType}' 미정의`);
    if (!AFFILIATIONS[p.affiliation]) E(`PEOPLE ${p.personId}: affiliation '${p.affiliation}' 미정의`);
    if (!LEVELS[p.defaultLevel]) E(`PEOPLE ${p.personId}: defaultLevel '${p.defaultLevel}' 미정의`);
    if (!p.canonicalName) E(`PEOPLE ${p.personId}: canonicalName 없음`);
    if (p.entityType !== "person") continue;
    (byName[p.canonicalName] ||= []).push(p);
    if (p.hanja) (byHanja[p.hanja] ||= []).push(p);
  }
  const declaredDistinct = (a, b) => (a.distinctFrom || []).includes(b.personId) || (b.distinctFrom || []).includes(a.personId);
  for (const [name, arr] of Object.entries(byName)) {
    for (let i = 0; i < arr.length; i++) for (let j = i + 1; j < arr.length; j++) {
      if (!declaredDistinct(arr[i], arr[j])) E(`동일 인물 중복 의심: '${name}' → ${arr[i].personId}, ${arr[j].personId} (동명이인이면 distinctFrom 선언 필요)`);
    }
  }
  for (const [h, arr] of Object.entries(byHanja)) {
    if (arr.length > 1 && !declaredDistinct(arr[0], arr[1])) W(`같은 한자 이름 '${h}' 을 가진 ID 여러 개: ${arr.map((p) => p.personId).join(", ")}`);
  }
  for (const p of PEOPLE) for (const a of p.aliases || []) {
    if (byName[a] && !byName[a].some((q) => q.personId === p.personId)) W(`${p.personId}의 이명 '${a}'가 다른 인물의 대표명과 같음`);
  }

  /* ---------- 3. 장소 ---------- */
  for (const pl of PLACES) {
    if (!THEATERS[pl.theater]) E(`PLACES ${pl.placeId}: theater '${pl.theater}' 미정의`);
    if (pl.parentPlaceId && !placeIds.has(pl.parentPlaceId)) E(`PLACES ${pl.placeId}: parentPlaceId ${pl.parentPlaceId} 없음`);
    if (pl.coordinate && pl.coordinateCertainty === "none") E(`PLACES ${pl.placeId}: 좌표가 있으나 coordinateCertainty='none'`);
    if (pl.coordinate && !(pl.sourceIds || []).length) E(`PLACES ${pl.placeId}: 근거 sourceIds 없이 좌표가 입력됨`);
    (pl.sourceIds || []).forEach((s) => sourceIds.has(s) || E(`PLACES ${pl.placeId}: sourceId ${s} 없음`));
  }

  /* ---------- 4. 사료 ---------- */
  for (const s of SOURCES) {
    if (!SOURCE_TYPES[s.sourceType]) E(`SOURCES ${s.id}: sourceType '${s.sourceType}' 미정의`);
    if (!SOURCE_LEVELS[s.sourceLevel]) E(`SOURCES ${s.id}: sourceLevel '${s.sourceLevel}' 미정의`);
    if (!/^https?:\/\//.test(s.url || "")) E(`SOURCES ${s.id}: url 없음/형식 오류`);
    if (s.date && !isValidDate(s.date)) E(`SOURCES ${s.id}: date '${s.date}' 형식 오류`);
    if (s.verification && !VERIFICATION[s.verification]) E(`SOURCES ${s.id}: verification '${s.verification}' 미정의`);
    if (s.sourceType === "secondary_reference" && s.sourceLevel !== "secondary") E(`SOURCES ${s.id}: secondary_reference인데 sourceLevel이 ${s.sourceLevel}`);
    if (s.documentType && !DOCUMENT_TYPES[s.documentType]) E(`SOURCES ${s.id}: documentType '${s.documentType}' 미정의`);
  }
  const isPrimaryish = (id) => sourcesById[id] && sourcesById[id].sourceLevel !== "secondary";
  const isSeed = (id) => sourcesById[id] && sourcesById[id].verification === "seed_unverified";

  /* ---------- 5. 인물 상태 ---------- */
  const statesByP = {};
  for (const st of PERSON_STATES) {
    if (!personIds.has(st.personId)) E(`PERSON_STATES ${st.id}: personId ${st.personId} 없음`);
    if (!LEVELS[st.level]) E(`PERSON_STATES ${st.id}: level '${st.level}' 미정의`);
    if (!isValidDate(st.startDate)) E(`PERSON_STATES ${st.id}: startDate 형식 오류`);
    if (st.endDate && !isValidDate(st.endDate)) E(`PERSON_STATES ${st.id}: endDate 형식 오류`);
    if (st.endDate && st.endDate < st.startDate) E(`PERSON_STATES ${st.id}: 날짜 역전 ${st.startDate} > ${st.endDate}`);
    if (!CERTAINTY[st.certainty]) E(`PERSON_STATES ${st.id}: certainty '${st.certainty}' 미정의`);
    if (!(st.sourceIds || []).length) E(`PERSON_STATES ${st.id}: sourceIds 없음`);
    (st.sourceIds || []).forEach((s) => sourceIds.has(s) || E(`PERSON_STATES ${st.id}: sourceId ${s} 없음`));
    if (st.certainty === "confirmed" && (st.sourceIds || []).every(isSeed)) E(`PERSON_STATES ${st.id}: 미검증 시드 사료만으로 confirmed`);
    (statesByP[st.personId] ||= []).push(st);
  }
  for (const [p, arr] of Object.entries(statesByP)) {
    arr.sort((a, b) => (a.startDate < b.startDate ? -1 : 1));
    for (let i = 1; i < arr.length; i++) {
      const prev = arr[i - 1];
      if (!prev.endDate || prev.endDate >= arr[i].startDate) W(`PERSON_STATES ${p}: ${prev.id}와 ${arr[i].id} 기간 겹침(뒤 상태 우선 적용)`);
    }
  }

  /* ---------- 6. 사건 ---------- */
  const refPerson = (ev, id, where) => { if (id != null && !personIds.has(id)) E(`EVENT ${ev.id}: ${where}의 personId '${id}'가 PEOPLE에 없음`); };
  let relCount = 0;
  for (const ev of EVENTS) {
    const tag = `EVENT ${ev.id}`;
    // 날짜
    if (!isValidDate(ev.eventDate)) E(`${tag}: eventDate '${ev.eventDate}' 형식 오류`);
    if (!isValidDate(ev.recordDate)) E(`${tag}: recordDate '${ev.recordDate}' 형식 오류`);
    if (ev.recordDate < ev.eventDate) E(`${tag}: 기록일(${ev.recordDate})이 사건일(${ev.eventDate})보다 앞섬`);
    if (ev.datePrecision === "record_date_only" && ev.eventDate !== ev.recordDate) E(`${tag}: datePrecision=record_date_only인데 eventDate≠recordDate`);
    if (ev.datePrecision === "day" && ev.eventDate.endsWith("-00")) E(`${tag}: datePrecision=day인데 일(day)이 00`);
    if (ev.datePrecision === "month" && !ev.eventDate.endsWith("-00")) E(`${tag}: datePrecision=month면 day를 00으로`);
    const datedSillok = ev.sourceIds.map((s) => sourcesById[s]).filter((s) => s && s.sourceType === "sillok" && s.date);
    if (datedSillok.length && !datedSillok.some((s) => s.date === ev.recordDate)) {
      E(`${tag}: recordDate(${ev.recordDate})가 어느 실록 사료 게재일(${datedSillok.map((s) => s.date).join(",")})과도 일치하지 않음 — eventDate/recordDate 혼동 의심`);
    }
    // Lasswell 필수 필드
    if (!(ev.actors || []).length) E(`${tag}: WHO(actors) 비어 있음`);
    if (!(ev.what || []).length) E(`${tag}: WHAT(what) 비어 있음`);
    if (!(ev.mechanisms || []).length) E(`${tag}: HOW(mechanisms) 비어 있음`);
    if (!(ev.theater || []).length) E(`${tag}: WHERE(theater) 비어 있음`);
    if (!(ev.placeIds || []).length && !ev.locationNote) E(`${tag}: WHERE(placeIds) 비어 있고 locationNote도 없음`);
    if (!(ev.outcomes || []).length) E(`${tag}: OUTCOME(outcomes) 비어 있음`);
    if (!ev.title) E(`${tag}: title 없음`);
    // 어휘
    (ev.theater || []).forEach((t) => THEATERS[t] || E(`${tag}: theater '${t}' 미정의`));
    (ev.mechanisms || []).forEach((m) => MECHANISMS[m] || E(`${tag}: mechanism '${m}' 미정의`));
    (ev.outcomes || []).forEach((o) => {
      OUTCOME_TYPES[o.type] || E(`${tag}: outcome type '${o.type}' 미정의`);
      refPerson(ev, o.subjectId, "outcomes.subjectId");
      if (o.certainty && !CERTAINTY[o.certainty]) E(`${tag}: outcome certainty '${o.certainty}' 미정의`);
    });
    (ev.what || []).forEach((w) => {
      WHAT_TYPES.has(w.type) || E(`${tag}: what.type '${w.type}' 미정의`);
      refPerson(ev, w.giverId, "what.giverId");
      refPerson(ev, w.receiverId, "what.receiverId");
      if (!w.value) E(`${tag}: what.value 없음`);
    });
    if (!CERTAINTY[ev.certainty]) E(`${tag}: certainty '${ev.certainty}' 미정의`);
    if (ev.verification && !VERIFICATION[ev.verification]) E(`${tag}: verification '${ev.verification}' 미정의`);
    if (ev.documentType && !DOCUMENT_TYPES[ev.documentType]) E(`${tag}: documentType '${ev.documentType}' 미정의`);
    if (ev.documentType && !ev.embeddedDocumentAuthor) E(`${tag}: documentType이 있으나 embeddedDocumentAuthor 없음`);
    refPerson(ev, ev.embeddedDocumentAuthor, "embeddedDocumentAuthor");
    if (ev.embeddedDocumentAuthor && !(ev.relations || []).some((r) => r.source === ev.embeddedDocumentAuthor && r.layer === "REPORT" || r.source === ev.embeddedDocumentAuthor && r.layer === "POLICY")) {
      W(`${tag}: embeddedDocumentAuthor가 있으나 그 인물의 REPORT/POLICY 관계가 없음`);
    }
    // 참조 무결성
    PARTICIPANTS.forEach((f) => (ev[f] || []).forEach((id) => refPerson(ev, id, f)));
    (ev.placeIds || []).forEach((p) => placeIds.has(p) || E(`${tag}: placeId '${p}'가 PLACES에 없음`));
    if (!(ev.sourceIds || []).length) E(`${tag}: sourceIds 없음`);
    (ev.sourceIds || []).forEach((s) => sourceIds.has(s) || E(`${tag}: sourceId '${s}'가 SOURCES에 없음`));
    (ev.discrepancies || []).forEach((d) => discIds.has(d) || E(`${tag}: discrepancy '${d}' 없음`));
    // 사료 수준과 certainty
    const evSrc = ev.sourceIds || [];
    if (evSrc.length && evSrc.every((s) => !isPrimaryish(s)) && !NON_PRIMARY_OK.has(ev.certainty)) {
      E(`${tag}: 2차자료만 근거인데 certainty='${ev.certainty}' (secondary_only 등으로 표시해야 함)`);
    }
    if (evSrc.length && evSrc.every(isSeed) && ev.certainty !== "unverified_seed") E(`${tag}: 미검증 시드 사료만 근거인데 certainty='${ev.certainty}'`);
    // 인과
    (ev.causedBy || []).forEach((c) => {
      const cause = eventsById[c.eventId];
      if (!cause) return E(`${tag}: causedBy 사건 '${c.eventId}' 없음`);
      if (!CAUSAL_STATUS[c.causalStatus]) E(`${tag}: causedBy causalStatus '${c.causalStatus}' 미정의`);
      if (cause.eventDate > ev.eventDate) E(`${tag}: 원인 사건 ${c.eventId}(${cause.eventDate})이 결과보다 늦음 — 시간 역행 인과`);
    });
    // 관계
    (ev.relations || []).forEach((r, i) => {
      relCount++;
      const rt = `${tag} relation#${i}`;
      if (!personIds.has(r.source)) E(`${rt}: source '${r.source}'가 PEOPLE에 없음`);
      if (!personIds.has(r.target)) E(`${rt}: target '${r.target}'가 PEOPLE에 없음`);
      if (r.source === r.target) E(`${rt}: self-loop`);
      if (!LAYERS[r.layer]) E(`${rt}: layer '${r.layer}' 미정의`);
      if (!r.relationType) E(`${rt}: relationType 없음`);
      const cert = r.certainty || "confirmed";
      if (!CERTAINTY[cert]) E(`${rt}: certainty '${cert}' 미정의`);
      if (r.causalStatus && !CAUSAL_STATUS[r.causalStatus]) E(`${rt}: causalStatus '${r.causalStatus}' 미정의`);
      if (r.direction && !["directed", "undirected"].includes(r.direction)) E(`${rt}: direction '${r.direction}' 오류`);
      const sd = r.startDate || ev.eventDate, ed = r.endDate || sd;
      if (!isValidDate(sd) || !isValidDate(ed)) E(`${rt}: 날짜 형식 오류`);
      if (ed < sd) E(`${rt}: 날짜 역전 ${sd} > ${ed}`);
      if (sd < ev.eventDate) W(`${rt}: 관계 시작일이 사건일보다 앞섬`);
      const rs = r.sourceIds && r.sourceIds.length ? r.sourceIds : evSrc;
      if (!rs.length) E(`${rt}: sourceIds 없음`);
      rs.forEach((s) => sourceIds.has(s) || E(`${rt}: sourceId '${s}' 없음`));
      if (cert === "confirmed" && !rs.some(isPrimaryish)) E(`${rt}: confirmed 관계인데 1차/당대 사료가 없음`);
      if (cert === "confirmed" && rs.every(isSeed)) E(`${rt}: confirmed 관계인데 미검증 시드 사료만 있음`);
      if (rs.every((s) => !isPrimaryish(s)) && !NON_PRIMARY_OK.has(cert)) E(`${rt}: 2차자료만으로 '${cert}' 표시`);
    });
  }

  /* ---------- 7. 불일치 기록 ---------- */
  for (const d of DISCREPANCIES) {
    (d.eventIds || []).forEach((e) => eventIds.has(e) || E(`DISCREPANCY ${d.id}: eventId '${e}' 없음`));
    if (!["open", "resolved_in_data", "not_assessed"].includes(d.status)) E(`DISCREPANCY ${d.id}: status '${d.status}' 오류`);
  }

  /* ---------- 8. 사용되지 않은 엔티티(경고) ---------- */
  const usedP = new Set(), usedPl = new Set(), usedS = new Set();
  for (const ev of EVENTS) {
    PARTICIPANTS.forEach((f) => (ev[f] || []).forEach((id) => usedP.add(id)));
    (ev.relations || []).forEach((r) => { usedP.add(r.source); usedP.add(r.target); (r.sourceIds || []).forEach((s) => usedS.add(s)); });
    (ev.placeIds || []).forEach((p) => usedPl.add(p));
    (ev.sourceIds || []).forEach((s) => usedS.add(s));
  }
  PEOPLE.forEach((p) => usedP.has(p.personId) || W(`PEOPLE ${p.personId}: 어떤 사건에도 등장하지 않음`));
  PLACES.forEach((p) => usedPl.has(p.placeId) || PLACES.some((q) => q.parentPlaceId === p.placeId) || W(`PLACES ${p.placeId}: 사용되지 않음`));
  SOURCES.forEach((s) => usedS.has(s.id) || s.sourceLevel === "secondary" || W(`SOURCES ${s.id}: 어떤 사건도 지지하지 않음`));

  return {
    errors, warnings,
    stats: { people: PEOPLE.length, places: PLACES.length, sources: SOURCES.length, events: EVENTS.length, relations: relCount, states: PERSON_STATES.length }
  };
}
