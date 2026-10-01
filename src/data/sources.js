/* ==========================================================================
   SOURCES — 모든 EVENT와 RELATION은 여기의 id를 sourceIds로 참조한다.
   date: 실록 기사 게재일(음력, 'YYYY-MM-DD', 윤달은 'YYYY-MML-DD').
   verification: 이번 작업 세션에서 원문을 다시 대조했는지(vocab.VERIFICATION).
   accessNote: 접근 가능 여부 기록. (이번 세션 환경에서는 sillok.history.go.kr,
               encykorea.aks.ac.kr, kyu.snu.ac.kr 접속이 네트워크 정책으로 차단되었다.)
   ========================================================================== */

const SILLOK = "https://sillok.history.go.kr/id/";

function sillok(id, date, title, articleId, extra = {}) {
  return {
    id,
    sourceType: "sillok",
    sourceLevel: "primary",
    title,
    date,
    url: SILLOK + articleId,
    articleId,
    authorOrReporter: null,
    documentType: "article",
    note: "",
    verification: "inherited_v2",
    ...extra
  };
}

export const SOURCES = [
  /* ---------- v2 데이터셋에서 이관한 세종실록 기사(1432~1435) ---------- */
  sillok("SRC_1432_1209", "1432-12-09", "세종실록 14년 12월 9일 — 여연 침입·박초 추격·홍사석 파견", "wda_11412009_003"),
  sillok("SRC_1432_1221", "1432-12-21", "세종실록 14년 12월 21일 — 이만주 측 해명·유을합 포로 송환", "kda_11412021_003"),
  sillok("SRC_1433_0215", "1433-02-15", "세종실록 15년 2월 15일 — 파저강 대응 비밀 의견 수렴", "kda_11502015_002"),
  sillok("SRC_1433_0226", "1433-02-26", "세종실록 15년 2월 26일 — 파저강 정벌 지휘체계", "kda_11502026_004"),
  sillok("SRC_1433_0310", "1433-03-10", "세종실록 15년 3월 10일 — 성죄방목", "kda_11503010_005"),
  sillok("SRC_1433_0325", "1433-03-25", "세종실록 15년 3월 25일 — 맹가첩목아 관련 비밀 지시", "wda_11503025_002"),
  sillok("SRC_1433_0507", "1433-05-07", "세종실록 15년 5월 7일 — 제1차 파저강 정벌 보고(4/10 집결, 4/19 공격 포함)", "kda_11505007_002",
    { authorOrReporter: "최윤덕(평안도 도절제사)", documentType: "article",
      note: "v2 요약에 따르면 최윤덕의 전과·사상자·군령위반 보고가 실려 있다. 보고문 유형(치계/장계)은 원문 재대조 필요." }),
  sillok("SRC_1433_0511", "1433-05-11", "세종실록 15년 5월 11일 — 정벌 이유 중외 포고 건의", "kda_11505011_004"),
  sillok("SRC_1433_0517", "1433-05-17", "세종실록 15년 5월 17일 — 파저강 전사·병사자 보상", "kda_11505017_002"),
  sillok("SRC_1433_0601", "1433-06-01", "세종실록 15년 6월 1일 — 자성군 설치", "kda_11506001_003"),
  sillok("SRC_1433_0610", "1433-06-10", "세종실록 15년 6월 10일 — 맹가첩목아가 지함에게 한 진술", "wda_11506010_002"),
  sillok("SRC_1433_08L10", "1433-08L-10", "세종실록 15년 윤8월 10일 — 명 칙서(상호 반환·침범 중지)", "wda_11508110_001"),
  sillok("SRC_1433_1221", "1433-12-21", "세종실록 15년 12월 21일 — 이만주 사절(왕답올·유살독 등)", "kda_11512021_002"),
  sillok("SRC_1434_0416", "1434-04-16", "세종실록 16년 4월 16일 — 이만주가 강계부에 보낸 문서", "kda_11604016_003"),
  sillok("SRC_1434_0422", "1434-04-22", "세종실록 16년 4월 22일 — 도망자 송환 논의", "kda_11604022_001"),
  sillok("SRC_1434_0426", "1434-04-26", "세종실록 16년 4월 26일 — 이만주 관하 인원 이탈", "kda_11604026_006"),
  sillok("SRC_1434_0914", "1434-09-14", "세종실록 16년 9월 14일 — 자성군 방비 강화", "kda_11609014_001"),
  sillok("SRC_1434_1010", "1434-10-10", "세종실록 16년 10월 10일 — 부방군 교대체계·병마 편제 감독", "kda_11610010_005"),
  sillok("SRC_1434_1012", "1434-10-12", "세종실록 16년 10월 12일 — 명의 홀라온 억류 포로 송환 중재", "wda_11610012_001"),
  sillok("SRC_1435_0118", "1435-01-18", "세종실록 17년 1월 18일 — 1월 13일 오량합 여연성 포위 보고", "wda_11701018_002"),
  sillok("SRC_1435_0125", "1435-01-25", "세종실록 17년 1월 25일 — 여연 방어구조 개편 검토", "kda_11701025_001"),
  sillok("SRC_1435_0224", "1435-02-24", "세종실록 17년 2월 24일 — 범찰 이주 허가(명)", "wda_11702024_001"),
  sillok("SRC_1435_0613", "1435-06-13", "세종실록 17년 6월 13일 — 정월 미보고 침입 발각·김윤수 문책", "kda_11706013_003"),
  sillok("SRC_1435_0617", "1435-06-17", "세종실록 17년 6월 17일 — 사헌부의 김윤수 처분 강화 요구", "kda_11706017_004"),
  sillok("SRC_1435_0918", "1435-09-18", "세종실록 17년 9월 18일 — 여연 추격 공로 포상·전사자 예우", "wda_11709018_003"),

  /* ---------- 사용자 제시 anchor 기사(이번 세션에서 원문 접근 불가 → 시드) ---------- */
  sillok("SRC_1433_0307", "1433-03-07", "세종실록 15년 3월 7일 — 최윤덕의 병력·진격로 건의(anchor)", "wda_11503007_001",
    { verification: "seed_unverified", authorOrReporter: "최윤덕", note: "사용자 제시 anchor. 내용 미대조." }),
  sillok("SRC_1437_0922", "1437-09-22", "세종실록 19년 9월 22일 — 이천의 제2차 파저강 정벌(anchor)", "wda_11909022_001",
    { verification: "seed_unverified", authorOrReporter: "이천(추정, 원문 미확인)", note: "사용자 제시 anchor. 전과·병력 수치는 원문 대조 전까지 입력하지 않음." }),
  sillok("SRC_1438_0729", "1438-07-29", "세종실록 20년 7월 29일 — 김종서의 범찰·동창 관련 회계(anchor)", "wda_12007029_003",
    { verification: "seed_unverified", authorOrReporter: "김종서", documentType: "hoegye", note: "사용자 제시 anchor. embedded document 범위 미추출." }),
  sillok("SRC_1438_0808", "1438-08-08", "세종실록 20년 8월 8일 — 김종서 장계가 인용된 여진 정책 기사(anchor)", "wda_12008008_003",
    { verification: "seed_unverified", authorOrReporter: "김종서", documentType: "janggye", note: "사용자 제시 anchor. 인용 범위 미추출." }),
  sillok("SRC_1439_0510", "1439-05-10", "세종실록 21년 5월 10일 — 김종서의 거을가개 관련 치계(anchor)", "kda_12105010_001",
    { verification: "seed_unverified", authorOrReporter: "김종서", documentType: "chigye", note: "사용자 제시 anchor. '거을가개'가 인명인지 지명인지 미확인." }),
  sillok("SRC_1449_0707", "1449-07-07", "세종실록 31년 7월 7일 — 부거현을 부령도호부로 승격, 진 설치(anchor)", "kda_13107007_003",
    { verification: "seed_unverified", note: "사용자 제시 anchor. 작업상 종점." }),

  /* ---------- 2차 참고자료 / 서정록 ---------- */
  {
    id: "SRC_ENCY_SEOJEONGNOK",
    sourceType: "secondary_reference",
    sourceLevel: "secondary",
    title: "한국민족문화대백과사전 「서정록(西征錄)」",
    date: null,
    url: "https://encykorea.aks.ac.kr/Article/E0028169",
    articleId: null,
    authorOrReporter: "한국학중앙연구원",
    documentType: null,
    note: "『서정록』 서지·해제용 2차 참고자료. 이번 세션에서 접속 차단되어 내용 확인 못함. 세부 사건 생성에 사용하지 않음.",
    verification: "not_accessed"
  }
];
