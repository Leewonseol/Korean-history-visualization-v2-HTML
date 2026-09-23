/* ==========================================================================
   1432~1435 조선-건주여진-주변여진-명 관계 네트워크 데이터
   출처: 조선왕조실록(국사편찬위원회 국역), 사용자가 제공한 1차 정리 자료만 사용.
   임의의 사실 추가·상하관계 추론 없음. 확정되지 않은 내용은 certainty로 구분.
   ========================================================================== */

/* -------------------------------- 클러스터 -------------------------------- */
const CLUSTERS = {
  JOSEON_CENTRAL:  { label: "조선 왕실·중앙정부", color: "#2b4c7e", filterGroup: "JOSEON_CENTRAL" },
  JOSEON_MILITARY: { label: "조선 군부·북방 현장", color: "#3f7a5f", filterGroup: "JOSEON_MILITARY" },
  JIANZHOU_MANJU:  { label: "건주위 · 이만주 계열", color: "#a13d3d", filterGroup: "JIANZHOU" },
  PAJEOGANG_OTHER: { label: "파저강 기타 세력",     color: "#b06a2c", filterGroup: "JIANZHOU" },
  JIANZHOU_JWA:    { label: "건주좌위 계열",         color: "#8a4fae", filterGroup: "JIANZHOU" },
  JURCHEN_OTHER:   { label: "홀라온 · 기타 여진",    color: "#5c6b23", filterGroup: "JURCHEN_OTHER" },
  MING:            { label: "명",                    color: "#c99a2e", filterGroup: "MING" }
};

const FILTER_GROUPS = [
  { id: "JOSEON_CENTRAL",  label: "조선 중앙" },
  { id: "JOSEON_MILITARY", label: "조선 군부" },
  { id: "JIANZHOU",        label: "건주위(이만주·임합라·맹가첩목아 등)" },
  { id: "JURCHEN_OTHER",   label: "기타 여진(홀라온 등)" },
  { id: "MING",            label: "명" }
];

/* -------------------------------- 관계 타입 -------------------------------- */
// 색상 + 선모양(실선/점선/굵기/화살표) 을 함께 사용해 구분한다.
const RELATION_TYPES = {
  COMMAND:              { label: "지휘",         color: "#1f4e79", width: 4,   style: "solid",  arrow: "triangle" },
  SUBORDINATE:          { label: "관하(부하)",    color: "#3a6ea5", width: 2.5, style: "solid",  arrow: "triangle-tee" },
  MILITARY_CONFLICT:    { label: "군사충돌",      color: "#b3362c", width: 5,   style: "solid",  arrow: "triangle" },
  INVESTIGATION:        { label: "조사",          color: "#5b6b7a", width: 2,   style: "dashed", arrow: "circle" },
  POLICY_ADVICE:        { label: "정책 자문",     color: "#3d7a6a", width: 1.5, style: "solid",  arrow: "vee" },
  POLICY_DISAGREEMENT:  { label: "정책 견해차",   color: "#b8860b", width: 2,   style: "dotted", arrow: "diamond", bidirectional: true },
  ACCUSATION:           { label: "문죄/책임주장", color: "#8a2e2e", width: 2.5, style: "dashed", arrow: "triangle" },
  CLAIM:                { label: "당사자 주장",   color: "#7a5ea8", width: 1.5, style: "dotted", arrow: "vee" },
  COUNTER_CLAIM:         { label: "반박 주장",     color: "#a8618f", width: 1.5, style: "dotted", arrow: "vee" },
  DIPLOMACY:            { label: "외교/통교",     color: "#2f7a4f", width: 1.5, style: "solid",  arrow: "vee" },
  MEDIATION:            { label: "명의 중재",     color: "#c9a227", width: 2.5, style: "solid",  arrow: "diamond" },
  ACCOUNTABILITY:       { label: "책임추궁",       color: "#a94422", width: 2.5, style: "dashed", arrow: "square" },
  REWARD:               { label: "포상",           color: "#5a8a3a", width: 2,   style: "solid",  arrow: "circle" },
  WELFARE:              { label: "전사자·피해자 보상", color: "#4a7a9a", width: 2, style: "solid", arrow: "circle" },
  DEFENSE_REFORM:        { label: "방어체계 개편",  color: "#7a5a3a", width: 2,   style: "solid",  arrow: "triangle-cross" },
  MIGRATION:              { label: "집단 이동",     color: "#8a8a3a", width: 2,   style: "dashed", arrow: "vee" }
};

const CERTAINTY_LABELS = {
  confirmed:          { label: "확인된 사실",  badge: "사실" },
  contemporary_claim: { label: "당대인의 주장", badge: "주장" },
  disputed:           { label: "확정되지 않음(책임 공방)", badge: "미확정" },
  interpretation:     { label: "후대 해석/집계", badge: "해석" }
};

const EVENT_CATEGORY_LABELS = {
  battle: "전투", policy: "정책", diplomacy: "외교", claim: "주장",
  counter_claim: "반박 주장", accountability: "책임 추궁", welfare: "보상",
  defense: "방어체계", fact: "사실 확인", public: "대국민 공표", migration: "집단 이동"
};

/* ---------------------------------- 인물 ---------------------------------- */
// pos: 고정 좌표(멘탈맵 유지를 위해 시간이 변해도 노드 위치는 바뀌지 않는다)
const PEOPLE = [
  // 조선 왕실·중앙정부
  { id: "JO_SEJONG",           name: "세종",     cluster: "JOSEON_CENTRAL", baseNote: "조선 국왕", pos: { x: 170, y: 20 } },
  { id: "JO_HWANGHUI",         name: "황희",     cluster: "JOSEON_CENTRAL", baseNote: "영의정", pos: { x: 40, y: 130 } },
  { id: "JO_MAENGSASEONG",     name: "맹사성",   cluster: "JOSEON_CENTRAL", baseNote: "대신", pos: { x: 140, y: 130 } },
  { id: "JO_GWONJIN",          name: "권진",     cluster: "JOSEON_CENTRAL", baseNote: "대신", pos: { x: 240, y: 130 } },
  { id: "JO_HEOJO",            name: "허조",     cluster: "JOSEON_CENTRAL", baseNote: "대신", pos: { x: 340, y: 130 } },
  { id: "JO_ANSUN",            name: "안순",     cluster: "JOSEON_CENTRAL", baseNote: "대신", pos: { x: 40, y: 210 } },
  { id: "JO_JEONGHEUMJI",      name: "정흠지",   cluster: "JOSEON_CENTRAL", baseNote: "대신", pos: { x: 140, y: 210 } },
  { id: "JO_CHOESAGANG",       name: "최사강",   cluster: "JOSEON_CENTRAL", baseNote: "병조판서", pos: { x: 240, y: 210 } },
  { id: "JO_ANSUNGSEON",       name: "안숭선",   cluster: "JOSEON_CENTRAL", baseNote: "승정원", pos: { x: 340, y: 210 } },
  { id: "JO_KIMCHEONG",        name: "김청",     cluster: "JOSEON_CENTRAL", baseNote: "문서 실무", pos: { x: 40, y: 290 } },
  { id: "JO_KIMJONGSEO",       name: "김종서",   cluster: "JOSEON_CENTRAL", baseNote: "승정원", pos: { x: 140, y: 290 } },
  { id: "JO_CHOEGYEONGMYEONG", name: "최경명",   cluster: "JOSEON_CENTRAL", baseNote: "사헌부 지평", pos: { x: 240, y: 290 } },
  { id: "JO_NOHAN",            name: "노한",     cluster: "JOSEON_CENTRAL", baseNote: "자문대신", pos: { x: 340, y: 290 } },
  { id: "JO_SINSANG",          name: "신상",     cluster: "JOSEON_CENTRAL", baseNote: "예조판서", pos: { x: 40, y: 370 } },
  { id: "JO_LEESUKCHI",        name: "이숙치",   cluster: "JOSEON_CENTRAL", baseNote: "중앙대신", pos: { x: 140, y: 370 } },

  // 조선 군부·북방 현장
  { id: "JO_CHOEYUNDEOK",  name: "최윤덕",   cluster: "JOSEON_MILITARY", baseNote: "평안도 도절제사", pos: { x: 200, y: 480 } },
  { id: "JO_PARKCHO",      name: "박초",     cluster: "JOSEON_MILITARY", baseNote: "강계절제사", pos: { x: 40, y: 560 } },
  { id: "JO_HONGSASEOK",   name: "홍사석",   cluster: "JOSEON_MILITARY", baseNote: "현장 조사·조전절제사", pos: { x: 140, y: 560 } },
  { id: "JO_LEESUNMONG",   name: "이순몽",   cluster: "JOSEON_MILITARY", baseNote: "중군절제사", pos: { x: 240, y: 560 } },
  { id: "JO_CHOEHAESAN",   name: "최해산",   cluster: "JOSEON_MILITARY", baseNote: "좌군절제사", pos: { x: 340, y: 560 } },
  { id: "JO_LEEGAK",       name: "이각",     cluster: "JOSEON_MILITARY", baseNote: "우군절제사(1433)→평안도 도절제사(1435)", pos: { x: 40, y: 640 } },
  { id: "JO_LEEJINGSEOK",  name: "이징석",   cluster: "JOSEON_MILITARY", baseNote: "조전절제사", pos: { x: 140, y: 640 } },
  { id: "JO_KIMHYOSEONG",  name: "김효성",   cluster: "JOSEON_MILITARY", baseNote: "정벌군 지휘관", pos: { x: 240, y: 640 } },
  { id: "JO_KIMYUNSU",     name: "김윤수",   cluster: "JOSEON_MILITARY", baseNote: "여연군수", pos: { x: 340, y: 640 } },
  { id: "JO_LEEJIN",       name: "이진",     cluster: "JOSEON_MILITARY", baseNote: "도진무 상호군", pos: { x: 40, y: 720 } },
  { id: "JO_YEOSEONGRYEOL",name: "여성렬",   cluster: "JOSEON_MILITARY", baseNote: "수군첨절제사", pos: { x: 140, y: 720 } },
  { id: "JO_KIMSUYEON",    name: "김수연",   cluster: "JOSEON_MILITARY", baseNote: "군관", pos: { x: 240, y: 720 } },
  { id: "JO_JANGSAU",      name: "장사우",   cluster: "JOSEON_MILITARY", baseNote: "진무", pos: { x: 340, y: 720 } },
  { id: "JO_BAECHEOL",     name: "배철",     cluster: "JOSEON_MILITARY", baseNote: "사정", pos: { x: 440, y: 720 } },

  // 집단(전사자/피해자) 노드 - 개인이 아님
  { id: "GROUP_1433_WARDEAD",   name: "1433년 정벌 전사·병사자", cluster: "JOSEON_MILITARY", isGroup: true, baseNote: "군관·군졸 및 유가족", pos: { x: 460, y: 560 } },
  { id: "GROUP_1435_CASUALTIES",name: "1435년 여연 피살·피랍민/전사자", cluster: "JOSEON_MILITARY", isGroup: true, baseNote: "여연 침입 피해 인민", pos: { x: 460, y: 640 } },

  // 명
  { id: "MING_XUANDE", name: "선덕제", cluster: "MING", baseNote: "명 황제", pos: { x: 700, y: 20 } },
  { id: "MING_MENGNAL", name: "맹날가래", cluster: "MING", baseNote: "명 관리", pos: { x: 700, y: 160 } },

  // 건주위 · 이만주 계열
  { id: "JZ_MANJU",    name: "이만주", cluster: "JIANZHOU_MANJU", baseNote: "건주위 도지휘", pos: { x: 1000, y: 20 } },
  { id: "JZ_YUEULHAP", name: "유을합", cluster: "JIANZHOU_MANJU", baseNote: "이만주 관하 천호", pos: { x: 1130, y: 100 } },

  // 파저강 기타 세력 (이만주의 부하로 그리지 않음)
  { id: "JZ_IMHALA",     name: "임합라",   cluster: "PAJEOGANG_OTHER", baseNote: "파저강 세력 지도자(실록상 正賊)", pos: { x: 940, y: 230 } },
  { id: "JZ_SIMTANAPNO", name: "심타납노", cluster: "PAJEOGANG_OTHER", baseNote: "파저강 세력", pos: { x: 1060, y: 310 } },

  // 건주좌위 계열 (이만주의 부하로 그리지 않음)
  { id: "JZ_MENGGETEMUR", name: "맹가첩목아", cluster: "JIANZHOU_JWA", baseNote: "건주좌위 계열 지도자", pos: { x: 1000, y: 410 } },
  { id: "JZ_FANCHA",      name: "범찰",       cluster: "JIANZHOU_JWA", baseNote: "건주좌위 계열 지도자", pos: { x: 1130, y: 490 } },

  // 홀라온 / 기타 여진 (통일 국가로 취급하지 않음)
  { id: "JUR_HOLLAON", name: "홀라온 / 오량합 세력", cluster: "JURCHEN_OTHER", baseNote: "주변 여진 세력(여러 침입·분쟁에 등장)", pos: { x: 1000, y: 590 } },
  { id: "JUR_YANGMOK",  name: "양목답올", cluster: "JURCHEN_OTHER", baseNote: "홀라온계 인물(명 칙서·여진 내부 분쟁에 등장)", pos: { x: 1130, y: 670 } }
];

/* ---------------------------------- 사료 ---------------------------------- */
const SOURCES = [
  { id: "SRC_1432_1209", label: "세종실록 14년 12월 9일", url: "https://sillok.history.go.kr/id/wda_11412009_003" },
  { id: "SRC_1432_1221", label: "세종실록 14년 12월 21일", url: "https://sillok.history.go.kr/id/kda_11412021_003" },
  { id: "SRC_1433_0215", label: "세종실록 15년 2월 15일", url: "https://sillok.history.go.kr/id/kda_11502015_002" },
  { id: "SRC_1433_0226", label: "세종실록 15년 2월 26일", url: "https://sillok.history.go.kr/id/kda_11502026_004" },
  { id: "SRC_1433_0310", label: "세종실록 15년 3월 10일", url: "https://sillok.history.go.kr/id/kda_11503010_005" },
  { id: "SRC_1433_0325", label: "세종실록 15년 3월 25일", url: "https://sillok.history.go.kr/id/wda_11503025_002" },
  { id: "SRC_1433_0507", label: "세종실록 15년 5월 7일(4/10, 4/19 관련)", url: "https://sillok.history.go.kr/id/kda_11505007_002" },
  { id: "SRC_1433_0511", label: "세종실록 15년 5월 11일", url: "https://sillok.history.go.kr/id/kda_11505011_004" },
  { id: "SRC_1433_0517", label: "세종실록 15년 5월 17일", url: "https://sillok.history.go.kr/id/kda_11505017_002" },
  { id: "SRC_1433_0601", label: "세종실록 15년 6월 1일", url: "https://sillok.history.go.kr/id/kda_11506001_003" },
  { id: "SRC_1433_0610", label: "세종실록 15년 6월 10일", url: "https://sillok.history.go.kr/id/wda_11506010_002" },
  { id: "SRC_1433_0810", label: "세종실록 15년 윤8월 10일", url: "https://sillok.history.go.kr/id/wda_11508110_001" },
  { id: "SRC_1433_1221", label: "세종실록 15년 12월 21일", url: "https://sillok.history.go.kr/id/kda_11512021_002" },
  { id: "SRC_1434_0416", label: "세종실록 16년 4월 16일", url: "https://sillok.history.go.kr/id/kda_11604016_003" },
  { id: "SRC_1434_0422", label: "세종실록 16년 4월 22일", url: "https://sillok.history.go.kr/id/kda_11604022_001" },
  { id: "SRC_1434_0426", label: "세종실록 16년 4월 26일", url: "https://sillok.history.go.kr/id/kda_11604026_006" },
  { id: "SRC_1434_0914", label: "세종실록 16년 9월 14일", url: "https://sillok.history.go.kr/id/kda_11609014_001" },
  { id: "SRC_1434_1010", label: "세종실록 16년 10월 10일", url: "https://sillok.history.go.kr/id/kda_11610010_005" },
  { id: "SRC_1434_1012", label: "세종실록 16년 10월 12일", url: "https://sillok.history.go.kr/id/wda_11610012_001" },
  { id: "SRC_1435_0113", label: "세종실록 17년 1월 18일(1/13 여연성 포위 보고)", url: "https://sillok.history.go.kr/id/wda_11701018_002" },
  { id: "SRC_1435_0125", label: "세종실록 17년 1월 25일", url: "https://sillok.history.go.kr/id/kda_11701025_001" },
  { id: "SRC_1435_0224", label: "세종실록 17년 2월 24일", url: "https://sillok.history.go.kr/id/wda_11702024_001" },
  { id: "SRC_1435_0613", label: "세종실록 17년 6월 13일", url: "https://sillok.history.go.kr/id/kda_11706013_003" },
  { id: "SRC_1435_0617", label: "세종실록 17년 6월 17일", url: "https://sillok.history.go.kr/id/kda_11706017_004" },
  { id: "SRC_1435_0918", label: "세종실록 17년 9월 18일", url: "https://sillok.history.go.kr/id/wda_11709018_003" }
];

/* ---------------------------------- 사건 ---------------------------------- */
const EVENTS = [
  {
    id: "E1432_01", date: "1432-12-09", title: "여연 침입과 박초의 추격",
    categories: ["battle", "fact"], certainty: "confirmed",
    summary: "야인 기병 약 400기가 여연 경내에 침입해 사람과 재물을 약탈했다. 강계절제사 박초가 이를 추격해 포로 26명, 말 30필, 소 50마리를 되찾았다. 조선군은 전사 13명, 부상 25명의 피해를 입었다. 세종은 크게 노하여 명의 경계를 넘어 추격할 수 있는지를 논의하게 했다.",
    people: ["JO_SEJONG", "JO_PARKCHO", "JO_HWANGHUI", "JO_MAENGSASEONG", "JO_GWONJIN", "JO_CHOESAGANG"],
    edgeIds: ["ED001", "ED003", "ED004", "ED005", "ED006"],
    personStateIds: ["PS_SJ01"],
    sourceId: "SRC_1432_1209"
  },
  {
    id: "E1432_02", date: "1432-12-09", title: "세종, 홍사석을 현장에 파견",
    categories: ["fact"], certainty: "confirmed",
    summary: "세종이 홍사석을 강계·여연에 보내 실제 접전 경위를 조사하게 했다.",
    people: ["JO_SEJONG", "JO_HONGSASEOK"],
    edgeIds: ["ED002"],
    personStateIds: ["PS001", "PS_SJ02"],
    sourceId: "SRC_1432_1209"
  },
  {
    id: "E1432_03", date: "1432-12-21", title: "이만주의 해명과 유을합의 포로 송환",
    categories: ["claim", "diplomacy"], certainty: "disputed",
    summary: "이만주의 관하 천호 유을합이 포로 7명을 데려왔다. 이만주 측은 \"홀라온 올적합 100여 명이 침입했고, 자신은 600명을 동원해 조선 포로 64명을 빼앗아 보호하고 있다\"고 주장했다. 1432년 침입의 실제 주도자가 누구인지는 이 시점에 확정되지 않는다.",
    people: ["JZ_MANJU", "JZ_YUEULHAP", "JO_SEJONG", "JO_ANSUNGSEON", "JO_KIMJONGSEO"],
    edgeIds: ["ED007", "ED008", "ED009", "ED010", "ED011", "ED012"],
    personStateIds: ["PS002", "PS003", "PS_SJ03"],
    sourceId: "SRC_1432_1221"
  },
  {
    id: "E1433_01", date: "1433-02-15", title: "정벌 여부를 둘러싼 조정 내부 논의",
    categories: ["policy"], certainty: "confirmed",
    summary: "세종이 정벌 의도를 숨긴 채 의정부·육조·삼군도진무에게 파저강 세력의 죄목과 접대·토벌 방법을 비밀리에 제출하게 했다. 황희·맹사성·권진·허조·안순·정흠지·이순몽·최사강 등이 서로 다른 견해를 제시했다.",
    people: ["JO_SEJONG", "JO_HWANGHUI", "JO_MAENGSASEONG", "JO_GWONJIN", "JO_HEOJO", "JO_ANSUN", "JO_JEONGHEUMJI", "JO_LEESUNMONG", "JO_CHOESAGANG"],
    edgeIds: ["ED013", "ED014", "ED015", "ED016", "ED017", "ED018", "ED019", "ED020"],
    personStateIds: ["PS_SJ04"],
    sourceId: "SRC_1433_0215"
  },
  {
    id: "E1433_02", date: "1433-02-26", title: "정벌 결정과 최윤덕 지휘권 확정",
    categories: ["policy"], certainty: "confirmed",
    summary: "실록이 \"이미 파저강을 토벌할 계책을 정하였다\"고 기록했다. 최윤덕을 원정의 핵심 지휘관으로 두는 체제가 확정되었다.",
    people: ["JO_SEJONG", "JO_CHOEYUNDEOK"],
    edgeIds: ["ED021"],
    personStateIds: ["PS005", "PS_SJ05"],
    sourceId: "SRC_1433_0226"
  },
  {
    id: "E1433_03", date: "1433-03-10", title: "성죄방목 작성과 공식 문죄",
    categories: ["policy", "public"], certainty: "confirmed",
    summary: "안숭선·김청이 성죄방목을 작성했다. 조선은 파저강 세력이 평소 조선의 구제를 받았음에도 홀라온으로 가장해 강계·여연을 침범하고 인민·가축을 죽이고 재산을 약탈했다는 공식 죄목을 제시했다. 조선이 이러한 죄목을 공식 제기했다는 사실 자체는 실록에 확인되나, 죄목 내용의 실제 진위는 별개의 문제다.",
    people: ["JO_SEJONG", "JO_ANSUNGSEON", "JO_KIMCHEONG", "JO_CHOEYUNDEOK", "JZ_MANJU", "JZ_SIMTANAPNO"],
    edgeIds: ["ED022", "ED023", "ED024", "ED025"],
    personStateIds: ["PS007", "PS008", "PS009", "PS_SJ06"],
    sourceId: "SRC_1433_0310"
  },
  {
    id: "E1433_04", date: "1433-03-25", title: "맹가첩목아에 대한 비밀 지시",
    categories: ["policy"], certainty: "confirmed",
    summary: "세종이 최윤덕에게 맹가첩목아가 적을 도우면 공격하되, 돕지 않고 귀순하면 죽이지 말라고 비밀리에 지시했다. 여진 전체를 하나의 적으로 취급하지 않고 가담 여부에 따라 대응을 분리한 것이다.",
    people: ["JO_SEJONG", "JO_CHOEYUNDEOK", "JZ_MENGGETEMUR"],
    edgeIds: ["ED026"],
    personStateIds: ["PS010"],
    sourceId: "SRC_1433_0325"
  },
  {
    id: "E1433_05", date: "1433-04-10", title: "정벌군 강계 집결과 7로 편성",
    categories: ["battle"], certainty: "confirmed",
    summary: "평안도군 1만과 황해도군 5천이 강계에 집결해 7개 부대로 나뉘었다.",
    people: ["JO_CHOEYUNDEOK", "JO_LEESUNMONG", "JO_CHOEHAESAN", "JO_LEEGAK", "JO_LEEJINGSEOK", "JO_KIMHYOSEONG", "JO_HONGSASEOK"],
    edgeIds: ["ED027", "ED028", "ED029", "ED030", "ED031", "ED032"],
    personStateIds: ["PS011", "PS012", "PS013", "PS014", "PS015", "PS016", "PS_SJ07"],
    sourceId: "SRC_1433_0507"
  },
  {
    id: "E1433_06", date: "1433-04-19", title: "제1차 파저강 정벌 실행",
    categories: ["battle"], certainty: "confirmed",
    summary: "이순몽은 이만주의 채리를, 김효성은 임합라 부모의 채리를, 최윤덕은 실록이 '정적(正賊)'이라 부른 임합라의 채리를 공격했다. 임합라는 이만주의 확정된 부하로 서술되지 않으며, 별도의 공격 대상으로 지목된다.",
    people: ["JO_CHOEYUNDEOK", "JO_LEESUNMONG", "JO_KIMHYOSEONG", "JZ_MANJU", "JZ_IMHALA"],
    edgeIds: ["ED033", "ED034", "ED035"],
    personStateIds: ["PS017", "PS018"],
    sourceId: "SRC_1433_0507"
  },
  {
    id: "E1433_07", date: "1433-05-07", title: "정벌 전과 보고와 군령 위반 문제",
    categories: ["accountability"], certainty: "confirmed",
    summary: "최윤덕이 전과·사상자와 함께 일부 지휘관의 군령 위반도 보고했다. 승전 후에도 자군 내부의 군율 문제를 별도로 다룬 것이다(개별 인명은 실록에 특정되지 않음).",
    people: ["JO_CHOEYUNDEOK"],
    edgeIds: [],
    personStateIds: ["PS019"],
    sourceId: "SRC_1433_0507"
  },
  {
    id: "E1433_08", date: "1433-05-11", title: "정벌 이유의 대국민 공표",
    categories: ["public"], certainty: "confirmed",
    summary: "예조가 농사철에 대군을 동원한 이유를 \"경내 인민이 확실히 알도록 중외에 포고\"하자고 건의했고 세종이 승인했다.",
    people: ["JO_SEJONG"],
    edgeIds: [],
    personStateIds: ["PS_SJ08"],
    sourceId: "SRC_1433_0511"
  },
  {
    id: "E1433_09", date: "1433-05-17", title: "전사자·병사자 보상",
    categories: ["welfare"], certainty: "confirmed",
    summary: "파저강 전사 군관은 쌀·콩 각 5석, 군졸은 각 3석과 5년 복호를 받았다. 병사자는 군관 각 3석, 군졸 각 2석과 2년 복호를 받았다. 전사자에게는 초혼·치제를 시행했다.",
    people: ["JO_SEJONG"],
    edgeIds: ["ED036"],
    personStateIds: ["PS021", "PS_SJ09"],
    sourceId: "SRC_1433_0517"
  },
  {
    id: "E1433_10", date: "1433-06-01", title: "자성군 설치",
    categories: ["policy", "defense"], certainty: "confirmed",
    summary: "여연과 강계 사이 요충지 자작리에 자성군을 설치했다. 정벌 이후 일회성 보복이 상설 국경 방어체계로 전환되는 과정이다.",
    people: ["JO_SEJONG"],
    edgeIds: [],
    personStateIds: ["PS_SJ10"],
    sourceId: "SRC_1433_0601"
  },
  {
    id: "E1433_11", date: "1433-06-10", title: "맹가첩목아의 반박: 진짜 주범은 임합라",
    categories: ["counter_claim"], certainty: "contemporary_claim",
    summary: "맹가첩목아가 조선 사신 지함에게 \"진짜 파저강 도적 괴수는 임합라이며, 이만주는 오히려 말렸다\"고 주장했다. 이만주를 1432년 침입의 단독 주범으로 단정할 수 없게 하는 또 다른 당사자 주장이다.",
    people: ["JZ_MENGGETEMUR", "JZ_IMHALA", "JZ_MANJU"],
    edgeIds: ["ED037"],
    personStateIds: ["PS022"],
    sourceId: "SRC_1433_0610"
  },
  {
    id: "E1433_12", date: "1433-08-10", dateNote: "세종실록 원문은 '윤8월 10일'(음력 윤달)",
    title: "명 선덕제의 중재", categories: ["diplomacy"], certainty: "confirmed",
    summary: "명 선덕제가 조선 측 보고와 이만주 측 항의를 모두 검토한 뒤 진위를 명확히 가리기 어렵다고 하며, 상호 포로·가축·문서 반환과 침범 중지를 명령했다.",
    people: ["MING_XUANDE", "JO_SEJONG", "JZ_MANJU", "JZ_MENGGETEMUR", "JZ_FANCHA", "JUR_HOLLAON"],
    edgeIds: ["ED038", "ED039", "ED040", "ED041"],
    personStateIds: ["PS023", "PS024", "PS025", "PS026", "PS_SJ11"],
    sourceId: "SRC_1433_0810"
  },
  {
    id: "E1433_13", date: "1433-12-21", title: "이만주, 조선에 사절 파견",
    categories: ["diplomacy"], certainty: "confirmed",
    summary: "이만주가 왕답올·유살독 등 14명을 조선에 보내 토산물을 바쳤다. 같은 해 정벌을 치른 뒤에도 적대 관계가 아니라 제한적 통교로 관계가 재변화했다.",
    people: ["JZ_MANJU", "JO_SEJONG"],
    edgeIds: ["ED042"],
    personStateIds: ["PS027"],
    sourceId: "SRC_1433_1221"
  },
  {
    id: "E1434_01", date: "1434-04-16", title: "이만주, 강계부에 문서 발송",
    categories: ["diplomacy"], certainty: "confirmed",
    summary: "이만주가 강계부에 문서를 보내 원상미 20포를 수령하겠다는 뜻과, 건주위에서 도주한 남녀 7명의 반환을 요청했다.",
    people: ["JZ_MANJU"],
    edgeIds: ["ED043"],
    personStateIds: ["PS028"],
    sourceId: "SRC_1434_0416"
  },
  {
    id: "E1434_02", date: "1434-04-22", title: "도망자 송환을 둘러싼 조정 논쟁",
    categories: ["policy", "diplomacy"], certainty: "confirmed",
    summary: "세종과 조정이 이만주가 요구한 도망자 7명 송환 여부를 논의했다. 예조판서 신상은 강제 송환이 향후 귀화를 막을 수 있다며 반대했다.",
    people: ["JO_SEJONG", "JO_SINSANG", "JZ_MANJU"],
    edgeIds: ["ED044"],
    personStateIds: ["PS029", "PS030"],
    sourceId: "SRC_1434_0422"
  },
  {
    id: "E1434_03", date: "1434-04-26", title: "이만주 관하 인원의 조선 이탈",
    categories: ["diplomacy"], certainty: "confirmed",
    summary: "이만주 관하 장교하·유포자·왕안탄 등이 조선으로 도망했다. 조선은 이만주가 찾으면 돌려보내는 방안을 논의했다.",
    people: ["JO_HWANGHUI", "JZ_MANJU"],
    edgeIds: ["ED045"],
    personStateIds: ["PS031"],
    sourceId: "SRC_1434_0426"
  },
  {
    id: "E1434_04", date: "1434-09-14", title: "자성군 방비 강화",
    categories: ["defense"], certainty: "confirmed",
    summary: "홍수로 압록강이 얕아져 도하가 쉬워지자 자성군이 갑사·군인을 배치해 방비를 강화했다.",
    people: [], edgeIds: [], personStateIds: [],
    sourceId: "SRC_1434_0914"
  },
  {
    id: "E1434_05", date: "1434-10-10", title: "부방군 교대체계 정비와 병마 편제 감독",
    categories: ["defense", "accountability"], certainty: "confirmed",
    summary: "여연·자성·강계 등의 동계 부방군 교대체계를 정비했다. 동시에 병조는 도절제사가 병마의 편제를 자의적으로 조정한 문제를 감사에게 탄핵하도록 했다(해당 도절제사의 실명은 이 기사에 특정되지 않음).",
    people: [], edgeIds: [], personStateIds: [],
    sourceId: "SRC_1434_1010"
  },
  {
    id: "E1434_06", date: "1434-10-12", title: "명, 홀라온 억류 조선인 포로 송환 중재",
    categories: ["diplomacy"], certainty: "confirmed",
    summary: "명이 홀라온에 잡혀 있는 조선인 포로의 생존을 확인하고 송환을 중재했다.",
    people: ["MING_XUANDE", "MING_MENGNAL", "JUR_HOLLAON"],
    edgeIds: ["ED046", "ED047"],
    personStateIds: ["PS032"],
    sourceId: "SRC_1434_1012"
  },
  {
    id: "E1435_01", date: "1435-01-13", reportedDate: "1435-01-18", title: "오량합의 여연성 포위",
    categories: ["battle"], certainty: "confirmed",
    summary: "오량합 기병 약 2,700기가 여연성을 포위했다. 김윤수·이진·여성렬·김수연 등이 방어했다. 김윤수와 군졸들이 부상하고 군졸 1명이 사망했다. 김수연은 100명을 이끌고 추격하다 적 복병 약 300기를 발견하고 철수했다. 공격 세력은 실록상 '오량합'이며, 이만주가 직접 지휘했다고 단정할 수 없다.",
    people: ["JO_KIMYUNSU", "JO_LEEJIN", "JO_YEOSEONGRYEOL", "JO_KIMSUYEON", "JUR_HOLLAON"],
    edgeIds: ["ED048", "ED049", "ED050", "ED051"],
    personStateIds: ["PS033", "PS034", "PS035", "PS036"],
    sourceId: "SRC_1435_0113"
  },
  {
    id: "E1435_02", date: "1435-01-25", title: "여연 방어구조 개편 검토",
    categories: ["policy"], certainty: "confirmed",
    summary: "세종이 여연은 적이 쉽게 들어오고 빠져나가 추격이 어렵다는 구조적 문제를 지적했다. 객병 대신 주민을 이주시켜 토병 중심으로 상시 방어하는 방안을 검토하게 했다.",
    people: ["JO_SEJONG", "JO_LEESUKCHI"],
    edgeIds: ["ED052"],
    personStateIds: ["PS037", "PS_SJ12"],
    sourceId: "SRC_1435_0125"
  },
  {
    id: "E1435_03", date: "1435-02-24", title: "범찰의 이만주 지역 합류 허가",
    categories: ["diplomacy", "migration"], certainty: "confirmed",
    summary: "명이 건주좌위 범찰과 일부 관민이 이만주가 있는 곳으로 이동해 함께 거주하는 것을 허가했다. 이는 거주지 이동이며, 범찰이 이만주의 부하로 편입되었다는 의미로 확대 해석할 수 없다.",
    people: ["MING_XUANDE", "JZ_MANJU", "JZ_FANCHA"],
    edgeIds: ["ED053", "ED054"],
    personStateIds: ["PS038", "PS039", "PS040"],
    sourceId: "SRC_1435_0224"
  },
  {
    id: "E1435_04", date: "1435-06-13", title: "여연 미보고 침입 사건 발각과 김윤수 문책",
    categories: ["accountability", "fact"], certainty: "confirmed",
    summary: "귀화한 파저강 여진인이 \"지난 정월 이만주가 홀라온과 여연을 침입해 남자 2명을 죽이고 남녀 7명·말 6필·소 5두를 끌고 갔다\"고 제보했다. 조사 결과 사건은 사실로 확인되었다. 문제는 김윤수가 6개월가량 보고하지 않았고, 도절제사 이각도 즉시 조사·보고하지 않았다는 점이었다. 병조판서 최사강은 이를 '변경의 대사'라 규정해 문책을 요구했다. 세종은 김윤수의 고신을 빼앗되 현직에 남기고, 피살자들을 조휼하도록 했다. 이 사건은 1월 13일 오량합의 여연성 포위와는 별개의 사건이다.",
    people: ["JO_KIMYUNSU", "JO_LEEGAK", "JO_CHOESAGANG", "JO_HWANGHUI", "JO_CHOEYUNDEOK", "JO_NOHAN", "JO_SEJONG", "JZ_MANJU", "JUR_HOLLAON"],
    edgeIds: ["ED055", "ED056", "ED057", "ED058", "ED059", "ED060", "ED061", "ED062", "ED063"],
    personStateIds: ["PS041", "PS042", "PS043", "PS044", "PS045", "PS046", "PS_SJ13"],
    sourceId: "SRC_1435_0613"
  },
  {
    id: "E1435_05", date: "1435-06-17", title: "사헌부, 김윤수 처분 강화 요구",
    categories: ["accountability"], certainty: "confirmed",
    summary: "사헌부 지평 최경명이 김윤수 처분이 너무 가볍다며 재추국과 율에 따른 처벌을 요구했다. 세종은 유임 방침을 유지했다.",
    people: ["JO_CHOEGYEONGMYEONG", "JO_KIMYUNSU", "JO_SEJONG"],
    edgeIds: ["ED064", "ED065"],
    personStateIds: ["PS047", "PS048"],
    sourceId: "SRC_1435_0617"
  },
  {
    id: "E1435_06", date: "1435-09-18", title: "추격 공로 포상과 전사자 예우",
    categories: ["accountability", "welfare"], certainty: "confirmed",
    summary: "병조는 여연 침입 때 김윤수가 강을 건너 적의 퇴로를 끊고, 장사우·배철 등이 끝까지 추격해 약탈품을 되찾은 공을 포상하자고 했다. 동시에 방비 소홀·소극 전투자는 처벌하고, 전사자에게 증직·부의·호역 면제를 시행하도록 했다. 김윤수는 같은 해 두 차례 문책을 받은 동일 인물이 공로자로도 재평가되는, 이 시기를 대표하는 사례다.",
    people: ["JO_KIMYUNSU", "JO_JANGSAU", "JO_BAECHEOL", "JO_CHOESAGANG", "JO_SEJONG"],
    edgeIds: ["ED066", "ED067", "ED068", "ED069"],
    personStateIds: ["PS049", "PS050", "PS051"],
    sourceId: "SRC_1435_0918"
  }
];

/* ------------------------- 관계선(시간가변) ------------------------- */
const EDGES = [
  // --- 1432-12-09 ---
  { id: "ED001", source: "JO_SEJONG", target: "JO_PARKCHO", relationType: "COMMAND", certainty: "confirmed",
    startDate: "1432-12-09", endDate: null, eventId: "E1432_01", sourceId: "SRC_1432_1209",
    description: "강계절제사로서 국왕의 명을 받는 변경 지휘관" },
  { id: "ED002", source: "JO_SEJONG", target: "JO_HONGSASEOK", relationType: "INVESTIGATION", certainty: "confirmed",
    startDate: "1432-12-09", endDate: "1433-04-09", eventId: "E1432_02", sourceId: "SRC_1432_1209",
    description: "여연 침입의 실제 접전 경위를 조사하도록 현장에 파견" },
  { id: "ED003", source: "JO_HWANGHUI", target: "JO_SEJONG", relationType: "POLICY_ADVICE", certainty: "confirmed",
    startDate: "1432-12-09", endDate: "1432-12-20", eventId: "E1432_01", sourceId: "SRC_1432_1209",
    description: "여연 침입 대응 논의 참여" },
  { id: "ED004", source: "JO_MAENGSASEONG", target: "JO_SEJONG", relationType: "POLICY_ADVICE", certainty: "confirmed",
    startDate: "1432-12-09", endDate: "1432-12-20", eventId: "E1432_01", sourceId: "SRC_1432_1209",
    description: "여연 침입 대응 논의 참여" },
  { id: "ED005", source: "JO_GWONJIN", target: "JO_SEJONG", relationType: "POLICY_ADVICE", certainty: "confirmed",
    startDate: "1432-12-09", endDate: "1432-12-20", eventId: "E1432_01", sourceId: "SRC_1432_1209",
    description: "여연 침입 대응 논의 참여" },
  { id: "ED006", source: "JO_CHOESAGANG", target: "JO_SEJONG", relationType: "POLICY_ADVICE", certainty: "confirmed",
    startDate: "1432-12-09", endDate: "1432-12-20", eventId: "E1432_01", sourceId: "SRC_1432_1209",
    description: "여연 침입 대응 논의 참여" },

  // --- 1432-12-21 ---
  { id: "ED007", source: "JZ_YUEULHAP", target: "JZ_MANJU", relationType: "SUBORDINATE", certainty: "confirmed",
    startDate: "1432-12-21", endDate: null, eventId: "E1432_03", sourceId: "SRC_1432_1221",
    description: "이만주 관하 올량합 천호" },
  { id: "ED008", source: "JZ_YUEULHAP", target: "JO_SEJONG", relationType: "DIPLOMACY", certainty: "confirmed",
    startDate: "1432-12-21", endDate: "1432-12-21", eventId: "E1432_03", sourceId: "SRC_1432_1221",
    description: "포로 7명을 인솔해 조선에 반환" },
  { id: "ED009", source: "JZ_MANJU", target: "JUR_HOLLAON", relationType: "CLAIM", certainty: "contemporary_claim",
    startDate: "1432-12-21", endDate: null, eventId: "E1432_03", sourceId: "SRC_1432_1221",
    description: "\"실제 침입자는 홀라온 올적합이며, 이만주 본인은 600명을 동원해 조선 포로 64명을 구해 보호하고 있다\"는 이만주 측 주장" },
  { id: "ED010", source: "JZ_MANJU", target: "JO_SEJONG", relationType: "DIPLOMACY", certainty: "disputed",
    startDate: "1432-12-21", endDate: "1433-04-18", eventId: "E1432_03", sourceId: "SRC_1432_1221",
    description: "해명과 포로 반환 교섭이 이어지나, 1432년 침입 연루 의혹은 해소되지 않은 상태" },
  { id: "ED011", source: "JO_ANSUNGSEON", target: "JO_SEJONG", relationType: "POLICY_ADVICE", certainty: "confirmed",
    startDate: "1432-12-21", endDate: "1432-12-21", eventId: "E1432_03", sourceId: "SRC_1432_1221",
    description: "이만주 측 주장 검토 논의 참여" },
  { id: "ED012", source: "JO_KIMJONGSEO", target: "JO_SEJONG", relationType: "POLICY_ADVICE", certainty: "confirmed",
    startDate: "1432-12-21", endDate: "1432-12-21", eventId: "E1432_03", sourceId: "SRC_1432_1221",
    description: "이만주 측 주장 검토 논의 참여" },

  // --- 1433-02-15 ---
  { id: "ED013", source: "JO_HWANGHUI", target: "JO_SEJONG", relationType: "POLICY_ADVICE", certainty: "confirmed",
    startDate: "1433-02-15", endDate: "1433-02-25", eventId: "E1433_01", sourceId: "SRC_1433_0215",
    description: "파저강 세력 죄목·대응방법 의견 제출(서로 다른 견해)" },
  { id: "ED014", source: "JO_MAENGSASEONG", target: "JO_SEJONG", relationType: "POLICY_ADVICE", certainty: "confirmed",
    startDate: "1433-02-15", endDate: "1433-02-25", eventId: "E1433_01", sourceId: "SRC_1433_0215",
    description: "파저강 세력 죄목·대응방법 의견 제출(서로 다른 견해)" },
  { id: "ED015", source: "JO_GWONJIN", target: "JO_SEJONG", relationType: "POLICY_ADVICE", certainty: "confirmed",
    startDate: "1433-02-15", endDate: "1433-02-25", eventId: "E1433_01", sourceId: "SRC_1433_0215",
    description: "파저강 세력 죄목·대응방법 의견 제출(서로 다른 견해)" },
  { id: "ED016", source: "JO_HEOJO", target: "JO_SEJONG", relationType: "POLICY_ADVICE", certainty: "confirmed",
    startDate: "1433-02-15", endDate: "1433-02-25", eventId: "E1433_01", sourceId: "SRC_1433_0215",
    description: "파저강 세력 죄목·대응방법 의견 제출(서로 다른 견해)" },
  { id: "ED017", source: "JO_ANSUN", target: "JO_SEJONG", relationType: "POLICY_ADVICE", certainty: "confirmed",
    startDate: "1433-02-15", endDate: "1433-02-25", eventId: "E1433_01", sourceId: "SRC_1433_0215",
    description: "파저강 세력 죄목·대응방법 의견 제출(서로 다른 견해)" },
  { id: "ED018", source: "JO_JEONGHEUMJI", target: "JO_SEJONG", relationType: "POLICY_ADVICE", certainty: "confirmed",
    startDate: "1433-02-15", endDate: "1433-02-25", eventId: "E1433_01", sourceId: "SRC_1433_0215",
    description: "파저강 세력 죄목·대응방법 의견 제출(서로 다른 견해)" },
  { id: "ED019", source: "JO_CHOESAGANG", target: "JO_SEJONG", relationType: "POLICY_ADVICE", certainty: "confirmed",
    startDate: "1433-02-15", endDate: "1433-02-25", eventId: "E1433_01", sourceId: "SRC_1433_0215",
    description: "파저강 세력 죄목·대응방법 의견 제출(서로 다른 견해)" },
  { id: "ED020", source: "JO_LEESUNMONG", target: "JO_SEJONG", relationType: "POLICY_ADVICE", certainty: "confirmed",
    startDate: "1433-02-15", endDate: "1433-02-25", eventId: "E1433_01", sourceId: "SRC_1433_0215",
    description: "무장으로서 대응방법 의견 제출" },

  // --- 1433-02-26 ---
  { id: "ED021", source: "JO_SEJONG", target: "JO_CHOEYUNDEOK", relationType: "COMMAND", certainty: "confirmed",
    startDate: "1433-02-26", endDate: null, eventId: "E1433_02", sourceId: "SRC_1433_0226",
    description: "정벌 총지휘관으로 임명" },

  // --- 1433-03-10 ---
  { id: "ED022", source: "JO_SEJONG", target: "JZ_MANJU", relationType: "ACCUSATION", certainty: "confirmed",
    startDate: "1433-03-10", endDate: null, eventId: "E1433_03", sourceId: "SRC_1433_0310",
    description: "성죄방목: 평소 조선의 구휼을 받았음에도 홀라온을 가장해 강계·여연을 침범하고 인민·가축을 살상·약탈했다는 공식 문죄. 조선이 이 죄목을 공식 제기한 사실 자체는 확인되나, 내용의 실제 진위는 별개다." },
  { id: "ED023", source: "JO_SEJONG", target: "JZ_SIMTANAPNO", relationType: "ACCUSATION", certainty: "confirmed",
    startDate: "1433-03-10", endDate: null, eventId: "E1433_03", sourceId: "SRC_1433_0310",
    description: "성죄방목의 문죄 대상(이만주와의 상하관계는 실록상 불명확)" },
  { id: "ED024", source: "JO_ANSUNGSEON", target: "JO_SEJONG", relationType: "POLICY_ADVICE", certainty: "confirmed",
    startDate: "1433-03-10", endDate: "1433-03-10", eventId: "E1433_03", sourceId: "SRC_1433_0310",
    description: "성죄방목 작성 실무" },
  { id: "ED025", source: "JO_KIMCHEONG", target: "JO_SEJONG", relationType: "POLICY_ADVICE", certainty: "confirmed",
    startDate: "1433-03-10", endDate: "1433-03-10", eventId: "E1433_03", sourceId: "SRC_1433_0310",
    description: "성죄방목 작성 실무" },

  // --- 1433-03-25 ---
  { id: "ED026", source: "JO_SEJONG", target: "JO_CHOEYUNDEOK", relationType: "COMMAND", certainty: "confirmed",
    startDate: "1433-03-25", endDate: "1433-03-25", eventId: "E1433_04", sourceId: "SRC_1433_0325",
    description: "맹가첩목아 관련 비밀 지시: 가담 시 공격하되, 불가담·귀순 시 죽이지 말 것" },

  // --- 1433-04-10 ---
  { id: "ED027", source: "JO_CHOEYUNDEOK", target: "JO_LEESUNMONG", relationType: "COMMAND", certainty: "confirmed",
    startDate: "1433-04-10", endDate: null, eventId: "E1433_05", sourceId: "SRC_1433_0507",
    description: "7로 정벌군 부대 지휘 편성" },
  { id: "ED028", source: "JO_CHOEYUNDEOK", target: "JO_CHOEHAESAN", relationType: "COMMAND", certainty: "confirmed",
    startDate: "1433-04-10", endDate: null, eventId: "E1433_05", sourceId: "SRC_1433_0507",
    description: "7로 정벌군 부대 지휘 편성" },
  { id: "ED029", source: "JO_CHOEYUNDEOK", target: "JO_LEEGAK", relationType: "COMMAND", certainty: "confirmed",
    startDate: "1433-04-10", endDate: null, eventId: "E1433_05", sourceId: "SRC_1433_0507",
    description: "7로 정벌군 부대 지휘 편성" },
  { id: "ED030", source: "JO_CHOEYUNDEOK", target: "JO_LEEJINGSEOK", relationType: "COMMAND", certainty: "confirmed",
    startDate: "1433-04-10", endDate: null, eventId: "E1433_05", sourceId: "SRC_1433_0507",
    description: "7로 정벌군 부대 지휘 편성" },
  { id: "ED031", source: "JO_CHOEYUNDEOK", target: "JO_KIMHYOSEONG", relationType: "COMMAND", certainty: "confirmed",
    startDate: "1433-04-10", endDate: null, eventId: "E1433_05", sourceId: "SRC_1433_0507",
    description: "7로 정벌군 부대 지휘 편성" },
  { id: "ED032", source: "JO_CHOEYUNDEOK", target: "JO_HONGSASEOK", relationType: "COMMAND", certainty: "confirmed",
    startDate: "1433-04-10", endDate: null, eventId: "E1433_05", sourceId: "SRC_1433_0507",
    description: "7로 정벌군 부대 지휘 편성" },

  // --- 1433-04-19 ---
  { id: "ED033", source: "JO_LEESUNMONG", target: "JZ_MANJU", relationType: "MILITARY_CONFLICT", certainty: "confirmed",
    startDate: "1433-04-19", endDate: "1433-08-09", eventId: "E1433_06", sourceId: "SRC_1433_0507",
    description: "이만주의 채리(寨里)를 공격" },
  { id: "ED034", source: "JO_KIMHYOSEONG", target: "JZ_IMHALA", relationType: "MILITARY_CONFLICT", certainty: "confirmed",
    startDate: "1433-04-19", endDate: "1433-08-09", eventId: "E1433_06", sourceId: "SRC_1433_0507",
    description: "임합라 부모의 채리를 공격" },
  { id: "ED035", source: "JO_CHOEYUNDEOK", target: "JZ_IMHALA", relationType: "MILITARY_CONFLICT", certainty: "confirmed",
    startDate: "1433-04-19", endDate: "1433-08-09", eventId: "E1433_06", sourceId: "SRC_1433_0507",
    description: "실록이 '정적(正賊)'이라 칭한 임합라의 채리를 직접 공격" },

  // --- 1433-05-17 ---
  { id: "ED036", source: "JO_SEJONG", target: "GROUP_1433_WARDEAD", relationType: "WELFARE", certainty: "confirmed",
    startDate: "1433-05-17", endDate: null, eventId: "E1433_09", sourceId: "SRC_1433_0517",
    description: "전사 군관 쌀·콩 각 5석/군졸 각 3석과 5년 복호, 병사자 군관 각 3석/군졸 각 2석과 2년 복호, 전사자 초혼·치제" },

  // --- 1433-06-10 ---
  { id: "ED037", source: "JZ_MENGGETEMUR", target: "JZ_IMHALA", relationType: "COUNTER_CLAIM", certainty: "contemporary_claim",
    startDate: "1433-06-10", endDate: null, eventId: "E1433_11", sourceId: "SRC_1433_0610",
    description: "\"진짜 파저강 도적 괴수는 임합라이며 이만주는 오히려 말렸다\"는 주장(조선 사신 지함에게 전달)" },

  // --- 1433-08-10(윤8월 10일) ---
  { id: "ED038", source: "MING_XUANDE", target: "JO_SEJONG", relationType: "MEDIATION", certainty: "confirmed",
    startDate: "1433-08-10", endDate: null, eventId: "E1433_12", sourceId: "SRC_1433_0810",
    description: "상호 포로·가축·문서 반환 및 침범 중지 명령. 조선·이만주 양측 주장의 진위를 명확히 가리기 어렵다는 입장" },
  { id: "ED039", source: "MING_XUANDE", target: "JZ_MANJU", relationType: "MEDIATION", certainty: "confirmed",
    startDate: "1433-08-10", endDate: null, eventId: "E1433_12", sourceId: "SRC_1433_0810",
    description: "상호 포로·가축·문서 반환 및 침범 중지 명령" },
  { id: "ED040", source: "MING_XUANDE", target: "JZ_MENGGETEMUR", relationType: "MEDIATION", certainty: "confirmed",
    startDate: "1433-08-10", endDate: null, eventId: "E1433_12", sourceId: "SRC_1433_0810",
    description: "상호 반환 및 침범 중지 명령의 대상" },
  { id: "ED041", source: "MING_XUANDE", target: "JUR_HOLLAON", relationType: "MEDIATION", certainty: "confirmed",
    startDate: "1433-08-10", endDate: null, eventId: "E1433_12", sourceId: "SRC_1433_0810",
    description: "상호 반환 및 침범 중지 명령의 대상" },

  // --- 1433-12-21 ---
  { id: "ED042", source: "JZ_MANJU", target: "JO_SEJONG", relationType: "DIPLOMACY", certainty: "confirmed",
    startDate: "1433-12-21", endDate: null, eventId: "E1433_13", sourceId: "SRC_1433_1221",
    description: "왕답올·유살독 등 14명을 파견해 토산물 진상, 통교 재개" },

  // --- 1434-04-16 ---
  { id: "ED043", source: "JZ_MANJU", target: "JO_SEJONG", relationType: "DIPLOMACY", certainty: "confirmed",
    startDate: "1434-04-16", endDate: null, eventId: "E1434_01", sourceId: "SRC_1434_0416",
    description: "강계부에 문서를 보내 원상미 20포 수령 의사 및 도망자 7명 반환 요청" },

  // --- 1434-04-22 ---
  { id: "ED044", source: "JO_SINSANG", target: "JO_SEJONG", relationType: "POLICY_ADVICE", certainty: "confirmed",
    startDate: "1434-04-22", endDate: "1434-04-22", eventId: "E1434_02", sourceId: "SRC_1434_0422",
    description: "도망자 강제 송환이 향후 귀화 유도를 저해할 수 있다며 반대" },

  // --- 1434-04-26 ---
  { id: "ED045", source: "JO_HWANGHUI", target: "JO_SEJONG", relationType: "POLICY_ADVICE", certainty: "confirmed",
    startDate: "1434-04-26", endDate: "1434-04-26", eventId: "E1434_03", sourceId: "SRC_1434_0426",
    description: "이만주 관하 도망자(장교하·유포자·왕안탄 등) 처리방안 논의" },

  // --- 1434-10-12 ---
  { id: "ED046", source: "MING_XUANDE", target: "JUR_HOLLAON", relationType: "MEDIATION", certainty: "confirmed",
    startDate: "1434-10-12", endDate: null, eventId: "E1434_06", sourceId: "SRC_1434_1012",
    description: "홀라온에 억류된 조선인 포로 생존 확인 및 송환 중재" },
  { id: "ED047", source: "MING_MENGNAL", target: "JUR_HOLLAON", relationType: "MEDIATION", certainty: "confirmed",
    startDate: "1434-10-12", endDate: null, eventId: "E1434_06", sourceId: "SRC_1434_1012",
    description: "명의 중재 실행자로 홀라온과 교섭" },

  // --- 1435-01-13 ---
  { id: "ED048", source: "JUR_HOLLAON", target: "JO_KIMYUNSU", relationType: "MILITARY_CONFLICT", certainty: "confirmed",
    startDate: "1435-01-13", endDate: "1435-01-13", eventId: "E1435_01", sourceId: "SRC_1435_0113",
    description: "오량합 기병 약 2,700기가 여연성을 포위 공격; 김윤수·군졸 부상, 군졸 1명 사망" },
  { id: "ED049", source: "JO_KIMYUNSU", target: "JO_LEEJIN", relationType: "COMMAND", certainty: "confirmed",
    startDate: "1435-01-13", endDate: "1435-01-13", eventId: "E1435_01", sourceId: "SRC_1435_0113",
    description: "여연성 공동 방어 지휘" },
  { id: "ED050", source: "JO_KIMYUNSU", target: "JO_YEOSEONGRYEOL", relationType: "COMMAND", certainty: "confirmed",
    startDate: "1435-01-13", endDate: "1435-01-13", eventId: "E1435_01", sourceId: "SRC_1435_0113",
    description: "여연성 공동 방어 지휘" },
  { id: "ED051", source: "JO_KIMYUNSU", target: "JO_KIMSUYEON", relationType: "COMMAND", certainty: "confirmed",
    startDate: "1435-01-13", endDate: "1435-01-13", eventId: "E1435_01", sourceId: "SRC_1435_0113",
    description: "100명을 이끌고 추격, 적 복병 약 300기 확인 후 철수" },

  // --- 1435-01-25 ---
  { id: "ED052", source: "JO_LEESUKCHI", target: "JO_SEJONG", relationType: "POLICY_ADVICE", certainty: "confirmed",
    startDate: "1435-01-25", endDate: "1435-01-25", eventId: "E1435_02", sourceId: "SRC_1435_0125",
    description: "여연 방어체계(객병→토병 상주) 개편 논의 참여" },

  // --- 1435-02-24 ---
  { id: "ED053", source: "MING_XUANDE", target: "JZ_FANCHA", relationType: "MEDIATION", certainty: "confirmed",
    startDate: "1435-02-24", endDate: null, eventId: "E1435_03", sourceId: "SRC_1435_0224",
    description: "범찰과 일부 건주좌위 관민이 이만주 지역으로 이동해 함께 거주하는 것을 허가" },
  { id: "ED054", source: "JZ_FANCHA", target: "JZ_MANJU", relationType: "MIGRATION", certainty: "confirmed",
    startDate: "1435-02-24", endDate: null, eventId: "E1435_03", sourceId: "SRC_1435_0224",
    description: "범찰과 일부 건주좌위 관민이 이만주 거주 지역으로 이동해 함께 거주(거주지 이동이며, 이만주의 부하로 편입되었다는 의미는 아님)" },

  // --- 1435-06-13 ---
  { id: "ED055", source: "JZ_MANJU", target: "JO_KIMYUNSU", relationType: "MILITARY_CONFLICT", certainty: "confirmed",
    startDate: "1435-06-13", endDate: null, eventId: "E1435_04", sourceId: "SRC_1435_0613",
    description: "귀화한 파저강 여진인의 제보로 '지난 정월' 이만주가 홀라온과 함께 여연을 침입해 남자 2명을 죽이고 남녀 7명·말 6필·소 5두를 약탈한 사실이 뒤늦게 확인됨. 1월 13일 오량합의 여연성 포위와는 별개 사건." },
  { id: "ED056", source: "JUR_HOLLAON", target: "JO_KIMYUNSU", relationType: "MILITARY_CONFLICT", certainty: "confirmed",
    startDate: "1435-06-13", endDate: null, eventId: "E1435_04", sourceId: "SRC_1435_0613",
    description: "위와 동일 사건의 공동 침입 세력으로 확인됨" },
  { id: "ED057", source: "JO_CHOESAGANG", target: "JO_KIMYUNSU", relationType: "ACCOUNTABILITY", certainty: "confirmed",
    startDate: "1435-06-13", endDate: null, eventId: "E1435_04", sourceId: "SRC_1435_0613",
    description: "6개월간 미보고한 책임을 '변경의 대사(大事)'로 규정하고 문책 요구" },
  { id: "ED058", source: "JO_CHOESAGANG", target: "JO_LEEGAK", relationType: "ACCOUNTABILITY", certainty: "confirmed",
    startDate: "1435-06-13", endDate: null, eventId: "E1435_04", sourceId: "SRC_1435_0613",
    description: "즉시 조사·보고하지 않은 도절제사의 책임을 추궁" },
  { id: "ED059", source: "JO_SEJONG", target: "JO_KIMYUNSU", relationType: "ACCOUNTABILITY", certainty: "confirmed",
    startDate: "1435-06-13", endDate: "1435-06-16", eventId: "E1435_04", sourceId: "SRC_1435_0613",
    description: "고신(告身)을 박탈하되 현직은 유임하도록 결정" },
  { id: "ED060", source: "JO_SEJONG", target: "GROUP_1435_CASUALTIES", relationType: "WELFARE", certainty: "confirmed",
    startDate: "1435-06-13", endDate: null, eventId: "E1435_04", sourceId: "SRC_1435_0613",
    description: "피살·피랍 인민에 대한 조휼(弔恤) 지시" },
  { id: "ED061", source: "JO_NOHAN", target: "JO_SEJONG", relationType: "POLICY_ADVICE", certainty: "confirmed",
    startDate: "1435-06-13", endDate: "1435-06-13", eventId: "E1435_04", sourceId: "SRC_1435_0613",
    description: "김윤수 처분 관련 자문" },
  { id: "ED062", source: "JO_HWANGHUI", target: "JO_SEJONG", relationType: "POLICY_ADVICE", certainty: "confirmed",
    startDate: "1435-06-13", endDate: "1435-06-13", eventId: "E1435_04", sourceId: "SRC_1435_0613",
    description: "김윤수 처분 관련 자문" },
  { id: "ED063", source: "JO_CHOEYUNDEOK", target: "JO_SEJONG", relationType: "POLICY_ADVICE", certainty: "confirmed",
    startDate: "1435-06-13", endDate: "1435-06-13", eventId: "E1435_04", sourceId: "SRC_1435_0613",
    description: "김윤수 처분 관련 자문" },

  // --- 1435-06-17 ---
  { id: "ED064", source: "JO_CHOEGYEONGMYEONG", target: "JO_KIMYUNSU", relationType: "ACCOUNTABILITY", certainty: "confirmed",
    startDate: "1435-06-17", endDate: null, eventId: "E1435_05", sourceId: "SRC_1435_0617",
    description: "처분이 가볍다며 재추국과 율에 따른 처벌을 요구" },
  { id: "ED065", source: "JO_CHOEGYEONGMYEONG", target: "JO_SEJONG", relationType: "POLICY_DISAGREEMENT", certainty: "confirmed",
    startDate: "1435-06-17", endDate: null, eventId: "E1435_05", sourceId: "SRC_1435_0617",
    description: "김윤수 처벌 강도를 둘러싼 사헌부와 세종의 견해차(최경명: 재추국·엄벌 요구 / 세종: 유임 방침 유지)" },

  // --- 1435-09-18 ---
  { id: "ED066", source: "JO_CHOESAGANG", target: "JO_KIMYUNSU", relationType: "REWARD", certainty: "confirmed",
    startDate: "1435-09-18", endDate: null, eventId: "E1435_06", sourceId: "SRC_1435_0918",
    description: "강을 건너 적의 퇴로를 끊은 공으로 포상 건의(병조)" },
  { id: "ED067", source: "JO_CHOESAGANG", target: "JO_JANGSAU", relationType: "REWARD", certainty: "confirmed",
    startDate: "1435-09-18", endDate: null, eventId: "E1435_06", sourceId: "SRC_1435_0918",
    description: "끝까지 추격해 약탈당한 물품을 되찾은 공으로 포상 건의" },
  { id: "ED068", source: "JO_CHOESAGANG", target: "JO_BAECHEOL", relationType: "REWARD", certainty: "confirmed",
    startDate: "1435-09-18", endDate: null, eventId: "E1435_06", sourceId: "SRC_1435_0918",
    description: "끝까지 추격해 약탈당한 물품을 되찾은 공으로 포상 건의" },
  { id: "ED069", source: "JO_SEJONG", target: "GROUP_1435_CASUALTIES", relationType: "WELFARE", certainty: "confirmed",
    startDate: "1435-09-18", endDate: null, eventId: "E1435_06", sourceId: "SRC_1435_0918",
    description: "전사자에 대한 증직·부의·호역 면제 시행" }
];

/* ------------------------- 인물 상태(시간가변) ------------------------- */
// status는 배열: 한 인물이 동시에 여러 평가(예: 공로+책임)를 가질 수 있다.
const PERSON_STATES = [
  // 세종의 정책결정 변화 - 13단계 (섹션 10 요구사항)
  { id: "PS_SJ01", personId: "JO_SEJONG", startDate: "1432-12-09", endDate: "1432-12-09", stage: 1,
    role: "국왕", status: ["POLICY"], eventId: "E1432_01",
    description: "여연 침입 보고를 받고 대응 논의를 시작함" },
  { id: "PS_SJ02", personId: "JO_SEJONG", startDate: "1432-12-09", endDate: "1432-12-20", stage: 2,
    role: "국왕", status: ["POLICY"], eventId: "E1432_02",
    description: "홍사석을 파견해 현장 조사를 지시함" },
  { id: "PS_SJ03", personId: "JO_SEJONG", startDate: "1432-12-21", endDate: "1433-02-14", stage: 3,
    role: "국왕", status: ["POLICY"], eventId: "E1432_03",
    description: "이만주 측 해명을 접수하고 가해자 판단을 위한 검토를 진행함" },
  { id: "PS_SJ04", personId: "JO_SEJONG", startDate: "1433-02-15", endDate: "1433-02-25", stage: 4,
    role: "국왕", status: ["POLICY"], eventId: "E1433_01",
    description: "의정부·육조 등에 비밀리에 의견을 구해 강경론과 신중론을 청취함" },
  { id: "PS_SJ05", personId: "JO_SEJONG", startDate: "1433-02-26", endDate: "1433-03-09", stage: 5,
    role: "국왕", status: ["POLICY"], eventId: "E1433_02",
    description: "파저강 토벌을 결정하고 최윤덕을 총지휘관으로 확정함" },
  { id: "PS_SJ06", personId: "JO_SEJONG", startDate: "1433-03-10", endDate: "1433-04-09", stage: 6,
    role: "국왕", status: ["POLICY"], eventId: "E1433_03",
    description: "성죄방목을 통해 공식 문죄함" },
  { id: "PS_SJ07", personId: "JO_SEJONG", startDate: "1433-04-10", endDate: "1433-05-10", stage: 7,
    role: "국왕", status: ["POLICY"], eventId: "E1433_05",
    description: "7로 정벌군을 편성해 군사작전을 지휘함" },
  { id: "PS_SJ08", personId: "JO_SEJONG", startDate: "1433-05-11", endDate: "1433-05-16", stage: 8,
    role: "국왕", status: ["POLICY"], eventId: "E1433_08",
    description: "농번기 대군 동원의 이유를 중외에 공표하도록 함" },
  { id: "PS_SJ09", personId: "JO_SEJONG", startDate: "1433-05-17", endDate: "1433-05-31", stage: 9,
    role: "국왕", status: ["POLICY"], eventId: "E1433_09",
    description: "전사자·병사자에게 곡식과 복호를 내리고 초혼·치제를 시행함" },
  { id: "PS_SJ10", personId: "JO_SEJONG", startDate: "1433-06-01", endDate: "1433-08-09", stage: 10,
    role: "국왕", status: ["POLICY"], eventId: "E1433_10",
    description: "여연·강계 사이에 자성군을 설치해 상설 방어체계를 구축함" },
  { id: "PS_SJ11", personId: "JO_SEJONG", startDate: "1433-08-10", endDate: "1435-01-24", stage: 11,
    role: "국왕", status: ["POLICY"], eventId: "E1433_12",
    description: "명의 중재를 수용해 상호 반환과 침범 중지를 이행하고, 이만주와의 통교 재개 및 도망자 문제 등 후속 외교를 처리함" },
  { id: "PS_SJ12", personId: "JO_SEJONG", startDate: "1435-01-25", endDate: "1435-06-12", stage: 12,
    role: "국왕", status: ["POLICY"], eventId: "E1435_02",
    description: "여연성 포위를 계기로 토병 중심의 상시 방어체계 개편을 검토함" },
  { id: "PS_SJ13", personId: "JO_SEJONG", startDate: "1435-06-13", endDate: null, stage: 13,
    role: "국왕", status: ["POLICY"], eventId: "E1435_04",
    description: "미보고 침입 사건이 드러나자 우리 지휘관(김윤수·이각)의 책임을 심사하고, 처분 수위를 둘러싼 사헌부와의 견해차 속에서도 유임 방침을 유지함" },

  // 1432
  { id: "PS001", personId: "JO_HONGSASEOK", startDate: "1432-12-09", endDate: "1433-04-09",
    role: "조사관(강계·여연 파견)", status: ["INVESTIGATION"], eventId: "E1432_02",
    description: "여연 침입의 실제 접전 경위 현장 조사" },
  { id: "PS002", personId: "JZ_MANJU", startDate: "1432-12-21", endDate: "1433-04-18",
    role: "건주위 도지휘", status: ["DISPUTED"], eventId: "E1432_03",
    description: "1432년 침입 관련 의혹을 해명 중이며, 침입 주체 여부는 이 시점에 확정되지 않음" },
  { id: "PS003", personId: "JZ_YUEULHAP", startDate: "1432-12-21", endDate: null,
    role: "이만주 관하 천호", status: ["DIPLOMACY"], eventId: "E1432_03",
    description: "포로 송환 등 이만주를 대리한 실무 교섭 수행" },

  // 1433
  { id: "PS005", personId: "JO_CHOEYUNDEOK", startDate: "1433-02-26", endDate: "1433-05-06",
    role: "평안도 도절제사·정벌 총지휘관", status: ["COMMAND"], eventId: "E1433_02",
    description: "파저강 정벌 총지휘관으로 임명됨" },
  { id: "PS007", personId: "JZ_SIMTANAPNO", startDate: "1433-03-10", endDate: null,
    role: "파저강 세력", status: ["ACCUSED"], eventId: "E1433_03",
    description: "성죄방목의 문죄 대상 중 하나" },
  { id: "PS008", personId: "JO_ANSUNGSEON", startDate: "1433-03-10", endDate: "1433-03-10",
    role: "승정원", status: ["POLICY_ADVICE"], eventId: "E1433_03",
    description: "성죄방목 작성 실무 담당" },
  { id: "PS009", personId: "JO_KIMCHEONG", startDate: "1433-03-10", endDate: "1433-03-10",
    role: "문서 실무", status: ["POLICY_ADVICE"], eventId: "E1433_03",
    description: "성죄방목 작성 실무 담당" },
  { id: "PS010", personId: "JZ_MENGGETEMUR", startDate: "1433-03-25", endDate: "1433-06-09",
    role: "건주좌위 계열 지도자", status: ["NEUTRAL_WATCH"], eventId: "E1433_04",
    description: "조선의 조건부 불가침 대상으로 거론됨(가담 시 공격, 불가담·귀순 시 불살)" },
  { id: "PS011", personId: "JO_LEESUNMONG", startDate: "1433-04-10", endDate: "1433-05-06",
    role: "중군절제사(정벌군)", status: ["MILITARY_OPERATION"], eventId: "E1433_05",
    description: "7로 정벌군의 한 부대를 지휘" },
  { id: "PS012", personId: "JO_CHOEHAESAN", startDate: "1433-04-10", endDate: "1433-05-06",
    role: "좌군절제사(정벌군)", status: ["MILITARY_OPERATION"], eventId: "E1433_05",
    description: "7로 정벌군의 한 부대를 지휘" },
  { id: "PS013", personId: "JO_LEEGAK", startDate: "1433-04-10", endDate: "1433-05-06",
    role: "우군절제사(정벌군)", status: ["MILITARY_OPERATION"], eventId: "E1433_05",
    description: "7로 정벌군의 한 부대를 지휘" },
  { id: "PS014", personId: "JO_LEEJINGSEOK", startDate: "1433-04-10", endDate: "1433-05-06",
    role: "조전절제사(정벌군)", status: ["MILITARY_OPERATION"], eventId: "E1433_05",
    description: "7로 정벌군의 한 부대를 지휘" },
  { id: "PS015", personId: "JO_KIMHYOSEONG", startDate: "1433-04-10", endDate: "1433-05-06",
    role: "정벌군 지휘관", status: ["MILITARY_OPERATION"], eventId: "E1433_05",
    description: "7로 정벌군의 한 부대를 지휘" },
  { id: "PS016", personId: "JO_HONGSASEOK", startDate: "1433-04-10", endDate: "1433-05-06",
    role: "조전절제사(정벌군)", status: ["MILITARY_OPERATION"], eventId: "E1433_05",
    description: "현장 조사관에서 정벌군 지휘관으로 전환" },
  { id: "PS017", personId: "JZ_MANJU", startDate: "1433-04-19", endDate: "1433-08-09",
    role: "건주위 도지휘", status: ["MILITARY_CONFLICT"], eventId: "E1433_06",
    description: "조선군의 직접 공격 대상이 됨(채리 공격)" },
  { id: "PS018", personId: "JZ_IMHALA", startDate: "1433-04-19", endDate: "1433-08-09",
    role: "파저강 세력 지도자(실록상 正賊)", status: ["MILITARY_CONFLICT"], eventId: "E1433_06",
    description: "최윤덕이 직접 공격한 대상으로 지목됨" },
  { id: "PS019", personId: "JO_CHOEYUNDEOK", startDate: "1433-05-07", endDate: "1433-05-31",
    role: "정벌 총지휘관", status: ["MERIT", "ACCOUNTABILITY_OVERSIGHT"], eventId: "E1433_07",
    description: "전과·사상자 보고와 함께 일부 지휘관의 군령 위반 문제도 함께 보고함(개별 인명은 실록에 특정되지 않음)" },
  { id: "PS021", personId: "GROUP_1433_WARDEAD", startDate: "1433-05-17", endDate: null,
    role: "파저강 정벌 전사·병사자 및 유가족", status: ["WELFARE"], eventId: "E1433_09",
    description: "곡식 지급·복호·초혼치제 등 국가 보상 대상" },
  { id: "PS022", personId: "JZ_MENGGETEMUR", startDate: "1433-06-10", endDate: "1433-08-09",
    role: "건주좌위 계열 지도자", status: ["NEUTRAL_WATCH", "COUNTER_CLAIM_MADE"], eventId: "E1433_11",
    description: "임합라가 진범이며 이만주는 말렸다는 반박 주장을 제기함" },
  { id: "PS023", personId: "JZ_MANJU", startDate: "1433-08-10", endDate: "1433-12-20",
    role: "건주위 도지휘", status: ["MEDIATED"], eventId: "E1433_12",
    description: "명의 중재 개입으로 상호 반환 명령을 수용함" },
  { id: "PS024", personId: "JZ_IMHALA", startDate: "1433-08-10", endDate: null,
    role: "파저강 세력 지도자(실록상 正賊)", status: ["MEDIATED"], eventId: "E1433_12",
    description: "명의 중재 대상에 포함됨. 이후 개별 후속 조치는 본 자료에서 확인되지 않음" },
  { id: "PS025", personId: "JZ_MENGGETEMUR", startDate: "1433-08-10", endDate: "1435-02-23",
    role: "건주좌위 계열 지도자", status: ["MEDIATED"], eventId: "E1433_12",
    description: "명의 중재 대상에 포함됨" },
  { id: "PS026", personId: "MING_XUANDE", startDate: "1433-08-10", endDate: null,
    role: "명 황제", status: ["MEDIATION"], eventId: "E1433_12",
    description: "조선과 이만주·홀라온 등 여진 세력 사이의 중재자 역할이 본격화됨" },
  { id: "PS027", personId: "JZ_MANJU", startDate: "1433-12-21", endDate: "1434-04-15",
    role: "건주위 도지휘", status: ["DIPLOMACY_RESUMED"], eventId: "E1433_13",
    description: "조선에 사절을 파견해 토산물을 진상하며 통교를 재개함" },

  // 1434
  { id: "PS028", personId: "JZ_MANJU", startDate: "1434-04-16", endDate: "1434-04-21",
    role: "건주위 도지휘", status: ["DIPLOMACY_RESUMED"], eventId: "E1434_01",
    description: "강계부를 통해 원상미 수령 의사와 도망자 반환을 공식 요청함" },
  { id: "PS029", personId: "JO_SINSANG", startDate: "1434-04-22", endDate: "1434-04-22",
    role: "예조판서", status: ["POLICY_ADVICE"], eventId: "E1434_02",
    description: "도망자 강제 송환이 향후 귀화 유도를 저해할 수 있다며 반대함" },
  { id: "PS030", personId: "JZ_MANJU", startDate: "1434-04-22", endDate: "1434-04-25",
    role: "건주위 도지휘", status: ["DIPLOMACY_RESUMED"], eventId: "E1434_02",
    description: "도망자 송환 여부를 둘러싼 조선 조정 내부 논쟁의 대상이 됨" },
  { id: "PS031", personId: "JZ_MANJU", startDate: "1434-04-26", endDate: "1435-02-23",
    role: "건주위 도지휘", status: ["DIPLOMACY_RESUMED"], eventId: "E1434_03",
    description: "관하 인원의 조선 이탈 문제를 둘러싼 교섭이 지속됨" },
  { id: "PS032", personId: "MING_MENGNAL", startDate: "1434-10-12", endDate: null,
    role: "명 관리", status: ["MEDIATION"], eventId: "E1434_06",
    description: "명의 중재 실행자로 홀라온에 억류된 조선인 포로 문제를 교섭함" },

  // 1435
  { id: "PS033", personId: "JO_KIMYUNSU", startDate: "1435-01-13", endDate: "1435-06-12",
    role: "여연군수", status: ["MERIT", "DEFENSE"], eventId: "E1435_01",
    description: "여연성 포위 방어전을 수행하다 부상당함" },
  { id: "PS034", personId: "JO_LEEJIN", startDate: "1435-01-13", endDate: null,
    role: "도진무 상호군", status: ["MERIT", "DEFENSE"], eventId: "E1435_01",
    description: "여연성 방어전에 참여함" },
  { id: "PS035", personId: "JO_YEOSEONGRYEOL", startDate: "1435-01-13", endDate: null,
    role: "수군첨절제사", status: ["MERIT", "DEFENSE"], eventId: "E1435_01",
    description: "여연성 방어전에 참여함" },
  { id: "PS036", personId: "JO_KIMSUYEON", startDate: "1435-01-13", endDate: null,
    role: "군관", status: ["MERIT", "DEFENSE"], eventId: "E1435_01",
    description: "100명을 이끌고 추격, 적 복병을 확인하고 철수함" },
  { id: "PS037", personId: "JO_LEESUKCHI", startDate: "1435-01-25", endDate: "1435-01-25",
    role: "중앙대신", status: ["POLICY_ADVICE"], eventId: "E1435_02",
    description: "여연 방어체계 개편 논의에 참여함" },
  { id: "PS038", personId: "JZ_FANCHA", startDate: "1435-02-24", endDate: null,
    role: "건주좌위 계열 지도자", status: ["MIGRATED"], eventId: "E1435_03",
    description: "명의 허가로 일부 관민과 함께 이만주 거주 지역으로 이동함" },
  { id: "PS039", personId: "JZ_MENGGETEMUR", startDate: "1435-02-24", endDate: null,
    role: "건주좌위 계열 지도자", status: ["MEDIATED"], eventId: "E1435_03",
    description: "범찰 등 일부 건주좌위 인구가 이만주 지역으로 이동함" },
  { id: "PS040", personId: "JZ_MANJU", startDate: "1435-02-24", endDate: "1435-06-12",
    role: "건주위 도지휘", status: ["DIPLOMACY_RESUMED"], eventId: "E1435_03",
    description: "범찰 등 건주좌위 일부 인구가 인근으로 이주해 옴" },
  { id: "PS041", personId: "JO_KIMYUNSU", startDate: "1435-06-13", endDate: "1435-06-16",
    role: "여연군수", status: ["MERIT", "ACCOUNTABILITY"], eventId: "E1435_04",
    description: "여연 방어 공로는 유지된 채, 지난 정월 침입을 6개월간 미보고한 책임으로 고신을 박탈당함(현직은 유임)" },
  { id: "PS042", personId: "JO_LEEGAK", startDate: "1435-06-13", endDate: null,
    role: "평안도 도절제사", status: ["ACCOUNTABILITY"], eventId: "E1435_04",
    description: "즉시 조사·보고하지 않은 책임을 추궁받음" },
  { id: "PS043", personId: "JO_CHOESAGANG", startDate: "1435-06-13", endDate: null,
    role: "병조판서", status: ["ACCOUNTABILITY_ENFORCER"], eventId: "E1435_04",
    description: "변경 미보고 사건을 '변경의 대사'로 규정하고 관련자 문책을 주도함" },
  { id: "PS044", personId: "GROUP_1435_CASUALTIES", startDate: "1435-06-13", endDate: null,
    role: "1435년 여연 피살·피랍 인민", status: ["WELFARE"], eventId: "E1435_04",
    description: "조휼(弔恤) 대상이 됨" },
  { id: "PS045", personId: "JZ_MANJU", startDate: "1435-06-13", endDate: null,
    role: "건주위 도지휘", status: ["ACCUSED_RENEWED"], eventId: "E1435_04",
    description: "귀화 여진인의 제보로 지난 정월 여연 침입 관련자로 재차 지목됨(조사로 사실 확인)" },
  { id: "PS046", personId: "JO_NOHAN", startDate: "1435-06-13", endDate: "1435-06-13",
    role: "중추원 자문대신", status: ["POLICY_ADVICE"], eventId: "E1435_04",
    description: "김윤수 처분 관련 자문에 참여함" },
  { id: "PS047", personId: "JO_CHOEGYEONGMYEONG", startDate: "1435-06-17", endDate: null,
    role: "사헌부 지평", status: ["ACCOUNTABILITY_ENFORCER"], eventId: "E1435_05",
    description: "김윤수 처분이 가볍다며 재추국과 엄벌을 요구함" },
  { id: "PS048", personId: "JO_KIMYUNSU", startDate: "1435-06-17", endDate: "1435-09-17",
    role: "여연군수", status: ["MERIT", "ACCOUNTABILITY"], eventId: "E1435_05",
    description: "사헌부의 추가 처벌 요구에도 세종은 유임 방침을 유지함" },
  { id: "PS049", personId: "JO_KIMYUNSU", startDate: "1435-09-18", endDate: null,
    role: "여연군수", status: ["MERIT", "ACCOUNTABILITY", "REWARDED"], eventId: "E1435_06",
    description: "적의 퇴로를 차단한 공로로 포상이 건의됨. 앞선 미보고 책임과 방어·추격 공로 평가가 동시에 기록으로 남음" },
  { id: "PS050", personId: "JO_JANGSAU", startDate: "1435-09-18", endDate: null,
    role: "진무", status: ["MERIT", "REWARDED"], eventId: "E1435_06",
    description: "끝까지 추격해 약탈품을 되찾은 공으로 포상이 건의됨" },
  { id: "PS051", personId: "JO_BAECHEOL", startDate: "1435-09-18", endDate: null,
    role: "사정", status: ["MERIT", "REWARDED"], eventId: "E1435_06",
    description: "끝까지 추격해 약탈품을 되찾은 공으로 포상이 건의됨" },

  // 사건에 등장하지 않아 특정 날짜에 연결되지 않는 인물(배경 정보만 존재)
  { id: "PS_BG_YANGMOK", personId: "JUR_YANGMOK", startDate: "1432-12-09", endDate: null,
    role: "홀라온계 인물", status: ["BACKGROUND"], eventId: null,
    description: "명의 칙서 및 여진 내부 분쟁에 등장하는 인물로 언급되나, 본 타임라인의 26개 개별 사건에는 날짜가 특정되어 등장하지 않음" }
];

/* ------------------------------ 스토리 모드 ------------------------------ */
// 각 장면은 해당 장면의 마지막 사건 날짜까지 타임라인을 이동시키고,
// focusNodeIds/focusEdgeIds 이외의 요소는 흐리게 처리한다.
const STORY_SCENES = [
  {
    id: "S01", title: "1432.12 — 여연 침입",
    eventIds: ["E1432_01", "E1432_02"], toDate: "1432-12-09",
    focusNodeIds: ["JO_SEJONG", "JO_PARKCHO", "JO_HONGSASEOK"],
    narration: "야인 기병 약 400기가 여연을 침입한다. 박초가 이를 추격해 포로와 가축 일부를 되찾고, 세종은 홍사석을 보내 진상을 조사하게 한다."
  },
  {
    id: "S02", title: "이만주의 해명",
    eventIds: ["E1432_03"], toDate: "1432-12-21",
    focusNodeIds: ["JZ_MANJU", "JZ_YUEULHAP", "JUR_HOLLAON", "JO_SEJONG"],
    narration: "이만주가 유을합을 보내 포로 7명을 돌려주며, 침입 주체는 홀라온이고 자신은 오히려 조선인 포로를 구했다고 주장한다. 이 시점에 침입의 실제 주범은 확정되지 않는다."
  },
  {
    id: "S03", title: "1433.02 — 조정 내부 정벌 논쟁",
    eventIds: ["E1433_01"], toDate: "1433-02-15",
    focusNodeIds: ["JO_SEJONG", "JO_HWANGHUI", "JO_MAENGSASEONG", "JO_GWONJIN", "JO_HEOJO", "JO_ANSUN", "JO_JEONGHEUMJI", "JO_LEESUNMONG", "JO_CHOESAGANG"],
    narration: "세종이 비밀리에 대신들에게 파저강 세력에 대한 죄목과 대응방법을 묻는다. 대신들의 견해는 하나로 모이지 않는다."
  },
  {
    id: "S04", title: "1433.03 — 성죄방목과 정벌 결정",
    eventIds: ["E1433_02", "E1433_03", "E1433_04"], toDate: "1433-03-25",
    focusNodeIds: ["JO_SEJONG", "JO_CHOEYUNDEOK", "JZ_MANJU", "JZ_SIMTANAPNO", "JZ_MENGGETEMUR"],
    narration: "정벌이 결정되고 최윤덕이 총지휘관이 된다. 성죄방목으로 공식 문죄가 이루어지는 한편, 세종은 맹가첩목아처럼 가담 여부가 불분명한 세력은 구분해 대하라고 지시한다."
  },
  {
    id: "S05", title: "1433.04 — 7로 파저강 공격",
    eventIds: ["E1433_05", "E1433_06"], toDate: "1433-04-19",
    focusNodeIds: ["JO_CHOEYUNDEOK", "JO_LEESUNMONG", "JO_KIMHYOSEONG", "JZ_MANJU", "JZ_IMHALA"],
    narration: "7개 부대로 나뉜 정벌군이 파저강 일대를 공격한다. 이순몽은 이만주의 채리를, 최윤덕과 김효성은 실록이 '정적'이라 칭한 임합라 관련 채리를 각각 공격한다."
  },
  {
    id: "S06", title: "1433.05 — 전사자 보상과 정벌 이유 공표",
    eventIds: ["E1433_07", "E1433_08", "E1433_09"], toDate: "1433-05-17",
    focusNodeIds: ["JO_SEJONG", "JO_CHOEYUNDEOK", "GROUP_1433_WARDEAD"],
    narration: "정벌 전과와 함께 일부 지휘관의 군령 위반도 보고된다. 조정은 농번기 대군 동원의 이유를 공표하고, 전사·병사자에게 곡식과 복호를 내린다."
  },
  {
    id: "S07", title: "1433 하반기 — 명의 중재와 통교 재개",
    eventIds: ["E1433_10", "E1433_11", "E1433_12", "E1433_13"], toDate: "1433-12-21",
    focusNodeIds: ["MING_XUANDE", "JO_SEJONG", "JZ_MANJU", "JZ_MENGGETEMUR", "JZ_IMHALA", "JUR_HOLLAON"],
    narration: "맹가첩목아는 진범이 임합라라고 반박하고, 명 선덕제는 진위를 가리기 어렵다며 상호 반환과 침범 중지를 명한다. 같은 해 12월, 이만주는 다시 조선에 사절을 보낸다. 전쟁 직후에도 외교는 끊이지 않는다."
  },
  {
    id: "S08", title: "1434 — 국경 방어의 제도화",
    eventIds: ["E1434_01", "E1434_02", "E1434_03", "E1434_04", "E1434_05", "E1434_06"], toDate: "1434-10-12",
    focusNodeIds: ["JZ_MANJU", "JO_SINSANG", "JO_HWANGHUI", "MING_XUANDE", "MING_MENGNAL", "JUR_HOLLAON"],
    narration: "이만주와 조선 사이에 문서 교섭과 도망자 처리 논쟁이 이어지고, 자성·여연 등 국경 방어 체계가 정비된다. 명은 홀라온에 억류된 조선인 포로 문제도 계속 중재한다."
  },
  {
    id: "S09", title: "1435.01 — 여연성 포위",
    eventIds: ["E1435_01"], toDate: "1435-01-13",
    focusNodeIds: ["JUR_HOLLAON", "JO_KIMYUNSU", "JO_LEEJIN", "JO_YEOSEONGRYEOL", "JO_KIMSUYEON"],
    narration: "오량합 기병 약 2,700기가 여연성을 포위한다. 김윤수 등이 방어에 성공하지만 피해가 발생한다."
  },
  {
    id: "S10", title: "1435.06 — 미보고 사건의 폭로",
    eventIds: ["E1435_04"], toDate: "1435-06-13",
    focusNodeIds: ["JZ_MANJU", "JUR_HOLLAON", "JO_KIMYUNSU", "JO_LEEGAK", "JO_CHOESAGANG", "JO_SEJONG"],
    narration: "귀화한 여진인의 제보로, 지난 정월 이만주와 홀라온이 함께 벌인 별개의 침입이 6개월 만에 드러난다. 김윤수는 고신을 박탈당하지만 현직은 유임된다."
  },
  {
    id: "S11", title: "사헌부와 조정의 책임 논쟁",
    eventIds: ["E1435_05"], toDate: "1435-06-17",
    focusNodeIds: ["JO_CHOEGYEONGMYEONG", "JO_KIMYUNSU", "JO_SEJONG"],
    narration: "사헌부 최경명은 처분이 가볍다며 재추국을 요구하지만, 세종은 유임 방침을 굽히지 않는다."
  },
  {
    id: "S12", title: "1435.09 — 포상·처벌·예우의 공존",
    eventIds: ["E1435_06"], toDate: "1435-09-18",
    focusNodeIds: ["JO_KIMYUNSU", "JO_JANGSAU", "JO_BAECHEOL", "JO_CHOESAGANG", "GROUP_1435_CASUALTIES"],
    narration: "같은 해 두 차례 문책받았던 김윤수가 적의 퇴로를 끊은 공으로 포상 대상에 오른다. 한 인물을 영웅이나 죄인 하나로 고정하지 않는 조선 조정의 평가 방식이 드러난다."
  }
];
