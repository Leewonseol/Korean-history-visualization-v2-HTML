/* ==========================================================================
   EVENTS — 단일 source of truth.
   네트워크 edge는 EVENTS[*].relations 에서만 파생된다(model/deriveEdges.js).

   날짜 규칙(methodology.md 참조)
   - 모든 날짜는 실록 음력 날짜 'YYYY-MM-DD'. 윤달은 'YYYY-MML-DD'(예: 1433-08L-10).
   - eventDate: 실제 사건 발생일. 알 수 없으면 recordDate와 같게 두고 datePrecision='record_date_only'.
   - 월만 알면 day='00', datePrecision='month'.
   - recordDate: 실록 기사 게재일(= 사료 date).

   relation 기본값: startDate=endDate=eventDate, direction='directed',
   certainty='confirmed', causalStatus='explicit', sourceIds=event.sourceIds.

   내용 근거: 이 파일의 1432~1435 사건은 v2 데이터셋의 요약문(실록 기사 링크 포함)에서
   이관한 것이며(verification='inherited_v2'), 요약문에 없는 사실은 추가하지 않았다.
   1437~1449 사건은 사용자가 제시한 anchor 기사의 설명뿐이므로 'unverified_seed'다.
   ========================================================================== */

function r(source, target, layer, relationType, certainty = "confirmed", extra = {}) {
  return { source, target, layer, relationType, certainty, ...extra };
}
const BASE = {
  datePrecision: "day", recordDate: null, theater: [], placeIds: [], locationNote: "",
  actors: [], targets: [], beneficiaries: [], victims: [], decisionMakers: [], informationSources: [], subjects: [],
  what: [], mechanisms: [], outcomes: [], relations: [], sourceIds: [],
  embeddedDocumentAuthor: null, documentType: null, evidenceSummary: "", discrepancies: [],
  certainty: "confirmed", storyWeight: 1, verification: "inherited_v2", causedBy: []
};
function ev(o) { return { ...BASE, ...o, recordDate: o.recordDate || o.eventDate }; }

export const EVENTS = [
  /* ============================== 1432 ============================== */
  ev({
    id: "E1432_01", title: "여연 침입과 박초의 추격",
    eventDate: "1432-12-09", recordDate: "1432-12-09", datePrecision: "record_date_only",
    theater: ["AMNOK", "CENTRAL"], placeIds: ["PL_YEOYEON", "PL_GANGGYE", "PL_HANSEONG"],
    actors: ["GRP_1432_RAIDERS", "JO_PARKCHO"], targets: ["GRP_1432_YEOYEON_RESIDENTS"],
    victims: ["GRP_1432_YEOYEON_RESIDENTS", "GRP_1432_YEOYEON_GARRISON"], decisionMakers: ["JO_SEJONG"],
    what: [
      { type: "loss", value: "사람·재물 약탈", quantity: null, unit: null, giverId: "GRP_1432_YEOYEON_RESIDENTS", receiverId: "GRP_1432_RAIDERS" },
      { type: "recover", value: "피로인", quantity: 26, unit: "명", giverId: "GRP_1432_RAIDERS", receiverId: "JO_PARKCHO" },
      { type: "recover", value: "말", quantity: 30, unit: "필", giverId: "GRP_1432_RAIDERS", receiverId: "JO_PARKCHO" },
      { type: "recover", value: "소", quantity: 50, unit: "마리", giverId: "GRP_1432_RAIDERS", receiverId: "JO_PARKCHO" }
    ],
    mechanisms: ["battle", "pursuit", "policy_deliberation"],
    outcomes: [
      { type: "killed", subjectId: "GRP_1432_YEOYEON_GARRISON", quantity: 13, unit: "명", reportedBy: "조선 측 보고", description: "조선군 전사" },
      { type: "wounded", subjectId: "GRP_1432_YEOYEON_GARRISON", quantity: 25, unit: "명", reportedBy: "조선 측 보고", description: "조선군 부상" },
      { type: "recovered", subjectId: "GRP_1432_YEOYEON_RESIDENTS", quantity: 26, unit: "명", reportedBy: "조선 측 보고", description: "피로인 탈환" },
      { type: "decision", subjectId: "JO_SEJONG", description: "명 경계를 넘어 추격할 수 있는지 논의하게 함" }
    ],
    relations: [
      r("GRP_1432_RAIDERS", "GRP_1432_YEOYEON_RESIDENTS", "MILITARY_CONFLICT", "raid"),
      r("JO_PARKCHO", "GRP_1432_RAIDERS", "MILITARY_CONFLICT", "pursue_and_engage"),
      r("JO_HWANGHUI", "JO_SEJONG", "POLICY", "advise"),
      r("JO_MAENGSASEONG", "JO_SEJONG", "POLICY", "advise"),
      r("JO_GWONJIN", "JO_SEJONG", "POLICY", "advise"),
      r("JO_CHOESAGANG", "JO_SEJONG", "POLICY", "advise")
    ],
    sourceIds: ["SRC_1432_1209"],
    evidenceSummary: "야인 기병 약 400기가 여연 경내에 침입해 사람과 재물을 약탈했다. 강계절제사 박초가 추격해 포로 26명, 말 30필, 소 50마리를 되찾았고 조선군은 전사 13명·부상 25명. 세종은 명의 경계를 넘어 추격할 수 있는지 논의하게 했다. 침입 발생일은 기사에 특정되지 않아 게재일로 둔다. 국왕에게 이 사건을 보고한 관원은 v2 요약에 없어 REPORT 관계를 만들지 않았다.",
    discrepancies: ["D01"], storyWeight: 3
  }),
  ev({
    id: "E1432_02", title: "세종, 홍사석을 현장 조사에 파견",
    eventDate: "1432-12-09", datePrecision: "record_date_only",
    theater: ["CENTRAL", "AMNOK"], placeIds: ["PL_HANSEONG", "PL_GANGGYE", "PL_YEOYEON"],
    actors: ["JO_SEJONG"], targets: ["JO_HONGSASEOK"], decisionMakers: ["JO_SEJONG"],
    what: [{ type: "transfer", value: "현장 조사 임무", quantity: null, unit: null, giverId: "JO_SEJONG", receiverId: "JO_HONGSASEOK" }],
    mechanisms: ["royal_order", "investigation"],
    outcomes: [{ type: "investigation", subjectId: "JO_HONGSASEOK", description: "강계·여연의 실제 접전 경위 조사 착수" }],
    relations: [r("JO_SEJONG", "JO_HONGSASEOK", "INVESTIGATION", "dispatch_to_investigate")],
    sourceIds: ["SRC_1432_1209"],
    evidenceSummary: "세종이 홍사석을 강계·여연에 보내 실제 접전 경위를 조사하게 했다. 조사 결과 보고는 v2 데이터에 없다.",
    causedBy: [{ eventId: "E1432_01", causalStatus: "explicit", note: "같은 기사에서 침입 경위 조사를 위해 파견" }],
    storyWeight: 2
  }),
  ev({
    id: "E1432_03", title: "이만주 측 해명과 유을합의 포로 송환",
    eventDate: "1432-12-21",
    theater: ["AMNOK", "CENTRAL"], placeIds: ["PL_HANSEONG"], locationNote: "송환이 이루어진 정확한 장소는 v2 요약에 없음.",
    actors: ["JZ_MANJU", "JZ_YUEULHAP"], targets: ["JO_SEJONG"], beneficiaries: ["GRP_1432_YEOYEON_RESIDENTS"],
    decisionMakers: ["JO_SEJONG"], subjects: ["GRP_HOLLAON"],
    what: [
      { type: "transfer", value: "조선인 포로 송환", quantity: 7, unit: "명", giverId: "JZ_YUEULHAP", receiverId: "JO_SEJONG" },
      { type: "claim", value: "이만주가 600명을 동원해 조선 포로 64명을 빼앗아 보호 중이라는 주장", quantity: 64, unit: "명(주장)", giverId: "JZ_MANJU", receiverId: "JO_SEJONG" }
    ],
    mechanisms: ["envoy", "claim", "policy_deliberation"],
    outcomes: [
      { type: "recovered", subjectId: "GRP_1432_YEOYEON_RESIDENTS", quantity: 7, unit: "명", description: "포로 7명 송환" },
      { type: "claim_made", subjectId: "JZ_MANJU", description: "침입 주체는 홀라온 올적합 100여 명이라는 이만주 측 주장", certainty: "contemporary_claim" },
      { type: "unresolved", description: "1432년 침입의 실제 주도자는 이 시점에 확정되지 않음" }
    ],
    relations: [
      r("JZ_YUEULHAP", "JO_SEJONG", "DIPLOMACY", "return_captives", "confirmed", { note: "수신자는 조선 조정(국왕). 실제 접수 관원 미상." }),
      r("JZ_MANJU", "JO_SEJONG", "DIPLOMACY", "convey_explanation", "confirmed", { note: "이만주 측 해명이 조선에 전달되었다는 사실. 해명 내용의 진위는 별개." }),
      r("JZ_MANJU", "GRP_HOLLAON", "CLAIM", "attribute_raid_to", "contemporary_claim", { causalStatus: "unknown" }),
      r("JO_ANSUNGSEON", "JO_SEJONG", "POLICY", "advise"),
      r("JO_KIMJONGSEO", "JO_SEJONG", "POLICY", "advise")
    ],
    sourceIds: ["SRC_1432_1221"],
    evidenceSummary: "이만주 관하 천호 유을합이 포로 7명을 데려왔다. 이만주 측은 '홀라온 올적합 100여 명이 침입했고, 자신은 600명을 동원해 조선 포로 64명을 빼앗아 보호하고 있다'고 주장했다. 유을합 파견을 이만주가 명했다는 문구는 v2 요약에 없어 COMMAND 관계를 만들지 않았다.",
    discrepancies: ["D01"], certainty: "disputed", storyWeight: 3
  }),

  /* ============================== 1433 ============================== */
  ev({
    id: "E1433_01", title: "파저강 대응을 둘러싼 비밀 의견 수렴",
    eventDate: "1433-02-15",
    theater: ["CENTRAL"], placeIds: ["PL_HANSEONG"],
    actors: ["JO_SEJONG", "JO_HWANGHUI", "JO_MAENGSASEONG", "JO_GWONJIN", "JO_HEOJO", "JO_ANSUN", "JO_JEONGHEUMJI", "JO_LEESUNMONG", "JO_CHOESAGANG"],
    decisionMakers: ["JO_SEJONG"],
    what: [{ type: "transfer", value: "파저강 세력의 죄목과 접대·토벌 방법에 대한 의견", quantity: null, unit: null, giverId: "JO_HWANGHUI", receiverId: "JO_SEJONG" }],
    mechanisms: ["policy_deliberation"],
    outcomes: [{ type: "policy_change", description: "강경론·신중론 등 서로 다른 견해가 제출됨(결정은 2월 26일)" }],
    relations: [
      ...["JO_HWANGHUI", "JO_MAENGSASEONG", "JO_GWONJIN", "JO_HEOJO", "JO_ANSUN", "JO_JEONGHEUMJI", "JO_LEESUNMONG", "JO_CHOESAGANG"]
        .flatMap((p) => [r("JO_SEJONG", p, "POLICY", "solicit_opinion"), r(p, "JO_SEJONG", "POLICY", "advise")])
    ],
    sourceIds: ["SRC_1433_0215"],
    evidenceSummary: "세종이 정벌 의도를 숨긴 채 의정부·육조·삼군도진무에게 파저강 세력의 죄목과 접대·토벌 방법을 비밀리에 제출하게 했고, 황희·맹사성·권진·허조·안순·정흠지·이순몽·최사강 등이 서로 다른 견해를 제시했다. 개인별 견해 내용은 원문 대조 후 relation note에 기록할 것.",
    causedBy: [{ eventId: "E1432_03", causalStatus: "sequence_only", note: "" }],
    storyWeight: 2
  }),
  ev({
    id: "E1433_02", title: "파저강 정벌 결정과 최윤덕 지휘 체제",
    eventDate: "1433-02-26",
    theater: ["CENTRAL"], placeIds: ["PL_HANSEONG"],
    actors: ["JO_SEJONG"], targets: ["JO_CHOEYUNDEOK"], decisionMakers: ["JO_SEJONG"],
    what: [{ type: "transfer", value: "정벌 지휘권", quantity: null, unit: null, giverId: "JO_SEJONG", receiverId: "JO_CHOEYUNDEOK" }],
    mechanisms: ["royal_order", "appointment"],
    outcomes: [{ type: "decision", description: "'이미 파저강을 토벌할 계책을 정하였다'(v2 인용)" }, { type: "appointment", subjectId: "JO_CHOEYUNDEOK", description: "원정 핵심 지휘관" }],
    relations: [r("JO_SEJONG", "JO_CHOEYUNDEOK", "COMMAND", "appoint_expedition_commander")],
    sourceIds: ["SRC_1433_0226"],
    evidenceSummary: "실록이 '이미 파저강을 토벌할 계책을 정하였다'고 기록했고, 최윤덕을 원정의 핵심 지휘관으로 두는 체제가 확정되었다(v2 요약). 지휘체계 논의의 세부(다른 지휘관 배치안)는 원문 대조 필요.",
    causedBy: [{ eventId: "E1433_01", causalStatus: "sequence_only", note: "" }],
    storyWeight: 3
  }),
  ev({
    id: "E1433_S0307", title: "[시드] 최윤덕의 병력·진격로 건의",
    eventDate: "1433-03-07",
    theater: ["AMNOK", "CENTRAL"], placeIds: ["PL_PYEONGAN", "PL_HANSEONG"],
    actors: ["JO_CHOEYUNDEOK"], targets: ["JO_SEJONG"], decisionMakers: ["JO_SEJONG"],
    what: [{ type: "transfer", value: "병력 규모·진격로 건의(세부 미확인)", quantity: null, unit: null, giverId: "JO_CHOEYUNDEOK", receiverId: "JO_SEJONG" }],
    mechanisms: ["proposal"],
    outcomes: [{ type: "report_filed", description: "건의 내용·채택 여부 원문 미확인" }],
    relations: [r("JO_CHOEYUNDEOK", "JO_SEJONG", "POLICY", "propose_troops_and_routes", "unverified_seed", { causalStatus: "unknown" })],
    sourceIds: ["SRC_1433_0307"], embeddedDocumentAuthor: "JO_CHOEYUNDEOK",
    evidenceSummary: "사용자 제시 anchor(wda_11503007_001)의 설명만 있음. 이번 세션에서 원문 접근이 차단되어 병력 수·진격로·인용 문서 유형을 기입하지 않았다.",
    certainty: "unverified_seed", verification: "seed_unverified", storyWeight: 1
  }),
  ev({
    id: "E1433_03", title: "성죄방목 작성과 공식 문죄",
    eventDate: "1433-03-10",
    theater: ["CENTRAL"], placeIds: ["PL_HANSEONG"],
    actors: ["JO_SEJONG", "JO_ANSUNGSEON", "JO_KIMCHEONG"], targets: ["JZ_MANJU", "JZ_SIMTANAPNO"], decisionMakers: ["JO_SEJONG"],
    what: [{ type: "claim", value: "파저강 세력이 홀라온으로 가장해 강계·여연을 침범했다는 공식 죄목", quantity: null, unit: null, giverId: "JO_SEJONG", receiverId: "JZ_MANJU" }],
    mechanisms: ["accusation", "proclamation"],
    outcomes: [{ type: "claim_made", subjectId: "JO_SEJONG", description: "조선의 공식 죄목 제기(죄목 내용의 진위는 별개)", certainty: "confirmed" }],
    relations: [
      r("JO_ANSUNGSEON", "JO_SEJONG", "POLICY", "draft_document"),
      r("JO_KIMCHEONG", "JO_SEJONG", "POLICY", "draft_document"),
      r("JO_SEJONG", "JZ_MANJU", "CLAIM", "official_accusation", "confirmed", { note: "문죄했다는 행위는 확인된 사실이나, 죄목 내용은 조선 측 주장." }),
      r("JO_SEJONG", "JZ_SIMTANAPNO", "CLAIM", "official_accusation", "confirmed", { note: "이만주와의 상하관계는 기사상 불명." })
    ],
    sourceIds: ["SRC_1433_0310"],
    evidenceSummary: "안숭선·김청이 성죄방목을 작성했다. 조선은 파저강 세력이 평소 조선의 구제를 받았음에도 홀라온으로 가장해 강계·여연을 침범하고 인민·가축을 살상·약탈했다는 공식 죄목을 제시했다.",
    causedBy: [{ eventId: "E1432_01", causalStatus: "explicit", note: "죄목이 강계·여연 침범을 직접 거론" }],
    discrepancies: ["D01"], storyWeight: 2
  }),
  ev({
    id: "E1433_04", title: "맹가첩목아 관련 조건부 비밀 지시",
    eventDate: "1433-03-25",
    theater: ["CENTRAL", "AMNOK"], placeIds: ["PL_HANSEONG"],
    actors: ["JO_SEJONG"], targets: ["JO_CHOEYUNDEOK"], subjects: ["JZ_MENGGETEMUR"], decisionMakers: ["JO_SEJONG"],
    what: [{ type: "transfer", value: "교전 규칙(가담 시 공격, 불가담·귀순 시 불살)", quantity: null, unit: null, giverId: "JO_SEJONG", receiverId: "JO_CHOEYUNDEOK" }],
    mechanisms: ["royal_order"],
    outcomes: [{ type: "policy_change", description: "여진 전체를 하나의 적으로 취급하지 않고 가담 여부로 대응을 구분" }],
    relations: [r("JO_SEJONG", "JO_CHOEYUNDEOK", "COMMAND", "secret_instruction", "confirmed", { note: "맹가첩목아는 지시의 '대상'일 뿐 관계 당사자가 아니므로 edge를 만들지 않음." })],
    sourceIds: ["SRC_1433_0325"],
    evidenceSummary: "세종이 최윤덕에게, 맹가첩목아가 적을 도우면 공격하되 돕지 않고 귀순하면 죽이지 말라고 비밀리에 지시했다.",
    storyWeight: 2
  }),
  ev({
    id: "E1433_05", title: "정벌군 강계 집결과 7로 편성",
    eventDate: "1433-04-10", recordDate: "1433-05-07",
    theater: ["AMNOK"], placeIds: ["PL_GANGGYE", "PL_PYEONGAN", "PL_HWANGHAE"],
    actors: ["JO_CHOEYUNDEOK", "JO_LEESUNMONG", "JO_CHOEHAESAN", "JO_LEEGAK", "JO_LEEJINGSEOK", "JO_KIMHYOSEONG", "JO_HONGSASEOK"],
    targets: ["GRP_1433_EXPEDITION_TROOPS"], decisionMakers: ["JO_CHOEYUNDEOK"],
    what: [
      { type: "burden", value: "평안도군 동원", quantity: 10000, unit: "명", giverId: "GRP_1433_EXPEDITION_TROOPS", receiverId: "JO_CHOEYUNDEOK" },
      { type: "burden", value: "황해도군 동원", quantity: 5000, unit: "명", giverId: "GRP_1433_EXPEDITION_TROOPS", receiverId: "JO_CHOEYUNDEOK" }
    ],
    mechanisms: ["mobilization", "appointment"],
    outcomes: [{ type: "movement", subjectId: "GRP_1433_EXPEDITION_TROOPS", quantity: 15000, unit: "명", reportedBy: "조선 측 보고", description: "강계 집결, 7개 부대 편성" }],
    relations: [
      ...["JO_LEESUNMONG", "JO_CHOEHAESAN", "JO_LEEGAK", "JO_LEEJINGSEOK", "JO_KIMHYOSEONG", "JO_HONGSASEOK"]
        .map((p) => r("JO_CHOEYUNDEOK", p, "COMMAND", "assign_route_command")),
      r("JO_CHOEYUNDEOK", "GRP_1433_EXPEDITION_TROOPS", "COMMAND", "command_expedition_army", "interpretation",
        { causalStatus: "strongly_implied", note: "총지휘관과 동원 군졸 사이의 지휘 관계. 기사가 명령 행위를 직접 서술했는지는 원문 확인 필요." })
    ],
    sourceIds: ["SRC_1433_0507"],
    evidenceSummary: "평안도군 1만과 황해도군 5천이 강계에 집결해 7개 부대로 나뉘었다(5월 7일 보고 기사에 수록).",
    causedBy: [{ eventId: "E1433_02", causalStatus: "explicit", note: "정벌 결정의 실행" }],
    storyWeight: 3
  }),
  ev({
    id: "E1433_06", title: "제1차 파저강 정벌 공격",
    eventDate: "1433-04-19", recordDate: "1433-05-07",
    theater: ["AMNOK"], placeIds: ["PL_PAJEOGANG", "PL_CHAERI_IMANJU", "PL_CHAERI_IMHALA", "PL_CHAERI_IMHALA_PARENTS"],
    actors: ["JO_CHOEYUNDEOK", "JO_LEESUNMONG", "JO_KIMHYOSEONG"], targets: ["JZ_MANJU", "JZ_IMHALA"],
    what: [{ type: "loss", value: "채리(거주지) 공격 피해(규모는 원문 대조 필요)", quantity: null, unit: null, giverId: "JZ_MANJU", receiverId: "JO_CHOEYUNDEOK" }],
    mechanisms: ["battle"],
    outcomes: [{ type: "victory", reportedBy: "조선 측 보고", description: "조선 측은 승전으로 보고. 전과·사상자 수치는 원문 대조 후 입력(현재 미기입)." }],
    relations: [
      r("JO_LEESUNMONG", "JZ_MANJU", "MILITARY_CONFLICT", "attack_settlement"),
      r("JO_KIMHYOSEONG", "JZ_IMHALA", "MILITARY_CONFLICT", "attack_settlement_of_kin", "confirmed", { note: "공격 대상은 임합라 본인이 아니라 '임합라 부모의 채리'." }),
      r("JO_CHOEYUNDEOK", "JZ_IMHALA", "MILITARY_CONFLICT", "attack_settlement", "confirmed", { note: "실록이 '정적(正賊)'이라 칭한 임합라의 채리." })
    ],
    sourceIds: ["SRC_1433_0507"],
    evidenceSummary: "이순몽은 이만주의 채리를, 김효성은 임합라 부모의 채리를, 최윤덕은 임합라의 채리를 공격했다. 임합라는 이만주의 확정된 부하로 서술되지 않는다. 이만주가 항복했다는 서술은 없다.",
    causedBy: [{ eventId: "E1433_05", causalStatus: "explicit", note: "" }],
    discrepancies: ["D07", "D12"], storyWeight: 3
  }),
  ev({
    id: "E1433_07", title: "최윤덕의 전과·사상자 보고와 군령 위반 보고",
    eventDate: "1433-05-07", datePrecision: "record_date_only",
    theater: ["AMNOK", "CENTRAL"], placeIds: ["PL_HANSEONG"],
    actors: ["JO_CHOEYUNDEOK"], targets: ["JO_SEJONG"], informationSources: ["JO_CHOEYUNDEOK"],
    what: [{ type: "transfer", value: "전과·사상자·군령위반 보고", quantity: null, unit: null, giverId: "JO_CHOEYUNDEOK", receiverId: "JO_SEJONG" }],
    mechanisms: ["report"],
    outcomes: [
      { type: "report_filed", subjectId: "JO_CHOEYUNDEOK", description: "전과·사상자 보고(수치는 조선 측 보고로만 존재)" },
      { type: "unresolved", description: "일부 지휘관의 군령 위반 보고(개별 인명 미특정)" }
    ],
    relations: [r("JO_CHOEYUNDEOK", "JO_SEJONG", "REPORT", "battle_report")],
    sourceIds: ["SRC_1433_0507"], embeddedDocumentAuthor: "JO_CHOEYUNDEOK", documentType: null,
    evidenceSummary: "최윤덕이 전과·사상자와 함께 일부 지휘관의 군령 위반도 보고했다. 보고문의 문서 유형(치계/장계 등)은 원문 확인 전이라 비워둔다.",
    causedBy: [{ eventId: "E1433_06", causalStatus: "explicit", note: "정벌 결과 보고" }],
    discrepancies: ["D07"], storyWeight: 3
  }),
  ev({
    id: "E1433_08", title: "정벌 이유의 중외 포고 건의·승인",
    eventDate: "1433-05-11",
    theater: ["CENTRAL"], placeIds: ["PL_HANSEONG"],
    actors: ["ORG_YEJO", "JO_SEJONG"], decisionMakers: ["JO_SEJONG"],
    what: [{ type: "transfer", value: "농번기 대군 동원 이유 공표안", quantity: null, unit: null, giverId: "ORG_YEJO", receiverId: "JO_SEJONG" }],
    mechanisms: ["proposal", "proclamation"],
    outcomes: [{ type: "proclamation", description: "'경내 인민이 확실히 알도록 중외에 포고' 건의를 세종이 승인" }],
    relations: [r("ORG_YEJO", "JO_SEJONG", "POLICY", "propose_proclamation")],
    sourceIds: ["SRC_1433_0511"],
    evidenceSummary: "예조가 농사철에 대군을 동원한 이유를 중외에 포고하자고 건의했고 세종이 승인했다.",
    causedBy: [{ eventId: "E1433_06", causalStatus: "strongly_implied", note: "정벌 동원의 사후 정당화" }],
    storyWeight: 1
  }),
  ev({
    id: "E1433_09", title: "파저강 전사자·병사자 보상",
    eventDate: "1433-05-17",
    theater: ["CENTRAL"], placeIds: ["PL_HANSEONG"],
    actors: ["ORG_JOSEON_COURT"], beneficiaries: ["GRP_1433_WARDEAD"], victims: ["GRP_1433_WARDEAD"],
    what: [
      { type: "gain", value: "전사 군관 쌀·콩 각 5석", quantity: 5, unit: "석", giverId: "ORG_JOSEON_COURT", receiverId: "GRP_1433_WARDEAD" },
      { type: "gain", value: "전사 군졸 각 3석 + 복호 5년", quantity: 3, unit: "석", giverId: "ORG_JOSEON_COURT", receiverId: "GRP_1433_WARDEAD" },
      { type: "gain", value: "병사 군관 각 3석, 병사 군졸 각 2석 + 복호 2년", quantity: null, unit: null, giverId: "ORG_JOSEON_COURT", receiverId: "GRP_1433_WARDEAD" },
      { type: "gain", value: "전사자 초혼·치제", quantity: null, unit: null, giverId: "ORG_JOSEON_COURT", receiverId: "GRP_1433_WARDEAD" }
    ],
    mechanisms: ["welfare"],
    outcomes: [{ type: "welfare", subjectId: "GRP_1433_WARDEAD", description: "곡식·복호·초혼치제" }],
    relations: [r("ORG_JOSEON_COURT", "GRP_1433_WARDEAD", "WELFARE", "grant_compensation", "confirmed",
      { note: "v2는 세종을 주체로 두었으나 요약문은 수동형이라 결정 주체(왕명 여부)를 원문 확인 전까지 '조정'으로 둔다." })],
    sourceIds: ["SRC_1433_0517"],
    evidenceSummary: "파저강 전사 군관은 쌀·콩 각 5석, 군졸은 각 3석과 5년 복호, 병사자는 군관 각 3석·군졸 각 2석과 2년 복호. 전사자 초혼·치제.",
    causedBy: [{ eventId: "E1433_06", causalStatus: "explicit", note: "'파저강 전사' 보상" }],
    discrepancies: ["D10"], storyWeight: 2
  }),
  ev({
    id: "E1433_10", title: "자성군 설치",
    eventDate: "1433-06-01",
    theater: ["AMNOK"], placeIds: ["PL_JASEONG"],
    actors: ["ORG_JOSEON_COURT"],
    what: [{ type: "gain", value: "신설 군(자성군)", quantity: null, unit: null, giverId: null, receiverId: "ORG_JOSEON_COURT" }],
    mechanisms: ["administrative_reorganization"],
    outcomes: [{ type: "county_established", description: "여연·강계 사이 자작리에 자성군 설치" }],
    sourceIds: ["SRC_1433_0601"],
    evidenceSummary: "여연과 강계 사이 요충지 자작리에 자성군을 설치했다. 정벌과의 인과는 기사에서 확인되지 않아 sequence_only로 둔다. 4군 형성을 파저강 정벌 하나의 직접 결과로 단순화하지 않는다.",
    causedBy: [{ eventId: "E1433_06", causalStatus: "sequence_only", note: "" }],
    storyWeight: 2
  }),
  ev({
    id: "E1433_11", title: "맹가첩목아의 진술: 진범은 임합라",
    eventDate: "1433-06-10", datePrecision: "record_date_only",
    theater: ["UNSPECIFIED"], placeIds: [], locationNote: "진술 장소는 v2 요약에 없음.",
    actors: ["JZ_MENGGETEMUR"], targets: ["JO_JIHAM"], subjects: ["JZ_IMHALA", "JZ_MANJU"], informationSources: ["JZ_MENGGETEMUR"],
    what: [{ type: "transfer", value: "1432 침입 주범에 대한 진술", quantity: null, unit: null, giverId: "JZ_MENGGETEMUR", receiverId: "JO_JIHAM" }],
    mechanisms: ["intelligence", "claim"],
    outcomes: [{ type: "claim_made", subjectId: "JZ_MENGGETEMUR", description: "'진짜 파저강 도적 괴수는 임합라이며 이만주는 오히려 말렸다'", certainty: "contemporary_claim" }],
    relations: [
      r("JZ_MENGGETEMUR", "JO_JIHAM", "INTELLIGENCE", "statement_to_envoy"),
      r("JZ_MENGGETEMUR", "JZ_IMHALA", "COUNTER_CLAIM", "identify_as_ringleader", "contemporary_claim", { causalStatus: "unknown" }),
      r("JZ_MENGGETEMUR", "JZ_MANJU", "COUNTER_CLAIM", "exculpate", "contemporary_claim", { causalStatus: "unknown" })
    ],
    sourceIds: ["SRC_1433_0610"],
    evidenceSummary: "맹가첩목아가 조선 사신 지함에게 '진짜 파저강 도적 괴수는 임합라이며 이만주는 오히려 말렸다'고 말했다. 지함이 이를 국왕에게 보고한 경로(REPORT)는 v2 요약에 명시되지 않아 만들지 않았다.",
    discrepancies: ["D01"], certainty: "contemporary_claim", storyWeight: 2
  }),
  ev({
    id: "E1433_12", title: "명 칙서: 상호 반환과 침범 중지",
    eventDate: "1433-08L-10", datePrecision: "record_date_only",
    theater: ["MING", "AMNOK", "CENTRAL"], placeIds: ["PL_MING_COURT", "PL_HANSEONG"],
    actors: ["MING_XUANDE"], targets: ["JO_SEJONG", "JZ_MANJU", "JZ_MENGGETEMUR", "GRP_HOLLAON"],
    what: [{ type: "burden", value: "포로·가축·문서 상호 반환과 침범 중지 의무", quantity: null, unit: null, giverId: "MING_XUANDE", receiverId: "JO_SEJONG" }],
    mechanisms: ["diplomacy", "mediation"],
    outcomes: [{ type: "diplomatic_exchange", description: "명은 양측 주장 진위를 명확히 가리기 어렵다는 입장에서 상호 반환·침범 중지를 명령" }],
    relations: ["JO_SEJONG", "JZ_MANJU", "JZ_MENGGETEMUR", "GRP_HOLLAON"].map((t) => r("MING_XUANDE", t, "DIPLOMACY", "mediation_order")),
    sourceIds: ["SRC_1433_08L10"],
    evidenceSummary: "명 선덕제가 조선 측 보고와 이만주 측 항의를 모두 검토한 뒤 진위를 명확히 가리기 어렵다고 하며 상호 포로·가축·문서 반환과 침범 중지를 명령했다(실록 윤8월 10일 기사).",
    discrepancies: ["D01"], storyWeight: 3
  }),
  ev({
    id: "E1433_13", title: "이만주의 사절 파견(왕답올·유살독 등 14명)",
    eventDate: "1433-12-21", datePrecision: "record_date_only",
    theater: ["CENTRAL", "AMNOK"], placeIds: ["PL_HANSEONG"],
    actors: ["JZ_MANJU", "JZ_WANGDABOL", "JZ_YUSALDOK"], targets: ["JO_SEJONG"],
    what: [{ type: "transfer", value: "토산물 진상", quantity: null, unit: null, giverId: "JZ_MANJU", receiverId: "JO_SEJONG" }],
    mechanisms: ["envoy", "diplomacy"],
    outcomes: [{ type: "diplomatic_exchange", description: "정벌 후 제한적 통교 재개" }],
    relations: [
      r("JZ_MANJU", "JZ_WANGDABOL", "COMMAND", "dispatch_envoy"),
      r("JZ_MANJU", "JZ_YUSALDOK", "COMMAND", "dispatch_envoy"),
      r("JZ_WANGDABOL", "JO_SEJONG", "DIPLOMACY", "tribute_mission"),
      r("JZ_YUSALDOK", "JO_SEJONG", "DIPLOMACY", "tribute_mission")
    ],
    sourceIds: ["SRC_1433_1221"],
    evidenceSummary: "이만주가 왕답올·유살독 등 14명을 조선에 보내 토산물을 바쳤다.",
    causedBy: [{ eventId: "E1433_12", causalStatus: "sequence_only", note: "" }],
    storyWeight: 2
  }),

  /* ============================== 1434 ============================== */
  ev({
    id: "E1434_01", title: "이만주가 강계부에 문서 발송",
    eventDate: "1434-04-16", datePrecision: "record_date_only",
    theater: ["AMNOK"], placeIds: ["PL_GANGGYE"],
    actors: ["JZ_MANJU"], targets: ["ORG_GANGGYE_BU"],
    what: [
      { type: "claim", value: "원상미 20포 수령 의사", quantity: 20, unit: "포", giverId: "ORG_GANGGYE_BU", receiverId: "JZ_MANJU" },
      { type: "claim", value: "건주위에서 도주한 남녀 반환 요청", quantity: 7, unit: "명", giverId: "ORG_GANGGYE_BU", receiverId: "JZ_MANJU" }
    ],
    mechanisms: ["diplomacy"],
    outcomes: [{ type: "diplomatic_exchange", description: "물자 수령·도망자 반환 요청" }],
    relations: [r("JZ_MANJU", "ORG_GANGGYE_BU", "DIPLOMACY", "letter")],
    sourceIds: ["SRC_1434_0416"],
    evidenceSummary: "이만주가 강계부에 문서를 보내 원상미 20포를 수령하겠다는 뜻과, 건주위에서 도주한 남녀 7명의 반환을 요청했다. 강계부가 이를 조정에 보고한 경로는 v2 요약에 없다.",
    storyWeight: 1
  }),
  ev({
    id: "E1434_02", title: "도망자 송환을 둘러싼 조정 논의",
    eventDate: "1434-04-22",
    theater: ["CENTRAL"], placeIds: ["PL_HANSEONG"],
    actors: ["JO_SEJONG", "JO_SINSANG"], decisionMakers: ["JO_SEJONG"], subjects: ["JZ_MANJU"],
    what: [{ type: "transfer", value: "강제 송환 반대 의견", quantity: null, unit: null, giverId: "JO_SINSANG", receiverId: "JO_SEJONG" }],
    mechanisms: ["policy_deliberation"],
    outcomes: [{ type: "unresolved", description: "송환 여부 논의(결정 내용은 v2 요약에 없음)" }],
    relations: [r("JO_SINSANG", "JO_SEJONG", "POLICY", "oppose_repatriation")],
    sourceIds: ["SRC_1434_0422"],
    evidenceSummary: "세종과 조정이 이만주가 요구한 도망자 7명 송환 여부를 논의했다. 예조판서 신상은 강제 송환이 향후 귀화를 막을 수 있다며 반대했다.",
    causedBy: [{ eventId: "E1434_01", causalStatus: "explicit", note: "이만주가 요구한 도망자 문제" }],
    storyWeight: 1
  }),
  ev({
    id: "E1434_03", title: "이만주 관하 인원의 조선 도망과 처리 논의",
    eventDate: "1434-04-26", datePrecision: "record_date_only",
    theater: ["CENTRAL", "AMNOK"], placeIds: ["PL_HANSEONG"],
    actors: ["JZ_JANGGYOHA", "JZ_YUPOJA", "JZ_WANGANTAN", "JO_HWANGHUI"], decisionMakers: ["JO_SEJONG"], subjects: ["JZ_MANJU"],
    what: [{ type: "transfer", value: "이만주 관하 인원의 이탈(인구 이동)", quantity: null, unit: null, giverId: "JZ_MANJU", receiverId: "ORG_JOSEON_COURT" }],
    mechanisms: ["defection", "policy_deliberation"],
    outcomes: [{ type: "movement", description: "장교하·유포자·왕안탄 등이 조선으로 도망" }, { type: "unresolved", description: "이만주가 찾으면 돌려보내는 방안 논의" }],
    relations: [r("JO_HWANGHUI", "JO_SEJONG", "POLICY", "advise")],
    sourceIds: ["SRC_1434_0426"],
    evidenceSummary: "이만주 관하 장교하·유포자·왕안탄 등이 조선으로 도망했다. 조선은 이만주가 찾으면 돌려보내는 방안을 논의했다. 도망 자체는 사람 사이의 관계가 아니므로 edge를 만들지 않고 결과(movement)로 기록했다.",
    storyWeight: 1
  }),
  ev({
    id: "E1434_04", title: "자성군 방비 강화",
    eventDate: "1434-09-14", datePrecision: "record_date_only",
    theater: ["AMNOK"], placeIds: ["PL_JASEONG", "PL_AMNOK"],
    actors: ["ORG_JASEONG_GUN"], targets: ["GRP_1434_JASEONG_GARRISON"],
    what: [{ type: "burden", value: "갑사·군인 배치", quantity: null, unit: null, giverId: "GRP_1434_JASEONG_GARRISON", receiverId: "ORG_JASEONG_GUN" }],
    mechanisms: ["fortification", "defense"],
    outcomes: [{ type: "fortification", description: "홍수로 압록강이 얕아져 도하가 쉬워지자 방비 강화" }],
    relations: [r("ORG_JASEONG_GUN", "GRP_1434_JASEONG_GARRISON", "FORTIFICATION", "deploy_garrison")],
    sourceIds: ["SRC_1434_0914"],
    evidenceSummary: "홍수로 압록강이 얕아져 도하가 쉬워지자 자성군이 갑사·군인을 배치해 방비를 강화했다.",
    storyWeight: 1
  }),
  ev({
    id: "E1434_05", title: "부방군 교대체계 정비와 병마 편제 감독",
    eventDate: "1434-10-10",
    theater: ["CENTRAL", "AMNOK"], placeIds: ["PL_YEOYEON", "PL_JASEONG", "PL_GANGGYE"],
    actors: ["ORG_BYEONGJO"],
    what: [{ type: "burden", value: "부방군 교대 의무 재편", quantity: null, unit: null, giverId: null, receiverId: "ORG_BYEONGJO" }],
    mechanisms: ["administrative_reorganization", "punishment"],
    outcomes: [
      { type: "policy_change", description: "여연·자성·강계 등 동계 부방군 교대체계 정비" },
      { type: "unresolved", description: "병마 편제를 자의적으로 조정한 도절제사(실명 미특정)를 감사가 탄핵하도록 함" }
    ],
    sourceIds: ["SRC_1434_1010"],
    evidenceSummary: "여연·자성·강계 등의 동계 부방군 교대체계를 정비했다. 병조는 도절제사가 병마의 편제를 자의적으로 조정한 문제를 감사에게 탄핵하도록 했다(도절제사·감사 실명 미특정 → edge 미생성).",
    storyWeight: 1
  }),
  ev({
    id: "E1434_06", title: "명, 홀라온 억류 조선인 포로 송환 중재",
    eventDate: "1434-10-12", datePrecision: "record_date_only",
    theater: ["MING", "UNSPECIFIED"], placeIds: ["PL_MING_COURT", "PL_HOLLAON_AREA"],
    actors: ["MING_XUANDE", "MING_MENGNAL"], targets: ["GRP_HOLLAON"],
    what: [{ type: "claim", value: "홀라온 억류 조선인 포로 송환", quantity: null, unit: null, giverId: "GRP_HOLLAON", receiverId: "ORG_JOSEON_COURT" }],
    mechanisms: ["diplomacy", "mediation"],
    outcomes: [{ type: "diplomatic_exchange", description: "포로 생존 확인 및 송환 중재(실제 송환 완료 여부 미확인)" }],
    relations: [
      r("MING_XUANDE", "GRP_HOLLAON", "DIPLOMACY", "mediate_captive_return"),
      r("MING_MENGNAL", "GRP_HOLLAON", "DIPLOMACY", "negotiate")
    ],
    sourceIds: ["SRC_1434_1012"],
    evidenceSummary: "명이 홀라온에 잡혀 있는 조선인 포로의 생존을 확인하고 송환을 중재했다. 맹날가래를 선덕제가 파견했다는 문구는 v2 요약에 없어 COMMAND 관계를 만들지 않았다.",
    storyWeight: 1
  }),

  /* ============================== 1435 ============================== */
  ev({
    id: "E1435_JANRAID", title: "정월 여연 침입(6월에 발각)",
    eventDate: "1435-01-00", recordDate: "1435-06-13", datePrecision: "month",
    theater: ["AMNOK"], placeIds: ["PL_YEOYEON"],
    actors: ["JZ_MANJU", "GRP_HOLLAON"], victims: ["GRP_1435_JAN_YEOYEON_VICTIMS"], informationSources: ["GRP_1435_INFORMANT"],
    what: [
      { type: "loss", value: "남자 피살", quantity: 2, unit: "명", giverId: "GRP_1435_JAN_YEOYEON_VICTIMS", receiverId: null },
      { type: "loss", value: "남녀 피랍", quantity: 7, unit: "명", giverId: "GRP_1435_JAN_YEOYEON_VICTIMS", receiverId: null },
      { type: "loss", value: "말", quantity: 6, unit: "필", giverId: "GRP_1435_JAN_YEOYEON_VICTIMS", receiverId: null },
      { type: "loss", value: "소", quantity: 5, unit: "두", giverId: "GRP_1435_JAN_YEOYEON_VICTIMS", receiverId: null }
    ],
    mechanisms: ["battle"],
    outcomes: [
      { type: "killed", subjectId: "GRP_1435_JAN_YEOYEON_VICTIMS", quantity: 2, unit: "명", reportedBy: "귀화 여진인 제보 → 조사", description: "남자 2명 피살" },
      { type: "captured", subjectId: "GRP_1435_JAN_YEOYEON_VICTIMS", quantity: 7, unit: "명", reportedBy: "귀화 여진인 제보 → 조사", description: "남녀 7명 피랍" }
    ],
    relations: [
      r("JZ_MANJU", "GRP_1435_JAN_YEOYEON_VICTIMS", "MILITARY_CONFLICT", "raid", "contemporary_claim",
        { note: "가해 주체 귀속은 제보자 진술. v2 요약은 '조사 결과 사건은 사실로 확인'이라 하나, 확인 범위가 가해 주체까지인지는 원문 재확인 필요." }),
      r("GRP_HOLLAON", "GRP_1435_JAN_YEOYEON_VICTIMS", "MILITARY_CONFLICT", "raid", "contemporary_claim", { note: "위와 같음." })
    ],
    sourceIds: ["SRC_1435_0613"],
    evidenceSummary: "귀화한 파저강 여진인이 '지난 정월 이만주가 홀라온과 여연을 침입해 남자 2명을 죽이고 남녀 7명·말 6필·소 5두를 끌고 갔다'고 제보했다. 1월 13일 오량합의 여연성 포위(E1435_01)와는 별개 사건이다. 발생일은 '정월'로만 기록되어 월 단위(day=00)로 둔다.",
    discrepancies: ["D02", "D06"], storyWeight: 2
  }),
  ev({
    id: "E1435_01", title: "오량합 기병의 여연성 포위",
    eventDate: "1435-01-13", recordDate: "1435-01-18",
    theater: ["AMNOK"], placeIds: ["PL_YEOYEON"],
    actors: ["GRP_ORYANGHAP_1435", "JO_KIMYUNSU", "JO_LEEJIN", "JO_YEOSEONGRYEOL", "JO_KIMSUYEON"],
    targets: ["GRP_1435_YEOYEON_GARRISON"], victims: ["GRP_1435_YEOYEON_GARRISON", "JO_KIMYUNSU"],
    what: [{ type: "loss", value: "군졸 사망·부상", quantity: 1, unit: "명(사망)", giverId: "GRP_1435_YEOYEON_GARRISON", receiverId: null }],
    mechanisms: ["battle", "defense", "pursuit"],
    outcomes: [
      { type: "wounded", subjectId: "JO_KIMYUNSU", description: "김윤수 부상", reportedBy: "조선 측 보고" },
      { type: "wounded", subjectId: "GRP_1435_YEOYEON_GARRISON", description: "군졸 다수 부상(수 미기재)", reportedBy: "조선 측 보고" },
      { type: "killed", subjectId: "GRP_1435_YEOYEON_GARRISON", quantity: 1, unit: "명", reportedBy: "조선 측 보고", description: "군졸 1명 사망" },
      { type: "withdrawal", subjectId: "JO_KIMSUYEON", description: "추격 중 적 복병 약 300기를 발견하고 철수" }
    ],
    relations: [
      r("GRP_ORYANGHAP_1435", "GRP_1435_YEOYEON_GARRISON", "MILITARY_CONFLICT", "siege"),
      r("JO_KIMYUNSU", "GRP_ORYANGHAP_1435", "MILITARY_CONFLICT", "defend"),
      r("JO_LEEJIN", "GRP_ORYANGHAP_1435", "MILITARY_CONFLICT", "defend"),
      r("JO_YEOSEONGRYEOL", "GRP_ORYANGHAP_1435", "MILITARY_CONFLICT", "defend"),
      r("JO_KIMSUYEON", "GRP_1435_KIMSUYEON_100", "COMMAND", "lead_pursuit_party"),
      r("JO_KIMSUYEON", "GRP_ORYANGHAP_1435", "MILITARY_ACTION", "pursue_then_withdraw")
    ],
    sourceIds: ["SRC_1435_0118"],
    evidenceSummary: "오량합 기병 약 2,700기가 여연성을 포위했다. 김윤수·이진·여성렬·김수연 등이 방어했다. 김윤수와 군졸들이 부상하고 군졸 1명이 사망했다. 김수연은 100명을 이끌고 추격하다 적 복병 약 300기를 발견하고 철수했다. 공격 세력은 '오량합'이며 이만주가 지휘했다고 단정할 수 없다. v2는 김윤수→이진·여성렬·김수연 지휘관계를 그렸으나 요약문은 공동 방어만 서술하므로 상하관계를 만들지 않았다.",
    discrepancies: ["D02", "D11"], storyWeight: 3
  }),
  ev({
    id: "E1435_02", title: "여연 방어구조 개편 검토",
    eventDate: "1435-01-25",
    theater: ["CENTRAL"], placeIds: ["PL_HANSEONG", "PL_YEOYEON"],
    actors: ["JO_SEJONG", "JO_LEESUKCHI"], decisionMakers: ["JO_SEJONG"],
    what: [{ type: "transfer", value: "여연 방어 개편 의견", quantity: null, unit: null, giverId: "JO_LEESUKCHI", receiverId: "JO_SEJONG" }],
    mechanisms: ["policy_deliberation", "resettlement"],
    outcomes: [{ type: "policy_change", description: "객병 대신 주민을 이주시켜 토병 중심 상시 방어하는 방안 검토(시행 여부 미확인)" }],
    relations: [r("JO_LEESUKCHI", "JO_SEJONG", "POLICY", "advise")],
    sourceIds: ["SRC_1435_0125"],
    evidenceSummary: "세종이 여연은 적이 쉽게 들어오고 빠져나가 추격이 어렵다는 구조적 문제를 지적하고, 객병 대신 주민을 이주시켜 토병 중심으로 상시 방어하는 방안을 검토하게 했다.",
    causedBy: [{ eventId: "E1435_01", causalStatus: "sequence_only", note: "v2는 포위를 '계기'로 서술했으나 요약문에 직접 연결 문구 없음" }],
    storyWeight: 2
  }),
  ev({
    id: "E1435_03", title: "명, 범찰의 이만주 지역 이주 허가",
    eventDate: "1435-02-24", datePrecision: "record_date_only",
    theater: ["MING", "AMNOK"], placeIds: ["PL_MING_COURT", "PL_PAJEOGANG"], locationNote: "범찰 무리의 출발지는 원문 미확인.",
    actors: ["MING_COURT", "JZ_FANCHA"], subjects: ["JZ_MANJU"],
    what: [{ type: "gain", value: "이주·공동 거주 허가", quantity: null, unit: null, giverId: "MING_COURT", receiverId: "JZ_FANCHA" }],
    mechanisms: ["diplomacy", "resettlement"],
    outcomes: [{ type: "movement", subjectId: "JZ_FANCHA", description: "범찰과 일부 관민이 이만주 거주지로 이동해 함께 거주(부하 편입 아님)" }],
    relations: [
      r("MING_COURT", "JZ_FANCHA", "DIPLOMACY", "permit_relocation"),
      r("JZ_FANCHA", "JZ_MANJU", "RESETTLEMENT", "relocate_to_area_of", "confirmed", { note: "거주지 이동. 이만주의 부하로 편입되었다는 의미가 아님." })
    ],
    sourceIds: ["SRC_1435_0224"],
    evidenceSummary: "명이 건주좌위 범찰과 일부 관민이 이만주가 있는 곳으로 이동해 함께 거주하는 것을 허가했다. 칙서 발신 황제는 특정하지 않는다(D03).",
    discrepancies: ["D03", "D09"], storyWeight: 2
  }),
  ev({
    id: "E1435_04", title: "정월 침입 미보고 발각과 김윤수·이각 문책",
    eventDate: "1435-06-13",
    theater: ["CENTRAL", "AMNOK"], placeIds: ["PL_HANSEONG", "PL_YEOYEON"],
    actors: ["GRP_1435_INFORMANT", "JO_CHOESAGANG", "JO_SEJONG", "JO_NOHAN", "JO_HWANGHUI", "JO_CHOEYUNDEOK"],
    targets: ["JO_KIMYUNSU", "JO_LEEGAK"], beneficiaries: ["GRP_1435_JAN_YEOYEON_VICTIMS"], decisionMakers: ["JO_SEJONG"],
    informationSources: ["GRP_1435_INFORMANT"],
    what: [
      { type: "transfer", value: "정월 침입 제보", quantity: null, unit: null, giverId: "GRP_1435_INFORMANT", receiverId: "ORG_JOSEON_COURT" },
      { type: "loss", value: "고신(告身) 박탈", quantity: null, unit: null, giverId: "JO_KIMYUNSU", receiverId: null },
      { type: "gain", value: "조휼", quantity: null, unit: null, giverId: "JO_SEJONG", receiverId: "GRP_1435_JAN_YEOYEON_VICTIMS" }
    ],
    mechanisms: ["intelligence", "investigation", "punishment", "welfare", "policy_deliberation"],
    outcomes: [
      { type: "punishment", subjectId: "JO_KIMYUNSU", description: "고신 박탈, 현직 유임" },
      { type: "unresolved", subjectId: "JO_LEEGAK", description: "즉시 조사·보고하지 않은 책임 추궁(처분 결과 미확인)" },
      { type: "welfare", subjectId: "GRP_1435_JAN_YEOYEON_VICTIMS", description: "피살자 조휼" }
    ],
    relations: [
      r("GRP_1435_INFORMANT", "ORG_JOSEON_COURT", "INTELLIGENCE", "inform", "confirmed", { note: "제보를 접수한 관원은 v2 요약에 없음." }),
      r("JO_CHOESAGANG", "JO_KIMYUNSU", "ACCOUNTABILITY", "demand_censure", "confirmed", { note: "'변경의 대사'로 규정" }),
      r("JO_CHOESAGANG", "JO_LEEGAK", "ACCOUNTABILITY", "demand_censure"),
      r("JO_NOHAN", "JO_SEJONG", "POLICY", "advise"),
      r("JO_HWANGHUI", "JO_SEJONG", "POLICY", "advise"),
      r("JO_CHOEYUNDEOK", "JO_SEJONG", "POLICY", "advise"),
      r("JO_SEJONG", "JO_KIMYUNSU", "PUNISHMENT", "strip_certificate_retain_post"),
      r("JO_SEJONG", "GRP_1435_JAN_YEOYEON_VICTIMS", "WELFARE", "order_condolence_relief")
    ],
    sourceIds: ["SRC_1435_0613"],
    evidenceSummary: "제보로 정월 침입이 드러났다. 김윤수가 6개월가량 보고하지 않았고 도절제사 이각도 즉시 조사·보고하지 않았다. 병조판서 최사강은 이를 '변경의 대사'라 규정해 문책을 요구했다. 세종은 김윤수의 고신을 빼앗되 현직에 남기고 피살자들을 조휼하게 했다.",
    causedBy: [{ eventId: "E1435_JANRAID", causalStatus: "explicit", note: "미보고 침입의 발각" }],
    discrepancies: ["D06"], storyWeight: 3
  }),
  ev({
    id: "E1435_05", title: "사헌부, 김윤수 처분 강화 요구",
    eventDate: "1435-06-17",
    theater: ["CENTRAL"], placeIds: ["PL_HANSEONG"],
    actors: ["JO_CHOEGYEONGMYEONG", "JO_SEJONG"], targets: ["JO_KIMYUNSU"], decisionMakers: ["JO_SEJONG"],
    what: [{ type: "claim", value: "재추국·율에 따른 처벌 요구", quantity: null, unit: null, giverId: "JO_CHOEGYEONGMYEONG", receiverId: "JO_SEJONG" }],
    mechanisms: ["policy_deliberation", "punishment"],
    outcomes: [{ type: "decision", subjectId: "JO_SEJONG", description: "유임 방침 유지" }],
    relations: [
      r("JO_CHOEGYEONGMYEONG", "JO_KIMYUNSU", "ACCOUNTABILITY", "demand_reinterrogation"),
      r("JO_CHOEGYEONGMYEONG", "JO_SEJONG", "POLICY", "remonstrate")
    ],
    sourceIds: ["SRC_1435_0617"],
    evidenceSummary: "사헌부 지평 최경명이 김윤수 처분이 너무 가볍다며 재추국과 율에 따른 처벌을 요구했다. 세종은 유임 방침을 유지했다.",
    causedBy: [{ eventId: "E1435_04", causalStatus: "explicit", note: "처분이 가볍다는 이의" }],
    storyWeight: 2
  }),
  ev({
    id: "E1435_06", title: "여연 추격 공로 포상 건의와 전사자 예우",
    eventDate: "1435-09-18",
    theater: ["CENTRAL"], placeIds: ["PL_HANSEONG"],
    actors: ["ORG_BYEONGJO"], beneficiaries: ["JO_KIMYUNSU", "JO_JANGSAU", "JO_BAECHEOL", "GRP_1435_WARDEAD"],
    what: [
      { type: "gain", value: "포상(건의)", quantity: null, unit: null, giverId: "ORG_BYEONGJO", receiverId: "JO_KIMYUNSU" },
      { type: "gain", value: "포상(건의)", quantity: null, unit: null, giverId: "ORG_BYEONGJO", receiverId: "JO_JANGSAU" },
      { type: "gain", value: "포상(건의)", quantity: null, unit: null, giverId: "ORG_BYEONGJO", receiverId: "JO_BAECHEOL" },
      { type: "gain", value: "증직·부의·호역 면제", quantity: null, unit: null, giverId: "ORG_BYEONGJO", receiverId: "GRP_1435_WARDEAD" }
    ],
    mechanisms: ["reward", "punishment", "welfare", "proposal"],
    outcomes: [
      { type: "reward", subjectId: "JO_KIMYUNSU", description: "강을 건너 적의 퇴로를 끊은 공(포상 건의)" },
      { type: "reward", subjectId: "JO_JANGSAU", description: "끝까지 추격해 약탈품을 되찾은 공(포상 건의)" },
      { type: "reward", subjectId: "JO_BAECHEOL", description: "끝까지 추격해 약탈품을 되찾은 공(포상 건의)" },
      { type: "punishment", description: "방비 소홀·소극 전투자 처벌(실명 미특정)" },
      { type: "welfare", subjectId: "GRP_1435_WARDEAD", description: "증직·부의·호역 면제" }
    ],
    relations: [
      r("ORG_BYEONGJO", "JO_KIMYUNSU", "REWARD", "propose_reward"),
      r("ORG_BYEONGJO", "JO_JANGSAU", "REWARD", "propose_reward"),
      r("ORG_BYEONGJO", "JO_BAECHEOL", "REWARD", "propose_reward"),
      r("ORG_BYEONGJO", "GRP_1435_WARDEAD", "WELFARE", "propose_posthumous_honors")
    ],
    sourceIds: ["SRC_1435_0918"],
    evidenceSummary: "병조는 여연 침입 때 김윤수가 강을 건너 적의 퇴로를 끊고 장사우·배철 등이 끝까지 추격해 약탈품을 되찾은 공을 포상하자고 했다. 방비 소홀·소극 전투자는 처벌하고 전사자에게 증직·부의·호역 면제를 시행하도록 했다. v2는 이 건의를 최사강 개인에게 귀속했으나 요약문 주어는 '병조'이므로 기관으로 둔다.",
    discrepancies: ["D05", "D10"], storyWeight: 3
  }),

  /* ============================== 1436 ~ 1449 (시드만 존재) ============================== */
  ev({
    id: "E1437_0922", title: "[시드] 이천의 제2차 파저강 정벌",
    eventDate: "1437-09-22", datePrecision: "record_date_only",
    theater: ["AMNOK"], placeIds: ["PL_PAJEOGANG"],
    actors: ["JO_LEECHEON"], targets: ["GRP_1437_PAJEOGANG_TARGET"],
    what: [{ type: "loss", value: "정벌 피해(규모 원문 미확인)", quantity: null, unit: null, giverId: "GRP_1437_PAJEOGANG_TARGET", receiverId: null }],
    mechanisms: ["battle"],
    outcomes: [{ type: "unresolved", description: "병력·진격로·전과·사상자 원문 미대조. 『서정록』과의 대조 미수행." }],
    relations: [r("JO_LEECHEON", "GRP_1437_PAJEOGANG_TARGET", "MILITARY_CONFLICT", "expedition", "unverified_seed", { causalStatus: "unknown" })],
    sourceIds: ["SRC_1437_0922"],
    evidenceSummary: "사용자 제시 anchor(wda_11909022_001) 설명만 있음. 대상 세력(이만주 등)을 원문 확인 없이 특정하지 않고 무명 집단으로 둔다.",
    discrepancies: ["D08"], certainty: "unverified_seed", verification: "seed_unverified", storyWeight: 3
  }),
  ev({
    id: "E1438_0729", title: "[시드] 김종서의 범찰·동창 관련 회계",
    eventDate: "1438-07-29", datePrecision: "record_date_only",
    theater: ["DUMAN", "CENTRAL"], placeIds: ["PL_HAMGIL", "PL_HANSEONG"],
    actors: ["JO_KIMJONGSEO"], targets: ["JO_SEJONG"], subjects: ["JZ_FANCHA", "JZ_DONGCHANG"],
    what: [{ type: "transfer", value: "범찰·동창 관련 회계(내용 미추출)", quantity: null, unit: null, giverId: "JO_KIMJONGSEO", receiverId: "JO_SEJONG" }],
    mechanisms: ["hoegye"],
    outcomes: [{ type: "report_filed", description: "회계 제출(내용 원문 미대조)" }],
    relations: [r("JO_KIMJONGSEO", "JO_SEJONG", "REPORT", "hoegye", "unverified_seed", { causalStatus: "unknown" })],
    sourceIds: ["SRC_1438_0729"], embeddedDocumentAuthor: "JO_KIMJONGSEO", documentType: "hoegye",
    evidenceSummary: "사용자 제시 anchor. 실록 기사 안의 '김종서가 회계하기를' 구간을 원문에서 추출해야 함. 범찰·동창은 언급 대상(subjects)일 뿐 관계 edge를 만들지 않음.",
    certainty: "unverified_seed", verification: "seed_unverified", storyWeight: 2
  }),
  ev({
    id: "E1438_0808", title: "[시드] 김종서 장계가 인용된 여진 정책 기사",
    eventDate: "1438-08-08", datePrecision: "record_date_only",
    theater: ["DUMAN", "CENTRAL"], placeIds: ["PL_HAMGIL", "PL_HANSEONG"],
    actors: ["JO_KIMJONGSEO"], targets: ["JO_SEJONG"],
    what: [{ type: "transfer", value: "장계(내용 미추출)", quantity: null, unit: null, giverId: "JO_KIMJONGSEO", receiverId: "JO_SEJONG" }],
    mechanisms: ["janggye"],
    outcomes: [{ type: "report_filed", description: "장계 인용(정책 결과 원문 미대조)" }],
    relations: [r("JO_KIMJONGSEO", "JO_SEJONG", "REPORT", "janggye", "unverified_seed", { causalStatus: "unknown" })],
    sourceIds: ["SRC_1438_0808"], embeddedDocumentAuthor: "JO_KIMJONGSEO", documentType: "janggye",
    evidenceSummary: "사용자 제시 anchor. 장계 인용 범위와 그에 대한 정책 결정은 원문 대조 후 별도 event로 분리할 것.",
    certainty: "unverified_seed", verification: "seed_unverified", storyWeight: 2
  }),
  ev({
    id: "E1439_0510", title: "[시드] 김종서의 거을가개 관련 치계",
    eventDate: "1439-05-10", datePrecision: "record_date_only",
    theater: ["DUMAN", "CENTRAL"], placeIds: ["PL_HAMGIL", "PL_HANSEONG"],
    actors: ["JO_KIMJONGSEO"], targets: ["JO_SEJONG"],
    what: [{ type: "transfer", value: "치계(거을가개 관련, 내용 미추출)", quantity: null, unit: null, giverId: "JO_KIMJONGSEO", receiverId: "JO_SEJONG" }],
    mechanisms: ["chigye"],
    outcomes: [{ type: "report_filed", description: "치계 제출(내용 원문 미대조)" }],
    relations: [r("JO_KIMJONGSEO", "JO_SEJONG", "REPORT", "chigye", "unverified_seed", { causalStatus: "unknown" })],
    sourceIds: ["SRC_1439_0510"], embeddedDocumentAuthor: "JO_KIMJONGSEO", documentType: "chigye",
    evidenceSummary: "사용자 제시 anchor. '거을가개'가 인명인지 지명인지 확인 전까지 entity를 만들지 않음.",
    certainty: "unverified_seed", verification: "seed_unverified", storyWeight: 2
  }),
  ev({
    id: "E1449_0707", title: "[시드] 부거현을 부령도호부로 승격하고 진 설치",
    eventDate: "1449-07-07", datePrecision: "record_date_only",
    theater: ["DUMAN"], placeIds: ["PL_BURYEONG"],
    actors: ["ORG_JOSEON_COURT"],
    what: [{ type: "gain", value: "도호부 승격·진 설치", quantity: null, unit: null, giverId: null, receiverId: "ORG_JOSEON_COURT" }],
    mechanisms: ["administrative_reorganization", "fortification"],
    outcomes: [
      { type: "county_established", description: "부거현 → 부령도호부 승격(원문 미대조)" },
      { type: "garrison_established", description: "진 설치(원문 미대조)" }
    ],
    sourceIds: ["SRC_1449_0707"],
    evidenceSummary: "사용자 제시 anchor. 이 프로젝트의 작업상 종점일 뿐 북방 문제가 해결된 시점으로 해석하지 않는다. 건의자·결정자는 원문 대조 후 입력.",
    certainty: "unverified_seed", verification: "seed_unverified", storyWeight: 2
  })
];

/* ==========================================================================
   DISCREPANCIES — 하나로 합치지 않고 차이 자체를 기록한다.
   status: open | resolved_in_data | not_assessed
   ========================================================================== */
export const DISCREPANCIES = [
  { id: "D01", type: "claim_vs_counterclaim", status: "open", eventIds: ["E1432_01", "E1432_03", "E1433_03", "E1433_11", "E1433_12"],
    title: "1432년 여연 침입의 주체",
    detail: "조선(성죄방목): 파저강 세력이 홀라온으로 가장해 침입. 이만주 측: 홀라온 올적합 100여 명이 침입했고 자신은 포로를 구함. 맹가첩목아: 진범은 임합라, 이만주는 말림. 명: 진위를 가리기 어렵다. 어느 쪽도 확정 사실로 처리하지 않는다." },
  { id: "D02", type: "event_identity", status: "resolved_in_data", eventIds: ["E1435_01", "E1435_JANRAID"],
    title: "1435년 1월의 두 침입",
    detail: "1월 13일 오량합 여연성 포위(1월 18일 기사)와 6월 13일 기사에서 드러난 '지난 정월' 이만주·홀라온 관련 침입은 별개 사건으로 분리했다." },
  { id: "D03", type: "actor_identity", status: "open", eventIds: ["E1435_03"],
    title: "1435-02-24 범찰 이주 허가의 명 측 발신자",
    detail: "v2는 선덕제로 귀속했다. 편집자 배경지식으로는 선덕제가 1435년 초에 사망한 것으로 알려져 있어(원문·2차 문헌 미대조) 기사 게재일 기준 발신 황제를 특정하지 않고 '명 조정'으로 일반화했다. 칙서 연호·날짜를 원문에서 확인할 것." },
  { id: "D04", type: "entity_merge", status: "resolved_in_data", eventIds: ["E1432_03", "E1435_01", "E1435_JANRAID"],
    title: "v2의 '홀라온/오량합' 단일 노드",
    detail: "홀라온(올적합)과 오량합은 별개 집단이므로 GRP_HOLLAON과 GRP_ORYANGHAP_1435로 분리했다." },
  { id: "D05", type: "event_identity", status: "open", eventIds: ["E1435_06"],
    title: "1435-09-18 포상의 근거가 된 침입",
    detail: "'여연 침입 때 김윤수가 강을 건너 적의 퇴로를 끊고…'가 1월 13일 포위전인지 정월 미보고 침입인지 v2 요약으로는 판별 불가. causedBy를 비워 둔다." },
  { id: "D06", type: "claim_scope", status: "open", eventIds: ["E1435_JANRAID", "E1435_04"],
    title: "정월 침입의 이만주 가담 여부",
    detail: "제보자 진술은 이만주가 홀라온과 함께 침입했다고 한다. v2 요약은 '조사 결과 사건은 사실로 확인'이라 하나, 확인 범위가 피해 사실인지 가해 주체까지인지 불명. 가해 관계는 contemporary_claim으로 둔다." },
  { id: "D07", type: "numbers", status: "not_assessed", eventIds: ["E1433_06", "E1433_07"],
    title: "1433년 정벌 전과·사상자 수치",
    detail: "조선 측 보고에만 의존하는 수치이며 독립 검증 자료가 없다. v2 데이터에 수치가 없어 원문 대조 후 입력해야 한다. 『서정록』 및 명 측 기록과의 수치 비교 미수행." },
  { id: "D08", type: "sillok_vs_seojeongnok", status: "not_assessed", eventIds: ["E1437_0922"],
    title: "실록 vs 『서정록』(1437 제2차 정벌)",
    detail: "이번 세션에서 실록·한국민족문화대백과·규장각 접속이 모두 차단되어 『서정록』 원문·현전본 서지(간행 시점·편집 문제)를 확인하지 못했다. 두 자료의 차이는 평가하지 않았다." },
  { id: "D09", type: "unsupported_v2_record", status: "resolved_in_data", eventIds: ["E1435_03"],
    title: "v2의 1435년 맹가첩목아 상태 기록 삭제",
    detail: "v2 PERSON_STATES는 1435-02-24 범찰 이주 사건에 맹가첩목아 상태를 부여했으나 요약문에 맹가첩목아 언급이 없어 삭제했다. 맹가첩목아의 사망 시점(1433년 피살로 알려짐)은 원문으로 확인해야 하는 검증 대기 항목." },
  { id: "D10", type: "actor_attribution", status: "resolved_in_data", eventIds: ["E1433_09", "E1435_06"],
    title: "기관 행위의 개인 귀속",
    detail: "v2는 1435-09-18 병조 건의를 최사강, 1433-05-17 보상을 세종 개인에게 귀속했다. 요약문 주어가 기관이거나 수동형이라 각각 병조·조선 조정(주체 미특정)으로 두었다." },
  { id: "D11", type: "inferred_hierarchy", status: "resolved_in_data", eventIds: ["E1435_01"],
    title: "v2의 김윤수 → 이진·여성렬·김수연 지휘관계",
    detail: "요약문은 공동 방어만 서술한다. 이진(도진무 상호군)이 여연군수의 지휘를 받았다는 근거가 없으므로 상하관계 edge를 삭제하고 각자의 방어 행위로 기록했다." },
  { id: "D12", type: "target_identity", status: "resolved_in_data", eventIds: ["E1433_06"],
    title: "김효성의 공격 대상",
    detail: "'임합라 부모의 채리' 공격. 임합라 본인에 대한 공격과 구분해 relationType=attack_settlement_of_kin으로 기록." },
  { id: "D13", type: "date", status: "resolved_in_data", eventIds: ["E1433_05", "E1433_06", "E1435_01", "E1435_JANRAID"],
    title: "사건일과 기사 게재일의 차이",
    detail: "4/10 집결·4/19 공격은 5/7 기사, 1/13 포위는 1/18 기사, '지난 정월' 침입은 6/13 기사에 실림. eventDate와 recordDate를 분리 저장." }
];
