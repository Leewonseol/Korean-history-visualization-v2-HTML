/* ==========================================================================
   validateData(data) — 재사용 가능한 데이터 무결성 검사
   브라우저(app.js 시작 시)와 Node CLI(tools/validate.mjs) 양쪽에서 사용한다.
   반환: { errors: string[], warnings: string[], warningItems, warningReport, notices: string[], stats: object, sourceUsage }
   - errors   : 데이터가 규칙을 어김(테스트 실패)
   - warnings : 확인이 필요한 상태(예: 검증 사료가 근거로 쓰이지 않음, 내용 미확인 사료 등록).
                각 경고는 {code, key}를 가지며 data/expectedWarnings.js와 대조해 expected / unexpected / stale로 나눈다.
   - notices  : 상태 안내(legacy 사료, 서지 정보만 있는 사료 등). 숨기지 않고 상태별로 알린다.
   ========================================================================== */
import {
  LEVELS, LAYERS, CERTAINTY, CAUSAL_STATUS, THEATERS, AFFILIATIONS, ENTITY_TYPES,
  MECHANISMS, OUTCOME_TYPES, SOURCE_TYPES, SOURCE_LEVELS, DOCUMENT_TYPES, VERIFICATION,
  PROVENANCE, DERIVATION_RULES, DIRECTION_POLICY, DATE_PRECISION, TIME_KIND, COVERAGE_STATUS,
  IDENTITY_STATUS, COORDINATE_STATUS, LOCATION_STATUS, NARRATIVE_STATUS, SOURCE_USAGE, evidenceStatusOf,
  evidenceClassOf, NORMALIZATION_RULES, RELATION_RULES, packLabelsOf, labelLayerCheck, CAUSAL_REQUIRES_EVIDENCE,
  COVERAGE_SCOPE, EVIDENCE_CLASS
} from "../data/vocab.js";
import { isValidDate, isValidBound, isDayPrecise, yearOf } from "./dates.js";

const WHAT_TYPES = new Set(["gain", "loss", "burden", "transfer", "recover", "claim"]);
const PARTICIPANTS = ["actors", "targets", "beneficiaries", "victims", "decisionMakers", "informationSources", "subjects"];
const NON_PRIMARY_OK = new Set(["secondary_only", "interpretation", "unverified_seed"]);
const LINK_TYPES = new Set(["causal", "same_record", "same_campaign", "reference"]);
const CAUSAL_LINK_OK = new Set(["EXPLICIT_CAUSAL"]);
const CLAIM_TYPES = new Set(["FACTUAL", "INFERRED", "NARRATIVE"]);
const LOCATOR = /^pack_v1:[A-Z0-9_]+:[A-Z0-9 /_()-]+:L\d+$/;
const evidenceOk = (ev) => ev && LOCATOR.test(ev.locator || "") && typeof ev.quote === "string" && ev.quote.length > 0;

/** 경고 목록을 허용 목록과 대조: expected / unexpected / stale */
export function classifyWarnings(items, allowlist = []) {
  const k = (x) => `${x.code}|${x.key}`;
  const allow = new Map(allowlist.map((a) => [k(a), a]));
  const seen = new Set(items.map(k));
  return {
    expected: items.filter((x) => allow.has(k(x))).map((x) => ({ ...x, reason: allow.get(k(x)).reason })),
    unexpected: items.filter((x) => !allow.has(k(x))),
    stale: allowlist.filter((a) => !seen.has(k(a)))
  };
}
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
  const { PEOPLE, PLACES, SOURCES, EVENTS, PERSON_ATTESTATIONS = [], DISCREPANCIES = [], COVERAGE = [], STORY_SCENES = [],
    RELATION_TRACES = [], EXPECTED_WARNINGS = [] } = data;
  const errors = [], warningItems = [], notices = [];
  const E = (m) => errors.push(m), N = (m) => notices.push(m);
  const W = (code, key, message) => warningItems.push({ code, key, message });

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
    if (p.entityType !== "person" && p.identityStatus !== "COLLECTIVE_OR_OFFICE") E(`${tag}: 집단·기관은 identityStatus=COLLECTIVE_OR_OFFICE`);
    if (p.entityType === "person" && p.identityStatus === "COLLECTIVE_OR_OFFICE") E(`${tag}: 개인에게 COLLECTIVE_OR_OFFICE`);
    if (["UNRESOLVED_DISTINCT"].includes(p.identityStatus) && !(p.possibleSameAs || []).length) E(`${tag}: UNRESOLVED_DISTINCT인데 possibleSameAs 없음`);
    if ((p.possibleSameAs || []).length && p.identityStatus === "VERIFIED_SAME") E(`${tag}: possibleSameAs가 있는데 VERIFIED_SAME`);
    if (p.identityStatus === "VERIFIED_SAME" && !((p.identityEvidence || []).length && p.identityEvidence.every(evidenceOk)))
      E(`${tag}: VERIFIED_SAME에는 identityEvidence(pack locator·quote) 필요`);
    if (["VERIFIED_DISTINCT"].includes(p.identityStatus) && !((p.identityEvidence || []).length && p.identityEvidence.every(evidenceOk)))
      E(`${tag}: VERIFIED_DISTINCT에는 identityEvidence 필요`);
    if (p.identityStatus === "PROBABLE_SAME" || p.identityStatus === "SINGLE_ATTESTATION") E(`${tag}: ${p.identityStatus}는 데이터에 선언하지 않음(검증 등장 수로 계산)`);
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
    if (byName[a] && !byName[a].some((q) => q.personId === p.personId)) W("ALIAS_COLLIDES_NAME", p.personId, `${p.personId}의 이명 '${a}'가 다른 인물의 대표명과 같음`);
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
    if (u.status === "VERIFIED_UNUSED") W("SOURCE_VERIFIED_UNUSED", id, `SOURCES ${id} [VERIFIED_UNUSED]: ${u.message}`);
    else if (u.status === "REGISTERED_UNCHECKED") W("SOURCE_REGISTERED_UNCHECKED", id, `SOURCES ${id} [REGISTERED_UNCHECKED]: ${u.message}`);
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
    if (rd != null && mn != null && mn > rd) W("EVENT_AFTER_RECORD", ev.id, `${tag}: dateMin(${mn})이 기사일(${rd})보다 뒤 — 예정 사항인지 확인`);
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
      if (l.linkType === "causal" && !CAUSAL_LINK_OK.has(l.causalStatus)) E(`${lt}: causal 링크인데 causalStatus='${l.causalStatus}' — EXPLICIT_CAUSAL만 허용`);
      if (l.linkType !== "causal" && CAUSAL_LINK_OK.has(l.causalStatus)) E(`${lt}: linkType '${l.linkType}'에 인과 상태 '${l.causalStatus}'`);
      if (l.causalStatus !== "UNKNOWN" && evidenceStatusOf(l.provenance) !== "verified") E(`${lt}: 검증되지 않은(${l.provenance}) 링크에 '${l.causalStatus}' — legacy 인과 승격 금지(UNKNOWN만)`);
      if (CAUSAL_REQUIRES_EVIDENCE.has(l.causalStatus) && !evidenceOk(l.causalEvidence)) E(`${lt}: ${l.causalStatus}에는 causalEvidence(pack locator·quote) 필요`);
      if (l.linkType === "reference" && !["TEMPORAL_ASSOCIATION", "UNKNOWN"].includes(l.causalStatus)) E(`${lt}: reference 링크는 TEMPORAL_ASSOCIATION/UNKNOWN만`);
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
      if (r.provenance === "pack_v1_derived" && !RELATION_RULES.includes(r.derivationRule)) E(`${rt}: pack_v1_derived인데 derivationRule '${r.derivationRule}'가 관계 규칙(R1~R6)이 아님 — R7은 시각 규칙`);
      if (r.provenance !== "pack_v1_derived" && r.derivationRule) E(`${rt}: derivationRule은 pack_v1_derived에만`);
      if (g === "verified" && evGroup !== "verified") E(`${rt}: legacy/해석 사건 안에 pack 관계 — 근거 계보 불일치`);
      const cert = r.certainty || "confirmed";
      if (!CERTAINTY[cert]) E(`${rt}: certainty '${cert}' 미정의`);
      if (r.provenance === "interpretation" && cert !== "interpretation") E(`${rt}: provenance=interpretation인데 certainty='${cert}'`);
      if (cert === "interpretation" && r.provenance !== "interpretation") E(`${rt}: certainty=interpretation인데 provenance='${r.provenance}'`);
      // 인과
      if (!hasOwn(r, "causalStatus") || r.causalStatus == null) E(`${rt}: causalStatus 없음(자동 채움 금지)`);
      else if (!CAUSAL_STATUS[r.causalStatus]) E(`${rt}: causalStatus '${r.causalStatus}' 미정의`);
      if (r.causalStatus && r.causalStatus !== "UNKNOWN" && g !== "verified") E(`${rt}: 검증되지 않은 관계에 causalStatus=${r.causalStatus}(UNKNOWN만)`);
      if (CAUSAL_REQUIRES_EVIDENCE.has(r.causalStatus) && !evidenceOk(r.causalEvidence)) E(`${rt}: ${r.causalStatus}에는 causalEvidence(pack locator·quote) 필요`);
      if (r.causalStatus === "COMMAND_RELATION" && r.layer !== "COMMAND") E(`${rt}: COMMAND_RELATION은 COMMAND layer에만`);
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

  /* ---------- 6b. 원문 추적(trace): DIRECT·NORMALIZED 관계마다 원문 줄 → 규칙 → edge ---------- */
  const traceById = new Map();
  for (const t of RELATION_TRACES) {
    if (traceById.has(t.relationId)) E(`TRACE ${t.relationId}: 중복`);
    traceById.set(t.relationId, t);
  }
  const ruleUse = {};
  for (const ev of EVENTS) (ev.relations || []).forEach((r, i) => {
    const id = `${ev.id}#${i}`, cls = evidenceClassOf(r.provenance), t = traceById.get(id);
    if (cls !== "DIRECT" && cls !== "NORMALIZED") { if (t) E(`TRACE ${id}: ${cls} 관계에 pack trace — 근거 등급 불일치`); return; }
    if (!t) return E(`TRACE ${id}: ${cls} 관계인데 원문 추적(trace) 없음`);
    if (t.normalizedSubject !== r.source || t.normalizedObject !== r.target) E(`TRACE ${id}: trace의 정규화 주체/객체(${t.normalizedSubject}→${t.normalizedObject})가 관계(${r.source}→${r.target})와 다름 — 인덱스 어긋남 의심`);
    if (!LOCATOR.test(t.locator || "") || !t.quote) E(`TRACE ${id}: locator/quote 형식 오류`);
    if (!t.sourceId || !(ev.sourceIds || []).includes(t.sourceId) || !isPack(t.sourceId)) E(`TRACE ${id}: sourceId '${t.sourceId}'가 이 사건의 pack 사료가 아님`);
    if (!t.sourceSubject || !t.sourceObject) E(`TRACE ${id}: 원문 주체/객체(sourceSubject/sourceObject) 없음`);
    (t.rules || []).forEach((x) => NORMALIZATION_RULES[x] || E(`TRACE ${id}: 규칙 '${x}' 미정의`));
    if (cls === "DIRECT" && (t.rules || []).length) E(`TRACE ${id}: DIRECT인데 규칙 ${t.rules.join("+")} 적용 — NORMALIZED여야 함`);
    if (cls === "NORMALIZED" && !(t.rules || []).length) E(`TRACE ${id}: NORMALIZED인데 적용 규칙 없음`);
    if (cls === "NORMALIZED" && !(t.rules || []).includes(r.derivationRule)) E(`TRACE ${id}: derivationRule '${r.derivationRule}'가 trace 규칙(${(t.rules || []).join("+")})에 없음`);
    if (cls === "DIRECT" && !/:RELATIONS:L/.test(t.locator)) E(`TRACE ${id}: DIRECT는 pack RELATIONS 줄이어야 함`);
    if ((t.subjectRule && !(t.rules || []).includes(t.subjectRule)) || (t.objectRule && !(t.rules || []).includes(t.objectRule))) E(`TRACE ${id}: 주체/객체 규칙이 rules에 없음`);
    if ((t.rules || []).includes("R3_who_expansion") && !(t.members || []).length) E(`TRACE ${id}: R3인데 구성원 근거(members) 없음`);
    [...(t.members || []), ...(t.support || [])].forEach((m) => evidenceOk(m) || E(`TRACE ${id}: members/support locator 형식 오류`));
    if (/:RELATIONS:L/.test(t.locator)) {
      const chk = labelLayerCheck(packLabelsOf(t.quote), r.layer);
      if (!chk.ok) E(`TRACE ${id}: layer ${r.layer}가 pack 라벨(${packLabelsOf(t.quote).join("/")})의 허용 layer(${chk.allowed.join(",")})에 없음`);
      else if (!chk.oneToOne && !(t.rules || []).includes("R6_layer_normalize")) E(`TRACE ${id}: 라벨→layer가 일대일이 아닌데 R6 미표시`);
      else if (chk.oneToOne && (t.rules || []).includes("R6_layer_normalize")) E(`TRACE ${id}: 일대일 라벨인데 R6 표시`);
    }
    for (const x of t.rules || []) ruleUse[x] = (ruleUse[x] || 0) + 1;
  });
  for (const id of traceById.keys()) {
    const [evId, i] = id.split("#");
    if (!eventsById[evId] || !(eventsById[evId].relations || [])[+i]) E(`TRACE ${id}: 해당 관계 없음`);
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
    if (!COVERAGE_SCOPE[c.scopeStatus]) E(`${tag}: scopeStatus '${c.scopeStatus}' 미정의(FULL/PARTIAL/NONE/UNKNOWN)`);
    if ((c.scopeStatus === "NONE") !== (c.coverageStatus === "NOT_COVERED")) E(`${tag}: scopeStatus NONE ⇔ NOT_COVERED 불일치`);
    if (c.scopeStatus === "PARTIAL" && !(c.scopeFrom > `${c.year}-01-01` || c.scopeTo < `${c.year}-12-30`)) E(`${tag}: PARTIAL인데 scopeFrom/scopeTo가 연도 전체`);
    if (c.scopeStatus === "FULL" && (c.scopeFrom !== `${c.year}-01-01` || c.scopeTo !== `${c.year}-12-30`)) E(`${tag}: FULL인데 범위가 연도 일부`);
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
      // claim 단위 근거
      if (!(st.claims || []).length) E(`${t}: claims 없음(normalizeScene 미적용)`);
      (st.claims || []).forEach((c, j) => {
        const ct = `${t} claim#${j}`;
        if (!c.text) E(`${ct}: text 없음`);
        if (!EVIDENCE_CLASS[c.evidenceClass]) E(`${ct}: evidenceClass '${c.evidenceClass}' 미정의`);
        if (!CLAIM_TYPES.has(c.claimType)) E(`${ct}: claimType '${c.claimType}' 미정의(FACTUAL/INFERRED/NARRATIVE)`);
        if (!CERTAINTY[c.certainty]) E(`${ct}: certainty '${c.certainty}' 미정의`);
        if (c.claimType === "NARRATIVE" && c.evidenceClass !== "INTERPRETATION") E(`${ct}: NARRATIVE claim은 INTERPRETATION`);
        if (c.claimType === "INFERRED" && !["NORMALIZED", "INTERPRETATION"].includes(c.evidenceClass)) E(`${ct}: INFERRED claim은 NORMALIZED 또는 INTERPRETATION`);
        if (c.evidenceClass === "INTERPRETATION" && c.certainty !== "interpretation") E(`${ct}: 해석 claim의 certainty는 interpretation`);
        if (!(c.eventIds || []).length || !(c.sourceIds || []).length) E(`${ct}: eventIds/sourceIds 없음`);
        (c.eventIds || []).forEach((e) => (st.eventIds || []).includes(e) || E(`${ct}: eventId '${e}'가 문장 근거 밖`));
        (c.sourceIds || []).forEach((x) => (st.sourceIds || []).includes(x) || E(`${ct}: sourceId '${x}'가 문장 근거 밖`));
        if (["DIRECT", "NORMALIZED"].includes(c.evidenceClass) && (c.eventIds || []).some((e) => eventsById[e] && evidenceStatusOf(eventsById[e].provenance) !== "verified")) E(`${ct}: 검증 claim이 legacy 사건 인용`);
        if (c.evidenceClass === "LEGACY" && evidenceClassOf(st.provenance) === "DIRECT") E(`${ct}: legacy claim이 직접 근거 문장 안에 있음`);
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
  PEOPLE.forEach((p) => usedP.has(p.personId) || W("PERSON_UNUSED", p.personId, `PEOPLE ${p.personId}: 어떤 사건에도 등장하지 않음`));
  PLACES.forEach((p) => usedPl.has(p.placeId) || PLACES.some((q) => q.parentPlaceId === p.placeId) || W("PLACE_UNUSED", p.placeId, `PLACES ${p.placeId}: 사용되지 않음`));

  const warnings = warningItems.map((w) => w.message);
  const warningReport = classifyWarnings(warningItems, EXPECTED_WARNINGS);
  const relClass = { DIRECT: 0, NORMALIZED: 0, LEGACY: 0, INTERPRETATION: 0, UNKNOWN: 0 };
  EVENTS.forEach((ev) => (ev.relations || []).forEach((r) => relClass[evidenceClassOf(r.provenance)]++));
  return {
    errors, warnings, warningItems, warningReport, notices, sourceUsage: usage, ruleUse,
    stats: {
      people: PEOPLE.length, places: PLACES.length, sources: SOURCES.length, events: EVENTS.length,
      relations: relCount, relationsVerified: relByGroup.verified, relationsLegacy: relByGroup.legacy,
      relationsInterpretation: relByGroup.interpretation, relationsUnknown: relByGroup.unknown,
      relationsDirect: relClass.DIRECT, relationsNormalized: relClass.NORMALIZED,
      relationsWithoutSource: sourceless, relationsWithTrace: RELATION_TRACES.length,
      attestations: PERSON_ATTESTATIONS.length, coverageYears: COVERAGE.length
    }
  };
}
