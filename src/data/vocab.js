/* ==========================================================================
   통제 어휘(controlled vocabulary)
   - LEVEL  : 행위자의 제도적·조직적 위치(시점별로 PERSON_STATES가 바꿀 수 있음)
   - LAYER  : 관계(relation)의 종류. LEVEL과 혼동하지 않는다.
   - 기타   : certainty, causalStatus, theater, 세력(affiliation), 메커니즘, 결과 유형, 사료 유형
   ========================================================================== */

export const LEVELS = {
  L0: { label: "L0 왕", short: "왕" },
  L1: { label: "L1 중앙 정책·행정 관료", short: "중앙 관료" },
  L2: { label: "L2 중앙 군사 엘리트", short: "중앙 군사" },
  L3: { label: "L3 지방 최고지휘관", short: "지방 최고지휘" },
  L4: { label: "L4 현장 지휘관·군관·지방관", short: "현장 지휘" },
  L5: { label: "L5 군졸", short: "군졸" },
  L6: { label: "L6 지방 주민", short: "주민" },
  L7: { label: "L7 외부 정치·군사 행위자", short: "외부 행위자" },
  LU: { label: "LU 소속·위치 미상", short: "미상" }
};
export const LEVEL_ORDER = ["L0", "L1", "L2", "L3", "L4", "L5", "L6", "L7", "LU"];

// 같은 의미의 관계를 이름만 바꿔 중복 생성하지 않는다. 세부 행위는 relationType으로 구분한다.
export const LAYERS = {
  POLICY:                { label: "정책(건의·논의·결정)",   color: "#2b6cb0" },
  COMMAND:               { label: "명령·임명·파견",         color: "#1a365d" },
  REPORT:                { label: "보고(장계·치계·회계)",   color: "#0f8a8a" },
  INTELLIGENCE:          { label: "정보·제보",               color: "#6b46c1" },
  INVESTIGATION:         { label: "조사",                     color: "#5a6b7b" },
  LOGISTICS:             { label: "병참·군량·병기",           color: "#8d6e3f" },
  MILITARY_ACTION:       { label: "군사행동(추격·배치·정찰)", color: "#c05621" },
  MILITARY_CONFLICT:     { label: "무력충돌",                 color: "#c53030" },
  DIPLOMACY:             { label: "외교·통교·중재",           color: "#2f855a" },
  CLAIM:                 { label: "주장·문죄",                 color: "#805ad5" },
  COUNTER_CLAIM:         { label: "반박 주장",                 color: "#b83280" },
  REWARD:                { label: "포상",                      color: "#5a8a2a" },
  PUNISHMENT:            { label: "처벌·처분",                 color: "#9b2c2c" },
  ACCOUNTABILITY:        { label: "책임추궁·탄핵",             color: "#c4621b" },
  WELFARE:               { label: "전사자·피해자 예우",        color: "#3182ce" },
  FORTIFICATION:         { label: "축성·진보 설치·방비",       color: "#7b5e3b" },
  RESETTLEMENT:          { label: "사민·입거·이주",            color: "#97842a" },
  BORDER_ADMINISTRATION: { label: "변경 행정(군현·진 설치)",   color: "#4a5568" },
  LABOR_MOBILIZATION:    { label: "부역·노동 동원",            color: "#a0522d" },
  COOPERATION:           { label: "협력",                      color: "#38a169" }
};

// 관계의 확실성. 선 모양 범례와 1:1로 대응한다(아래 LINE_STYLE 참고).
export const CERTAINTY = {
  confirmed:          { label: "확인된 사실(사료 기록)",          badge: "사실",   line: "solid" },
  contemporary_claim: { label: "당대인의 주장",                    badge: "주장",   line: "dotted" },
  disputed:           { label: "다툼·미확정",                      badge: "미확정", line: "dotted" },
  interpretation:     { label: "편집자 해석",                      badge: "해석",   line: "dashed" },
  secondary_only:     { label: "2차자료에만 근거",                 badge: "2차",    line: "dashed" },
  unverified_seed:    { label: "원문 미확인 시드(검증 대기)",      badge: "미검증", line: "dashed" }
};
export const CERTAINTY_ORDER = ["confirmed", "contemporary_claim", "disputed", "interpretation", "secondary_only", "unverified_seed"];

/* ---------------- 근거 계보(provenance) — 감사 후 추가 ----------------
   pack_v1_direct   : pack v1에 직접 명시
   pack_v1_derived  : pack v1 항목을 정해진 정규화 규칙(DERIVATION_RULES)으로만 변환
   inherited_v2     : 이전 v2 데이터에만 있는 것(legacy, 검증 데이터 아님)
   legacy_anchor_seed: 최초 anchor 목록에만 있고 pack v1에 없는 것(legacy)
   interpretation   : 편집자 해석(연구·서사 표현용)
   unknown_provenance: 출처 추적 불가 */
export const PROVENANCE = {
  pack_v1_direct:     { label: "pack v1 직접", group: "verified" },
  pack_v1_derived:    { label: "pack v1 정규화", group: "verified" },
  inherited_v2:       { label: "v2 이관(legacy)", group: "legacy" },
  legacy_anchor_seed: { label: "anchor 시드(legacy)", group: "legacy" },
  interpretation:     { label: "편집자 해석", group: "interpretation" },
  unknown_provenance: { label: "출처 불명", group: "unknown" }
};
export const EVIDENCE_STATUS = {
  verified: "pack v1 검증", legacy: "검증 안 됨(legacy)", interpretation: "해석", unknown: "출처 불명"
};
export const evidenceStatusOf = (prov) => (PROVENANCE[prov] ? PROVENANCE[prov].group : "unknown");

/* ---------------- 근거 등급(evidence class) ----------------
   '사료 id가 붙어 있음'과 '관계가 원문에 직접 나타남'을 구분한다.
   DIRECT        원문(pack RELATIONS 줄)에 주체·객체·관계 유형이 그대로 나타남. 어떤 정규화 규칙도 쓰지 않음.
   NORMALIZED    pack 원문을 정규화 규칙 R1~R7로만 변환(관계마다 trace: 원문 줄 → 규칙 → edge)
   LEGACY        이전 버전(v2)·anchor 시드에서 이관 — 검증 데이터 아님
   INTERPRETATION 편집자 해석 — 기본 분석 코드 경로에서 차단(assert), 명시적 interpretation mode에서만 허용
   기본 지표·경로 = DIRECT + NORMALIZED(pack v1 검증). LEGACY·INTERPRETATION은 opt-in. */
export const EVIDENCE_CLASS = {
  DIRECT:         { label: "직접 사료 근거", short: "직접", provenance: ["pack_v1_direct"], verified: true },
  NORMALIZED:     { label: "규칙 파생(R1~R7)", short: "규칙 파생", provenance: ["pack_v1_derived"], verified: true },
  LEGACY:         { label: "legacy(v2 이관·시드)", short: "legacy", provenance: ["inherited_v2", "legacy_anchor_seed"], verified: false },
  INTERPRETATION: { label: "편집자 해석", short: "해석", provenance: ["interpretation"], verified: false }
};
export const EVIDENCE_CLASS_ORDER = ["DIRECT", "NORMALIZED", "LEGACY", "INTERPRETATION"];
export function evidenceClassOf(prov) {
  for (const [k, v] of Object.entries(EVIDENCE_CLASS)) if (v.provenance.includes(prov)) return k;
  return "UNKNOWN";
}

/* ---------------- 정규화 규칙 formal specification (R1~R7) ----------------
   각 NORMALIZED 관계는 src/data/relationTraces.js 에 trace(원문 locator·quote, 원문 주체/객체, 정규화 주체/객체, 규칙)를 가진다.
   endpoint: 규칙이 바꾸는 부분(subject / object / layer / time). time 규칙(R7)은 관계의 존재 근거가 아니라 시각 근거다. */
export const NORMALIZATION_RULES = {
  R1_court_recipient: {
    title: "조정 수신자 → 군주 노드",
    endpoint: "object",
    inputPattern: "pack RELATIONS의 수신자 토큰이 'court' / 'central' / '조정'(조선) 또는 같은 항목 WHAT이 'Ming court'로 쓴 명(Ming)이고, layer가 의사소통(REPORT·POLICY·CLAIM·COUNTER_CLAIM·DIPLOMACY·INTELLIGENCE·FORTIFICATION 건의)",
    produces: "주체 → 세종(조선 조정) 또는 같은 항목 WHO의 황제(명 조정). layer는 원문 라벨(R6 표)",
    direction: "원문 화살표 방향 유지(수신자만 치환)",
    bidirectional: false,
    causalEdge: false,
    forbidden: [
      "'조선/Joseon/state'(정치체)를 세종으로 바꾸기 — 이 경우 ORG_JOSEON_COURT(자리표시자) 사용",
      "'court'가 행위 주체일 때 세종으로 바꾸기 — 주체 'court/central/state'는 ORG_JOSEON_COURT",
      "보고가 조정에 도달했다는 서술 없이 현장 수신자를 세종으로 바꾸기"
    ],
    example: { quote: "박호문 -> court : REPORT", edge: "박호문 → 세종 (REPORT)" }
  },
  R2_carrier_split: {
    title: "전달자 경유 보고 분리",
    endpoint: "subject/object",
    inputPattern: "pack에 'A … via B' (WHAT·REPORTER)가 있고 B → court 관계가 따로 있음",
    produces: "A → B (REPORT, 위탁) 하나. B → 조정은 R1로 별도",
    direction: "A → B",
    bidirectional: false,
    causalEdge: false,
    forbidden: ["A → 세종 직접 관계를 추가로 만들기(원문이 직접 관계를 따로 쓴 경우만 DIRECT로 허용)"],
    example: { quote: "REPORTER: 최윤덕, via 박호문", edge: "최윤덕 → 박호문 (REPORT)" }
  },
  R3_who_expansion: {
    title: "집합·일반 지칭 → 명시된 구성원",
    endpoint: "subject/object",
    inputPattern: "pack RELATIONS의 한쪽이 집합·일반 지칭('listed ministers', 'campaign commanders', 'Jurchen actors', 'frontier commander(s)', 'groups', 'informants', 'meritorious soldiers', 'X side')이고, 그 구성원이 같은 항목(또는 명시적으로 표시한 다른 pack 항목)의 WHO·WHAT·명단 줄에 실명·직위로 나열됨",
    produces: "구성원마다 관계 1개. 구성원 근거 줄(members locator)을 trace에 기록",
    direction: "원문 화살표 방향 유지. '<->'는 양쪽 방향 원문일 때만 undirected",
    bidirectional: "원문이 '<->'인 경우만(directionEvidence 필수)",
    causalEdge: false,
    forbidden: [
      "WHO에 이름만 있고 집합 지칭에 속한다는 근거가 없는 사람을 구성원으로 넣기",
      "구성원 사이의 관계(상하관계 등)를 만들기",
      "다른 항목 명단을 쓸 때 CROSS_ENTRY_MEMBERSHIP 표시 없이 쓰기"
    ],
    example: { quote: "세종 -> listed ministers/generals : POLICY_CONSULTATION", edge: "세종 → 허조 (POLICY) — 구성원 근거: WHO '허조 許稠'" }
  },
  R4_group_placeholder: {
    title: "무명 집합 → group 노드",
    endpoint: "subject/object",
    inputPattern: "pack이 실명 없이 집합(야인, defenders, settlers, population, local agents, informants source 등)으로 쓰거나, MILITARY_ATTACK의 대상이 지명이고 같은 항목이 그 지명의 피해자·수비자를 기록(PLACE_AS_TARGET)",
    produces: "해당 사건 전용 group 노드(예: '1435-01 여연성 수비 군사')와의 관계",
    direction: "원문 화살표 방향 유지",
    bidirectional: false,
    causalEdge: false,
    forbidden: ["무명 집합 안의 개인을 창작하기", "서로 다른 사건의 무명 집합을 한 노드로 합치기", "여진 집단을 하나로 합치기"],
    example: { quote: "Oryanghap -> Yŏyŏn : MILITARY_ATTACK", edge: "오량합 기병(1435-01) → 1435-01 여연성 수비 군사 (MILITARY_CONFLICT)" }
  },
  R5_content_actor: {
    title: "본문(WHAT·WHO·KEY CONTENT)에 명시된 행위자",
    endpoint: "subject/object",
    inputPattern: "RELATIONS 줄이 없거나 일반 지칭인데, 같은 항목 WHAT·WHO·KEY CONTENT 문장이 특정 인물·기관을 그 행위의 행위자(또는 대상)로 명시",
    produces: "그 문장의 행위 1개. 수신자가 문장에 없으면 같은 항목 RELATIONS의 수신자를 support locator로 기록(RECIPIENT_FROM_ENTRY_RELATION)",
    direction: "문장의 행위 방향",
    bidirectional: false,
    causalEdge: false,
    forbidden: ["문장에 없는 행위자를 지명·직위·관례로 추정하기(예: 지명으로 도 관아를 특정)", "문장의 주장 내용을 사실 관계로 바꾸기(주장 대상은 pathEligible:false)"],
    example: { quote: "Yi Cheon, Choe Hae-san, Jeong Heum-ji and others argued for first sending", edge: "정흠지 → 세종 (POLICY advise)" }
  },
  R6_layer_normalize: {
    title: "pack 관계 라벨 → layer (비일대일 매핑)",
    endpoint: "layer",
    inputPattern: "pack 라벨(예: 'REWARD / APPOINTMENT', 'DEFENSE_ADVICE')이 PACK_LABEL_LAYERS 표에서 둘 이상의 layer로 갈 수 있어 편집자가 하나를 고름",
    produces: "표가 허용하는 layer 중 하나. 일대일 라벨은 R6 없이 DIRECT에서 허용",
    direction: "변경 없음",
    bidirectional: false,
    causalEdge: false,
    forbidden: ["표에 없는 layer 선택", "라벨에 없는 관계 유형 추가"],
    example: { quote: "이천 -> 세종 : REPORT / SELF_ACCOUNTABILITY / MILITARY_ADVICE", edge: "이천 → 세종 (REPORT)" }
  },
  R7_report_on_record: {
    title: "조정 도달 보고·전달의 시각 = 기사일",
    endpoint: "time",
    inputPattern: "보고·전달이 조정(세종·조선 조정)에 도달한 것이 기사에 실려 있고 도달일이 따로 없음",
    produces: "관계 시각 dateMin = dateMax = 기사일. 현장 행위는 '기사일 이전'으로 둠",
    direction: "변경 없음",
    bidirectional: false,
    causalEdge: false,
    forbidden: ["현장 행위(전투·추격·이동)를 기사일에 일어난 것으로 두기"],
    example: { quote: "김종서 -> court : REPORT (치계, 1439-05-10 기사)", edge: "김종서 → 세종 @1439-05-10" }
  }
};
// 하위호환: 규칙 id → 제목
export const DERIVATION_RULES = Object.fromEntries(Object.entries(NORMALIZATION_RULES).map(([k, v]) => [k, v.title]));
export const RELATION_RULES = Object.keys(NORMALIZATION_RULES).filter((k) => k !== "R7_report_on_record");

/* pack 관계 라벨 → 허용 layer 표. 모든 라벨이 같은 하나의 layer로만 가면 일대일(DIRECT 허용),
   둘 이상이면 선택에 R6가 필요하다. 표에 없는 라벨·layer 조합은 오류. */
export const PACK_LABEL_LAYERS = {
  MILITARY_ATTACK: ["MILITARY_CONFLICT"], PURSUIT: ["MILITARY_CONFLICT", "MILITARY_ACTION"], MILITARY_CONFLICT: ["MILITARY_CONFLICT"],
  RECOVERY: ["MILITARY_ACTION"], PROTECTION: ["MILITARY_ACTION"], DEFENSE: ["MILITARY_CONFLICT"], MILITARY_ACTION: ["MILITARY_ACTION"],
  DEPLOYMENT: ["MILITARY_ACTION"], CROSS_BORDER_OPERATION: ["MILITARY_ACTION"],
  POLICY_CONSULTATION: ["POLICY"], POLICY_ADVICE: ["POLICY"], MILITARY_TECH_ADVICE: ["POLICY"], MILITARY_ADVICE: ["POLICY"],
  POLICY_QUERY: ["POLICY"], POLICY_DISAGREEMENT: ["POLICY"], POLICY_TRANSFER: ["POLICY"], POLICY: ["POLICY"], DELIBERATION: ["POLICY"],
  CONDITIONAL_TARGET_STATUS: ["POLICY"], INSTRUCTION: ["POLICY", "COMMAND"], DEFENSE_ADVICE: ["POLICY", "FORTIFICATION"],
  DEFENSE_PLANNING: ["FORTIFICATION", "POLICY"], MILITARY_PROPOSAL: ["POLICY", "DIPLOMACY"],
  COMMAND: ["COMMAND"], COMMAND_DESIGN: ["COMMAND"], DEFENSE_ORDER: ["COMMAND"], BORDER_CONTROL: ["COMMAND"], APPOINTMENT: ["COMMAND"],
  INSPECTION: ["COMMAND", "INVESTIGATION"], DEFENSE_REFORM: ["FORTIFICATION", "COMMAND"], DIPLOMATIC_POLICY: ["COMMAND", "DIPLOMACY"],
  REPORT: ["REPORT"], REPORT_CARRIER: ["REPORT"], SELF_ACCOUNTABILITY: ["REPORT"], SELF_DEFENSE: ["REPORT"], POLICY_REPORT: ["REPORT"],
  VICTORY_REPORT: ["REPORT"], INTELLIGENCE_REPORT: ["REPORT", "INTELLIGENCE"],
  INTELLIGENCE: ["INTELLIGENCE"], INTELLIGENCE_REQUEST: ["INTELLIGENCE"], INVESTIGATION: ["INVESTIGATION"],
  CLAIM: ["CLAIM"], COUNTER_CLAIM: ["COUNTER_CLAIM"],
  DIPLOMACY: ["DIPLOMACY"], DIPLOMATIC_PROTEST: ["DIPLOMACY"], MEDIATION: ["DIPLOMACY"], IMPERIAL_ORDER: ["DIPLOMACY"],
  DIPLOMATIC_DEESCALATION: ["DIPLOMACY"], DIPLOMATIC_MANAGEMENT: ["DIPLOMACY"], LIMITED_ACCEPTANCE: ["DIPLOMACY"], NON_ESCALATION: ["DIPLOMACY"],
  CONCILIATION: ["DIPLOMACY"], CONTROL: ["DIPLOMACY"],
  REWARD: ["REWARD"], HONOR: ["WELFARE"], WELFARE: ["WELFARE"], COMPENSATION: ["WELFARE"], RELIEF: ["WELFARE"],
  ACCOUNTABILITY: ["ACCOUNTABILITY"], PUNISHMENT: ["PUNISHMENT"],
  RESETTLEMENT: ["RESETTLEMENT"], AGRICULTURAL_POLICY: ["RESETTLEMENT"], COERCIVE_RESETTLEMENT: ["RESETTLEMENT"],
  BORDER_ADMINISTRATION: ["BORDER_ADMINISTRATION"], ADMIN_REORGANIZATION: ["BORDER_ADMINISTRATION"],
  FORTIFICATION: ["FORTIFICATION"], LABOR_MOBILIZATION: ["LABOR_MOBILIZATION"], LOGISTICS: ["LOGISTICS"]
};
/** pack 관계 줄('A -> B : L1 / L2')의 라벨 목록 */
export function packLabelsOf(quote) {
  const m = /\s:\s*(.+)$/.exec(quote || "");
  return m ? m[1].split("/").map((x) => x.trim().replace(/^expected\s+/, "")).filter(Boolean) : [];
}
/** 라벨 → layer 판정: { ok, oneToOne, allowed } */
export function labelLayerCheck(labels, layer) {
  const allowed = new Set(labels.flatMap((l) => PACK_LABEL_LAYERS[l] || []));
  return { ok: allowed.has(layer), oneToOne: allowed.size === 1 && allowed.has(layer), allowed: [...allowed] };
}

// layer별 방향 정책. 'directed'는 undirected 저장 금지. 'declared'는 근거(directionEvidence)가 있을 때만 undirected 허용.
// pathRole: transmission = 경로·중심성 계산에 쓰는 접촉, about = '~에 관한' 관계(경로·중심성 제외 가능)
export const DIRECTION_POLICY = {
  POLICY: "declared", COMMAND: "directed", REPORT: "directed", INTELLIGENCE: "directed", INVESTIGATION: "directed",
  LOGISTICS: "directed", MILITARY_ACTION: "directed", MILITARY_CONFLICT: "directed", DIPLOMACY: "directed",
  CLAIM: "directed", COUNTER_CLAIM: "directed", REWARD: "directed", PUNISHMENT: "directed", ACCOUNTABILITY: "directed",
  WELFARE: "directed", FORTIFICATION: "directed", RESETTLEMENT: "directed", BORDER_ADMINISTRATION: "directed",
  LABOR_MOBILIZATION: "directed", COOPERATION: "declared"
};

// 날짜 정밀도. 범위는 dateMin/dateMax(null = 그 쪽 경계 미상)로 표현한다.
export const DATE_PRECISION = {
  DAY: "일 단위", MONTH: "월 단위(월 안의 날짜 미상)", YEAR: "연 단위(연중 시점 미상)", UNKNOWN: "미상(경계만 일부 알려짐)"
};
export const TIME_KIND = {
  instant: "한 시점(범위면 그 안의 미상 시점)", duration: "기간 전체에 걸친 지속"
};

// 연도 조사 범위(기간 기준). FULL은 '연도 전체가 조사 기간 안'이라는 뜻이지 모든 기사를 조사했다는 뜻이 아니다(completeness 별도).
export const COVERAGE_SCOPE = {
  FULL:    "연도 전체가 조사 기간 안(기사는 seed — 전수 아님)",
  PARTIAL: "연도의 일부 기간만 조사 범위",
  NONE:    "조사·수록 없음(NA — 0이 아님)",
  UNKNOWN: "판단 불가"
};
export const COVERAGE_STATUS = {
  VERIFIED_WITH_EVENTS:      "pack v1 검증 기사·사건 있음(전수 아님)",
  VERIFIED_NO_RELEVANT_EVENT:"사료 확인 결과 관련 사건 없음(pack에 명시된 경우만)",
  NOT_COVERED:               "pack v1에 검증 기사 미수록(미조사) — '사건 없음'이 아님",
  PARTIAL:                   "일부 기간·기사만 검증",
  UNKNOWN:                   "판단 불가"
};

export const IDENTITY_STATUS = {
  VERIFIED_SAME:        "pack(또는 authority 사료)이 여러 등장을 같은 인물로 직접 연결",
  PROBABLE_SAME:        "같은 이름의 등장을 한 노드로 묶었으나 동일성이 사료로 직접 확인되지 않음(미해결)",
  UNRESOLVED:           "한 노드 안의 등장들이 같은 사람인지 판단 근거가 서로 충돌(미해결)",
  UNRESOLVED_DISTINCT:  "별도 노드로 분리 — 동일인 여부 미확인(possibleSameAs), 자동 병합 금지",
  VERIFIED_DISTINCT:    "사료가 다른 인물임을 직접 확인",
  SINGLE_ATTESTATION:   "검증 데이터에 한 사건에서만 등장(병합 문제 없음)",
  COLLECTIVE_OR_OFFICE: "집단·기관·직위 자리표시자"
};
// 동일성이 해결되지 않은 상태: 분석 결과와 함께 '미해결 노드 수'로 보고한다.
export const IDENTITY_UNRESOLVED = new Set(["PROBABLE_SAME", "UNRESOLVED", "UNRESOLVED_DISTINCT"]);

export const COORDINATE_STATUS = {
  sourced: "근거 있는 좌표", pack_no_coordinate: "pack v1에 좌표 없음(위치 불명이라는 뜻 아님)",
  estimated_not_allowed: "추정 좌표 금지 대상", historically_uncertain: "사료상 위치가 불확실하다고 명시"
};
export const LOCATION_STATUS = {
  named_in_pack: "pack에 지명으로 등장", abstract: "추상적 위치(조정 등)", legacy_only: "v2에서만 등장"
};
export const NARRATIVE_STATUS = {
  direct_evidence: "pack 서술을 그대로 옮김", normalized_summary: "pack 서술의 요약·정규화", interpretation: "편집자 해석"
};
export const SOURCE_USAGE = {
  VERIFIED_USED: "pack v1 검증 · 사건 근거로 사용",
  VERIFIED_UNUSED: "pack v1 검증 · 사건 근거로 미사용",
  REGISTERED_UNCHECKED: "등록됐으나 내용 미확인",
  LEGACY: "v2 이관 사료(재대조 전)",
  BIBLIOGRAPHIC_ONLY: "서지 정보만(본문 미확보·2차 서술)"
};

/* ---------------- 인과 상태 (causalStatus) ----------------
   원문에 앞뒤로 나온다는 것만으로 인과를 만들지 않는다. '명령 → 실행'도 명령 관계일 뿐 인과로 자동 동일시하지 않는다.
   EXPLICIT_CAUSAL은 causalEvidence(pack 원문 locator + quote)에 원인·이유를 직접 말하는 표현이 있을 때만:
     예) "Explicit context: reward of commanders' merit", "For those killed:", "credited with …",
         "criticized the campaign …", "contributions major", 제목의 "following first campaign" / "as campaign rewards".
   불확실하면 UNKNOWN. */
export const CAUSAL_STATUS = {
  EXPLICIT_CAUSAL:      "원문이 원인·이유를 직접 진술(causalEvidence 필수)",
  PROCEDURAL_SEQUENCE:  "같은 사료가 기록한 절차상 순서(집결→공격→보고 등) — 인과 주장 아님",
  COMMAND_RELATION:     "명령·지휘 관계 — 명령이 결과를 '일으켰다'는 인과 주장 아님",
  TEMPORAL_ASSOCIATION: "시간상 앞뒤·언급 관계만 확인 — 인과 아님",
  UNKNOWN:              "알 수 없음(기본값)"
};
export const CAUSAL_REQUIRES_EVIDENCE = new Set(["EXPLICIT_CAUSAL", "PROCEDURAL_SEQUENCE"]);

export const THEATERS = {
  CENTRAL:     { label: "중앙(조정)" },
  AMNOK:       { label: "압록강 방면(평안도·파저강)" },
  DUMAN:       { label: "두만강 방면(함길도)" },
  MING:        { label: "명" },
  UNSPECIFIED: { label: "전구 미특정(pack 서술 없음)" }
};
export const THEATER_ORDER = ["CENTRAL", "AMNOK", "DUMAN", "MING", "UNSPECIFIED"];

// 세력·소속(노드 색). 여진을 하나의 정치집단으로 합치지 않는다.
export const AFFILIATIONS = {
  JOSEON_CENTRAL:  { label: "조선 왕실·중앙",              color: "#2c5282" },
  JOSEON_FRONTIER: { label: "조선 북방 군·지방",           color: "#2f6f4f" },
  JOSEON_PEOPLE:   { label: "조선 군졸·주민(집단)",        color: "#718096" },
  JIANZHOU_WEI:    { label: "이만주 및 관하",               color: "#a33a3a" },
  PAJEOGANG_OTHER: { label: "임합라 등(1433 정벌 대상 기타)", color: "#b7652a" },
  JIANZHOU_LEFT:   { label: "맹가첩목아·범찰·동창(편집 분류)", color: "#7f4aa8" },
  HOLLAON:         { label: "홀라온 우디거",               color: "#5e6b1f" },
  ORYANGHAP:       { label: "오량합",                      color: "#8a7a14" },
  ODORI:           { label: "오도리",                      color: "#9b5fc0" },
  UDIGE:           { label: "우디거(세부 집단 미특정)",    color: "#4d7c0f" },
  JURCHEN_UNSPEC:  { label: "여진(세력 미특정)",           color: "#8c6d62" },
  MING:            { label: "명",                          color: "#b7871b" },
  UNKNOWN:         { label: "소속 미상",                   color: "#a0a4aa" }
};

export const ENTITY_TYPES = {
  person:      { label: "개인",          shape: "ellipse" },
  group:       { label: "집단(무명)",    shape: "round-rectangle" },
  institution: { label: "기관·관아",     shape: "hexagon" }
};

export const MECHANISMS = {
  royal_order: "왕명", policy_deliberation: "정책논의", proposal: "건의", janggye: "장계", chigye: "치계",
  hoegye: "회계", report: "보고", mobilization: "동원", pursuit: "추격", battle: "전투", defense: "방어",
  diplomacy: "외교", envoy: "사신·사절", fortification: "축성·방비", resettlement: "사민·이주",
  reward: "포상", punishment: "처벌", welfare: "예우·조휼", investigation: "조사",
  proclamation: "공표", intelligence: "제보·정보", appointment: "임명", claim: "주장",
  accusation: "문죄", administrative_reorganization: "행정개편", mediation: "중재", defection: "투화·이탈",
  relief: "구휼", labor_mobilization: "부역 동원", signal: "봉수·신호", self_report: "자기 변론"
};

export const OUTCOME_TYPES = {
  killed: "전사·피살", wounded: "부상", captured: "피랍·포로", recovered: "탈환·송환", victory: "승전",
  defeat: "패전", withdrawal: "철수", policy_change: "정책 변경", decision: "결정", fortification: "방비 강화·축성",
  county_established: "군현 설치", garrison_established: "진 설치", movement: "이동", reward: "포상",
  relief: "구휼", labor: "부역 동원", attributed_failure: "책임 귀속(사료 서술)", reported_claim: "자기 보고·주장",
  punishment: "처벌", welfare: "예우·보상", proclamation: "공표", appointment: "임명", report_filed: "보고",
  diplomatic_exchange: "외교 교환", claim_made: "주장 제기", investigation: "조사", unresolved: "미해결"
};

export const SOURCE_TYPES = {
  sillok:              "조선왕조실록",
  seojeongnok:         "서정록",
  secondary_reference: "2차 참고자료",
  other_contemporary:  "기타 당대자료"
};
export const SOURCE_LEVELS = {
  primary:                  "1차 사료",
  contemporary_compilation: "당대 편찬물",
  secondary:                "2차 자료"
};

// 문서 유형: 실록 기사 안에 인용된 보고문(embedded document)의 종류
export const DOCUMENT_TYPES = {
  janggye: "장계", chigye: "치계", hoegye: "회계", sangeon: "상언", gyemun: "계문", article: "실록 기사(편찬자 서술)", geography: "지리지"
};

// 검증 상태: 이 세션에서 원문을 다시 읽었는가
export const VERIFICATION = {
  text_checked:   "원문 대조 완료",
  inherited_v2:   "v2 데이터셋에서 이관(기사 링크 있음, 이번 작업에서 원문 재대조 못함)",
  pack_v1:        "사용자 수동 검증 source pack v1(실록 원문 대조됨 · 이 세션 직접 열람 아님)",
  seed_unverified:"사용자 제시 anchor 기사(내용 미확인)",
  not_accessed:   "접근 불가로 내용 미확인(근거로 사용하지 않음)"
};
