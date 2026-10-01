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
  L7: { label: "L7 외부 정치·군사 행위자", short: "외부 행위자" }
};
export const LEVEL_ORDER = ["L0", "L1", "L2", "L3", "L4", "L5", "L6", "L7"];

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
  UNSPECIFIED: { label: "위치 불명" }
};
export const THEATER_ORDER = ["CENTRAL", "AMNOK", "DUMAN", "MING", "UNSPECIFIED"];

// 세력·소속(노드 색). 여진을 하나의 정치집단으로 합치지 않는다.
export const AFFILIATIONS = {
  JOSEON_CENTRAL:  { label: "조선 왕실·중앙",              color: "#2c5282" },
  JOSEON_FRONTIER: { label: "조선 북방 군·지방",           color: "#2f6f4f" },
  JOSEON_PEOPLE:   { label: "조선 군졸·주민(집단)",        color: "#718096" },
  JIANZHOU_WEI:    { label: "건주위(이만주 계열)",         color: "#a33a3a" },
  PAJEOGANG_OTHER: { label: "파저강 기타 세력",            color: "#b7652a" },
  JIANZHOU_LEFT:   { label: "건주좌위 계열",               color: "#7f4aa8" },
  HOLLAON:         { label: "홀라온(올적합)",              color: "#5e6b1f" },
  ORYANGHAP:       { label: "오량합",                      color: "#8a7a14" },
  JURCHEN_UNSPEC:  { label: "여진(세력 미특정)",           color: "#8c6d62" },
  MING:            { label: "명",                          color: "#b7871b" }
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
  accusation: "문죄", administrative_reorganization: "행정개편", mediation: "중재", defection: "투화·이탈"
};

export const OUTCOME_TYPES = {
  killed: "전사·피살", wounded: "부상", captured: "피랍·포로", recovered: "탈환·송환", victory: "승전",
  defeat: "패전", withdrawal: "철수", policy_change: "정책 변경", decision: "결정", fortification: "방비 강화·축성",
  county_established: "군현 설치", garrison_established: "진 설치", movement: "이동", reward: "포상",
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
  janggye: "장계", chigye: "치계", hoegye: "회계", sangeon: "상언", gyemun: "계문", article: "실록 기사(편찬자 서술)"
};

// 검증 상태: 이 세션에서 원문을 다시 읽었는가
export const VERIFICATION = {
  text_checked:   "원문 대조 완료",
  inherited_v2:   "v2 데이터셋에서 이관(기사 링크 있음, 이번 작업에서 원문 재대조 못함)",
  seed_unverified:"사용자 제시 anchor 기사(내용 미확인)",
  not_accessed:   "접근 불가로 내용 미확인(근거로 사용하지 않음)"
};
