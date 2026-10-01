/* ==========================================================================
   4차 감사 검토 메모 — 사람 판정용 '후보'와 '근거 줄'만 담는다. 판정은 담지 않는다.
   - 모든 서술은 pack v1 원문 줄(L번호)과 프로젝트 내부 authority(pack E절 인명록, src/data/people.js)만 근거로 한다.
   - 외부 사료·일반 지식으로 보충하지 않는다. 확인할 수 없는 것은 '사람 확인' 질문으로 남긴다.
   ========================================================================== */

/* 1. R1 18건 — 원문 수신자 후보(세종 개인 / 왕·국왕 / 조선 조정 / 의정부 / 특정 관청 / 불명)와 대안 edge */
export const RECIPIENT_KINDS = ["세종 개인", "왕/국왕", "조선 조정", "의정부", "특정 관청", "불명"];
export const R1_NOTES = {
  "E1432_1209#3": {
    candidates: [["불명", "WHO L37 '[reporting institution/officeholder not named in excerpt]' — 보고자도 수신자도 원문 발췌에 없음"],
      ["조선 조정", "보고가 실록 기사로 수록됐다는 사실만 조정 도달을 보여 줌(수신자 진술은 아님)"]],
    alternatives: ["ORG_PYEONGAN_GAMSA → ORG_JOSEON_COURT (REPORT)", "관계 없이 사건의 informationSources로만 기록"]
  },
  "E1433_0307#1": {
    candidates: [["조선 조정", "원문 토큰 'court'(L223)"],
      ["세종 개인", "같은 항목 L222 '최윤덕 -> 세종 : MILITARY_ADVICE'가 같은 계획의 수신자를 세종으로 씀 — 최치운은 그 계획의 운반자(L216)"]],
    alternatives: ["JO_CHOECHIUN → ORG_JOSEON_COURT (REPORT)"]
  },
  "E1433_0507#1": {
    candidates: [["조선 조정", "원문 토큰 'court'(L293)"],
      ["세종 개인", "같은 항목 L290 '세종 / state'가 세종과 국가를 함께 적음 — 다만 L290은 명령 관계이고 보고 수신자 진술은 아님"]],
    alternatives: ["JO_PARKHOMUN → ORG_JOSEON_COURT (REPORT)"]
  },
  "E1433_08L10#7": {
    candidates: [["특정 관청", "명 쪽: L432 'Ming court received conflicting accounts' — 수신자를 명 조정으로 서술(조선 범주 표를 명에 대응시킨 것)"],
      ["왕/국왕", "명 쪽: WHO L420 선덕제, L442 선덕제가 칙서 주체 — 황제 개인을 수신자로 볼 근거"]],
    alternatives: ["수신자를 '명 조정' 자리표시자로 — 현재 데이터에 해당 노드 없음(새 노드 필요 → 사람 판정 후에만)", "주체 ORG_JOSEON_COURT는 그대로(2차 감사 R1 교정분)"]
  },
  "E1433_08L10#8": {
    candidates: [["특정 관청", "명 쪽: L432 'Ming court received conflicting accounts'"],
      ["왕/국왕", "명 쪽: WHO L420 선덕제(칙서 주체 L442)"]],
    alternatives: ["수신자를 '명 조정' 자리표시자로(새 노드 필요)", "주체 '이만주 side'(SIDE_TO_PERSON) 문제와 함께 판정 — flagged_edges_review.md 참조"]
  },
  "E1434_0803#0": {
    candidates: [["조선 조정", "원문 토큰 'court'(L477). WHAT L471 'Court explicitly noted truth/falsity was uncertain' — 첩보를 평가한 주체를 조정으로 씀"],
      ["세종 개인", "WHAT L474 'Sejong accepted Ahn Sung-seon's proposal' — 최종 결정자는 세종(첩보 수신자 진술은 아님)"]],
    alternatives: ["GRP_1434_INTEL_SOURCE → ORG_JOSEON_COURT (INTELLIGENCE)"]
  },
  "E1435_0408#0": {
    candidates: [["조선 조정", "원문 토큰 'court'(L569)"], ["불명", "이 항목에는 WHO 절이 없고 세종도 등장하지 않음"]],
    alternatives: ["ORG_HAMGIL_DOJEOLJESA → ORG_JOSEON_COURT (REPORT)"]
  },
  "E1436_1101#0": {
    candidates: [["조선 조정", "원문 토큰 'court'(L687) · WHO L680 'central government'"], ["불명", "항목 WHO에 세종이 없음 — 세종 개인을 수신자로 볼 항목 내 근거 없음"]],
    alternatives: ["JO_KIMJONGSEO → ORG_JOSEON_COURT (POLICY)"]
  },
  "E1436_1101#1": {
    candidates: [["조선 조정", "원문 토큰 'court'(L688) · WHO L680 'central government'"], ["불명", "항목 WHO에 세종이 없음"]],
    alternatives: ["JO_JEONGHEUMJI → ORG_JOSEON_COURT (POLICY)"]
  },
  "E1436_1127#3": {
    candidates: [["조선 조정", "원문 토큰 'court'(L716)"], ["세종 개인", "WHO L701 세종 — 같은 기사에서 세종이 이징옥에게 지시(L709)"],
      ["특정 관청", "WHO L705 병조 · WHAT L710 병조의 4군 방어책 시행 — 다만 건의 수신자로 명시되지는 않음"]],
    alternatives: ["JO_KIMJONGSEO → ORG_JOSEON_COURT (POLICY)", "JO_KIMJONGSEO → ORG_BYEONGJO (기존 기관 노드)", "김종서·정흠지 이견(L712)을 서로 사이의 undirected POLICY로 — 새 해석이므로 사람 판정 후에만"]
  },
  "E1436_1127#4": {
    candidates: [["조선 조정", "원문 토큰 'court'(L717)"], ["세종 개인", "WHO L701 세종"], ["특정 관청", "WHO L705 병조(수신자 명시 아님)"]],
    alternatives: ["JO_JEONGHEUMJI → ORG_JOSEON_COURT (POLICY)", "JO_JEONGHEUMJI → ORG_BYEONGJO (기존 기관 노드)"]
  },
  "E1437_0922#4": {
    candidates: [["불명", "WHO L805 '최정안 mentioned as separate victory reporter' — 수신자 미기재"], ["조선 조정", "같은 항목 L821 'field -> court : VICTORY_REPORT'"]],
    alternatives: ["JO_CHOEJEONGAN → ORG_JOSEON_COURT (REPORT)", "관계 없이 informationSources로만 기록"]
  },
  "E1439_0510#2": {
    candidates: [["조선 조정", "원문 토큰 'court'(L878)"],
      ["불명", "DOCUMENT L873 documentType = 치계 — 문서 유형 이름이 수신자를 함축하는지는 pack이 말하지 않음(사람 확인)"]],
    alternatives: ["JO_KIMJONGSEO → ORG_JOSEON_COURT (REPORT)"]
  },
  "E1440_0407#3": {
    candidates: [["조선 조정", "원문 토큰 'central'(L957) · WHO 'provincial observer / central government'"],
      ["특정 관청", "WHO의 'provincial observer'(감사)가 보고 경로에 있는지 수신자인지 원문이 구분하지 않음"]],
    alternatives: ["JO_KIMJONGSEO → ORG_JOSEON_COURT (REPORT)"]
  },
  "E1440_1126#0": {
    candidates: [["조선 조정", "원문 토큰 'court'(L974)"], ["불명", "WHO 절 없음, 세종 미등장"]],
    alternatives: ["ORG_HAMGIL_FIELD → ORG_JOSEON_COURT (FORTIFICATION)"]
  },
  "E1441_0519#0": {
    candidates: [["조선 조정", "원문 토큰 'court'(L1015) · WHAT L1011 'at Hwangbo In's request'(요청 상대 미기재)"], ["불명", "WHO에 황보인만 있음"]],
    alternatives: ["JO_HWANGBOIN → ORG_JOSEON_COURT (FORTIFICATION)"]
  },
  "E1443_1023#0": {
    candidates: [["조선 조정", "원문 토큰 'court'(L1096) · L1089 'Court accepted wall/administrative aspects'"],
      ["의정부", "WHO L1082 의정부"], ["특정 관청", "WHO L1081 예조(사신·외교 담당 관청으로 등장)"],
      ["불명", "항목 WHO에 세종이 없음 — 세종 개인을 수신자로 볼 항목 내 근거 없음"]],
    alternatives: ["JZ_DONGSOROGAMU → ORG_JOSEON_COURT (DIPLOMACY)", "JZ_DONGSOROGAMU → ORG_UIJEONGBU 또는 ORG_YEJO (기존 기관 노드)"]
  },
  "E1447_04L10#0": {
    candidates: [["조선 조정", "원문 토큰 'court'(L1237) · WHO 'central government'"], ["불명", "항목 WHO에 세종이 없음"]],
    alternatives: ["JO_HWANGBOIN → ORG_JOSEON_COURT (REPORT)"]
  }
};

/* 3. 미반영 pack 관계 줄(인물·기관 사이) 9건 — 제외 사유(기록 여부)·기존 규칙으로 표현 가능성 */
export const MISSING_NOTES = {
  "pack_v1:E1433_0215:RELATIONS:L175": {
    relationType: "INVESTIGATION / RESPONSIBILITY_ASSESSMENT", source: "court", target: "Pajŏ groups",
    why: "데이터에 기록된 제외 사유 없음(trace 미작성). 내용은 '파저강 무리의 책임을 따짐' — 행위자 사이 전달이라기보다 판단 대상 지정이라 ABOUT_RELATION과 비슷한 성격",
    rule: "주체 'court' → ORG_JOSEON_COURT(2차 감사 기준) + 대상 무명 집단 → R4 group 자리표시자",
    noNewRule: "가능 — 다만 새 group 노드가 생김. '~에 관한' 성격이면 pathEligible:false 후보",
    hyp: { source: "ORG_JOSEON_COURT", target: "NEW:Pajŏ groups", layer: "POLICY", eventId: "E1433_0215", time: "record" }
  },
  "pack_v1:E1433_0507:RELATIONS:L290": {
    relationType: "COMMAND", source: "세종 / state", target: "최윤덕",
    why: "데이터에 기록된 제외 사유 없음. 같은 항목의 REPORTER L258·L293만 trace로 쓰였음. 세종→최윤덕 COMMAND는 다른 항목(1433-03-25 L246, 1433-02-26 L199 COMMAND_DESIGN)으로 이미 있음",
    rule: "주체가 '세종 / state' 두 표기 병기 — 세종을 고르면 R1류 선택(주체 쪽), state를 고르면 ORG_JOSEON_COURT. 'COMMAND' 라벨 → COMMAND layer",
    noNewRule: "가능 — 주체 선택만 사람이 정하면 기존 R1/자리표시자 기준으로 표현됨. 원문 줄 그대로 '세종'을 쓰면 DIRECT 기준에 가까움",
    hyp: { source: "JO_SEJONG", target: "JO_CHOEYUNDEOK", layer: "COMMAND", eventId: "E1433_0507", time: "variants" },
    highlight: true
  },
  "pack_v1:E1433_0507:RELATIONS:L292": {
    relationType: "MILITARY_ACTION", source: "commanders", target: "target settlements",
    why: "데이터에 기록된 제외 사유 없음. 부대↔대상 대응은 legacy E1433_0419#0~2(v2)에만 있고 pack은 이 한 줄로 묶어 씀",
    rule: "R3(commanders → MAJOR COMMANDERS 명단 L261-267) + R4 PLACE_AS_TARGET(대상 거주지 → 무명 피해 집단)",
    noNewRule: "가능 — 다만 대상이 지명(PLACES L275-282)이라 새 group 노드가 생김. 부대별 대상 대응은 pack에 없음(legacy 승격 금지)",
    hyp: { sources: ["JO_CHOEYUNDEOK", "JO_LEESUNMONG", "JO_CHOEHAESAN", "JO_LEEGAK", "JO_LEEJINGSEOK", "JO_KIMHYOSEONG", "JO_HONGSASEOK"], target: "NEW:target settlements", layer: "MILITARY_CONFLICT", eventId: "E1433_0419", time: "event" }
  },
  "pack_v1:E1434_1024:RELATIONS:L503": {
    relationType: "BORDER_ADMIN_POLICY", source: "field officials", target: "court",
    why: "'field officials'가 WHO의 누구인지 원문이 말하지 않아 실명 4명(함길도 감사·성달생·심도원·이징옥)에게 준 관계는 INTERPRETATION(E1434_1024#0~3)으로만 있음 — 기본 분석 제외",
    rule: "R4(무명 '현지 관원' 집단 자리표시자) + R1(court → 세종) 또는 수신자 ORG_JOSEON_COURT",
    noNewRule: "가능(R4+R1) — 새 group 노드 1개. 실명 전개(R3)는 구성원 근거가 없어 불가",
    hyp: { source: "NEW:field officials", target: "JO_SEJONG", layer: "BORDER_ADMINISTRATION", eventId: "E1434_1024", time: "record" }
  },
  "pack_v1:E1435_0312:RELATIONS:L553": {
    relationType: "RELIEF", source: "provincial government", target: "settlers",
    why: "2차 감사에서 'provincial government'를 지명으로 함길도 관아로 특정한 것이 R1~R7 밖의 추론이라 INTERPRETATION(E1435_0312#0)으로 내림",
    rule: "R4(무명 주체·대상 자리표시자) — 어느 도의 관아인지 특정하지 않으면 기존 규칙으로 표현 가능",
    noNewRule: "가능 — 다만 사건 dateBasis가 before_record_date라 CERTAIN_ORDER 기본 지표에는 어차피 들어가지 않음",
    hyp: { source: "NEW:provincial government", target: "GRP_1435_NORTHERN_SETTLERS", layer: "WELFARE", eventId: "E1435_0312", time: "event" }
  },
  "pack_v1:E1436_0619:RELATIONS:L668": {
    relationType: "expected FEEDBACK", source: "이천", target: "세종",
    why: "'expected' — 세종이 요청한 피드백(WHAT L659-660 'asked him to evaluate proposals and submit better plans')이지 실제 보고가 있었다는 진술이 아님",
    rule: "해당 규칙 없음 — 기존 R1~R7은 '예정·기대된 관계'를 다루지 않음",
    noNewRule: "관계 발생으로 넣으면 원문에 없는 사건을 만드는 것. 요청 자체는 이미 '세종 -> 이천 : POLICY_TRANSFER / COMMAND'(L667)로 있음",
    hyp: { source: "JO_LEECHEON", target: "JO_SEJONG", layer: "POLICY", eventId: "E1436_06L19", time: "record" }
  },
  "pack_v1:E1440_0407:RELATIONS:L955": {
    relationType: "FEAR", source: "rumor", target: "Dongchang/Fancha group",
    why: "주체 'rumor'(소문)가 행위자가 아님 — 행위자 사이 관계 모델에 맞지 않음",
    rule: "해당 규칙 없음(비행위자 주체)",
    noNewRule: "관계로는 불가. 사건 속성(원인 서술)으로 두는 것이 기존 스키마 안의 방법",
    hyp: { source: "NEW:rumor", target: "JZ_DONGCHANG", layer: "DIPLOMACY", eventId: "E1440_0407", time: "event" }
  },
  "pack_v1:E1446_0420:RELATIONS:L1185": {
    relationType: "ACCOUNTABILITY", source: "record", target: "배찬/김자옹",
    why: "주체 'record'는 실록 서술(편찬자의 책임 귀속, WHAT 'Sillok explicitly attributes failure…')이지 행위자가 아님. 이 항목은 pack에 'CAUSAL STATUS: explicit'(L1187-1188)가 붙은 유일한 항목",
    rule: "해당 규칙 없음(비행위자 주체)",
    noNewRule: "관계로는 불가. 사건 속성(책임 귀속 서술)으로 두는 것이 기존 스키마 안의 방법",
    hyp: { source: "NEW:record", target: "JO_BAECHAN", layer: "COMMAND", eventId: "E1446_0420", time: "event" }
  },
  "pack_v1:E1447_LUNAR4_10:RELATIONS:L1238": {
    relationType: "RESOURCE_ALLOCATION / ADMIN_REFORM", source: "state", target: "settlers/soldiers/local offices",
    why: "데이터에 기록된 제외 사유 없음. 대상 셋 모두 무명 집단",
    rule: "주체 'state' → ORG_JOSEON_COURT + 대상 R4 group 자리표시자 3개",
    noNewRule: "가능 — 새 group 노드 3개. 대상이 모두 새 노드라 다른 노드 사이 경로는 생기지 않음",
    hyp: { source: "ORG_JOSEON_COURT", targets: ["NEW:settlers", "NEW:soldiers", "NEW:local offices"], layer: "BORDER_ADMINISTRATION", eventId: "E1447_04L10", time: "record" }
  }
};

/* 4·5. 동일성 수동 검토 — 항목별 활동 지역·직책 연속성·자연스러운 점(pack·내부 authority만) */
export const IDENTITY_REVIEW = {
  JO_CHOEYUNDEOK: {
    authority: "pack E절 인명록(L1409) 'JOSEON MILITARY / FRONTIER' 아래 최윤덕 崔閏德 한 항목 — 인명록은 같은 이름을 한 사람으로 나열하지만 등장마다 같은 사람이라는 진술은 아님. 한자는 pack 표기 崔閏德(v2의 崔潤德은 교정됨, people_authority.md).",
    entries: {
      E1432_1211: { place: "royal court / central government(WHERE L82-83, THEATER CENTRAL)", office: "직책 미기재", same: "한자 崔閏德이 붙은 유일한 등장(L73) — 인명록 표기와 일치", diff: "중앙 협의 자리이며 직책이 없음. 이후 '변경 지휘관'(1433-02-15)과 잇는 진술 없음" },
      E1433_0215: { place: "중앙(비밀 의견 수렴 — 세종·황희·권진·허조)", office: "'frontier commander'로 언급(L162)", same: "두 달 뒤 정벌 총지휘와 역할이 이어짐", diff: "'언급'만 — 본인이 이 자리에 있었다는 진술 아님" },
      E1433_0226: { place: "중앙(정벌 편성 논의)", office: "중군 지휘 후보(L195 'central-army commander')", same: "정벌 지휘권 논의의 당사자 → 03-07 작전 계획·05-07 보고로 이어짐", diff: "—" },
      E1433_0307: { place: "현장 → 중앙(최치운 편에 계획 전달, L216)", office: "직책 미기재(작전 계획 제출자)", same: "2/26 지휘권 논의 직후 작전 계획 제출 — 같은 정벌 준비", diff: "본문은 성 'Choe'만 씀(제목 L206에서 실명)" },
      E1433_0325: { place: "미기재(비밀 지시 수신)", office: "세종 지시의 수신자(L246)", same: "정벌 직전 표적 지시 — 정벌 지휘자에게 내린 지시로 읽힘", diff: "—" },
      E1433_0507: { place: "강계 등 정벌 대상지(PLACES L274-282)", office: "정벌 총지휘(직할 2,599명 L261, 보고자 L258)", same: "2~3월 준비와 직접 이어지는 정벌 수행·보고", diff: "—" },
      E1433_0516_A: { place: "중앙(포상)", office: "포상 대상(WHO L303)", same: "정벌 직후 포상 — 5/7 지휘관 명단과 일치", diff: "제수 대상 판정은 5/7 명단 교차 참조(CROSS_ENTRY_MEMBERSHIP)" },
      E1433_0516_B: { place: "중앙(하사)", office: "노비 10구 하사(L337) — 명단 최상위", same: "같은 날 포상과 같은 명단", diff: "—" },
      E1434_0803: { place: "회령·영북진 논의(WHERE L463-467), 발언 위치 미기재", office: "직책 미기재(건의자 L473)", same: "변경 지휘 경험과 맞는 인사 건의(경험 있는 이징옥 이동)", diff: "1434년 직책·위치가 없어 중앙 건의인지 현지 건의인지 알 수 없음" },
      E1437_0820: { place: "건의가 함길도 지휘부로 전달(TITLE L743)", office: "직책 미기재(방비 건의자)", same: "'previous Gangye experience'(L755)와 pack 설명 'veteran frontier knowledge'(L756) — pack 서술이 1432~33 강계 쪽 경험과의 연속성을 시사", diff: "'previous Gangye experience'가 본인 경험인지 문장만으로 확정 어려움" }
    }
  },
  JO_HWANGBOIN: {
    authority: "pack E절 인명록(L1400) 'JOSEON CENTRAL / POLICY' 아래 황보인 皇甫仁 한 항목 — 인명록 분류는 중앙·정책. pack 본문 어디에도 한자 표기는 없고 인명록에만 있음.",
    entries: {
      E1441_0129: { place: "동북 변경(종성·회령·온성·경원, WHAT L990-995)", office: "직책 미기재(중앙 파견 — L997 'central government -> 황보인 : INSPECTION / COMMAND')", same: "인명록 분류(중앙)와 '중앙에서 파견'이 맞음", diff: "파견 당시 직책 없음" },
      E1441_0519: { place: "경원 쪽 건원보→아산(WHAT L1011-1012)", office: "요청자(L1011)", same: "1월 동북 재편 직후 같은 지역 진보 이설 요청", diff: "—" },
      E1445_0519: { place: "미기재(수군 진·망대 — 해안)", office: "제안자(L1111)", same: "변경·방어 시설 제안이라는 분야가 이어짐", diff: "해안 수군 진·망대는 1441 동북 내륙 재편과 다른 영역 — 같은 사람이라는 진술 없음" },
      E1445_1027: { place: "미기재", office: "언급만(WHO L1151 'mentioned')", same: "—", diff: "역할 미기재 — 동일성 판단 근거로 쓰기 어려움" },
      E1447_0107: { place: "평안도(WHO 'Pyeongan labor population')", office: "축성 책임자(RELATIONS L1210)", same: "축성 분야 연속", diff: "1441 동북(함길도) → 1447 평안도(서북)로 지역 이동" },
      E1447_LUNAR4_10: { place: "서북·동북 통합(TITLE L1215)", office: "보고자(L1237)", same: "1월 평안도·7월 함길도 축성 사이에 '서북·동북 통합 재편' 보고 — 두 지역 활동을 한 사람이 잇는다는 pack 제목 서술", diff: "—" },
      E1447_0708: { place: "회령·삼수(함길도, WHAT)", office: "축성 책임자(RELATIONS L1258)", same: "윤4월 통합 재편 보고와 이어짐", diff: "—" },
      E1448_0307: { place: "중앙(대신 논의)", office: "직책 미기재(대신 논의 참여, WHO L1270)", same: "인명록 분류(중앙·정책)와 맞음. 장성 vs 읍성 논의 주제가 1441~47 축성 활동과 이어짐", diff: "변경 실무(1441~47)에서 대신 논의(1448)로 역할 범주가 바뀜 — 같은 사람의 경력 변화라는 진술 없음" }
    }
  }
};

/* 6. EXPLICIT_CAUSAL 10건 수동 검토 메모 */
export const CAUSAL_REVIEW = {
  "pack_v1:E1433_0516_B:TITLE:L332": {
    bodyCausal: "없음 — 본문(WHO / WHAT L337-342)은 사람별 노비 수만, RELATIONS L349는 'state -> commanders : REWARD'. '정벌 포상'이라는 성격은 제목(L332)에만 있음",
    sequence: "5/7 정벌 보고 → 5/16 하사의 시간 선후는 분명함",
    command: "국가 → 지휘관 하사 — 명령 관계가 아니라 수여(REWARD) 관계",
    titleAdded: "그렇다 — 이유(정벌 포상)는 pack 제목에서만 나옴. pack 제목이 원문 기사 제목인지 검증자 요약인지 pack은 구분하지 않음(사람 확인)"
  },
  "pack_v1:E1433_0517:TITLE:L354": {
    bodyCausal: "부분적 — 본문 WHAT L366 'For those killed:'·L372 'For those who died from illness:'·L377 'For loss of horse:'는 지급 대상 기준. '정벌 때문에'라는 진술은 제목 L354 'campaign dead and sick'에만 있음",
    sequence: "정벌(4월) → 5/17 구휼의 선후는 분명함",
    command: "명령 관계 아님(국가 → 사망자·유가족 구휼)",
    titleAdded: "부분적 — '정벌' 연결은 제목. 또 링크 대상이 4/19 공격 사건 하나인데 병사자(L372)는 공격 사건의 결과가 아닐 수 있음"
  },
  "pack_v1:E1443_0914_1005:WHAT:L1061": {
    bodyCausal: "약함 — L1061 'Court judged both informants' contributions major.'(기여 평가)와 RELATIONS L1067 'state -> informants : REWARD'가 나란히 있을 뿐 '그래서 포상'이라는 연결 표현 없음",
    sequence: "제보(9/14·습격일) → 방어 성공 → 기여 평가 → 포상의 서술 순서는 있음",
    command: "명령 관계 아님",
    titleAdded: "아니다 — 근거는 본문 줄. 다만 인과 연결은 두 줄을 이어 읽은 것"
  }
};
