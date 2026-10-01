/* ==========================================================================
   PEOPLE — 행위자 authority table (개인·무명 집단·기관)
   - firstSeen / lastSeen / sourceIds 는 EVENTS에서 자동 계산한다(model/indexes.js).
     손으로 중복 관리하지 않기 위해 여기에는 적지 않는다.
   - 실명이 없는 군졸·전사자·주민은 개인을 창작하지 않고 entityType "group"으로 둔다.
   - 기사 주어가 기관(병조 등)뿐이면 개인에게 귀속하지 않고 entityType "institution"으로 둔다.
   - hanja: 편집자가 높은 확신을 가진 경우에만 기입하고, hanjaVerified=false 로 원문 미대조를 표시.
     확신이 없으면 null.
   - defaultLevel: PERSON_STATES가 해당 날짜를 덮지 않을 때 쓰는 기본 level.
   ========================================================================== */

function actor(personId, canonicalName, hanja, entityType, affiliation, defaultLevel, extra = {}) {
  return {
    personId, canonicalName, hanja, aliases: [], entityType, affiliation, defaultLevel,
    identityNote: "", identityCertainty: entityType === "person" ? "high" : "n/a",
    hanjaVerified: false, ...extra
  };
}

export const PEOPLE = [
  /* ---------------- 조선 왕·중앙 ---------------- */
  actor("JO_SEJONG", "세종", "世宗", "person", "JOSEON_CENTRAL", "L0"),
  actor("JO_HWANGHUI", "황희", "黃喜", "person", "JOSEON_CENTRAL", "L1"),
  actor("JO_MAENGSASEONG", "맹사성", "孟思誠", "person", "JOSEON_CENTRAL", "L1"),
  actor("JO_GWONJIN", "권진", "權軫", "person", "JOSEON_CENTRAL", "L1"),
  actor("JO_HEOJO", "허조", "許稠", "person", "JOSEON_CENTRAL", "L1"),
  actor("JO_ANSUN", "안순", "安純", "person", "JOSEON_CENTRAL", "L1"),
  actor("JO_JEONGHEUMJI", "정흠지", "鄭欽之", "person", "JOSEON_CENTRAL", "L1"),
  actor("JO_CHOESAGANG", "최사강", "崔士康", "person", "JOSEON_CENTRAL", "L1"),
  actor("JO_ANSUNGSEON", "안숭선", "安崇善", "person", "JOSEON_CENTRAL", "L1"),
  actor("JO_KIMCHEONG", "김청", null, "person", "JOSEON_CENTRAL", "L1",
    { identityNote: "성죄방목 작성 실무자. 한자·관직 원문 확인 필요. 동명이인 검토 미완.", identityCertainty: "medium" }),
  actor("JO_KIMJONGSEO", "김종서", "金宗瑞", "person", "JOSEON_CENTRAL", "L1",
    { identityNote: "1432년 기사에서는 중앙 관료로 등장. 1438~1439 seed 기사에서는 북방 보고자로 등장(관직명 원문 미확인)." }),
  actor("JO_CHOEGYEONGMYEONG", "최경명", null, "person", "JOSEON_CENTRAL", "L1",
    { identityNote: "사헌부 지평. 한자 원문 확인 필요.", identityCertainty: "medium" }),
  actor("JO_NOHAN", "노한", "盧閈", "person", "JOSEON_CENTRAL", "L1"),
  actor("JO_SINSANG", "신상", "申商", "person", "JOSEON_CENTRAL", "L1"),
  actor("JO_LEESUKCHI", "이숙치", null, "person", "JOSEON_CENTRAL", "L1",
    { identityNote: "한자 원문 확인 필요.", identityCertainty: "medium" }),
  actor("JO_JIHAM", "지함", null, "person", "JOSEON_CENTRAL", "L1",
    { identityNote: "1433-06 맹가첩목아의 진술을 들은 조선 사신(v2 요약). 관직·한자 원문 확인 필요.", identityCertainty: "medium" }),

  /* ---------------- 조선 기관(기사 주어가 기관인 경우) ---------------- */
  actor("ORG_JOSEON_COURT", "조선 조정(주체 미특정)", null, "institution", "JOSEON_CENTRAL", "L1",
    { identityNote: "기사에 결정 주체·수신자 개인이 특정되지 않을 때만 사용하는 자리표시자. 개인으로 해석하지 말 것." }),
  actor("ORG_BYEONGJO", "병조", "兵曹", "institution", "JOSEON_CENTRAL", "L1",
    { identityNote: "기사 주어가 '병조'로만 기록된 행위. 당시 판서 개인에게 자동 귀속하지 않음." }),
  actor("ORG_YEJO", "예조", "禮曹", "institution", "JOSEON_CENTRAL", "L1"),
  actor("ORG_GANGGYE_BU", "강계부", "江界府", "institution", "JOSEON_FRONTIER", "L4",
    { identityNote: "이만주 문서의 수신 관아. 부사 개인은 기사에 특정되지 않음." }),
  actor("ORG_JASEONG_GUN", "자성군", "慈城郡", "institution", "JOSEON_FRONTIER", "L4"),

  /* ---------------- 조선 북방 군·지방 ---------------- */
  actor("JO_CHOEYUNDEOK", "최윤덕", "崔潤德", "person", "JOSEON_FRONTIER", "L3"),
  actor("JO_PARKCHO", "박초", null, "person", "JOSEON_FRONTIER", "L4",
    { identityNote: "강계절제사. 한자·동명이인 원문 확인 필요.", identityCertainty: "medium" }),
  actor("JO_HONGSASEOK", "홍사석", null, "person", "JOSEON_FRONTIER", "L2",
    { identityNote: "1432-12 현장 조사 파견, 1433-04 정벌군 조전절제사. 한자 원문 확인 필요.", identityCertainty: "medium" }),
  actor("JO_LEESUNMONG", "이순몽", "李順蒙", "person", "JOSEON_FRONTIER", "L2"),
  actor("JO_CHOEHAESAN", "최해산", "崔海山", "person", "JOSEON_FRONTIER", "L4"),
  actor("JO_LEEGAK", "이각", "李恪", "person", "JOSEON_FRONTIER", "L4",
    { identityNote: "1433 우군절제사, 1435 평안도 도절제사로 기록(v2). 동명이인 존재 가능 — 원문 관직으로 동일인 확인 필요.", identityCertainty: "medium" }),
  actor("JO_LEEJINGSEOK", "이징석", "李澄石", "person", "JOSEON_FRONTIER", "L4"),
  actor("JO_KIMHYOSEONG", "김효성", null, "person", "JOSEON_FRONTIER", "L4",
    { identityNote: "한자 원문 확인 필요.", identityCertainty: "medium" }),
  actor("JO_KIMYUNSU", "김윤수", null, "person", "JOSEON_FRONTIER", "L4",
    { identityNote: "여연군수. 한자·동명이인 원문 확인 필요.", identityCertainty: "medium" }),
  actor("JO_LEEJIN", "이진", null, "person", "JOSEON_FRONTIER", "L4",
    { identityNote: "도진무 상호군. 흔한 이름이므로 동명이인 검토 필수.", identityCertainty: "low" }),
  actor("JO_YEOSEONGRYEOL", "여성렬", null, "person", "JOSEON_FRONTIER", "L4",
    { identityNote: "수군첨절제사. 한자 원문 확인 필요.", identityCertainty: "medium" }),
  actor("JO_KIMSUYEON", "김수연", null, "person", "JOSEON_FRONTIER", "L4",
    { identityNote: "군관. 동명이인 검토 필요.", identityCertainty: "medium" }),
  actor("JO_JANGSAU", "장사우", null, "person", "JOSEON_FRONTIER", "L4",
    { identityNote: "진무.", identityCertainty: "medium" }),
  actor("JO_BAECHEOL", "배철", null, "person", "JOSEON_FRONTIER", "L4",
    { identityNote: "사정(司正).", identityCertainty: "medium" }),
  actor("JO_LEECHEON", "이천", "李蕆", "person", "JOSEON_FRONTIER", "L3",
    { identityNote: "1437 제2차 파저강 정벌 지휘(사용자 제시 anchor). 관직명은 원문 미확인. 『서정록』 관련 인물." }),

  /* ---------------- 조선 군졸·주민·피해자(무명 집단) ---------------- */
  actor("GRP_1432_YEOYEON_GARRISON", "1432 여연·강계 추격군(전사 13·부상 25)", null, "group", "JOSEON_PEOPLE", "L5"),
  actor("GRP_1432_YEOYEON_RESIDENTS", "1432 여연 피랍·피해 주민", null, "group", "JOSEON_PEOPLE", "L6"),
  actor("GRP_1433_EXPEDITION_TROOPS", "1433 정벌군 군졸(평안도 1만·황해도 5천)", null, "group", "JOSEON_PEOPLE", "L5"),
  actor("GRP_1433_WARDEAD", "1433 파저강 정벌 전사·병사자와 유가족", null, "group", "JOSEON_PEOPLE", "L5"),
  actor("GRP_1434_JASEONG_GARRISON", "1434 자성군 배치 갑사·군인", null, "group", "JOSEON_PEOPLE", "L5"),
  actor("GRP_1435_YEOYEON_GARRISON", "1435-01 여연성 수비 군졸", null, "group", "JOSEON_PEOPLE", "L5"),
  actor("GRP_1435_KIMSUYEON_100", "1435-01 김수연 인솔 추격대 100명", null, "group", "JOSEON_PEOPLE", "L5"),
  actor("GRP_1435_JAN_YEOYEON_VICTIMS", "1435 정월 여연 피살·피랍 주민", null, "group", "JOSEON_PEOPLE", "L6",
    { identityNote: "1435-06-13 기사에서 드러난 '지난 정월' 침입의 피해자. 1435-01-13 여연성 포위와 별개 사건." }),
  actor("GRP_1435_WARDEAD", "1435 여연 침입 관련 전사자", null, "group", "JOSEON_PEOPLE", "L5",
    { identityNote: "1435-09-18 증직·부의 대상. 어느 침입의 전사자인지 원문 재확인 필요." }),

  /* ---------------- 여진: 건주위(이만주 계열) ---------------- */
  actor("JZ_MANJU", "이만주", "李滿住", "person", "JIANZHOU_WEI", "L7",
    { identityNote: "건주위 도지휘. 여진 전체의 지배자로 표현하지 않는다." }),
  actor("JZ_YUEULHAP", "유을합", null, "person", "JIANZHOU_WEI", "L7",
    { identityNote: "v2 요약상 '이만주의 관하 천호'. 음역 표기 원문 대조 필요.", identityCertainty: "medium" }),
  actor("JZ_WANGDABOL", "왕답올", null, "person", "JIANZHOU_WEI", "L7",
    { identityNote: "1433-12 이만주 사절 14명 중 한 사람(v2 요약).", identityCertainty: "medium" }),
  actor("JZ_YUSALDOK", "유살독", null, "person", "JIANZHOU_WEI", "L7",
    { identityNote: "1433-12 이만주 사절 14명 중 한 사람(v2 요약).", identityCertainty: "medium" }),
  actor("JZ_JANGGYOHA", "장교하", null, "person", "JIANZHOU_WEI", "L7",
    { identityNote: "1434-04 이만주 관하에서 조선으로 도망(v2 요약).", identityCertainty: "medium" }),
  actor("JZ_YUPOJA", "유포자", null, "person", "JIANZHOU_WEI", "L7",
    { identityNote: "1434-04 이만주 관하에서 조선으로 도망(v2 요약).", identityCertainty: "medium" }),
  actor("JZ_WANGANTAN", "왕안탄", null, "person", "JIANZHOU_WEI", "L7",
    { identityNote: "1434-04 이만주 관하에서 조선으로 도망(v2 요약).", identityCertainty: "medium" }),

  /* ---------------- 여진: 파저강 기타 세력(이만주의 부하로 그리지 않음) ---------------- */
  actor("JZ_IMHALA", "임합라", null, "person", "PAJEOGANG_OTHER", "L7",
    { identityNote: "실록이 '정적(正賊)'으로 지목(v2 요약). 이만주와의 상하관계 미확정.", identityCertainty: "medium" }),
  actor("JZ_SIMTANAPNO", "심타납노", null, "person", "PAJEOGANG_OTHER", "L7",
    { identityNote: "성죄방목의 문죄 대상. 이만주와의 관계 불명.", identityCertainty: "medium" }),
  actor("GRP_1432_RAIDERS", "1432 여연 침입 야인 기병(약 400기, 주체 미확정)", null, "group", "JURCHEN_UNSPEC", "L7",
    { identityNote: "침입 주체는 사료상 다툼: 조선은 파저강 세력을, 이만주 측은 홀라온을 지목." }),
  actor("GRP_1435_INFORMANT", "귀화한 파저강 여진인(제보자)", null, "group", "JURCHEN_UNSPEC", "L7",
    { identityNote: "1435-06-13 제보자. 실명 미기재(v2 요약)." }),
  actor("GRP_1437_PAJEOGANG_TARGET", "1437 정벌 대상 파저강 여진(세부 미확인)", null, "group", "JURCHEN_UNSPEC", "L7",
    { identityNote: "사용자 제시 anchor만 있음. 대상 세력·인물은 원문 대조 후 분리할 것." }),

  /* ---------------- 여진: 건주좌위 계열(이만주의 부하로 그리지 않음) ---------------- */
  actor("JZ_MENGGETEMUR", "맹가첩목아", "猛哥帖木兒", "person", "JIANZHOU_LEFT", "L7"),
  actor("JZ_FANCHA", "범찰", "凡察", "person", "JIANZHOU_LEFT", "L7",
    { identityNote: "건주좌위 계열. 1435 이만주 지역으로의 거주 이동은 부하 편입을 의미하지 않음." }),
  actor("JZ_DONGCHANG", "동창", null, "person", "JIANZHOU_LEFT", "L7",
    { identityNote: "1438 김종서 회계(anchor)의 언급 대상. 한자·계보는 원문 확인 전까지 기입하지 않음.", identityCertainty: "medium" }),

  /* ---------------- 여진: 홀라온 / 오량합 (서로 다른 집단) ---------------- */
  actor("GRP_HOLLAON", "홀라온(올적합)", "忽剌溫", "group", "HOLLAON", "L7",
    { identityNote: "v2에서는 오량합과 한 노드로 합쳐져 있었으나 별개 집단이므로 분리함." }),
  actor("GRP_ORYANGHAP_1435", "오량합 기병(1435-01 여연성 포위, 약 2,700기)", "兀良哈", "group", "ORYANGHAP", "L7",
    { identityNote: "1435-01-13 여연성 포위 주체로 실록에 기록(v2 요약). 이만주 지휘로 단정하지 않음." }),

  /* ---------------- 명 ---------------- */
  actor("MING_XUANDE", "선덕제", "宣德帝", "person", "MING", "L7",
    { identityNote: "명 황제. 1433·1434 칙서 발신자." }),
  actor("MING_COURT", "명 조정(칙서 발신 주체)", null, "institution", "MING", "L7",
    { identityNote: "1435-02-24 기사(범찰 이주 허가)의 발신 주체. 기사 게재 시점과 황제 재위 교체 시기가 겹칠 수 있어 개인(황제)으로 특정하지 않음 — discrepancies.md 참조." }),
  actor("MING_MENGNAL", "맹날가래", null, "person", "MING", "L7",
    { identityNote: "명 관리(v2 요약). 음역·원명 원문 확인 필요.", identityCertainty: "low" })
];

/* ==========================================================================
   PERSON_STATES — 날짜 구간별 관직·level.
   사건별 '상태'가 아니라 제도적 위치가 바뀔 때만 기록한다.
   endDate=null 은 '다음 상태 또는 자료 끝까지(종료일 미상)'.
   ========================================================================== */
export const PERSON_STATES = [
  { id: "PS_HONG_1", personId: "JO_HONGSASEOK", startDate: "1432-12-09", endDate: "1433-04-09", level: "L2",
    office: "현장 조사 파견관", sourceIds: ["SRC_1432_1209"], certainty: "confirmed", note: "세종이 강계·여연에 파견." },
  { id: "PS_HONG_2", personId: "JO_HONGSASEOK", startDate: "1433-04-10", endDate: null, level: "L4",
    office: "조전절제사(정벌군)", sourceIds: ["SRC_1433_0507"], certainty: "confirmed", note: "" },
  { id: "PS_LSM_1", personId: "JO_LEESUNMONG", startDate: "1433-02-15", endDate: "1433-04-09", level: "L2",
    office: "무장(삼군도진무 의견 수렴 대상)", sourceIds: ["SRC_1433_0215"], certainty: "interpretation",
    note: "v2 요약에서 의정부·육조·삼군도진무에 의견을 물었고 이순몽이 의견을 냈다고 함. 정확한 관직은 원문 확인 필요." },
  { id: "PS_LSM_2", personId: "JO_LEESUNMONG", startDate: "1433-04-10", endDate: null, level: "L4",
    office: "중군절제사(정벌군)", sourceIds: ["SRC_1433_0507"], certainty: "confirmed", note: "" },
  { id: "PS_CYD_1", personId: "JO_CHOEYUNDEOK", startDate: "1433-02-26", endDate: "1433-05-30", level: "L3",
    office: "평안도 도절제사·정벌 총지휘", sourceIds: ["SRC_1433_0226"], certainty: "confirmed", note: "" },
  { id: "PS_CYD_2", personId: "JO_CHOEYUNDEOK", startDate: "1435-06-13", endDate: "1435-06-13", level: "L2",
    office: "중앙 자문 참여(관직 미확인)", sourceIds: ["SRC_1435_0613"], certainty: "interpretation",
    note: "김윤수 처분 자문에 참여. 이 시점 관직은 원문 확인 필요." },
  { id: "PS_CHS_1", personId: "JO_CHOEHAESAN", startDate: "1433-04-10", endDate: null, level: "L4",
    office: "좌군절제사(정벌군)", sourceIds: ["SRC_1433_0507"], certainty: "confirmed", note: "" },
  { id: "PS_LG_1", personId: "JO_LEEGAK", startDate: "1433-04-10", endDate: "1435-06-12", level: "L4",
    office: "우군절제사(정벌군)", sourceIds: ["SRC_1433_0507"], certainty: "confirmed", note: "" },
  { id: "PS_LG_2", personId: "JO_LEEGAK", startDate: "1435-06-13", endDate: null, level: "L3",
    office: "평안도 도절제사", sourceIds: ["SRC_1435_0613"], certainty: "confirmed",
    note: "임명 시점은 미상. 1435-06-13 기사에 도절제사로 기록." },
  { id: "PS_LJS_1", personId: "JO_LEEJINGSEOK", startDate: "1433-04-10", endDate: null, level: "L4",
    office: "조전절제사(정벌군)", sourceIds: ["SRC_1433_0507"], certainty: "confirmed", note: "" },
  { id: "PS_KHS_1", personId: "JO_KIMHYOSEONG", startDate: "1433-04-10", endDate: null, level: "L4",
    office: "정벌군 지휘관", sourceIds: ["SRC_1433_0507"], certainty: "confirmed", note: "" },
  { id: "PS_PC_1", personId: "JO_PARKCHO", startDate: "1432-12-09", endDate: null, level: "L4",
    office: "강계절제사", sourceIds: ["SRC_1432_1209"], certainty: "confirmed", note: "" },
  { id: "PS_KYS_1", personId: "JO_KIMYUNSU", startDate: "1435-01-13", endDate: null, level: "L4",
    office: "여연군수", sourceIds: ["SRC_1435_0118", "SRC_1435_0613"], certainty: "confirmed",
    note: "1435-06-13 고신 박탈되었으나 현직 유임." },
  { id: "PS_LJ_1", personId: "JO_LEEJIN", startDate: "1435-01-13", endDate: null, level: "L4",
    office: "도진무 상호군", sourceIds: ["SRC_1435_0118"], certainty: "confirmed", note: "" },
  { id: "PS_YSR_1", personId: "JO_YEOSEONGRYEOL", startDate: "1435-01-13", endDate: null, level: "L4",
    office: "수군첨절제사", sourceIds: ["SRC_1435_0118"], certainty: "confirmed", note: "" },
  { id: "PS_CSG_1", personId: "JO_CHOESAGANG", startDate: "1435-06-13", endDate: null, level: "L1",
    office: "병조판서", sourceIds: ["SRC_1435_0613"], certainty: "confirmed", note: "1432~1433의 관직은 원문 확인 필요." },
  { id: "PS_SS_1", personId: "JO_SINSANG", startDate: "1434-04-22", endDate: null, level: "L1",
    office: "예조판서", sourceIds: ["SRC_1434_0422"], certainty: "confirmed", note: "" },
  { id: "PS_CGM_1", personId: "JO_CHOEGYEONGMYEONG", startDate: "1435-06-17", endDate: null, level: "L1",
    office: "사헌부 지평", sourceIds: ["SRC_1435_0617"], certainty: "confirmed", note: "" },
  { id: "PS_KJS_1", personId: "JO_KIMJONGSEO", startDate: "1432-12-21", endDate: "1438-07-28", level: "L1",
    office: "중앙 관료(1432 기사)", sourceIds: ["SRC_1432_1221"], certainty: "interpretation",
    note: "1432-12-21 논의 참여. 관직명과 이후 북방 부임 시점은 원문 확인 필요(검증 대기 목록)." },
  { id: "PS_KJS_2", personId: "JO_KIMJONGSEO", startDate: "1438-07-29", endDate: null, level: "L3",
    office: "북방 보고자(관직명 미확인)", sourceIds: ["SRC_1438_0729"], certainty: "unverified_seed",
    note: "사용자 제시 anchor에서 김종서가 회계·장계·치계를 올린 것으로 설명됨. level L3는 잠정치." },
  { id: "PS_LC_1", personId: "JO_LEECHEON", startDate: "1437-09-22", endDate: null, level: "L3",
    office: "제2차 파저강 정벌 지휘(관직명 미확인)", sourceIds: ["SRC_1437_0922"], certainty: "unverified_seed",
    note: "사용자 제시 anchor." },
  { id: "PS_MANJU_1", personId: "JZ_MANJU", startDate: "1432-12-21", endDate: null, level: "L7",
    office: "건주위 도지휘", sourceIds: ["SRC_1432_1221"], certainty: "confirmed", note: "" },
  { id: "PS_YEH_1", personId: "JZ_YUEULHAP", startDate: "1432-12-21", endDate: null, level: "L7",
    office: "이만주 관하 천호", sourceIds: ["SRC_1432_1221"], certainty: "confirmed",
    note: "소속 관계는 상태로 기록하고, 행위가 아니므로 network edge로 만들지 않음." }
];
