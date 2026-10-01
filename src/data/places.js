/* ==========================================================================
   PLACES — WHERE 차원의 단일 entity 목록.
   - coordinate: pack v1에 좌표가 없으므로 전부 null, coordinateStatus "pack_no_coordinate".
     (위치가 '불명'이라는 뜻이 아니라 '이 데이터셋이 좌표를 갖고 있지 않다'는 뜻)
   - locationStatus: named_in_pack / abstract / legacy_only — 좌표 상태와 별개.
   - hanja: pack v1 지명 표기에 한자가 없으므로 넣지 않는다(편집자 일반지식 한자 제거).
   - parentPlaceId: pack 서술이 포함관계를 말할 때만(parentBasis에 근거 sourceIds).
   - theater / theaterBasis: pack 서술(pack_explicit) 또는 pack 지명에서 편집 분류(editorial_from_pack).
   ========================================================================== */

function place(placeId, canonicalName, hanja, placeType, theater, extra = {}) {
  return {
    placeId, canonicalName, hanja: null, aliases: [], placeType, theater, theaterBasis: "editorial_from_pack",
    parentPlaceId: null, parentBasis: null, modernLocationNote: "", coordinate: null,
    coordinateStatus: "pack_no_coordinate", locationStatus: "named_in_pack", sourceIds: [], ...extra
  };
}
const PARENT = (parentPlaceId, sourceIds, note) => ({ parentPlaceId, parentBasis: { sourceIds, note } });

export const PLACES = [
  place("PL_HANSEONG", "한성(조정)", null, "capital", "CENTRAL",
    { locationStatus: "abstract", theaterBasis: "pack_explicit", modernLocationNote: "조정의 논의·결정 장소를 대표하는 추상 위치. 개별 기사에서 궁궐 등 정확한 장소는 구분하지 않음." }),
  place("PL_PYEONGAN", "평안도", null, "province", "AMNOK"),
  place("PL_HWANGHAE", "황해도", null, "province", "UNSPECIFIED",
    { modernLocationNote: "1433년 황해도군 5천 동원(pack). 전구 분류 근거 없음 → UNSPECIFIED." }),
  place("PL_HAMGIL", "함길도", null, "province", "DUMAN"),
  place("PL_AMNOK", "압록강", null, "river", "AMNOK"),
  place("PL_YEOYEON", "여연", null, "county", "AMNOK"),
  place("PL_GANGGYE", "강계", null, "county", "AMNOK", { aliases: ["강계부"] }),
  place("PL_JASEONG", "자성", null, "county", "AMNOK",
    { aliases: ["자작리"],
      modernLocationNote: "이명 '자작리'와 1433-06-01 설치 기사는 v2(legacy) 근거. 지명 자성은 pack 기사에 등장." }),
  place("PL_CHAERI_IMANJU", "이만주의 채리", null, "settlement", "AMNOK",
    { modernLocationNote: "pack v1 공격 대상 서술. 위치 정보 없음." }),
  place("PL_CHAERI_IMHALA", "임합라의 채리", null, "settlement", "AMNOK",
    { modernLocationNote: "pack v1 공격 대상 서술. 위치 정보 없음." }),
  place("PL_CHAERI_IMHALA_PARENTS", "임합라 부모의 채리", null, "settlement", "AMNOK",
    { modernLocationNote: "pack v1 공격 대상 서술. 위치 정보 없음." }),
  place("PL_MING_COURT", "명 조정", null, "capital", "MING",
    { locationStatus: "abstract", modernLocationNote: "칙서 발신 주체로서의 명 조정. 구체적 장소는 기사별로 확인하지 않음." }),
  place("PL_BURYEONG", "부령(부거현)", null, "county", "DUMAN",
    { aliases: ["부거현", "부령도호부"],
      modernLocationNote: "pack v1(1449-07-07): 부거현을 회령의 석보로 옮겨 부령도호부로 승격하고 진 설치.", sourceIds: ["SRC_1449_0707", "SRC_GEO_BURYEONG"] }),

  /* ---------- pack v1 지명 (theater는 pack 서술 근거, 좌표 없음) ---------- */
  place("PL_GEOYEO", "거여", null, "settlement", "AMNOK", { modernLocationNote: "pack v1 지명 목록. 현대 비정 없음.", sourceIds: ["SRC_1433_0507"] }),
  place("PL_MACHEON", "마천", null, "settlement", "AMNOK", { modernLocationNote: "pack v1 지명 목록. 현대 비정 없음.", sourceIds: ["SRC_1433_0507"] }),
  place("PL_OLLA", "올라", null, "settlement", "AMNOK", { modernLocationNote: "pack v1 지명 목록. 현대 비정 없음.", sourceIds: ["SRC_1433_0507"] }),
  place("PL_PALLISU", "팔리수", null, "settlement", "AMNOK", { modernLocationNote: "pack v1 지명 목록. 현대 비정 없음.", sourceIds: ["SRC_1433_0507"] }),
  place("PL_ALMOKHA", "알목하", null, "settlement", "DUMAN",
    { aliases: ["Almuha"], modernLocationNote: "지리지(pack v1): 세종 16년 회령을 알목하에 설치.", sourceIds: ["SRC_1433_0610", "SRC_GEO_JONGSEONG"] }),
  place("PL_YEONGBUK", "영북진", null, "garrison", "DUMAN", { sourceIds: ["SRC_1434_0803"] }),
  place("PL_BAEKANSUSO", "백안수소", null, "settlement", "DUMAN", { sourceIds: ["SRC_1434_0803"] }),
  place("PL_HOERYEONG", "회령", null, "garrison_county", "DUMAN",
    { ...PARENT("PL_HAMGIL", ["SRC_1447_0708"], "pack 1447-07-08: 함길도 변경의 회령·삼수 축성"), aliases: ["회령진", "회령도호부"], sourceIds: ["SRC_1434_0803", "SRC_GEO_HOERYEONG"] }),
  place("PL_SEOKBO", "석보(회령 경내)", null, "station", "DUMAN",
    { ...PARENT("PL_HOERYEONG", ["SRC_1449_0707"], "pack 1449-07-07: 회령의 석보"), sourceIds: ["SRC_1449_0707"] }),
  place("PL_GYEONGWON", "경원", null, "county", "DUMAN", { sourceIds: ["SRC_1435_0312", "SRC_GEO_GYEONGWON"] }),
  place("PL_JONGSEONG", "종성", null, "county", "DUMAN", { sourceIds: ["SRC_1435_0719", "SRC_GEO_JONGSEONG"] }),
  place("PL_GONGSEONG", "공성", null, "county", "DUMAN", { sourceIds: ["SRC_1435_0719"] }),
  place("PL_SUJU", "수주(강변)", null, "region", "DUMAN", { sourceIds: ["SRC_1441_0129"] }),
  place("PL_ONSEONG", "온성(다온평)", null, "county", "DUMAN", { aliases: ["다온평"], sourceIds: ["SRC_1441_0129"] }),
  place("PL_GEONWON", "건원보", null, "garrison", "DUMAN", { sourceIds: ["SRC_1441_0519"] }),
  place("PL_ASANJANG", "아산(장)", null, "garrison", "DUMAN", { sourceIds: ["SRC_1441_0519"] }),
  place("PL_GILJU", "길주", null, "county", "DUMAN", { sourceIds: ["SRC_1435_0312", "SRC_1440_0117"] }),
  place("PL_GYEONGHEUNG", "경흥", null, "county", "DUMAN", { sourceIds: ["SRC_1440_0117"] }),
  place("PL_GAPSAN", "갑산", null, "county", "DUMAN", { sourceIds: ["SRC_1440_0117", "SRC_1447_0708"] }),
  place("PL_HYESAN", "혜산", null, "garrison", "DUMAN", { sourceIds: ["SRC_1440_0117"] }),
  place("PL_SAMSU", "삼수", null, "county", "DUMAN",
    { ...PARENT("PL_HAMGIL", ["SRC_1447_0708"], "pack 1447-07-08: 함길도 변경의 회령·삼수 축성"), sourceIds: ["SRC_1447_04L10", "SRC_1447_0708"] }),
  place("PL_SAGUN", "4군 지역", null, "region", "AMNOK",
    { modernLocationNote: "1436 기사에서 '4군' 방어 대상으로 지칭. 개별 군의 설치 연도는 각 기사로만 확정.", sourceIds: ["SRC_1436_1101"] }),
  place("PL_MUCHANG", "무창", null, "county", "UNSPECIFIED", { modernLocationNote: "pack 1446-04-20 기사에 도·전구 서술 없음.", sourceIds: ["SRC_1446_0420"] }),
  place("PL_ISAN", "이산", null, "county", "AMNOK", { sourceIds: ["SRC_1437_0914"] }),
  place("PL_HONGTARI", "홍타리", null, "settlement", "AMNOK", { modernLocationNote: "pack v1 지명 목록. 현대 비정 없음.", sourceIds: ["SRC_1437_0914"] }),
  place("PL_AHAN", "아한", null, "settlement", "AMNOK", { modernLocationNote: "pack v1 지명 목록. 현대 비정 없음.", sourceIds: ["SRC_1437_0914"] }),
  place("PL_ONGCHON", "옹촌", null, "settlement", "AMNOK", { modernLocationNote: "pack v1 지명 목록. 현대 비정 없음.", sourceIds: ["SRC_1437_0914"] }),
  place("PL_OJAJEOM", "오자점", null, "settlement", "AMNOK", { modernLocationNote: "pack v1 지명 목록. 현대 비정 없음.", sourceIds: ["SRC_1437_0914"] }),
  place("PL_OMIBU", "오미부", null, "settlement", "AMNOK", { modernLocationNote: "pack v1 지명 목록. 현대 비정 없음.", sourceIds: ["SRC_1437_0914"] }),
  place("PL_SAKJU", "삭주(삭천)", null, "county", "UNSPECIFIED", { modernLocationNote: "pack 1449-07-07: 삭천→삭주 개칭. 전구 서술 없음.",  aliases: ["삭천"], sourceIds: ["SRC_1449_0707"] })
];
