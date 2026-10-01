# pack에는 있으나 graph에 없는 인물·기관 관계 — 수동 검토표

> 자동 생성: `node tools/audit-round4.mjs` · 대상 9건(`pack_relations_not_encoded.md` 중 인물·기관 사이 관계). **판정 전에는 graph에 추가하지 않는다 — 이번 라운드에서 추가한 관계 없음.**
> 판정 선택지: ADD_AS_DIRECT / ADD_AS_NORMALIZED / INTERPRETATION_ONLY / DO_NOT_ADD / NEEDS_SOURCE.
> '영향'은 메모리 안에서 가상 edge를 붙여 다시 계산한 값이다(데이터 미반영). '현재 graph에 없는 이유'에 '기록된 제외 사유 없음'이라고 쓴 것은 데이터에 제외 이유가 남아 있지 않다는 뜻이다.

## 요약표

| # | locator | 원문 | 기존 규칙으로 표현 | 판정 |
|---|---|---|---|---|
| 1 | `pack_v1:E1433_0507:RELATIONS:L290` ★ | “세종 / state -> 최윤덕 : COMMAND” | 가능 — 주체 선택만 사람이 정하면 기존 R1/자리표시자 기준으로 표현됨. 원문 줄 그대로 '세종'을 쓰면 DIRECT 기준에 가까움 |  |
| 2 | `pack_v1:E1433_0215:RELATIONS:L175` | “court -> Pajŏ groups : INVESTIGATION / RESPONSIBILITY_ASSESSMENT” | 가능 — 다만 새 group 노드가 생김. '~에 관한' 성격이면 pathEligible:false 후보 |  |
| 3 | `pack_v1:E1433_0507:RELATIONS:L292` | “commanders -> target settlements : MILITARY_ACTION” | 가능 — 다만 대상이 지명(PLACES L275-282)이라 새 group 노드가 생김. 부대별 대상 대응은 pack에 없음(legacy 승격 금지) |  |
| 4 | `pack_v1:E1434_1024:RELATIONS:L503` | “field officials -> court : BORDER_ADMIN_POLICY” | 가능(R4+R1) — 새 group 노드 1개. 실명 전개(R3)는 구성원 근거가 없어 불가 |  |
| 5 | `pack_v1:E1435_0312:RELATIONS:L553` | “provincial government -> settlers : RELIEF” | 가능 — 다만 사건 dateBasis가 before_record_date라 CERTAIN_ORDER 기본 지표에는 어차피 들어가지 않음 |  |
| 6 | `pack_v1:E1436_0619:RELATIONS:L668` | “이천 -> 세종 : expected FEEDBACK” | 관계 발생으로 넣으면 원문에 없는 사건을 만드는 것. 요청 자체는 이미 '세종 -> 이천 : POLICY_TRANSFER / COMMAND'(L667)로 있음 |  |
| 7 | `pack_v1:E1440_0407:RELATIONS:L955` | “rumor -> Dongchang/Fancha group : FEAR” | 관계로는 불가. 사건 속성(원인 서술)으로 두는 것이 기존 스키마 안의 방법 |  |
| 8 | `pack_v1:E1446_0420:RELATIONS:L1185` | “record -> 배찬/김자옹 : ACCOUNTABILITY” | 관계로는 불가. 사건 속성(책임 귀속 서술)으로 두는 것이 기존 스키마 안의 방법 |  |
| 9 | `pack_v1:E1447_LUNAR4_10:RELATIONS:L1238` | “state -> settlers/soldiers/local offices : RESOURCE_ALLOCATION / ADMIN_REFORM” | 가능 — 새 group 노드 3개. 대상이 모두 새 노드라 다른 노드 사이 경로는 생기지 않음 |  |

## 1. `pack_v1:E1433_0507:RELATIONS:L290` ★ 우선 검토

| 항목 | 내용 |
|---|---|
| pack 원문 | “세종 / state -> 최윤덕 : COMMAND” |
| 날짜 | 1433-05-07 (사건 `E1433_0507` dateBasis `report_receipt_on_record_date`) |
| 관계 표현 | `COMMAND` |
| source | 세종 / state |
| target | 최윤덕 |
| relation type | COMMAND |
| 현재 graph에 없는 이유 | 데이터에 기록된 제외 사유 없음. 같은 항목의 REPORTER L258·L293만 trace로 쓰였음. 세종→최윤덕 COMMAND는 다른 항목(1433-03-25 L246, 1433-02-26 L199 COMMAND_DESIGN)으로 이미 있음 |
| 기존 정규화 규칙으로 표현 가능? | 주체가 '세종 / state' 두 표기 병기 — 세종을 고르면 R1류 선택(주체 쪽), state를 고르면 ORG_JOSEON_COURT. 'COMMAND' 라벨 → COMMAND layer |
| 새 규칙 없이 표현 가능? | 가능 — 주체 선택만 사람이 정하면 기존 R1/자리표시자 기준으로 표현됨. 원문 줄 그대로 '세종'을 쓰면 DIRECT 기준에 가까움 |

**이미 있는 같은 방향 관계**
- `E1432_1211#0` `JO_SEJONG` 세종 → `JO_CHOEYUNDEOK` 최윤덕 · POLICY · `consult` · 시각 1432년 12월 11일 · 인과 UNKNOWN · 근거 NORMALIZED
- `E1433_0226#0` `JO_SEJONG` 세종 → `JO_CHOEYUNDEOK` 최윤덕 · COMMAND · `design_command_authority` · 시각 1433년 2월 26일 · 인과 UNKNOWN · 근거 DIRECT
- `E1433_0325#0` `JO_SEJONG` 세종 → `JO_CHOEYUNDEOK` 최윤덕 · COMMAND · `secret_conditional_targeting_order` · 시각 1433년 3월 25일 · 인과 UNKNOWN · 근거 DIRECT
- `E1433_0516A#0` `JO_SEJONG` 세종 → `JO_CHOEYUNDEOK` 최윤덕 · REWARD · `promotion_for_campaign_merit` · 시각 1433년 5월 16일 · 인과 EXPLICIT_CAUSAL · 근거 NORMALIZED

**영향 (a) 시각 = 기사일 이전(명령은 정벌 전, 기사일 1433-05-07에 보고됨 → tMin 미상)** — CERTAIN_ORDER
- 가상 관계의 시각(1433년 5월 7일 이전(정확한 시점 미상))이 CERTAIN_ORDER 기간 판정을 통과하지 못함 → 이 모드의 지표·경로에 들어가지 않는다(영향 0).

**영향 (b) 시각 = 기사일 1433-05-07(R7류 관례를 적용한다고 가정)** — CERTAIN_ORDER
| 지표 | 현재 | 가상 반영 | 차이 |
|---|---|---|---|
| edge 수 | 132 | 133 | 1 |
| node 수 | 73 | 73 | 0 |
| 기존 노드 사이 도달 쌍 | 1052 | 1052 | +0 |
| 세종 degree | 95 | 96 | 1 |
| 세종 betweenness | 858 | 858 | 0 |
| 최윤덕 degree | 15 | 16 | 1 |
| 최윤덕 betweenness | 168 | 168 | 0 |
| 황보인 degree | 4 | 4 | 0 |
| 황보인 betweenness | 9 | 9 | 0 |
| 김종서 degree | 11 | 11 | 0 |
| 김종서 betweenness | 0 | 0 | 0 |
| 이천 degree | 9 | 9 | 0 |
| 이천 betweenness | 140 | 140 | 0 |

**영향 (c) 시각 = 기사일 이전** — TEMPORALLY_NOT_EXCLUDED(시간상 배제되지 않음)
| 지표 | 현재 | 가상 반영 | 차이 |
|---|---|---|---|
| edge 수 | 170 | 171 | 1 |
| node 수 | 101 | 101 | 0 |
| 기존 노드 사이 도달 쌍 | 2118 | 2118 | +0 |
| 세종 degree | 99 | 100 | 1 |
| 세종 betweenness | 1624 | 1624 | 0 |
| 최윤덕 degree | 17 | 18 | 1 |
| 최윤덕 betweenness | 278 | 278 | 0 |
| 황보인 degree | 5 | 5 | 0 |
| 황보인 betweenness | 0 | 0 | 0 |
| 김종서 degree | 18 | 18 | 0 |
| 김종서 betweenness | 237 | 237 | 0 |
| 이천 degree | 9 | 9 | 0 |
| 이천 betweenness | 210 | 210 | 0 |

**판정** ☐ ADD_AS_DIRECT ☐ ADD_AS_NORMALIZED ☐ INTERPRETATION_ONLY ☐ DO_NOT_ADD ☐ NEEDS_SOURCE  ·  검토자: ____  ·  메모: ____

<details><summary>원문 전체 문맥 — pack 항목 E1433_0507</summary>

```
 250| E1433_0507
 251| EVENT DATE: campaign assembled 1433-04-10; attack completed around 1433-04-19
 252| RECORD DATE: 1433-05-07
 253| TITLE: First Pajŏ River campaign report
 254| SOURCE:
 255| https://sillok.history.go.kr/id/kda_11505007_002
 256| 
 257| REPORTER:
 258| - 최윤덕, via 박호문
 259| 
 260| MAJOR COMMANDERS AND FORCE SIZES:
 261| - 최윤덕: 2,599
 262| - 이순몽: 2,515
 263| - 최해산: 2,070
 264| - 이각 李恪: 1,770
 265| - 이징석 李澄石: 3,010
 266| - 김효성 金孝誠: 1,888
 267| - 홍사석 洪師錫: 1,110
 268| 
 269| TOTAL MOBILIZATION:
 270| - 10,000 Pyeongan regular cavalry/infantry
 271| - 5,000 Hwanghae troops
 272| 
 273| PLACES:
 274| - 강계
 275| - 이만주 채리
 276| - 거여
 277| - 마천
 278| - 올라
 279| - 임합라 부모 채리
 280| - 팔리수
 281| - 임합라 채리
 282| 
 283| OUTCOME:
 284| - Extensive killed/captured figures and property seizures reported by each column.
 285| - Choe's own column reported 4 Joseon dead and 20 wounded.
 286| - Kim Hyo-seong and Hong Sa-seok columns also reported wounded personnel.
 287| - All numerical outcomes are JOSEON COMMAND REPORTS, not independently verified.
 288| 
 289| RELATIONS:
 290| - 세종 / state -> 최윤덕 : COMMAND
 291| - 최윤덕 -> six subordinate columns : COMMAND
 292| - commanders -> target settlements : MILITARY_ACTION
 293| - 박호문 -> court : REPORT
 294| 
```
</details>

## 2. `pack_v1:E1433_0215:RELATIONS:L175`

| 항목 | 내용 |
|---|---|
| pack 원문 | “court -> Pajŏ groups : INVESTIGATION / RESPONSIBILITY_ASSESSMENT” |
| 날짜 | 1433-02-15 (사건 `E1433_0215` dateBasis `court_act_on_record_date`) |
| 관계 표현 | `INVESTIGATION / RESPONSIBILITY_ASSESSMENT` |
| source | court |
| target | Pajŏ groups |
| relation type | INVESTIGATION / RESPONSIBILITY_ASSESSMENT |
| 현재 graph에 없는 이유 | 데이터에 기록된 제외 사유 없음(trace 미작성). 내용은 '파저강 무리의 책임을 따짐' — 행위자 사이 전달이라기보다 판단 대상 지정이라 ABOUT_RELATION과 비슷한 성격 |
| 기존 정규화 규칙으로 표현 가능? | 주체 'court' → ORG_JOSEON_COURT(2차 감사 기준) + 대상 무명 집단 → R4 group 자리표시자 |
| 새 규칙 없이 표현 가능? | 가능 — 다만 새 group 노드가 생김. '~에 관한' 성격이면 pathEligible:false 후보 |

**추가될 경우 영향**(가상 edge 조선 국가·조정(주체·수신자 미특정)→(새 노드) Pajŏ groups · 시각 1433년 2월 15일) — CERTAIN_ORDER 기본 입력 기준
| 지표 | 현재 | 가상 반영 | 차이 |
|---|---|---|---|
| edge 수 | 132 | 133 | 1 |
| node 수 | 73 | 74 | 1 |
| 기존 노드 사이 도달 쌍 | 1052 | 1052 | +0 |
| 세종 degree | 95 | 95 | 0 |
| 세종 betweenness | 858 | 858 | 0 |
| 최윤덕 degree | 15 | 15 | 0 |
| 최윤덕 betweenness | 168 | 168 | 0 |
| 황보인 degree | 4 | 4 | 0 |
| 황보인 betweenness | 9 | 9 | 0 |
| 김종서 degree | 11 | 11 | 0 |
| 김종서 betweenness | 0 | 0 | 0 |
| 이천 degree | 9 | 9 | 0 |
| 이천 betweenness | 140 | 140 | 0 |
| 조선 국가·조정(주체·수신자 미특정) degree | 29 | 30 | 1 |
| 조선 국가·조정(주체·수신자 미특정) betweenness | 110 | 112 | 2 |

- 새 노드는 한쪽 끝(출발만 또는 도착만)이라 기존 노드 사이 도달 쌍은 바뀌지 않는다. betweenness 증가분은 새 노드로 가는(또는 새 노드에서 오는) 경로를 중계한 몫이다.

**판정** ☐ ADD_AS_DIRECT ☐ ADD_AS_NORMALIZED ☐ INTERPRETATION_ONLY ☐ DO_NOT_ADD ☐ NEEDS_SOURCE  ·  검토자: ____  ·  메모: ____

<details><summary>원문 전체 문맥 — pack 항목 E1433_0215</summary>

```
 150| E1433_0215
 151| DATE: 1433-02-15
 152| TITLE: Secret deliberation over whether and how to punish Pajŏ River groups
 153| SOURCE:
 154| https://sillok.history.go.kr/id/kda_11502015_002
 155| 
 156| WHO includes:
 157| - 세종
 158| - 황희
 159| - 권진
 160| - 허조
 161| - other central ministers / military officials
 162| - 최윤덕 mentioned as frontier commander
 163| 
 164| WHAT:
 165| - Sejong secretly solicited views on:
 166|   * how to deal with Pajŏ River Jurchens
 167|   * wording of accusation
 168|   * whether/how to campaign
 169| - Ministers disagreed over culpability, geography, military risk,
 170|   and evidentiary sufficiency.
 171| 
 172| RELATIONS:
 173| - 세종 -> central officials : POLICY_QUERY
 174| - officials -> 세종 : POLICY_ADVICE
 175| - court -> Pajŏ groups : INVESTIGATION / RESPONSIBILITY_ASSESSMENT
 176| 
```
</details>

## 3. `pack_v1:E1433_0507:RELATIONS:L292`

| 항목 | 내용 |
|---|---|
| pack 원문 | “commanders -> target settlements : MILITARY_ACTION” |
| 날짜 | 1433-05-07 (사건 `E1433_0419` dateBasis `pack_event_range`) |
| 관계 표현 | `MILITARY_ACTION` |
| source | commanders |
| target | target settlements |
| relation type | MILITARY_ACTION |
| 현재 graph에 없는 이유 | 데이터에 기록된 제외 사유 없음. 부대↔대상 대응은 legacy E1433_0419#0~2(v2)에만 있고 pack은 이 한 줄로 묶어 씀 |
| 기존 정규화 규칙으로 표현 가능? | R3(commanders → MAJOR COMMANDERS 명단 L261-267) + R4 PLACE_AS_TARGET(대상 거주지 → 무명 피해 집단) |
| 새 규칙 없이 표현 가능? | 가능 — 다만 대상이 지명(PLACES L275-282)이라 새 group 노드가 생김. 부대별 대상 대응은 pack에 없음(legacy 승격 금지) |

**추가될 경우 영향**(가상 edge 최윤덕→(새 노드) target settlements, 이순몽→(새 노드) target settlements, 최해산→(새 노드) target settlements, 이각→(새 노드) target settlements, 이징석→(새 노드) target settlements, 김효성→(새 노드) target settlements, 홍사석→(새 노드) target settlements · 시각 1433년 4월 10일 ~ 1433년 4월 19일) — CERTAIN_ORDER 기본 입력 기준
| 지표 | 현재 | 가상 반영 | 차이 |
|---|---|---|---|
| edge 수 | 132 | 139 | 7 |
| node 수 | 73 | 74 | 1 |
| 기존 노드 사이 도달 쌍 | 1052 | 1052 | +0 |
| 세종 degree | 95 | 95 | 0 |
| 세종 betweenness | 858 | 876 | 18 |
| 최윤덕 degree | 15 | 16 | 1 |
| 최윤덕 betweenness | 168 | 185 | 17 |
| 황보인 degree | 4 | 4 | 0 |
| 황보인 betweenness | 9 | 9 | 0 |
| 김종서 degree | 11 | 11 | 0 |
| 김종서 betweenness | 0 | 0 | 0 |
| 이천 degree | 9 | 9 | 0 |
| 이천 betweenness | 140 | 140 | 0 |
| 이순몽 degree | 4 | 5 | 1 |
| 최해산 degree | 3 | 4 | 1 |
| 최해산 betweenness | 0 | 2 | 2 |
| 이각 degree | 3 | 4 | 1 |
| 이징석 degree | 3 | 4 | 1 |
| 김효성 degree | 3 | 4 | 1 |
| 홍사석 degree | 3 | 4 | 1 |

- 새 노드는 한쪽 끝(출발만 또는 도착만)이라 기존 노드 사이 도달 쌍은 바뀌지 않는다. betweenness 증가분은 새 노드로 가는(또는 새 노드에서 오는) 경로를 중계한 몫이다.

**판정** ☐ ADD_AS_DIRECT ☐ ADD_AS_NORMALIZED ☐ INTERPRETATION_ONLY ☐ DO_NOT_ADD ☐ NEEDS_SOURCE  ·  검토자: ____  ·  메모: ____

<details><summary>원문 전체 문맥 — pack 항목 E1433_0507</summary>

```
 250| E1433_0507
 251| EVENT DATE: campaign assembled 1433-04-10; attack completed around 1433-04-19
 252| RECORD DATE: 1433-05-07
 253| TITLE: First Pajŏ River campaign report
 254| SOURCE:
 255| https://sillok.history.go.kr/id/kda_11505007_002
 256| 
 257| REPORTER:
 258| - 최윤덕, via 박호문
 259| 
 260| MAJOR COMMANDERS AND FORCE SIZES:
 261| - 최윤덕: 2,599
 262| - 이순몽: 2,515
 263| - 최해산: 2,070
 264| - 이각 李恪: 1,770
 265| - 이징석 李澄石: 3,010
 266| - 김효성 金孝誠: 1,888
 267| - 홍사석 洪師錫: 1,110
 268| 
 269| TOTAL MOBILIZATION:
 270| - 10,000 Pyeongan regular cavalry/infantry
 271| - 5,000 Hwanghae troops
 272| 
 273| PLACES:
 274| - 강계
 275| - 이만주 채리
 276| - 거여
 277| - 마천
 278| - 올라
 279| - 임합라 부모 채리
 280| - 팔리수
 281| - 임합라 채리
 282| 
 283| OUTCOME:
 284| - Extensive killed/captured figures and property seizures reported by each column.
 285| - Choe's own column reported 4 Joseon dead and 20 wounded.
 286| - Kim Hyo-seong and Hong Sa-seok columns also reported wounded personnel.
 287| - All numerical outcomes are JOSEON COMMAND REPORTS, not independently verified.
 288| 
 289| RELATIONS:
 290| - 세종 / state -> 최윤덕 : COMMAND
 291| - 최윤덕 -> six subordinate columns : COMMAND
 292| - commanders -> target settlements : MILITARY_ACTION
 293| - 박호문 -> court : REPORT
 294| 
```
</details>

## 4. `pack_v1:E1434_1024:RELATIONS:L503`

| 항목 | 내용 |
|---|---|
| pack 원문 | “field officials -> court : BORDER_ADMIN_POLICY” |
| 날짜 | 1434-10-24 (사건 `E1434_1024` dateBasis `court_act_on_record_date`) |
| 관계 표현 | `BORDER_ADMIN_POLICY` |
| source | field officials |
| target | court |
| relation type | BORDER_ADMIN_POLICY |
| 현재 graph에 없는 이유 | 'field officials'가 WHO의 누구인지 원문이 말하지 않아 실명 4명(함길도 감사·성달생·심도원·이징옥)에게 준 관계는 INTERPRETATION(E1434_1024#0~3)으로만 있음 — 기본 분석 제외 |
| 기존 정규화 규칙으로 표현 가능? | R4(무명 '현지 관원' 집단 자리표시자) + R1(court → 세종) 또는 수신자 ORG_JOSEON_COURT |
| 새 규칙 없이 표현 가능? | 가능(R4+R1) — 새 group 노드 1개. 실명 전개(R3)는 구성원 근거가 없어 불가 |

**추가될 경우 영향**(가상 edge (새 노드) field officials→세종 · 시각 1434년 10월 24일) — CERTAIN_ORDER 기본 입력 기준
| 지표 | 현재 | 가상 반영 | 차이 |
|---|---|---|---|
| edge 수 | 132 | 133 | 1 |
| node 수 | 73 | 74 | 1 |
| 기존 노드 사이 도달 쌍 | 1052 | 1052 | +0 |
| 세종 degree | 95 | 96 | 1 |
| 세종 betweenness | 858 | 874 | 16 |
| 최윤덕 degree | 15 | 15 | 0 |
| 최윤덕 betweenness | 168 | 168 | 0 |
| 황보인 degree | 4 | 4 | 0 |
| 황보인 betweenness | 9 | 9 | 0 |
| 김종서 degree | 11 | 11 | 0 |
| 김종서 betweenness | 0 | 0 | 0 |
| 이천 degree | 9 | 9 | 0 |
| 이천 betweenness | 140 | 145 | 5 |

- 새 노드는 한쪽 끝(출발만 또는 도착만)이라 기존 노드 사이 도달 쌍은 바뀌지 않는다. betweenness 증가분은 새 노드로 가는(또는 새 노드에서 오는) 경로를 중계한 몫이다.

**판정** ☐ ADD_AS_DIRECT ☐ ADD_AS_NORMALIZED ☐ INTERPRETATION_ONLY ☐ DO_NOT_ADD ☐ NEEDS_SOURCE  ·  검토자: ____  ·  메모: ____

<details><summary>원문 전체 문맥 — pack 항목 E1434_1024</summary>

```
 483| E1434_1024
 484| DATE: 1434-10-24
 485| TITLE: Hoeryŏng/Yŏngbuk administrative-defense reorganization
 486| SOURCE:
 487| https://sillok.history.go.kr/id/kda_11610024_005
 488| 
 489| WHO:
 490| - 함길도 감사
 491| - 성달생 成達生
 492| - 심도원 沈道源
 493| - 이징옥 李澄玉
 494| - 세종
 495| 
 496| WHAT:
 497| - Debate over permanent exchange/reorganization of Yŏngbuk and Hoeryŏng.
 498| - Hoeryŏng identified as first-order strategic point.
 499| - Consideration of farmland, population, defense and administrative viability.
 500| - Court accepted the proposal.
 501| 
 502| RELATIONS:
 503| - field officials -> court : BORDER_ADMIN_POLICY
 504| - court -> Hoeryŏng/Yŏngbuk : ADMIN_REORGANIZATION
 505| 
```
</details>

## 5. `pack_v1:E1435_0312:RELATIONS:L553`

| 항목 | 내용 |
|---|---|
| pack 원문 | “provincial government -> settlers : RELIEF” |
| 날짜 | 1435-03-12 (사건 `E1435_0312` dateBasis `before_record_date`) |
| 관계 표현 | `RELIEF` |
| source | provincial government |
| target | settlers |
| relation type | RELIEF |
| 현재 graph에 없는 이유 | 2차 감사에서 'provincial government'를 지명으로 함길도 관아로 특정한 것이 R1~R7 밖의 추론이라 INTERPRETATION(E1435_0312#0)으로 내림 |
| 기존 정규화 규칙으로 표현 가능? | R4(무명 주체·대상 자리표시자) — 어느 도의 관아인지 특정하지 않으면 기존 규칙으로 표현 가능 |
| 새 규칙 없이 표현 가능? | 가능 — 다만 사건 dateBasis가 before_record_date라 CERTAIN_ORDER 기본 지표에는 어차피 들어가지 않음 |

**추가될 경우 영향**(가상 edge (새 노드) provincial government→1435 함길도 북방(길주 이북·회령·경원) 신 입거민 · 시각 1435년 3월 12일 이전(정확한 시점 미상)) — CERTAIN_ORDER 기본 입력 기준
- 가상 관계의 시각(1435년 3월 12일 이전(정확한 시점 미상))이 CERTAIN_ORDER 기간 판정을 통과하지 못함 → 이 모드의 지표·경로에 들어가지 않는다(영향 0).

- 새 노드는 한쪽 끝(출발만 또는 도착만)이라 기존 노드 사이 도달 쌍은 바뀌지 않는다. betweenness 증가분은 새 노드로 가는(또는 새 노드에서 오는) 경로를 중계한 몫이다.

**판정** ☐ ADD_AS_DIRECT ☐ ADD_AS_NORMALIZED ☐ INTERPRETATION_ONLY ☐ DO_NOT_ADD ☐ NEEDS_SOURCE  ·  검토자: ____  ·  메모: ____

<details><summary>원문 전체 문맥 — pack 항목 E1435_0312</summary>

```
 536| E1435_0312
 537| DATE: 1435-03-12
 538| TITLE: Relief for newly resettled northern population
 539| SOURCE:
 540| https://sillok.history.go.kr/id/kda_11703012_005
 541| 
 542| WHERE:
 543| - 길주 이북
 544| - 회령
 545| - 경원
 546| 
 547| WHAT:
 548| - Severe snow killed livestock.
 549| - Newly relocated settlers' farm cattle and warhorses heavily affected.
 550| - Grain/fodder/transport used for relief.
 551| 
 552| RELATIONS:
 553| - provincial government -> settlers : RELIEF
 554| - provincial government -> military livestock : LOGISTICS
 555| 
```
</details>

## 6. `pack_v1:E1436_0619:RELATIONS:L668`

| 항목 | 내용 |
|---|---|
| pack 원문 | “이천 -> 세종 : expected FEEDBACK” |
| 날짜 | 1436 leap-06-19 (사건 `E1436_06L19` dateBasis `court_act_on_record_date`) |
| 관계 표현 | `expected FEEDBACK` |
| source | 이천 |
| target | 세종 |
| relation type | expected FEEDBACK |
| 현재 graph에 없는 이유 | 'expected' — 세종이 요청한 피드백(WHAT L659-660 'asked him to evaluate proposals and submit better plans')이지 실제 보고가 있었다는 진술이 아님 |
| 기존 정규화 규칙으로 표현 가능? | 해당 규칙 없음 — 기존 R1~R7은 '예정·기대된 관계'를 다루지 않음 |
| 새 규칙 없이 표현 가능? | 관계 발생으로 넣으면 원문에 없는 사건을 만드는 것. 요청 자체는 이미 '세종 -> 이천 : POLICY_TRANSFER / COMMAND'(L667)로 있음 |

**추가될 경우 영향**(가상 edge 이천→세종 · 시각 1436년 윤6월 19일) — CERTAIN_ORDER 기본 입력 기준
| 지표 | 현재 | 가상 반영 | 차이 |
|---|---|---|---|
| edge 수 | 132 | 133 | 1 |
| node 수 | 73 | 73 | 0 |
| 기존 노드 사이 도달 쌍 | 1052 | 1052 | +0 |
| 세종 degree | 95 | 96 | 1 |
| 세종 betweenness | 858 | 858 | 0 |
| 최윤덕 degree | 15 | 15 | 0 |
| 최윤덕 betweenness | 168 | 168 | 0 |
| 황보인 degree | 4 | 4 | 0 |
| 황보인 betweenness | 9 | 9 | 0 |
| 김종서 degree | 11 | 11 | 0 |
| 김종서 betweenness | 0 | 0 | 0 |
| 이천 degree | 9 | 10 | 1 |
| 이천 betweenness | 140 | 140 | 0 |



**판정** ☐ ADD_AS_DIRECT ☐ ADD_AS_NORMALIZED ☐ INTERPRETATION_ONLY ☐ DO_NOT_ADD ☐ NEEDS_SOURCE  ·  검토자: ____  ·  메모: ____

<details><summary>원문 전체 문맥 — pack 항목 E1436_0619</summary>

```
 644| E1436_0619
 645| DATE: 1436 leap-06-19
 646| TITLE: Sejong sends collected anti-incursion proposals to Yi Cheon
 647| SOURCE:
 648| https://sillok.history.go.kr/id/kda_11806119_002
 649| 
 650| WHO:
 651| - 세종
 652| - 이천
 653| - unnamed fourth-rank-and-above proposal writers
 654| - 이만주 mentioned
 655| 
 656| WHAT:
 657| - Sejong collected and copied anti-incursion policy proposals.
 658| - Sent them to Yi Cheon, Pyeongan commander.
 659| - Told Yi Cheon that western defense had been entrusted to him and asked
 660|   him to evaluate proposals and submit better plans.
 661| 
 662| SIGNIFICANCE:
 663| Yi Cheon is clearly the policy-to-field bridge BEFORE the 1437 campaign.
 664| 
 665| RELATIONS:
 666| - central officials -> 세종 : POLICY_ADVICE
 667| - 세종 -> 이천 : POLICY_TRANSFER / COMMAND
 668| - 이천 -> 세종 : expected FEEDBACK
 669| 
```
</details>

## 7. `pack_v1:E1440_0407:RELATIONS:L955`

| 항목 | 내용 |
|---|---|
| pack 원문 | “rumor -> Dongchang/Fancha group : FEAR” |
| 날짜 | 1440-04-07 (사건 `E1440_0407` dateBasis `before_record_date`) |
| 관계 표현 | `FEAR` |
| source | rumor |
| target | Dongchang/Fancha group |
| relation type | FEAR |
| 현재 graph에 없는 이유 | 주체 'rumor'(소문)가 행위자가 아님 — 행위자 사이 관계 모델에 맞지 않음 |
| 기존 정규화 규칙으로 표현 가능? | 해당 규칙 없음(비행위자 주체) |
| 새 규칙 없이 표현 가능? | 관계로는 불가. 사건 속성(원인 서술)으로 두는 것이 기존 스키마 안의 방법 |

**추가될 경우 영향**(가상 edge (새 노드) rumor→동창 · 시각 1440년 4월 7일 이전(정확한 시점 미상)) — CERTAIN_ORDER 기본 입력 기준
- 가상 관계의 시각(1440년 4월 7일 이전(정확한 시점 미상))이 CERTAIN_ORDER 기간 판정을 통과하지 못함 → 이 모드의 지표·경로에 들어가지 않는다(영향 0).

- 새 노드는 한쪽 끝(출발만 또는 도착만)이라 기존 노드 사이 도달 쌍은 바뀌지 않는다. betweenness 증가분은 새 노드로 가는(또는 새 노드에서 오는) 경로를 중계한 몫이다.

**판정** ☐ ADD_AS_DIRECT ☐ ADD_AS_NORMALIZED ☐ INTERPRETATION_ONLY ☐ DO_NOT_ADD ☐ NEEDS_SOURCE  ·  검토자: ____  ·  메모: ____

<details><summary>원문 전체 문맥 — pack 항목 E1440_0407</summary>

```
 936| E1440_0407
 937| DATE: 1440-04-07
 938| TITLE: Kim Jong-seo responds to fear and possible Jurchen flight
 939| SOURCE:
 940| https://sillok.history.go.kr/id/kda_12204007_001
 941| 
 942| WHO:
 943| - 김종서
 944| - 동자음파
 945| - 동창
 946| - 범찰
 947| - provincial observer / central government
 948| 
 949| WHAT:
 950| - Rumor that Joseon intended to kill the group caused flight anxiety.
 951| - Kim went to Hoeryŏng with troops to assess situation.
 952| - Combines conciliation with coercive capacity.
 953| 
 954| RELATIONS:
 955| - rumor -> Dongchang/Fancha group : FEAR
 956| - 김종서 -> groups : DIPLOMATIC_MANAGEMENT
 957| - 김종서 -> central : REPORT
 958| 
```
</details>

## 8. `pack_v1:E1446_0420:RELATIONS:L1185`

| 항목 | 내용 |
|---|---|
| pack 원문 | “record -> 배찬/김자옹 : ACCOUNTABILITY” |
| 날짜 | 1446-04-20 (사건 `E1446_0420` dateBasis `before_record_date`) |
| 관계 표현 | `ACCOUNTABILITY` |
| source | record |
| target | 배찬/김자옹 |
| relation type | ACCOUNTABILITY |
| 현재 graph에 없는 이유 | 주체 'record'는 실록 서술(편찬자의 책임 귀속, WHAT 'Sillok explicitly attributes failure…')이지 행위자가 아님. 이 항목은 pack에 'CAUSAL STATUS: explicit'(L1187-1188)가 붙은 유일한 항목 |
| 기존 정규화 규칙으로 표현 가능? | 해당 규칙 없음(비행위자 주체) |
| 새 규칙 없이 표현 가능? | 관계로는 불가. 사건 속성(책임 귀속 서술)으로 두는 것이 기존 스키마 안의 방법 |

**추가될 경우 영향**(가상 edge (새 노드) record→배찬 · 시각 1446년 4월 20일 이전(정확한 시점 미상)) — CERTAIN_ORDER 기본 입력 기준
- 가상 관계의 시각(1446년 4월 20일 이전(정확한 시점 미상))이 CERTAIN_ORDER 기간 판정을 통과하지 못함 → 이 모드의 지표·경로에 들어가지 않는다(영향 0).

- 새 노드는 한쪽 끝(출발만 또는 도착만)이라 기존 노드 사이 도달 쌍은 바뀌지 않는다. betweenness 증가분은 새 노드로 가는(또는 새 노드에서 오는) 경로를 중계한 몫이다.

**판정** ☐ ADD_AS_DIRECT ☐ ADD_AS_NORMALIZED ☐ INTERPRETATION_ONLY ☐ DO_NOT_ADD ☐ NEEDS_SOURCE  ·  검토자: ____  ·  메모: ____

<details><summary>원문 전체 문맥 — pack 항목 E1446_0420</summary>

```
1163| E1446_0420
1164| DATE: 1446-04-20
1165| TITLE: Muchang raid exposes command and beacon failure
1166| SOURCE:
1167| https://sillok.history.go.kr/id/wda_12804020_005
1168| 
1169| WHO:
1170| - 배찬 裵禶, Muchang magistrate
1171| - 김자옹 金自雍, provincial commander
1172| - 50+ raiders
1173| 
1174| WHAT:
1175| - 5 people killed
1176| - 17 captured
1177| - 4 horses, 8 cattle taken
1178| - Bae Chan crossed river in pursuit but failed to recover captives
1179| - Sillok explicitly attributes failure to lax military orders and beacon vigilance
1180|   by Bae Chan and Kim Ja-ong.
1181| 
1182| RELATIONS:
1183| - raiders -> Muchang : MILITARY_ATTACK
1184| - 배찬 -> raiders : PURSUIT
1185| - record -> 배찬/김자옹 : ACCOUNTABILITY
1186| 
1187| CAUSAL STATUS:
1188| explicit
1189| 
```
</details>

## 9. `pack_v1:E1447_LUNAR4_10:RELATIONS:L1238`

| 항목 | 내용 |
|---|---|
| pack 원문 | “state -> settlers/soldiers/local offices : RESOURCE_ALLOCATION / ADMIN_REFORM” |
| 날짜 | 1447 leap-04-10 (사건 `E1447_04L10` dateBasis `report_receipt_on_record_date`) |
| 관계 표현 | `RESOURCE_ALLOCATION / ADMIN_REFORM` |
| source | state |
| target | settlers/soldiers/local offices |
| relation type | RESOURCE_ALLOCATION / ADMIN_REFORM |
| 현재 graph에 없는 이유 | 데이터에 기록된 제외 사유 없음. 대상 셋 모두 무명 집단 |
| 기존 정규화 규칙으로 표현 가능? | 주체 'state' → ORG_JOSEON_COURT + 대상 R4 group 자리표시자 3개 |
| 새 규칙 없이 표현 가능? | 가능 — 새 group 노드 3개. 대상이 모두 새 노드라 다른 노드 사이 경로는 생기지 않음 |

**추가될 경우 영향**(가상 edge 조선 국가·조정(주체·수신자 미특정)→(새 노드) settlers, 조선 국가·조정(주체·수신자 미특정)→(새 노드) soldiers, 조선 국가·조정(주체·수신자 미특정)→(새 노드) local offices · 시각 1447년 윤4월 10일) — CERTAIN_ORDER 기본 입력 기준
| 지표 | 현재 | 가상 반영 | 차이 |
|---|---|---|---|
| edge 수 | 132 | 135 | 3 |
| node 수 | 73 | 76 | 3 |
| 기존 노드 사이 도달 쌍 | 1052 | 1052 | +0 |
| 세종 degree | 95 | 95 | 0 |
| 세종 betweenness | 858 | 858 | 0 |
| 최윤덕 degree | 15 | 15 | 0 |
| 최윤덕 betweenness | 168 | 168 | 0 |
| 황보인 degree | 4 | 4 | 0 |
| 황보인 betweenness | 9 | 9 | 0 |
| 김종서 degree | 11 | 11 | 0 |
| 김종서 betweenness | 0 | 0 | 0 |
| 이천 degree | 9 | 9 | 0 |
| 이천 betweenness | 140 | 140 | 0 |
| 조선 국가·조정(주체·수신자 미특정) degree | 29 | 32 | 3 |
| 조선 국가·조정(주체·수신자 미특정) betweenness | 110 | 125 | 15 |

- 새 노드는 한쪽 끝(출발만 또는 도착만)이라 기존 노드 사이 도달 쌍은 바뀌지 않는다. betweenness 증가분은 새 노드로 가는(또는 새 노드에서 오는) 경로를 중계한 몫이다.

**판정** ☐ ADD_AS_DIRECT ☐ ADD_AS_NORMALIZED ☐ INTERPRETATION_ONLY ☐ DO_NOT_ADD ☐ NEEDS_SOURCE  ·  검토자: ____  ·  메모: ____

<details><summary>원문 전체 문맥 — pack 항목 E1447_LUNAR4_10</summary>

```
1213| E1447_LUNAR4_10
1214| DATE: 1447 leap-04-10
1215| TITLE: Hwangbo In reports integrated western/eastern frontier reorganization
1216| SOURCE:
1217| https://sillok.history.go.kr/id/kda_12904110_001
1218| 
1219| WHO:
1220| - 황보인
1221| - central government
1222| 
1223| WHAT:
1224| - proposals on newly established Samsu,
1225| - settler administration,
1226| - civilian burden,
1227| - local defense,
1228| - relocation of households,
1229| - military horse burden,
1230| - offices and troop commands.
1231| 
1232| SIGNIFICANCE:
1233| Excellent Lasswell event because policy decisions redistribute
1234| people, military service, movement burden and administrative resources.
1235| 
1236| RELATIONS:
1237| - 황보인 -> court : POLICY_REPORT
1238| - state -> settlers/soldiers/local offices : RESOURCE_ALLOCATION / ADMIN_REFORM
1239| 
```
</details>

