/* ==========================================================================
   STORY — 스토리 모드 장면. 장면은 '문장(statement)' 단위로 근거를 가진다.
   statement = { text, eventIds, sourceIds, narrativeStatus, provenance, claims? }
   claim     = { text, eventIds, sourceIds, evidenceClass, claimType, certainty }   (문장 안의 사실·추론·서사를 분리)
     claimType: FACTUAL(사료 서술) / INFERRED(정규화·pack 지침에서 끌어낸 판단) / NARRATIVE(편집자 서사·해석)
     evidenceClass(vocab.EVIDENCE_CLASS): DIRECT / NORMALIZED / LEGACY / INTERPRETATION
   하위호환: claims가 없는 문장은 문장 전체를 claim 1개로 자동 변환(claimsMigrated: true),
   옛 형식 장면({ narration })은 해석 문장 1개로 변환해 기본 화면에서 숨긴다.
     narrativeStatus (vocab.NARRATIVE_STATUS): direct_evidence / normalized_summary / interpretation
     provenance (vocab.PROVENANCE): pack_v1_direct / pack_v1_derived / inherited_v2 / legacy_anchor_seed / interpretation
   - 서술은 해당 EVENTS의 evidenceSummary를 넘어서는 사실을 담지 않는다.
   - legacy(inherited_v2·seed) 문장은 'legacy 포함' 토글이 켜졌을 때만, interpretation 문장은
     '해석 포함' 토글이 켜졌을 때만 보인다(ui/storyMode.js).
   - 초점 노드는 장면 사건들의 참여자에서 자동 계산한다. 주인공을 정하지 않는다.
   ========================================================================== */
const PD = "pack_v1_direct", PV = "pack_v1_derived", L2 = "inherited_v2", INT = "interpretation";
const st = (text, eventIds, sourceIds, narrativeStatus, provenance, claims) => ({ text, eventIds, sourceIds, narrativeStatus, provenance, ...(claims ? { claims } : {}) });
const cl = (text, eventIds, sourceIds, evidenceClass, claimType, certainty = "confirmed") => ({ text, eventIds, sourceIds, evidenceClass, claimType, certainty });
const CLASS_OF_PROV = { pack_v1_direct: "DIRECT", pack_v1_derived: "NORMALIZED", inherited_v2: "LEGACY", legacy_anchor_seed: "LEGACY", interpretation: "INTERPRETATION" };

/** 문장 → claims(하위호환 변환 포함) */
export function claimsOf(statement) {
  if (Array.isArray(statement.claims) && statement.claims.length) return statement.claims;
  const ec = CLASS_OF_PROV[statement.provenance] || "UNKNOWN";
  return [{ text: statement.text, eventIds: statement.eventIds, sourceIds: statement.sourceIds, evidenceClass: ec,
    claimType: statement.narrativeStatus === "interpretation" ? "NARRATIVE" : "FACTUAL",
    certainty: ec === "INTERPRETATION" ? "interpretation" : "confirmed", migrated: true }];
}
/** 장면 하위호환: 옛 { narration } 형식을 해석 문장 1개로 */
export function normalizeScene(sc) {
  if (Array.isArray(sc.statements)) return { ...sc, statements: sc.statements.map((x) => ({ ...x, claims: claimsOf(x), claimsMigrated: !x.claims })) };
  const statements = [{ text: sc.narration || "", eventIds: sc.eventIds || [], sourceIds: [], narrativeStatus: "interpretation",
    provenance: "interpretation", legacyFormat: true }];
  return { ...sc, statements: statements.map((x) => ({ ...x, claims: claimsOf(x), claimsMigrated: true })) };
}
const SUM = "normalized_summary", DIR = "direct_evidence", IN = "interpretation";

function scene(id, title, statements) {
  const eventIds = [...new Set(statements.flatMap((s) => s.eventIds))];
  return { id, title, eventIds, statements };
}

const RAW_SCENES = [
  scene("S01", "1432.12 — 여연 침입과 이틀 뒤의 화포 논의", [
    st("약 400기의 야인이 여연에 들어오고 강계절제사 박초가 추격한다(평안도 감사 보고, 조선 측 13명 사망·25명 부상). 침입·추격 일자는 기사에 없다.",
      ["E1432_1209"], ["SRC_1432_1209"], SUM, PD, [
        cl("약 400기의 야인이 여연에 들어오고 강계절제사 박초가 추격했다(평안도 감사 보고).", ["E1432_1209"], ["SRC_1432_1209"], "DIRECT", "FACTUAL"),
        cl("조선 측 13명 사망·25명 부상 — 조선 측 보고 수치.", ["E1432_1209"], ["SRC_1432_1209"], "DIRECT", "FACTUAL"),
        cl("침입·추격 일자는 기사에 없어 '기사일 이전'으로만 둔다.", ["E1432_1209"], ["SRC_1432_1209"], "NORMALIZED", "INFERRED")]),
    st("이틀 뒤 조정은 화포 교습·철환 공급·석성/목책을 논의한다.", ["E1432_1211"], ["SRC_1432_1211"], SUM, PD),
    st("pack은 이천이 이때 이미 북방 방어 정책 네트워크 안에 있다고 적는다.", ["E1432_1211"], ["SRC_1432_1211"], DIR, PD)
  ]),
  scene("S02", "1432.12 — 엇갈리는 주장, 진위를 따지는 조정", [
    st("유을합이 피로인 7명을 데려오고, 이만주 측은 홀라온 우디거의 소행이라 주장한다(주장 — 점선).",
      ["E1432_1221"], ["SRC_1432_1221"], SUM, PD, [
        cl("유을합이 피로인 7명을 데려왔다.", ["E1432_1221"], ["SRC_1432_1221"], "DIRECT", "FACTUAL"),
        cl("이만주 측이 홀라온 우디거의 소행이라고 주장했다 — 주장이 있었다는 사실이지 주장 내용이 사실이라는 뜻이 아님.", ["E1432_1221"], ["SRC_1432_1221"], "DIRECT", "FACTUAL", "contemporary_claim")]),
    st("조정은 그 주장이 사실인지 날조인지 명시적으로 논쟁하고, 홍사석은 돌아올 조사관으로 언급된다.",
      ["E1432_1221", "E1432_INVEST"], ["SRC_1432_1221"], SUM, PD),
    st("홍사석을 누가 언제 보냈는지는 pack에 없다. 세종의 파견 명령은 v2 데이터에서만 온다.",
      ["E1432_INVEST"], ["SRC_1432_1221"], SUM, L2)
  ]),
  scene("S03", "1433.02~03 — 의견 수렴, 지휘체계, 병력 건의", [
    st("세종의 비밀 질의에 대신들의 의견이 갈린다.", ["E1433_0215"], ["SRC_1433_0215"], SUM, PD),
    st("지휘체계 논의에서 이순몽이 이견을 낸다.", ["E1433_0226"], ["SRC_1433_0226"], SUM, PD),
    st("최윤덕은 최치운을 통해 '3,000명은 부족, 1만 이상'을 건의한다(현장 → 전달자 → 국왕).",
      ["E1433_0307"], ["SRC_1433_0307"], SUM, PD)
  ]),
  scene("S04", "1433.03 — 문죄와 가담 여부에 따른 표적 기준", [
    st("성죄방목으로 공식 죄목이 제기된다(내용은 조선 측 주장, v2 이관 기사).", ["E1433_0310"], ["SRC_1433_0310"], SUM, L2),
    st("세종은 맹가첩목아가 적을 돕는지에 따라 대응을 달리하라고 최윤덕에게 비밀 지시한다.",
      ["E1433_0325"], ["SRC_1433_0325"], SUM, PD)
  ]),
  scene("S05", "1433.04 — 7개 부대, 1만5천 명", [
    st("평안도 1만·황해도 5천이 7개 부대로 나뉜다.", ["E1433_0410"], ["SRC_1433_0507"], SUM, PD),
    st("각 부대가 파저강 일대 거주지를 공격한다. 지휘관별 공격 대상 배정은 v2 데이터에서 온다(D12).",
      ["E1433_0419"], ["SRC_1433_0507"], SUM, L2),
    st("모든 전과·사상 수치는 조선 지휘부 보고다.", ["E1433_0410", "E1433_0419"], ["SRC_1433_0507"], SUM, PD)
  ]),
  scene("S06", "1433.05 — 보고, 포상(노비 하사 포함), 전사자 예우", [
    st("최윤덕의 보고가 박호문을 통해 국왕에게 닿는다.", ["E1433_0507"], ["SRC_1433_0507"], SUM, PD),
    st("지휘관 관직 제수와 노비 하사(사람을 재산으로 준 당대 제도)가 이어진다.",
      ["E1433_0516A", "E1433_0516B"], ["SRC_1433_0516A", "SRC_1433_0516B"], SUM, PD, [
        cl("정벌 지휘관에게 관직 제수와 노비 하사가 이어졌다.", ["E1433_0516A", "E1433_0516B"], ["SRC_1433_0516A", "SRC_1433_0516B"], "NORMALIZED", "FACTUAL"),
        cl("노비 하사는 사람을 재산으로 준 당대 제도였다(편집자 맥락 설명).", ["E1433_0516B"], ["SRC_1433_0516B"], "INTERPRETATION", "NARRATIVE", "interpretation")]),
    st("전사·병사자 치제와 구휼·복호가 이어진다.", ["E1433_0517"], ["SRC_1433_0517"], SUM, PD)
  ]),
  scene("S07", "1433 하반기 — 반박과 명의 칙서", [
    st("지함이 알목하에서 맹가첩목아의 비판(무고한 자와 죄인을 가리지 않았다)과 친족 송환 요청을 전한다.",
      ["E1433_0610"], ["SRC_1433_0610"], SUM, PD),
    st("명 칙서는 진위를 가릴 수 없다며 당사자들에게 반환과 침범 금지를 명령한다 — 조선 유죄 판정이 아니다.",
      ["E1433_08L10"], ["SRC_1433_08L10"], SUM, PD, [
        cl("명 칙서는 진위를 분명히 가릴 수 없다고 하고 당사자들에게 반환과 침범 금지를 명령했다.", ["E1433_08L10"], ["SRC_1433_08L10"], "DIRECT", "FACTUAL"),
        cl("이 칙서를 '명이 조선을 유죄로 판정했다'로 읽지 않는다(pack 지침).", ["E1433_08L10"], ["SRC_1433_08L10"], "NORMALIZED", "INFERRED")]),
    st("12월 이만주 사절(왕답올·유살독 등) 기사는 v2 이관 자료다.", ["E1433_1221"], ["SRC_1433_1221"], SUM, L2)
  ]),
  scene("S08", "1434 — 범찰 첩보와 회령 재편", [
    st("범찰에 관한 불확실한 첩보에 세종은 도발 대신 은밀한 관찰을 택한다.", ["E1434_0803"], ["SRC_1434_0803"], SUM, PD),
    st("영북·회령 재편이 승인된다.", ["E1434_1024"], ["SRC_1434_1024"], SUM, PD),
    st("지리지는 같은 해(연 단위) 경원 회복·축성·남도 민호 이주 결정을 기록한다.",
      ["E1434_GEO_GYEONGWON"], ["SRC_GEO_GYEONGWON"], SUM, PD)
  ]),
  scene("S09", "1435.01 — 여연성 포위", [
    st("오량합 약 2,700기가 여연성을 포위한다(1월 13일, 1월 18일 기사).", ["E1435_0113"], ["SRC_1435_0118"], SUM, PD),
    st("김윤수·이진·여성렬·김수연이 각각 수비군을 지휘한다(서로 간 상하관계 기록 없음).",
      ["E1435_0113"], ["SRC_1435_0118"], SUM, PD),
    st("6월 기사에서 드러난 '정월 침입'은 v2 이관 자료이며 별개 사건으로 둔다.",
      ["E1435_JANRAID"], ["SRC_1435_0613"], SUM, L2)
  ]),
  scene("S10", "1435 — 사민: 구휼, 분할, 처벌", [
    st("폭설로 가축을 잃은 신 입거민을 구휼한다.", ["E1435_0312"], ["SRC_1435_0312"], SUM, PD),
    st("함길도 입거민의 생계·정착 문제가 보고된다.", ["E1435_0408"], ["SRC_1435_0408"], SUM, PD),
    st("회령·경원 호구를 나누어 종성·공성을 설치한다.", ["E1435_0719"], ["SRC_1435_0719"], SUM, PD),
    st("입거 선정 부정과 도피에 대해 처벌·강제 재배치가 이루어진다.", ["E1435_0726"], ["SRC_1435_0726"], SUM, PD),
    st("이 장면들은 변경 건설이 자발적·조화로운 과정만이 아니었음을 보여 준다(편집자 해석).",
      ["E1435_0312", "E1435_0408", "E1435_0719", "E1435_0726"], ["SRC_1435_0312", "SRC_1435_0408", "SRC_1435_0719", "SRC_1435_0726"], IN, INT)
  ]),
  scene("S11", "1435.06~09 — 책임과 포상", [
    st("미보고 침입의 책임 추궁과 사헌부의 처분 강화 요구(v2 이관 자료).",
      ["E1435_0613", "E1435_0617"], ["SRC_1435_0613", "SRC_1435_0617"], SUM, L2),
    st("여연 전투 뒤 1계급 승진·전사자 예우·태만자 처벌이 이어진다. 어느 전투인지는 pack이 특정하지 않는다(D05).",
      ["E1435_0918"], ["SRC_1435_0918"], SUM, PD)
  ]),
  scene("S12", "1436 — 중앙의 건의가 이천에게로", [
    st("세종이 모은 방어 건의를 평안도의 이천에게 보내 평가를 맡긴다.", ["E1436_06L19"], ["SRC_1436_06L19"], SUM, PD),
    st("김종서·정흠지가 4군 방어책을 올린다.", ["E1436_1101"], ["SRC_1436_1101"], SUM, PD),
    st("병조안 시행과 화포 교습관 배치, 본영 이전을 둘러싼 의견 대립이 이어진다.", ["E1436_1127"], ["SRC_1436_1127"], SUM, PD)
  ]),
  scene("S13", "1437 — 이천의 자책과 제2차 정벌", [
    st("이천은 요격 실패를 자책하며 전략안을 올린다.", ["E1437_0611"], ["SRC_1437_0611"], SUM, PD),
    st("최윤덕의 방비 방안이 함길도 도절제사에게 전달된다.", ["E1437_0820"], ["SRC_1437_0820"], SUM, PD),
    st("9월 7일 세 갈래로 압록강을 건넌다(9월 14일 기사).", ["E1437_0914"], ["SRC_1437_0914"], SUM, PD),
    st("승첩 보고: 살상·포획 60, 조선 측 1명 전사(모두 조선 측 보고).", ["E1437_0922"], ["SRC_1437_0922"], SUM, PD)
  ]),
  scene("S14", "1438~1440 — 김종서와 정보·보고", [
    st("세종의 질의에 김종서가 범찰·동창 정세를 회계한다.", ["E1438_0729"], ["SRC_1438_0729"], SUM, PD),
    st("도을온의 제보로 헛소문에 따른 보복 위험을 진정시킨다.", ["E1439_0510"], ["SRC_1439_0510"], SUM, PD),
    st("여러 여진 정보원이 침입 계획을 알려 온다.", ["E1439_0617"], ["SRC_1439_0617"], SUM, PD),
    st("사헌부 탄핵에 맞선 김종서의 성과 목록은 자기 변론이다(점선 결과).", ["E1440_0117"], ["SRC_1440_0117"], SUM, PD),
    st("동창·범찰 무리의 동요와 김종서의 대응.", ["E1440_0407"], ["SRC_1440_0407"], SUM, PD),
    st("이 시기를 '김종서의 정보 네트워크'로 묶는 것은 편집자의 장면 구성이며 사료의 표현이 아니다.",
      ["E1438_0729", "E1439_0510", "E1439_0617", "E1440_0407"], ["SRC_1438_0729", "SRC_1439_0510", "SRC_1439_0617", "SRC_1440_0407"], IN, INT)
  ]),
  scene("S15", "1440~1443 — 진보 재편과 정보원의 경보", [
    st("함길도 진보 이설·신설에 드는 병력이 산정된다.", ["E1440_1126"], ["SRC_1440_1126"], SUM, PD),
    st("황보인을 파견하고 종성 이설·온성 설치가 이루어진다.", ["E1441_0129"], ["SRC_1441_0129"], SUM, PD),
    st("건원보를 아산으로 옮긴다.", ["E1441_0519"], ["SRC_1441_0519"], SUM, PD),
    st("명 측 정보에 따라 경계를 명하고 무단 도강을 금한다.", ["E1442_1022"], ["SRC_1442_1022"], SUM, PD),
    st("1443년 배마라가·창고리의 경보로 우디거 1,000여 기를 막고 두 정보원을 포상한다.", ["E1443_1005"], ["SRC_1443_1005"], SUM, PD),
    st("동소로가무의 합공 제안은 제한적으로만 수용된다.", ["E1443_1023"], ["SRC_1443_1023"], SUM, PD)
  ]),
  scene("S16", "1445~1449 — 방비 해이, 부역, 그리고 작업상의 종점", [
    st("세종은 방비 해이를 경계하고, 남은 오도리에게 관대함과 통제를 함께 쓰라 한다.",
      ["E1445_0806", "E1445_1027"], ["SRC_1445_0806", "SRC_1445_1027"], SUM, PD),
    st("1446년 무창 피습에서 실록 서술은 군령·봉수 해이를 원인으로 적는다(편찬자 서술).", ["E1446_0420"], ["SRC_1446_0420"], SUM, PD),
    st("함길도 회령·삼수의 대규모 부역 축성.", ["E1447_0708"], ["SRC_1447_0708"], SUM, PD),
    st("장성 vs 읍성 우선순위 논의.", ["E1448_0307"], ["SRC_1448_0307"], SUM, PD),
    st("1449년 부거현을 석보로 옮겨 부령도호부·진을 설치한다.", ["E1449_0707"], ["SRC_1449_0707"], SUM, PD),
    st("1449-07-07은 이 시각화의 작업상 종점이며, 북방 문제의 '해결' 시점이 아니다.", ["E1449_0707"], ["SRC_1449_0707"], IN, INT)
  ])
];

export const STORY_SCENES = RAW_SCENES.map(normalizeScene);
