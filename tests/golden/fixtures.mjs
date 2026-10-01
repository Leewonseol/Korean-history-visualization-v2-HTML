/* ==========================================================================
   Semantic golden fixtures — 사람이 이미 확정한 '원문 → 그래프 표현'을 코드가 계속 같게 유지하는지 검사
   (역사 판단을 자동화하려는 것이 아니라 회귀 테스트다. 기대값을 바꾸려면 사람이 원문을 다시 검토해야 한다.)
   input.pack: pack v1 원문 locator와 그 줄 그대로의 quote — 실행 시 원문 파일과 대조한다.
   ========================================================================== */
export const GOLDEN = [
  {
    id: "G01", case: "direct relation",
    input: { pack: { locator: "pack_v1:E1433_0226:RELATIONS:L200", quote: "이순몽 -> 세종 : POLICY_DISAGREEMENT" } },
    kind: "contact", relationId: "E1433_0226#1",
    expected: { source: "JO_LEESUNMONG", target: "JO_SEJONG", layer: "POLICY", direction: "directed", evidenceClass: "DIRECT",
      causalStatus: "UNKNOWN", pathEligible: true, traceRules: [] }
  },
  {
    id: "G02", case: "normalized relation (R1: court 수신자 → 세종)",
    input: { pack: { locator: "pack_v1:E1433_0507:RELATIONS:L293", quote: "박호문 -> court : REPORT" } },
    kind: "contact", relationId: "E1433_0507#1",
    expected: { source: "JO_PARKHOMUN", target: "JO_SEJONG", layer: "REPORT", direction: "directed", evidenceClass: "NORMALIZED",
      derivationRule: "R1_court_recipient", traceRules: ["R1_court_recipient"], tMin: "1433-05-07", tMax: "1433-05-07" }
  },
  {
    id: "G03", case: "direct relation — 정치체 '조선' 수신자는 세종이 아니라 조선 조정 자리표시자(R1 금지 사례)",
    input: { pack: { locator: "pack_v1:E1432_1221:RELATIONS:L143", quote: "이만주 -> 조선 : COUNTER_CLAIM" } },
    kind: "contact", relationId: "E1432_1221#1",
    expected: { source: "JZ_MANJU", target: "ORG_JOSEON_COURT", layer: "COUNTER_CLAIM", evidenceClass: "DIRECT",
      certainty: "contemporary_claim", traceRules: [] }
  },
  {
    id: "G04", case: "bidirectional policy discussion ('<->' → undirected, 구성원 13명, R3+R6)",
    input: { pack: { locator: "pack_v1:E1432_1221:RELATIONS:L144", quote: "세종 <-> 대신들 : INVESTIGATION / DELIBERATION" } },
    kind: "contacts", eventId: "E1432_1221", where: { layer: "POLICY" },
    expected: { count: 13, each: { source: "JO_SEJONG", direction: "undirected", evidenceClass: "NORMALIZED", traceRules: ["R3_who_expansion", "R6_layer_normalize"] },
      directionEvidence: true, arcsPerContact: 2 }
  },
  {
    id: "G05", case: "uncertain date (일 단위 구간 안의 미상 시점)",
    input: { pack: { locator: "pack_v1:E1437_0922:EVENT DATES:L794", quote: "1437-09-07 through 09-16" } },
    kind: "contact", relationId: "E1437_0922#0",
    expected: { source: "JO_LEECHEON", target: "GRP_1437_PAJEOGANG_TARGET", tMin: "1437-09-07", tMax: "1437-09-16", timeKind: "instant", exact: false }
  },
  {
    id: "G06", case: "article-date-before range (현장 행위 = 기사일 이전, CERTAIN_ORDER 지표에서 제외)",
    input: { pack: { locator: "pack_v1:E1432_1209:RELATIONS:L58", quote: "박초 -> 야인 : PURSUIT / MILITARY_CONFLICT" } },
    kind: "contact", relationId: "E1432_1209#1",
    expected: { source: "JO_PARKCHO", target: "GRP_1432_RAIDERS", tMin: null, tMax: "1432-12-09", exact: false, inCertainOrderAnalysis: false, inDisplay: true }
  },
  {
    id: "G07", case: "identity unresolved (1437 홍사석은 별도 노드, 자동 병합 금지)",
    input: { pack: { locator: "pack_v1:E1437_0914:WHO / FORCE:L774", quote: "홍사석: with Yi Cheon" } },
    kind: "identity", relationId: "E1437_0914#2",
    expected: { target: "JO_HONGSASEOK_1437", identityStatus: "UNRESOLVED_DISTINCT", possibleSameAs: ["JO_HONGSASEOK"], baseNotInYear: { personId: "JO_HONGSASEOK", year: "1437" } }
  },
  {
    id: "G08", case: "explicit causal (원문이 이유를 직접 진술)",
    input: { pack: { locator: "pack_v1:E1433_0516_A:WHAT:L324", quote: "Explicit context: reward of commanders' merit." } },
    kind: "link", eventId: "E1433_0516A", linkTo: "E1433_0419",
    expected: { linkType: "causal", causalStatus: "EXPLICIT_CAUSAL", evidenceLocator: "pack_v1:E1433_0516_A:WHAT:L324" }
  },
  {
    id: "G09", case: "non-causal temporal sequence ('immediately after'는 인과가 아님)",
    input: { pack: { locator: "pack_v1:E1432_1211:TITLE:L67", quote: "Central military consultation immediately after Yŏyŏn invasion" } },
    kind: "link", eventId: "E1432_1211", linkTo: "E1432_1209",
    expected: { linkType: "reference", causalStatus: "TEMPORAL_ASSOCIATION", notCausal: true }
  },
  {
    id: "G10", case: "명령 → 실행은 인과로 자동 동일시하지 않음",
    input: { pack: { locator: "pack_v1:E1433_0507:RELATIONS:L291", quote: "최윤덕 -> six subordinate columns : COMMAND" } },
    kind: "contact", relationId: "E1433_0410#0",
    expected: { source: "JO_CHOEYUNDEOK", target: "JO_LEESUNMONG", layer: "COMMAND", causalStatus: "UNKNOWN", evidenceClass: "NORMALIZED" }
  },
  {
    id: "G11", case: "legacy excluded (v2 지휘관↔공격 대상 대응은 기본에서 제외, opt-in에서만)",
    input: { pack: { locator: "pack_v1:E1433_0507:RELATIONS:L292", quote: "commanders -> target settlements : MILITARY_ACTION" } },
    kind: "excluded", relationId: "E1433_0419#0",
    expected: { evidenceClass: "LEGACY", inDefault: false, inWithLegacy: true }
  },
  {
    id: "G12", case: "interpretation excluded (도 관아 특정은 R1~R7 밖 — 해석, 기본 분석에서 assert로 차단)",
    input: { pack: { locator: "pack_v1:E1435_0312:RELATIONS:L553", quote: "provincial government -> settlers : RELIEF" } },
    kind: "excluded", relationId: "E1435_0312#0",
    expected: { evidenceClass: "INTERPRETATION", inDefault: false, inWithInterpretation: true, metricsThrowsWithoutScope: true }
  },
  {
    id: "G13", case: "reverse path rejected (1437 이화 → 1432 허조: 과거 edge로 역행 불가)",
    input: { synthetic: "real data, CERTAIN_ORDER" },
    kind: "path", from: "JO_LEEHWA", to: "JO_HEOJO", mode: "CERTAIN_ORDER",
    expected: { result: null, reverseExists: true }
  },
  {
    id: "G14", case: "temporally-not-excluded path (시간 정보상 모순 없음 ≠ 순서 입증)",
    input: { pack: { locator: "pack_v1:E1439_0510:RELATIONS:L876", quote: "도을온 -> 김종서 : INTELLIGENCE" } },
    kind: "path", from: "JZ_DOEULON", to: "JO_SEJONG", mode: "TEMPORALLY_NOT_EXCLUDED",
    expected: { certainOrderResult: null, flag: "UNCERTAIN", firstStepContact: "E1439_0510#0" }
  }
];
