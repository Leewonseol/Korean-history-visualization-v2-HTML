/* ==========================================================================
   3차 감사 검토 메모 — 사람이 판정할 때 참고할 '대안 해석'과 '현재 해석을 유지할 근거'.
   이 파일은 판정(KEEP / DOWNGRADE_TO_INTERPRETATION / SPLIT / REMOVE / NEEDS_SOURCE)을 담지 않는다.
   모든 서술은 pack v1 원문 줄을 근거로 하며, 새 사실·관계를 만들지 않는다.
   ========================================================================== */

/* 1. 검토 표시(flag) 19건 — 관계별 대안·유지 근거 */
export const FLAG_NOTES = {
  "E1432_1209#3": {
    alternatives: ["수신자를 세종이 아니라 ORG_JOSEON_COURT(조정 자리표시자)로 둔다 — WHO L37은 보고 주체만 말하고 수신자를 쓰지 않음",
      "관계로 만들지 않고 사건의 informationSources(정보원)로만 기록한다"],
    keepReasons: ["실록 기사가 '평안도 감사의 보고'를 싣고 있으므로 보고가 조정에 도달했다는 것은 기사 자체가 보여 줌(R1 관례)",
      "같은 사건의 다른 보고 관계(E1433_0507#1 '박호문 -> court')와 표현 방식이 일관됨"]
  },
  "E1432_1211#10": {
    alternatives: ["정흠지의 주장은 협의 자리 안의 발언 — 세종 한 사람이 아니라 협의 참여자 전체를 향함(undirected POLICY 또는 관계 없음)",
      "KEY CONTENT L91의 'and others'처럼 집단 주장이므로 개별 edge 대신 사건 속성으로 둔다"],
    keepReasons: ["같은 항목 RELATIONS에 '이천 -> 세종 : POLICY_ADVICE'(L99)·'최해산 -> 세종'(L101)이 있어, 같은 문장(L91)에 함께 나온 정흠지에게 같은 방향을 준 것",
      "L91이 정흠지를 주장 주체로 실명 명시(R5 입력 패턴)"]
  },
  "E1433_0516A#0": { group: "0516A" }, "E1433_0516A#1": { group: "0516A" }, "E1433_0516A#2": { group: "0516A" },
  "E1433_0516A#3": { group: "0516A" }, "E1433_0516A#4": { group: "0516A" }, "E1433_0516A#5": { group: "0516A" },
  "E1433_0610#0": {
    alternatives: ["원문 그대로 수신자를 '조선' → ORG_JOSEON_COURT로 둔다(지함 대체를 취소)",
      "맹가첩목아의 진술은 지함이 '들은 것'이므로 지함은 수신자가 아니라 전달자 — 진술 관계는 두지 않고 지함→세종 복명(#3)만 남긴다"],
    keepReasons: ["WHAT L399 '지함이 알목하에서 돌아와 맹가첩목아의 진술을 보고' — 진술을 직접 들은 사람이 지함임을 보여 줌",
      "세종에게 직접 항의한 것처럼 그리면 지함이라는 전달 경로가 사라짐"]
  },
  "E1433_0610#1": { group: "ABOUT" }, "E1433_0610#2": { group: "ABOUT" },
  "E1433_08L10#8": {
    alternatives: ["'이만주 side'(이만주 측)는 개인이 아니라 집단 — 이만주 개인 노드 대신 별도 집단 표현이 필요(현재 데이터에 해당 노드 없음 → NEEDS_SOURCE)",
      "관계를 두지 않고 칙서 사건의 주장 내용으로만 기록"],
    keepReasons: ["WHO L428에 이만주가 실명으로 있고 pack이 그 측의 주장을 명시(L444)",
      "pathEligible을 바꾸지 않는 한 이만주→선덕제 주장 경로가 지표에 들어가므로, 유지하려면 '측→개인' 축약을 받아들인다는 판단이 필요"]
  },
  "E1435_0113#0": { group: "PLACE" },
  "E1437_0922#4": {
    alternatives: ["수신자를 ORG_JOSEON_COURT로 — WHO L805는 '별도 승첩 보고자'라고만 하고 수신자를 쓰지 않음",
      "관계 대신 사건의 informationSources로만 기록"],
    keepReasons: ["승첩 보고는 조정에 올리는 문서이며 같은 항목 RELATIONS L821 'field -> court : VICTORY_REPORT'가 수신자를 court로 명시(R1)"]
  },
  "E1446_0420#0": { group: "PLACE" },
  "E1448_0307#6": { group: "1448" }, "E1448_0307#7": { group: "1448" }, "E1448_0307#8": { group: "1448" }, "E1448_0307#9": { group: "1448" }
};
export const FLAG_GROUP_NOTES = {
  "0516A": {
    alternatives: ["0516_A 기사 자체만으로는 WHO 18명 중 누가 'campaign commanders'인지 확정할 수 없음 → NEEDS_SOURCE",
      "WHO 전원(18명)에게 제수 관계를 주는 것은 R3 금지 사례(집합 소속 근거 없음)이므로 대안이 아님 — 대안은 '관계 보류'"],
    keepReasons: ["5/7 보고(E1433_0507)의 지휘관 명단 6명이 모두 5/16 WHO에 실명으로 있음(구성원 근거 2줄씩 trace에 기록)",
      "5/7 명단의 최해산은 5/16 WHO에 없고 데이터에도 제수 관계가 없음 — 명단을 기계적으로 옮기지 않았다는 점은 확인됨"]
  },
  "ABOUT": {
    alternatives: ["'~에 관한' 내용은 관계가 아니라 주장(claim) 텍스트이므로 edge를 없애고 사건 outcome의 주장 내용으로만 둔다(REMOVE)",
      "현재처럼 edge로 두되 pathEligible:false로 경로·중심성에서 제외(현 상태)"],
    keepReasons: ["맹가첩목아가 임합라를 주모자로, 이만주를 만류한 사람으로 지목했다는 것(WHAT L400-401)을 네트워크에서 볼 수 있게 함",
      "경로·중심성 계산에는 이미 들어가지 않음"]
  },
  "PLACE": {
    alternatives: ["공격 대상을 장소(여연 / 무창)로만 기록하고 인물·집단 관계는 두지 않는다",
      "피해 집단과의 관계는 남기되 R4가 아닌 해석으로 표시"],
    keepReasons: ["같은 항목 WHO·WHAT이 피해자·수비자를 기록(1435: WHO L520 unnamed soldiers·WHAT L524 defenders fought / 1446: WHAT L1175-1176 피살 5·피랍 17)",
      "R4 명세의 PLACE_AS_TARGET 하위 패턴(2차 감사에서 명문화) — 다만 명문화 자체가 기존 데이터에 맞춘 것이므로 사람 확인 필요"]
  },
  "1448": {
    alternatives: ["네 사람의 주장은 '논의 자리의 견해 표명' — 세종을 향한 개별 건의가 아니라 undirected POLICY 또는 사건 속성",
      "RELATIONS L1284 'ministers -> 세종 : DEFENSE_ADVICE'를 R3로 펼친 관계로 재분류(현재는 WHAT L1279 기준 R5)"],
    keepReasons: ["RELATIONS L1284가 '대신들 → 세종' 방향을 명시하고 WHAT L1279가 네 사람을 실명으로 명시"]
  }
};

/* 2. 최윤덕·황보인: 항목별 연속성·충돌 메모(pack 원문만 근거) */
export const IDENTITY_ENTRY_NOTES = {
  JO_CHOEYUNDEOK: {
    E1432_1211: { continuity: "WHO L73 한자 崔閏德 명시. 중앙 군사 협의 참여", conflict: "직책 미기재 — 이후 '변경 지휘관'과 같은 사람이라는 진술 없음" },
    E1433_0215: { continuity: "WHO L162 'frontier commander'로 언급", conflict: "1432-12-11 중앙 협의 참여자와의 동일성은 pack이 말하지 않음" },
    E1433_0226: { continuity: "WHAT L194-195 정벌 지휘권 논의의 당사자(중군 지휘)", conflict: "—" },
    E1433_0307: { continuity: "WHO L211 실명. 현장 계획을 최치운 편에 올림", conflict: "WHAT L216의 영문 'Choe'는 제목(L206)으로 최윤덕임을 알 수 있으나 본문은 성만 씀" },
    E1433_0325: { continuity: "세종의 비밀 지시 수신자(RELATIONS L246)", conflict: "—" },
    E1433_0507: { continuity: "보고자(L258), 직할 2,599명(L261), 정벌 지휘(L290-291)", conflict: "RELATIONS L290 '세종 / state -> 최윤덕 : COMMAND'는 데이터에 관계로 들어가 있지 않음(미반영 원문 관계)" },
    E1433_0516_A: { continuity: "포상 WHO L303", conflict: "제수 대상 판정은 5/7 명단 교차 참조(CROSS_ENTRY_MEMBERSHIP)" },
    E1433_0516_B: { continuity: "노비 10구 L337", conflict: "—" },
    E1434_0803: { continuity: "WHO L457. 경험 많은 이징옥을 회령으로 옮기자고 건의(L473)", conflict: "1434년 직책·위치 미기재 — 중앙에서 건의한 것인지 현지에서인지 알 수 없음" },
    E1437_0820: { continuity: "WHO L748. '이전 강계 경험'에 근거한 방비 건의(L754-755) — 1432~33 평안도 쪽 활동과의 연속성을 pack이 암시", conflict: "'previous Gangye experience'는 최윤덕 본인의 경험인지 일반 경험인지 문장만으로 확정 어려움" }
  },
  JO_HWANGBOIN: {
    E1441_0129: { continuity: "동북 진보 재편 파견(TITLE L980, RELATIONS L997)", conflict: "파견 당시 직책 미기재" },
    E1441_0519: { continuity: "건원보 이설 요청자(L1011)", conflict: "—" },
    E1445_0519: { continuity: "수군 진·망대 개편 제안(L1111)", conflict: "1441 동북 재편 인물과의 동일성 진술 없음 — 활동 분야(변경 방비)는 이어짐" },
    E1445_1027: { continuity: "WHO L1151 'mentioned'만", conflict: "역할 미기재(언급만)" },
    E1447_0107: { continuity: "평안도 행성 축조(L1199, RELATIONS L1210 '황보인 -> frontier')", conflict: "RELATIONS L1210은 대상이 '변경(지역)'이라 인물 관계로 미반영" },
    E1447_LUNAR4_10: { continuity: "서북·동북 변경 통합 재편 보고(TITLE L1215)", conflict: "—" },
    E1447_0708: { continuity: "회령·삼수 축성(L1248, RELATIONS L1258)", conflict: "RELATIONS L1258도 대상이 지역이라 미반영" },
    E1448_0307: { continuity: "대신 논의 참여자 WHO L1270", conflict: "변경 실무자(1441~1447)에서 대신 논의(1448)로 역할 범주가 바뀜 — 같은 사람의 경력 변화인지 pack이 말하지 않음" }
  }
};

/* 3. EXPLICIT_CAUSAL 근거 문구별 검토 메모(자동 판정 아님 — 후보 표시만) */
export const CAUSAL_NOTES = {
  "pack_v1:E1433_0516_A:WHAT:L324": {
    trigger: "reward of commanders' merit — 제수의 이유(공로)를 직접 말함",
    notSequence: "'정벌 뒤에 제수했다'(시간)가 아니라 '공로 때문에'(이유)라고 씀",
    candidate: { relation: "STRONG", link: "REVIEW — 공로가 4/19 공격(E1433_0419)에만 해당하는지 4/10 집결·5/7 보고를 포함한 정벌 전체인지 미확정" }
  },
  "pack_v1:E1433_0516_B:TITLE:L332": {
    trigger: "bestowed as campaign rewards — 하사의 성격(정벌 포상)을 말함",
    notSequence: "'정벌 포상으로서' 하사했다는 성격 진술",
    candidate: { relation: "REVIEW — 근거가 pack 제목 줄이며 본문 줄에는 이유 진술이 없음", link: "REVIEW — 같은 이유 + 연결 대상이 공격 사건 하나로 좁혀짐" }
  },
  "pack_v1:E1433_0517:TITLE:L354": {
    trigger: "for campaign dead and sick — 예우·구휼의 대상 범주",
    notSequence: "대상이 '정벌 사망·병사자'라고 씀",
    candidate: { link: "DOWNGRADE_CANDIDATE(UNKNOWN) — 병사(sick)는 4/19 공격 사건의 결과가 아닐 수 있는데 링크는 공격 사건(E1433_0419)에 걸려 있음" }
  },
  "pack_v1:E1433_0517:WHAT:L366": {
    trigger: "For those killed: — 지급 기준(사망)",
    notSequence: "사망을 지급 이유로 명시",
    candidate: { relation: "REVIEW — '사망자에게 준다'는 대상 기준이라 인과라기보다 정의(定義)에 가까움. UNKNOWN으로 내려도 정보 손실이 거의 없음" }
  },
  "pack_v1:E1433_0610:WHAT:L402": {
    trigger: "criticized the campaign — 항의의 대상이 정벌임을 직접 말함",
    notSequence: "정벌 뒤에 왔다는 것이 아니라 정벌을 비판했다는 내용",
    candidate: { relation: "REVIEW — 관계(맹가첩목아→지함 진술)의 인과라기보다 진술 내용의 주제", link: "STRONG" }
  },
  "pack_v1:E1435_0918:WHAT:L635": {
    trigger: "meritorious personnel: one-grade promotion (+ L632-634 개인별 공적)",
    notSequence: "공적을 이유로 승진했다고 씀",
    candidate: { relation: "STRONG" }
  },
  "pack_v1:E1443_0914_1005:WHAT:L1061": {
    trigger: "contributions major — 기여 평가",
    notSequence: "",
    candidate: { relation: "DOWNGRADE_CANDIDATE(UNKNOWN) — '기여가 크다고 판단'과 '포상(L1067)'이 나란히 있을 뿐 '그래서 포상'이라는 연결 표현이 없음" }
  }
};
