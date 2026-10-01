/* ==========================================================================
   EVENTS — 단일 source of truth. 네트워크 edge는 EVENTS[*].relations 에서만 파생된다.

   historical ground truth = 사용자 제공 VALIDATED HISTORICAL SOURCE PACK v1.
   v2 데이터는 legacy(inherited_v2)로만 남기며 검증 데이터로 승격하지 않는다.

   ── 레코드 근거(provenance, vocab.PROVENANCE) ──
     pack_v1_direct / pack_v1_derived(+derivationRule) / inherited_v2 / legacy_anchor_seed / interpretation
   ── 날짜 ──
     사건: dateMin·dateMax(null = 그 쪽 경계 미상), datePrecision(DAY/MONTH/YEAR/UNKNOWN), recordDate(기사일), dateBasis
     관계: dateMin·dateMax·timeKind(instant: 범위 안의 미상 한 시점 / duration: 기간 전체 지속)
     경계 표기: 월 단위 'YYYY-MM-00'~'YYYY-MM-99', 연 단위 'YYYY-00-00'~'YYYY-99-99'
   ── 인과 ──
     relation.causalStatus 기본값은 'unknown'. pack 문장이 직접 연결할 때만 explicit.
     사건 사이 연결은 eventLinks(linkType: causal / same_record / same_campaign / reference).
     시간 선후만으로 링크를 만들지 않는다.
   ── 경로 역할 ──
     pathEligible:false = '~에 관한' 관계(주장 대상 등). 시각화에는 보이지만 경로·중심성 계산에서 제외.
   ========================================================================== */

const PD = "pack_v1_direct", PV = "pack_v1_derived", L2 = "inherited_v2", SEED = "legacy_anchor_seed", INT = "interpretation";

function r(source, target, layer, relationType, o) {
  return { source, target, layer, relationType, certainty: "confirmed", causalStatus: "unknown", direction: "directed", pathEligible: true, ...o };
}
const p = (o = {}) => ({ provenance: PD, ...o });
const d = (rule, o = {}) => ({ provenance: PV, derivationRule: rule, ...o });
const leg = (o = {}) => ({ provenance: L2, ...o });
const interp = (o = {}) => ({ provenance: INT, certainty: "interpretation", ...o });

// 시각 도우미
const AT = (dt) => ({ dateMin: dt, dateMax: dt, timeKind: "instant" });
const BEFORE = (dt) => ({ dateMin: null, dateMax: dt, timeKind: "instant" });       // 기사일 이전 미상 시점
const RANGE = (a, b, timeKind = "instant") => ({ dateMin: a, dateMax: b, timeKind });
const UNKNOWN_T = { dateMin: null, dateMax: null, timeKind: "instant" };

// 사건 날짜 도우미
const DAY = (dt, basis = "pack_event_date") => ({ dateMin: dt, dateMax: dt, datePrecision: "DAY", recordDate: dt, dateBasis: basis });
const COURT = (dt) => DAY(dt, "court_act_on_record_date");                       // 조정 행위: 기사일 = 행위일(관례 R8)
const BEFORE_RECORD = (rec) => ({ dateMin: null, dateMax: rec, datePrecision: "UNKNOWN", recordDate: rec, dateBasis: "before_record_date" });

const BASE = {
  theater: [], theaterBasis: "pack_derived", placeIds: [], locationNote: "",
  actors: [], targets: [], beneficiaries: [], victims: [], decisionMakers: [], informationSources: [], subjects: [],
  what: [], mechanisms: [], outcomes: [], relations: [], sourceIds: [], relatedSourceIds: [],
  embeddedDocumentAuthor: null, documentType: null, evidenceSummary: "", discrepancies: [],
  certainty: "confirmed", storyWeight: 1, provenance: PD, eventLinks: []
};
function ev(o) { return { ...BASE, ...o }; }
const W = (type, value, giverId, receiverId, quantity = null, unit = null) => ({ type, value, quantity, unit, giverId, receiverId });
const O = (type, description, extra = {}) => ({ type, description, ...extra });
const JR = "조선 측 보고";

export const EVENTS = [
  /* ============================== 1432 ============================== */
  ev({
    id: "E1432_1209", title: "여연 침입과 박초의 추격",
    ...BEFORE_RECORD("1432-12-09"),
    theater: ["AMNOK"], theaterBasis: "pack_explicit", placeIds: ["PL_YEOYEON", "PL_GANGGYE"],
    actors: ["GRP_1432_RAIDERS", "JO_PARKCHO"], targets: ["GRP_1432_YEOYEON_RESIDENTS"],
    victims: ["GRP_1432_YEOYEON_RESIDENTS", "GRP_1432_YEOYEON_GARRISON"], informationSources: ["ORG_PYEONGAN_GAMSA"],
    what: [
      W("loss", "사람·재물 약탈", "GRP_1432_YEOYEON_RESIDENTS", "GRP_1432_RAIDERS"),
      W("recover", "피로인", "GRP_1432_RAIDERS", "JO_PARKCHO", 26, "명"),
      W("recover", "말", "GRP_1432_RAIDERS", "JO_PARKCHO", 30, "필"),
      W("recover", "소", "GRP_1432_RAIDERS", "JO_PARKCHO", 50, "마리")
    ],
    mechanisms: ["battle", "pursuit", "report"],
    outcomes: [
      O("killed", "조선 측 사망", { subjectId: "GRP_1432_YEOYEON_GARRISON", quantity: 13, unit: "명", reportedBy: JR }),
      O("wounded", "화살 부상", { subjectId: "GRP_1432_YEOYEON_GARRISON", quantity: 25, unit: "명", reportedBy: JR }),
      O("recovered", "피로인 26·말 30·소 50 탈환", { subjectId: "GRP_1432_YEOYEON_RESIDENTS", quantity: 26, unit: "명", reportedBy: JR }),
      O("withdrawal", "날이 저물어 추격 중지", { subjectId: "JO_PARKCHO" })
    ],
    relations: [
      r("GRP_1432_RAIDERS", "GRP_1432_YEOYEON_RESIDENTS", "MILITARY_CONFLICT", "raid", p({ ...BEFORE("1432-12-09"), note: "pack: 야인 -> 여연 주민 MILITARY_ATTACK(layer 정규화 R6)" })),
      r("JO_PARKCHO", "GRP_1432_RAIDERS", "MILITARY_CONFLICT", "pursue_and_engage", p({ ...BEFORE("1432-12-09") })),
      r("JO_PARKCHO", "GRP_1432_YEOYEON_RESIDENTS", "MILITARY_ACTION", "recover_and_protect_captives", p({ ...BEFORE("1432-12-09") })),
      r("ORG_PYEONGAN_GAMSA", "JO_SEJONG", "REPORT", "frontier_report", d("R1_court_recipient", { ...AT("1432-12-09"), note: "pack WHO: 평안도 감사(보고 주체, 실명 미기재). 수신자=조정 → 세종(R1), 시각=기사일(R7)." }))
    ],
    sourceIds: ["SRC_1432_1209"],
    evidenceSummary: "약 400기의 야인이 여연에 들어와 사람과 재물을 빼앗았다. 강계절제사 박초가 추격해 피로인 26명, 말 30필, 소 50마리를 되찾았고, 조선 측은 13명 사망, 25명 화살 부상. 날이 저물어 추격을 멈췄다(평안도 감사 보고). 침입·추격 일자는 기사에 없어 '기사일 이전'으로만 둔다. 수치는 조선 측 보고.",
    discrepancies: ["D01", "D14"], storyWeight: 3
  }),
  ev({
    id: "E1432_1211", title: "여연 침입 직후 화포·방어시설 논의",
    ...COURT("1432-12-11"),
    theater: ["CENTRAL"], theaterBasis: "pack_explicit", placeIds: ["PL_HANSEONG"],
    actors: ["JO_SEJONG", "JO_CHOEYUNDEOK", "JO_HEOJO", "JO_HAGYEONGBOK", "JO_JEONGHEUMJI", "JO_JOMALSAENG", "JO_LEECHEON", "JO_CHOEHAESAN", "JO_ANSUNGSEON"],
    decisionMakers: ["JO_SEJONG"],
    what: [
      W("transfer", "화포 사용법 교습 관원·장인 우선 파견, 철환 지급 건의", "JO_LEECHEON", "JO_SEJONG"),
      W("transfer", "방어처의 석성 또는 목책 축조 논의", null, "JO_SEJONG")
    ],
    mechanisms: ["policy_deliberation"],
    outcomes: [O("policy_change", "여연·강계에 배치된 화포 활용, 교습·철환 공급, 석성·목책 방안 논의(결정 내용은 pack 미기재)")],
    relations: [
      ...["JO_CHOEYUNDEOK", "JO_HEOJO", "JO_HAGYEONGBOK", "JO_JEONGHEUMJI", "JO_JOMALSAENG", "JO_LEECHEON", "JO_CHOEHAESAN", "JO_ANSUNGSEON"]
        .map((x) => r("JO_SEJONG", x, "POLICY", "consult", d("R3_who_expansion", { note: "pack: 세종 -> listed ministers/generals : POLICY_CONSULTATION" }))),
      r("JO_LEECHEON", "JO_SEJONG", "POLICY", "advise_firearms_training", p()),
      r("JO_CHOEHAESAN", "JO_SEJONG", "POLICY", "advise_firearms_training", p({ note: "pack: MILITARY_TECH_ADVICE" })),
      r("JO_JEONGHEUMJI", "JO_SEJONG", "POLICY", "advise_firearms_training", d("R5_content_actor", { note: "pack WHAT: 'Yi Cheon, Choe Hae-san, Jeong Heum-ji and others argued…'" })),
      r("JO_CHOEYUNDEOK", "JO_SEJONG", "POLICY", "advise", p())
    ],
    sourceIds: ["SRC_1432_1211"],
    evidenceSummary: "여연 침입 이틀 뒤 화포·축성·훈련 논의. 이천·최해산·정흠지 등은 먼저 관원·장인을 보내 화포 쓰는 법을 가르치고 철환을 공급하자고 했고, 방어처의 석성/목책도 논의되었다. pack은 '이천은 이미 이때 북방 방어 정책 네트워크 안에 있다'고 적는다.",
    eventLinks: [{ eventId: "E1432_1209", linkType: "reference", causalStatus: "sequence_only", provenance: PV,
      note: "pack 제목 'immediately after Yŏyŏn invasion' — 선후·언급 관계일 뿐 인과로 저장하지 않음" }],
    storyWeight: 2
  }),
  ev({
    id: "E1432_INVEST", title: "홍사석의 현장 조사(12/21 기사에 '돌아올 조사관'으로 언급)",
    dateMin: null, dateMax: "1432-12-21", datePrecision: "UNKNOWN", recordDate: "1432-12-21", dateBasis: "before_record_date",
    provenance: PV, theater: ["UNSPECIFIED"], theaterBasis: "pack_derived", placeIds: [], locationNote: "조사 지역은 pack에 없음(v2는 강계·여연).",
    actors: ["JO_HONGSASEOK"], subjects: ["JO_SEJONG"],
    what: [W("transfer", "현장 조사 임무", null, "JO_HONGSASEOK")],
    mechanisms: ["investigation"],
    outcomes: [O("investigation", "12월 21일 시점에 홍사석이 돌아올 조사관으로 언급됨")],
    relations: [r("JO_SEJONG", "JO_HONGSASEOK", "INVESTIGATION", "dispatch_to_investigate",
      leg({ ...BEFORE("1432-12-21"), note: "파견 명령 주체·날짜는 v2 근거. pack은 조사관이었다는 사실만 지지." }))],
    sourceIds: ["SRC_1432_1221"],
    evidenceSummary: "pack v1(12/21 기사)은 홍사석을 '돌아올 조사관'으로 언급할 뿐이다. 누가 언제 보냈는지는 pack에 없어 파견 관계는 legacy로만 남긴다(D15).",
    discrepancies: ["D15"], storyWeight: 1
  }),
  ev({
    id: "E1432_1221", title: "이만주 측 주장과 조정의 진위·책임 논의",
    ...COURT("1432-12-21"),
    theater: ["CENTRAL"], placeIds: ["PL_HANSEONG"],
    actors: ["JZ_YUEULHAP", "JZ_MANJU", "JO_SEJONG"], targets: ["JO_SEJONG"],
    informationSources: ["JZ_YEODUN"], beneficiaries: ["GRP_1432_YEOYEON_RESIDENTS"],
    decisionMakers: ["JO_SEJONG"], subjects: ["GRP_HOLLAON", "JO_HONGSASEOK"],
    what: [
      W("transfer", "조선인 피로인 송환", "JZ_YUEULHAP", "JO_SEJONG", 7, "명"),
      W("claim", "침입자는 홀라온 우디거이며 이만주가 약 600명을 모아 요격해 피로인을 되찾았다는 주장", "JZ_MANJU", "JO_SEJONG", 600, "명(주장)")
    ],
    mechanisms: ["envoy", "claim", "policy_deliberation", "investigation"],
    outcomes: [
      O("recovered", "피로인 7명 송환", { subjectId: "GRP_1432_YEOYEON_RESIDENTS", quantity: 7, unit: "명" }),
      O("claim_made", "이만주 측: 공격 주체는 홀라온 우디거", { subjectId: "JZ_MANJU", certainty: "contemporary_claim" }),
      O("unresolved", "조정이 주장의 진위(사실/날조)를 명시적으로 논쟁")
    ],
    relations: [
      r("JZ_YUEULHAP", "JO_SEJONG", "DIPLOMACY", "return_captives_and_convey_claim", d("R1_court_recipient", { note: "pack: 유을합 -> 조선 : CLAIM / DIPLOMACY" })),
      r("JZ_MANJU", "JO_SEJONG", "COUNTER_CLAIM", "deny_and_attribute_raid_to_hollaon", d("R1_court_recipient", { certainty: "contemporary_claim", note: "pack: 이만주 -> 조선 : COUNTER_CLAIM" })),
      ...["JO_ANSUNGSEON", "JO_KIMJONGSEO", "JO_ANSUN", "JO_HAGYEONGBOK", "JO_HWANGHUI", "JO_HEOJO", "JO_SINJANG", "JO_KIMIKJEONG",
          "JO_SEONGEOK", "JO_JEONGYEON", "JO_JOGYESAENG", "JO_LEEMAENGGYUN", "JO_JOMALSAENG"]
        .map((x) => r("JO_SEJONG", x, "POLICY", "deliberate_truth_and_responsibility",
          d("R3_who_expansion", { direction: "undirected", directionEvidence: "pack v1: '세종 <-> 대신들 : INVESTIGATION / DELIBERATION'" })))
    ],
    sourceIds: ["SRC_1432_1221"],
    evidenceSummary: "이만주 관하 천호 유을합이 피로인 7명을 데려왔다. 이만주 측은 홀라온 우디거가 공격했고 이만주가 약 600명으로 요격해 피로인을 되찾았다고 주장했다. 조정은 이 주장이 사실인지 날조인지 명시적으로 논쟁했다. 이 주장은 확정 사실이 아니다.",
    discrepancies: ["D01"], certainty: "disputed", storyWeight: 3
  }),

  /* ============================== 1433 ============================== */
  ev({
    id: "E1433_0215", title: "파저강 처리 방식에 대한 비밀 의견 수렴",
    ...COURT("1433-02-15"),
    theater: ["CENTRAL"], placeIds: ["PL_HANSEONG"],
    actors: ["JO_SEJONG", "JO_HWANGHUI", "JO_GWONJIN", "JO_HEOJO"], decisionMakers: ["JO_SEJONG"], subjects: ["JO_CHOEYUNDEOK"],
    what: [W("transfer", "파저강 처리·문죄 문구·정벌 여부에 대한 의견", null, "JO_SEJONG")],
    mechanisms: ["policy_deliberation"],
    outcomes: [O("unresolved", "책임 소재·지리·군사 위험·증거 충분성을 두고 대신들 견해가 갈림")],
    relations: [
      ...["JO_HWANGHUI", "JO_GWONJIN", "JO_HEOJO"].flatMap((x) => [
        r("JO_SEJONG", x, "POLICY", "secret_query", d("R3_who_expansion", { note: "pack: 세종 -> central officials : POLICY_QUERY" })),
        r(x, "JO_SEJONG", "POLICY", "advise", d("R3_who_expansion", { note: "pack: officials -> 세종 : POLICY_ADVICE" }))]),
      ...["JO_MAENGSASEONG", "JO_ANSUN", "JO_JEONGHEUMJI", "JO_LEESUNMONG", "JO_CHOESAGANG"].flatMap((x) => [
        r("JO_SEJONG", x, "POLICY", "secret_query", leg({ note: "이 인물의 참여는 v2 요약에만 있음" })),
        r(x, "JO_SEJONG", "POLICY", "advise", leg({ note: "이 인물의 참여는 v2 요약에만 있음" }))])
    ],
    sourceIds: ["SRC_1433_0215"],
    evidenceSummary: "세종이 파저강 여진 처리, 문죄 문구, 정벌 여부를 비밀리에 물었고 대신들은 책임, 지리, 군사 위험, 증거 충분성을 두고 의견이 갈렸다. pack은 황희·권진·허조를 명시하고 '그 밖의 대신·무관'이라 한다. 최윤덕은 변경 지휘관으로 언급.",
    storyWeight: 2
  }),
  ev({
    id: "E1433_0226", title: "정벌 결정 후 지휘체계 논의",
    ...COURT("1433-02-26"),
    theater: ["CENTRAL"], placeIds: ["PL_HANSEONG"],
    actors: ["JO_SEJONG", "JO_LEESUNMONG"], subjects: ["ORG_UIJEONGBU", "ORG_YUKJO", "ORG_SAMGUN_DOJINMU"], targets: ["JO_CHOEYUNDEOK"], decisionMakers: ["JO_SEJONG"],
    what: [W("transfer", "중군 지휘와 좌·우군 통솔권(논의)", "JO_SEJONG", "JO_CHOEYUNDEOK")],
    mechanisms: ["policy_deliberation", "appointment"],
    outcomes: [
      O("decision", "정벌은 이미 결정. 대체로 최윤덕을 중군 지휘관으로 하여 좌·우군을 통솔하게 하자는 의견"),
      O("unresolved", "이순몽은 별도의 총지휘관을 두자고 주장")
    ],
    relations: [
      r("JO_SEJONG", "JO_CHOEYUNDEOK", "COMMAND", "design_command_authority", p({ note: "pack: 세종 -> 최윤덕 : COMMAND_DESIGN" })),
      r("JO_LEESUNMONG", "JO_SEJONG", "POLICY", "dissent_separate_supreme_commander", p({ note: "pack: 이순몽 -> 세종 : POLICY_DISAGREEMENT" })),
      ...["ORG_UIJEONGBU", "ORG_YUKJO", "ORG_SAMGUN_DOJINMU"].map((x) =>
        r(x, "JO_SEJONG", "POLICY", "advise_command_structure", interp({ note: "pack은 'General preference'의 주체를 특정하지 않음(관계: court actors : MILITARY_ORGANIZATION). 기관별 자문 관계는 해석." })))
    ],
    sourceIds: ["SRC_1433_0226"],
    evidenceSummary: "조정은 이미 정벌을 결정했고, 군 편성과 최윤덕의 지휘권을 논의했다. 대체로 최윤덕이 중군으로 좌·우군을 통솔하자는 쪽이었고 이순몽은 별도 총지휘관을 주장했다. 의정부·육조·삼군 도진무는 기사에 등장한다.",
    storyWeight: 3
  }),
  ev({
    id: "E1433_0307", title: "최윤덕: 3,000명은 부족, 1만 이상 필요",
    ...COURT("1433-03-07"),
    theater: ["CENTRAL"], placeIds: ["PL_HANSEONG"],
    actors: ["JO_CHOEYUNDEOK", "JO_CHOECHIUN"], targets: ["JO_SEJONG"],
    what: [W("transfer", "작전계획: 3,000명 부족, 여러 진로, 1만 명 이상 필요", "JO_CHOEYUNDEOK", "JO_SEJONG", 10000, "명 이상(건의)")],
    mechanisms: ["proposal", "report"],
    outcomes: [O("report_filed", "병력 증원·다로 진격 건의(채택 여부는 pack 미기재)")],
    relations: [
      r("JO_CHOEYUNDEOK", "JO_CHOECHIUN", "REPORT", "entrust_plan", d("R2_carrier_split", { ...BEFORE("1433-03-07"), note: "pack: 'submitted operational plan via Choe Chi-un'" })),
      r("JO_CHOECHIUN", "JO_SEJONG", "REPORT", "carry_report", d("R1_court_recipient", { note: "pack: 최치운 -> court : REPORT_CARRIER" })),
      r("JO_CHOEYUNDEOK", "JO_SEJONG", "POLICY", "military_advice_troop_strength", p({ note: "pack: 최윤덕 -> 세종 : MILITARY_ADVICE" }))
    ],
    sourceIds: ["SRC_1433_0307"], embeddedDocumentAuthor: "JO_CHOEYUNDEOK",
    evidenceSummary: "최윤덕이 최치운을 통해 작전계획을 올려, 3,000명으로는 부족하고 여러 진로로 나아가야 하며 1만 명 이상이 필요하다고 했다. 인용 문서 유형은 pack 미기재.",
    storyWeight: 2
  }),
  ev({
    id: "E1433_0310", title: "성죄방목 작성과 공식 문죄(legacy)",
    ...DAY("1433-03-10", "legacy_record_date"), provenance: L2, theaterBasis: "legacy",
    theater: ["CENTRAL"], placeIds: ["PL_HANSEONG"],
    actors: ["JO_SEJONG", "JO_ANSUNGSEON", "JO_KIMCHEONG"], targets: ["JZ_MANJU", "JZ_SIMTANAPNO"], decisionMakers: ["JO_SEJONG"],
    what: [W("claim", "파저강 세력이 홀라온으로 가장해 강계·여연을 침범했다는 공식 죄목", "JO_SEJONG", "JZ_MANJU")],
    mechanisms: ["accusation", "proclamation"],
    outcomes: [O("claim_made", "조선의 공식 죄목 제기(내용의 진위는 별개)", { subjectId: "JO_SEJONG" })],
    relations: [
      r("JO_ANSUNGSEON", "JO_SEJONG", "POLICY", "draft_document", leg()),
      r("JO_KIMCHEONG", "JO_SEJONG", "POLICY", "draft_document", leg()),
      r("JO_SEJONG", "JZ_MANJU", "CLAIM", "official_accusation", leg({ pathEligible: false, note: "문죄 대상(about). 문죄문이 이만주에게 전달되었는지는 미기재." })),
      r("JO_SEJONG", "JZ_SIMTANAPNO", "CLAIM", "official_accusation", leg({ pathEligible: false }))
    ],
    sourceIds: ["SRC_1433_0310"],
    evidenceSummary: "(v2) 안숭선·김청이 성죄방목을 작성했다. pack v1에 이 기사는 없다.",
    eventLinks: [{ eventId: "E1432_1209", linkType: "reference", causalStatus: "unknown", provenance: L2, note: "죄목이 강계·여연 침범을 직접 거론(v2 요약). v2는 인과(causedBy, explicit)로 기록했으나 pack v1에 없는 기사라 인과로 승격하지 않음(언급 관계로만 보존)" }],
    discrepancies: ["D01"], storyWeight: 1
  }),
  ev({
    id: "E1433_0325", title: "가담 여부에 따른 조건부 공격 지시(맹가첩목아)",
    ...COURT("1433-03-25"),
    theater: ["CENTRAL"], placeIds: ["PL_HANSEONG"],
    actors: ["JO_SEJONG"], targets: ["JO_CHOEYUNDEOK"], subjects: ["JZ_MENGGETEMUR"], decisionMakers: ["JO_SEJONG"],
    what: [W("transfer", "교전 규칙: 적을 도우면 공격 가능, 돕지 않고 진심으로 귀순하면 죽이지 말 것", "JO_SEJONG", "JO_CHOEYUNDEOK")],
    mechanisms: ["royal_order"],
    outcomes: [O("policy_change", "가담/불가담을 명시적으로 구분하는 표적 기준")],
    relations: [
      r("JO_SEJONG", "JO_CHOEYUNDEOK", "COMMAND", "secret_conditional_targeting_order", p()),
      r("JO_SEJONG", "JZ_MENGGETEMUR", "POLICY", "conditional_target_status", p({ pathEligible: false,
        note: "pack: CONDITIONAL_TARGET_STATUS. 맹가첩목아에게 전달된 통보가 아니라 지시 속 지위 규정(about) — 경로·중심성 제외." }))
    ],
    sourceIds: ["SRC_1433_0325"],
    evidenceSummary: "세종이 최윤덕에게 비밀 지시: 맹가첩목아가 표적 세력을 도우면 공격해도 되지만, 돕지 않고 진심으로 귀순하면 죽이지 말라.",
    storyWeight: 2
  }),
  ev({
    id: "E1433_0410", title: "정벌군 강계 집결과 7개 부대 편성",
    ...DAY("1433-04-10"), recordDate: "1433-05-07",
    theater: ["AMNOK"], placeIds: ["PL_GANGGYE", "PL_PYEONGAN", "PL_HWANGHAE"],
    actors: ["JO_CHOEYUNDEOK", "JO_LEESUNMONG", "JO_CHOEHAESAN", "JO_LEEGAK", "JO_LEEJINGSEOK", "JO_KIMHYOSEONG", "JO_HONGSASEOK"],
    targets: ["GRP_1433_EXPEDITION_TROOPS"], decisionMakers: ["JO_CHOEYUNDEOK"],
    what: [
      W("burden", "평안도 정군(기병·보병) 동원", "GRP_1433_EXPEDITION_TROOPS", null, 10000, "명"),
      W("burden", "황해도군 동원", "GRP_1433_EXPEDITION_TROOPS", null, 5000, "명"),
      W("transfer", "부대별 병력: 최윤덕 2,599 · 이순몽 2,515 · 최해산 2,070 · 이각 1,770 · 이징석 3,010 · 김효성 1,888 · 홍사석 1,110", "JO_CHOEYUNDEOK", null, 14962, "명(부대별 합)")
    ],
    mechanisms: ["mobilization", "appointment"],
    outcomes: [O("movement", "강계 집결, 7개 부대 편성", { subjectId: "GRP_1433_EXPEDITION_TROOPS", quantity: 15000, unit: "명", reportedBy: JR })],
    relations: [
      ...["JO_LEESUNMONG", "JO_CHOEHAESAN", "JO_LEEGAK", "JO_LEEJINGSEOK", "JO_KIMHYOSEONG", "JO_HONGSASEOK"]
        .map((x) => r("JO_CHOEYUNDEOK", x, "COMMAND", "assign_column_command", d("R3_who_expansion", { note: "pack: 최윤덕 -> six subordinate columns : COMMAND" }))),
      r("JO_CHOEYUNDEOK", "GRP_1433_EXPEDITION_TROOPS", "COMMAND", "command_expedition_army",
        interp({ note: "총지휘관과 동원 군사의 지휘관계(pack 미기재, 편집자 해석)." }))
    ],
    sourceIds: ["SRC_1433_0507"],
    evidenceSummary: "평안도 정군 1만과 황해도군 5천을 동원해 7개 부대로 편성(5월 7일 보고 기사, 집결일 4/10). 부대별 합계 14,962명과 총 15,000명의 차이는 D07.",
    discrepancies: ["D07", "D13"], storyWeight: 3
  }),
  ev({
    id: "E1433_0419", title: "제1차 파저강 정벌: 각 부대의 거주지 공격",
    dateMin: "1433-04-10", dateMax: "1433-04-19", datePrecision: "DAY", recordDate: "1433-05-07", dateBasis: "pack_event_range",
    dateNote: "pack: 'attack completed around 1433-04-19' — 종료일은 근사",
    theater: ["AMNOK"],
    placeIds: ["PL_CHAERI_IMANJU", "PL_GEOYEO", "PL_MACHEON", "PL_OLLA", "PL_CHAERI_IMHALA_PARENTS", "PL_PALLISU", "PL_CHAERI_IMHALA"],
    actors: ["JO_CHOEYUNDEOK", "JO_LEESUNMONG", "JO_KIMHYOSEONG", "JO_CHOEHAESAN", "JO_LEEGAK", "JO_LEEJINGSEOK", "JO_HONGSASEOK"],
    subjects: ["JZ_MANJU", "JZ_IMHALA"], victims: ["GRP_1433_EXPEDITION_TROOPS"],
    what: [W("loss", "피살·피로·재산 탈취(부대별 수치는 조선 측 보고, pack에 개별 수치 미전재)", null, null)],
    mechanisms: ["battle"],
    outcomes: [
      O("victory", "부대별로 상당한 살상·포획·재산 탈취를 보고", { reportedBy: JR }),
      O("killed", "최윤덕 부대 조선 측 사망", { subjectId: "GRP_1433_EXPEDITION_TROOPS", quantity: 4, unit: "명", reportedBy: JR }),
      O("wounded", "최윤덕 부대 조선 측 부상", { subjectId: "GRP_1433_EXPEDITION_TROOPS", quantity: 20, unit: "명", reportedBy: JR }),
      O("wounded", "김효성·홍사석 부대도 부상자 보고(수 pack 미전재)", { reportedBy: JR })
    ],
    relations: [
      r("JO_LEESUNMONG", "JZ_MANJU", "MILITARY_CONFLICT", "attack_settlement", leg({ ...RANGE("1433-04-10", "1433-04-19"), note: "부대↔대상 대응은 v2. pack은 'commanders -> target settlements : MILITARY_ACTION'만 기록." })),
      r("JO_KIMHYOSEONG", "JZ_IMHALA", "MILITARY_CONFLICT", "attack_settlement_of_kin", leg({ ...RANGE("1433-04-10", "1433-04-19"), note: "v2 대응. '임합라 부모의 채리'(pack 지명)." })),
      r("JO_CHOEYUNDEOK", "JZ_IMHALA", "MILITARY_CONFLICT", "attack_settlement", leg({ ...RANGE("1433-04-10", "1433-04-19"), note: "v2 대응." }))
    ],
    sourceIds: ["SRC_1433_0507"],
    evidenceSummary: "목표 지점(pack PLACES): 이만주 채리, 거여, 마천, 올라, 임합라 부모 채리, 팔리수, 임합라 채리. 각 부대가 살상·포획·재산 탈취를 보고했고 최윤덕 부대는 조선 측 사망 4·부상 20. 모든 수치는 조선 지휘부 보고. pack은 어느 부대가 어느 거주지를 쳤는지 대응시키지 않으므로 인물↔인물 공격 관계는 legacy로만 남긴다. 이만주의 항복 서술 없음.",
    eventLinks: [{ eventId: "E1433_0410", linkType: "same_record", causalStatus: "unknown", provenance: PV, note: "같은 5/7 보고 기사의 집결·공격" }],
    discrepancies: ["D07", "D12", "D13"], storyWeight: 3
  }),
  ev({
    id: "E1433_0507", title: "최윤덕의 정벌 결과 보고(박호문 편)",
    ...DAY("1433-05-07", "report_receipt_on_record_date"),
    theater: ["CENTRAL", "AMNOK"], placeIds: ["PL_HANSEONG"],
    actors: ["JO_CHOEYUNDEOK", "JO_PARKHOMUN"], targets: ["JO_SEJONG"], informationSources: ["JO_CHOEYUNDEOK"],
    what: [W("transfer", "부대별 병력·진로·전과·사상자 보고", "JO_CHOEYUNDEOK", "JO_SEJONG")],
    mechanisms: ["report"],
    outcomes: [O("report_filed", "정벌 결과 보고 접수(수치는 조선 측 보고)", { subjectId: "JO_CHOEYUNDEOK" })],
    relations: [
      r("JO_CHOEYUNDEOK", "JO_PARKHOMUN", "REPORT", "entrust_battle_report", d("R2_carrier_split", { ...BEFORE("1433-05-07"), note: "pack: REPORTER 최윤덕, via 박호문" })),
      r("JO_PARKHOMUN", "JO_SEJONG", "REPORT", "carry_battle_report", d("R1_court_recipient", { note: "pack: 박호문 -> court : REPORT" }))
    ],
    sourceIds: ["SRC_1433_0507"], embeddedDocumentAuthor: "JO_CHOEYUNDEOK",
    evidenceSummary: "보고자는 최윤덕, 전달자는 박호문. 박호문→조정 보고의 시각은 기사일(R7).",
    eventLinks: [{ eventId: "E1433_0419", linkType: "same_record", causalStatus: "unknown", provenance: PV, note: "이 보고가 정벌을 기록" }],
    discrepancies: ["D07"], storyWeight: 3
  }),
  ev({
    id: "E1433_0511", title: "정벌 이유의 중외 포고 건의·승인(legacy)",
    ...DAY("1433-05-11", "legacy_record_date"), provenance: L2, theaterBasis: "legacy",
    theater: ["CENTRAL"], placeIds: ["PL_HANSEONG"],
    actors: ["ORG_YEJO", "JO_SEJONG"], decisionMakers: ["JO_SEJONG"],
    what: [W("transfer", "농번기 대군 동원 이유 공표안", "ORG_YEJO", "JO_SEJONG")],
    mechanisms: ["proposal", "proclamation"],
    outcomes: [O("proclamation", "(v2) 중외 포고 건의를 세종이 승인")],
    relations: [r("ORG_YEJO", "JO_SEJONG", "POLICY", "propose_proclamation", leg())],
    sourceIds: ["SRC_1433_0511"],
    evidenceSummary: "(v2) 예조가 농사철 대군 동원의 이유를 중외에 포고하자고 건의, 세종 승인. pack v1에 없음."
  }),
  ev({
    id: "E1433_0516A", title: "정벌 공로에 따른 관직 제수",
    ...COURT("1433-05-16"),
    theater: ["CENTRAL"], placeIds: ["PL_HANSEONG"],
    actors: ["JO_SEJONG"], decisionMakers: ["JO_SEJONG"],
    targets: ["JO_CHOEYUNDEOK", "JO_LEESUNMONG", "JO_LEEGAK", "JO_LEEJINGSEOK", "JO_KIMHYOSEONG", "JO_HONGSASEOK"],
    subjects: ["JO_GWONJIN", "JO_ANSUN", "JO_LEESUKCHI", "JO_PARKANSIN", "JO_NAMJI", "JO_LEESAGWAN", "JO_GWONBOK", "JO_ANGUGYEONG", "JO_HEOJO", "JO_MAENGSASEONG", "JO_KIMJONGSEO"],
    beneficiaries: ["JO_CHOEYUNDEOK", "JO_LEESUNMONG", "JO_LEEGAK", "JO_LEEJINGSEOK", "JO_KIMHYOSEONG", "JO_HONGSASEOK"],
    what: [W("gain", "관직·승진(지휘관 공로 보상)", "JO_SEJONG", null)],
    mechanisms: ["reward", "appointment"],
    outcomes: [O("reward", "정벌 지휘관 공로에 따른 관직 제수"), O("appointment", "같은 기사에 다른 관원도 등장(개인별 제수 내용 pack 미기재)")],
    relations: [
      ...["JO_CHOEYUNDEOK", "JO_LEESUNMONG", "JO_LEEGAK", "JO_LEEJINGSEOK", "JO_KIMHYOSEONG", "JO_HONGSASEOK"]
        .map((x) => r("JO_SEJONG", x, "REWARD", "promotion_for_campaign_merit", d("R3_who_expansion", { causalStatus: "explicit", note: "pack: 세종 -> campaign commanders : REWARD / APPOINTMENT ('Explicit context: reward of commanders' merit')" }))),
      ...["JO_GWONJIN", "JO_ANSUN", "JO_LEESUKCHI", "JO_PARKANSIN", "JO_NAMJI", "JO_LEESAGWAN", "JO_GWONBOK", "JO_ANGUGYEONG", "JO_HEOJO", "JO_MAENGSASEONG", "JO_KIMJONGSEO"]
        .map((x) => r("JO_SEJONG", x, "COMMAND", "appoint_office", interp({ note: "pack 관계는 '세종 -> campaign commanders'뿐. 이 인물이 같은 기사에서 관직을 받았는지는 해석." })))
    ],
    sourceIds: ["SRC_1433_0516A"],
    evidenceSummary: "관직·승진 제수. pack은 지휘관 공로 보상 맥락을 명시한다. 지휘관 6명에 대한 포상만 pack 관계이고, 그 밖의 WHO 인물에 대한 제수 관계는 해석으로 분리했다.",
    eventLinks: [{ eventId: "E1433_0419", linkType: "causal", causalStatus: "explicit", provenance: PV, note: "pack: 'Promotions following first campaign' + 'reward of commanders' merit'" }],
    storyWeight: 2
  }),
  ev({
    id: "E1433_0516B", title: "정벌 지휘관에게 노비 하사",
    ...COURT("1433-05-16"),
    theater: ["CENTRAL"], placeIds: ["PL_HANSEONG"],
    actors: ["ORG_JOSEON_COURT"], targets: ["JO_CHOEYUNDEOK", "JO_LEESUNMONG", "JO_LEEGAK", "JO_LEEJINGSEOK", "JO_HONGSASEOK", "JO_KIMHYOSEONG"],
    beneficiaries: ["JO_CHOEYUNDEOK", "JO_LEESUNMONG", "JO_LEEGAK", "JO_LEEJINGSEOK", "JO_HONGSASEOK", "JO_KIMHYOSEONG"],
    subjects: ["GRP_1433_BESTOWED_NOBI"],
    what: [
      W("gain", "노비 10구", "ORG_JOSEON_COURT", "JO_CHOEYUNDEOK", 10, "구"),
      W("gain", "노비 8구", "ORG_JOSEON_COURT", "JO_LEESUNMONG", 8, "구"),
      W("gain", "노비 6구", "ORG_JOSEON_COURT", "JO_LEEGAK", 6, "구"),
      W("gain", "노비 6구", "ORG_JOSEON_COURT", "JO_LEEJINGSEOK", 6, "구"),
      W("gain", "노비 5구", "ORG_JOSEON_COURT", "JO_HONGSASEOK", 5, "구"),
      W("gain", "노비 4구", "ORG_JOSEON_COURT", "JO_KIMHYOSEONG", 4, "구"),
      W("transfer", "하사된 사람들(합 39구) — 당대 제도상 사람을 재산으로 이전", "GRP_1433_BESTOWED_NOBI", null, 39, "구")
    ],
    mechanisms: ["reward"],
    outcomes: [O("reward", "노비 하사(사람을 재산으로 준 당대 제도). 하사된 사람들의 출신은 사료에 기재되지 않음")],
    relations: [["JO_CHOEYUNDEOK", 10], ["JO_LEESUNMONG", 8], ["JO_LEEGAK", 6], ["JO_LEEJINGSEOK", 6], ["JO_HONGSASEOK", 5], ["JO_KIMHYOSEONG", 4]]
      .map(([x, n]) => r("ORG_JOSEON_COURT", x, "REWARD", "bestow_nobi", d("R4_group_placeholder", { causalStatus: "explicit", note: `노비 ${n}구. pack: state -> commanders : REWARD ('campaign rewards')` }))),
    sourceIds: ["SRC_1433_0516B"],
    evidenceSummary: "정벌 지휘관에게 노비를 하사했다(최윤덕 10, 이순몽 8, 이각 6, 이징석 6, 홍사석 5, 김효성 4). 사람을 재산으로 이전한 당대 제도로 기록하며, 하사된 사람들의 출신은 추정하지 않는다.",
    eventLinks: [{ eventId: "E1433_0419", linkType: "causal", causalStatus: "explicit", provenance: PV, note: "pack 제목 'bestowed as campaign rewards'" }],
    storyWeight: 2
  }),
  ev({
    id: "E1433_0517", title: "전사·병사자 치제와 구휼·복호",
    ...COURT("1433-05-17"),
    theater: ["CENTRAL"], placeIds: ["PL_HANSEONG"],
    actors: ["ORG_JOSEON_COURT"], decisionMakers: ["JO_SEJONG"], beneficiaries: ["GRP_1433_WARDEAD", "JO_ANEULGYEONG"], victims: ["GRP_1433_WARDEAD", "JO_ANEULGYEONG"],
    what: [
      W("gain", "전사자 치제(제사)", "ORG_JOSEON_COURT", "GRP_1433_WARDEAD"),
      W("gain", "전사 군관 쌀·콩 각 5석", "ORG_JOSEON_COURT", "GRP_1433_WARDEAD", 5, "석"),
      W("gain", "전사 군졸 3석", "ORG_JOSEON_COURT", "GRP_1433_WARDEAD", 3, "석"),
      W("gain", "전사자 집 복호(역 면제) 5년", "ORG_JOSEON_COURT", "GRP_1433_WARDEAD", 5, "년"),
      W("gain", "병사 군관 3석·군졸 2석, 복호 2년", "ORG_JOSEON_COURT", "GRP_1433_WARDEAD", 2, "년"),
      W("gain", "말을 잃은 자 복호 2년", "ORG_JOSEON_COURT", "GRP_1433_EXPEDITION_TROOPS", 2, "년")
    ],
    mechanisms: ["welfare"],
    outcomes: [O("welfare", "치제·곡식·복호", { subjectId: "GRP_1433_WARDEAD" })],
    relations: [
      r("ORG_JOSEON_COURT", "GRP_1433_WARDEAD", "WELFARE", "commemorate_and_compensate", d("R4_group_placeholder", { causalStatus: "explicit", note: "pack: state -> dead soldiers / bereaved households" })),
      r("ORG_JOSEON_COURT", "JO_ANEULGYEONG", "WELFARE", "commemorate_named_dead", d("R5_content_actor", { causalStatus: "explicit" })),
      r("ORG_JOSEON_COURT", "GRP_1433_EXPEDITION_TROOPS", "WELFARE", "compensate_horse_loss", d("R4_group_placeholder", { note: "pack: state -> soldiers/officers : COMPENSATION" }))
    ],
    sourceIds: ["SRC_1433_0517"],
    evidenceSummary: "전사자 치제, 전사 군관 쌀·콩 5석·군졸 3석·복호 5년, 병사 군관 3석·군졸 2석·복호 2년, 말을 잃은 자 복호 2년. 안을경 등 이름 있는 전사자와 무명 전사자.",
    eventLinks: [{ eventId: "E1433_0419", linkType: "causal", causalStatus: "explicit", provenance: PV, note: "pack 제목 'campaign dead and sick'" }],
    storyWeight: 2
  }),
  ev({
    id: "E1433_0601", title: "자성군 설치(legacy)",
    ...DAY("1433-06-01", "legacy_record_date"), provenance: L2, theaterBasis: "legacy",
    theater: ["AMNOK"], placeIds: ["PL_JASEONG"],
    actors: ["ORG_JOSEON_COURT"],
    what: [W("gain", "신설 군(자성군)", null, "ORG_JOSEON_COURT")],
    mechanisms: ["administrative_reorganization"],
    outcomes: [O("county_established", "(v2) 자성군 설치")],
    sourceIds: ["SRC_1433_0601"],
    evidenceSummary: "(v2) 자성군 설치. pack v1에 없음."
  }),
  ev({
    id: "E1433_0610", title: "지함 복명: 맹가첩목아의 진술과 항의",
    ...BEFORE_RECORD("1433-06-10"),
    theater: ["DUMAN", "CENTRAL"], placeIds: ["PL_ALMOKHA", "PL_HANSEONG"],
    actors: ["JO_JIHAM", "JZ_MENGGETEMUR"], targets: ["JO_SEJONG"], subjects: ["JZ_IMHALA", "JZ_MANJU"], informationSources: ["JZ_MENGGETEMUR"],
    what: [
      W("claim", "임합라가 공격의 실제 우두머리이고 이만주는 말렸다", "JZ_MENGGETEMUR", "JO_JIHAM"),
      W("claim", "정벌이 무고한 자와 죄 있는 자를 가리지 않았다는 비판", "JZ_MENGGETEMUR", "JO_JIHAM"),
      W("claim", "파저강에서 잡혀간 친족 송환 요청", "JZ_MENGGETEMUR", "JO_JIHAM")
    ],
    mechanisms: ["envoy", "claim", "report"],
    outcomes: [O("claim_made", "맹가첩목아의 진술·항의(독립적으로 확인된 사실 아님)", { subjectId: "JZ_MENGGETEMUR", certainty: "contemporary_claim" })],
    relations: [
      r("JZ_MENGGETEMUR", "JO_JIHAM", "DIPLOMACY", "protest_and_statement_to_envoy", d("R5_content_actor", { ...BEFORE("1433-06-10"), causalStatus: "explicit", note: "pack: 맹가첩목아 -> 조선 : CLAIM / DIPLOMATIC_PROTEST. 진술을 들은 사람은 지함(WHAT)." })),
      r("JZ_MENGGETEMUR", "JZ_IMHALA", "COUNTER_CLAIM", "identify_as_ringleader", d("R5_content_actor", { ...BEFORE("1433-06-10"), certainty: "contemporary_claim", pathEligible: false, note: "주장의 대상(about) — 접촉이 아님" })),
      r("JZ_MENGGETEMUR", "JZ_MANJU", "COUNTER_CLAIM", "exculpate", d("R5_content_actor", { ...BEFORE("1433-06-10"), certainty: "contemporary_claim", pathEligible: false, note: "주장의 대상(about) — 접촉이 아님" })),
      r("JO_JIHAM", "JO_SEJONG", "REPORT", "envoy_report", p({ ...AT("1433-06-10"), note: "pack: 지함 -> 세종 : REPORT. 시각=기사일(R7)" }))
    ],
    sourceIds: ["SRC_1433_0610"],
    evidenceSummary: "지함이 알목하에서 돌아와 맹가첩목아의 말을 보고했다: 임합라가 실제 우두머리이고 이만주는 말렸다, 정벌이 무고한 자와 죄인을 가리지 않았다, 파저강에서 잡혀간 친족을 돌려달라. 진술 시점은 기사일 이전(미상).",
    eventLinks: [{ eventId: "E1433_0419", linkType: "causal", causalStatus: "explicit", provenance: PV, note: "pack: 정벌을 비판하고 파저강에서 잡혀간 친족 송환을 요청" }],
    discrepancies: ["D01"], certainty: "contemporary_claim", storyWeight: 2
  }),
  ev({
    id: "E1433_08L10", title: "명 칙서: 진위 판별 불가, 상호 반환·침범 금지",
    ...BEFORE_RECORD("1433-08L-10"),
    theater: ["MING", "CENTRAL"], placeIds: ["PL_MING_COURT", "PL_HANSEONG"],
    actors: ["MING_XUANDE"], subjects: ["MING_MENGNAL", "MING_CHOEJIN"],
    targets: ["JO_SEJONG", "JZ_YANGMOKDABOL", "JZ_SALMANDAPSILI", "JZ_MENGGETEMUR", "JZ_FANCHA", "JZ_MANJU", "JZ_ARADAP"],
    what: [W("burden", "피로인·가축·문서 등의 반환과 향후 상호 침범 금지", "MING_XUANDE", null)],
    mechanisms: ["diplomacy", "mediation"],
    outcomes: [O("diplomatic_exchange", "칙서는 진위를 분명히 가릴 수 없다고 명시하고 관련 당사자에게 반환·침범 금지를 명령(조선 유죄 판정 아님)")],
    relations: [
      r("MING_XUANDE", "JO_SEJONG", "DIPLOMACY", "imperial_mediation_order", p({ ...AT("1433-08L-10"), note: "pack: 선덕제 -> 조선 : MEDIATION. 조선 조정 도달 시각=기사일(R7)." })),
      ...["JZ_YANGMOKDABOL", "JZ_SALMANDAPSILI", "JZ_MENGGETEMUR", "JZ_FANCHA", "JZ_MANJU", "JZ_ARADAP"]
        .map((x) => r("MING_XUANDE", x, "DIPLOMACY", "imperial_mediation_order", d("R3_who_expansion", { ...UNKNOWN_T, note: "pack: 선덕제 -> Jurchen actors. 여진 측 전달 시점 미상." }))),
      r("JO_SEJONG", "MING_XUANDE", "CLAIM", "prior_account_to_ming", d("R1_court_recipient", { ...BEFORE("1433-08L-10"), note: "pack: Joseon -> Ming : CLAIM. 제출일 미상(칙서 이전)." })),
      r("JZ_MANJU", "MING_XUANDE", "CLAIM", "prior_account_to_ming", d("R1_court_recipient", { ...BEFORE("1433-08L-10"), note: "pack: 이만주 side -> Ming : CLAIM. 제출일 미상(칙서 이전)." }))
    ],
    sourceIds: ["SRC_1433_08L10"],
    evidenceSummary: "명 조정은 서로 다른 보고를 받았고, 칙서는 진위를 분명히 가릴 수 없다고 하면서 피로인·가축·문서 반환과 향후 상호 침범 금지를 명령했다. 맹날가래·최진은 기사에 등장하나 역할은 pack 미기재(언급 대상).",
    discrepancies: ["D01", "D16"], storyWeight: 3
  }),
  ev({
    id: "E1433_1221", title: "이만주의 사절 파견(legacy)",
    ...DAY("1433-12-21", "legacy_record_date"), provenance: L2, theaterBasis: "legacy",
    theater: ["CENTRAL"], placeIds: ["PL_HANSEONG"],
    actors: ["JZ_MANJU", "JZ_WANGDABOL", "JZ_YUSALDOK"], targets: ["JO_SEJONG"],
    what: [W("transfer", "토산물 진상", "JZ_MANJU", "JO_SEJONG")],
    mechanisms: ["envoy", "diplomacy"],
    outcomes: [O("diplomatic_exchange", "(v2) 사절 파견")],
    relations: [
      r("JZ_MANJU", "JZ_WANGDABOL", "COMMAND", "dispatch_envoy", leg()), r("JZ_MANJU", "JZ_YUSALDOK", "COMMAND", "dispatch_envoy", leg()),
      r("JZ_WANGDABOL", "JO_SEJONG", "DIPLOMACY", "tribute_mission", leg()), r("JZ_YUSALDOK", "JO_SEJONG", "DIPLOMACY", "tribute_mission", leg())
    ],
    sourceIds: ["SRC_1433_1221"],
    evidenceSummary: "(v2) 이만주가 왕답올·유살독 등 14명을 보내 토산물을 바쳤다. pack v1에 없음."
  }),

  /* ============================== 1434 ============================== */
  ev({
    id: "E1434_0416", title: "이만주가 강계부에 문서 발송(legacy)", ...DAY("1434-04-16", "legacy_record_date"), provenance: L2, theaterBasis: "legacy",
    theater: ["AMNOK"], placeIds: ["PL_GANGGYE"], actors: ["JZ_MANJU"], targets: ["ORG_GANGGYE_BU"],
    what: [W("claim", "원상미 20포 수령 의사", null, "JZ_MANJU", 20, "포"), W("claim", "도주한 남녀 반환 요청", null, "JZ_MANJU", 7, "명")],
    mechanisms: ["diplomacy"], outcomes: [O("diplomatic_exchange", "(v2) 물자 수령·도망자 반환 요청")],
    relations: [r("JZ_MANJU", "ORG_GANGGYE_BU", "DIPLOMACY", "letter", leg())],
    sourceIds: ["SRC_1434_0416"], evidenceSummary: "(v2) pack v1에 없음."
  }),
  ev({
    id: "E1434_0422", title: "도망자 송환을 둘러싼 조정 논의(legacy)", ...DAY("1434-04-22", "legacy_record_date"), provenance: L2, theaterBasis: "legacy",
    theater: ["CENTRAL"], placeIds: ["PL_HANSEONG"], actors: ["JO_SEJONG", "JO_SINSANG"], decisionMakers: ["JO_SEJONG"], subjects: ["JZ_MANJU"],
    what: [W("transfer", "강제 송환 반대 의견", "JO_SINSANG", "JO_SEJONG")],
    mechanisms: ["policy_deliberation"], outcomes: [O("unresolved", "(v2) 송환 여부 논의")],
    relations: [r("JO_SINSANG", "JO_SEJONG", "POLICY", "oppose_repatriation", leg())],
    sourceIds: ["SRC_1434_0422"], evidenceSummary: "(v2) pack v1에 없음.",
    eventLinks: [{ eventId: "E1434_0416", linkType: "reference", causalStatus: "unknown", provenance: L2, note: "v2는 인과(causedBy, explicit)로 기록했으나 pack v1에 없는 기사라 인과로 승격하지 않음(언급 관계로만 보존)" }]
  }),
  ev({
    id: "E1434_0426", title: "이만주 관하 인원의 조선 도망과 처리 논의(legacy)", ...DAY("1434-04-26", "legacy_record_date"), provenance: L2, theaterBasis: "legacy",
    theater: ["CENTRAL"], placeIds: ["PL_HANSEONG"],
    actors: ["JZ_JANGGYOHA", "JZ_YUPOJA", "JZ_WANGANTAN", "JO_HWANGHUI"], decisionMakers: ["JO_SEJONG"], subjects: ["JZ_MANJU"],
    what: [W("transfer", "이만주 관하 인원의 이탈", null, null)],
    mechanisms: ["defection", "policy_deliberation"], outcomes: [O("movement", "(v2) 도망")],
    relations: [r("JO_HWANGHUI", "JO_SEJONG", "POLICY", "advise", leg())],
    sourceIds: ["SRC_1434_0426"], evidenceSummary: "(v2) pack v1에 없음."
  }),
  ev({
    id: "E1434_0803", title: "범찰 첩보와 회령 지휘 논의: 도발 대신 은밀한 관찰",
    ...COURT("1434-08-03"),
    theater: ["CENTRAL", "DUMAN"], placeIds: ["PL_HANSEONG", "PL_ALMOKHA", "PL_YEONGBUK", "PL_BAEKANSUSO", "PL_HOERYEONG"],
    actors: ["JO_SEJONG", "JO_CHOEYUNDEOK", "JO_ANSUNGSEON"], informationSources: ["GRP_1434_INTEL_SOURCE"],
    decisionMakers: ["JO_SEJONG"], subjects: ["JZ_FANCHA", "JO_LEEJINGOK", "JO_HAHAN", "JO_SIMDOWON"],
    what: [
      W("transfer", "범찰이 영북 지휘관을 해치고 파저강 쪽으로 옮길 수 있다는 첩보(진위 불명)", "GRP_1434_INTEL_SOURCE", "JO_SEJONG"),
      W("transfer", "경험 많은 이징옥을 회령으로 옮기자는 건의", "JO_CHOEYUNDEOK", "JO_SEJONG"),
      W("transfer", "도발하지 말고 은밀히 관찰하자는 건의", "JO_ANSUNGSEON", "JO_SEJONG")
    ],
    mechanisms: ["intelligence", "policy_deliberation"],
    outcomes: [O("decision", "불확실한 첩보로 도발하지 않고 은밀히 관찰한다는 안숭선 안을 세종이 채택")],
    relations: [
      r("GRP_1434_INTEL_SOURCE", "JO_SEJONG", "INTELLIGENCE", "report_rumor", d("R1_court_recipient", { note: "pack: local intelligence -> court. 출처 미기재(R4). 진위는 조정도 불확실." })),
      r("JO_CHOEYUNDEOK", "JO_SEJONG", "POLICY", "advise_move_commander", p()),
      r("JO_ANSUNGSEON", "JO_SEJONG", "POLICY", "advise_covert_observation", p())
    ],
    sourceIds: ["SRC_1434_0803"],
    evidenceSummary: "범찰이 영북 지휘관을 해치고 파저강 쪽으로 옮길 수 있다는 첩보가 있었으나 조정은 진위가 불확실하다고 명시했다. 최윤덕은 이징옥을 회령으로 옮기자고 했고, 세종은 안숭선의 '도발 없이 은밀 관찰' 안을 받아들였다. 하한·심도원은 기사에 등장(발언 미기재).",
    storyWeight: 2
  }),
  ev({
    id: "E1434_0914", title: "자성군 방비 강화(legacy)", ...DAY("1434-09-14", "legacy_record_date"), provenance: L2, theaterBasis: "legacy",
    theater: ["AMNOK"], placeIds: ["PL_JASEONG"], actors: ["ORG_JASEONG_GUN"], targets: ["GRP_1434_JASEONG_GARRISON"],
    what: [W("burden", "갑사·군인 배치", "GRP_1434_JASEONG_GARRISON", null)],
    mechanisms: ["fortification", "defense"], outcomes: [O("fortification", "(v2) 방비 강화")],
    relations: [r("ORG_JASEONG_GUN", "GRP_1434_JASEONG_GARRISON", "FORTIFICATION", "deploy_garrison", leg())],
    sourceIds: ["SRC_1434_0914"], evidenceSummary: "(v2) pack v1에 없음."
  }),
  ev({
    id: "E1434_1010", title: "부방군 교대체계 정비(legacy)", ...DAY("1434-10-10", "legacy_record_date"), provenance: L2, theaterBasis: "legacy",
    theater: ["CENTRAL"], placeIds: ["PL_HANSEONG"], actors: ["ORG_BYEONGJO"],
    what: [W("burden", "부방군 교대 의무 재편", null, null)],
    mechanisms: ["administrative_reorganization"], outcomes: [O("policy_change", "(v2) 교대체계 정비")],
    sourceIds: ["SRC_1434_1010"], evidenceSummary: "(v2) pack v1에 없음."
  }),
  ev({
    id: "E1434_1012", title: "명, 홀라온 억류 조선인 포로 송환 중재(legacy)", ...DAY("1434-10-12", "legacy_record_date"), provenance: L2, theaterBasis: "legacy",
    theater: ["MING"], placeIds: ["PL_MING_COURT"], actors: ["MING_XUANDE", "MING_MENGNAL"], targets: ["GRP_HOLLAON"],
    what: [W("claim", "억류 조선인 포로 송환", null, null)],
    mechanisms: ["diplomacy", "mediation"], outcomes: [O("diplomatic_exchange", "(v2) 송환 중재")],
    relations: [r("MING_XUANDE", "GRP_HOLLAON", "DIPLOMACY", "mediate_captive_return", leg()), r("MING_MENGNAL", "GRP_HOLLAON", "DIPLOMACY", "negotiate", leg())],
    sourceIds: ["SRC_1434_1012"], evidenceSummary: "(v2) pack v1에 없음."
  }),
  ev({
    id: "E1434_1024", title: "영북·회령 행정·방어 재편 승인",
    ...COURT("1434-10-24"),
    theater: ["DUMAN", "CENTRAL"], placeIds: ["PL_YEONGBUK", "PL_HOERYEONG"],
    actors: ["ORG_HAMGIL_GAMSA", "JO_SEONGDALSAENG", "JO_SIMDOWON", "JO_LEEJINGOK", "JO_SEJONG"], decisionMakers: ["JO_SEJONG"],
    what: [W("transfer", "영북·회령 상설 교환·재편안(농지·인구·방어·행정 가능성 검토)", null, "JO_SEJONG")],
    mechanisms: ["proposal", "administrative_reorganization"],
    outcomes: [O("decision", "회령을 제1 요충으로 보고 재편안 채택", { subjectId: "JO_SEJONG" })],
    relations: ["ORG_HAMGIL_GAMSA", "JO_SEONGDALSAENG", "JO_SIMDOWON", "JO_LEEJINGOK"].map((x) =>
      r(x, "JO_SEJONG", "BORDER_ADMINISTRATION", "propose_reorganization",
        interp({ note: "pack은 'field officials -> court'로 묶어 기록. 누가 '현지 관원'인지·누가 건의했는지는 해석." }))),
    sourceIds: ["SRC_1434_1024"], relatedSourceIds: ["SRC_GEO_HOERYEONG", "SRC_GEO_JONGSEONG"],
    evidenceSummary: "영북·회령의 상설 재편을 논의, 회령을 제1 요충으로 판단하고 농지·인구·방어·행정 여건을 검토해 조정이 받아들였다. 지리지(세종 16년 영북진 이설·회령 설치)와 같은 일인지는 pack이 연결하지 않아 '관련 사료'로만 둔다.",
    storyWeight: 2
  }),
  ev({
    id: "E1434_GEO_GYEONGWON", title: "[지리지] 경원 옛 거점 회복·축성·남도 민호 이주 결정",
    dateMin: "1434-00-00", dateMax: "1434-99-99", datePrecision: "YEAR", recordDate: null, dateBasis: "year_only_geography",
    theater: ["DUMAN"], placeIds: ["PL_GYEONGWON"],
    actors: ["ORG_JOSEON_COURT"],
    what: [W("burden", "남도 민호 이주", null, null)],
    mechanisms: ["administrative_reorganization", "fortification", "resettlement"],
    outcomes: [O("fortification", "옛 변경 거점 회복·축성"), O("movement", "남도 민호 이주 결정")],
    sourceIds: ["SRC_GEO_GYEONGWON"],
    evidenceSummary: "『세종실록』 지리지(경원도호부): 세종 16년 옛 변경 거점을 회복·강화하고 성을 쌓아 남도 민호를 옮기기로 결정, 이후 석성으로 개축. 연중 시점 미상.",
    storyWeight: 1
  }),

  /* ============================== 1435 ============================== */
  ev({
    id: "E1435_JANRAID", title: "정월 여연 침입(legacy)",
    dateMin: "1435-01-00", dateMax: "1435-01-99", datePrecision: "MONTH", recordDate: "1435-06-13", dateBasis: "legacy_month",
    provenance: L2, theaterBasis: "legacy", theater: ["AMNOK"], placeIds: ["PL_YEOYEON"],
    actors: ["JZ_MANJU", "GRP_HOLLAON"], victims: ["GRP_1435_JAN_YEOYEON_VICTIMS"], informationSources: ["GRP_1435_INFORMANT"],
    what: [W("loss", "남자 피살 2·남녀 피랍 7·말 6·소 5", "GRP_1435_JAN_YEOYEON_VICTIMS", null)],
    mechanisms: ["battle"],
    outcomes: [O("killed", "(v2) 남자 2명 피살", { subjectId: "GRP_1435_JAN_YEOYEON_VICTIMS", quantity: 2, unit: "명", reportedBy: "제보" })],
    relations: [
      r("JZ_MANJU", "GRP_1435_JAN_YEOYEON_VICTIMS", "MILITARY_CONFLICT", "raid", leg({ certainty: "contemporary_claim", dateMin: "1435-01-00", dateMax: "1435-01-99" })),
      r("GRP_HOLLAON", "GRP_1435_JAN_YEOYEON_VICTIMS", "MILITARY_CONFLICT", "raid", leg({ certainty: "contemporary_claim", dateMin: "1435-01-00", dateMax: "1435-01-99" }))
    ],
    sourceIds: ["SRC_1435_0613"], evidenceSummary: "(v2) 제보로 드러난 정월 침입. pack v1에 없음.",
    discrepancies: ["D02", "D06"]
  }),
  ev({
    id: "E1435_0113", title: "오량합 2,700기의 여연성 포위",
    ...DAY("1435-01-13"), recordDate: "1435-01-18",
    theater: ["AMNOK"], placeIds: ["PL_YEOYEON"],
    actors: ["GRP_ORYANGHAP_1435", "JO_KIMYUNSU", "JO_LEEJIN", "JO_YEOSEONGRYEOL", "JO_KIMSUYEON", "GRP_1435_YEOYEON_GARRISON"],
    targets: ["GRP_1435_YEOYEON_GARRISON"], victims: ["GRP_1435_YEOYEON_GARRISON", "JO_KIMYUNSU"],
    what: [W("loss", "군사 부상 4·사망 1", "GRP_1435_YEOYEON_GARRISON", null, 5, "명"), W("loss", "적 약 90명·말 60필 피격(조선 측 보고)", "GRP_ORYANGHAP_1435", null, 90, "명")],
    mechanisms: ["battle", "defense"],
    outcomes: [
      O("wounded", "김윤수 엄지 부상", { subjectId: "JO_KIMYUNSU", reportedBy: JR }),
      O("wounded", "군사 4명 부상", { subjectId: "GRP_1435_YEOYEON_GARRISON", quantity: 4, unit: "명", reportedBy: JR }),
      O("killed", "군사 1명 사망", { subjectId: "GRP_1435_YEOYEON_GARRISON", quantity: 1, unit: "명", reportedBy: JR }),
      O("unresolved", "적 약 90명·말 60필을 맞혔다고 보고", { subjectId: "GRP_ORYANGHAP_1435", quantity: 90, unit: "명", reportedBy: JR }),
      O("unresolved", "증원 요청(수신자 pack 미기재)")
    ],
    relations: [
      r("GRP_ORYANGHAP_1435", "GRP_1435_YEOYEON_GARRISON", "MILITARY_CONFLICT", "siege", d("R4_group_placeholder", { note: "pack: Oryanghap -> Yŏyŏn : MILITARY_ATTACK(대상 '여연'을 수비군 group으로)" })),
      ...["JO_KIMYUNSU", "JO_LEEJIN", "JO_YEOSEONGRYEOL", "JO_KIMSUYEON"].map((x) => r(x, "GRP_1435_YEOYEON_GARRISON", "COMMAND", "command_defenders", p({ note: "pack: 김윤수/이진/여성렬/김수연 -> defenders : COMMAND" }))),
      r("GRP_1435_YEOYEON_GARRISON", "GRP_ORYANGHAP_1435", "MILITARY_CONFLICT", "defend", p({ note: "pack: defenders -> Oryanghap : DEFENSE" })),
      r("JO_KIMSUYEON", "GRP_1435_KIMSUYEON_100", "COMMAND", "lead_pursuit_party", leg({ note: "v2 요약의 추격대 서술. pack 발췌에는 없음." })),
      r("JO_KIMSUYEON", "GRP_ORYANGHAP_1435", "MILITARY_ACTION", "pursue_then_withdraw", leg({ note: "v2: 복병 약 300기를 보고 철수. pack 발췌에는 없음." }))
    ],
    sourceIds: ["SRC_1435_0118"],
    evidenceSummary: "약 2,700기의 오량합이 여연성을 포위, 아침부터 오후까지 싸웠다. 조선 측은 적 약 90명·말 60필을 맞혔다고 보고. 김윤수 엄지 부상, 군사 4명 부상·1명 사망, 증원 요청. 김윤수·이진·여성렬·김수연이 수비군을 지휘(서로 간 상하관계는 기록 없음).",
    discrepancies: ["D02", "D11", "D19"], storyWeight: 3
  }),
  ev({
    id: "E1435_0125", title: "여연 방어구조 개편 검토(legacy)", ...DAY("1435-01-25", "legacy_record_date"), provenance: L2, theaterBasis: "legacy",
    theater: ["CENTRAL"], placeIds: ["PL_HANSEONG"], actors: ["JO_SEJONG", "JO_LEESUKCHI"], decisionMakers: ["JO_SEJONG"],
    what: [W("transfer", "여연 방어 개편 의견", "JO_LEESUKCHI", "JO_SEJONG")],
    mechanisms: ["policy_deliberation"], outcomes: [O("policy_change", "(v2) 토병 중심 방어 검토")],
    relations: [r("JO_LEESUKCHI", "JO_SEJONG", "POLICY", "advise", leg())],
    sourceIds: ["SRC_1435_0125"], evidenceSummary: "(v2) pack v1에 없음."
  }),
  ev({
    id: "E1435_0224", title: "명, 범찰의 이주 허가(legacy)", ...DAY("1435-02-24", "legacy_record_date"), provenance: L2, theaterBasis: "legacy",
    theater: ["MING"], placeIds: ["PL_MING_COURT"], actors: ["MING_COURT", "JZ_FANCHA"], subjects: ["JZ_MANJU"],
    what: [W("gain", "이주·공동 거주 허가", "MING_COURT", "JZ_FANCHA")],
    mechanisms: ["diplomacy", "resettlement"], outcomes: [O("movement", "(v2) 이주(부하 편입 아님)", { subjectId: "JZ_FANCHA" })],
    relations: [r("MING_COURT", "JZ_FANCHA", "DIPLOMACY", "permit_relocation", leg()),
      r("JZ_FANCHA", "JZ_MANJU", "RESETTLEMENT", "relocate_to_area_of", leg({ pathEligible: false, note: "거주지 이동(about). 부하 편입 아님." }))],
    sourceIds: ["SRC_1435_0224"], evidenceSummary: "(v2) pack v1에 없음.", discrepancies: ["D03"]
  }),
  ev({
    id: "E1435_0312", title: "폭설로 가축을 잃은 신 입거민 구휼",
    ...BEFORE_RECORD("1435-03-12"),
    theater: ["DUMAN"], placeIds: ["PL_GILJU", "PL_HOERYEONG", "PL_GYEONGWON"],
    actors: ["ORG_HAMGIL_FIELD"], beneficiaries: ["GRP_1435_NORTHERN_SETTLERS"], victims: ["GRP_1435_NORTHERN_SETTLERS"],
    what: [
      W("loss", "폭설로 농우·전마 다수 폐사", "GRP_1435_NORTHERN_SETTLERS", null),
      W("gain", "곡식·사료·운송 지원", "ORG_HAMGIL_FIELD", "GRP_1435_NORTHERN_SETTLERS"),
      W("burden", "군마 사료 보급(병참)", "ORG_HAMGIL_FIELD", null)
    ],
    mechanisms: ["relief"],
    outcomes: [O("relief", "신 입거민 구휼"), O("unresolved", "군마 손실에 대한 병참 대응")],
    relations: [r("ORG_HAMGIL_FIELD", "GRP_1435_NORTHERN_SETTLERS", "WELFARE", "relief_grain_fodder",
      d("R4_group_placeholder", { ...BEFORE("1435-03-12"), note: "pack: provincial government -> settlers : RELIEF. 'provincial government'의 도명은 pack에 없음(장소로부터의 정규화)." }))],
    sourceIds: ["SRC_1435_0312"],
    evidenceSummary: "길주 이북·회령·경원에 큰 눈이 내려 가축이 죽었고, 새로 옮겨 온 입거민의 농우와 전마가 피해를 입었다. 곡식·사료·운송으로 구휼했다. 구휼 시점은 기사일 이전(미상).",
    storyWeight: 1
  }),
  ev({
    id: "E1435_0408", title: "함길도 입거민 생계·정착 문제 보고",
    ...DAY("1435-04-08", "report_receipt_on_record_date"),
    theater: ["DUMAN", "CENTRAL"], theaterBasis: "pack_explicit", placeIds: ["PL_HAMGIL"],
    actors: ["ORG_HAMGIL_DOJEOLJESA"], targets: ["JO_SEJONG"], subjects: ["GRP_1435_NORTHERN_SETTLERS"],
    what: [W("transfer", "입거민 경작·도망·농우·전마 문제 보고", "ORG_HAMGIL_DOJEOLJESA", "JO_SEJONG")],
    mechanisms: ["report", "resettlement"],
    outcomes: [O("report_filed", "pack: 변경 확장·방어에 지속적인 민간 정착 정책이 필요했음을 보여 줌")],
    relations: [
      r("ORG_HAMGIL_DOJEOLJESA", "JO_SEJONG", "REPORT", "settler_condition_report", d("R1_court_recipient", { note: "pack: field command -> court : REPORT" })),
      r("ORG_JOSEON_COURT", "GRP_1435_NORTHERN_SETTLERS", "RESETTLEMENT", "settler_agricultural_policy", p({ ...UNKNOWN_T, note: "pack: state -> settlers : RESETTLEMENT / AGRICULTURAL_POLICY. 시점 미상." }))
    ],
    sourceIds: ["SRC_1435_0408"],
    evidenceSummary: "함길도 지휘관(실명 미기재)이 입거민의 경작·도망·농우·전마 문제를 보고했다.",
    storyWeight: 1
  }),
  ev({
    id: "E1435_0613", title: "정월 침입 미보고 발각과 문책(legacy)", ...DAY("1435-06-13", "legacy_record_date"), provenance: L2, theaterBasis: "legacy",
    theater: ["CENTRAL"], placeIds: ["PL_HANSEONG"],
    actors: ["GRP_1435_INFORMANT", "JO_CHOESAGANG", "JO_SEJONG", "JO_NOHAN", "JO_HWANGHUI", "JO_CHOEYUNDEOK"],
    targets: ["JO_KIMYUNSU", "JO_LEEGAK"], beneficiaries: ["GRP_1435_JAN_YEOYEON_VICTIMS"], decisionMakers: ["JO_SEJONG"], informationSources: ["GRP_1435_INFORMANT"],
    what: [W("transfer", "정월 침입 제보", "GRP_1435_INFORMANT", "JO_SEJONG"), W("loss", "고신 박탈", "JO_KIMYUNSU", null)],
    mechanisms: ["intelligence", "punishment", "policy_deliberation"],
    outcomes: [O("punishment", "(v2) 김윤수 고신 박탈, 현직 유임", { subjectId: "JO_KIMYUNSU" })],
    relations: [
      r("GRP_1435_INFORMANT", "JO_SEJONG", "INTELLIGENCE", "inform", leg()),
      r("JO_CHOESAGANG", "JO_KIMYUNSU", "ACCOUNTABILITY", "demand_censure", leg()), r("JO_CHOESAGANG", "JO_LEEGAK", "ACCOUNTABILITY", "demand_censure", leg()),
      r("JO_NOHAN", "JO_SEJONG", "POLICY", "advise", leg()), r("JO_HWANGHUI", "JO_SEJONG", "POLICY", "advise", leg()), r("JO_CHOEYUNDEOK", "JO_SEJONG", "POLICY", "advise", leg()),
      r("JO_SEJONG", "JO_KIMYUNSU", "PUNISHMENT", "strip_certificate_retain_post", leg()),
      r("JO_SEJONG", "GRP_1435_JAN_YEOYEON_VICTIMS", "WELFARE", "order_condolence_relief", leg())
    ],
    sourceIds: ["SRC_1435_0613"], evidenceSummary: "(v2) pack v1에 없음.",
    eventLinks: [{ eventId: "E1435_JANRAID", linkType: "reference", causalStatus: "unknown", provenance: L2, note: "v2는 인과(causedBy, explicit)로 기록했으나 pack v1에 없는 기사라 인과로 승격하지 않음(언급 관계로만 보존)" }], discrepancies: ["D06"]
  }),
  ev({
    id: "E1435_0617", title: "사헌부, 김윤수 처분 강화 요구(legacy)", ...DAY("1435-06-17", "legacy_record_date"), provenance: L2, theaterBasis: "legacy",
    theater: ["CENTRAL"], placeIds: ["PL_HANSEONG"], actors: ["JO_CHOEGYEONGMYEONG", "JO_SEJONG"], targets: ["JO_KIMYUNSU"], decisionMakers: ["JO_SEJONG"],
    what: [W("claim", "재추국·율에 따른 처벌 요구", "JO_CHOEGYEONGMYEONG", "JO_SEJONG")],
    mechanisms: ["policy_deliberation"], outcomes: [O("decision", "(v2) 유임 방침 유지", { subjectId: "JO_SEJONG" })],
    relations: [r("JO_CHOEGYEONGMYEONG", "JO_KIMYUNSU", "ACCOUNTABILITY", "demand_reinterrogation", leg()), r("JO_CHOEGYEONGMYEONG", "JO_SEJONG", "POLICY", "remonstrate", leg())],
    sourceIds: ["SRC_1435_0617"], evidenceSummary: "(v2) pack v1에 없음.",
    eventLinks: [{ eventId: "E1435_0613", linkType: "reference", causalStatus: "unknown", provenance: L2, note: "v2는 인과(causedBy, explicit)로 기록했으나 pack v1에 없는 기사라 인과로 승격하지 않음(언급 관계로만 보존)" }]
  }),
  ev({
    id: "E1435_0719", title: "회령·경원 호구를 나눠 종성·공성 설치",
    ...COURT("1435-07-19"),
    theater: ["DUMAN"], placeIds: ["PL_HOERYEONG", "PL_GYEONGWON", "PL_JONGSEONG", "PL_GONGSEONG"],
    actors: ["ORG_JOSEON_COURT"], targets: ["GRP_1435_HOERYEONG_400HH", "GRP_1435_GYEONGWON_300HH"],
    what: [
      W("burden", "회령 400호 분할(종성)", "GRP_1435_HOERYEONG_400HH", null, 400, "호"),
      W("burden", "경원 300호 분할(공성)", "GRP_1435_GYEONGWON_300HH", null, 300, "호")
    ],
    mechanisms: ["administrative_reorganization", "resettlement"],
    outcomes: [O("county_established", "종성군 설치"), O("county_established", "공성 설치"), O("unresolved", "관원이 군사 지휘도 겸함")],
    relations: [
      r("ORG_JOSEON_COURT", "GRP_1435_HOERYEONG_400HH", "BORDER_ADMINISTRATION", "partition_households_new_county", d("R4_group_placeholder", { note: "pack: state -> population : BORDER_ADMINISTRATION / RESETTLEMENT" })),
      r("ORG_JOSEON_COURT", "GRP_1435_GYEONGWON_300HH", "BORDER_ADMINISTRATION", "partition_households_new_county", d("R4_group_placeholder"))
    ],
    sourceIds: ["SRC_1435_0719", "SRC_GEO_JONGSEONG"],
    evidenceSummary: "회령 400호를 나눠 종성군을, 경원 300호를 나눠 공성을 설치했고 관원이 군사 지휘도 맡았다. 지리지(종성)의 '세종 17년 종성군 설치'는 같은 군·같은 해이므로 함께 근거로 든다.",
    storyWeight: 2
  }),
  ev({
    id: "E1435_0726", title: "입거 선정 부정·도피에 대한 처벌과 강제 재입거",
    ...COURT("1435-07-26"),
    theater: ["DUMAN"], placeIds: ["PL_GYEONGWON", "PL_HOERYEONG"],
    actors: ["ORG_JOSEON_COURT"], targets: ["GRP_1435_RESETTLE_AGENTS", "GRP_1435_MIGRANT_HH"], victims: ["GRP_1435_MIGRANT_HH"],
    what: [
      W("loss", "태형 등 처벌", "GRP_1435_RESETTLE_AGENTS", null),
      W("burden", "강제 이주·재배치(도피·환귀자 처벌 후 경원·회령에 다시 배치)", "GRP_1435_MIGRANT_HH", null)
    ],
    mechanisms: ["punishment", "resettlement"],
    outcomes: [O("punishment", "부유한 호를 숨기고 가난한 호를 골랐다는 혐의의 실무자 처벌"), O("movement", "돌아온 자를 처벌하고 경원·회령에 재배치")],
    relations: [
      r("ORG_JOSEON_COURT", "GRP_1435_RESETTLE_AGENTS", "PUNISHMENT", "punish_selection_manipulation", p({ note: "pack: state -> local agents : ACCOUNTABILITY / PUNISHMENT" })),
      r("ORG_JOSEON_COURT", "GRP_1435_MIGRANT_HH", "RESETTLEMENT", "coercive_resettlement", p({ note: "pack: state -> households : COERCIVE_RESETTLEMENT" }))
    ],
    sourceIds: ["SRC_1435_0726"],
    evidenceSummary: "지방 실무자들이 부유한 호를 숨기고 가난한 호를 골랐다는 혐의로 태형·강제 이주 등의 벌을 받았고, 도망해 돌아온 자는 처벌 후 경원·회령에 다시 배치되었다. pack: 사민을 순수한 자발적 과정으로 그리지 말 것.",
    storyWeight: 2
  }),
  ev({
    id: "E1435_0918", title: "여연 전투 후 포상·처벌·전사자 예우",
    ...COURT("1435-09-18"),
    theater: ["CENTRAL", "AMNOK"], placeIds: ["PL_HANSEONG", "PL_YEOYEON"],
    actors: ["ORG_BYEONGJO", "JO_SEJONG"], decisionMakers: ["JO_SEJONG"],
    beneficiaries: ["JO_KIMYUNSU", "JO_JANGSAU", "JO_BAECHEOL", "GRP_1435_WARDEAD"], targets: ["GRP_1435_NEGLIGENT"],
    what: [
      W("gain", "공로자 1계급 승진", "ORG_JOSEON_COURT", "JO_KIMYUNSU"),
      W("gain", "공로자 1계급 승진", "ORG_JOSEON_COURT", "JO_JANGSAU"),
      W("gain", "공로자 1계급 승진", "ORG_JOSEON_COURT", "JO_BAECHEOL"),
      W("gain", "전사자 향직 추증·부의·호역 면제", "ORG_JOSEON_COURT", "GRP_1435_WARDEAD"),
      W("loss", "율에 따른 처벌", "GRP_1435_NEGLIGENT", null)
    ],
    mechanisms: ["reward", "punishment", "welfare"],
    outcomes: [
      O("reward", "김윤수: 강을 건너 적의 퇴로를 끊은 공", { subjectId: "JO_KIMYUNSU" }),
      O("reward", "장사우: 적 추격", { subjectId: "JO_JANGSAU" }),
      O("reward", "배철 등: 싸우고 추격해 약탈품 회수", { subjectId: "JO_BAECHEOL" }),
      O("welfare", "전사자 향직 추증·부의·호역 면제", { subjectId: "GRP_1435_WARDEAD" }),
      O("punishment", "태만한 군사·감독자 율에 따라 처벌", { subjectId: "GRP_1435_NEGLIGENT" })
    ],
    relations: [
      ...["JO_KIMYUNSU", "JO_JANGSAU", "JO_BAECHEOL"].map((x) => r("ORG_JOSEON_COURT", x, "REWARD", "promote_one_grade", p({ causalStatus: "explicit", note: "pack: state -> meritorious soldiers : REWARD(공적 명시)" }))),
      r("ORG_JOSEON_COURT", "GRP_1435_WARDEAD", "WELFARE", "posthumous_office_and_aid", d("R4_group_placeholder", { note: "pack: state -> dead/bereaved : WELFARE / HONOR" })),
      r("ORG_JOSEON_COURT", "GRP_1435_NEGLIGENT", "PUNISHMENT", "punish_by_law", d("R4_group_placeholder", { note: "pack: state -> negligent personnel : ACCOUNTABILITY / PUNISHMENT" }))
    ],
    sourceIds: ["SRC_1435_0918"],
    evidenceSummary: "전사자에게 향직 추증·부의·호역 면제. 김윤수는 강을 건너 적의 퇴로를 끊었고, 장사우는 추격, 배철 등은 싸우고 추격해 약탈품을 되찾았다. 공로자 1계급 승진, 태만자 처벌. 어느 침입의 전투인지는 pack이 특정하지 않는다(D05).",
    discrepancies: ["D05", "D10"], storyWeight: 3
  }),

  /* ============================== 1436 ============================== */
  ev({
    id: "E1436_06L19", title: "세종, 모은 방어 건의를 이천에게 보내 검토 지시",
    ...COURT("1436-06L-19"),
    theater: ["CENTRAL", "AMNOK"], placeIds: ["PL_HANSEONG", "PL_PYEONGAN"],
    actors: ["GRP_1436_PROPOSERS", "JO_SEJONG"], targets: ["JO_LEECHEON"], decisionMakers: ["JO_SEJONG"], subjects: ["JZ_MANJU"],
    what: [
      W("transfer", "4품 이상 관원의 침입 방어 건의(필사본)", "GRP_1436_PROPOSERS", "JO_SEJONG"),
      W("transfer", "건의 평가와 더 나은 계책 제출 요구(서방 방어 위임)", "JO_SEJONG", "JO_LEECHEON")
    ],
    mechanisms: ["proposal", "royal_order"],
    outcomes: [O("policy_change", "중앙 건의가 평안도 지휘관에게 전달됨(이천의 회신은 '기대'일 뿐)")],
    relations: [
      r("GRP_1436_PROPOSERS", "JO_SEJONG", "POLICY", "submit_anti_incursion_proposals", d("R4_group_placeholder", { ...BEFORE("1436-06L-19"), note: "pack: central officials -> 세종 : POLICY_ADVICE. 제출 시점은 기사일 이전." })),
      r("JO_SEJONG", "JO_LEECHEON", "POLICY", "transfer_proposals_and_order_review", p({ note: "pack: 세종 -> 이천 : POLICY_TRANSFER / COMMAND" }))
    ],
    sourceIds: ["SRC_1436_06L19"],
    evidenceSummary: "세종이 침입 방어 건의들을 모아 베껴 평안도 지휘관 이천에게 보내며, 서방 방어를 그에게 맡겼으니 건의를 평가하고 더 나은 계책을 올리라고 했다. pack: '이천은 1437 정벌 이전부터 정책→현장의 연결자'. 이천의 회신은 기대된 피드백일 뿐이라 관계를 만들지 않았다.",
    storyWeight: 2
  }),
  ev({
    id: "E1436_1101", title: "김종서·정흠지의 4군 방어 계책",
    ...COURT("1436-11-01"),
    theater: ["CENTRAL"], placeIds: ["PL_HANSEONG", "PL_SAGUN"],
    actors: ["JO_KIMJONGSEO", "JO_JEONGHEUMJI"], targets: ["JO_SEJONG"],
    what: [W("transfer", "4군 지역 방어 계책(각각 제출)", null, "JO_SEJONG")],
    mechanisms: ["proposal"],
    outcomes: [O("report_filed", "두 사람이 각각 방어책 제출")],
    relations: [
      r("JO_KIMJONGSEO", "JO_SEJONG", "POLICY", "propose_defense_plan", d("R1_court_recipient", { note: "pack: 김종서 -> court : POLICY_ADVICE" })),
      r("JO_JEONGHEUMJI", "JO_SEJONG", "POLICY", "propose_defense_plan", d("R1_court_recipient", { note: "pack: 정흠지 -> court : POLICY_ADVICE" }))
    ],
    sourceIds: ["SRC_1436_1101"],
    evidenceSummary: "김종서와 정흠지가 4군 지역 방어에 관한 계책을 각각 올렸다.",
    storyWeight: 1
  }),
  ev({
    id: "E1436_1127", title: "4군 방어책 시행·화포 교습관 배치·이징옥 유시",
    ...COURT("1436-11-27"),
    theater: ["CENTRAL", "AMNOK"], placeIds: ["PL_HANSEONG", "PL_JASEONG", "PL_GANGGYE", "PL_SAGUN"],
    actors: ["JO_SEJONG", "JO_KIMJONGSEO", "JO_JEONGHEUMJI"], subjects: ["ORG_BYEONGJO"], targets: ["JO_LEEJINGOK", "GRP_1436_FIREARM_INSTRUCTORS"], decisionMakers: ["JO_SEJONG"],
    what: [
      W("transfer", "무력과 회유를 함께 쓰라는 유시", "JO_SEJONG", "JO_LEEJINGOK"),
      W("burden", "화포 교습관 자성·강계 등 배치", "GRP_1436_FIREARM_INSTRUCTORS", null)
    ],
    mechanisms: ["royal_order", "fortification", "policy_deliberation"],
    outcomes: [O("policy_change", "병조의 4군 방어책 시행 명령"), O("unresolved", "본영 이전을 두고 김종서·정흠지 의견 대립")],
    relations: [
      r("JO_SEJONG", "JO_LEEJINGOK", "COMMAND", "instruct_force_with_conciliation", d("R5_content_actor", { note: "pack WHAT: 'Sejong instructed Yi Jing-ok…' / central -> frontier : COMMAND" })),
      r("ORG_BYEONGJO", "JO_SEJONG", "POLICY", "propose_four_counties_defense", interp({ note: "pack은 '병조의 방어책이 시행 명령되었다'만 기록. 병조→세종 건의 행위는 해석." })),
      r("ORG_JOSEON_COURT", "GRP_1436_FIREARM_INSTRUCTORS", "COMMAND", "assign_firearm_training", d("R4_group_placeholder", { note: "pack: central -> frontier : COMMAND / DEFENSE_REFORM" })),
      r("JO_KIMJONGSEO", "JO_SEJONG", "POLICY", "advise_headquarters", d("R1_court_recipient", { note: "pack: 김종서 -> court : POLICY_ADVICE" })),
      r("JO_JEONGHEUMJI", "JO_SEJONG", "POLICY", "dissent_headquarters_move", d("R1_court_recipient", { note: "pack: 정흠지 -> court : POLICY_DISAGREEMENT" }))
    ],
    sourceIds: ["SRC_1436_1127"],
    evidenceSummary: "세종이 이징옥에게 무력과 회유를 함께 쓰라고 유시, 병조의 4군 방어책을 시행하게 하고, 자성·강계 등에 화포 교습관을 배치. 본영 이전을 두고 김종서와 정흠지가 의견을 달리했다.",
    storyWeight: 2
  }),

  /* ============================== 1437 ============================== */
  ev({
    id: "E1437_0611", title: "이천의 자책과 재정벌 전략안",
    ...DAY("1437-06-11", "report_receipt_on_record_date"),
    theater: ["CENTRAL"], placeIds: ["PL_HANSEONG"],
    actors: ["JO_LEECHEON"], targets: ["JO_SEJONG"],
    what: [W("transfer", "요격 실패 자책, 재정벌 필요성, 대규모 원정의 한계, 복수 전략안", "JO_LEECHEON", "JO_SEJONG")],
    mechanisms: ["report", "proposal"],
    outcomes: [O("report_filed", "최근 침입자를 막지 못한 책임을 스스로 인정하고 전략 대안 제시")],
    relations: [r("JO_LEECHEON", "JO_SEJONG", "REPORT", "self_accountability_and_strategy", p({ note: "pack: 이천 -> 세종 : REPORT / SELF_ACCOUNTABILITY / MILITARY_ADVICE" }))],
    sourceIds: ["SRC_1437_0611"], embeddedDocumentAuthor: "JO_LEECHEON",
    evidenceSummary: "이천이 최근 침입자를 요격하지 못한 책임을 인정하고, 군사적 징벌이 다시 필요할 수 있으나 드러난 대규모 원정은 적이 숨어 효과가 없을 수 있다며 여러 전략 대안을 올렸다.",
    storyWeight: 2
  }),
  ev({
    id: "E1437_0820", title: "최윤덕의 방비 방안을 함길도 도절제사에 전달",
    ...COURT("1437-08-20"),
    theater: ["CENTRAL", "DUMAN"], placeIds: ["PL_HANSEONG", "PL_HAMGIL"],
    actors: ["JO_CHOEYUNDEOK", "JO_SEJONG"], targets: ["ORG_HAMGIL_DOJEOLJESA"],
    what: [W("transfer", "여장·전대·해자·상시 경계(이전 강계 경험 기반)", "JO_CHOEYUNDEOK", "JO_SEJONG")],
    mechanisms: ["proposal", "royal_order", "fortification"],
    outcomes: [O("fortification", "pack: 베테랑의 변경 지식이 장기적으로 전달됨을 보여 줌")],
    relations: [
      r("JO_CHOEYUNDEOK", "JO_SEJONG", "POLICY", "defense_advice", p()),
      r("JO_SEJONG", "ORG_HAMGIL_DOJEOLJESA", "FORTIFICATION", "order_reinforcement", p({ note: "pack: 세종 -> frontier commander : COMMAND / FORTIFICATION" }))
    ],
    sourceIds: ["SRC_1437_0820"],
    evidenceSummary: "최윤덕이 이전 강계 경험을 바탕으로 여장·전대·해자·상시 경계 보강을 건의했고 이것이 함길도 도절제사에게 전달되었다. 서방(이천)과 직책을 병합하지 않는다.",
    storyWeight: 1
  }),
  ev({
    id: "E1437_0914", title: "이천 군 3로 분진·압록강 도하",
    ...DAY("1437-09-07"), recordDate: "1437-09-14",
    theater: ["AMNOK"], placeIds: ["PL_ISAN", "PL_GANGGYE", "PL_AMNOK", "PL_HONGTARI", "PL_AHAN", "PL_ONGCHON", "PL_OJAJEOM", "PL_OMIBU"],
    actors: ["JO_LEECHEON", "JO_LEEHWA", "JO_JEONGDEOKSEONG", "JO_HONGSASEOK_1437", "JO_LEEJIN_1437"],
    what: [
      W("burden", "이화 부대", "JO_LEEHWA", null, 1818, "명"),
      W("burden", "정덕성 부대", "JO_JEONGDEOKSEONG", null, 1203, "명"),
      W("burden", "이천 본군", "JO_LEECHEON", null, 4772, "명")
    ],
    mechanisms: ["mobilization", "appointment"],
    outcomes: [O("movement", "3로 분진, 압록강 도하(9월 7일 출발)", { reportedBy: JR })],
    relations: ["JO_LEEHWA", "JO_JEONGDEOKSEONG", "JO_HONGSASEOK_1437", "JO_LEEJIN_1437"]
      .map((x) => r("JO_LEECHEON", x, "COMMAND", "command_column", d("R3_who_expansion", { note: "pack: 이천 -> subordinate forces : COMMAND" }))),
    sourceIds: ["SRC_1437_0914"],
    evidenceSummary: "9월 7일 출발해 세 갈래로 나뉘어 압록강을 건넜다. 이화 1,818, 정덕성 1,203, 이천 본군 4,772(홍사석·이진 동행). 이 기사의 홍사석·이진이 이전 기사의 동명 인물과 같은지는 미확인(D18).",
    discrepancies: ["D18", "D13"], storyWeight: 3
  }),
  ev({
    id: "E1437_0922", title: "제2차 파저강 정벌 승첩 보고",
    dateMin: "1437-09-07", dateMax: "1437-09-16", datePrecision: "DAY", recordDate: "1437-09-22", dateBasis: "pack_event_range",
    theater: ["AMNOK", "CENTRAL"], placeIds: ["PL_AMNOK", "PL_HANSEONG"],
    actors: ["JO_LEECHEON", "JO_LEEHWA", "JO_JEONGDEOKSEONG", "JO_CHOEJEONGAN"], targets: ["GRP_1437_PAJEOGANG_TARGET", "JO_SEJONG"],
    victims: ["GRP_1437_PAJEOGANG_TARGET", "GRP_1437_HWANGHAE_VOLUNTEER"],
    what: [
      W("loss", "거주지·농장 수색·소각", "GRP_1437_PAJEOGANG_TARGET", null),
      W("loss", "살상·포획 합계(조선 측 보고)", "GRP_1437_PAJEOGANG_TARGET", null, 60, "명"),
      W("loss", "황해도 자원군 1명 화살 전사", "GRP_1437_HWANGHAE_VOLUNTEER", null, 1, "명")
    ],
    mechanisms: ["battle", "report"],
    outcomes: [
      O("victory", "적 살상·포획 합계 60", { subjectId: "GRP_1437_PAJEOGANG_TARGET", quantity: 60, unit: "명", reportedBy: JR }),
      O("killed", "조선 측 사망 1(황해도 자원군, 화살)", { subjectId: "GRP_1437_HWANGHAE_VOLUNTEER", quantity: 1, unit: "명", reportedBy: JR }),
      O("unresolved", "적이 진형을 공격할 때 화포 사용")
    ],
    relations: [
      ...["JO_LEECHEON", "JO_LEEHWA", "JO_JEONGDEOKSEONG"].map((x) =>
        r(x, "GRP_1437_PAJEOGANG_TARGET", "MILITARY_ACTION", "search_burn_and_fight", d("R3_who_expansion", { ...RANGE("1437-09-07", "1437-09-16"), note: "pack: Joseon armies -> target settlements : MILITARY_ACTION. 부대별 교전일 미상." }))),
      r("JO_LEECHEON", "JO_SEJONG", "REPORT", "victory_report", d("R7_report_on_record", { ...AT("1437-09-22"), note: "pack: field -> court : VICTORY_REPORT" })),
      r("JO_CHOEJEONGAN", "JO_SEJONG", "REPORT", "separate_victory_report", d("R7_report_on_record", { ...AT("1437-09-22"), note: "pack: '최정안 mentioned as separate victory reporter'" }))
    ],
    sourceIds: ["SRC_1437_0922"],
    evidenceSummary: "세 부대가 압록강을 건너 여러 거주지·농장을 수색·소각하고 여러 날 싸웠다(9/7~9/16). 적이 진형을 공격하자 화포를 썼다. 조선 측 보고: 살상·포획 합계 60, 조선 측 손실 황해도 자원군 1명. 대상 세력은 특정하지 않는다. 『서정록』 대조 미수행(D08).",
    eventLinks: [{ eventId: "E1437_0914", linkType: "same_campaign", causalStatus: "unknown", provenance: PV, note: "두 pack 항목 모두 '세 부대의 압록강 도하'를 기술" }],
    discrepancies: ["D08"], storyWeight: 3
  }),

  /* ============================== 1438 ~ 1439 ============================== */
  ev({
    id: "E1438_0729", title: "세종의 질의와 김종서의 범찰·동창 정세 회계",
    ...DAY("1438-07-29", "report_receipt_on_record_date"),
    theater: ["CENTRAL"], placeIds: ["PL_HANSEONG"],
    actors: ["JO_SEJONG", "JO_KIMJONGSEO"], targets: ["JO_KIMJONGSEO", "JO_SEJONG"], subjects: ["JZ_FANCHA", "JZ_DONGCHANG", "JZ_MENGGETEMUR"],
    what: [
      W("transfer", "여진 인심이 실제로 어디로 향하는지 판단 요청", "JO_SEJONG", "JO_KIMJONGSEO"),
      W("transfer", "범찰·동창에 대한 상세 평가(회계)", "JO_KIMJONGSEO", "JO_SEJONG")
    ],
    mechanisms: ["intelligence", "hoegye"],
    outcomes: [O("report_filed", "김종서의 상세 평가 회계")],
    relations: [
      r("JO_SEJONG", "JO_KIMJONGSEO", "INTELLIGENCE", "request_assessment", p({ ...BEFORE("1438-07-29"), note: "pack: 세종 -> 김종서 : INTELLIGENCE_REQUEST. 질의 시점은 회계 기사일 이전." })),
      r("JO_KIMJONGSEO", "JO_SEJONG", "REPORT", "hoegye_intelligence_assessment", p({ note: "pack: 김종서 -> 세종 : INTELLIGENCE_REPORT(회계)" }))
    ],
    sourceIds: ["SRC_1438_0729"], embeddedDocumentAuthor: "JO_KIMJONGSEO", documentType: "hoegye",
    evidenceSummary: "세종이 오랜 변경 경험을 가진 김종서에게 여진(범찰·동창)의 마음이 실제로 어디에 있는지 물었고, 김종서가 상세한 평가로 회계했다. 김종서의 근무지는 pack에 없어 장소를 붙이지 않았다.",
    storyWeight: 2
  }),
  ev({
    id: "E1438_0808", title: "[시드] 김종서 장계가 인용된 여진 정책 기사",
    dateMin: null, dateMax: "1438-08-08", datePrecision: "UNKNOWN", recordDate: "1438-08-08", dateBasis: "before_record_date",
    provenance: SEED, theaterBasis: "legacy", theater: ["UNSPECIFIED"], placeIds: [], locationNote: "원문 미확인.",
    actors: ["JO_KIMJONGSEO"], targets: ["JO_SEJONG"],
    what: [W("transfer", "장계(내용 미추출)", "JO_KIMJONGSEO", "JO_SEJONG")],
    mechanisms: ["janggye"], outcomes: [O("report_filed", "장계 인용(원문 미대조)")],
    relations: [r("JO_KIMJONGSEO", "JO_SEJONG", "REPORT", "janggye", { provenance: SEED, certainty: "unverified_seed", ...AT("1438-08-08") })],
    sourceIds: ["SRC_1438_0808"], embeddedDocumentAuthor: "JO_KIMJONGSEO", documentType: "janggye",
    evidenceSummary: "최초 anchor 목록에 있었으나 pack v1에는 내용이 없다.",
    certainty: "unverified_seed"
  }),
  ev({
    id: "E1439_0510", title: "거을가개 사망 헛소문과 김종서의 진정",
    ...BEFORE_RECORD("1439-05-10"),
    theater: ["CENTRAL", "UNSPECIFIED"], placeIds: ["PL_HANSEONG"], locationNote: "현지 장소는 pack에 없음.",
    actors: ["JZ_DOEULON", "JO_KIMJONGSEO"], targets: ["GRP_1439_GEOEUL_KIN", "JO_SEJONG"], informationSources: ["JZ_DOEULON"],
    subjects: ["JZ_GEOEULGAGAE"],
    what: [
      W("transfer", "거을가개 자손·관련자의 보복 움직임 정보", "JZ_DOEULON", "JO_KIMJONGSEO"),
      W("transfer", "소문이 거짓임을 설명", "JO_KIMJONGSEO", "GRP_1439_GEOEUL_KIN"),
      W("transfer", "치계", "JO_KIMJONGSEO", "JO_SEJONG")
    ],
    mechanisms: ["intelligence", "diplomacy", "chigye"],
    outcomes: [O("unresolved", "헛소문으로 촉발된 보복 동원 위험을 김종서가 해명으로 진정", { reportedBy: "김종서 치계" })],
    relations: [
      r("JZ_DOEULON", "JO_KIMJONGSEO", "INTELLIGENCE", "warn_of_retaliation", p({ ...BEFORE("1439-05-10") })),
      r("JO_KIMJONGSEO", "GRP_1439_GEOEUL_KIN", "DIPLOMACY", "deescalate_false_rumor", d("R4_group_placeholder", { ...BEFORE("1439-05-10"), note: "pack: 김종서 -> Jurchen actors : DIPLOMATIC_DEESCALATION" })),
      r("JO_KIMJONGSEO", "JO_SEJONG", "REPORT", "chigye", d("R7_report_on_record", { ...AT("1439-05-10"), note: "pack: 김종서 -> court : REPORT(치계)" }))
    ],
    sourceIds: ["SRC_1439_0510"], embeddedDocumentAuthor: "JO_KIMJONGSEO", documentType: "chigye",
    evidenceSummary: "거을가개가 죽었다는 헛소문이 돌아 그 자손·관련자가 보복을 생각했고, 도을온이 김종서에게 알렸다. 김종서는 소문이 거짓임을 설명해 진정시켰다(치계). 현지 사건 시점은 기사일 이전(미상). 조석강은 기사에 등장하나 역할 미기재.",
    storyWeight: 2
  }),
  ev({
    id: "E1439_0617", title: "여러 여진 정보원의 침입 계획 제보",
    ...COURT("1439-06-17"),
    theater: ["CENTRAL", "UNSPECIFIED"], placeIds: ["PL_HANSEONG"],
    actors: ["JZ_NAEUPDAE", "JZ_MAGI", "JZ_YAOSI", "JZ_RARATO", "JZ_TARONGHAPMAHOL", "JZ_DANARONGHAP", "JO_SEJONG"], targets: ["ORG_JOSEON_COURT", "JO_KIMJONGSEO"],
    informationSources: ["JZ_NAEUPDAE", "JZ_MAGI", "JZ_YAOSI", "JZ_RARATO", "JZ_TARONGHAPMAHOL", "JZ_DANARONGHAP"],
    what: [W("transfer", "침입 계획 정보", null, "ORG_JOSEON_COURT"), W("transfer", "지시", "JO_SEJONG", "JO_KIMJONGSEO")],
    mechanisms: ["intelligence", "royal_order"],
    outcomes: [O("unresolved", "일부 잠재적 침입자는 설득되어 물러났다고 보고됨"), O("decision", "세종이 김종서에게 지시")],
    relations: [
      ...["JZ_NAEUPDAE", "JZ_MAGI", "JZ_YAOSI", "JZ_RARATO", "JZ_TARONGHAPMAHOL", "JZ_DANARONGHAP"]
        .map((x) => r(x, "ORG_JOSEON_COURT", "INTELLIGENCE", "warn_of_planned_raid", d("R3_who_expansion", { ...BEFORE("1439-06-17"), note: "pack: Jurchen informants -> Joseon(수신자 미특정)" }))),
      r("JO_SEJONG", "JO_KIMJONGSEO", "POLICY", "instruction", p({ note: "pack: 세종 -> 김종서 : POLICY / INSTRUCTION" }))
    ],
    sourceIds: ["SRC_1439_0617"],
    evidenceSummary: "여러 여진인이 침입 계획을 알려 왔고 일부 잠재적 침입자는 설득되어 물러났다고 한다. 정보의 1차 수신자는 pack에 명시되지 않아 '조선 측(미특정)'으로 둔다.",
    storyWeight: 2
  }),

  /* ============================== 1440 ============================== */
  ev({
    id: "E1440_0117", title: "김종서의 북방 경영 자기 변론",
    ...COURT("1440-01-17"),
    theater: ["CENTRAL", "DUMAN"], placeIds: ["PL_HANSEONG", "PL_HOERYEONG", "PL_GYEONGWON", "PL_GYEONGHEUNG", "PL_GAPSAN", "PL_HYESAN", "PL_GILJU"],
    actors: ["ORG_SAHEONBU", "JO_KIMJONGSEO"], targets: ["JO_KIMJONGSEO", "JO_SEJONG"], decisionMakers: ["JO_SEJONG"],
    what: [W("claim", "수만 명 사민, 초지 개간, 회령·경원·경흥 성과 소보, 갑산 방비·혜산 확장, 길주성 계획, 군량 운송선 건조(자기 보고)", "JO_KIMJONGSEO", "JO_SEJONG")],
    mechanisms: ["self_report", "punishment"],
    outcomes: [O("reported_claim", "김종서가 열거한 성과(자기 변론 — 교차 확인 필요)", { subjectId: "JO_KIMJONGSEO", certainty: "contemporary_claim" })],
    relations: [
      r("ORG_SAHEONBU", "JO_KIMJONGSEO", "ACCOUNTABILITY", "impeach", p({ ...BEFORE("1440-01-17"), note: "pack: 사헌부 -> 김종서 : ACCOUNTABILITY. 탄핵 시점은 변론 기사일 이전." })),
      r("JO_KIMJONGSEO", "JO_SEJONG", "REPORT", "self_defense_memorial", p({ note: "변론을 올린 행위는 사실, 내용은 자기 보고" }))
    ],
    sourceIds: ["SRC_1440_0117"], embeddedDocumentAuthor: "JO_KIMJONGSEO",
    evidenceSummary: "김종서는 북방을 맡은 뒤 수만 명을 옮기고, 초지를 논밭으로 만들고, 회령·경원·경흥 성과 작은 보루를 쌓고, 갑산 방비와 혜산 확장, 길주성 계획, 군량 운송선 건조를 했다고 진술했다. 자기 변론이므로 내용은 contemporary_claim(D20).",
    discrepancies: ["D20"], storyWeight: 3
  }),
  ev({
    id: "E1440_0407", title: "살해 소문으로 동요한 동창·범찰 무리와 김종서의 대응",
    ...BEFORE_RECORD("1440-04-07"),
    theater: ["DUMAN"], placeIds: ["PL_HOERYEONG"],
    actors: ["JO_KIMJONGSEO"], targets: ["JZ_DONGJAEUMPA", "JZ_DONGCHANG", "JZ_FANCHA", "JO_SEJONG"],
    what: [W("transfer", "회령에 군사를 이끌고 가 정세 파악·회유", "JO_KIMJONGSEO", null)],
    mechanisms: ["diplomacy", "defense", "report"],
    outcomes: [O("unresolved", "조선이 죽이려 한다는 소문으로 도주 불안 발생 → 회유와 강제력을 함께 사용")],
    relations: [
      ...["JZ_DONGJAEUMPA", "JZ_DONGCHANG", "JZ_FANCHA"].map((x) => r("JO_KIMJONGSEO", x, "DIPLOMACY", "manage_flight_anxiety", d("R3_who_expansion", { ...BEFORE("1440-04-07"), note: "pack: 김종서 -> groups : DIPLOMATIC_MANAGEMENT" }))),
      r("JO_KIMJONGSEO", "JO_SEJONG", "REPORT", "situation_report", d("R1_court_recipient", { ...AT("1440-04-07"), note: "pack: 김종서 -> central : REPORT" }))
    ],
    sourceIds: ["SRC_1440_0407"],
    evidenceSummary: "조선이 이 무리를 죽이려 한다는 소문으로 도주 불안이 생기자 김종서가 군사를 이끌고 회령에 가서 상황을 살폈다. 회유와 강제력을 함께 썼다. 현지 행동 시점은 기사일 이전(미상).",
    storyWeight: 2
  }),
  ev({
    id: "E1440_1126", title: "함길도 진보 이설·신설에 필요한 병력 산정",
    ...DAY("1440-11-26", "report_receipt_on_record_date"),
    theater: ["DUMAN", "CENTRAL"], theaterBasis: "pack_explicit", placeIds: ["PL_HAMGIL"],
    actors: ["ORG_HAMGIL_FIELD"], targets: ["JO_SEJONG"],
    what: [W("burden", "새/이설 진보 정군 소요(300·400·400·1,000 등)", null, null, 2100, "명(합계 약)")],
    mechanisms: ["proposal", "fortification"],
    outcomes: [O("policy_change", "상호 가시성·구원·방어 지형을 중시한 배치 계획")],
    relations: [r("ORG_HAMGIL_FIELD", "JO_SEJONG", "FORTIFICATION", "defense_planning_report", d("R1_court_recipient", { note: "pack: field administration -> court : DEFENSE_PLANNING" }))],
    sourceIds: ["SRC_1440_1126"],
    evidenceSummary: "함길도 감사/지휘관(구분 미기재)이 진보 이설·신규 정착지를 검토하며 위치별 정군 300, 400, 400, 1,000 등 합계 약 2,100명을 산정했다.",
    storyWeight: 1
  }),

  /* ============================== 1441 ~ 1442 ============================== */
  ev({
    id: "E1441_0129", title: "황보인 파견: 종성 이설·온성 설치·진보 신설",
    ...COURT("1441-01-29"),
    theater: ["DUMAN"], placeIds: ["PL_JONGSEONG", "PL_SUJU", "PL_HOERYEONG", "PL_ONSEONG", "PL_GYEONGWON"],
    actors: ["ORG_JOSEON_COURT", "JO_HWANGBOIN"], targets: ["JO_HWANGBOIN"], subjects: ["GRP_1441_SETTLERS"],
    what: [W("burden", "남도·경원 민호 입거", "GRP_1441_SETTLERS", null)],
    mechanisms: ["royal_order", "fortification", "resettlement", "administrative_reorganization"],
    outcomes: [O("movement", "종성을 수주 강변 쪽으로 이설"), O("fortification", "종성·회령·경원 주변 여러 보 신설"), O("county_established", "다온평에 온성 설치")],
    relations: [
      r("ORG_JOSEON_COURT", "JO_HWANGBOIN", "COMMAND", "dispatch_inspection_restructure", p({ note: "pack: central government -> 황보인 : INSPECTION / COMMAND" })),
      r("ORG_JOSEON_COURT", "GRP_1441_SETTLERS", "RESETTLEMENT", "relocate_settlers", d("R4_group_placeholder", { ...UNKNOWN_T, note: "pack: state -> frontier : RESETTLEMENT. 이주 실행 시점 미상." }))
    ],
    sourceIds: ["SRC_1441_0129"], relatedSourceIds: ["SRC_GEO_JONGSEONG"],
    evidenceSummary: "황보인을 보내 동북 진보를 재편: 종성을 수주 강변 쪽으로 옮기고, 종성·회령 주변에 여러 보를 만들고, 다온평에 온성을 설치, 남도·경원에서 입거민을 옮기고 경원 지역에도 새 보를 두었다. 지리지의 종성 기록(세종 22·23년)과의 관계는 D17.",
    discrepancies: ["D17"], storyWeight: 2
  }),
  ev({
    id: "E1441_GEO_JONGSEONG", title: "[지리지] 종성 도호부 승격",
    dateMin: "1441-00-00", dateMax: "1441-99-99", datePrecision: "YEAR", recordDate: null, dateBasis: "year_only_geography",
    theater: ["DUMAN"], placeIds: ["PL_JONGSEONG"], actors: ["ORG_JOSEON_COURT"],
    what: [W("gain", "도호부 승격", null, null)],
    mechanisms: ["administrative_reorganization"],
    outcomes: [O("county_established", "종성 도호부 승격(세종 23년)")],
    sourceIds: ["SRC_GEO_JONGSEONG"],
    evidenceSummary: "『세종실록』 지리지(종성도호부): 세종 23년 도호부로 승격하고 남도 민호를 더 옮겼다. 연중 시점 미상.",
    discrepancies: ["D17"], storyWeight: 1
  }),
  ev({
    id: "E1441_0519", title: "건원보를 아산으로 이설",
    ...COURT("1441-05-19"),
    theater: ["DUMAN"], placeIds: ["PL_GEONWON", "PL_ASANJANG", "PL_GYEONGWON"],
    actors: ["JO_HWANGBOIN"], targets: ["JO_SEJONG"], decisionMakers: ["JO_SEJONG"],
    what: [W("transfer", "건원보 혁파·아산 이설 건의(아산 = 경원의 요충)", "JO_HWANGBOIN", "JO_SEJONG")],
    mechanisms: ["proposal", "fortification"],
    outcomes: [O("movement", "건원보를 아산장으로 이설")],
    relations: [r("JO_HWANGBOIN", "JO_SEJONG", "FORTIFICATION", "propose_fort_relocation", d("R1_court_recipient", { ...BEFORE("1441-05-19"), note: "pack: 황보인 -> court : DEFENSE_ADVICE('at Hwangbo In's request')" }))],
    sourceIds: ["SRC_1441_0519"],
    evidenceSummary: "황보인의 청으로 건원보를 없애고 아산장으로 옮겼다. 아산은 경원의 요충.",
    storyWeight: 1
  }),
  ev({
    id: "E1442_GEO_GYEONGWON", title: "[지리지] 경원 진 지휘관 설치",
    dateMin: "1442-00-00", dateMax: "1442-99-99", datePrecision: "YEAR", recordDate: null, dateBasis: "year_only_geography",
    theater: ["DUMAN"], placeIds: ["PL_GYEONGWON"], actors: ["ORG_JOSEON_COURT"],
    what: [W("gain", "진 지휘관 직 설치", null, null)],
    mechanisms: ["administrative_reorganization"],
    outcomes: [O("garrison_established", "경원 진 지휘관 설치(세종 24년)")],
    sourceIds: ["SRC_GEO_GYEONGWON"],
    evidenceSummary: "『세종실록』 지리지(경원도호부): 세종 24년 진 지휘관 설치. 연중 시점 미상.",
    storyWeight: 1
  }),
  ev({
    id: "E1442_1022", title: "침입 경보와 무단 도강 금지",
    ...COURT("1442-10-22"),
    theater: ["CENTRAL", "AMNOK", "DUMAN", "MING"], theaterBasis: "pack_explicit", placeIds: ["PL_HANSEONG", "PL_PYEONGAN", "PL_HAMGIL"],
    actors: ["GRP_1442_MING_INTEL", "JO_SEJONG"], targets: ["ORG_PYEONGAN_FIELD", "ORG_HAMGIL_FIELD"], subjects: ["JZ_FANCHA"],
    what: [W("transfer", "침입 가능성 정보", "GRP_1442_MING_INTEL", "ORG_JOSEON_COURT"), W("burden", "진보 경계 강화·매 사냥 위한 무단 도강 금지", "JO_SEJONG", null)],
    mechanisms: ["intelligence", "royal_order", "defense"],
    outcomes: [O("policy_change", "경계 강화, 매를 잡으려는 무단 도강 금지")],
    relations: [
      r("GRP_1442_MING_INTEL", "ORG_JOSEON_COURT", "INTELLIGENCE", "warn_possible_raid", d("R4_group_placeholder", { ...BEFORE("1442-10-22"), note: "pack: external intelligence -> Joseon(수신자 미특정). 수정 전에는 세종으로 연결되어 있었음." })),
      r("JO_SEJONG", "ORG_PYEONGAN_FIELD", "COMMAND", "defense_alert_and_crossing_ban", p({ note: "pack: 세종 -> frontier commanders : DEFENSE_ORDER / BORDER_CONTROL" })),
      r("JO_SEJONG", "ORG_HAMGIL_FIELD", "COMMAND", "defense_alert_and_crossing_ban", p())
    ],
    sourceIds: ["SRC_1442_1022"],
    evidenceSummary: "명 변경 군사 측에서 온 정보가 침입 가능성을 경고했다. 평안·함길 감사·지휘관에게 진보 경계를 강화하고 매를 잡으려 강을 무단으로 건너는 것을 금지했다. 범찰과 '이장가의 아들'이 언급된다.",
    storyWeight: 1
  }),

  /* ============================== 1443 ============================== */
  ev({
    id: "E1443_1005", title: "배마라가·창고리 제보로 우디거 1,000여 기 방어",
    dateMin: "1443-09-14", dateMax: "1443-10-05", datePrecision: "DAY", recordDate: "1443-10-05", dateBasis: "pack_event_range",
    dateNote: "pack: 'EVENT DATE 1443-09-14 and subsequent raid' — 침입일은 9/14 이후 미상",
    theater: ["UNSPECIFIED"], placeIds: [], locationNote: "pack v1에 방어 지점 지명이 없음. 추정하지 않음.",
    actors: ["JZ_BAEMARAGA", "JZ_CHANGGORI", "JO_HANSEORYONG", "GRP_1443_GARRISONS", "GRP_1443_UDIGE"], targets: ["GRP_1443_UDIGE"],
    beneficiaries: ["JZ_BAEMARAGA", "JZ_CHANGGORI"], informationSources: ["JZ_BAEMARAGA", "JZ_CHANGGORI"], subjects: ["JO_KIMHYOSEONG_1443"],
    what: [W("transfer", "우디거 1,000여 기 출발 사전 경보", "JZ_BAEMARAGA", "ORG_JOSEON_COURT"), W("transfer", "침입 당일 추가 경보", "JZ_CHANGGORI", "ORG_JOSEON_COURT"), W("gain", "공로 인정(포상)", "ORG_JOSEON_COURT", null)],
    mechanisms: ["intelligence", "defense", "reward"],
    outcomes: [O("victory", "준비된 방어로 공격 격퇴", { reportedBy: JR }), O("reward", "조정이 두 제보자의 공을 크게 인정")],
    relations: [
      r("JZ_BAEMARAGA", "ORG_JOSEON_COURT", "INTELLIGENCE", "advance_warning", p({ ...AT("1443-09-14"), note: "pack: 배마라가 -> Joseon(수신자 미특정). 날짜는 pack EVENT DATE." })),
      r("JO_HANSEORYONG", "GRP_1443_GARRISONS", "COMMAND", "order_garrisons_prepare", p({ ...RANGE("1443-09-14", "1443-10-05") })),
      r("JZ_CHANGGORI", "ORG_JOSEON_COURT", "INTELLIGENCE", "day_of_raid_warning", p({ ...RANGE("1443-09-14", "1443-10-05"), note: "침입 당일(일자 미상)" })),
      r("GRP_1443_GARRISONS", "GRP_1443_UDIGE", "MILITARY_CONFLICT", "repel_raid", p({ ...RANGE("1443-09-14", "1443-10-05"), note: "pack: garrisons -> attackers : DEFENSE" })),
      r("ORG_JOSEON_COURT", "JZ_BAEMARAGA", "REWARD", "reward_informant", p({ ...AT("1443-10-05"), causalStatus: "explicit", note: "pack: state -> informants : REWARD('contributions major')" })),
      r("ORG_JOSEON_COURT", "JZ_CHANGGORI", "REWARD", "reward_informant", p({ ...AT("1443-10-05"), causalStatus: "explicit" }))
    ],
    sourceIds: ["SRC_1443_1005"],
    evidenceSummary: "배마라가가 우디거 1,000여 기가 침입하러 떠났다고 미리 알렸고 한서룡이 진보들을 대비시켰다. 침입 당일 창고리가 다시 경보했다. 조선군은 대비해 공격을 물리쳤고, 조정은 두 정보원의 공을 크다고 판단했다. 김효성이 기사에 등장하나 역할 미기재(이전 김효성과 동일인 여부 미확인).",
    storyWeight: 3
  }),
  ev({
    id: "E1443_1023", title: "동소로가무의 합공 제안과 조정의 제한적 수용",
    ...COURT("1443-10-23"),
    theater: ["DUMAN", "CENTRAL"], placeIds: ["PL_HOERYEONG", "PL_HANSEONG"],
    actors: ["JZ_DONGSOROGAMU", "JO_SEJONG"], targets: ["JO_SEJONG", "JZ_DONGSOROGAMU"],
    subjects: ["ORG_YEJO", "ORG_UIJEONGBU", "JZ_DOEULON", "JZ_NANGBOKAHAN", "ORG_HOERYEONG_COMMANDER", "GRP_GUJU_UDIGE"],
    what: [
      W("claim", "성 쌓기·사신 왕래 규제 요청", "JZ_DONGSOROGAMU", "JO_SEJONG"),
      W("claim", "오진(五鎭) 군사와 여진 동맹이 함께 구주 우디거를 치자는 제안", "JZ_DONGSOROGAMU", "JO_SEJONG")
    ],
    mechanisms: ["diplomacy", "proposal", "policy_deliberation"],
    outcomes: [O("decision", "성·행정 요청은 수용, 공격 제안은 승인 회피(비확전)")],
    relations: [
      r("JZ_DONGSOROGAMU", "JO_SEJONG", "DIPLOMACY", "propose_joint_attack_and_walls", d("R1_court_recipient", { ...BEFORE("1443-10-23"), note: "pack: 동소로가무 -> court : MILITARY_PROPOSAL" })),
      r("JO_SEJONG", "JZ_DONGSOROGAMU", "DIPLOMACY", "limited_acceptance_non_escalation", d("R1_court_recipient", { note: "pack: court -> 동소로가무 : LIMITED_ACCEPTANCE / NON_ESCALATION(예조·의정부 등장)" }))
    ],
    sourceIds: ["SRC_1443_1023"],
    evidenceSummary: "동소로가무가 성 쌓기와 사신 규제를 요청하고, 오진 군사와 여진 동맹이 함께 구주 우디거를 치자고 제안했다. 조정(예조·의정부 등장)은 성·행정 요청은 받아들이되 공격 제안은 승인하지 않았다.",
    storyWeight: 2
  }),

  /* ============================== 1445 ~ 1446 ============================== */
  ev({
    id: "E1445_0519", title: "황보인의 수군 진·망대·봉수 개선안",
    ...COURT("1445-05-19"),
    theater: ["CENTRAL", "UNSPECIFIED"], placeIds: ["PL_HANSEONG"], locationNote: "개선 대상 지역은 pack 미기재.",
    actors: ["JO_HWANGBOIN"], targets: ["JO_SEJONG"],
    what: [W("transfer", "수군 진 이설·망대 재축·5인 망보·연기·화포 신호선 개선", "JO_HWANGBOIN", "JO_SEJONG")],
    mechanisms: ["proposal", "signal", "fortification"],
    outcomes: [O("policy_change", "망대 5인 배치, 연기·화포 신호 체계 개선안")],
    relations: [r("JO_HWANGBOIN", "JO_SEJONG", "FORTIFICATION", "propose_signal_system", p({ note: "pack: 황보인 -> 세종 : DEFENSE_ADVICE" }))],
    sourceIds: ["SRC_1445_0519"],
    evidenceSummary: "황보인이 수군 진을 옮기고 망대를 다시 지으며, 망보에 군사 5명을 두고 연기·화포 신호선을 개선하자고 건의했다.",
    storyWeight: 1
  }),
  ev({
    id: "E1445_0806", title: "세종, 변방 방비 해이를 경계",
    ...COURT("1445-08-06"),
    theater: ["CENTRAL", "AMNOK", "DUMAN"], theaterBasis: "pack_explicit", placeIds: ["PL_HANSEONG", "PL_PYEONGAN", "PL_HAMGIL"],
    actors: ["JO_SEJONG"], targets: ["ORG_PYEONGAN_FIELD", "ORG_HAMGIL_FIELD"],
    what: [W("transfer", "순찰·망보 해이 경계, 마름쇠·함정 방어 논의, 귀순 여진 피해 우려", "JO_SEJONG", null)],
    mechanisms: ["royal_order", "defense"],
    outcomes: [O("policy_change", "방어 장치의 효과와 우호·귀순 여진 피해 위험을 저울질")],
    relations: [
      r("JO_SEJONG", "ORG_PYEONGAN_FIELD", "FORTIFICATION", "defense_reform_order", p({ note: "pack: 세종 -> frontier commanders : DEFENSE_REFORM" })),
      r("JO_SEJONG", "ORG_HAMGIL_FIELD", "FORTIFICATION", "defense_reform_order", p())
    ],
    sourceIds: ["SRC_1445_0806"],
    evidenceSummary: "기존 순찰·망보 체계가 해이해질 위험을 지적하고, 앞선 가시 방어 실패 직전 사례를 들며 마름쇠·함정 방어를 논의했다. 그런 장치가 우호·귀순 여진을 다치게 할 수 있다고도 우려했다.",
    storyWeight: 1
  }),
  ev({
    id: "E1445_1027", title: "남은 오도리에 대한 관대함과 통제의 균형 지시",
    ...COURT("1445-10-27"),
    theater: ["CENTRAL", "DUMAN"], placeIds: ["PL_HANSEONG", "PL_HAMGIL"],
    actors: ["JO_SEJONG", "ORG_JOSEON_COURT"], targets: ["ORG_HAMGIL_DOJEOLJESA", "JZ_DONGSOROGAMU"], subjects: ["JO_HWANGBOIN"],
    what: [W("transfer", "도주를 방치하지도, 명과 문제될 만큼 강압하지도 말고 후대하며 적절히 통제하라", "JO_SEJONG", "ORG_HAMGIL_DOJEOLJESA")],
    mechanisms: ["royal_order", "diplomacy"],
    outcomes: [O("policy_change", "회유와 통제를 겸한 오도리 정책")],
    relations: [
      r("JO_SEJONG", "ORG_HAMGIL_DOJEOLJESA", "COMMAND", "instruct_odori_policy", p({ note: "pack: 세종 -> frontier commander : DIPLOMATIC_POLICY" })),
      r("ORG_JOSEON_COURT", "JZ_DONGSOROGAMU", "DIPLOMACY", "conciliation_and_control", d("R3_who_expansion", { ...UNKNOWN_T, note: "pack: state -> Odori groups : CONCILIATION / CONTROL. 실행 시점 미상." }))
    ],
    sourceIds: ["SRC_1445_1027"],
    evidenceSummary: "세종이 함길도 도절제사에게, 남은 오도리(동소로가무 등)의 도주를 그냥 두지 말되 명과 외교 문제가 될 만큼 강압하지도 말고, 후하게 대하면서 적절히 통제하라고 지시했다.",
    storyWeight: 2
  }),
  ev({
    id: "E1446_0420", title: "무창 피습과 군령·봉수 해이에 대한 책임 서술",
    ...BEFORE_RECORD("1446-04-20"),
    theater: ["UNSPECIFIED"], placeIds: ["PL_MUCHANG"], locationNote: "무창의 도·방면은 pack에 없음.",
    actors: ["GRP_1446_MUCHANG_RAIDERS", "JO_BAECHAN"], targets: ["GRP_1446_MUCHANG_VICTIMS"], victims: ["GRP_1446_MUCHANG_VICTIMS"], subjects: ["JO_KIMJAONG"],
    what: [
      W("loss", "피살", "GRP_1446_MUCHANG_VICTIMS", null, 5, "명"),
      W("loss", "피랍", "GRP_1446_MUCHANG_VICTIMS", null, 17, "명"),
      W("loss", "말 4·소 8", "GRP_1446_MUCHANG_VICTIMS", "GRP_1446_MUCHANG_RAIDERS", 12, "두")
    ],
    mechanisms: ["battle", "pursuit"],
    outcomes: [
      O("killed", "5명 피살", { subjectId: "GRP_1446_MUCHANG_VICTIMS", quantity: 5, unit: "명", reportedBy: "조선 측 기록(실록 서술)" }),
      O("captured", "17명 피랍", { subjectId: "GRP_1446_MUCHANG_VICTIMS", quantity: 17, unit: "명", reportedBy: "조선 측 기록(실록 서술)" }),
      O("defeat", "배찬이 강을 건너 추격했으나 피랍민 회수 실패", { subjectId: "JO_BAECHAN" }),
      O("attributed_failure", "실록은 실패 원인을 배찬·김자옹의 군령·봉수 경계 해이로 명시(causal: explicit)", { subjectId: "JO_KIMJAONG" })
    ],
    relations: [
      r("GRP_1446_MUCHANG_RAIDERS", "GRP_1446_MUCHANG_VICTIMS", "MILITARY_CONFLICT", "raid", d("R4_group_placeholder", { ...BEFORE("1446-04-20"), note: "pack: raiders -> Muchang : MILITARY_ATTACK" })),
      r("JO_BAECHAN", "GRP_1446_MUCHANG_RAIDERS", "MILITARY_ACTION", "pursue_across_river_failed", p({ ...BEFORE("1446-04-20") }))
    ],
    sourceIds: ["SRC_1446_0420"],
    evidenceSummary: "50여 명이 무창을 쳐 5명을 죽이고 17명을 잡아가고 말 4·소 8을 빼앗았다. 무창 수령 배찬이 강을 건너 추격했으나 피랍민을 되찾지 못했다. 실록은 실패를 배찬과 도 지휘관 김자옹의 군령·봉수 경계 해이 탓으로 명시한다. 이 책임 귀속은 편찬자 서술이라 관계가 아닌 결과로 기록(D21). 피습 시점은 기사일 이전(미상).",
    discrepancies: ["D21"], storyWeight: 2
  }),

  /* ============================== 1447 ~ 1449 ============================== */
  ev({
    id: "E1447_0107", title: "평안도 축성 부역(5,740·400명)",
    ...COURT("1447-01-07"),
    dateNote: "기사일 1/7, 공사 기간 2/15~3/15(pack)",
    theater: ["AMNOK"], placeIds: ["PL_PYEONGAN"],
    actors: ["JO_HWANGBOIN", "ORG_JOSEON_COURT"], targets: ["GRP_1447_PYEONGAN_LABOR"], victims: ["GRP_1447_PYEONGAN_LABOR"],
    what: [W("burden", "한 구간 부역", "GRP_1447_PYEONGAN_LABOR", null, 5740, "명"), W("burden", "다른 구간 부역", "GRP_1447_PYEONGAN_LABOR", null, 400, "명")],
    mechanisms: ["labor_mobilization", "fortification"],
    outcomes: [O("labor", "평안도 백성 동원"), O("fortification", "성벽·문·옹성·봉수대(공사 2/15~3/15)")],
    relations: [r("ORG_JOSEON_COURT", "GRP_1447_PYEONGAN_LABOR", "LABOR_MOBILIZATION", "mobilize_wall_labor",
      p({ ...RANGE("1447-02-15", "1447-03-15", "duration"), note: "pack: state -> population : LABOR_MOBILIZATION. 기사일과 별도로 공사 기간을 기록." }))],
    sourceIds: ["SRC_1447_0107"],
    evidenceSummary: "황보인 관련 변경 축성. 한 구간에 평안도 백성 5,740명, 다른 구간에 400명 동원. 성벽·문·옹성·봉수대. 기사일(1/7)과 공사 기간(2/15~3/15)을 따로 기록.",
    storyWeight: 1
  }),
  ev({
    id: "E1447_04L10", title: "황보인의 서북·동북 변경 통합 재편 보고",
    ...DAY("1447-04L-10", "report_receipt_on_record_date"),
    theater: ["CENTRAL", "AMNOK", "DUMAN"], placeIds: ["PL_SAMSU", "PL_HANSEONG"],
    actors: ["JO_HWANGBOIN"], targets: ["JO_SEJONG"],
    what: [W("transfer", "신설 삼수, 입거민 관리, 민 부담, 지역 방어, 민호 이동, 군마 부담, 관직·병권 재편안", "JO_HWANGBOIN", "JO_SEJONG")],
    mechanisms: ["report", "administrative_reorganization", "resettlement"],
    outcomes: [O("policy_change", "사람·군역·이동 부담·행정 자원의 재배분 제안(결정 내용 pack 미기재)")],
    relations: [r("JO_HWANGBOIN", "JO_SEJONG", "REPORT", "policy_report", d("R1_court_recipient", { note: "pack: 황보인 -> court : POLICY_REPORT" }))],
    sourceIds: ["SRC_1447_04L10"], embeddedDocumentAuthor: "JO_HWANGBOIN",
    evidenceSummary: "황보인이 새로 설치된 삼수, 입거민 행정, 민의 부담, 지역 방어, 민호 이주, 군마 부담, 관직과 병권에 관해 보고·건의했다(pack: 'integrated western/eastern frontier').",
    storyWeight: 2
  }),
  ev({
    id: "E1447_0708", title: "함길도 회령·삼수 대규모 축성",
    ...BEFORE_RECORD("1447-07-08"),
    theater: ["DUMAN"], theaterBasis: "pack_explicit", placeIds: ["PL_HOERYEONG", "PL_SAMSU", "PL_GAPSAN"],
    actors: ["JO_HWANGBOIN", "ORG_JOSEON_COURT"], targets: ["GRP_1447_HAMGIL_LABOR", "GRP_1447_GAPSAN_SAMSU_LABOR"],
    victims: ["GRP_1447_HAMGIL_LABOR", "GRP_1447_GAPSAN_SAMSU_LABOR"],
    what: [W("burden", "함길도 백성 부역", "GRP_1447_HAMGIL_LABOR", null, 8526, "명"), W("burden", "갑산·삼수 백성 부역", "GRP_1447_GAPSAN_SAMSU_LABOR", null, 1000, "명")],
    mechanisms: ["labor_mobilization", "fortification"],
    outcomes: [O("fortification", "회령·삼수 일대 석성·토성(길이·인원 기록)"), O("labor", "9,526명 동원")],
    relations: [
      r("ORG_JOSEON_COURT", "GRP_1447_HAMGIL_LABOR", "LABOR_MOBILIZATION", "mobilize_wall_labor", p({ ...BEFORE("1447-07-08"), note: "pack: state -> civilian labor : LABOR_MOBILIZATION" })),
      r("ORG_JOSEON_COURT", "GRP_1447_GAPSAN_SAMSU_LABOR", "LABOR_MOBILIZATION", "mobilize_wall_labor", p({ ...BEFORE("1447-07-08") }))
    ],
    sourceIds: ["SRC_1447_0708"],
    evidenceSummary: "회령·삼수 일대에 큰 석성·토성을 쌓았다. 함길도 백성 8,526명, 갑산·삼수 백성 1,000명. 공사 시점은 기사일 이전(미상).",
    storyWeight: 2
  }),
  ev({
    id: "E1448_0307", title: "장성 vs 읍성 우선순위 논의",
    ...COURT("1448-03-07"),
    theater: ["CENTRAL"], placeIds: ["PL_HANSEONG"],
    actors: ["JO_SEJONG", "JO_HAYEON", "JO_HWANGBOIN", "JO_PARKJONGU", "JO_KIMJONGSEO", "JO_JEONGBUN", "JO_JEONGGAPSON"], decisionMakers: ["JO_SEJONG"],
    what: [W("transfer", "대규모 침입 때 주민 피난처가 되는 읍성을 먼저 쌓자는 의견", null, "JO_SEJONG")],
    mechanisms: ["policy_deliberation"],
    outcomes: [O("unresolved", "장성 완성 우선 vs 읍성 우선 논쟁(결론 pack 미기재)")],
    relations: [
      ...["JO_HAYEON", "JO_HWANGBOIN", "JO_PARKJONGU", "JO_KIMJONGSEO", "JO_JEONGBUN", "JO_JEONGGAPSON"].map((x) => r("JO_SEJONG", x, "POLICY", "policy_query", d("R3_who_expansion", { note: "pack: 세종 -> senior ministers : POLICY_QUERY" }))),
      ...["JO_HAYEON", "JO_PARKJONGU", "JO_KIMJONGSEO", "JO_JEONGBUN"].map((x) => r(x, "JO_SEJONG", "POLICY", "advise_town_walls_first", d("R5_content_actor", { note: "pack WHAT: 하연·박종우·김종서·정분이 읍성 우선을 주장" })))
    ],
    sourceIds: ["SRC_1448_0307"],
    evidenceSummary: "장성을 먼저 완성할지 읍성을 먼저 쌓을지 논의. 하연·박종우·김종서·정분은 대규모 침입 때 주민 피난처가 되는 읍성을 먼저 쌓자고 했다. 황보인·정갑손의 입장은 pack에 없어 응답 관계를 만들지 않았다.",
    storyWeight: 2
  }),
  ev({
    id: "E1449_0707", title: "부거현을 석보로 옮겨 부령도호부·진 설치",
    ...COURT("1449-07-07"),
    theater: ["DUMAN"], placeIds: ["PL_BURYEONG", "PL_SEOKBO", "PL_HOERYEONG", "PL_SAKJU"],
    actors: ["ORG_JOSEON_COURT"],
    what: [W("gain", "도호부 승격·진 설치", null, null), W("transfer", "삭천을 삭주로 개칭", null, null)],
    mechanisms: ["administrative_reorganization", "fortification"],
    outcomes: [O("movement", "부거현을 회령의 석보로 이전"), O("county_established", "부령도호부로 승격"), O("garrison_established", "진(鎭) 설치"), O("policy_change", "삭천 → 삭주 개칭")],
    sourceIds: ["SRC_1449_0707", "SRC_GEO_BURYEONG"],
    evidenceSummary: "부거현을 회령의 석보로 옮겨 부령도호부로 올리고 진을 두었다. 삭천을 삭주로 고쳤다. 지리지(부령)도 세종 31년 같은 일을 기록. 작업상 종점일 뿐, 북방 갈등이 끝난 시점으로 서술하지 않는다.",
    storyWeight: 2
  })
];

/* ==========================================================================
   DISCREPANCIES — 하나로 합치지 않고 차이 자체를 기록한다.
   ========================================================================== */
export const DISCREPANCIES = [
  { id: "D01", type: "claim_vs_counterclaim", status: "open", eventIds: ["E1432_1209", "E1432_1221", "E1433_0310", "E1433_0610", "E1433_08L10"],
    title: "1432년 여연 침입의 주체",
    detail: "이만주 측(pack): 홀라온 우디거가 공격, 이만주는 약 600명으로 요격. 조정(pack): 진위를 명시적으로 논쟁. 맹가첩목아(pack): 임합라가 실제 우두머리, 이만주는 말림. 명 칙서(pack): 진위를 분명히 가릴 수 없음. 조선 성죄방목(v2 legacy): 파저강 세력이 홀라온으로 가장. 어느 쪽도 확정 사실로 처리하지 않는다." },
  { id: "D02", type: "event_identity", status: "resolved_in_data", eventIds: ["E1435_0113", "E1435_JANRAID"],
    title: "1435년 1월의 두 침입", detail: "1월 13일 오량합 포위(pack)와 v2의 '지난 정월' 침입(legacy)은 별개로 둔다." },
  { id: "D03", type: "actor_identity", status: "open", eventIds: ["E1435_0224"],
    title: "1435-02-24 범찰 이주 허가의 명 측 발신자",
    detail: "v2는 선덕제로 귀속했다. pack v1에 이 기사가 없어 발신 주체를 특정하지 않고 '명 조정'으로 둔다(legacy)." },
  { id: "D04", type: "entity_merge", status: "resolved_in_data", eventIds: ["E1432_1221", "E1435_0113", "E1435_JANRAID", "E1443_1005", "E1443_1023"],
    title: "여진 집단의 병합 금지", detail: "홀라온 우디거, 오량합, 1443년 우디거 1,000여 기, 구주 우디거, 오도리를 모두 별개 집단으로 둔다." },
  { id: "D05", type: "event_identity", status: "open", eventIds: ["E1435_0918"],
    title: "1435-09-18 포상의 근거 전투", detail: "pack 제목은 '여연 전투 후'. 어느 전투인지 pack이 특정하지 않아 사건 연결을 만들지 않는다." },
  { id: "D06", type: "claim_scope", status: "open", eventIds: ["E1435_JANRAID", "E1435_0613"],
    title: "정월 침입의 이만주 가담 여부(legacy)", detail: "v2 제보자 진술. pack v1에 이 기사들은 없다." },
  { id: "D07", type: "numbers", status: "open", eventIds: ["E1433_0410", "E1433_0419", "E1433_0507"],
    title: "1433년 정벌 병력·전과 수치",
    detail: "부대별 병력 합계 14,962명, 총 동원 15,000명(차이 38). 부대별 살상·포획 수치는 pack에 개별 전재되지 않아 미입력. 모든 수치는 조선 지휘부 보고." },
  { id: "D08", type: "sillok_vs_seojeongnok", status: "not_assessed", eventIds: ["E1437_0922", "E1437_0914"],
    title: "실록 vs 『서정록』",
    detail: "서지(pack v1): 1516 목판본 1책, 이순·윤금손 발문, 규장각 소장, 1432~1437 범위, 참고 역본 임홍빈 역편(1989). 본문 미확보로 대조하지 않았다. 차이가 없다는 뜻이 아니다." },
  { id: "D09", type: "unsupported_v2_record", status: "resolved_in_data", eventIds: ["E1434_1024"],
    title: "맹가첩목아 사후 상태", detail: "지리지(pack v1)는 '맹가첩목아 사후' 알목하 재편을 서술한다. 사망일은 pack에 없다." },
  { id: "D10", type: "actor_attribution", status: "resolved_in_data", eventIds: ["E1435_0918"],
    title: "기관 행위의 개인 귀속", detail: "pack v1은 관계 주체를 국가(state)로 기록하므로 ORG_JOSEON_COURT로 두고, 병조·세종은 행위자로 표시. 개인(판서)에게 귀속하지 않는다." },
  { id: "D11", type: "inferred_hierarchy", status: "resolved_in_data", eventIds: ["E1435_0113"],
    title: "여연 수비 지휘관 사이 상하관계", detail: "pack v1은 네 사람이 각각 수비군을 지휘했다고 기록. 서로 간 상하관계를 만들지 않는다." },
  { id: "D12", type: "target_identity", status: "open", eventIds: ["E1433_0419"],
    title: "1433 정벌 부대↔공격 대상 대응", detail: "pack은 목표 지점 목록과 'commanders -> target settlements'만 기록. 이순몽→이만주 채리, 김효성→임합라 부모 채리, 최윤덕→임합라 채리의 대응은 v2(legacy)다." },
  { id: "D13", type: "date", status: "resolved_in_data", eventIds: ["E1433_0410", "E1433_0419", "E1435_0113", "E1437_0914", "E1437_0922", "E1443_1005", "E1447_0107"],
    title: "사건일과 기사 게재일의 차이", detail: "dateMin/dateMax/recordDate와 관계별 시각 범위로 분리. 기사일 이전의 미상 시점은 '기사일 이전'으로만 표기." },
  { id: "D14", type: "unsupported_v2_record", status: "resolved_in_data", eventIds: ["E1432_1209"],
    title: "1432-12-09 기사의 대신 논의", detail: "v2가 붙였던 대신 논의는 pack v1 해당 기사 WHO/WHAT에 없어 데이터에서 제거했다." },
  { id: "D15", type: "date", status: "open", eventIds: ["E1432_INVEST"],
    title: "홍사석 조사 파견", detail: "pack은 12/21 시점에 홍사석이 '돌아올 조사관'이었다는 것만 알려 준다. 파견 주체·날짜는 v2(legacy)." },
  { id: "D16", type: "addressee", status: "resolved_in_data", eventIds: ["E1433_08L10"],
    title: "1433 윤8월 명 칙서의 여진 측 당사자", detail: "pack WHO의 양목답올·살만답실리·맹가첩목아·범찰·이만주·아라답에게 관계를 두고(R3), 여진 측 전달 시점은 미상으로 둔다." },
  { id: "D17", type: "date", status: "open", eventIds: ["E1441_0129", "E1441_GEO_JONGSEONG"],
    title: "종성 치소 이동 연도", detail: "지리지(종성)는 치소 이동을 세종 22년(1440), 도호부 승격을 세종 23년으로, 실록 1441-01-29 기사는 황보인 파견과 함께 종성 이설을 기록. 병합하지 않고 둘 다 보존." },
  { id: "D18", type: "person_identity", status: "open", eventIds: ["E1435_0113", "E1437_0914", "E1443_1005"],
    title: "동명 인물의 후기 등장", detail: "1437 이천 본군의 홍사석·이진, 1443 기사의 김효성은 이전 기사의 동명 인물과 같은지 pack이 연결하지 않는다. 별도 노드(possibleSameAs)로 두고 자동 병합하지 않는다." },
  { id: "D19", type: "numbers", status: "resolved_in_data", eventIds: ["E1435_0113"],
    title: "1435-01 여연성 포위 피해 수치", detail: "pack 수치(4명 부상·1명 사망 등)를 사용하고 v2의 추격 서술은 legacy 관계로만 남긴다." },
  { id: "D20", type: "self_report", status: "open", eventIds: ["E1440_0117"],
    title: "김종서 자기 변론의 성과 목록", detail: "탄핵에 대한 변론이므로 사민·축성 목록은 자기 보고(contemporary_claim)." },
  { id: "D21", type: "attribution_by_compiler", status: "open", eventIds: ["E1446_0420"],
    title: "무창 피습 책임의 귀속 주체", detail: "실록 서술이 배찬·김자옹의 해이를 원인으로 명시. 편찬자 서술이며 처벌 행위는 pack에 없어 관계를 만들지 않았다." }
];
