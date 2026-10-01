# R1(조정 수신자 → 군주 노드) 18건 수동 검토표

> 자동 생성: `node tools/audit-round4.mjs` · 대상 18건. **판정 칸은 모두 비어 있다. R1 관련 데이터는 이번 라운드에서 바꾸지 않았다.**
> 판정 선택지: KEEP_AS_SEJONG / CHANGE_TO_COURT(ORG_JOSEON_COURT) / CHANGE_TO_INSTITUTION(의정부·병조·예조 등 기존 기관 노드) / DOWNGRADE_TO_INTERPRETATION / REMOVE / NEEDS_SOURCE.
> '원문 수신자 후보'와 '대안 edge'는 `tools/audit4-notes.mjs`의 검토 메모다. 영향 수치는 메모리 안에서 관계를 빼거나 수신자를 바꿔 다시 계산한 값이며 데이터에는 반영되지 않았다.

## 전체 영향(18건 일괄)

| 경우 | 세종 in-degree | 세종 betweenness | 이천 betweenness | 전체 도달 쌍 |
|---|---|---|---|---|
| 현재(R1 포함) | 48 | 858 | 140 | 1052 |
| R1 관계 전부 제거 | 34 | 728 | 115 | 915 |
| R1 수신자 전부 조정(ORG_JOSEON_COURT)으로 | 34 | 906 | 130 | 1240 |
| (참고) 조정 노드 betweenness — 위 경우 | — | 427 | — | — |

- 기본 입력에 들어가는 R1 관계: 14/18. 세종으로 가는 것 16 · 선덕제로 가는 것 2.
- 같은 pack 항목 WHO에 세종이 없는 R1 관계: 12건 — 이 경우 '세종 개인'을 수신자로 볼 항목 내 근거가 없다.

## 요약표

| # | relation | 기사일 | 원문 | 현재 edge | 기본 입력 | WHO에 세종 | 수신자 후보(메모) | 판정 |
|---|---|---|---|---|---|---|---|---|
| 1 | `E1432_1209#3` | 1432-12-09 | 평안도 감사 → (수신자 미기재: 조정) | 평안도 감사(실명 미기재) → 세종 (REPORT) | 포함 | 없음 | 불명 · 조선 조정 |  |
| 2 | `E1433_0307#1` | 1433-03-07 | 최치운 → court | 최치운 → 세종 (REPORT) | 포함 | 있음 | 조선 조정 · 세종 개인 |  |
| 3 | `E1433_0507#1` | 1433-05-07 | 박호문 → court | 박호문 → 세종 (REPORT) | 포함 | 없음 | 조선 조정 · 세종 개인 |  |
| 4 | `E1433_08L10#7` | 1433-08L-10 | Joseon → Ming | 조선 국가·조정(주체·수신자 미특정) → 선덕제 (CLAIM) | 제외 | 있음 | 특정 관청 · 왕/국왕 |  |
| 5 | `E1433_08L10#8` | 1433-08L-10 | 이만주 side → Ming | 이만주 → 선덕제 (CLAIM) | 제외 | 있음 | 특정 관청 · 왕/국왕 |  |
| 6 | `E1434_0803#0` | 1434-08-03 | local intelligence → court | 1434 범찰 관련 첩보 출처(미상) → 세종 (INTELLIGENCE) | 포함 | 있음 | 조선 조정 · 세종 개인 |  |
| 7 | `E1435_0408#0` | 1435-04-08 | field command → court | 함길도 도절제사(실명 미기재) → 세종 (REPORT) | 포함 | 없음 | 조선 조정 · 불명 |  |
| 8 | `E1436_1101#0` | 1436-11-01 | 김종서 → court | 김종서 → 세종 (POLICY) | 포함 | 없음 | 조선 조정 · 불명 |  |
| 9 | `E1436_1101#1` | 1436-11-01 | 정흠지 → court | 정흠지 → 세종 (POLICY) | 포함 | 없음 | 조선 조정 · 불명 |  |
| 10 | `E1436_1127#3` | 1436-11-27 | 김종서 → court | 김종서 → 세종 (POLICY) | 포함 | 있음 | 조선 조정 · 세종 개인 · 특정 관청 |  |
| 11 | `E1436_1127#4` | 1436-11-27 | 정흠지 → court | 정흠지 → 세종 (POLICY) | 포함 | 있음 | 조선 조정 · 세종 개인 · 특정 관청 |  |
| 12 | `E1437_0922#4` | 1437-09-22 | 최정안 → (수신자 미기재: 조정) | 최정안 → 세종 (REPORT) | 포함 | 없음 | 불명 · 조선 조정 |  |
| 13 | `E1439_0510#2` | 1439-05-10 | 김종서 → court | 김종서 → 세종 (REPORT) | 포함 | 없음 | 조선 조정 · 불명 |  |
| 14 | `E1440_0407#3` | 1440-04-07 | 김종서 → central | 김종서 → 세종 (REPORT) | 포함 | 없음 | 조선 조정 · 특정 관청 |  |
| 15 | `E1440_1126#0` | 1440-11-26 | field administration → court | 함길도 감사·도절제사 등 도 관아(구분·실명 미기재) → 세종 (FORTIFICATION) | 포함 | 없음 | 조선 조정 · 불명 |  |
| 16 | `E1441_0519#0` | 1441-05-19 | 황보인 → court | 황보인 → 세종 (FORTIFICATION) | 제외 | 없음 | 조선 조정 · 불명 |  |
| 17 | `E1443_1023#0` | 1443-10-23 | 동소로가무 → court | 동소로가무 → 세종 (DIPLOMACY) | 제외 | 없음 | 조선 조정 · 의정부 · 특정 관청 · 불명 |  |
| 18 | `E1447_04L10#0` | 1447-04L-10 | 황보인 → court | 황보인 → 세종 (REPORT) | 포함 | 없음 | 조선 조정 · 불명 |  |

## 1. `E1432_1209#3` — 평안도 감사 → (수신자 미기재: 조정)

| 항목 | 내용 |
|---|---|
| 사건 ID | `E1432_1209` 여연 침입과 박초의 추격 |
| 날짜 | 기사일 1432-12-09 · 관계 시각 1432년 12월 9일 · 사건 dateBasis `before_record_date` |
| 근거 줄 | `pack_v1:E1432_1209:WHO:L37` “평안도 감사 [reporting institution/officeholder not named in excerpt]” |
| 원문 subject / object | 평안도 감사 / (수신자 미기재: 조정) |
| 정규화 subject / object | `ORG_PYEONGAN_GAMSA` 평안도 감사(실명 미기재) / `JO_SEJONG` 세종 |
| 현재 edge | `ORG_PYEONGAN_GAMSA` 평안도 감사(실명 미기재) → `JO_SEJONG` 세종 · REPORT · `frontier_report` · 시각 1432년 12월 9일 · 인과 UNKNOWN · 근거 NORMALIZED |
| 적용 규칙 | `R5_content_actor` + `R1_court_recipient` · 검토 표시 RECIPIENT_IMPLICIT |
| R1 적용 이유 | 원문 수신자 토큰 '(수신자 미기재: 조정)' → 세종 (조정 수신자 → 군주 노드) |
| 같은 pack 항목 WHO에 세종 | **없음** (WHO: 평안도 감사, 박초) |

**원문 수신자 후보**(검토 메모 — 판정 아님)

| 세종 개인 | 왕/국왕 | 조선 조정 | 의정부 | 특정 관청 | 불명 |
|---|---|---|---|---|---|
|  |  | 후보 — 보고가 실록 기사로 수록됐다는 사실만 조정 도달을 보여 줌(수신자 진술은 아님) |  |  | 후보 — WHO L37 '[reporting institution/officeholder not named in excerpt]' — 보고자도 수신자도 원문 발췌에 없음 |

**세종으로 정규화하지 않을 경우의 대안 edge**
- ORG_PYEONGAN_GAMSA → ORG_JOSEON_COURT (REPORT)
- 관계 없이 사건의 informationSources로만 기록

**현재 edge가 중심성에 미치는 영향**(기본 입력 기준, 메모리 안 계산)
| 경우 | 세종 in-degree | 세종 betweenness | 세종 betweenness | 전체 도달 쌍 |
|---|---|---|---|---|
| 현재 | 48 | 858 | 858 | 1052 |
| 이 관계 제거 | 47 | 821 | 821 | 1014 |
| 수신자를 조선 조정(ORG_JOSEON_COURT)으로 | 47 | 836 | 836 | 1055 |

**판정** ☐ KEEP_AS_SEJONG ☐ CHANGE_TO_COURT ☐ CHANGE_TO_INSTITUTION ☐ DOWNGRADE_TO_INTERPRETATION ☐ REMOVE ☐ NEEDS_SOURCE  ·  검토자: ____  ·  메모: ____

<details><summary>원문 전체 문맥 — pack 항목 E1432_1209</summary>

```
  30| E1432_1209
  31| DATE: 1432-12-09
  32| TITLE: Yŏyŏn invasion and Park Cho's pursuit
  33| SOURCE:
  34| https://sillok.history.go.kr/id/wda_11412009_003
  35| 
  36| WHO:
  37| - 평안도 감사 [reporting institution/officeholder not named in excerpt]
  38| - 박초 朴礎, 강계절제사
  39| - invading "야인" cavalry, about 400
  40| - Joseon soldiers
  41| - captured Joseon civilians
  42| 
  43| WHERE:
  44| - 여연
  45| - 강계 frontier
  46| THEATER: AMNOK
  47| 
  48| WHAT / OUTCOME:
  49| - c. 400 mounted raiders entered Yŏyŏn and seized people/property.
  50| - Park Cho pursued them.
  51| - 26 captives, 30 horses, 50 cattle recovered.
  52| - 13 Joseon personnel killed.
  53| - 25 wounded by arrows.
  54| - Pursuit stopped as night fell.
  55| 
  56| RELATIONS:
  57| - 야인 -> 여연 주민 : MILITARY_ATTACK
  58| - 박초 -> 야인 : PURSUIT / MILITARY_CONFLICT
  59| - 박초 -> 조선 포로 : RECOVERY / PROTECTION
  60| 
  61| CERTAINTY:
  62| confirmed as Sillok report; casualty and recovery figures are Joseon-reported.
  63| 
```
</details>

## 2. `E1433_0307#1` — 최치운 → court

| 항목 | 내용 |
|---|---|
| 사건 ID | `E1433_0307` 최윤덕: 3,000명은 부족, 1만 이상 필요 |
| 날짜 | 기사일 1433-03-07 · 관계 시각 1433년 3월 7일 · 사건 dateBasis `court_act_on_record_date` |
| 근거 줄 | `pack_v1:E1433_0307:RELATIONS:L223` “최치운 -> court : REPORT_CARRIER” |
| 원문 subject / object | 최치운 / court |
| 정규화 subject / object | `JO_CHOECHIUN` 최치운 / `JO_SEJONG` 세종 |
| 현재 edge | `JO_CHOECHIUN` 최치운 → `JO_SEJONG` 세종 · REPORT · `carry_report` · 시각 1433년 3월 7일 · 인과 UNKNOWN · 근거 NORMALIZED |
| 적용 규칙 | `R1_court_recipient` |
| R1 적용 이유 | 원문 수신자 토큰 'court' → 세종 (조정 수신자 → 군주 노드) |
| 같은 pack 항목 WHO에 세종 | 있음 (WHO: 최윤덕, 최치운, 세종) |

**원문 수신자 후보**(검토 메모 — 판정 아님)

| 세종 개인 | 왕/국왕 | 조선 조정 | 의정부 | 특정 관청 | 불명 |
|---|---|---|---|---|---|
| 후보 — 같은 항목 L222 '최윤덕 -> 세종 : MILITARY_ADVICE'가 같은 계획의 수신자를 세종으로 씀 — 최치운은 그 계획의 운반자(L216) |  | 후보 — 원문 토큰 'court'(L223) |  |  |  |

**세종으로 정규화하지 않을 경우의 대안 edge**
- JO_CHOECHIUN → ORG_JOSEON_COURT (REPORT)

**현재 edge가 중심성에 미치는 영향**(기본 입력 기준, 메모리 안 계산)
| 경우 | 세종 in-degree | 세종 betweenness | 세종 betweenness | 전체 도달 쌍 |
|---|---|---|---|---|
| 현재 | 48 | 858 | 858 | 1052 |
| 이 관계 제거 | 47 | 835 | 835 | 1028 |
| 수신자를 조선 조정(ORG_JOSEON_COURT)으로 | 47 | 850 | 850 | 1069 |

**판정** ☐ KEEP_AS_SEJONG ☐ CHANGE_TO_COURT ☐ CHANGE_TO_INSTITUTION ☐ DOWNGRADE_TO_INTERPRETATION ☐ REMOVE ☐ NEEDS_SOURCE  ·  검토자: ____  ·  메모: ____

<details><summary>원문 전체 문맥 — pack 항목 E1433_0307</summary>

```
 204| E1433_0307
 205| DATE: 1433-03-07
 206| TITLE: Choe Yun-deok argues that 3,000 troops are insufficient
 207| SOURCE:
 208| https://sillok.history.go.kr/id/wda_11503007_001
 209| 
 210| WHO:
 211| - 최윤덕
 212| - 최치운 崔致雲
 213| - 세종
 214| 
 215| WHAT:
 216| - Choe submitted operational plan via Choe Chi-un.
 217| - Argued that 3,000 troops were insufficient.
 218| - Proposed multiple routes.
 219| - Estimated more than 10,000 troops necessary.
 220| 
 221| RELATIONS:
 222| - 최윤덕 -> 세종 : MILITARY_ADVICE
 223| - 최치운 -> court : REPORT_CARRIER
 224| 
```
</details>

## 3. `E1433_0507#1` — 박호문 → court

| 항목 | 내용 |
|---|---|
| 사건 ID | `E1433_0507` 최윤덕의 정벌 결과 보고(박호문 편) |
| 날짜 | 기사일 1433-05-07 · 관계 시각 1433년 5월 7일 · 사건 dateBasis `report_receipt_on_record_date` |
| 근거 줄 | `pack_v1:E1433_0507:RELATIONS:L293` “박호문 -> court : REPORT” |
| 원문 subject / object | 박호문 / court |
| 정규화 subject / object | `JO_PARKHOMUN` 박호문 / `JO_SEJONG` 세종 |
| 현재 edge | `JO_PARKHOMUN` 박호문 → `JO_SEJONG` 세종 · REPORT · `carry_battle_report` · 시각 1433년 5월 7일 · 인과 UNKNOWN · 근거 NORMALIZED |
| 적용 규칙 | `R1_court_recipient` |
| R1 적용 이유 | 원문 수신자 토큰 'court' → 세종 (조정 수신자 → 군주 노드) |
| 같은 pack 항목 WHO에 세종 | **없음** (WHO: 최윤덕, 이순몽, 최해산, 이각, 이징석, 김효성, 홍사석) |

**원문 수신자 후보**(검토 메모 — 판정 아님)

| 세종 개인 | 왕/국왕 | 조선 조정 | 의정부 | 특정 관청 | 불명 |
|---|---|---|---|---|---|
| 후보 — 같은 항목 L290 '세종 / state'가 세종과 국가를 함께 적음 — 다만 L290은 명령 관계이고 보고 수신자 진술은 아님 |  | 후보 — 원문 토큰 'court'(L293) |  |  |  |

**세종으로 정규화하지 않을 경우의 대안 edge**
- JO_PARKHOMUN → ORG_JOSEON_COURT (REPORT)

**현재 edge가 중심성에 미치는 영향**(기본 입력 기준, 메모리 안 계산)
| 경우 | 세종 in-degree | 세종 betweenness | 세종 betweenness | 전체 도달 쌍 |
|---|---|---|---|---|
| 현재 | 48 | 858 | 858 | 1052 |
| 이 관계 제거 | 47 | 836 | 836 | 1029 |
| 수신자를 조선 조정(ORG_JOSEON_COURT)으로 | 47 | 851 | 851 | 1070 |

**판정** ☐ KEEP_AS_SEJONG ☐ CHANGE_TO_COURT ☐ CHANGE_TO_INSTITUTION ☐ DOWNGRADE_TO_INTERPRETATION ☐ REMOVE ☐ NEEDS_SOURCE  ·  검토자: ____  ·  메모: ____

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

## 4. `E1433_08L10#7` — Joseon → Ming

| 항목 | 내용 |
|---|---|
| 사건 ID | `E1433_08L10` 명 칙서: 진위 판별 불가, 상호 반환·침범 금지 |
| 날짜 | 기사일 1433-08L-10 · 관계 시각 1433년 윤8월 10일 이전(정확한 시점 미상) · 사건 dateBasis `before_record_date` |
| 근거 줄 | `pack_v1:E1433_0810:RELATIONS:L445` “Joseon -> Ming : CLAIM” |
| 원문 subject / object | Joseon / Ming |
| 정규화 subject / object | `ORG_JOSEON_COURT` 조선 국가·조정(주체·수신자 미특정) / `MING_XUANDE` 선덕제 |
| 현재 edge | `ORG_JOSEON_COURT` 조선 국가·조정(주체·수신자 미특정) → `MING_XUANDE` 선덕제 · CLAIM · `prior_account_to_ming` · 시각 1433년 윤8월 10일 이전(정확한 시점 미상) · 인과 UNKNOWN · 근거 NORMALIZED |
| 적용 규칙 | `R1_court_recipient` |
| R1 적용 이유 | 원문 수신자 토큰 'Ming' → 선덕제 (조정 수신자 → 군주 노드) |
| 같은 pack 항목 WHO에 세종 | 있음 (WHO: 선덕제, 맹날가래, 최진, 세종, 양목답올, 살만답실리, 맹가첩목아, 범찰, 이만주, 아라답) |

**원문 수신자 후보**(검토 메모 — 판정 아님)

| 세종 개인 | 왕/국왕 | 조선 조정 | 의정부 | 특정 관청 | 불명 |
|---|---|---|---|---|---|
|  | 후보 — 명 쪽: WHO L420 선덕제, L442 선덕제가 칙서 주체 — 황제 개인을 수신자로 볼 근거 |  |  | 후보 — 명 쪽: L432 'Ming court received conflicting accounts' — 수신자를 명 조정으로 서술(조선 범주 표를 명에 대응시킨 것) |  |

**세종으로 정규화하지 않을 경우의 대안 edge**
- 수신자를 '명 조정' 자리표시자로 — 현재 데이터에 해당 노드 없음(새 노드 필요 → 사람 판정 후에만)
- 주체 ORG_JOSEON_COURT는 그대로(2차 감사 R1 교정분)

**현재 edge가 중심성에 미치는 영향**(기본 입력 기준, 메모리 안 계산)
- 이 관계는 기본 분석 입력(CERTAIN_ORDER)에 들어가지 않는다(시각 1433년 윤8월 10일 이전(정확한 시점 미상)) — 기본 중심성 영향 0. 화면·TEMPORALLY_NOT_EXCLUDED 경로에는 나타난다.

**판정** ☐ KEEP_AS_SEJONG ☐ CHANGE_TO_COURT ☐ CHANGE_TO_INSTITUTION ☐ DOWNGRADE_TO_INTERPRETATION ☐ REMOVE ☐ NEEDS_SOURCE  ·  검토자: ____  ·  메모: ____

<details><summary>원문 전체 문맥 — pack 항목 E1433_0810</summary>

```
 413| E1433_0810
 414| DATE: 1433 leap-08-10
 415| TITLE: Ming emperor responds to conflicting Joseon/Jurchen accounts
 416| SOURCE:
 417| https://sillok.history.go.kr/id/wda_11508110_001
 418| 
 419| WHO:
 420| - 선덕제
 421| - 맹날가래 孟捏哥來
 422| - 최진 崔眞
 423| - 세종
 424| - 양목답올
 425| - 살만답실리
 426| - 맹가첩목아
 427| - 범찰
 428| - 이만주
 429| - 아라답
 430| 
 431| WHAT:
 432| - Ming court received conflicting accounts.
 433| - Imperial edict explicitly stated truth/falsehood could not be clearly determined.
 434| - Ordered return of captives, livestock, documents etc. by relevant parties.
 435| - Ordered parties to avoid future mutual intrusion.
 436| 
 437| IMPORTANT:
 438| Do NOT encode this as "Ming ruled Joseon guilty."
 439| Encode as mediation/superior imperial-order intervention amid conflicting accounts.
 440| 
 441| RELATIONS:
 442| - 선덕제 -> 조선 : MEDIATION / IMPERIAL_ORDER
 443| - 선덕제 -> Jurchen actors : MEDIATION / IMPERIAL_ORDER
 444| - 이만주 side -> Ming : CLAIM
 445| - Joseon -> Ming : CLAIM
 446| 
```
</details>

## 5. `E1433_08L10#8` — 이만주 side → Ming

| 항목 | 내용 |
|---|---|
| 사건 ID | `E1433_08L10` 명 칙서: 진위 판별 불가, 상호 반환·침범 금지 |
| 날짜 | 기사일 1433-08L-10 · 관계 시각 1433년 윤8월 10일 이전(정확한 시점 미상) · 사건 dateBasis `before_record_date` |
| 근거 줄 | `pack_v1:E1433_0810:RELATIONS:L444` “이만주 side -> Ming : CLAIM” |
| 원문 subject / object | 이만주 side / Ming |
| 정규화 subject / object | `JZ_MANJU` 이만주 / `MING_XUANDE` 선덕제 |
| 현재 edge | `JZ_MANJU` 이만주 → `MING_XUANDE` 선덕제 · CLAIM · `prior_account_to_ming` · 시각 1433년 윤8월 10일 이전(정확한 시점 미상) · 인과 UNKNOWN · 근거 NORMALIZED |
| 적용 규칙 | `R3_who_expansion` + `R1_court_recipient` · 검토 표시 SIDE_TO_PERSON |
| R1 적용 이유 | 원문 수신자 토큰 'Ming' → 선덕제 (조정 수신자 → 군주 노드) |
| 같은 pack 항목 WHO에 세종 | 있음 (WHO: 선덕제, 맹날가래, 최진, 세종, 양목답올, 살만답실리, 맹가첩목아, 범찰, 이만주, 아라답) |

**원문 수신자 후보**(검토 메모 — 판정 아님)

| 세종 개인 | 왕/국왕 | 조선 조정 | 의정부 | 특정 관청 | 불명 |
|---|---|---|---|---|---|
|  | 후보 — 명 쪽: WHO L420 선덕제(칙서 주체 L442) |  |  | 후보 — 명 쪽: L432 'Ming court received conflicting accounts' |  |

**세종으로 정규화하지 않을 경우의 대안 edge**
- 수신자를 '명 조정' 자리표시자로(새 노드 필요)
- 주체 '이만주 side'(SIDE_TO_PERSON) 문제와 함께 판정 — flagged_edges_review.md 참조

**현재 edge가 중심성에 미치는 영향**(기본 입력 기준, 메모리 안 계산)
- 이 관계는 기본 분석 입력(CERTAIN_ORDER)에 들어가지 않는다(시각 1433년 윤8월 10일 이전(정확한 시점 미상)) — 기본 중심성 영향 0. 화면·TEMPORALLY_NOT_EXCLUDED 경로에는 나타난다.

**판정** ☐ KEEP_AS_SEJONG ☐ CHANGE_TO_COURT ☐ CHANGE_TO_INSTITUTION ☐ DOWNGRADE_TO_INTERPRETATION ☐ REMOVE ☐ NEEDS_SOURCE  ·  검토자: ____  ·  메모: ____

<details><summary>원문 전체 문맥 — pack 항목 E1433_0810</summary>

```
 413| E1433_0810
 414| DATE: 1433 leap-08-10
 415| TITLE: Ming emperor responds to conflicting Joseon/Jurchen accounts
 416| SOURCE:
 417| https://sillok.history.go.kr/id/wda_11508110_001
 418| 
 419| WHO:
 420| - 선덕제
 421| - 맹날가래 孟捏哥來
 422| - 최진 崔眞
 423| - 세종
 424| - 양목답올
 425| - 살만답실리
 426| - 맹가첩목아
 427| - 범찰
 428| - 이만주
 429| - 아라답
 430| 
 431| WHAT:
 432| - Ming court received conflicting accounts.
 433| - Imperial edict explicitly stated truth/falsehood could not be clearly determined.
 434| - Ordered return of captives, livestock, documents etc. by relevant parties.
 435| - Ordered parties to avoid future mutual intrusion.
 436| 
 437| IMPORTANT:
 438| Do NOT encode this as "Ming ruled Joseon guilty."
 439| Encode as mediation/superior imperial-order intervention amid conflicting accounts.
 440| 
 441| RELATIONS:
 442| - 선덕제 -> 조선 : MEDIATION / IMPERIAL_ORDER
 443| - 선덕제 -> Jurchen actors : MEDIATION / IMPERIAL_ORDER
 444| - 이만주 side -> Ming : CLAIM
 445| - Joseon -> Ming : CLAIM
 446| 
```
</details>

## 6. `E1434_0803#0` — local intelligence → court

| 항목 | 내용 |
|---|---|
| 사건 ID | `E1434_0803` 범찰 첩보와 회령 지휘 논의: 도발 대신 은밀한 관찰 |
| 날짜 | 기사일 1434-08-03 · 관계 시각 1434년 8월 3일 · 사건 dateBasis `court_act_on_record_date` |
| 근거 줄 | `pack_v1:E1434_0803:RELATIONS:L477` “local intelligence -> court : INTELLIGENCE” |
| 원문 subject / object | local intelligence / court |
| 정규화 subject / object | `GRP_1434_INTEL_SOURCE` 1434 범찰 관련 첩보 출처(미상) / `JO_SEJONG` 세종 |
| 현재 edge | `GRP_1434_INTEL_SOURCE` 1434 범찰 관련 첩보 출처(미상) → `JO_SEJONG` 세종 · INTELLIGENCE · `report_rumor` · 시각 1434년 8월 3일 · 인과 UNKNOWN · 근거 NORMALIZED |
| 적용 규칙 | `R4_group_placeholder` + `R1_court_recipient` |
| R1 적용 이유 | 원문 수신자 토큰 'court' → 세종 (조정 수신자 → 군주 노드) |
| 같은 pack 항목 WHO에 세종 | 있음 (WHO: 세종, 범찰, 최윤덕, 이징옥, 하한, 심도원, 안숭선) |

**원문 수신자 후보**(검토 메모 — 판정 아님)

| 세종 개인 | 왕/국왕 | 조선 조정 | 의정부 | 특정 관청 | 불명 |
|---|---|---|---|---|---|
| 후보 — WHAT L474 'Sejong accepted Ahn Sung-seon's proposal' — 최종 결정자는 세종(첩보 수신자 진술은 아님) |  | 후보 — 원문 토큰 'court'(L477). WHAT L471 'Court explicitly noted truth/falsity was uncertain' — 첩보를 평가한 주체를 조정으로 씀 |  |  |  |

**세종으로 정규화하지 않을 경우의 대안 edge**
- GRP_1434_INTEL_SOURCE → ORG_JOSEON_COURT (INTELLIGENCE)

**현재 edge가 중심성에 미치는 영향**(기본 입력 기준, 메모리 안 계산)
| 경우 | 세종 in-degree | 세종 betweenness | 세종 betweenness | 전체 도달 쌍 |
|---|---|---|---|---|
| 현재 | 48 | 858 | 858 | 1052 |
| 이 관계 제거 | 47 | 842 | 842 | 1035 |
| 수신자를 조선 조정(ORG_JOSEON_COURT)으로 | 47 | 850 | 850 | 1060 |

**판정** ☐ KEEP_AS_SEJONG ☐ CHANGE_TO_COURT ☐ CHANGE_TO_INSTITUTION ☐ DOWNGRADE_TO_INTERPRETATION ☐ REMOVE ☐ NEEDS_SOURCE  ·  검토자: ____  ·  메모: ____

<details><summary>원문 전체 문맥 — pack 항목 E1434_0803</summary>

```
 448| E1434_0803
 449| DATE: 1434-08-03
 450| TITLE: Debate over Fancha, defensive posture, and command at Hoeryŏng
 451| SOURCE:
 452| https://sillok.history.go.kr/id/kda_11608003_001
 453| 
 454| WHO:
 455| - 세종
 456| - 범찰
 457| - 최윤덕
 458| - 이징옥 李澄玉
 459| - 하한 河漢
 460| - 심도원 沈道源
 461| - 안숭선
 462| 
 463| WHERE:
 464| - 알목하
 465| - 영북진
 466| - 백안수소
 467| - 회령진
 468| 
 469| WHAT:
 470| - Intelligence suggested Fancha might harm the Yŏngbuk commander and move toward Pajŏ River.
 471| - Court explicitly noted truth/falsity was uncertain.
 472| - Debate over whether frontier commander should confront the claim or covertly observe.
 473| - Choe Yun-deok advocated moving experienced Yi Jing-ok to Hoeryŏng.
 474| - Sejong accepted Ahn Sung-seon's proposal to observe secretly rather than provoke on uncertain intelligence.
 475| 
 476| RELATIONS:
 477| - local intelligence -> court : INTELLIGENCE
 478| - 최윤덕 -> 세종 : POLICY_ADVICE
 479| - 안숭선 -> 세종 : POLICY_ADVICE
 480| - 세종 -> frontier : CAUTIOUS_MONITORING
 481| 
```
</details>

## 7. `E1435_0408#0` — field command → court

| 항목 | 내용 |
|---|---|
| 사건 ID | `E1435_0408` 함길도 입거민 생계·정착 문제 보고 |
| 날짜 | 기사일 1435-04-08 · 관계 시각 1435년 4월 8일 · 사건 dateBasis `report_receipt_on_record_date` |
| 근거 줄 | `pack_v1:E1435_0408:RELATIONS:L569` “field command -> court : REPORT” |
| 원문 subject / object | field command / court |
| 정규화 subject / object | `ORG_HAMGIL_DOJEOLJESA` 함길도 도절제사(실명 미기재) / `JO_SEJONG` 세종 |
| 현재 edge | `ORG_HAMGIL_DOJEOLJESA` 함길도 도절제사(실명 미기재) → `JO_SEJONG` 세종 · REPORT · `settler_condition_report` · 시각 1435년 4월 8일 · 인과 UNKNOWN · 근거 NORMALIZED |
| 적용 규칙 | `R5_content_actor` + `R1_court_recipient` |
| R1 적용 이유 | 원문 수신자 토큰 'court' → 세종 (조정 수신자 → 군주 노드) |
| 같은 pack 항목 WHO에 세종 | **없음** (WHO 절 없음) |

**원문 수신자 후보**(검토 메모 — 판정 아님)

| 세종 개인 | 왕/국왕 | 조선 조정 | 의정부 | 특정 관청 | 불명 |
|---|---|---|---|---|---|
|  |  | 후보 — 원문 토큰 'court'(L569) |  |  | 후보 — 이 항목에는 WHO 절이 없고 세종도 등장하지 않음 |

**세종으로 정규화하지 않을 경우의 대안 edge**
- ORG_HAMGIL_DOJEOLJESA → ORG_JOSEON_COURT (REPORT)

**현재 edge가 중심성에 미치는 영향**(기본 입력 기준, 메모리 안 계산)
| 경우 | 세종 in-degree | 세종 betweenness | 세종 betweenness | 전체 도달 쌍 |
|---|---|---|---|---|
| 현재 | 48 | 858 | 858 | 1052 |
| 이 관계 제거 | 47 | 843 | 843 | 1036 |
| 수신자를 조선 조정(ORG_JOSEON_COURT)으로 | 47 | 850 | 850 | 1060 |

**판정** ☐ KEEP_AS_SEJONG ☐ CHANGE_TO_COURT ☐ CHANGE_TO_INSTITUTION ☐ DOWNGRADE_TO_INTERPRETATION ☐ REMOVE ☐ NEEDS_SOURCE  ·  검토자: ____  ·  메모: ____

<details><summary>원문 전체 문맥 — pack 항목 E1435_0408</summary>

```
 557| E1435_0408
 558| DATE: 1435-04-08
 559| TITLE: Frontier livelihoods and settler retention
 560| SOURCE:
 561| https://sillok.history.go.kr/id/kda_11704008_004
 562| 
 563| WHAT:
 564| - Hamgil provincial commander reports problems of settlers,
 565|   cultivation, flight, agricultural cattle, warhorses.
 566| - Demonstrates that expansion/defense required continuous civilian settlement policy.
 567| 
 568| RELATIONS:
 569| - field command -> court : REPORT
 570| - state -> settlers : RESETTLEMENT / AGRICULTURAL_POLICY
 571| 
```
</details>

## 8. `E1436_1101#0` — 김종서 → court

| 항목 | 내용 |
|---|---|
| 사건 ID | `E1436_1101` 김종서·정흠지의 4군 방어 계책 |
| 날짜 | 기사일 1436-11-01 · 관계 시각 1436년 11월 1일 · 사건 dateBasis `court_act_on_record_date` |
| 근거 줄 | `pack_v1:E1436_1101:RELATIONS:L687` “김종서 -> court : POLICY_ADVICE” |
| 원문 subject / object | 김종서 / court |
| 정규화 subject / object | `JO_KIMJONGSEO` 김종서 / `JO_SEJONG` 세종 |
| 현재 edge | `JO_KIMJONGSEO` 김종서 → `JO_SEJONG` 세종 · POLICY · `propose_defense_plan` · 시각 1436년 11월 1일 · 인과 UNKNOWN · 근거 NORMALIZED |
| 적용 규칙 | `R1_court_recipient` |
| R1 적용 이유 | 원문 수신자 토큰 'court' → 세종 (조정 수신자 → 군주 노드) |
| 같은 pack 항목 WHO에 세종 | **없음** (WHO: 김종서, 정흠지) |

**원문 수신자 후보**(검토 메모 — 판정 아님)

| 세종 개인 | 왕/국왕 | 조선 조정 | 의정부 | 특정 관청 | 불명 |
|---|---|---|---|---|---|
|  |  | 후보 — 원문 토큰 'court'(L687) · WHO L680 'central government' |  |  | 후보 — 항목 WHO에 세종이 없음 — 세종 개인을 수신자로 볼 항목 내 근거 없음 |

**세종으로 정규화하지 않을 경우의 대안 edge**
- JO_KIMJONGSEO → ORG_JOSEON_COURT (POLICY)

**현재 edge가 중심성에 미치는 영향**(기본 입력 기준, 메모리 안 계산)
| 경우 | 세종 in-degree | 세종 betweenness | 세종 betweenness | 전체 도달 쌍 |
|---|---|---|---|---|
| 현재 | 48 | 858 | 858 | 1052 |
| 이 관계 제거 | 47 | 858 | 858 | 1052 |
| 수신자를 조선 조정(ORG_JOSEON_COURT)으로 | 47 | 959 | 959 | 1166 |

**판정** ☐ KEEP_AS_SEJONG ☐ CHANGE_TO_COURT ☐ CHANGE_TO_INSTITUTION ☐ DOWNGRADE_TO_INTERPRETATION ☐ REMOVE ☐ NEEDS_SOURCE  ·  검토자: ____  ·  메모: ____

<details><summary>원문 전체 문맥 — pack 항목 E1436_1101</summary>

```
 671| E1436_1101
 672| DATE: 1436-11-01
 673| TITLE: Four Counties defense plans submitted
 674| SOURCE:
 675| https://sillok.history.go.kr/id/kda_11811001_005
 676| 
 677| WHO:
 678| - 김종서
 679| - 정흠지
 680| - central government
 681| 
 682| WHAT:
 683| - Kim Jong-seo and Jeong Heum-ji separately submitted plans concerning
 684|   defense of the Four Counties area.
 685| 
 686| RELATIONS:
 687| - 김종서 -> court : POLICY_ADVICE
 688| - 정흠지 -> court : POLICY_ADVICE
 689| 
```
</details>

## 9. `E1436_1101#1` — 정흠지 → court

| 항목 | 내용 |
|---|---|
| 사건 ID | `E1436_1101` 김종서·정흠지의 4군 방어 계책 |
| 날짜 | 기사일 1436-11-01 · 관계 시각 1436년 11월 1일 · 사건 dateBasis `court_act_on_record_date` |
| 근거 줄 | `pack_v1:E1436_1101:RELATIONS:L688` “정흠지 -> court : POLICY_ADVICE” |
| 원문 subject / object | 정흠지 / court |
| 정규화 subject / object | `JO_JEONGHEUMJI` 정흠지 / `JO_SEJONG` 세종 |
| 현재 edge | `JO_JEONGHEUMJI` 정흠지 → `JO_SEJONG` 세종 · POLICY · `propose_defense_plan` · 시각 1436년 11월 1일 · 인과 UNKNOWN · 근거 NORMALIZED |
| 적용 규칙 | `R1_court_recipient` |
| R1 적용 이유 | 원문 수신자 토큰 'court' → 세종 (조정 수신자 → 군주 노드) |
| 같은 pack 항목 WHO에 세종 | **없음** (WHO: 김종서, 정흠지) |

**원문 수신자 후보**(검토 메모 — 판정 아님)

| 세종 개인 | 왕/국왕 | 조선 조정 | 의정부 | 특정 관청 | 불명 |
|---|---|---|---|---|---|
|  |  | 후보 — 원문 토큰 'court'(L688) · WHO L680 'central government' |  |  | 후보 — 항목 WHO에 세종이 없음 |

**세종으로 정규화하지 않을 경우의 대안 edge**
- JO_JEONGHEUMJI → ORG_JOSEON_COURT (POLICY)

**현재 edge가 중심성에 미치는 영향**(기본 입력 기준, 메모리 안 계산)
| 경우 | 세종 in-degree | 세종 betweenness | 세종 betweenness | 전체 도달 쌍 |
|---|---|---|---|---|
| 현재 | 48 | 858 | 858 | 1052 |
| 이 관계 제거 | 47 | 858 | 858 | 1052 |
| 수신자를 조선 조정(ORG_JOSEON_COURT)으로 | 47 | 881 | 881 | 1088 |

**판정** ☐ KEEP_AS_SEJONG ☐ CHANGE_TO_COURT ☐ CHANGE_TO_INSTITUTION ☐ DOWNGRADE_TO_INTERPRETATION ☐ REMOVE ☐ NEEDS_SOURCE  ·  검토자: ____  ·  메모: ____

<details><summary>원문 전체 문맥 — pack 항목 E1436_1101</summary>

```
 671| E1436_1101
 672| DATE: 1436-11-01
 673| TITLE: Four Counties defense plans submitted
 674| SOURCE:
 675| https://sillok.history.go.kr/id/kda_11811001_005
 676| 
 677| WHO:
 678| - 김종서
 679| - 정흠지
 680| - central government
 681| 
 682| WHAT:
 683| - Kim Jong-seo and Jeong Heum-ji separately submitted plans concerning
 684|   defense of the Four Counties area.
 685| 
 686| RELATIONS:
 687| - 김종서 -> court : POLICY_ADVICE
 688| - 정흠지 -> court : POLICY_ADVICE
 689| 
```
</details>

## 10. `E1436_1127#3` — 김종서 → court

| 항목 | 내용 |
|---|---|
| 사건 ID | `E1436_1127` 4군 방어책 시행·화포 교습관 배치·이징옥 유시 |
| 날짜 | 기사일 1436-11-27 · 관계 시각 1436년 11월 27일 · 사건 dateBasis `court_act_on_record_date` |
| 근거 줄 | `pack_v1:E1436_1127:RELATIONS:L716` “김종서 -> court : POLICY_ADVICE” |
| 원문 subject / object | 김종서 / court |
| 정규화 subject / object | `JO_KIMJONGSEO` 김종서 / `JO_SEJONG` 세종 |
| 현재 edge | `JO_KIMJONGSEO` 김종서 → `JO_SEJONG` 세종 · POLICY · `advise_headquarters` · 시각 1436년 11월 27일 · 인과 UNKNOWN · 근거 NORMALIZED |
| 적용 규칙 | `R1_court_recipient` |
| R1 적용 이유 | 원문 수신자 토큰 'court' → 세종 (조정 수신자 → 군주 노드) |
| 같은 pack 항목 WHO에 세종 | 있음 (WHO: 세종, 이징옥, 김종서, 정흠지, 병조) |

**원문 수신자 후보**(검토 메모 — 판정 아님)

| 세종 개인 | 왕/국왕 | 조선 조정 | 의정부 | 특정 관청 | 불명 |
|---|---|---|---|---|---|
| 후보 — WHO L701 세종 — 같은 기사에서 세종이 이징옥에게 지시(L709) |  | 후보 — 원문 토큰 'court'(L716) |  | 후보 — WHO L705 병조 · WHAT L710 병조의 4군 방어책 시행 — 다만 건의 수신자로 명시되지는 않음 |  |

**세종으로 정규화하지 않을 경우의 대안 edge**
- JO_KIMJONGSEO → ORG_JOSEON_COURT (POLICY)
- JO_KIMJONGSEO → ORG_BYEONGJO (기존 기관 노드)
- 김종서·정흠지 이견(L712)을 서로 사이의 undirected POLICY로 — 새 해석이므로 사람 판정 후에만

**현재 edge가 중심성에 미치는 영향**(기본 입력 기준, 메모리 안 계산)
| 경우 | 세종 in-degree | 세종 betweenness | 세종 betweenness | 전체 도달 쌍 |
|---|---|---|---|---|
| 현재 | 48 | 858 | 858 | 1052 |
| 이 관계 제거 | 47 | 858 | 858 | 1052 |
| 수신자를 조선 조정(ORG_JOSEON_COURT)으로 | 47 | 959 | 959 | 1166 |

**판정** ☐ KEEP_AS_SEJONG ☐ CHANGE_TO_COURT ☐ CHANGE_TO_INSTITUTION ☐ DOWNGRADE_TO_INTERPRETATION ☐ REMOVE ☐ NEEDS_SOURCE  ·  검토자: ____  ·  메모: ____

<details><summary>원문 전체 문맥 — pack 항목 E1436_1127</summary>

```
 691| E1436_1127
 692| DATE: 1436-11-27
 693| TITLE: Personnel, firearms and Four Counties defense
 694| DAY INDEX:
 695| https://sillok.history.go.kr/search/inspectionDayList.do?did=kda_11811027&id=kda_118110
 696| 
 697| VERIFIED SUBARTICLE:
 698| https://sillok.history.go.kr/id/kda_11811027_001
 699| 
 700| WHO:
 701| - 세종
 702| - 이징옥
 703| - 김종서
 704| - 정흠지
 705| - 병조
 706| - frontier officials
 707| 
 708| WHAT:
 709| - Sejong instructed Yi Jing-ok about combining force with humane treatment.
 710| - Military ministry's Four Counties defense policy ordered into effect.
 711| - Firearms training officials assigned to Jasŏng, Gangye etc.
 712| - Kim Jong-seo and Jeong Heum-ji disagreed over moving headquarters.
 713| 
 714| RELATIONS:
 715| - central -> frontier : COMMAND / DEFENSE_REFORM
 716| - 김종서 -> court : POLICY_ADVICE
 717| - 정흠지 -> court : POLICY_DISAGREEMENT
 718| 
```
</details>

## 11. `E1436_1127#4` — 정흠지 → court

| 항목 | 내용 |
|---|---|
| 사건 ID | `E1436_1127` 4군 방어책 시행·화포 교습관 배치·이징옥 유시 |
| 날짜 | 기사일 1436-11-27 · 관계 시각 1436년 11월 27일 · 사건 dateBasis `court_act_on_record_date` |
| 근거 줄 | `pack_v1:E1436_1127:RELATIONS:L717` “정흠지 -> court : POLICY_DISAGREEMENT” |
| 원문 subject / object | 정흠지 / court |
| 정규화 subject / object | `JO_JEONGHEUMJI` 정흠지 / `JO_SEJONG` 세종 |
| 현재 edge | `JO_JEONGHEUMJI` 정흠지 → `JO_SEJONG` 세종 · POLICY · `dissent_headquarters_move` · 시각 1436년 11월 27일 · 인과 UNKNOWN · 근거 NORMALIZED |
| 적용 규칙 | `R1_court_recipient` |
| R1 적용 이유 | 원문 수신자 토큰 'court' → 세종 (조정 수신자 → 군주 노드) |
| 같은 pack 항목 WHO에 세종 | 있음 (WHO: 세종, 이징옥, 김종서, 정흠지, 병조) |

**원문 수신자 후보**(검토 메모 — 판정 아님)

| 세종 개인 | 왕/국왕 | 조선 조정 | 의정부 | 특정 관청 | 불명 |
|---|---|---|---|---|---|
| 후보 — WHO L701 세종 |  | 후보 — 원문 토큰 'court'(L717) |  | 후보 — WHO L705 병조(수신자 명시 아님) |  |

**세종으로 정규화하지 않을 경우의 대안 edge**
- JO_JEONGHEUMJI → ORG_JOSEON_COURT (POLICY)
- JO_JEONGHEUMJI → ORG_BYEONGJO (기존 기관 노드)

**현재 edge가 중심성에 미치는 영향**(기본 입력 기준, 메모리 안 계산)
| 경우 | 세종 in-degree | 세종 betweenness | 세종 betweenness | 전체 도달 쌍 |
|---|---|---|---|---|
| 현재 | 48 | 858 | 858 | 1052 |
| 이 관계 제거 | 47 | 858 | 858 | 1052 |
| 수신자를 조선 조정(ORG_JOSEON_COURT)으로 | 47 | 881 | 881 | 1088 |

**판정** ☐ KEEP_AS_SEJONG ☐ CHANGE_TO_COURT ☐ CHANGE_TO_INSTITUTION ☐ DOWNGRADE_TO_INTERPRETATION ☐ REMOVE ☐ NEEDS_SOURCE  ·  검토자: ____  ·  메모: ____

<details><summary>원문 전체 문맥 — pack 항목 E1436_1127</summary>

```
 691| E1436_1127
 692| DATE: 1436-11-27
 693| TITLE: Personnel, firearms and Four Counties defense
 694| DAY INDEX:
 695| https://sillok.history.go.kr/search/inspectionDayList.do?did=kda_11811027&id=kda_118110
 696| 
 697| VERIFIED SUBARTICLE:
 698| https://sillok.history.go.kr/id/kda_11811027_001
 699| 
 700| WHO:
 701| - 세종
 702| - 이징옥
 703| - 김종서
 704| - 정흠지
 705| - 병조
 706| - frontier officials
 707| 
 708| WHAT:
 709| - Sejong instructed Yi Jing-ok about combining force with humane treatment.
 710| - Military ministry's Four Counties defense policy ordered into effect.
 711| - Firearms training officials assigned to Jasŏng, Gangye etc.
 712| - Kim Jong-seo and Jeong Heum-ji disagreed over moving headquarters.
 713| 
 714| RELATIONS:
 715| - central -> frontier : COMMAND / DEFENSE_REFORM
 716| - 김종서 -> court : POLICY_ADVICE
 717| - 정흠지 -> court : POLICY_DISAGREEMENT
 718| 
```
</details>

## 12. `E1437_0922#4` — 최정안 → (수신자 미기재: 조정)

| 항목 | 내용 |
|---|---|
| 사건 ID | `E1437_0922` 제2차 파저강 정벌 승첩 보고 |
| 날짜 | 기사일 1437-09-22 · 관계 시각 1437년 9월 22일 · 사건 dateBasis `pack_event_range` |
| 근거 줄 | `pack_v1:E1437_0922:WHO:L805` “최정안 mentioned as separate victory reporter” |
| 원문 subject / object | 최정안 / (수신자 미기재: 조정) |
| 정규화 subject / object | `JO_CHOEJEONGAN` 최정안 / `JO_SEJONG` 세종 |
| 현재 edge | `JO_CHOEJEONGAN` 최정안 → `JO_SEJONG` 세종 · REPORT · `separate_victory_report` · 시각 1437년 9월 22일 · 인과 UNKNOWN · 근거 NORMALIZED |
| 적용 규칙 | `R5_content_actor` + `R1_court_recipient` · 검토 표시 RECIPIENT_IMPLICIT |
| R1 적용 이유 | 원문 수신자 토큰 '(수신자 미기재: 조정)' → 세종 (조정 수신자 → 군주 노드) |
| 같은 pack 항목 WHO에 세종 | **없음** (WHO: 이천, 이화, 정덕성, 최정안 mentioned as separate victory reporter) |

**원문 수신자 후보**(검토 메모 — 판정 아님)

| 세종 개인 | 왕/국왕 | 조선 조정 | 의정부 | 특정 관청 | 불명 |
|---|---|---|---|---|---|
|  |  | 후보 — 같은 항목 L821 'field -> court : VICTORY_REPORT' |  |  | 후보 — WHO L805 '최정안 mentioned as separate victory reporter' — 수신자 미기재 |

**세종으로 정규화하지 않을 경우의 대안 edge**
- JO_CHOEJEONGAN → ORG_JOSEON_COURT (REPORT)
- 관계 없이 informationSources로만 기록

**현재 edge가 중심성에 미치는 영향**(기본 입력 기준, 메모리 안 계산)
| 경우 | 세종 in-degree | 세종 betweenness | 세종 betweenness | 전체 도달 쌍 |
|---|---|---|---|---|
| 현재 | 48 | 858 | 858 | 1052 |
| 이 관계 제거 | 47 | 849 | 849 | 1042 |
| 수신자를 조선 조정(ORG_JOSEON_COURT)으로 | 47 | 857 | 857 | 1057 |

**판정** ☐ KEEP_AS_SEJONG ☐ CHANGE_TO_COURT ☐ CHANGE_TO_INSTITUTION ☐ DOWNGRADE_TO_INTERPRETATION ☐ REMOVE ☐ NEEDS_SOURCE  ·  검토자: ____  ·  메모: ____

<details><summary>원문 전체 문맥 — pack 항목 E1437_0922</summary>

```
 793| E1437_0922
 794| EVENT DATES: 1437-09-07 through 09-16
 795| RECORD DATE: 1437-09-22
 796| TITLE: Second Pajŏ River expedition victory report
 797| SOURCE:
 798| https://sillok.history.go.kr/id/wda_11909022_001
 799| 
 800| WHO:
 801| - 이천
 802| - 이화
 803| - 정덕성
 804| - various unnamed forces
 805| - 최정안 mentioned as separate victory reporter
 806| 
 807| WHAT:
 808| - Three armies crossed Yalu.
 809| - Multiple settlements/farms searched/burned.
 810| - fighting on several days.
 811| - firearms used when enemy attacked formation.
 812| - reported total enemy killed/captured: 60.
 813| - Joseon loss reported: one Hwanghae volunteer killed by arrow.
 814| 
 815| IMPORTANT:
 816| All military outcome numbers are contemporary Joseon reports.
 817| 
 818| RELATIONS:
 819| - Yi Cheon command network : COMMAND
 820| - Joseon armies -> target settlements : MILITARY_ACTION
 821| - field -> court : VICTORY_REPORT
 822| 
```
</details>

## 13. `E1439_0510#2` — 김종서 → court

| 항목 | 내용 |
|---|---|
| 사건 ID | `E1439_0510` 거을가개 사망 헛소문과 김종서의 진정 |
| 날짜 | 기사일 1439-05-10 · 관계 시각 1439년 5월 10일 · 사건 dateBasis `before_record_date` |
| 근거 줄 | `pack_v1:E1439_0510:RELATIONS:L878` “김종서 -> court : REPORT” |
| 원문 subject / object | 김종서 / court |
| 정규화 subject / object | `JO_KIMJONGSEO` 김종서 / `JO_SEJONG` 세종 |
| 현재 edge | `JO_KIMJONGSEO` 김종서 → `JO_SEJONG` 세종 · REPORT · `chigye` · 시각 1439년 5월 10일 · 인과 UNKNOWN · 근거 NORMALIZED |
| 적용 규칙 | `R1_court_recipient` |
| R1 적용 이유 | 원문 수신자 토큰 'court' → 세종 (조정 수신자 → 군주 노드) |
| 같은 pack 항목 WHO에 세종 | **없음** (WHO: 김종서, 거을가개, 도을온, 조석강) |

**원문 수신자 후보**(검토 메모 — 판정 아님)

| 세종 개인 | 왕/국왕 | 조선 조정 | 의정부 | 특정 관청 | 불명 |
|---|---|---|---|---|---|
|  |  | 후보 — 원문 토큰 'court'(L878) |  |  | 후보 — DOCUMENT L873 documentType = 치계 — 문서 유형 이름이 수신자를 함축하는지는 pack이 말하지 않음(사람 확인) |

**세종으로 정규화하지 않을 경우의 대안 edge**
- JO_KIMJONGSEO → ORG_JOSEON_COURT (REPORT)

**현재 edge가 중심성에 미치는 영향**(기본 입력 기준, 메모리 안 계산)
| 경우 | 세종 in-degree | 세종 betweenness | 세종 betweenness | 전체 도달 쌍 |
|---|---|---|---|---|
| 현재 | 48 | 858 | 858 | 1052 |
| 이 관계 제거 | 47 | 858 | 858 | 1052 |
| 수신자를 조선 조정(ORG_JOSEON_COURT)으로 | 47 | 942 | 942 | 1147 |

**판정** ☐ KEEP_AS_SEJONG ☐ CHANGE_TO_COURT ☐ CHANGE_TO_INSTITUTION ☐ DOWNGRADE_TO_INTERPRETATION ☐ REMOVE ☐ NEEDS_SOURCE  ·  검토자: ____  ·  메모: ____

<details><summary>원문 전체 문맥 — pack 항목 E1439_0510</summary>

```
 852| E1439_0510
 853| DATE: 1439-05-10
 854| TITLE: Kim Jong-seo reports rumor-triggered revenge mobilization risk
 855| SOURCE:
 856| https://sillok.history.go.kr/id/kda_12105010_001
 857| 
 858| WHO:
 859| - 김종서
 860| - 거을가개
 861| - 도을온
 862| - 조석강
 863| - local Jurchen actors
 864| 
 865| WHAT:
 866| - A false rumor about Gŏŭl-gagae's death spread.
 867| - His descendants and associates reportedly considered retaliation.
 868| - Doŭl-on informed Kim Jong-seo.
 869| - Kim explained the rumor was false and de-escalated the situation.
 870| 
 871| DOCUMENT:
 872| embeddedDocumentAuthor = 김종서
 873| documentType = 치계
 874| 
 875| RELATIONS:
 876| - 도을온 -> 김종서 : INTELLIGENCE
 877| - 김종서 -> Jurchen actors : DIPLOMATIC_DEESCALATION
 878| - 김종서 -> court : REPORT
 879| 
```
</details>

## 14. `E1440_0407#3` — 김종서 → central

| 항목 | 내용 |
|---|---|
| 사건 ID | `E1440_0407` 살해 소문으로 동요한 동창·범찰 무리와 김종서의 대응 |
| 날짜 | 기사일 1440-04-07 · 관계 시각 1440년 4월 7일 · 사건 dateBasis `before_record_date` |
| 근거 줄 | `pack_v1:E1440_0407:RELATIONS:L957` “김종서 -> central : REPORT” |
| 원문 subject / object | 김종서 / central |
| 정규화 subject / object | `JO_KIMJONGSEO` 김종서 / `JO_SEJONG` 세종 |
| 현재 edge | `JO_KIMJONGSEO` 김종서 → `JO_SEJONG` 세종 · REPORT · `situation_report` · 시각 1440년 4월 7일 · 인과 UNKNOWN · 근거 NORMALIZED |
| 적용 규칙 | `R1_court_recipient` |
| R1 적용 이유 | 원문 수신자 토큰 'central' → 세종 (조정 수신자 → 군주 노드) |
| 같은 pack 항목 WHO에 세종 | **없음** (WHO: 김종서, 동자음파, 동창, 범찰) |

**원문 수신자 후보**(검토 메모 — 판정 아님)

| 세종 개인 | 왕/국왕 | 조선 조정 | 의정부 | 특정 관청 | 불명 |
|---|---|---|---|---|---|
|  |  | 후보 — 원문 토큰 'central'(L957) · WHO 'provincial observer / central government' |  | 후보 — WHO의 'provincial observer'(감사)가 보고 경로에 있는지 수신자인지 원문이 구분하지 않음 |  |

**세종으로 정규화하지 않을 경우의 대안 edge**
- JO_KIMJONGSEO → ORG_JOSEON_COURT (REPORT)

**현재 edge가 중심성에 미치는 영향**(기본 입력 기준, 메모리 안 계산)
| 경우 | 세종 in-degree | 세종 betweenness | 세종 betweenness | 전체 도달 쌍 |
|---|---|---|---|---|
| 현재 | 48 | 858 | 858 | 1052 |
| 이 관계 제거 | 47 | 858 | 858 | 1052 |
| 수신자를 조선 조정(ORG_JOSEON_COURT)으로 | 47 | 982 | 982 | 1187 |

**판정** ☐ KEEP_AS_SEJONG ☐ CHANGE_TO_COURT ☐ CHANGE_TO_INSTITUTION ☐ DOWNGRADE_TO_INTERPRETATION ☐ REMOVE ☐ NEEDS_SOURCE  ·  검토자: ____  ·  메모: ____

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

## 15. `E1440_1126#0` — field administration → court

| 항목 | 내용 |
|---|---|
| 사건 ID | `E1440_1126` 함길도 진보 이설·신설에 필요한 병력 산정 |
| 날짜 | 기사일 1440-11-26 · 관계 시각 1440년 11월 26일 · 사건 dateBasis `report_receipt_on_record_date` |
| 근거 줄 | `pack_v1:E1440_1126:RELATIONS:L974` “field administration -> court : DEFENSE_PLANNING” |
| 원문 subject / object | field administration / court |
| 정규화 subject / object | `ORG_HAMGIL_FIELD` 함길도 감사·도절제사 등 도 관아(구분·실명 미기재) / `JO_SEJONG` 세종 |
| 현재 edge | `ORG_HAMGIL_FIELD` 함길도 감사·도절제사 등 도 관아(구분·실명 미기재) → `JO_SEJONG` 세종 · FORTIFICATION · `defense_planning_report` · 시각 1440년 11월 26일 · 인과 UNKNOWN · 근거 NORMALIZED |
| 적용 규칙 | `R5_content_actor` + `R1_court_recipient` + `R6_layer_normalize` |
| R1 적용 이유 | 원문 수신자 토큰 'court' → 세종 (조정 수신자 → 군주 노드) |
| 같은 pack 항목 WHO에 세종 | **없음** (WHO 절 없음) |

**원문 수신자 후보**(검토 메모 — 판정 아님)

| 세종 개인 | 왕/국왕 | 조선 조정 | 의정부 | 특정 관청 | 불명 |
|---|---|---|---|---|---|
|  |  | 후보 — 원문 토큰 'court'(L974) |  |  | 후보 — WHO 절 없음, 세종 미등장 |

**세종으로 정규화하지 않을 경우의 대안 edge**
- ORG_HAMGIL_FIELD → ORG_JOSEON_COURT (FORTIFICATION)

**현재 edge가 중심성에 미치는 영향**(기본 입력 기준, 메모리 안 계산)
| 경우 | 세종 in-degree | 세종 betweenness | 세종 betweenness | 전체 도달 쌍 |
|---|---|---|---|---|
| 현재 | 48 | 858 | 858 | 1052 |
| 이 관계 제거 | 47 | 850 | 850 | 1043 |
| 수신자를 조선 조정(ORG_JOSEON_COURT)으로 | 47 | 857 | 857 | 1057 |

**판정** ☐ KEEP_AS_SEJONG ☐ CHANGE_TO_COURT ☐ CHANGE_TO_INSTITUTION ☐ DOWNGRADE_TO_INTERPRETATION ☐ REMOVE ☐ NEEDS_SOURCE  ·  검토자: ____  ·  메모: ____

<details><summary>원문 전체 문맥 — pack 항목 E1440_1126</summary>

```
 960| E1440_1126
 961| DATE: 1440-11-26
 962| TITLE: Detailed force requirements for northeastern defensive network
 963| SOURCE:
 964| https://sillok.history.go.kr/id/kda_12211026_005
 965| 
 966| WHAT:
 967| - Hamgil governor/commander assesses relocation of forts and new settlements.
 968| - Gives explicit troop requirements:
 969|   300, 400, 400, 1,000 etc depending on positions.
 970| - Total c. 2,100 regular soldiers required for proposed new/relocated positions.
 971| - Emphasis on mutual visibility, relief and defensible geography.
 972| 
 973| RELATIONS:
 974| - field administration -> court : DEFENSE_PLANNING
 975| - state -> frontier : TROOP_ALLOCATION / FORTIFICATION
 976| 
```
</details>

## 16. `E1441_0519#0` — 황보인 → court

| 항목 | 내용 |
|---|---|
| 사건 ID | `E1441_0519` 건원보를 아산으로 이설 |
| 날짜 | 기사일 1441-05-19 · 관계 시각 1441년 5월 19일 이전(정확한 시점 미상) · 사건 dateBasis `court_act_on_record_date` |
| 근거 줄 | `pack_v1:E1441_0519:RELATIONS:L1015` “황보인 -> court : DEFENSE_ADVICE” |
| 원문 subject / object | 황보인 / court |
| 정규화 subject / object | `JO_HWANGBOIN` 황보인 / `JO_SEJONG` 세종 |
| 현재 edge | `JO_HWANGBOIN` 황보인 → `JO_SEJONG` 세종 · FORTIFICATION · `propose_fort_relocation` · 시각 1441년 5월 19일 이전(정확한 시점 미상) · 인과 UNKNOWN · 근거 NORMALIZED |
| 적용 규칙 | `R1_court_recipient` + `R6_layer_normalize` |
| R1 적용 이유 | 원문 수신자 토큰 'court' → 세종 (조정 수신자 → 군주 노드) |
| 같은 pack 항목 WHO에 세종 | **없음** (WHO: 황보인) |

**원문 수신자 후보**(검토 메모 — 판정 아님)

| 세종 개인 | 왕/국왕 | 조선 조정 | 의정부 | 특정 관청 | 불명 |
|---|---|---|---|---|---|
|  |  | 후보 — 원문 토큰 'court'(L1015) · WHAT L1011 'at Hwangbo In's request'(요청 상대 미기재) |  |  | 후보 — WHO에 황보인만 있음 |

**세종으로 정규화하지 않을 경우의 대안 edge**
- JO_HWANGBOIN → ORG_JOSEON_COURT (FORTIFICATION)

**현재 edge가 중심성에 미치는 영향**(기본 입력 기준, 메모리 안 계산)
- 이 관계는 기본 분석 입력(CERTAIN_ORDER)에 들어가지 않는다(시각 1441년 5월 19일 이전(정확한 시점 미상)) — 기본 중심성 영향 0. 화면·TEMPORALLY_NOT_EXCLUDED 경로에는 나타난다.

**판정** ☐ KEEP_AS_SEJONG ☐ CHANGE_TO_COURT ☐ CHANGE_TO_INSTITUTION ☐ DOWNGRADE_TO_INTERPRETATION ☐ REMOVE ☐ NEEDS_SOURCE  ·  검토자: ____  ·  메모: ____

<details><summary>원문 전체 문맥 — pack 항목 E1441_0519</summary>

```
1001| E1441_0519
1002| DATE: 1441-05-19
1003| TITLE: Strategic post moved to Asanjang
1004| SOURCE:
1005| https://sillok.history.go.kr/id/kda_12305019_002
1006| 
1007| WHO:
1008| - 황보인
1009| 
1010| WHAT:
1011| - Geonwon post abolished/moved to Asanjang at Hwangbo In's request.
1012| - Asan described as strategic point for Kyŏngwŏn.
1013| 
1014| RELATIONS:
1015| - 황보인 -> court : DEFENSE_ADVICE
1016| - state -> frontier : FORT_RELOCATION
1017| 
```
</details>

## 17. `E1443_1023#0` — 동소로가무 → court

| 항목 | 내용 |
|---|---|
| 사건 ID | `E1443_1023` 동소로가무의 합공 제안과 조정의 제한적 수용 |
| 날짜 | 기사일 1443-10-23 · 관계 시각 1443년 10월 23일 이전(정확한 시점 미상) · 사건 dateBasis `court_act_on_record_date` |
| 근거 줄 | `pack_v1:E1443_1023:RELATIONS:L1096` “동소로가무 -> court : MILITARY_PROPOSAL” |
| 원문 subject / object | 동소로가무 / court |
| 정규화 subject / object | `JZ_DONGSOROGAMU` 동소로가무 / `JO_SEJONG` 세종 |
| 현재 edge | `JZ_DONGSOROGAMU` 동소로가무 → `JO_SEJONG` 세종 · DIPLOMACY · `propose_joint_attack_and_walls` · 시각 1443년 10월 23일 이전(정확한 시점 미상) · 인과 UNKNOWN · 근거 NORMALIZED |
| 적용 규칙 | `R1_court_recipient` + `R6_layer_normalize` |
| R1 적용 이유 | 원문 수신자 토큰 'court' → 세종 (조정 수신자 → 군주 노드) |
| 같은 pack 항목 WHO에 세종 | **없음** (WHO: 동소로가무, 도을온, 낭복아한, 예조, 의정부) |

**원문 수신자 후보**(검토 메모 — 판정 아님)

| 세종 개인 | 왕/국왕 | 조선 조정 | 의정부 | 특정 관청 | 불명 |
|---|---|---|---|---|---|
|  |  | 후보 — 원문 토큰 'court'(L1096) · L1089 'Court accepted wall/administrative aspects' | 후보 — WHO L1082 의정부 | 후보 — WHO L1081 예조(사신·외교 담당 관청으로 등장) | 후보 — 항목 WHO에 세종이 없음 — 세종 개인을 수신자로 볼 항목 내 근거 없음 |

**세종으로 정규화하지 않을 경우의 대안 edge**
- JZ_DONGSOROGAMU → ORG_JOSEON_COURT (DIPLOMACY)
- JZ_DONGSOROGAMU → ORG_UIJEONGBU 또는 ORG_YEJO (기존 기관 노드)

**현재 edge가 중심성에 미치는 영향**(기본 입력 기준, 메모리 안 계산)
- 이 관계는 기본 분석 입력(CERTAIN_ORDER)에 들어가지 않는다(시각 1443년 10월 23일 이전(정확한 시점 미상)) — 기본 중심성 영향 0. 화면·TEMPORALLY_NOT_EXCLUDED 경로에는 나타난다.

**판정** ☐ KEEP_AS_SEJONG ☐ CHANGE_TO_COURT ☐ CHANGE_TO_INSTITUTION ☐ DOWNGRADE_TO_INTERPRETATION ☐ REMOVE ☐ NEEDS_SOURCE  ·  검토자: ____  ·  메모: ____

<details><summary>원문 전체 문맥 — pack 항목 E1443_1023</summary>

```
1071| E1443_1023
1072| DATE: 1443-10-23
1073| TITLE: Dong Sorogamu proposes joint attack; court declines to commit
1074| SOURCE:
1075| https://sillok.history.go.kr/id/kda_12510023_003
1076| 
1077| WHO:
1078| - 동소로가무 童所老加茂
1079| - 도을온
1080| - 낭복아한
1081| - 예조
1082| - 의정부
1083| - Hoeryŏng commander
1084| 
1085| WHAT:
1086| - Dong Sorogamu asked for wall construction and regulation of envoys.
1087| - Proposed using Five Garrisons troops together with Jurchen allies
1088|   to destroy Guju Udige.
1089| - Court accepted wall/administrative aspects but avoided approving
1090|   the offensive proposal.
1091| 
1092| SIGNIFICANCE:
1093| Strong case of alliance/attack proposal being limited by court.
1094| 
1095| RELATIONS:
1096| - 동소로가무 -> court : MILITARY_PROPOSAL
1097| - court -> 동소로가무 : LIMITED_ACCEPTANCE / NON_ESCALATION
1098| 
```
</details>

## 18. `E1447_04L10#0` — 황보인 → court

| 항목 | 내용 |
|---|---|
| 사건 ID | `E1447_04L10` 황보인의 서북·동북 변경 통합 재편 보고 |
| 날짜 | 기사일 1447-04L-10 · 관계 시각 1447년 윤4월 10일 · 사건 dateBasis `report_receipt_on_record_date` |
| 근거 줄 | `pack_v1:E1447_LUNAR4_10:RELATIONS:L1237` “황보인 -> court : POLICY_REPORT” |
| 원문 subject / object | 황보인 / court |
| 정규화 subject / object | `JO_HWANGBOIN` 황보인 / `JO_SEJONG` 세종 |
| 현재 edge | `JO_HWANGBOIN` 황보인 → `JO_SEJONG` 세종 · REPORT · `policy_report` · 시각 1447년 윤4월 10일 · 인과 UNKNOWN · 근거 NORMALIZED |
| 적용 규칙 | `R1_court_recipient` |
| R1 적용 이유 | 원문 수신자 토큰 'court' → 세종 (조정 수신자 → 군주 노드) |
| 같은 pack 항목 WHO에 세종 | **없음** (WHO: 황보인) |

**원문 수신자 후보**(검토 메모 — 판정 아님)

| 세종 개인 | 왕/국왕 | 조선 조정 | 의정부 | 특정 관청 | 불명 |
|---|---|---|---|---|---|
|  |  | 후보 — 원문 토큰 'court'(L1237) · WHO 'central government' |  |  | 후보 — 항목 WHO에 세종이 없음 |

**세종으로 정규화하지 않을 경우의 대안 edge**
- JO_HWANGBOIN → ORG_JOSEON_COURT (REPORT)

**현재 edge가 중심성에 미치는 영향**(기본 입력 기준, 메모리 안 계산)
| 경우 | 세종 in-degree | 세종 betweenness | 세종 betweenness | 전체 도달 쌍 |
|---|---|---|---|---|
| 현재 | 48 | 858 | 858 | 1052 |
| 이 관계 제거 | 47 | 858 | 858 | 1052 |
| 수신자를 조선 조정(ORG_JOSEON_COURT)으로 | 47 | 858 | 858 | 1053 |

**판정** ☐ KEEP_AS_SEJONG ☐ CHANGE_TO_COURT ☐ CHANGE_TO_INSTITUTION ☐ DOWNGRADE_TO_INTERPRETATION ☐ REMOVE ☐ NEEDS_SOURCE  ·  검토자: ____  ·  메모: ____

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

