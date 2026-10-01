/* ==========================================================================
   PLACES — WHERE 차원의 단일 entity 목록.
   coordinate: 사료나 검증된 2차 연구에서 확인하지 않은 현대 좌표는 넣지 않는다(null).
   hanjaVerified: 원문 대조 여부(이번 세션은 원문 접근 불가 → false).
   ========================================================================== */

function place(placeId, canonicalName, hanja, placeType, theater, extra = {}) {
  return {
    placeId, canonicalName, hanja, aliases: [], placeType, theater,
    parentPlaceId: null, modernLocationNote: "", coordinate: null, coordinateCertainty: "none",
    hanjaVerified: false, sourceIds: [], ...extra
  };
}

export const PLACES = [
  place("PL_HANSEONG", "한성(조정)", "漢城", "capital", "CENTRAL",
    { modernLocationNote: "조정의 논의·결정 장소를 대표하는 추상 위치. 개별 기사에서 궁궐 등 정확한 장소는 구분하지 않음." }),
  place("PL_PYEONGAN", "평안도", "平安道", "province", "AMNOK"),
  place("PL_HWANGHAE", "황해도", "黃海道", "province", "CENTRAL",
    { modernLocationNote: "1433년 황해도군 동원의 출발 지역. 전구(theater)는 후방이므로 CENTRAL로 분류." }),
  place("PL_HAMGIL", "함길도", "咸吉道", "province", "DUMAN"),
  place("PL_AMNOK", "압록강", "鴨綠江", "river", "AMNOK"),
  place("PL_YEOYEON", "여연", "閭延", "county", "AMNOK", { parentPlaceId: "PL_PYEONGAN" }),
  place("PL_GANGGYE", "강계", "江界", "county", "AMNOK", { parentPlaceId: "PL_PYEONGAN", aliases: ["강계부"] }),
  place("PL_JASEONG", "자성", "慈城", "county", "AMNOK",
    { parentPlaceId: "PL_PYEONGAN", aliases: ["자작리"],
      modernLocationNote: "v2 요약: 여연과 강계 사이 요충지 자작리에 자성군을 설치(1433-06-01 기사)." }),
  place("PL_PAJEOGANG", "파저강 일대", "婆猪江", "river_region", "AMNOK",
    { modernLocationNote: "명 영역 내 건주위 일대. 현대 하천 비정은 2차 연구 인용 후 기록할 것(현재 미기입)." }),
  place("PL_CHAERI_IMANJU", "이만주의 채리", null, "settlement", "AMNOK",
    { parentPlaceId: "PL_PAJEOGANG", modernLocationNote: "정확한 위치 불명." }),
  place("PL_CHAERI_IMHALA", "임합라의 채리", null, "settlement", "AMNOK",
    { parentPlaceId: "PL_PAJEOGANG", modernLocationNote: "정확한 위치 불명." }),
  place("PL_CHAERI_IMHALA_PARENTS", "임합라 부모의 채리", null, "settlement", "AMNOK",
    { parentPlaceId: "PL_PAJEOGANG", modernLocationNote: "정확한 위치 불명." }),
  place("PL_MING_COURT", "명 조정", null, "capital", "MING",
    { modernLocationNote: "칙서 발신 주체로서의 명 조정. 구체적 장소는 기사별로 확인하지 않음." }),
  place("PL_HOLLAON_AREA", "홀라온 거주지역", "忽剌溫", "region", "UNSPECIFIED",
    { modernLocationNote: "범위·위치 불명. 추정 좌표를 넣지 않음." }),
  place("PL_BURYEONG", "부령(부거현)", "富寧", "county", "DUMAN",
    { parentPlaceId: "PL_HAMGIL", aliases: ["부거현", "富居縣", "부령도호부"], hanjaVerified: false,
      modernLocationNote: "pack v1(1449-07-07): 부거현을 회령의 석보로 옮겨 부령도호부로 승격하고 진 설치.", sourceIds: ["SRC_1449_0707", "SRC_GEO_BURYEONG"] }),

  /* ---------- pack v1 지명 (theater는 pack 서술 근거, 좌표 없음) ---------- */
  place("PL_GEOYEO", "거여", null, "settlement", "AMNOK", { modernLocationNote: "위치 불명(pack v1 지명 목록).", sourceIds: ["SRC_1433_0507"] }),
  place("PL_MACHEON", "마천", null, "settlement", "AMNOK", { modernLocationNote: "위치 불명(pack v1 지명 목록).", sourceIds: ["SRC_1433_0507"] }),
  place("PL_OLLA", "올라", null, "settlement", "AMNOK", { modernLocationNote: "위치 불명(pack v1 지명 목록).", sourceIds: ["SRC_1433_0507"] }),
  place("PL_PALLISU", "팔리수", null, "settlement", "AMNOK", { modernLocationNote: "위치 불명(pack v1 지명 목록).", sourceIds: ["SRC_1433_0507"] }),
  place("PL_ALMOKHA", "알목하", null, "settlement", "DUMAN",
    { aliases: ["Almuha"], modernLocationNote: "지리지(pack v1): 세종 16년 회령을 알목하에 설치.", sourceIds: ["SRC_1433_0610", "SRC_GEO_JONGSEONG"] }),
  place("PL_YEONGBUK", "영북진", "寧北鎭", "garrison", "DUMAN", { sourceIds: ["SRC_1434_0803"] }),
  place("PL_BAEKANSUSO", "백안수소", null, "settlement", "DUMAN", { sourceIds: ["SRC_1434_0803"] }),
  place("PL_HOERYEONG", "회령", "會寧", "garrison_county", "DUMAN",
    { parentPlaceId: "PL_HAMGIL", aliases: ["회령진", "회령도호부"], sourceIds: ["SRC_1434_0803", "SRC_GEO_HOERYEONG"] }),
  place("PL_SEOKBO", "석보(회령 경내)", null, "station", "DUMAN", { parentPlaceId: "PL_HOERYEONG", sourceIds: ["SRC_1449_0707"] }),
  place("PL_GYEONGWON", "경원", "慶源", "county", "DUMAN", { parentPlaceId: "PL_HAMGIL", sourceIds: ["SRC_1435_0312", "SRC_GEO_GYEONGWON"] }),
  place("PL_JONGSEONG", "종성", "鍾城", "county", "DUMAN", { parentPlaceId: "PL_HAMGIL", sourceIds: ["SRC_1435_0719", "SRC_GEO_JONGSEONG"] }),
  place("PL_GONGSEONG", "공성", null, "county", "DUMAN", { parentPlaceId: "PL_HAMGIL", sourceIds: ["SRC_1435_0719"] }),
  place("PL_SUJU", "수주(강변)", null, "region", "DUMAN", { sourceIds: ["SRC_1441_0129"] }),
  place("PL_ONSEONG", "온성(다온평)", null, "county", "DUMAN", { aliases: ["다온평"], sourceIds: ["SRC_1441_0129"] }),
  place("PL_GEONWON", "건원보", null, "garrison", "DUMAN", { sourceIds: ["SRC_1441_0519"] }),
  place("PL_ASANJANG", "아산(장)", null, "garrison", "DUMAN", { sourceIds: ["SRC_1441_0519"] }),
  place("PL_GILJU", "길주", "吉州", "county", "DUMAN", { parentPlaceId: "PL_HAMGIL", sourceIds: ["SRC_1435_0312", "SRC_1440_0117"] }),
  place("PL_GYEONGHEUNG", "경흥", "慶興", "county", "DUMAN", { parentPlaceId: "PL_HAMGIL", sourceIds: ["SRC_1440_0117"] }),
  place("PL_GAPSAN", "갑산", "甲山", "county", "DUMAN", { parentPlaceId: "PL_HAMGIL", sourceIds: ["SRC_1440_0117", "SRC_1447_0708"] }),
  place("PL_HYESAN", "혜산", "惠山", "garrison", "DUMAN", { parentPlaceId: "PL_HAMGIL", sourceIds: ["SRC_1440_0117"] }),
  place("PL_SAMSU", "삼수", "三水", "county", "DUMAN", { parentPlaceId: "PL_HAMGIL", sourceIds: ["SRC_1447_04L10", "SRC_1447_0708"] }),
  place("PL_SAGUN", "4군 지역", null, "region", "AMNOK",
    { modernLocationNote: "1436 기사에서 '4군' 방어 대상으로 지칭. 개별 군의 설치 연도는 각 기사로만 확정.", sourceIds: ["SRC_1436_1101"] }),
  place("PL_MUCHANG", "무창", "茂昌", "county", "AMNOK", { parentPlaceId: "PL_PYEONGAN", sourceIds: ["SRC_1446_0420"] }),
  place("PL_ISAN", "이산", "理山", "county", "AMNOK", { parentPlaceId: "PL_PYEONGAN", sourceIds: ["SRC_1437_0914"] }),
  place("PL_HONGTARI", "홍타리", null, "settlement", "AMNOK", { modernLocationNote: "위치 불명(pack v1 지명 목록).", sourceIds: ["SRC_1437_0914"] }),
  place("PL_AHAN", "아한", null, "settlement", "AMNOK", { modernLocationNote: "위치 불명(pack v1 지명 목록).", sourceIds: ["SRC_1437_0914"] }),
  place("PL_ONGCHON", "옹촌", null, "settlement", "AMNOK", { modernLocationNote: "위치 불명(pack v1 지명 목록).", sourceIds: ["SRC_1437_0914"] }),
  place("PL_OJAJEOM", "오자점", null, "settlement", "AMNOK", { modernLocationNote: "위치 불명(pack v1 지명 목록).", sourceIds: ["SRC_1437_0914"] }),
  place("PL_OMIBU", "오미부", null, "settlement", "AMNOK", { modernLocationNote: "위치 불명(pack v1 지명 목록).", sourceIds: ["SRC_1437_0914"] }),
  place("PL_SAKJU", "삭주(삭천)", "朔州", "county", "AMNOK", { parentPlaceId: "PL_PYEONGAN", aliases: ["삭천"], sourceIds: ["SRC_1449_0707"] })
];
