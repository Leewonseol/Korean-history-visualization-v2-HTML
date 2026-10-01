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
    { parentPlaceId: "PL_HAMGIL", aliases: ["부거현", "富居縣"],
      modernLocationNote: "사용자 제시 anchor(1449-07-07): 부거현을 부령도호부로 승격. 원문 미대조." })
];
