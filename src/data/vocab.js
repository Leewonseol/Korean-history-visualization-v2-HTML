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

// pack_v1_derived에 허용되는 정규화 규칙. 이 목록 밖의 변환은 interpretation이다.
export const DERIVATION_RULES = {
  R1_court_recipient:  "pack이 '조정/court/central'로 쓴 수신자를 세종 노드로 표기(조정 보고의 최종 수신자 표기 관례)",
  R2_carrier_split:    "pack의 'A가 B를 통해(via B)' 보고 → A→B, B→조정 두 관계로 분리",
  R3_who_expansion:    "pack 관계의 집합 표현('대신들', 'Jurchen actors', 'groups')을 같은 항목 WHO 목록의 구성원으로 펼침",
  R4_group_placeholder:"pack의 무명 집합(군졸·주민·정보원 등)을 group 노드로 표기",
  R5_content_actor:    "pack WHAT 문장에 행위자로 명시된 인물의 행위를 관계로 표기",
  R6_layer_normalize:  "pack 관계 라벨(예: MILITARY_ATTACK)을 프로젝트 layer 어휘로 매핑",
  R7_report_on_record: "조정에 도달한 보고·전달의 시각을 실록 기사일로 표기"
};

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

export const COVERAGE_STATUS = {
  VERIFIED_WITH_EVENTS:      "pack v1 검증 기사·사건 있음(전수 아님)",
  VERIFIED_NO_RELEVANT_EVENT:"사료 확인 결과 관련 사건 없음(pack에 명시된 경우만)",
  NOT_COVERED:               "pack v1에 검증 기사 미수록(미조사) — '사건 없음'이 아님",
  PARTIAL:                   "일부 기간·기사만 검증",
  UNKNOWN:                   "판단 불가"
};

export const IDENTITY_STATUS = {
  confirmed_same_person: "pack 서술이 여러 등장을 같은 인물로 연결",
  probable_same_person:  "같은 이름의 등장을 한 노드로 묶었으나 pack이 동일성을 명시하지 않음",
  unresolved_homonym:    "동명이인 가능성 — 별도 노드, 자동 병합 금지",
  distinct_person:       "다른 인물로 확인",
  single_attestation:    "pack에 한 번만 등장",
  collective_or_office:  "집단·기관·직위 자리표시자"
};

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

// 인과관계 상태: 시간 선후만으로 causal을 만들지 않는다.
export const CAUSAL_STATUS = {
  explicit:         "사료가 직접 연결(이에 따라·명하여 등)",
  strongly_implied: "사료 맥락상 강하게 시사",
  sequence_only:    "시간 선후관계만 확인",
  unknown:          "알 수 없음"
};

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
