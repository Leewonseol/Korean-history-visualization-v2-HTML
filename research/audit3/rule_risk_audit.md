# 정규화 규칙 R1~R7 사용 빈도·위험도 감사

> 자동 생성: `node tools/audit-round3.mjs`. '1차 DIRECT → NORMALIZED'는 1차 감사(a461893) 스냅샷 `research/audit3/round1_direct_relations.json`과 비교한 값.
> 한 관계에 규칙이 여러 개 붙을 수 있어 열 합계는 관계 수와 다르다. 위험도 판단은 사람이 한다.

| 규칙 | 사용 건수 | 1차 DIRECT → NORMALIZED | 수신자 추정 | 집합→구성원 전개 | layer 선택 개입(R6 동반) | 사람 검토 필요(flag) |
|---|---|---|---|---|---|---|
| `R1_court_recipient` 조정 수신자 → 군주 노드 | 18 | 0 | 18 | 0 | 3 | 3 |
| `R2_carrier_split` 전달자 경유 보고 분리 | 2 | 0 | 0 | 0 | 0 | 0 |
| `R3_who_expansion` 집합·일반 지칭 → 명시된 구성원 | 87 | 11 | 0 | 87 | 23 | 7 |
| `R4_group_placeholder` 무명 집합 → group 노드 | 34 | 17 | 0 | 0 | 8 | 2 |
| `R5_content_actor` 본문(WHAT·WHO·KEY CONTENT)에 명시된 행위자 | 13 | 0 | 8 | 0 | 2 | 10 |
| `R6_layer_normalize` pack 관계 라벨 → layer (비일대일 매핑) | 43 | 14 | 1 | 0 | 43 | 7 |
| `R7_report_on_record` 조정 도달 보고·전달의 시각 = 기사일 | 0 | 0 | 0 | 0 | 0 | 0 |

- 수신자 추정: R1은 원문 수신자 토큰(court 등)을 군주 노드로 바꾼 전부, 그 밖의 규칙은 RECIPIENT_* 검토 표시가 붙은 것.
- 사람 검토 필요: 검토 표시(flag)가 붙은 관계 — `flagged_edges_review.md`.

## R1 별도 검토 — '조정 수신자 → 군주 노드'

R1이 붙은 관계 18건. 모두 '원문에는 court/central/Ming 등 기관·조정이 수신자, 그래프에서는 군주 개인'이라는 축약이다.
이 축약은 군주(세종)의 in-degree·도달성·중계 역할을 키운다 — 세종 중심성 해석 시 R1 관계를 빼고 다시 볼 것.

| relation | 원문 수신자 토큰 | 정규화 수신자 | 근거 줄 | 검토 표시 |
|---|---|---|---|---|
| `E1432_1209#3` | (수신자 미기재: 조정) | 세종 | `pack_v1:E1432_1209:WHO:L37` “평안도 감사 [reporting institution/officeholder not named in excerpt]” | RECIPIENT_IMPLICIT |
| `E1433_0307#1` | court | 세종 | `pack_v1:E1433_0307:RELATIONS:L223` “최치운 -> court : REPORT_CARRIER” | — |
| `E1433_0507#1` | court | 세종 | `pack_v1:E1433_0507:RELATIONS:L293` “박호문 -> court : REPORT” | — |
| `E1433_08L10#7` | Ming | 선덕제 | `pack_v1:E1433_0810:RELATIONS:L445` “Joseon -> Ming : CLAIM” | — |
| `E1433_08L10#8` | Ming | 선덕제 | `pack_v1:E1433_0810:RELATIONS:L444` “이만주 side -> Ming : CLAIM” | SIDE_TO_PERSON |
| `E1434_0803#0` | court | 세종 | `pack_v1:E1434_0803:RELATIONS:L477` “local intelligence -> court : INTELLIGENCE” | — |
| `E1435_0408#0` | court | 세종 | `pack_v1:E1435_0408:RELATIONS:L569` “field command -> court : REPORT” | — |
| `E1436_1101#0` | court | 세종 | `pack_v1:E1436_1101:RELATIONS:L687` “김종서 -> court : POLICY_ADVICE” | — |
| `E1436_1101#1` | court | 세종 | `pack_v1:E1436_1101:RELATIONS:L688` “정흠지 -> court : POLICY_ADVICE” | — |
| `E1436_1127#3` | court | 세종 | `pack_v1:E1436_1127:RELATIONS:L716` “김종서 -> court : POLICY_ADVICE” | — |
| `E1436_1127#4` | court | 세종 | `pack_v1:E1436_1127:RELATIONS:L717` “정흠지 -> court : POLICY_DISAGREEMENT” | — |
| `E1437_0922#4` | (수신자 미기재: 조정) | 세종 | `pack_v1:E1437_0922:WHO:L805` “최정안 mentioned as separate victory reporter” | RECIPIENT_IMPLICIT |
| `E1439_0510#2` | court | 세종 | `pack_v1:E1439_0510:RELATIONS:L878` “김종서 -> court : REPORT” | — |
| `E1440_0407#3` | central | 세종 | `pack_v1:E1440_0407:RELATIONS:L957` “김종서 -> central : REPORT” | — |
| `E1440_1126#0` | court | 세종 | `pack_v1:E1440_1126:RELATIONS:L974` “field administration -> court : DEFENSE_PLANNING” | — |
| `E1441_0519#0` | court | 세종 | `pack_v1:E1441_0519:RELATIONS:L1015` “황보인 -> court : DEFENSE_ADVICE” | — |
| `E1443_1023#0` | court | 세종 | `pack_v1:E1443_1023:RELATIONS:L1096` “동소로가무 -> court : MILITARY_PROPOSAL” | — |
| `E1447_04L10#0` | court | 세종 | `pack_v1:E1447_LUNAR4_10:RELATIONS:L1237` “황보인 -> court : POLICY_REPORT” | — |

- R1 관계 중 세종으로 가는 것 16 · 선덕제로 가는 것 2
- 세종의 기본 입력 in-degree 중 R1 관계 비율: 14/35

## R7 별도 검토 — '조정 도달 보고의 시각 = 기사일'

R7은 2차 감사부터 관계 존재 근거가 아니라 **시각 규칙**으로만 쓴다(관계 규칙 목록에 R7 사용 0건). 대신 아래처럼 시각이 기사일로 정해진 관계가 있다.

- 사건 dateBasis(검증 사건): before_record_date 9 · court_act_on_record_date 30 · pack_event_date 3 · pack_event_range 3 · report_receipt_on_record_date 6 · year_only_geography 3
- 관계 시각이 '기사일 = 행위·도달일' 관례로 정해진 검증 관계: 109건 — 사건 dateBasis별 before_record_date 5 · court_act_on_record_date 95 · report_receipt_on_record_date 6 · pack_event_range 3
  - court_act_on_record_date: 조정 논의·명령을 기사일에 일어난 것으로 본 관례 / report_receipt_on_record_date: 보고 접수일 = 기사일 / before_record_date·pack_event_range 안의 기사일 관계: 좁은 의미의 R7(현장 행위와 분리된 조정 도달 시각)
- CERTAIN_ORDER 기본 입력 132건 중 이 관례에 날짜를 의존하는 관계: 108건

| relation | edge | 사건 dateBasis | 관계 시각 |
|---|---|---|---|
| `E1432_1209#3` | 평안도 감사(실명 미기재) → 세종 (REPORT) | before_record_date | 1432-12-09 |
| `E1432_1211#0` | 세종 → 최윤덕 (POLICY) | court_act_on_record_date | 1432-12-11 |
| `E1432_1211#1` | 세종 → 허조 (POLICY) | court_act_on_record_date | 1432-12-11 |
| `E1432_1211#10` | 정흠지 → 세종 (POLICY) | court_act_on_record_date | 1432-12-11 |
| `E1432_1211#11` | 최윤덕 → 세종 (POLICY) | court_act_on_record_date | 1432-12-11 |
| `E1432_1211#2` | 세종 → 하경복 (POLICY) | court_act_on_record_date | 1432-12-11 |
| `E1432_1211#3` | 세종 → 정흠지 (POLICY) | court_act_on_record_date | 1432-12-11 |
| `E1432_1211#4` | 세종 → 조말생 (POLICY) | court_act_on_record_date | 1432-12-11 |
| `E1432_1211#5` | 세종 → 이천 (POLICY) | court_act_on_record_date | 1432-12-11 |
| `E1432_1211#6` | 세종 → 최해산 (POLICY) | court_act_on_record_date | 1432-12-11 |
| `E1432_1211#7` | 세종 → 안숭선 (POLICY) | court_act_on_record_date | 1432-12-11 |
| `E1432_1211#8` | 이천 → 세종 (POLICY) | court_act_on_record_date | 1432-12-11 |
| `E1432_1211#9` | 최해산 → 세종 (POLICY) | court_act_on_record_date | 1432-12-11 |
| `E1432_1221#0` | 유을합 → 조선 국가·조정(주체·수신자 미특정) (DIPLOMACY) | court_act_on_record_date | 1432-12-21 |
| `E1432_1221#1` | 이만주 → 조선 국가·조정(주체·수신자 미특정) (COUNTER_CLAIM) | court_act_on_record_date | 1432-12-21 |
| `E1432_1221#10` | 세종 → 성억 (POLICY) | court_act_on_record_date | 1432-12-21 |
| `E1432_1221#11` | 세종 → 정연 (POLICY) | court_act_on_record_date | 1432-12-21 |
| `E1432_1221#12` | 세종 → 조계생 (POLICY) | court_act_on_record_date | 1432-12-21 |
| `E1432_1221#13` | 세종 → 이맹균 (POLICY) | court_act_on_record_date | 1432-12-21 |
| `E1432_1221#14` | 세종 → 조말생 (POLICY) | court_act_on_record_date | 1432-12-21 |
| `E1432_1221#2` | 세종 → 안숭선 (POLICY) | court_act_on_record_date | 1432-12-21 |
| `E1432_1221#3` | 세종 → 김종서 (POLICY) | court_act_on_record_date | 1432-12-21 |
| `E1432_1221#4` | 세종 → 안순 (POLICY) | court_act_on_record_date | 1432-12-21 |
| `E1432_1221#5` | 세종 → 하경복 (POLICY) | court_act_on_record_date | 1432-12-21 |
| `E1432_1221#6` | 세종 → 황희 (POLICY) | court_act_on_record_date | 1432-12-21 |
| `E1432_1221#7` | 세종 → 허조 (POLICY) | court_act_on_record_date | 1432-12-21 |
| `E1432_1221#8` | 세종 → 신장 (POLICY) | court_act_on_record_date | 1432-12-21 |
| `E1432_1221#9` | 세종 → 김익정 (POLICY) | court_act_on_record_date | 1432-12-21 |
| `E1433_0215#0` | 세종 → 황희 (POLICY) | court_act_on_record_date | 1433-02-15 |
| `E1433_0215#1` | 황희 → 세종 (POLICY) | court_act_on_record_date | 1433-02-15 |
| `E1433_0215#2` | 세종 → 권진 (POLICY) | court_act_on_record_date | 1433-02-15 |
| `E1433_0215#3` | 권진 → 세종 (POLICY) | court_act_on_record_date | 1433-02-15 |
| `E1433_0215#4` | 세종 → 허조 (POLICY) | court_act_on_record_date | 1433-02-15 |
| `E1433_0215#5` | 허조 → 세종 (POLICY) | court_act_on_record_date | 1433-02-15 |
| `E1433_0226#0` | 세종 → 최윤덕 (COMMAND) | court_act_on_record_date | 1433-02-26 |
| `E1433_0226#1` | 이순몽 → 세종 (POLICY) | court_act_on_record_date | 1433-02-26 |
| `E1433_0307#1` | 최치운 → 세종 (REPORT) | court_act_on_record_date | 1433-03-07 |
| `E1433_0307#2` | 최윤덕 → 세종 (POLICY) | court_act_on_record_date | 1433-03-07 |
| `E1433_0325#0` | 세종 → 최윤덕 (COMMAND) | court_act_on_record_date | 1433-03-25 |
| `E1433_0325#1` | 세종 → 맹가첩목아 (POLICY) | court_act_on_record_date | 1433-03-25 |
| `E1433_0507#1` | 박호문 → 세종 (REPORT) | report_receipt_on_record_date | 1433-05-07 |
| `E1433_0516A#0` | 세종 → 최윤덕 (REWARD) | court_act_on_record_date | 1433-05-16 |
| `E1433_0516A#1` | 세종 → 이순몽 (REWARD) | court_act_on_record_date | 1433-05-16 |
| `E1433_0516A#2` | 세종 → 이각 (REWARD) | court_act_on_record_date | 1433-05-16 |
| `E1433_0516A#3` | 세종 → 이징석 (REWARD) | court_act_on_record_date | 1433-05-16 |
| `E1433_0516A#4` | 세종 → 김효성 (REWARD) | court_act_on_record_date | 1433-05-16 |
| `E1433_0516A#5` | 세종 → 홍사석 (REWARD) | court_act_on_record_date | 1433-05-16 |
| `E1433_0516B#0` | 조선 국가·조정(주체·수신자 미특정) → 최윤덕 (REWARD) | court_act_on_record_date | 1433-05-16 |
| `E1433_0516B#1` | 조선 국가·조정(주체·수신자 미특정) → 이순몽 (REWARD) | court_act_on_record_date | 1433-05-16 |
| `E1433_0516B#2` | 조선 국가·조정(주체·수신자 미특정) → 이각 (REWARD) | court_act_on_record_date | 1433-05-16 |
| `E1433_0516B#3` | 조선 국가·조정(주체·수신자 미특정) → 이징석 (REWARD) | court_act_on_record_date | 1433-05-16 |
| `E1433_0516B#4` | 조선 국가·조정(주체·수신자 미특정) → 홍사석 (REWARD) | court_act_on_record_date | 1433-05-16 |
| `E1433_0516B#5` | 조선 국가·조정(주체·수신자 미특정) → 김효성 (REWARD) | court_act_on_record_date | 1433-05-16 |
| `E1433_0517#0` | 조선 국가·조정(주체·수신자 미특정) → 1433 정벌 전사·병사자와 유가족 (WELFARE) | court_act_on_record_date | 1433-05-17 |
| `E1433_0517#1` | 조선 국가·조정(주체·수신자 미특정) → 안을경 (WELFARE) | court_act_on_record_date | 1433-05-17 |
| `E1433_0517#2` | 조선 국가·조정(주체·수신자 미특정) → 1433 정벌군(평안도 1만·황해도 5천) (WELFARE) | court_act_on_record_date | 1433-05-17 |
| `E1433_0610#3` | 지함 → 세종 (REPORT) | before_record_date | 1433-06-10 |
| `E1433_08L10#0` | 선덕제 → 조선 국가·조정(주체·수신자 미특정) (DIPLOMACY) | before_record_date | 1433-08L-10 |
| `E1434_0803#0` | 1434 범찰 관련 첩보 출처(미상) → 세종 (INTELLIGENCE) | court_act_on_record_date | 1434-08-03 |
| `E1434_0803#1` | 최윤덕 → 세종 (POLICY) | court_act_on_record_date | 1434-08-03 |
| `E1434_0803#2` | 안숭선 → 세종 (POLICY) | court_act_on_record_date | 1434-08-03 |
| `E1435_0408#0` | 함길도 도절제사(실명 미기재) → 세종 (REPORT) | report_receipt_on_record_date | 1435-04-08 |
| `E1435_0719#0` | 조선 국가·조정(주체·수신자 미특정) → 1435 회령에서 분할된 400호(종성) (BORDER_ADMINISTRATION) | court_act_on_record_date | 1435-07-19 |
| `E1435_0719#1` | 조선 국가·조정(주체·수신자 미특정) → 1435 경원에서 분할된 300호(공성) (BORDER_ADMINISTRATION) | court_act_on_record_date | 1435-07-19 |
| `E1435_0726#0` | 조선 국가·조정(주체·수신자 미특정) → 1435 입거 선정 실무 수령·향리·감고·토호(실명 미기재) (PUNISHMENT) | court_act_on_record_date | 1435-07-26 |
| `E1435_0726#1` | 조선 국가·조정(주체·수신자 미특정) → 1435 입거 대상 민호(도피·환귀자 포함) (RESETTLEMENT) | court_act_on_record_date | 1435-07-26 |
| `E1435_0918#0` | 조선 국가·조정(주체·수신자 미특정) → 김윤수 (REWARD) | court_act_on_record_date | 1435-09-18 |
| `E1435_0918#1` | 조선 국가·조정(주체·수신자 미특정) → 장사우 (REWARD) | court_act_on_record_date | 1435-09-18 |
| `E1435_0918#2` | 조선 국가·조정(주체·수신자 미특정) → 배철 (REWARD) | court_act_on_record_date | 1435-09-18 |
| `E1435_0918#3` | 조선 국가·조정(주체·수신자 미특정) → 1435 여연 전투 전사자와 유가족 (WELFARE) | court_act_on_record_date | 1435-09-18 |
| `E1435_0918#4` | 조선 국가·조정(주체·수신자 미특정) → 1435 방비 소홀·소극 군사·감독자(실명 미기재) (PUNISHMENT) | court_act_on_record_date | 1435-09-18 |
| `E1436_06L19#1` | 세종 → 이천 (POLICY) | court_act_on_record_date | 1436-06L-19 |
| `E1436_1101#0` | 김종서 → 세종 (POLICY) | court_act_on_record_date | 1436-11-01 |
| `E1436_1101#1` | 정흠지 → 세종 (POLICY) | court_act_on_record_date | 1436-11-01 |
| `E1436_1127#0` | 세종 → 이징옥 (COMMAND) | court_act_on_record_date | 1436-11-27 |
| `E1436_1127#2` | 조선 국가·조정(주체·수신자 미특정) → 1436 자성·강계 등 화포 교습관 (COMMAND) | court_act_on_record_date | 1436-11-27 |
| `E1436_1127#3` | 김종서 → 세종 (POLICY) | court_act_on_record_date | 1436-11-27 |
| `E1436_1127#4` | 정흠지 → 세종 (POLICY) | court_act_on_record_date | 1436-11-27 |
| `E1437_0611#0` | 이천 → 세종 (REPORT) | report_receipt_on_record_date | 1437-06-11 |
| `E1437_0820#0` | 최윤덕 → 세종 (POLICY) | court_act_on_record_date | 1437-08-20 |
| `E1437_0820#1` | 세종 → 함길도 도절제사(실명 미기재) (FORTIFICATION) | court_act_on_record_date | 1437-08-20 |
| `E1437_0922#4` | 최정안 → 세종 (REPORT) | pack_event_range | 1437-09-22 |
| `E1438_0729#1` | 김종서 → 세종 (REPORT) | report_receipt_on_record_date | 1438-07-29 |
| `E1439_0510#2` | 김종서 → 세종 (REPORT) | before_record_date | 1439-05-10 |
| `E1439_0617#6` | 세종 → 김종서 (POLICY) | court_act_on_record_date | 1439-06-17 |
| `E1440_0117#1` | 김종서 → 세종 (REPORT) | court_act_on_record_date | 1440-01-17 |
| `E1440_0407#3` | 김종서 → 세종 (REPORT) | before_record_date | 1440-04-07 |
| `E1440_1126#0` | 함길도 감사·도절제사 등 도 관아(구분·실명 미기재) → 세종 (FORTIFICATION) | report_receipt_on_record_date | 1440-11-26 |
| `E1441_0129#0` | 조선 국가·조정(주체·수신자 미특정) → 황보인 (COMMAND) | court_act_on_record_date | 1441-01-29 |
| `E1442_1022#1` | 세종 → 평안도 감사·도절제사(실명 미기재) (COMMAND) | court_act_on_record_date | 1442-10-22 |
| `E1442_1022#2` | 세종 → 함길도 감사·도절제사 등 도 관아(구분·실명 미기재) (COMMAND) | court_act_on_record_date | 1442-10-22 |
| `E1443_1005#4` | 조선 국가·조정(주체·수신자 미특정) → 배마라가 (REWARD) | pack_event_range | 1443-10-05 |
| `E1443_1005#5` | 조선 국가·조정(주체·수신자 미특정) → 창고리 (REWARD) | pack_event_range | 1443-10-05 |
| `E1443_1023#1` | 조선 국가·조정(주체·수신자 미특정) → 동소로가무 (DIPLOMACY) | court_act_on_record_date | 1443-10-23 |
| `E1445_0519#0` | 황보인 → 세종 (FORTIFICATION) | court_act_on_record_date | 1445-05-19 |
| `E1445_0806#0` | 세종 → 평안도 감사·도절제사(실명 미기재) (FORTIFICATION) | court_act_on_record_date | 1445-08-06 |
| `E1445_0806#1` | 세종 → 함길도 감사·도절제사 등 도 관아(구분·실명 미기재) (FORTIFICATION) | court_act_on_record_date | 1445-08-06 |
| `E1445_1027#0` | 세종 → 함길도 도절제사(실명 미기재) (COMMAND) | court_act_on_record_date | 1445-10-27 |
| `E1447_04L10#0` | 황보인 → 세종 (REPORT) | report_receipt_on_record_date | 1447-04L-10 |
| `E1448_0307#0` | 세종 → 하연 (POLICY) | court_act_on_record_date | 1448-03-07 |
| `E1448_0307#1` | 세종 → 황보인 (POLICY) | court_act_on_record_date | 1448-03-07 |
| `E1448_0307#2` | 세종 → 박종우 (POLICY) | court_act_on_record_date | 1448-03-07 |
| `E1448_0307#3` | 세종 → 김종서 (POLICY) | court_act_on_record_date | 1448-03-07 |
| `E1448_0307#4` | 세종 → 정분 (POLICY) | court_act_on_record_date | 1448-03-07 |
| `E1448_0307#5` | 세종 → 정갑손 (POLICY) | court_act_on_record_date | 1448-03-07 |
| `E1448_0307#6` | 하연 → 세종 (POLICY) | court_act_on_record_date | 1448-03-07 |
| `E1448_0307#7` | 박종우 → 세종 (POLICY) | court_act_on_record_date | 1448-03-07 |
| `E1448_0307#8` | 김종서 → 세종 (POLICY) | court_act_on_record_date | 1448-03-07 |
| `E1448_0307#9` | 정분 → 세종 (POLICY) | court_act_on_record_date | 1448-03-07 |

- 위험: 기사일을 '도달일'로 보는 관례는 같은 날 연쇄(PARTIAL_ORDER)를 만들고, 세종을 거치는 CERTAIN_ORDER 경로가 이 관례에 의존한다.
- court_act_on_record_date·report_receipt_on_record_date 사건의 관계도 같은 관례(기사일 = 행위일)를 쓴다 — 경로 결과 해석 시 함께 고려.

