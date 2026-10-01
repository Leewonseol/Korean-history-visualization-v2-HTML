/* ==========================================================================
   PEOPLE — 행위자 authority table (개인·무명 집단·기관)
   - firstSeen / lastSeen / sourceIds 는 EVENTS에서 자동 계산한다(model/indexes.js).
   - 실명이 없는 군졸·전사자·주민·부역민은 개인을 창작하지 않고 entityType "group".
   - 기사 주어가 기관·직위(병조, 평안도 감사 등)뿐이면 개인에게 귀속하지 않고 "institution".
   - hanja: VALIDATED SOURCE PACK v1(사용자 실록 대조)에 있는 표기는 hanjaVerified=true.
     그 밖의 표기는 편집자 확신이 높을 때만 넣고 hanjaVerified=false. 확신 없으면 null.
   - 같은 이름의 서로 다른 ID는 possibleSameAs(동일인 여부 미확인) 또는 distinctFrom(동명이인)로 선언.
   - 이 목록은 1432~1449 등장인물 전부가 아니다(pack v1과 v2 데이터에서 확인된 이름만).
   ========================================================================== */

function actor(personId, canonicalName, hanja, entityType, affiliation, defaultLevel, extra = {}) {
  return {
    personId, canonicalName, hanja, aliases: [], entityType, affiliation, defaultLevel,
    identityNote: "", identityCertainty: entityType === "person" ? "high" : "n/a",
    hanjaVerified: false, ...extra
  };
}
const V = { hanjaVerified: true };                         // pack v1에서 한자 확인
const C = (h, extra = {}) => ["person", "JOSEON_CENTRAL", "L1", { ...(h ? V : {}), ...extra }];

export const PEOPLE = [
  /* ---------------- 조선 왕·중앙 관료 ---------------- */
  actor("JO_SEJONG", "세종", "世宗", "person", "JOSEON_CENTRAL", "L0"),
  actor("JO_HWANGHUI", "황희", "黃喜", ...C(1)),
  actor("JO_MAENGSASEONG", "맹사성", "孟思誠", ...C(1)),
  actor("JO_GWONJIN", "권진", "權軫", ...C(1)),
  actor("JO_HEOJO", "허조", "許稠", ...C(1)),
  actor("JO_ANSUN", "안순", "安純", ...C(1)),
  actor("JO_JEONGHEUMJI", "정흠지", "鄭欽之", ...C(1)),
  actor("JO_HAGYEONGBOK", "하경복", "河敬復", ...C(1)),
  actor("JO_JOMALSAENG", "조말생", "趙末生", ...C(1)),
  actor("JO_ANSUNGSEON", "안숭선", "安崇善", ...C(1)),
  actor("JO_SIMDOWON", "심도원", "沈道源", ...C(1)),
  actor("JO_SEONGDALSAENG", "성달생", "成達生", ...C(1)),
  actor("JO_HWANGBOIN", "황보인", "皇甫仁", ...C(1, { identityNote: "1441 동북 진보 재편 파견, 1445~1447 축성·봉수·변경 재편 보고." })),
  actor("JO_HAYEON", "하연", "河演", ...C(1)),
  actor("JO_PARKJONGU", "박종우", "朴從愚", ...C(1)),
  actor("JO_JEONGBUN", "정분", "鄭苯", ...C(1)),
  actor("JO_JEONGGAPSON", "정갑손", "鄭甲孫", ...C(1)),
  actor("JO_KIMJONGSEO", "김종서", "金宗瑞", ...C(1, { identityNote: "1432 중앙 논의 참여 → 1436 4군 방어책 → 1438~1440 북방 업무(관직명 pack 미기재) → 1448 대신 논의 참여." })),
  actor("JO_CHOESAGANG", "최사강", "崔士康", ...C(0)),
  actor("JO_KIMCHEONG", "김청", null, ...C(0, { identityNote: "성죄방목 작성 실무자(v2). 한자·관직 원문 확인 필요.", identityCertainty: "medium" })),
  actor("JO_CHOEGYEONGMYEONG", "최경명", null, ...C(0, { identityNote: "사헌부 지평(v2). 한자 원문 확인 필요.", identityCertainty: "medium" })),
  actor("JO_NOHAN", "노한", "盧閈", ...C(0)),
  actor("JO_SINSANG", "신상", "申商", ...C(0)),
  actor("JO_LEESUKCHI", "이숙치", null, ...C(0, { identityCertainty: "medium" })),
  // 1432-12-21 조정 논의 참여자(pack v1, 한자 미기재)
  ...[["JO_SINJANG", "신장"], ["JO_KIMIKJEONG", "김익정"], ["JO_SEONGEOK", "성억"], ["JO_JEONGYEON", "정연"], ["JO_JOGYESAENG", "조계생"], ["JO_LEEMAENGGYUN", "이맹균"]]
    .map(([id, n]) => actor(id, n, null, ...C(0, { identityNote: "1432-12-21 책임 논의 참여(pack v1). 한자·관직 미기재.", identityCertainty: "medium" }))),
  // 1433-05-16 제수 대상(pack v1, 한자 미기재)
  ...[["JO_PARKANSIN", "박안신"], ["JO_NAMJI", "남지"], ["JO_LEESAGWAN", "이사관"], ["JO_GWONBOK", "권복"], ["JO_ANGUGYEONG", "안구경"]]
    .map(([id, n]) => actor(id, n, null, ...C(0, { identityNote: "1433-05-16 관직 제수 기사에 등장(pack v1). 한자·관직 미기재.", identityCertainty: "medium" }))),

  /* ---------------- 조선 기관·직위(실명 미기재 주체) ---------------- */
  actor("ORG_JOSEON_COURT", "조선 국가·조정(주체·수신자 미특정)", null, "institution", "JOSEON_CENTRAL", "L1",
    { identityNote: "사료가 '국가/조정' 또는 '조선 측'으로만 서술할 때 쓰는 자리표시자. 개인으로 해석하지 말 것." }),
  actor("ORG_UIJEONGBU", "의정부", "議政府", "institution", "JOSEON_CENTRAL", "L1"),
  actor("ORG_YUKJO", "육조", "六曹", "institution", "JOSEON_CENTRAL", "L1"),
  actor("ORG_SAMGUN_DOJINMU", "삼군 도진무", "三軍都鎭撫", "institution", "JOSEON_CENTRAL", "L2"),
  actor("ORG_BYEONGJO", "병조", "兵曹", "institution", "JOSEON_CENTRAL", "L1",
    { identityNote: "기사 주어가 '병조'로만 기록된 행위. 판서 개인에게 자동 귀속하지 않음." }),
  actor("ORG_YEJO", "예조", "禮曹", "institution", "JOSEON_CENTRAL", "L1"),
  actor("ORG_SAHEONBU", "사헌부", "司憲府", "institution", "JOSEON_CENTRAL", "L1"),
  actor("ORG_PYEONGAN_GAMSA", "평안도 감사(실명 미기재)", null, "institution", "JOSEON_FRONTIER", "L3"),
  actor("ORG_PYEONGAN_FIELD", "평안도 감사·도절제사(실명 미기재)", null, "institution", "JOSEON_FRONTIER", "L3"),
  actor("ORG_HAMGIL_GAMSA", "함길도 감사(실명 미기재)", null, "institution", "JOSEON_FRONTIER", "L3"),
  actor("ORG_HAMGIL_DOJEOLJESA", "함길도 도절제사(실명 미기재)", null, "institution", "JOSEON_FRONTIER", "L3",
    { identityNote: "pack v1이 직위만 기록한 경우. 이천(평안도 쪽)과 혼동·병합하지 않음." }),
  actor("ORG_HAMGIL_FIELD", "함길도 감사·도절제사 등 도 관아(구분·실명 미기재)", null, "institution", "JOSEON_FRONTIER", "L3"),
  actor("ORG_HOERYEONG_COMMANDER", "회령 진장(실명 미기재)", null, "institution", "JOSEON_FRONTIER", "L4"),
  actor("ORG_GANGGYE_BU", "강계부", "江界府", "institution", "JOSEON_FRONTIER", "L4"),
  actor("ORG_JASEONG_GUN", "자성군", "慈城郡", "institution", "JOSEON_FRONTIER", "L4"),

  /* ---------------- 조선 북방 군·지방 ---------------- */
  actor("JO_CHOEYUNDEOK", "최윤덕", "崔閏德", "person", "JOSEON_FRONTIER", "L3", { ...V }),
  actor("JO_LEECHEON", "이천", "李蕆", "person", "JOSEON_FRONTIER", "L2",
    { ...V, identityNote: "1432-12-11 중앙 화포·방어 논의 참여 → 1436 평안도 방어 위임 → 1437 제2차 파저강 정벌 지휘. 『서정록』 관련 인물." }),
  actor("JO_CHOEHAESAN", "최해산", "崔海山", "person", "JOSEON_FRONTIER", "L2",
    { ...V, identityNote: "1432-12-11 화포 논의(관직 미기재) → 1433 좌군 지휘(L4)." }),
  actor("JO_LEESUNMONG", "이순몽", "李順蒙", "person", "JOSEON_FRONTIER", "L2", { ...V }),
  actor("JO_LEEGAK", "이각", "李恪", "person", "JOSEON_FRONTIER", "L4",
    { ...V, identityNote: "1433 정벌 지휘관(pack), 1435 평안도 도절제사(v2). 동일인 연결은 v2 근거.", identityCertainty: "medium" }),
  actor("JO_LEEJINGSEOK", "이징석", "李澄石", "person", "JOSEON_FRONTIER", "L4", { ...V }),
  actor("JO_LEEJINGOK", "이징옥", "李澄玉", "person", "JOSEON_FRONTIER", "L4", { ...V }),
  actor("JO_KIMHYOSEONG", "김효성", "金孝誠", "person", "JOSEON_FRONTIER", "L4", { ...V }),
  actor("JO_HONGSASEOK", "홍사석", "洪師錫", "person", "JOSEON_FRONTIER", "L2",
    { ...V, identityNote: "1432 조사관 → 1433 정벌 지휘관 → 1437 이천 본군 수행. 같은 이름·한자로 동일인 처리(pack 인명록 단일 항목).", identityCertainty: "medium" }),
  actor("JO_PARKCHO", "박초", "朴礎", "person", "JOSEON_FRONTIER", "L4", { ...V }),
  actor("JO_PARKHOMUN", "박호문", "朴好問", "person", "JOSEON_FRONTIER", "L4", { ...V, identityNote: "1433-05-07 최윤덕 보고 전달자." }),
  actor("JO_CHOECHIUN", "최치운", "崔致雲", "person", "JOSEON_FRONTIER", "L4", { ...V, identityNote: "1433-03-07 최윤덕 계획 전달자." }),
  actor("JO_HAHAN", "하한", "河漢", "person", "JOSEON_FRONTIER", "L4", { ...V }),
  actor("JO_JIHAM", "지함", "池含", "person", "JOSEON_FRONTIER", "L4", { ...V, identityNote: "1433 알목하에 다녀와 복명." }),
  actor("JO_LEEJIN", "이진", "李震", "person", "JOSEON_FRONTIER", "L4", { ...V, possibleSameAs: ["JO_LEEJIN_1437"] }),
  actor("JO_LEEJIN_1437", "이진(1437 이천 본군)", null, "person", "JOSEON_FRONTIER", "L4",
    { possibleSameAs: ["JO_LEEJIN"], identityCertainty: "low",
      identityNote: "1437-09-14 기사에서 이천과 동행. 1435년 이진(李震)과 동일인인지 미확인 — 자동 병합하지 않음." }),
  actor("JO_YEOSEONGRYEOL", "여성렬", "余成烈", "person", "JOSEON_FRONTIER", "L4", { ...V }),
  actor("JO_KIMSUYEON", "김수연", "金壽延", "person", "JOSEON_FRONTIER", "L4", { ...V }),
  actor("JO_KIMYUNSU", "김윤수", "金允壽", "person", "JOSEON_FRONTIER", "L4", { ...V }),
  actor("JO_JANGSAU", "장사우", "張思祐", "person", "JOSEON_FRONTIER", "L4", { ...V }),
  actor("JO_BAECHEOL", "배철", "裵哲", "person", "JOSEON_FRONTIER", "L4", { ...V }),
  actor("JO_LEEHWA", "이화", "李樺", "person", "JOSEON_FRONTIER", "L4", { ...V }),
  actor("JO_JEONGDEOKSEONG", "정덕성", "鄭德成", "person", "JOSEON_FRONTIER", "L4", { ...V }),
  actor("JO_CHOEJEONGAN", "최정안", null, "person", "JOSEON_FRONTIER", "L4",
    { identityNote: "1437-09-22 기사에서 별도 승첩 보고자로 언급(pack v1). 한자·관직 미기재.", identityCertainty: "medium" }),
  actor("JO_HANSEORYONG", "한서룡", "韓瑞龍", "person", "JOSEON_FRONTIER", "L4", { ...V, identityNote: "1443 진보 방비 지휘. 관직 미기재." }),
  actor("JO_BAECHAN", "배찬", "裵禶", "person", "JOSEON_FRONTIER", "L4", { ...V }),
  actor("JO_KIMJAONG", "김자옹", "金自雍", "person", "JOSEON_FRONTIER", "L3", { ...V }),
  actor("JO_ANEULGYEONG", "안을경", "安乙敬", "person", "JOSEON_PEOPLE", "L5",
    { ...V, identityNote: "1433 정벌 사망자로 이름이 남은 사람(pack v1). 군관/군졸 구분 미기재 — level은 잠정." }),

  /* ---------------- 조선 군졸·주민·부역민(무명 집단) ---------------- */
  actor("GRP_1432_YEOYEON_GARRISON", "1432 여연·강계 추격군(전사 13·화살 부상 25)", null, "group", "JOSEON_PEOPLE", "L5"),
  actor("GRP_1432_YEOYEON_RESIDENTS", "1432 여연 피랍·피해 주민", null, "group", "JOSEON_PEOPLE", "L6"),
  actor("GRP_1433_EXPEDITION_TROOPS", "1433 정벌군(평안도 1만·황해도 5천)", null, "group", "JOSEON_PEOPLE", "L5"),
  actor("GRP_1433_WARDEAD", "1433 정벌 전사·병사자와 유가족", null, "group", "JOSEON_PEOPLE", "L5"),
  actor("GRP_1433_BESTOWED_NOBI", "1433-05-16 하사된 노비 39구(출신 미기재)", null, "group", "UNKNOWN", "LU",
    { identityNote: "당대 제도상 사람을 재산으로 하사한 것. 출신(포로 여부 등)은 사료에 기재되지 않아 추정하지 않음." }),
  actor("GRP_1434_JASEONG_GARRISON", "1434 자성군 배치 갑사·군인", null, "group", "JOSEON_PEOPLE", "L5"),
  actor("GRP_1435_YEOYEON_GARRISON", "1435-01 여연성 수비 군사(부상 4·사망 1)", null, "group", "JOSEON_PEOPLE", "L5"),
  actor("GRP_1435_KIMSUYEON_100", "1435-01 김수연 인솔 추격대 100명(v2)", null, "group", "JOSEON_PEOPLE", "L5"),
  actor("GRP_1435_JAN_YEOYEON_VICTIMS", "1435 정월 여연 피살·피랍 주민", null, "group", "JOSEON_PEOPLE", "L6",
    { identityNote: "1435-06-13 기사에서 드러난 '지난 정월' 침입의 피해자. 1435-01-13 여연성 포위와 별개 사건." }),
  actor("GRP_1435_WARDEAD", "1435 여연 전투 전사자와 유가족", null, "group", "JOSEON_PEOPLE", "L5"),
  actor("GRP_1435_NEGLIGENT", "1435 방비 소홀·소극 군사·감독자(실명 미기재)", null, "group", "JOSEON_PEOPLE", "L5"),
  actor("GRP_1435_NORTHERN_SETTLERS", "1435 함길도 북방(길주 이북·회령·경원) 신 입거민", null, "group", "JOSEON_PEOPLE", "L6"),
  actor("GRP_1435_HOERYEONG_400HH", "1435 회령에서 분할된 400호(종성)", null, "group", "JOSEON_PEOPLE", "L6"),
  actor("GRP_1435_GYEONGWON_300HH", "1435 경원에서 분할된 300호(공성)", null, "group", "JOSEON_PEOPLE", "L6"),
  actor("GRP_1435_RESETTLE_AGENTS", "1435 입거 선정 실무 수령·향리·감고·토호(실명 미기재)", null, "group", "JOSEON_FRONTIER", "L4"),
  actor("GRP_1435_MIGRANT_HH", "1435 입거 대상 민호(도피·환귀자 포함)", null, "group", "JOSEON_PEOPLE", "L6"),
  actor("GRP_1436_PROPOSERS", "1436 4품 이상 방어 건의자(실명 미기재)", null, "group", "JOSEON_CENTRAL", "L1"),
  actor("GRP_1436_FIREARM_INSTRUCTORS", "1436 자성·강계 등 화포 교습관", null, "group", "JOSEON_FRONTIER", "L4"),
  actor("GRP_1437_HWANGHAE_VOLUNTEER", "1437 정벌 전사 황해도 자원군 1명", null, "group", "JOSEON_PEOPLE", "L5"),
  actor("GRP_1441_SETTLERS", "1441 남도·경원에서 옮긴 입거민", null, "group", "JOSEON_PEOPLE", "L6"),
  actor("GRP_1443_GARRISONS", "1443 한서룡 휘하 진보 군사", null, "group", "JOSEON_PEOPLE", "L5"),
  actor("GRP_1446_MUCHANG_VICTIMS", "1446 무창 피살 5·피랍 17명", null, "group", "JOSEON_PEOPLE", "L6"),
  actor("GRP_1447_PYEONGAN_LABOR", "1447 평안도 축성 부역민(5,740·400)", null, "group", "JOSEON_PEOPLE", "L6"),
  actor("GRP_1447_HAMGIL_LABOR", "1447 함길도 축성 부역민 8,526", null, "group", "JOSEON_PEOPLE", "L6"),
  actor("GRP_1447_GAPSAN_SAMSU_LABOR", "1447 갑산·삼수 부역민 1,000", null, "group", "JOSEON_PEOPLE", "L6"),
  actor("GRP_1434_INTEL_SOURCE", "1434 범찰 관련 첩보 출처(미상)", null, "group", "UNKNOWN", "LU"),

  /* ---------------- 여진: 건주위(이만주 계열) ---------------- */
  actor("JZ_MANJU", "이만주", "李滿住", "person", "JIANZHOU_WEI", "L7", { ...V, identityNote: "건주위 도지휘(v2). 여진 전체의 지배자로 표현하지 않는다." }),
  actor("JZ_YUEULHAP", "유을합", "劉乙哈", "person", "JIANZHOU_WEI", "L7", { ...V, identityNote: "이만주 관하 천호(pack v1)." }),
  actor("JZ_WANGDABOL", "왕답올", null, "person", "JIANZHOU_WEI", "L7", { identityNote: "1433-12 이만주 사절(v2).", identityCertainty: "medium" }),
  actor("JZ_YUSALDOK", "유살독", null, "person", "JIANZHOU_WEI", "L7", { identityNote: "1433-12 이만주 사절(v2).", identityCertainty: "medium" }),
  actor("JZ_JANGGYOHA", "장교하", null, "person", "JIANZHOU_WEI", "L7", { identityNote: "1434-04 이만주 관하에서 도망(v2).", identityCertainty: "medium" }),
  actor("JZ_YUPOJA", "유포자", null, "person", "JIANZHOU_WEI", "L7", { identityNote: "1434-04 이만주 관하에서 도망(v2).", identityCertainty: "medium" }),
  actor("JZ_WANGANTAN", "왕안탄", null, "person", "JIANZHOU_WEI", "L7", { identityNote: "1434-04 이만주 관하에서 도망(v2).", identityCertainty: "medium" }),

  /* ---------------- 여진: 파저강 기타 / 세력 미특정 ---------------- */
  actor("JZ_IMHALA", "임합라", "林哈剌", "person", "PAJEOGANG_OTHER", "L7", { ...V, identityNote: "이만주와의 상하관계 미확정." }),
  actor("JZ_SIMTANAPNO", "심타납노", null, "person", "PAJEOGANG_OTHER", "L7", { identityNote: "성죄방목의 문죄 대상(v2).", identityCertainty: "medium" }),
  actor("JZ_YEODUN", "여둔(지휘)", null, "person", "JURCHEN_UNSPEC", "L7",
    { identityNote: "1432-12-21 기사의 문서 출처로 기재(pack v1: '여둔 지휘'). 소속·인명 여부 원문 확인 필요.", identityCertainty: "low" }),
  ...[["JZ_YANGMOKDABOL", "양목답올", "楊木答兀"], ["JZ_SALMANDAPSILI", "살만답실리", "撒滿答失里"], ["JZ_ARADAP", "아라답", "阿剌答"],
      ["JZ_DOEULON", "도을온", "都乙溫"], ["JZ_NAEUPDAE", "나읍대", "羅邑大"], ["JZ_MAGI", "마기", "麽氣"], ["JZ_YAOSI", "야오시", "耶吾時"],
      ["JZ_RARATO", "라라토", "剌剌土"], ["JZ_TARONGHAPMAHOL", "타롱합마홀", "打籠哈馬忽"], ["JZ_DANARONGHAP", "단아롱합", "斷兒籠哈"],
      ["JZ_BAEMARAGA", "배마라가", "裵磨剌可"], ["JZ_CHANGGORI", "창고리", "昌古里"], ["JZ_NANGBOKAHAN", "낭복아한", "郞卜兒罕"],
      ["JZ_GEOEULGAGAE", "거을가개", "巨乙加介"], ["JZ_DONGJAEUMPA", "동자음파", "童者音波"]]
    .map(([id, n, h]) => actor(id, n, h, "person", "JURCHEN_UNSPEC", "L7", { ...V, identityNote: "소속 세력은 pack v1에 명시되지 않아 '미특정'으로 둠. 성씨·한글 음역만으로 다른 인물·세력과 병합하지 않음." })),
  actor("GRP_1432_RAIDERS", "1432 여연 침입 야인 기병(약 400기, 주체 미확정)", null, "group", "JURCHEN_UNSPEC", "L7",
    { identityNote: "침입 주체는 사료상 다툼(D01)." }),
  actor("GRP_1435_INFORMANT", "귀화한 파저강 여진인(제보자)", null, "group", "JURCHEN_UNSPEC", "L7"),
  actor("GRP_1437_PAJEOGANG_TARGET", "1437 정벌 대상 거주지·무리(세력 미특정)", null, "group", "JURCHEN_UNSPEC", "L7",
    { identityNote: "pack v1은 '여러 거주지·농장'과 전투를 기록하나 세력·인물을 특정하지 않음." }),
  actor("GRP_1439_GEOEUL_KIN", "거을가개의 자손·관련자", null, "group", "JURCHEN_UNSPEC", "L7"),
  actor("GRP_1446_MUCHANG_RAIDERS", "1446 무창 침입자 50여 명(세력 미특정)", null, "group", "JURCHEN_UNSPEC", "L7"),

  /* ---------------- 여진: 건주좌위 / 오도리 / 우디거 / 홀라온 / 오량합 ---------------- */
  actor("JZ_MENGGETEMUR", "맹가첩목아", "童猛哥帖木兒", "person", "JIANZHOU_LEFT", "L7",
    { ...V, aliases: ["동맹가첩목아"], identityNote: "지리지(pack v1)에 '맹가첩목아 사후' 알목하 일대 재편 서술 — 사망 사실은 확인되나 사망일은 원문 확인 필요." }),
  actor("JZ_FANCHA", "범찰", "凡察", "person", "JIANZHOU_LEFT", "L7", { ...V, identityNote: "이만주 지역으로의 이동(1435)은 부하 편입을 뜻하지 않음." }),
  actor("JZ_DONGCHANG", "동창", "童倉", "person", "JIANZHOU_LEFT", "L7", { ...V }),
  actor("JZ_DONGSOROGAMU", "동소로가무", "童所老加茂", "person", "ODORI", "L7",
    { ...V, identityNote: "1445-10-27 기사(pack v1)가 '남은 오도리'와 함께 거론. 건주좌위와 자동 병합하지 않음." }),
  actor("GRP_HOLLAON", "홀라온 올적합(우디거)", "忽剌溫", "group", "HOLLAON", "L7",
    { identityNote: "1432 이만주 측 주장에서 침입자로 지목. 다른 우디거·오량합과 병합하지 않음." }),
  actor("GRP_ORYANGHAP_1435", "오량합 기병(1435-01 여연성 포위, 약 2,700기)", "兀良哈", "group", "ORYANGHAP", "L7"),
  actor("GRP_1443_UDIGE", "우디거 1,000여 기(1443)", null, "group", "UDIGE", "L7"),
  actor("GRP_GUJU_UDIGE", "구주 우디거", null, "group", "UDIGE", "L7", { identityNote: "1443 동소로가무 합공 제안의 대상(언급만)." }),

  /* ---------------- 명 ---------------- */
  actor("MING_XUANDE", "선덕제", "宣德帝", "person", "MING", "L7"),
  actor("MING_COURT", "명 조정(칙서 발신 주체)", null, "institution", "MING", "L7",
    { identityNote: "1435-02-24 기사(v2)의 발신 주체. 황제 개인으로 특정하지 않음(D03)." }),
  actor("MING_MENGNAL", "맹날가래", "孟捏哥來", "person", "MING", "L7", { ...V }),
  actor("MING_CHOEJIN", "최진", "崔眞", "person", "MING", "L7", { ...V, identityNote: "1433 윤8월 칙서 기사에 등장(pack v1). 역할 미기재." }),
  actor("GRP_1442_MING_INTEL", "명 변경 군사 측 정보원(1442)", null, "group", "MING", "L7")
];

/* ==========================================================================
   PERSON_STATES — 날짜 구간별 관직·level (제도적 위치가 바뀔 때만)
   endDate=null 은 '종료일 미상'.
   ========================================================================== */
const S = (id, personId, startDate, endDate, level, office, sourceIds, certainty = "confirmed", note = "") =>
  ({ id, personId, startDate, endDate, level, office, sourceIds, certainty, note });

export const PERSON_STATES = [
  S("PS_HONG_1", "JO_HONGSASEOK", "1432-12-00", "1433-04-09", "L2", "현장 조사관", ["SRC_1432_1221"], "confirmed",
    "1432-12-21 기사에서 돌아올 조사관으로 언급(pack v1). 파견일 미상."),
  S("PS_HONG_2", "JO_HONGSASEOK", "1433-04-10", "1437-09-06", "L4", "정벌군 분진 지휘(1,110명)", ["SRC_1433_0507"]),
  S("PS_HONG_3", "JO_HONGSASEOK", "1437-09-07", null, "L4", "이천 본군 수행", ["SRC_1437_0914"]),
  S("PS_LSM_1", "JO_LEESUNMONG", "1433-02-26", "1433-04-09", "L2", "지휘체계 논의 참여 무장", ["SRC_1433_0226"]),
  S("PS_LSM_2", "JO_LEESUNMONG", "1433-04-10", null, "L4", "정벌군 분진 지휘(2,515명)", ["SRC_1433_0507"]),
  S("PS_CYD_1", "JO_CHOEYUNDEOK", "1433-02-15", "1433-05-30", "L3", "변경 지휘관·정벌 총지휘(2,599명 직할)", ["SRC_1433_0215", "SRC_1433_0507"]),
  S("PS_CYD_2", "JO_CHOEYUNDEOK", "1435-06-13", "1435-06-13", "L2", "중앙 자문 참여(관직 미확인)", ["SRC_1435_0613"], "interpretation"),
  S("PS_CHS_1", "JO_CHOEHAESAN", "1433-04-10", null, "L4", "정벌군 분진 지휘(2,070명)", ["SRC_1433_0507"]),
  S("PS_LG_1", "JO_LEEGAK", "1433-04-10", "1435-06-12", "L4", "정벌군 분진 지휘(1,770명)", ["SRC_1433_0507"]),
  S("PS_LG_2", "JO_LEEGAK", "1435-06-13", null, "L3", "평안도 도절제사", ["SRC_1435_0613"], "confirmed", "v2 근거. 임명 시점 미상."),
  S("PS_LJS_1", "JO_LEEJINGSEOK", "1433-04-10", null, "L4", "정벌군 분진 지휘(3,010명)", ["SRC_1433_0507"]),
  S("PS_KHS_1", "JO_KIMHYOSEONG", "1433-04-10", null, "L4", "정벌군 분진 지휘(1,888명)", ["SRC_1433_0507"]),
  S("PS_PC_1", "JO_PARKCHO", "1432-12-09", null, "L4", "강계절제사", ["SRC_1432_1209"]),
  S("PS_KYS_1", "JO_KIMYUNSU", "1435-01-13", null, "L4", "여연 수비 지휘(v2: 여연군수)", ["SRC_1435_0118", "SRC_1435_0613"]),
  S("PS_LJ_1", "JO_LEEJIN", "1435-01-13", null, "L4", "도진무 상호군(v2)", ["SRC_1435_0118"]),
  S("PS_CSG_1", "JO_CHOESAGANG", "1435-06-13", null, "L1", "병조판서(v2)", ["SRC_1435_0613"]),
  S("PS_SS_1", "JO_SINSANG", "1434-04-22", null, "L1", "예조판서(v2)", ["SRC_1434_0422"]),
  S("PS_CGM_1", "JO_CHOEGYEONGMYEONG", "1435-06-17", null, "L1", "사헌부 지평(v2)", ["SRC_1435_0617"]),
  S("PS_KJS_1", "JO_KIMJONGSEO", "1438-07-29", "1440-04-07", "L3", "북방 업무 담당(관직명 pack 미기재)", ["SRC_1438_0729", "SRC_1439_0510", "SRC_1440_0117"], "interpretation",
    "1438 '오랜 변경 경험'으로 자문, 1439 현지 여진 정보 직접 수신, 1440 '북방 일을 맡은 뒤' 자기 변론(pack v1). level L3는 해석."),
  S("PS_KJS_2", "JO_KIMJONGSEO", "1448-03-07", null, "L1", "대신 논의 참여(관직명 미기재)", ["SRC_1448_0307"], "interpretation"),
  S("PS_LC_1", "JO_LEECHEON", "1436-06L-19", null, "L3", "평안도 지휘관(서방 방어 위임)", ["SRC_1436_06L19"]),
  S("PS_LH_1", "JO_LEEHWA", "1437-09-07", null, "L4", "이천 휘하 분진 지휘(1,818명)", ["SRC_1437_0914"]),
  S("PS_JDS_1", "JO_JEONGDEOKSEONG", "1437-09-07", null, "L4", "이천 휘하 분진 지휘(1,203명)", ["SRC_1437_0914"]),
  S("PS_BC_1", "JO_BAECHAN", "1446-04-20", null, "L4", "무창 수령", ["SRC_1446_0420"]),
  S("PS_KJO_1", "JO_KIMJAONG", "1446-04-20", null, "L3", "도 단위 군 지휘관(provincial commander)", ["SRC_1446_0420"]),
  S("PS_HB_1", "JO_HWANGBOIN", "1441-01-29", "1447-07-08", "L2", "동북·서북 변경 재편 파견·축성 감독", ["SRC_1441_0129", "SRC_1447_0708"], "interpretation",
    "pack v1의 파견·보고·축성 기록에 근거한 역할 범주. 관직명 미기재."),
  S("PS_MANJU_1", "JZ_MANJU", "1432-12-21", null, "L7", "건주위 도지휘(v2)", ["SRC_1432_1221"]),
  S("PS_YEH_1", "JZ_YUEULHAP", "1432-12-21", null, "L7", "이만주 관하 천호", ["SRC_1432_1221"], "confirmed",
    "소속 관계는 상태로 기록하고, 행위가 아니므로 edge로 만들지 않음.")
];
