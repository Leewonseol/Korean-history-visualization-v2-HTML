/* ==========================================================================
   validateData(data) — 재사용 가능한 데이터 무결성 검사
   브라우저(app.js 시작 시)와 Node CLI(tools/validate.mjs) 양쪽에서 사용한다.
   반환: { errors: string[], warnings: string[], notices: string[], stats: object, sourceUsage }
   - errors   : 데이터가 규칙을 어김(테스트 실패)
   - warnings : 확인이 필요한 상태(예: 검증 사료가 근거로 쓰이지 않음, 내용 미확인 사료 등록)
   - notices  : 상태 안내(legacy 사료, 서지 정보만 있는 사료 등). 숨기지 않고 상태별로 알린다.
   ========================================================================== */
import {
  LEVELS, LAYERS, CERTAINTY, CAUSAL_STATUS, THEATERS, AFFILIATIONS, ENTITY_TYPES,
  MECHANISMS, OUTCOME_TYPES, SOURCE_TYPES, SOURCE_LEVELS, DOCUMENT_TYPES, VERIFICATION,
  PROVENANCE, DERIVATION_RULES, DIRECTION_POLICY, DATE_PRECISION, TIME_KIND, COVERAGE_STATUS,
  IDENTITY_STATUS, COORDINATE_STATUS, LOCATION_STATUS, NARRATIVE_STATUS, SOURCE_USAGE, evidenceStatusOf
} from "../data/vocab.js";
import { isValidDate, isValidBound, isDayPrecise, yearOf } from "./dates.js";

const WHAT_TYPES = new Set(["gain", "loss", "burden", "transfer", "recover", "claim"]);
const PARTICIPANTS = ["actors", "targets", "beneficiaries", "victims", "decisionMakers", "informationSources", "subjects"];
const NON_PRIMARY_OK = new Set(["secondary_only", "interpretation", "unverified_seed"]);
const LINK_TYPES = new Set(["causal", "same_record", "same_campaign", "reference"]);
const CAUSAL_LINK_OK = new Set(["explicit", "strongly_implied"]);
const DATE_BASES = new Set(["pack_event_date", "court_act_on_record_date", "before_record_date", "pack_event_range",
  "year_only_geography", "legacy_month", "legacy_record_date", "report_receipt_on_record_date"]);
export const PROJECT_YEARS = Array.from({ length: 1449 - 1432 + 1 }, (_, i) => 1432 + i);

const hasOwn = (o, k) => Object.prototype.hasOwnProperty.call(o, k);
const sortDate = (ev) => ev.dateMin ?? ev.dateMax ?? ev.recordDate ?? null;

/** 사료별 사용 상태(SOURCE_USAGE)와 상태별 메시지. 연구 문서 생성기도 같은 함수를 쓴다. */
export function sourceUsage(data) {
  const { SOURCES, EVENTS } = data;
  const used = new Set(), related = new Set();
  for (const ev of EVENTS) {
    (ev.sourceIds || []).forEach((s) => used.add(s));
    (ev.relatedSourceIds || []).forEach((s) => related.add(s));
    (ev.relations || []).forEach((r) => (r.sourceIds || []).forEach((s) => used.add(s)));
  }
  const out = {};
  for (const s of SOURCES) {
    let status, message;
    if (s.verification === "not_accessed") {
      status = "REGISTERED_UNCHECKED";
      message = "등록됐으나 본문을 확인하지 못함 — 어떤 사건·관계의 근거로도 쓰지 않는다(사용하면 오류).";
    } else if (s.sourceLevel === "secondary" || s.sourceType === "secondary_reference") {
      status = "BIBLIOGRAPHIC_ONLY";
      message = "서지·2차 서술만 있음 — 사건 edge의 근거가 아니다.";
    } else if (s.verification === "pack_v1") {
      status = used.has(s.id) ? "VERIFIED_USED" : "VERIFIED_UNUSED";
      message = used.has(s.id) ? "pack v1 검증 · 사건 근거로 사용"
        : `pack v1 검증 사료이나 사건 근거로 쓰이지 않음${related.has(s.id) ? "(관련 사료로만 참조)" : ""}.`;
    } else {
      status = "LEGACY";
      message = s.verification === "seed_unverified" ? "최초 anchor 목록에만 있고 pack v1에 없음(legacy)."
        : "v2 이관 사료 — 원문 재대조 전(legacy). 기본 화면·지표에서 제외.";
    }
    out[s.id] = { status, message, usedAsEvidence: used.has(s.id), referencedOnly: !used.has(s.id) && related.has(s.id) };
  }
  return out;
}

export function validateData(data) {
  const { PEOPLE, PLACES, SOURCES, EVENTS, PERSON_ATTESTATIONS = [], DISCREPANCIES = [], COVERAGE = [], STORY_SCENES = [] } = data;
  const errors = [], warnings = [], notices = [];
  const E = (m) => errors.push(m), W = (m) => warnings.push(m), N = (m) => notices.push(m);

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
  uniq(PERSON_ATTESTATIONS, "id", "PERSON_ATTESTATIONS");
  const discIds = uniq(DISCREPANCIES, "id", "DISCREPANCIES");
  uniq(STORY_SCENES, "id", "STORY_SCENES");
  const sourcesById = Object.fromEntries(SOURCES.map((s) => [s.id, s]));
  const peopleById = Object.fromEntries(PEOPLE.map((p) => [p.personId, p]));
  const eventsById = Object.fromEntries(EVENTS.map((e) => [e.id, e]));
  const isPack = (id) => sourcesById[id] && sourcesById[id].verification === "pack_v1";
  const isPrimaryish = (id) => sourcesById[id] && sourcesById[id].sourceLevel !== "secondary";
  const isSeed = (id) => sourcesById[id] && sourcesById[id].verification === "seed_unverified";
  const notAccessed = (id) => sourcesById[id] && sourcesById[id].verification === "not_accessed";
  const provOk = (tag, prov) => {
    if (!prov) { E(`${tag}: provenance 없음`); return false; }
    if (!PROVENANCE[prov]) { E(`${tag}: provenance '${prov}' 미정의`); return false; }
    if (prov === "unknown_provenance") { E(`${tag}: 출처 불명(unknown_provenance) 레코드는 허용하지 않음`); return false; }
    return true;
  };

  /* ---------- 2. 인물 authority: 필드·동일성 ---------- */
  const byName = {}, byHanja = {};
  for (const p of PEOPLE) {
    const tag = `PEOPLE ${p.personId}`;
    if (!ENTITY_TYPES[p.entityType]) E(`${tag}: entityType '${p.entityType}' 미정의`);
    if (!AFFILIATIONS[p.affiliation]) E(`${tag}: affiliation '${p.affiliation}' 미정의`);
    if (!LEVELS[p.defaultLevel]) E(`${tag}: defaultLevel '${p.defaultLevel}' 미정의`);
    if (!p.canonicalName) E(`${tag}: canonicalName 없음`);
    provOk(tag, p.provenance);
    if (hasOwn(p, "hanjaVerified")) E(`${tag}: 폐기된 필드 hanjaVerified — nameFormVerified/identityStatus로 분리`);
    if (p.hanja && !(p.nameFormVerified && p.nameFormSource)) E(`${tag}: 한자 '${p.hanja}'의 근거(nameFormVerified·nameFormSource) 없음 — 편집자 한자 금지`);
    if (p.identityStatus != null && !IDENTITY_STATUS[p.identityStatus]) E(`${tag}: identityStatus '${p.identityStatus}' 미정의`);
    if (p.entityType !== "person" && p.identityStatus !== "collective_or_office") E(`${tag}: 집단·기관은 identityStatus=collective_or_office`);
    if (p.entityType === "person" && p.identityStatus === "collective_or_office") E(`${tag}: 개인에게 collective_or_office`);
    if (p.identityStatus === "unresolved_homonym" && !(p.possibleSameAs || []).length) E(`${tag}: unresolved_homonym인데 possibleSameAs 없음`);
    if (p.identityStatus === "confirmed_same_person" && !p.identityNote) E(`${tag}: confirmed_same_person 근거(identityNote) 없음`);
    for (const q of p.possibleSameAs || []) {
      if (!personIds.has(q)) E(`${tag}: possibleSameAs '${q}' 없음`);
      else if (!(peopleById[q].possibleSameAs || []).includes(p.personId)) E(`${tag}: possibleSameAs '${q}'가 상호 선언되지 않음`);
      if (q === p.personId) E(`${tag}: possibleSameAs 자기 자신`);
    }
    if (p.entityType !== "person") continue;
    (byName[p.canonicalName] ||= []).push(p);
    if (p.hanja) (byHanja[p.hanja] ||= []).push(p);
  }
  // 같은 이름의 서로 다른 ID는 distinctFrom 또는 possibleSameAs로 선언해야 한다.
  const declaredDistinct = (a, b) => [...(a.distinctFrom || []), ...(a.possibleSameAs || [])].includes(b.personId)
    || [...(b.distinctFrom || []), ...(b.possibleSameAs || [])].includes(a.personId);
  for (const [name, arr] of Object.entries(byName)) {
    for (let i = 0; i < arr.length; i++) for (let j = i + 1; j < arr.length; j++) {
      if (!declaredDistinct(arr[i], arr[j])) E(`동일 인물 중복 의심: '${name}' → ${arr[i].personId}, ${arr[j].personId} (distinctFrom/possibleSameAs 선언 필요)`);
    }
  }
  for (const [h, arr] of Object.entries(byHanja)) {
    if (arr.length > 1 && !declaredDistinct(arr[0], arr[1])) E(`같은 한자 이름 '${h}' 을 가진 ID 여러 개(선언 없음): ${arr.map((p) => p.personId).join(", ")}`);
  }
  for (const p of PEOPLE) for (const a of p.aliases || []) {
    if (byName[a] && !byName[a].some((q) => q.personId === p.personId)) W(`${p.personId}의 이명 '${a}'가 다른 인물의 대표명과 같음`);
  }

  /* ---------- 3. 장소 ---------- */
  for (const pl of PLACES) {
    const tag = `PLACES ${pl.placeId}`;
    if (!THEATERS[pl.theater]) E(`${tag}: theater '${pl.theater}' 미정의`);
    if (!["pack_explicit", "editorial_from_pack"].includes(pl.theaterBasis)) E(`${tag}: theaterBasis '${pl.theaterBasis}' 오류`);
    if (!COORDINATE_STATUS[pl.coordinateStatus]) E(`${tag}: coordinateStatus '${pl.coordinateStatus}' 미정의`);
    if (!LOCATION_STATUS[pl.locationStatus]) E(`${tag}: locationStatus '${pl.locationStatus}' 미정의`);
    if (pl.coordinate && pl.coordinateStatus !== "sourced") E(`${tag}: 좌표가 있으나 coordinateStatus='${pl.coordinateStatus}'`);
    if (pl.coordinate && !(pl.sourceIds || []).length) E(`${tag}: 근거 sourceIds 없이 좌표가 입력됨`);
    if (pl.coordinateStatus === "sourced" && !pl.coordinate) E(`${tag}: coordinateStatus=sourced인데 좌표 없음`);
    if (pl.hanja) E(`${tag}: 장소 한자 '${pl.hanja}' — pack v1 지명에 한자가 없으므로 편집자 한자 금지`);
    if (pl.parentPlaceId) {
      if (!placeIds.has(pl.parentPlaceId)) E(`${tag}: parentPlaceId ${pl.parentPlaceId} 없음`);
      const pb = pl.parentBasis;
      if (!pb || !(pb.sourceIds || []).length) E(`${tag}: parentPlaceId ${pl.parentPlaceId}의 근거(parentBasis.sourceIds) 없음`);
      else pb.sourceIds.forEach((s) => isPack(s) || E(`${tag}: parentBasis 사료 ${s}가 pack v1이 아님`));
    }
    (pl.sourceIds || []).forEach((s) => sourceIds.has(s) || E(`${tag}: sourceId ${s} 없음`));
  }

  /* ---------- 4. 사료 ---------- */
  for (const s of SOURCES) {
    if (!SOURCE_TYPES[s.sourceType]) E(`SOURCES ${s.id}: sourceType '${s.sourceType}' 미정의`);
    if (!SOURCE_LEVELS[s.sourceLevel]) E(`SOURCES ${s.id}: sourceLevel '${s.sourceLevel}' 미정의`);
    if (!/^https?:\/\//.test(s.url || "")) E(`SOURCES ${s.id}: url 없음/형식 오류`);
    if (s.date && !isValidDate(s.date)) E(`SOURCES ${s.id}: date '${s.date}' 형식 오류`);
    if (!VERIFICATION[s.verification]) E(`SOURCES ${s.id}: verification '${s.verification}' 미정의`);
    if (s.sourceType === "secondary_reference" && s.sourceLevel !== "secondary") E(`SOURCES ${s.id}: secondary_reference인데 sourceLevel이 ${s.sourceLevel}`);
    if (s.documentType && !DOCUMENT_TYPES[s.documentType]) E(`SOURCES ${s.id}: documentType '${s.documentType}' 미정의`);
  }
  const usage = sourceUsage(data);
  for (const [id, u] of Object.entries(usage)) {
    if (!SOURCE_USAGE[u.status]) E(`SOURCES ${id}: usage status '${u.status}' 미정의`);
    if (u.status === "VERIFIED_UNUSED") W(`SOURCES ${id} [VERIFIED_UNUSED]: ${u.message}`);
    else if (u.status === "REGISTERED_UNCHECKED") W(`SOURCES ${id} [REGISTERED_UNCHECKED]: ${u.message}`);
    else if (u.status === "BIBLIOGRAPHIC_ONLY") N(`SOURCES ${id} [BIBLIOGRAPHIC_ONLY]: ${u.message}`);
    else if (u.status === "LEGACY") N(`SOURCES ${id} [LEGACY]: ${u.message}`);
  }

  /* ---------- 5. 관직·역할 증언(attestation) ---------- */
  for (const a of PERSON_ATTESTATIONS) {
    const tag = `PERSON_ATTESTATIONS ${a.id}`;
    if (!personIds.has(a.personId)) E(`${tag}: personId ${a.personId} 없음`);
    if (!LEVELS[a.level]) E(`${tag}: level '${a.level}' 미정의`);
    if (!isValidDate(a.attestedDate)) E(`${tag}: attestedDate '${a.attestedDate}' 형식 오류`);
    if (hasOwn(a, "endDate") || hasOwn(a, "startDate")) E(`${tag}: 구간(startDate/endDate) 금지 — 종료일 역산 불가`);
    if (a.levelBasis !== "editorial_classification") E(`${tag}: levelBasis 없음`);
    if (provOk(tag, a.provenance) && evidenceStatusOf(a.provenance) === "verified" && !(a.sourceIds || []).some(isPack)) {
      E(`${tag}: pack 증언인데 pack v1 사료가 없음`);
    }
    if (!(a.sourceIds || []).length) E(`${tag}: sourceIds 없음`);
    (a.sourceIds || []).forEach((s) => sourceIds.has(s) || E(`${tag}: sourceId ${s} 없음`));
  }

  /* ---------- 6. 사건 ---------- */
  const refPerson = (ev, id, where) => { if (id != null && !personIds.has(id)) E(`EVENT ${ev.id}: ${where}의 personId '${id}'가 PEOPLE에 없음`); };
  let relCount = 0, sourceless = 0;
  const relByGroup = { verified: 0, legacy: 0, interpretation: 0, unknown: 0 };
  const verifiedYears = new Set();
  for (const ev of EVENTS) {
    const tag = `EVENT ${ev.id}`;
    for (const old of ["eventDate", "eventEndDate", "verification", "causedBy"]) if (hasOwn(ev, old)) E(`${tag}: 폐기된 필드 '${old}'`);
    const evProvOk = provOk(tag, ev.provenance);
    const evGroup = evidenceStatusOf(ev.provenance);
    if (evProvOk && evGroup === "verified" && !(ev.sourceIds || []).some(isPack)) E(`${tag}: pack 사건인데 pack v1 사료가 sourceIds에 없음`);
    if (evGroup === "verified") { const d = sortDate(ev); if (d) verifiedYears.add(yearOf(d)); }

    // 날짜(가짜 정밀도 금지)
    const { dateMin: mn, dateMax: mx, datePrecision: pr, recordDate: rd } = ev;
    if (!DATE_PRECISION[pr]) E(`${tag}: datePrecision '${pr}' 미정의(DAY/MONTH/YEAR/UNKNOWN)`);
    if (!hasOwn(ev, "dateMin") || !hasOwn(ev, "dateMax")) E(`${tag}: dateMin/dateMax 필드 없음`);
    if (mn != null && !isValidBound(mn)) E(`${tag}: dateMin '${mn}' 형식 오류`);
    if (mx != null && !isValidBound(mx)) E(`${tag}: dateMax '${mx}' 형식 오류`);
    if (mn != null && mx != null && mn > mx) E(`${tag}: 날짜 역전 ${mn} > ${mx}`);
    if (mn == null && mx == null && rd == null) E(`${tag}: 날짜 경계와 기사일이 모두 없음`);
    if (pr === "DAY" && !(isDayPrecise(mn) && isDayPrecise(mx))) E(`${tag}: DAY 정밀도인데 경계가 일 단위 날짜가 아님(${mn}~${mx})`);
    if (pr === "MONTH" && !(mn && mx && /-00$/.test(mn) && /-99$/.test(mx) && mn.slice(0, -3) === mx.slice(0, -3))) E(`${tag}: MONTH 정밀도는 'YYYY-MM-00'~'YYYY-MM-99'`);
    if (pr === "YEAR" && !(mn && mx && /-00-00$/.test(mn) && /-99-99$/.test(mx) && mn.slice(0, 4) === mx.slice(0, 4))) E(`${tag}: YEAR 정밀도는 'YYYY-00-00'~'YYYY-99-99'`);
    if (pr === "UNKNOWN" && mn != null && mx != null) E(`${tag}: 두 경계를 모두 알면 UNKNOWN이 아님`);
    if (rd != null && !isValidDate(rd)) E(`${tag}: recordDate '${rd}' 형식 오류`);
    if (rd != null && mn != null && mn > rd) W(`${tag}: dateMin(${mn})이 기사일(${rd})보다 뒤 — 예정 사항인지 확인`);
    if (!DATE_BASES.has(ev.dateBasis)) E(`${tag}: dateBasis '${ev.dateBasis}' 미정의`);
    if (["court_act_on_record_date", "report_receipt_on_record_date"].includes(ev.dateBasis) && !(mn === rd && mx === rd)) E(`${tag}: court_act_on_record_date인데 날짜가 기사일과 다름`);
    if (ev.dateBasis === "before_record_date" && !(mn == null && mx === rd)) E(`${tag}: before_record_date는 dateMin=null, dateMax=기사일`);
    const datedSillok = (ev.sourceIds || []).map((s) => sourcesById[s]).filter((s) => s && s.sourceType === "sillok" && s.date);
    if (rd != null && datedSillok.length && !datedSillok.some((s) => s.date === rd)) E(`${tag}: recordDate(${rd})가 실록 사료 게재일(${datedSillok.map((s) => s.date).join(",")})과 다름`);
    if (rd == null && datedSillok.length) E(`${tag}: 실록 기사가 근거인데 recordDate 없음`);

    // Lasswell 필수 필드
    if (!(ev.actors || []).length) E(`${tag}: WHO(actors) 비어 있음`);
    if (!(ev.what || []).length) E(`${tag}: WHAT(what) 비어 있음`);
    if (!(ev.mechanisms || []).length) E(`${tag}: HOW(mechanisms) 비어 있음`);
    if (!(ev.theater || []).length) E(`${tag}: WHERE(theater) 비어 있음`);
    if (!["pack_explicit", "pack_derived", "editorial_from_pack", "legacy"].includes(ev.theaterBasis)) E(`${tag}: theaterBasis '${ev.theaterBasis}' 오류`);
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
    if (ev.documentType && !DOCUMENT_TYPES[ev.documentType]) E(`${tag}: documentType '${ev.documentType}' 미정의`);
    if (ev.documentType && !ev.embeddedDocumentAuthor) E(`${tag}: documentType이 있으나 embeddedDocumentAuthor 없음`);
    refPerson(ev, ev.embeddedDocumentAuthor, "embeddedDocumentAuthor");
    // 참조 무결성
    PARTICIPANTS.forEach((f) => (ev[f] || []).forEach((id) => refPerson(ev, id, f)));
    (ev.placeIds || []).forEach((p) => placeIds.has(p) || E(`${tag}: placeId '${p}'가 PLACES에 없음`));
    if (!(ev.sourceIds || []).length) E(`${tag}: sourceIds 없음`);
    (ev.sourceIds || []).forEach((s) => sourceIds.has(s) || E(`${tag}: sourceId '${s}'가 SOURCES에 없음`));
    (ev.relatedSourceIds || []).forEach((s) => sourceIds.has(s) || E(`${tag}: relatedSourceId '${s}'가 SOURCES에 없음`));
    [...(ev.sourceIds || []), ...(ev.relatedSourceIds || [])].forEach((s) => notAccessed(s) && E(`${tag}: 내용을 확인하지 못한 사료(${s})를 근거로 사용`));
    (ev.discrepancies || []).forEach((d) => discIds.has(d) || E(`${tag}: discrepancy '${d}' 없음`));
    const evSrc = ev.sourceIds || [];
    if (evSrc.length && evSrc.every((s) => !isPrimaryish(s)) && !NON_PRIMARY_OK.has(ev.certainty)) E(`${tag}: 2차자료만 근거인데 certainty='${ev.certainty}'`);
    if (evSrc.length && evSrc.every(isSeed) && ev.provenance !== "legacy_anchor_seed") E(`${tag}: 미검증 시드 사료만 근거인데 provenance='${ev.provenance}'`);

    // 사건 사이 연결: 시간 선후만으로 인과를 만들지 않는다
    (ev.eventLinks || []).forEach((l, i) => {
      const lt = `${tag} eventLink#${i}`;
      const other = eventsById[l.eventId];
      if (!other) return E(`${lt}: 사건 '${l.eventId}' 없음`);
      if (!LINK_TYPES.has(l.linkType)) E(`${lt}: linkType '${l.linkType}' 미정의`);
      if (!CAUSAL_STATUS[l.causalStatus]) E(`${lt}: causalStatus '${l.causalStatus}' 미정의`);
      provOk(lt, l.provenance);
      if (l.linkType === "causal" && !CAUSAL_LINK_OK.has(l.causalStatus)) E(`${lt}: causal 링크인데 causalStatus='${l.causalStatus}' — 선후만으로 인과 금지`);
      if (CAUSAL_LINK_OK.has(l.causalStatus) && evidenceStatusOf(l.provenance) !== "verified") E(`${lt}: 검증되지 않은(${l.provenance}) 링크에 인과 상태 '${l.causalStatus}' — legacy 인과 승격 금지`);
      if (l.linkType !== "causal" && CAUSAL_LINK_OK.has(l.causalStatus)) E(`${lt}: linkType '${l.linkType}'에 인과 상태 '${l.causalStatus}'`);
      if (l.linkType === "causal") {
        const a = other.dateMax ?? other.recordDate, b = ev.dateMin ?? ev.dateMax ?? ev.recordDate;
        if (a && b && other.dateMin && other.dateMin > b) E(`${lt}: 원인 사건이 결과보다 늦음 — 시간 역행 인과`);
      }
      if (!l.note) E(`${lt}: note(근거 설명) 없음`);
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
      for (const old of ["startDate", "endDate", "verification"]) if (hasOwn(r, old)) E(`${rt}: 폐기된 필드 '${old}'`);
      // 근거 계보
      const ok = provOk(rt, r.provenance);
      const g = evidenceStatusOf(r.provenance);
      relByGroup[ok ? g : "unknown"]++;
      if (r.provenance === "pack_v1_derived" && !DERIVATION_RULES[r.derivationRule]) E(`${rt}: pack_v1_derived인데 derivationRule '${r.derivationRule}' 미정의`);
      if (r.provenance !== "pack_v1_derived" && r.derivationRule) E(`${rt}: derivationRule은 pack_v1_derived에만`);
      if (g === "verified" && evGroup !== "verified") E(`${rt}: legacy/해석 사건 안에 pack 관계 — 근거 계보 불일치`);
      const cert = r.certainty || "confirmed";
      if (!CERTAINTY[cert]) E(`${rt}: certainty '${cert}' 미정의`);
      if (r.provenance === "interpretation" && cert !== "interpretation") E(`${rt}: provenance=interpretation인데 certainty='${cert}'`);
      if (cert === "interpretation" && r.provenance !== "interpretation") E(`${rt}: certainty=interpretation인데 provenance='${r.provenance}'`);
      // 인과
      if (!hasOwn(r, "causalStatus") || r.causalStatus == null) E(`${rt}: causalStatus 없음(기본값 explicit 금지)`);
      else if (!CAUSAL_STATUS[r.causalStatus]) E(`${rt}: causalStatus '${r.causalStatus}' 미정의`);
      if (r.causalStatus === "explicit" && g !== "verified") E(`${rt}: 검증되지 않은 관계에 causalStatus=explicit`);
      // 방향 정책
      const dir = r.direction || "directed";
      if (!["directed", "undirected"].includes(dir)) E(`${rt}: direction '${dir}' 오류`);
      const pol = DIRECTION_POLICY[r.layer];
      if (dir === "undirected" && pol === "directed") E(`${rt}: layer ${r.layer}는 방향 필수(directed) — undirected 금지`);
      if (dir === "undirected" && pol === "declared" && !r.directionEvidence) E(`${rt}: undirected에는 directionEvidence(pack 근거) 필요`);
      if (typeof r.pathEligible !== "boolean") E(`${rt}: pathEligible 없음`);
      // 시각
      if (!TIME_KIND[r.timeKind || "instant"]) E(`${rt}: timeKind '${r.timeKind}' 미정의`);
      const own = hasOwn(r, "dateMin") || hasOwn(r, "dateMax");
      const tMin = own ? r.dateMin ?? null : mn, tMax = own ? r.dateMax ?? null : mx;
      if (tMin != null && !isValidBound(tMin)) E(`${rt}: dateMin '${tMin}' 형식 오류`);
      if (tMax != null && !isValidBound(tMax)) E(`${rt}: dateMax '${tMax}' 형식 오류`);
      if (tMin != null && tMax != null && tMin > tMax) E(`${rt}: 날짜 역전 ${tMin} > ${tMax}`);
      if (r.timeKind === "duration" && (tMin == null || tMax == null)) E(`${rt}: duration은 두 경계가 모두 필요`);
      if (tMin == null && tMax == null && rd == null) E(`${rt}: 시각·기사일 모두 미상 — 표시 위치 없음`);
      // 사료
      const rs = r.sourceIds && r.sourceIds.length ? r.sourceIds : evSrc;
      if (!rs.length) { sourceless++; E(`${rt}: sourceIds 없음`); }
      rs.forEach((s) => sourceIds.has(s) || E(`${rt}: sourceId '${s}' 없음`));
      if (g === "verified" && !rs.some(isPack)) E(`${rt}: pack 관계인데 pack v1 사료가 없음`);
      if (cert === "confirmed" && !rs.some(isPrimaryish)) E(`${rt}: confirmed 관계인데 1차/당대 사료가 없음`);
      rs.forEach((s) => notAccessed(s) && E(`${rt}: 내용을 확인하지 못한 사료(${s})를 근거로 사용`));
      if (rs.every((s) => !isPrimaryish(s)) && !NON_PRIMARY_OK.has(cert)) E(`${rt}: 2차자료만으로 '${cert}' 표시`);
    });
  }

  /* ---------- 7. 불일치 기록 ---------- */
  for (const d of DISCREPANCIES) {
    (d.eventIds || []).forEach((e) => eventIds.has(e) || E(`DISCREPANCY ${d.id}: eventId '${e}' 없음`));
    if (!["open", "resolved_in_data", "not_assessed"].includes(d.status)) E(`DISCREPANCY ${d.id}: status '${d.status}' 오류`);
  }

  /* ---------- 8. coverage 레지스트리 ---------- */
  const covYears = new Map();
  for (const c of COVERAGE) {
    const tag = `COVERAGE ${c.year}`;
    if (covYears.has(c.year)) E(`${tag}: 중복`);
    covYears.set(c.year, c);
    if (!COVERAGE_STATUS[c.coverageStatus]) E(`${tag}: coverageStatus '${c.coverageStatus}' 미정의`);
    (c.sourceIds || []).forEach((s) => {
      if (!isPack(s)) E(`${tag}: sourceId ${s}가 pack v1 사료가 아님`);
      else if (sourcesById[s].date && yearOf(sourcesById[s].date) !== c.year) E(`${tag}: sourceId ${s}의 연도가 다름`);
    });
    (c.geographySourceIds || []).forEach((s) => isPack(s) || E(`${tag}: geographySourceId ${s}가 pack v1 사료가 아님`));
    if (c.coverageStatus === "NOT_COVERED") {
      if ((c.sourceIds || []).length) E(`${tag}: NOT_COVERED인데 검증 사료가 있음`);
      if (!c.note || !/아님/.test(c.note)) E(`${tag}: NOT_COVERED 안내문(사건 부재가 아니라는 설명) 필요`);
      if (verifiedYears.has(c.year)) E(`${tag}: NOT_COVERED인데 검증 사건이 있음`);
    }
    if (c.coverageStatus === "VERIFIED_WITH_EVENTS" && !(c.sourceIds || []).length && !(c.geographySourceIds || []).length) E(`${tag}: VERIFIED_WITH_EVENTS인데 사료 없음`);
    if (c.coverageStatus === "VERIFIED_NO_RELEVANT_EVENT" && !c.note) E(`${tag}: 관련 사건 없음 판단의 근거 note 필요`);
  }
  for (const y of PROJECT_YEARS) if (!covYears.has(y)) E(`COVERAGE: ${y}년 항목 없음`);
  for (const y of verifiedYears) {
    const c = covYears.get(y);
    if (c && !["VERIFIED_WITH_EVENTS", "PARTIAL"].includes(c.coverageStatus)) E(`COVERAGE ${y}: 검증 사건이 있는데 coverageStatus='${c.coverageStatus}'`);
  }
  for (const s of SOURCES) {
    if (s.verification !== "pack_v1" || s.sourceType !== "sillok" || !s.date) continue;
    const c = covYears.get(yearOf(s.date));
    if (c && !(c.sourceIds || []).includes(s.id)) E(`COVERAGE ${yearOf(s.date)}: pack 사료 ${s.id}가 coverage 목록에 없음`);
  }

  /* ---------- 9. 스토리 문장 근거 ---------- */
  for (const sc of STORY_SCENES) {
    const tag = `STORY ${sc.id}`;
    if (!(sc.statements || []).length) E(`${tag}: statements 없음`);
    (sc.statements || []).forEach((st, i) => {
      const t = `${tag} statement#${i}`;
      if (!st.text) E(`${t}: text 없음`);
      if (!(st.eventIds || []).length) E(`${t}: eventIds 없음`);
      if (!(st.sourceIds || []).length) E(`${t}: sourceIds 없음`);
      if (!NARRATIVE_STATUS[st.narrativeStatus]) E(`${t}: narrativeStatus '${st.narrativeStatus}' 미정의`);
      provOk(t, st.provenance);
      if ((st.narrativeStatus === "interpretation") !== (st.provenance === "interpretation")) E(`${t}: interpretation 서술과 provenance 불일치`);
      const allowed = new Set();
      (st.eventIds || []).forEach((e) => {
        const ev = eventsById[e];
        if (!ev) return E(`${t}: eventId '${e}' 없음`);
        [...ev.sourceIds, ...(ev.relatedSourceIds || [])].forEach((s) => allowed.add(s));
        if (evidenceStatusOf(st.provenance) === "verified" && evidenceStatusOf(ev.provenance) !== "verified") E(`${t}: pack 문장이 legacy 사건 ${e}를 근거로 함`);
      });
      (st.sourceIds || []).forEach((s) => {
        if (!sourceIds.has(s)) E(`${t}: sourceId '${s}' 없음`);
        else if (!allowed.has(s)) E(`${t}: sourceId '${s}'가 문장의 사건 근거가 아님`);
        if (evidenceStatusOf(st.provenance) === "verified" && !isPack(s)) E(`${t}: pack 문장이 pack 아닌 사료 ${s}를 인용`);
      });
    });
  }

  /* ---------- 10. 사용되지 않은 엔티티(경고) ---------- */
  const usedP = new Set(), usedPl = new Set();
  for (const ev of EVENTS) {
    PARTICIPANTS.forEach((f) => (ev[f] || []).forEach((id) => usedP.add(id)));
    (ev.relations || []).forEach((r) => { usedP.add(r.source); usedP.add(r.target); });
    (ev.placeIds || []).forEach((p) => usedPl.add(p));
  }
  PEOPLE.forEach((p) => usedP.has(p.personId) || W(`PEOPLE ${p.personId}: 어떤 사건에도 등장하지 않음`));
  PLACES.forEach((p) => usedPl.has(p.placeId) || PLACES.some((q) => q.parentPlaceId === p.placeId) || W(`PLACES ${p.placeId}: 사용되지 않음`));

  return {
    errors, warnings, notices, sourceUsage: usage,
    stats: {
      people: PEOPLE.length, places: PLACES.length, sources: SOURCES.length, events: EVENTS.length,
      relations: relCount, relationsVerified: relByGroup.verified, relationsLegacy: relByGroup.legacy,
      relationsInterpretation: relByGroup.interpretation, relationsUnknown: relByGroup.unknown,
      relationsWithoutSource: sourceless, attestations: PERSON_ATTESTATIONS.length, coverageYears: COVERAGE.length
    }
  };
}
