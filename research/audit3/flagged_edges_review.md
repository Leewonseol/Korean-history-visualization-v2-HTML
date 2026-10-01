# 검토 표시(flag) 관계 재검토표

> 자동 생성: `node tools/audit-round3.mjs` · 대상 19건. **판정 칸은 비어 있다 — 자동 판정하지 않는다.**
> 판정 선택지: KEEP(유지) / DOWNGRADE_TO_INTERPRETATION(해석으로 내림) / SPLIT(관계 분리) / REMOVE(관계 삭제) / NEEDS_SOURCE(원문 확인 필요).
> 대안·유지 근거는 `tools/audit3-notes.mjs`의 검토 메모이며 판정이 아니다.

## 요약표

| # | relation | 현재 edge | 규칙 | 검토 표시 | 판정 | 검토자 |
|---|---|---|---|---|---|---|
| 1 | `E1432_1209#3` | 평안도 감사(실명 미기재) → 세종 (REPORT) | R5_content_actor + R1_court_recipient | RECIPIENT_IMPLICIT |  |  |
| 2 | `E1432_1211#10` | 정흠지 → 세종 (POLICY) | R5_content_actor | RECIPIENT_FROM_ENTRY_RELATION |  |  |
| 3 | `E1433_0516A#0` | 세종 → 최윤덕 (REWARD) | R3_who_expansion + R6_layer_normalize | CROSS_ENTRY_MEMBERSHIP |  |  |
| 4 | `E1433_0516A#1` | 세종 → 이순몽 (REWARD) | R3_who_expansion + R6_layer_normalize | CROSS_ENTRY_MEMBERSHIP |  |  |
| 5 | `E1433_0516A#2` | 세종 → 이각 (REWARD) | R3_who_expansion + R6_layer_normalize | CROSS_ENTRY_MEMBERSHIP |  |  |
| 6 | `E1433_0516A#3` | 세종 → 이징석 (REWARD) | R3_who_expansion + R6_layer_normalize | CROSS_ENTRY_MEMBERSHIP |  |  |
| 7 | `E1433_0516A#4` | 세종 → 김효성 (REWARD) | R3_who_expansion + R6_layer_normalize | CROSS_ENTRY_MEMBERSHIP |  |  |
| 8 | `E1433_0516A#5` | 세종 → 홍사석 (REWARD) | R3_who_expansion + R6_layer_normalize | CROSS_ENTRY_MEMBERSHIP |  |  |
| 9 | `E1433_0610#0` | 맹가첩목아 → 지함 (DIPLOMACY) | R5_content_actor + R6_layer_normalize | RECIPIENT_SUBSTITUTED |  |  |
| 10 | `E1433_0610#1` | 맹가첩목아 → 임합라 (COUNTER_CLAIM) | R5_content_actor | ABOUT_RELATION |  |  |
| 11 | `E1433_0610#2` | 맹가첩목아 → 이만주 (COUNTER_CLAIM) | R5_content_actor | ABOUT_RELATION |  |  |
| 12 | `E1433_08L10#8` | 이만주 → 선덕제 (CLAIM) | R3_who_expansion + R1_court_recipient | SIDE_TO_PERSON |  |  |
| 13 | `E1435_0113#0` | 오량합 기병(1435-01 여연성 포위, 약 2,700기) → 1435-01 여연성 수비 군사(부상 4·사망 1) (MILITARY_CONFLICT) | R4_group_placeholder | PLACE_AS_TARGET |  |  |
| 14 | `E1437_0922#4` | 최정안 → 세종 (REPORT) | R5_content_actor + R1_court_recipient | RECIPIENT_IMPLICIT |  |  |
| 15 | `E1446_0420#0` | 1446 무창 침입자 50여 명(세력 미특정) → 1446 무창 피살 5·피랍 17명 (MILITARY_CONFLICT) | R4_group_placeholder | PLACE_AS_TARGET |  |  |
| 16 | `E1448_0307#6` | 하연 → 세종 (POLICY) | R5_content_actor | RECIPIENT_FROM_ENTRY_RELATION |  |  |
| 17 | `E1448_0307#7` | 박종우 → 세종 (POLICY) | R5_content_actor | RECIPIENT_FROM_ENTRY_RELATION |  |  |
| 18 | `E1448_0307#8` | 김종서 → 세종 (POLICY) | R5_content_actor | RECIPIENT_FROM_ENTRY_RELATION |  |  |
| 19 | `E1448_0307#9` | 정분 → 세종 (POLICY) | R5_content_actor | RECIPIENT_FROM_ENTRY_RELATION |  |  |

## 1. `E1432_1209#3` — RECIPIENT_IMPLICIT

**현재 edge** `ORG_PYEONGAN_GAMSA` 평안도 감사(실명 미기재) → `JO_SEJONG` 세종 · REPORT · `frontier_report` · 시각 1432년 12월 9일 · 확실성 confirmed · 인과 UNKNOWN · 근거 NORMALIZED

**적용 규칙** `R5_content_actor` (본문(WHAT·WHO·KEY CONTENT)에 명시된 행위자) + `R1_court_recipient` (조정 수신자 → 군주 노드) · 주체 규칙 R5_content_actor · 객체 규칙 R1_court_recipient

**근거 줄** `pack_v1:E1432_1209:WHO:L37` “평안도 감사 [reporting institution/officeholder not named in excerpt]” — 원문 주체/객체: 평안도 감사 → (수신자 미기재: 조정)

**대안 가능한 해석**
- 수신자를 세종이 아니라 ORG_JOSEON_COURT(조정 자리표시자)로 둔다 — WHO L37은 보고 주체만 말하고 수신자를 쓰지 않음
- 관계로 만들지 않고 사건의 informationSources(정보원)로만 기록한다

**현재 해석을 유지할 근거**
- 실록 기사가 '평안도 감사의 보고'를 싣고 있으므로 보고가 조정에 도달했다는 것은 기사 자체가 보여 줌(R1 관례)
- 같은 사건의 다른 보고 관계(E1433_0507#1 '박호문 -> court')와 표현 방식이 일관됨

**판정** ☐ KEEP ☐ DOWNGRADE_TO_INTERPRETATION ☐ SPLIT ☐ REMOVE ☐ NEEDS_SOURCE  ·  검토자: ____  ·  메모: ____

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

## 2. `E1432_1211#10` — RECIPIENT_FROM_ENTRY_RELATION

**현재 edge** `JO_JEONGHEUMJI` 정흠지 → `JO_SEJONG` 세종 · POLICY · `advise_firearms_training` · 시각 1432년 12월 11일 · 확실성 confirmed · 인과 UNKNOWN · 근거 NORMALIZED

**적용 규칙** `R5_content_actor` (본문(WHAT·WHO·KEY CONTENT)에 명시된 행위자) · 주체 규칙 R5_content_actor

**근거 줄** `pack_v1:E1432_1211:KEY CONTENT:L91` “Yi Cheon, Choe Hae-san, Jeong Heum-ji and others argued for first sending” — 원문 주체/객체: Jeong Heum-ji → (협의 소집자 세종)
- 보조 근거 `pack_v1:E1432_1211:RELATIONS:L98` “세종 -> listed ministers/generals : POLICY_CONSULTATION”

**대안 가능한 해석**
- 정흠지의 주장은 협의 자리 안의 발언 — 세종 한 사람이 아니라 협의 참여자 전체를 향함(undirected POLICY 또는 관계 없음)
- KEY CONTENT L91의 'and others'처럼 집단 주장이므로 개별 edge 대신 사건 속성으로 둔다

**현재 해석을 유지할 근거**
- 같은 항목 RELATIONS에 '이천 -> 세종 : POLICY_ADVICE'(L99)·'최해산 -> 세종'(L101)이 있어, 같은 문장(L91)에 함께 나온 정흠지에게 같은 방향을 준 것
- L91이 정흠지를 주장 주체로 실명 명시(R5 입력 패턴)

**판정** ☐ KEEP ☐ DOWNGRADE_TO_INTERPRETATION ☐ SPLIT ☐ REMOVE ☐ NEEDS_SOURCE  ·  검토자: ____  ·  메모: ____

<details><summary>원문 전체 문맥 — pack 항목 E1432_1211</summary>

```
  65| E1432_1211
  66| DATE: 1432-12-11
  67| TITLE: Central military consultation immediately after Yŏyŏn invasion
  68| SOURCE:
  69| https://sillok.history.go.kr/id/kda_11412011_004
  70| 
  71| WHO:
  72| - 세종
  73| - 최윤덕 崔閏德
  74| - 허조 許稠
  75| - 하경복 河敬復
  76| - 정흠지 鄭欽之
  77| - 조말생 趙末生
  78| - 이천 李蕆
  79| - 최해산 崔海山
  80| - 안숭선 安崇善
  81| 
  82| WHERE:
  83| - royal court / central government
  84| THEATER: CENTRAL
  85| 
  86| HOW:
  87| - consultation on firearms, fortification, training and frontier defense
  88| 
  89| KEY CONTENT:
  90| - Discussion of artillery already deployed to Yŏyŏn and Gangye.
  91| - Yi Cheon, Choe Hae-san, Jeong Heum-ji and others argued for first sending
  92|   officials/artisans to teach firearm use and supplying iron projectiles.
  93| - Discussion of stone walls or wooden palisades at defensive posts.
  94| - Yi Cheon is therefore already directly inside the northern-defense policy
  95|   network two days after the 1432 invasion.
  96| 
  97| RELATIONS:
  98| - 세종 -> listed ministers/generals : POLICY_CONSULTATION
  99| - 이천 -> 세종 : POLICY_ADVICE
 100| - 최윤덕 -> 세종 : POLICY_ADVICE
 101| - 최해산 -> 세종 : MILITARY_TECH_ADVICE
 102| 
```
</details>

## 3. `E1433_0516A#0` — CROSS_ENTRY_MEMBERSHIP

**현재 edge** `JO_SEJONG` 세종 → `JO_CHOEYUNDEOK` 최윤덕 · REWARD · `promotion_for_campaign_merit` · 시각 1433년 5월 16일 · 확실성 confirmed · 인과 EXPLICIT_CAUSAL · 근거 NORMALIZED

**적용 규칙** `R3_who_expansion` (집합·일반 지칭 → 명시된 구성원) + `R6_layer_normalize` (pack 관계 라벨 → layer (비일대일 매핑)) · 객체 규칙 R3_who_expansion

**근거 줄** `pack_v1:E1433_0516_A:RELATIONS:L327` “세종 -> campaign commanders : REWARD / APPOINTMENT” — 원문 주체/객체: 세종 → campaign commanders
- 구성원 근거 `pack_v1:E1433_0516_A:WHO:L303` “최윤덕”
- 구성원 근거 `pack_v1:E1433_0507:MAJOR COMMANDERS AND FORCE SIZES:L261` “최윤덕: 2,599”

**대안 가능한 해석**
- 0516_A 기사 자체만으로는 WHO 18명 중 누가 'campaign commanders'인지 확정할 수 없음 → NEEDS_SOURCE
- WHO 전원(18명)에게 제수 관계를 주는 것은 R3 금지 사례(집합 소속 근거 없음)이므로 대안이 아님 — 대안은 '관계 보류'

**현재 해석을 유지할 근거**
- 5/7 보고(E1433_0507)의 지휘관 명단 6명이 모두 5/16 WHO에 실명으로 있음(구성원 근거 2줄씩 trace에 기록)
- 5/7 명단의 최해산은 5/16 WHO에 없고 데이터에도 제수 관계가 없음 — 명단을 기계적으로 옮기지 않았다는 점은 확인됨

**판정** ☐ KEEP ☐ DOWNGRADE_TO_INTERPRETATION ☐ SPLIT ☐ REMOVE ☐ NEEDS_SOURCE  ·  검토자: ____  ·  메모: ____

<details><summary>원문 전체 문맥 — pack 항목 E1433_0516_A</summary>

```
 296| E1433_0516_A
 297| DATE: 1433-05-16
 298| TITLE: Promotions following first campaign
 299| SOURCE:
 300| https://sillok.history.go.kr/id/kda_11505016_003
 301| 
 302| WHO:
 303| - 최윤덕
 304| - 권진
 305| - 이순몽
 306| - 안순
 307| - 이각
 308| - 이징석
 309| - 이숙치
 310| - 박안신
 311| - 남지
 312| - 김효성
 313| - 홍사석
 314| - 이사관
 315| - 권복
 316| - 안구경
 317| - 허조
 318| - 맹사성
 319| - 김종서
 320| - 세종
 321| 
 322| WHAT:
 323| - Offices/promotions assigned.
 324| - Explicit context: reward of commanders' merit.
 325| 
 326| RELATIONS:
 327| - 세종 -> campaign commanders : REWARD / APPOINTMENT
 328| 
```
</details>

## 4. `E1433_0516A#1` — CROSS_ENTRY_MEMBERSHIP

**현재 edge** `JO_SEJONG` 세종 → `JO_LEESUNMONG` 이순몽 · REWARD · `promotion_for_campaign_merit` · 시각 1433년 5월 16일 · 확실성 confirmed · 인과 EXPLICIT_CAUSAL · 근거 NORMALIZED

**적용 규칙** `R3_who_expansion` (집합·일반 지칭 → 명시된 구성원) + `R6_layer_normalize` (pack 관계 라벨 → layer (비일대일 매핑)) · 객체 규칙 R3_who_expansion

**근거 줄** `pack_v1:E1433_0516_A:RELATIONS:L327` “세종 -> campaign commanders : REWARD / APPOINTMENT” — 원문 주체/객체: 세종 → campaign commanders
- 구성원 근거 `pack_v1:E1433_0516_A:WHO:L305` “이순몽”
- 구성원 근거 `pack_v1:E1433_0507:MAJOR COMMANDERS AND FORCE SIZES:L262` “이순몽: 2,515”

**대안 가능한 해석**
- 0516_A 기사 자체만으로는 WHO 18명 중 누가 'campaign commanders'인지 확정할 수 없음 → NEEDS_SOURCE
- WHO 전원(18명)에게 제수 관계를 주는 것은 R3 금지 사례(집합 소속 근거 없음)이므로 대안이 아님 — 대안은 '관계 보류'

**현재 해석을 유지할 근거**
- 5/7 보고(E1433_0507)의 지휘관 명단 6명이 모두 5/16 WHO에 실명으로 있음(구성원 근거 2줄씩 trace에 기록)
- 5/7 명단의 최해산은 5/16 WHO에 없고 데이터에도 제수 관계가 없음 — 명단을 기계적으로 옮기지 않았다는 점은 확인됨

**판정** ☐ KEEP ☐ DOWNGRADE_TO_INTERPRETATION ☐ SPLIT ☐ REMOVE ☐ NEEDS_SOURCE  ·  검토자: ____  ·  메모: ____

<details><summary>원문 전체 문맥 — pack 항목 E1433_0516_A</summary>

```
 296| E1433_0516_A
 297| DATE: 1433-05-16
 298| TITLE: Promotions following first campaign
 299| SOURCE:
 300| https://sillok.history.go.kr/id/kda_11505016_003
 301| 
 302| WHO:
 303| - 최윤덕
 304| - 권진
 305| - 이순몽
 306| - 안순
 307| - 이각
 308| - 이징석
 309| - 이숙치
 310| - 박안신
 311| - 남지
 312| - 김효성
 313| - 홍사석
 314| - 이사관
 315| - 권복
 316| - 안구경
 317| - 허조
 318| - 맹사성
 319| - 김종서
 320| - 세종
 321| 
 322| WHAT:
 323| - Offices/promotions assigned.
 324| - Explicit context: reward of commanders' merit.
 325| 
 326| RELATIONS:
 327| - 세종 -> campaign commanders : REWARD / APPOINTMENT
 328| 
```
</details>

## 5. `E1433_0516A#2` — CROSS_ENTRY_MEMBERSHIP

**현재 edge** `JO_SEJONG` 세종 → `JO_LEEGAK` 이각 · REWARD · `promotion_for_campaign_merit` · 시각 1433년 5월 16일 · 확실성 confirmed · 인과 EXPLICIT_CAUSAL · 근거 NORMALIZED

**적용 규칙** `R3_who_expansion` (집합·일반 지칭 → 명시된 구성원) + `R6_layer_normalize` (pack 관계 라벨 → layer (비일대일 매핑)) · 객체 규칙 R3_who_expansion

**근거 줄** `pack_v1:E1433_0516_A:RELATIONS:L327` “세종 -> campaign commanders : REWARD / APPOINTMENT” — 원문 주체/객체: 세종 → campaign commanders
- 구성원 근거 `pack_v1:E1433_0516_A:WHO:L307` “이각”
- 구성원 근거 `pack_v1:E1433_0507:MAJOR COMMANDERS AND FORCE SIZES:L264` “이각 李恪: 1,770”

**대안 가능한 해석**
- 0516_A 기사 자체만으로는 WHO 18명 중 누가 'campaign commanders'인지 확정할 수 없음 → NEEDS_SOURCE
- WHO 전원(18명)에게 제수 관계를 주는 것은 R3 금지 사례(집합 소속 근거 없음)이므로 대안이 아님 — 대안은 '관계 보류'

**현재 해석을 유지할 근거**
- 5/7 보고(E1433_0507)의 지휘관 명단 6명이 모두 5/16 WHO에 실명으로 있음(구성원 근거 2줄씩 trace에 기록)
- 5/7 명단의 최해산은 5/16 WHO에 없고 데이터에도 제수 관계가 없음 — 명단을 기계적으로 옮기지 않았다는 점은 확인됨

**판정** ☐ KEEP ☐ DOWNGRADE_TO_INTERPRETATION ☐ SPLIT ☐ REMOVE ☐ NEEDS_SOURCE  ·  검토자: ____  ·  메모: ____

<details><summary>원문 전체 문맥 — pack 항목 E1433_0516_A</summary>

```
 296| E1433_0516_A
 297| DATE: 1433-05-16
 298| TITLE: Promotions following first campaign
 299| SOURCE:
 300| https://sillok.history.go.kr/id/kda_11505016_003
 301| 
 302| WHO:
 303| - 최윤덕
 304| - 권진
 305| - 이순몽
 306| - 안순
 307| - 이각
 308| - 이징석
 309| - 이숙치
 310| - 박안신
 311| - 남지
 312| - 김효성
 313| - 홍사석
 314| - 이사관
 315| - 권복
 316| - 안구경
 317| - 허조
 318| - 맹사성
 319| - 김종서
 320| - 세종
 321| 
 322| WHAT:
 323| - Offices/promotions assigned.
 324| - Explicit context: reward of commanders' merit.
 325| 
 326| RELATIONS:
 327| - 세종 -> campaign commanders : REWARD / APPOINTMENT
 328| 
```
</details>

## 6. `E1433_0516A#3` — CROSS_ENTRY_MEMBERSHIP

**현재 edge** `JO_SEJONG` 세종 → `JO_LEEJINGSEOK` 이징석 · REWARD · `promotion_for_campaign_merit` · 시각 1433년 5월 16일 · 확실성 confirmed · 인과 EXPLICIT_CAUSAL · 근거 NORMALIZED

**적용 규칙** `R3_who_expansion` (집합·일반 지칭 → 명시된 구성원) + `R6_layer_normalize` (pack 관계 라벨 → layer (비일대일 매핑)) · 객체 규칙 R3_who_expansion

**근거 줄** `pack_v1:E1433_0516_A:RELATIONS:L327` “세종 -> campaign commanders : REWARD / APPOINTMENT” — 원문 주체/객체: 세종 → campaign commanders
- 구성원 근거 `pack_v1:E1433_0516_A:WHO:L308` “이징석”
- 구성원 근거 `pack_v1:E1433_0507:MAJOR COMMANDERS AND FORCE SIZES:L265` “이징석 李澄石: 3,010”

**대안 가능한 해석**
- 0516_A 기사 자체만으로는 WHO 18명 중 누가 'campaign commanders'인지 확정할 수 없음 → NEEDS_SOURCE
- WHO 전원(18명)에게 제수 관계를 주는 것은 R3 금지 사례(집합 소속 근거 없음)이므로 대안이 아님 — 대안은 '관계 보류'

**현재 해석을 유지할 근거**
- 5/7 보고(E1433_0507)의 지휘관 명단 6명이 모두 5/16 WHO에 실명으로 있음(구성원 근거 2줄씩 trace에 기록)
- 5/7 명단의 최해산은 5/16 WHO에 없고 데이터에도 제수 관계가 없음 — 명단을 기계적으로 옮기지 않았다는 점은 확인됨

**판정** ☐ KEEP ☐ DOWNGRADE_TO_INTERPRETATION ☐ SPLIT ☐ REMOVE ☐ NEEDS_SOURCE  ·  검토자: ____  ·  메모: ____

<details><summary>원문 전체 문맥 — pack 항목 E1433_0516_A</summary>

```
 296| E1433_0516_A
 297| DATE: 1433-05-16
 298| TITLE: Promotions following first campaign
 299| SOURCE:
 300| https://sillok.history.go.kr/id/kda_11505016_003
 301| 
 302| WHO:
 303| - 최윤덕
 304| - 권진
 305| - 이순몽
 306| - 안순
 307| - 이각
 308| - 이징석
 309| - 이숙치
 310| - 박안신
 311| - 남지
 312| - 김효성
 313| - 홍사석
 314| - 이사관
 315| - 권복
 316| - 안구경
 317| - 허조
 318| - 맹사성
 319| - 김종서
 320| - 세종
 321| 
 322| WHAT:
 323| - Offices/promotions assigned.
 324| - Explicit context: reward of commanders' merit.
 325| 
 326| RELATIONS:
 327| - 세종 -> campaign commanders : REWARD / APPOINTMENT
 328| 
```
</details>

## 7. `E1433_0516A#4` — CROSS_ENTRY_MEMBERSHIP

**현재 edge** `JO_SEJONG` 세종 → `JO_KIMHYOSEONG` 김효성 · REWARD · `promotion_for_campaign_merit` · 시각 1433년 5월 16일 · 확실성 confirmed · 인과 EXPLICIT_CAUSAL · 근거 NORMALIZED

**적용 규칙** `R3_who_expansion` (집합·일반 지칭 → 명시된 구성원) + `R6_layer_normalize` (pack 관계 라벨 → layer (비일대일 매핑)) · 객체 규칙 R3_who_expansion

**근거 줄** `pack_v1:E1433_0516_A:RELATIONS:L327` “세종 -> campaign commanders : REWARD / APPOINTMENT” — 원문 주체/객체: 세종 → campaign commanders
- 구성원 근거 `pack_v1:E1433_0516_A:WHO:L312` “김효성”
- 구성원 근거 `pack_v1:E1433_0507:MAJOR COMMANDERS AND FORCE SIZES:L266` “김효성 金孝誠: 1,888”

**대안 가능한 해석**
- 0516_A 기사 자체만으로는 WHO 18명 중 누가 'campaign commanders'인지 확정할 수 없음 → NEEDS_SOURCE
- WHO 전원(18명)에게 제수 관계를 주는 것은 R3 금지 사례(집합 소속 근거 없음)이므로 대안이 아님 — 대안은 '관계 보류'

**현재 해석을 유지할 근거**
- 5/7 보고(E1433_0507)의 지휘관 명단 6명이 모두 5/16 WHO에 실명으로 있음(구성원 근거 2줄씩 trace에 기록)
- 5/7 명단의 최해산은 5/16 WHO에 없고 데이터에도 제수 관계가 없음 — 명단을 기계적으로 옮기지 않았다는 점은 확인됨

**판정** ☐ KEEP ☐ DOWNGRADE_TO_INTERPRETATION ☐ SPLIT ☐ REMOVE ☐ NEEDS_SOURCE  ·  검토자: ____  ·  메모: ____

<details><summary>원문 전체 문맥 — pack 항목 E1433_0516_A</summary>

```
 296| E1433_0516_A
 297| DATE: 1433-05-16
 298| TITLE: Promotions following first campaign
 299| SOURCE:
 300| https://sillok.history.go.kr/id/kda_11505016_003
 301| 
 302| WHO:
 303| - 최윤덕
 304| - 권진
 305| - 이순몽
 306| - 안순
 307| - 이각
 308| - 이징석
 309| - 이숙치
 310| - 박안신
 311| - 남지
 312| - 김효성
 313| - 홍사석
 314| - 이사관
 315| - 권복
 316| - 안구경
 317| - 허조
 318| - 맹사성
 319| - 김종서
 320| - 세종
 321| 
 322| WHAT:
 323| - Offices/promotions assigned.
 324| - Explicit context: reward of commanders' merit.
 325| 
 326| RELATIONS:
 327| - 세종 -> campaign commanders : REWARD / APPOINTMENT
 328| 
```
</details>

## 8. `E1433_0516A#5` — CROSS_ENTRY_MEMBERSHIP

**현재 edge** `JO_SEJONG` 세종 → `JO_HONGSASEOK` 홍사석 · REWARD · `promotion_for_campaign_merit` · 시각 1433년 5월 16일 · 확실성 confirmed · 인과 EXPLICIT_CAUSAL · 근거 NORMALIZED

**적용 규칙** `R3_who_expansion` (집합·일반 지칭 → 명시된 구성원) + `R6_layer_normalize` (pack 관계 라벨 → layer (비일대일 매핑)) · 객체 규칙 R3_who_expansion

**근거 줄** `pack_v1:E1433_0516_A:RELATIONS:L327` “세종 -> campaign commanders : REWARD / APPOINTMENT” — 원문 주체/객체: 세종 → campaign commanders
- 구성원 근거 `pack_v1:E1433_0516_A:WHO:L313` “홍사석”
- 구성원 근거 `pack_v1:E1433_0507:MAJOR COMMANDERS AND FORCE SIZES:L267` “홍사석 洪師錫: 1,110”

**대안 가능한 해석**
- 0516_A 기사 자체만으로는 WHO 18명 중 누가 'campaign commanders'인지 확정할 수 없음 → NEEDS_SOURCE
- WHO 전원(18명)에게 제수 관계를 주는 것은 R3 금지 사례(집합 소속 근거 없음)이므로 대안이 아님 — 대안은 '관계 보류'

**현재 해석을 유지할 근거**
- 5/7 보고(E1433_0507)의 지휘관 명단 6명이 모두 5/16 WHO에 실명으로 있음(구성원 근거 2줄씩 trace에 기록)
- 5/7 명단의 최해산은 5/16 WHO에 없고 데이터에도 제수 관계가 없음 — 명단을 기계적으로 옮기지 않았다는 점은 확인됨

**판정** ☐ KEEP ☐ DOWNGRADE_TO_INTERPRETATION ☐ SPLIT ☐ REMOVE ☐ NEEDS_SOURCE  ·  검토자: ____  ·  메모: ____

<details><summary>원문 전체 문맥 — pack 항목 E1433_0516_A</summary>

```
 296| E1433_0516_A
 297| DATE: 1433-05-16
 298| TITLE: Promotions following first campaign
 299| SOURCE:
 300| https://sillok.history.go.kr/id/kda_11505016_003
 301| 
 302| WHO:
 303| - 최윤덕
 304| - 권진
 305| - 이순몽
 306| - 안순
 307| - 이각
 308| - 이징석
 309| - 이숙치
 310| - 박안신
 311| - 남지
 312| - 김효성
 313| - 홍사석
 314| - 이사관
 315| - 권복
 316| - 안구경
 317| - 허조
 318| - 맹사성
 319| - 김종서
 320| - 세종
 321| 
 322| WHAT:
 323| - Offices/promotions assigned.
 324| - Explicit context: reward of commanders' merit.
 325| 
 326| RELATIONS:
 327| - 세종 -> campaign commanders : REWARD / APPOINTMENT
 328| 
```
</details>

## 9. `E1433_0610#0` — RECIPIENT_SUBSTITUTED

**현재 edge** `JZ_MENGGETEMUR` 맹가첩목아 → `JO_JIHAM` 지함 · DIPLOMACY · `protest_and_statement_to_envoy` · 시각 1433년 6월 10일 이전(정확한 시점 미상) · 확실성 confirmed · 인과 EXPLICIT_CAUSAL · 근거 NORMALIZED

**적용 규칙** `R5_content_actor` (본문(WHAT·WHO·KEY CONTENT)에 명시된 행위자) + `R6_layer_normalize` (pack 관계 라벨 → layer (비일대일 매핑)) · 객체 규칙 R5_content_actor

**근거 줄** `pack_v1:E1433_0610:RELATIONS:L409` “맹가첩목아 -> 조선 : CLAIM / DIPLOMATIC_PROTEST” — 원문 주체/객체: 맹가첩목아 → 조선
- 보조 근거 `pack_v1:E1433_0610:WHAT:L399` “Ji Ham returned from Almuha and reported Menggetemur's statements.”

**대안 가능한 해석**
- 원문 그대로 수신자를 '조선' → ORG_JOSEON_COURT로 둔다(지함 대체를 취소)
- 맹가첩목아의 진술은 지함이 '들은 것'이므로 지함은 수신자가 아니라 전달자 — 진술 관계는 두지 않고 지함→세종 복명(#3)만 남긴다

**현재 해석을 유지할 근거**
- WHAT L399 '지함이 알목하에서 돌아와 맹가첩목아의 진술을 보고' — 진술을 직접 들은 사람이 지함임을 보여 줌
- 세종에게 직접 항의한 것처럼 그리면 지함이라는 전달 경로가 사라짐

**판정** ☐ KEEP ☐ DOWNGRADE_TO_INTERPRETATION ☐ SPLIT ☐ REMOVE ☐ NEEDS_SOURCE  ·  검토자: ____  ·  메모: ____

<details><summary>원문 전체 문맥 — pack 항목 E1433_0610</summary>

```
 386| E1433_0610
 387| DATE: 1433-06-10
 388| TITLE: Menggetemur conveys criticism of indiscriminate campaigning
 389| SOURCE:
 390| https://sillok.history.go.kr/id/wda_11506010_002
 391| 
 392| WHO:
 393| - 지함 池含
 394| - 맹가첩목아
 395| - 임합라
 396| - 이만주
 397| 
 398| WHAT:
 399| - Ji Ham returned from Almuha and reported Menggetemur's statements.
 400| - Menggetemur asserted that Im Hab-ra was the real leader of the attack
 401|   and Yi Manju had tried to stop it.
 402| - He criticized the campaign for failing to distinguish innocent from guilty.
 403| - Requested return of relatives captured at Pajŏ River.
 404| 
 405| CERTAINTY:
 406| This is a reported statement by Menggetemur, not independently established fact.
 407| 
 408| RELATIONS:
 409| - 맹가첩목아 -> 조선 : CLAIM / DIPLOMATIC_PROTEST
 410| - 지함 -> 세종 : REPORT
 411| 
```
</details>

## 10. `E1433_0610#1` — ABOUT_RELATION

**현재 edge** `JZ_MENGGETEMUR` 맹가첩목아 → `JZ_IMHALA` 임합라 · COUNTER_CLAIM · `identify_as_ringleader` · 시각 1433년 6월 10일 이전(정확한 시점 미상) · 확실성 contemporary_claim · 인과 UNKNOWN · 근거 NORMALIZED · 경로 제외

**적용 규칙** `R5_content_actor` (본문(WHAT·WHO·KEY CONTENT)에 명시된 행위자) · 주체 규칙 R5_content_actor · 객체 규칙 R5_content_actor

**근거 줄** `pack_v1:E1433_0610:WHAT:L400` “Menggetemur asserted that Im Hab-ra was the real leader of the attack” — 원문 주체/객체: Menggetemur → Im Hab-ra

**대안 가능한 해석**
- '~에 관한' 내용은 관계가 아니라 주장(claim) 텍스트이므로 edge를 없애고 사건 outcome의 주장 내용으로만 둔다(REMOVE)
- 현재처럼 edge로 두되 pathEligible:false로 경로·중심성에서 제외(현 상태)

**현재 해석을 유지할 근거**
- 맹가첩목아가 임합라를 주모자로, 이만주를 만류한 사람으로 지목했다는 것(WHAT L400-401)을 네트워크에서 볼 수 있게 함
- 경로·중심성 계산에는 이미 들어가지 않음

**판정** ☐ KEEP ☐ DOWNGRADE_TO_INTERPRETATION ☐ SPLIT ☐ REMOVE ☐ NEEDS_SOURCE  ·  검토자: ____  ·  메모: ____

<details><summary>원문 전체 문맥 — pack 항목 E1433_0610</summary>

```
 386| E1433_0610
 387| DATE: 1433-06-10
 388| TITLE: Menggetemur conveys criticism of indiscriminate campaigning
 389| SOURCE:
 390| https://sillok.history.go.kr/id/wda_11506010_002
 391| 
 392| WHO:
 393| - 지함 池含
 394| - 맹가첩목아
 395| - 임합라
 396| - 이만주
 397| 
 398| WHAT:
 399| - Ji Ham returned from Almuha and reported Menggetemur's statements.
 400| - Menggetemur asserted that Im Hab-ra was the real leader of the attack
 401|   and Yi Manju had tried to stop it.
 402| - He criticized the campaign for failing to distinguish innocent from guilty.
 403| - Requested return of relatives captured at Pajŏ River.
 404| 
 405| CERTAINTY:
 406| This is a reported statement by Menggetemur, not independently established fact.
 407| 
 408| RELATIONS:
 409| - 맹가첩목아 -> 조선 : CLAIM / DIPLOMATIC_PROTEST
 410| - 지함 -> 세종 : REPORT
 411| 
```
</details>

## 11. `E1433_0610#2` — ABOUT_RELATION

**현재 edge** `JZ_MENGGETEMUR` 맹가첩목아 → `JZ_MANJU` 이만주 · COUNTER_CLAIM · `exculpate` · 시각 1433년 6월 10일 이전(정확한 시점 미상) · 확실성 contemporary_claim · 인과 UNKNOWN · 근거 NORMALIZED · 경로 제외

**적용 규칙** `R5_content_actor` (본문(WHAT·WHO·KEY CONTENT)에 명시된 행위자) · 주체 규칙 R5_content_actor · 객체 규칙 R5_content_actor

**근거 줄** `pack_v1:E1433_0610:WHAT:L400` “Menggetemur asserted that Im Hab-ra was the real leader of the attack” — 원문 주체/객체: Menggetemur → Yi Manju
- 보조 근거 `pack_v1:E1433_0610:WHAT:L401` “and Yi Manju had tried to stop it.”

**대안 가능한 해석**
- '~에 관한' 내용은 관계가 아니라 주장(claim) 텍스트이므로 edge를 없애고 사건 outcome의 주장 내용으로만 둔다(REMOVE)
- 현재처럼 edge로 두되 pathEligible:false로 경로·중심성에서 제외(현 상태)

**현재 해석을 유지할 근거**
- 맹가첩목아가 임합라를 주모자로, 이만주를 만류한 사람으로 지목했다는 것(WHAT L400-401)을 네트워크에서 볼 수 있게 함
- 경로·중심성 계산에는 이미 들어가지 않음

**판정** ☐ KEEP ☐ DOWNGRADE_TO_INTERPRETATION ☐ SPLIT ☐ REMOVE ☐ NEEDS_SOURCE  ·  검토자: ____  ·  메모: ____

<details><summary>원문 전체 문맥 — pack 항목 E1433_0610</summary>

```
 386| E1433_0610
 387| DATE: 1433-06-10
 388| TITLE: Menggetemur conveys criticism of indiscriminate campaigning
 389| SOURCE:
 390| https://sillok.history.go.kr/id/wda_11506010_002
 391| 
 392| WHO:
 393| - 지함 池含
 394| - 맹가첩목아
 395| - 임합라
 396| - 이만주
 397| 
 398| WHAT:
 399| - Ji Ham returned from Almuha and reported Menggetemur's statements.
 400| - Menggetemur asserted that Im Hab-ra was the real leader of the attack
 401|   and Yi Manju had tried to stop it.
 402| - He criticized the campaign for failing to distinguish innocent from guilty.
 403| - Requested return of relatives captured at Pajŏ River.
 404| 
 405| CERTAINTY:
 406| This is a reported statement by Menggetemur, not independently established fact.
 407| 
 408| RELATIONS:
 409| - 맹가첩목아 -> 조선 : CLAIM / DIPLOMATIC_PROTEST
 410| - 지함 -> 세종 : REPORT
 411| 
```
</details>

## 12. `E1433_08L10#8` — SIDE_TO_PERSON

**현재 edge** `JZ_MANJU` 이만주 → `MING_XUANDE` 선덕제 · CLAIM · `prior_account_to_ming` · 시각 1433년 윤8월 10일 이전(정확한 시점 미상) · 확실성 confirmed · 인과 UNKNOWN · 근거 NORMALIZED

**적용 규칙** `R3_who_expansion` (집합·일반 지칭 → 명시된 구성원) + `R1_court_recipient` (조정 수신자 → 군주 노드) · 주체 규칙 R3_who_expansion · 객체 규칙 R1_court_recipient

**근거 줄** `pack_v1:E1433_0810:RELATIONS:L444` “이만주 side -> Ming : CLAIM” — 원문 주체/객체: 이만주 side → Ming
- 구성원 근거 `pack_v1:E1433_0810:WHO:L428` “이만주”
- 보조 근거 `pack_v1:E1433_0810:WHAT:L432` “Ming court received conflicting accounts.”

**대안 가능한 해석**
- '이만주 side'(이만주 측)는 개인이 아니라 집단 — 이만주 개인 노드 대신 별도 집단 표현이 필요(현재 데이터에 해당 노드 없음 → NEEDS_SOURCE)
- 관계를 두지 않고 칙서 사건의 주장 내용으로만 기록

**현재 해석을 유지할 근거**
- WHO L428에 이만주가 실명으로 있고 pack이 그 측의 주장을 명시(L444)
- pathEligible을 바꾸지 않는 한 이만주→선덕제 주장 경로가 지표에 들어가므로, 유지하려면 '측→개인' 축약을 받아들인다는 판단이 필요

**판정** ☐ KEEP ☐ DOWNGRADE_TO_INTERPRETATION ☐ SPLIT ☐ REMOVE ☐ NEEDS_SOURCE  ·  검토자: ____  ·  메모: ____

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

## 13. `E1435_0113#0` — PLACE_AS_TARGET

**현재 edge** `GRP_ORYANGHAP_1435` 오량합 기병(1435-01 여연성 포위, 약 2,700기) → `GRP_1435_YEOYEON_GARRISON` 1435-01 여연성 수비 군사(부상 4·사망 1) · MILITARY_CONFLICT · `siege` · 시각 1435년 1월 13일 · 확실성 confirmed · 인과 UNKNOWN · 근거 NORMALIZED

**적용 규칙** `R4_group_placeholder` (무명 집합 → group 노드) · 주체 규칙 R4_group_placeholder · 객체 규칙 R4_group_placeholder

**근거 줄** `pack_v1:E1435_0113:RELATIONS:L531` “Oryanghap -> Yŏyŏn : MILITARY_ATTACK” — 원문 주체/객체: Oryanghap → Yŏyŏn
- 보조 근거 `pack_v1:E1435_0113:WHO:L520` “unnamed soldiers”
- 보조 근거 `pack_v1:E1435_0113:WHAT:L524` “defenders fought from morning into afternoon.”

**대안 가능한 해석**
- 공격 대상을 장소(여연 / 무창)로만 기록하고 인물·집단 관계는 두지 않는다
- 피해 집단과의 관계는 남기되 R4가 아닌 해석으로 표시

**현재 해석을 유지할 근거**
- 같은 항목 WHO·WHAT이 피해자·수비자를 기록(1435: WHO L520 unnamed soldiers·WHAT L524 defenders fought / 1446: WHAT L1175-1176 피살 5·피랍 17)
- R4 명세의 PLACE_AS_TARGET 하위 패턴(2차 감사에서 명문화) — 다만 명문화 자체가 기존 데이터에 맞춘 것이므로 사람 확인 필요

**판정** ☐ KEEP ☐ DOWNGRADE_TO_INTERPRETATION ☐ SPLIT ☐ REMOVE ☐ NEEDS_SOURCE  ·  검토자: ____  ·  메모: ____

<details><summary>원문 전체 문맥 — pack 항목 E1435_0113</summary>

```
 507| E1435_0113
 508| EVENT DATE: 1435-01-13
 509| RECORD DATE: 1435-01-18
 510| TITLE: 2,700 Oryanghap cavalry besiege Yŏyŏn fortress
 511| SOURCE:
 512| https://sillok.history.go.kr/id/wda_11701018_002
 513| 
 514| WHO:
 515| - 김윤수 金允壽
 516| - 이진 李震
 517| - 여성렬 余成烈
 518| - 김수연 金壽延
 519| - Oryanghap force c. 2,700
 520| - unnamed soldiers
 521| 
 522| WHAT:
 523| - Yŏyŏn fortress besieged.
 524| - defenders fought from morning into afternoon.
 525| - Joseon report says c. 90 enemies / 60 horses hit.
 526| - Kim Yun-su wounded in thumb.
 527| - 4 soldiers wounded; 1 died.
 528| - reinforcement requested.
 529| 
 530| RELATIONS:
 531| - Oryanghap -> Yŏyŏn : MILITARY_ATTACK
 532| - 김윤수/이진/여성렬/김수연 -> defenders : COMMAND
 533| - defenders -> Oryanghap : DEFENSE
 534| 
```
</details>

## 14. `E1437_0922#4` — RECIPIENT_IMPLICIT

**현재 edge** `JO_CHOEJEONGAN` 최정안 → `JO_SEJONG` 세종 · REPORT · `separate_victory_report` · 시각 1437년 9월 22일 · 확실성 confirmed · 인과 UNKNOWN · 근거 NORMALIZED

**적용 규칙** `R5_content_actor` (본문(WHAT·WHO·KEY CONTENT)에 명시된 행위자) + `R1_court_recipient` (조정 수신자 → 군주 노드) · 주체 규칙 R5_content_actor · 객체 규칙 R1_court_recipient

**근거 줄** `pack_v1:E1437_0922:WHO:L805` “최정안 mentioned as separate victory reporter” — 원문 주체/객체: 최정안 → (수신자 미기재: 조정)
- 보조 근거 `pack_v1:E1437_0922:RELATIONS:L821` “field -> court : VICTORY_REPORT”

**대안 가능한 해석**
- 수신자를 ORG_JOSEON_COURT로 — WHO L805는 '별도 승첩 보고자'라고만 하고 수신자를 쓰지 않음
- 관계 대신 사건의 informationSources로만 기록

**현재 해석을 유지할 근거**
- 승첩 보고는 조정에 올리는 문서이며 같은 항목 RELATIONS L821 'field -> court : VICTORY_REPORT'가 수신자를 court로 명시(R1)

**판정** ☐ KEEP ☐ DOWNGRADE_TO_INTERPRETATION ☐ SPLIT ☐ REMOVE ☐ NEEDS_SOURCE  ·  검토자: ____  ·  메모: ____

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

## 15. `E1446_0420#0` — PLACE_AS_TARGET

**현재 edge** `GRP_1446_MUCHANG_RAIDERS` 1446 무창 침입자 50여 명(세력 미특정) → `GRP_1446_MUCHANG_VICTIMS` 1446 무창 피살 5·피랍 17명 · MILITARY_CONFLICT · `raid` · 시각 1446년 4월 20일 이전(정확한 시점 미상) · 확실성 confirmed · 인과 UNKNOWN · 근거 NORMALIZED

**적용 규칙** `R4_group_placeholder` (무명 집합 → group 노드) · 주체 규칙 R4_group_placeholder · 객체 규칙 R4_group_placeholder

**근거 줄** `pack_v1:E1446_0420:RELATIONS:L1183` “raiders -> Muchang : MILITARY_ATTACK” — 원문 주체/객체: raiders → Muchang
- 보조 근거 `pack_v1:E1446_0420:WHO:L1172` “50+ raiders”
- 보조 근거 `pack_v1:E1446_0420:WHAT:L1175` “5 people killed”
- 보조 근거 `pack_v1:E1446_0420:WHAT:L1176` “17 captured”

**대안 가능한 해석**
- 공격 대상을 장소(여연 / 무창)로만 기록하고 인물·집단 관계는 두지 않는다
- 피해 집단과의 관계는 남기되 R4가 아닌 해석으로 표시

**현재 해석을 유지할 근거**
- 같은 항목 WHO·WHAT이 피해자·수비자를 기록(1435: WHO L520 unnamed soldiers·WHAT L524 defenders fought / 1446: WHAT L1175-1176 피살 5·피랍 17)
- R4 명세의 PLACE_AS_TARGET 하위 패턴(2차 감사에서 명문화) — 다만 명문화 자체가 기존 데이터에 맞춘 것이므로 사람 확인 필요

**판정** ☐ KEEP ☐ DOWNGRADE_TO_INTERPRETATION ☐ SPLIT ☐ REMOVE ☐ NEEDS_SOURCE  ·  검토자: ____  ·  메모: ____

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

## 16. `E1448_0307#6` — RECIPIENT_FROM_ENTRY_RELATION

**현재 edge** `JO_HAYEON` 하연 → `JO_SEJONG` 세종 · POLICY · `advise_town_walls_first` · 시각 1448년 3월 7일 · 확실성 confirmed · 인과 UNKNOWN · 근거 NORMALIZED

**적용 규칙** `R5_content_actor` (본문(WHAT·WHO·KEY CONTENT)에 명시된 행위자) · 주체 규칙 R5_content_actor

**근거 줄** `pack_v1:E1448_0307:WHAT:L1279` “Ha Yeon, Park Jong-u, Kim Jong-seo and Jeong Bun argued for” — 원문 주체/객체: Ha Yeon → (협의 소집자 세종)
- 보조 근거 `pack_v1:E1448_0307:RELATIONS:L1284` “ministers -> 세종 : DEFENSE_ADVICE”

**대안 가능한 해석**
- 네 사람의 주장은 '논의 자리의 견해 표명' — 세종을 향한 개별 건의가 아니라 undirected POLICY 또는 사건 속성
- RELATIONS L1284 'ministers -> 세종 : DEFENSE_ADVICE'를 R3로 펼친 관계로 재분류(현재는 WHAT L1279 기준 R5)

**현재 해석을 유지할 근거**
- RELATIONS L1284가 '대신들 → 세종' 방향을 명시하고 WHAT L1279가 네 사람을 실명으로 명시

**판정** ☐ KEEP ☐ DOWNGRADE_TO_INTERPRETATION ☐ SPLIT ☐ REMOVE ☐ NEEDS_SOURCE  ·  검토자: ____  ·  메모: ____

<details><summary>원문 전체 문맥 — pack 항목 E1448_0307</summary>

```
1261| E1448_0307
1262| DATE: 1448-03-07
1263| TITLE: Debate over priority between long walls and town walls
1264| SOURCE:
1265| https://sillok.history.go.kr/id/kda_13003007_001
1266| 
1267| WHO:
1268| - 세종
1269| - 하연 河演
1270| - 황보인
1271| - 박종우
1272| - 김종서
1273| - 정분
1274| - 정갑손
1275| 
1276| WHAT:
1277| - Debate over whether to complete long frontier walls first
1278|   or town walls first.
1279| - Ha Yeon, Park Jong-u, Kim Jong-seo and Jeong Bun argued for
1280|   town walls as population refuges against major attacks.
1281| 
1282| RELATIONS:
1283| - 세종 -> senior ministers : POLICY_QUERY
1284| - ministers -> 세종 : DEFENSE_ADVICE
1285| 
```
</details>

## 17. `E1448_0307#7` — RECIPIENT_FROM_ENTRY_RELATION

**현재 edge** `JO_PARKJONGU` 박종우 → `JO_SEJONG` 세종 · POLICY · `advise_town_walls_first` · 시각 1448년 3월 7일 · 확실성 confirmed · 인과 UNKNOWN · 근거 NORMALIZED

**적용 규칙** `R5_content_actor` (본문(WHAT·WHO·KEY CONTENT)에 명시된 행위자) · 주체 규칙 R5_content_actor

**근거 줄** `pack_v1:E1448_0307:WHAT:L1279` “Ha Yeon, Park Jong-u, Kim Jong-seo and Jeong Bun argued for” — 원문 주체/객체: Park Jong-u → (협의 소집자 세종)
- 보조 근거 `pack_v1:E1448_0307:RELATIONS:L1284` “ministers -> 세종 : DEFENSE_ADVICE”

**대안 가능한 해석**
- 네 사람의 주장은 '논의 자리의 견해 표명' — 세종을 향한 개별 건의가 아니라 undirected POLICY 또는 사건 속성
- RELATIONS L1284 'ministers -> 세종 : DEFENSE_ADVICE'를 R3로 펼친 관계로 재분류(현재는 WHAT L1279 기준 R5)

**현재 해석을 유지할 근거**
- RELATIONS L1284가 '대신들 → 세종' 방향을 명시하고 WHAT L1279가 네 사람을 실명으로 명시

**판정** ☐ KEEP ☐ DOWNGRADE_TO_INTERPRETATION ☐ SPLIT ☐ REMOVE ☐ NEEDS_SOURCE  ·  검토자: ____  ·  메모: ____

<details><summary>원문 전체 문맥 — pack 항목 E1448_0307</summary>

```
1261| E1448_0307
1262| DATE: 1448-03-07
1263| TITLE: Debate over priority between long walls and town walls
1264| SOURCE:
1265| https://sillok.history.go.kr/id/kda_13003007_001
1266| 
1267| WHO:
1268| - 세종
1269| - 하연 河演
1270| - 황보인
1271| - 박종우
1272| - 김종서
1273| - 정분
1274| - 정갑손
1275| 
1276| WHAT:
1277| - Debate over whether to complete long frontier walls first
1278|   or town walls first.
1279| - Ha Yeon, Park Jong-u, Kim Jong-seo and Jeong Bun argued for
1280|   town walls as population refuges against major attacks.
1281| 
1282| RELATIONS:
1283| - 세종 -> senior ministers : POLICY_QUERY
1284| - ministers -> 세종 : DEFENSE_ADVICE
1285| 
```
</details>

## 18. `E1448_0307#8` — RECIPIENT_FROM_ENTRY_RELATION

**현재 edge** `JO_KIMJONGSEO` 김종서 → `JO_SEJONG` 세종 · POLICY · `advise_town_walls_first` · 시각 1448년 3월 7일 · 확실성 confirmed · 인과 UNKNOWN · 근거 NORMALIZED

**적용 규칙** `R5_content_actor` (본문(WHAT·WHO·KEY CONTENT)에 명시된 행위자) · 주체 규칙 R5_content_actor

**근거 줄** `pack_v1:E1448_0307:WHAT:L1279` “Ha Yeon, Park Jong-u, Kim Jong-seo and Jeong Bun argued for” — 원문 주체/객체: Kim Jong-seo → (협의 소집자 세종)
- 보조 근거 `pack_v1:E1448_0307:RELATIONS:L1284` “ministers -> 세종 : DEFENSE_ADVICE”

**대안 가능한 해석**
- 네 사람의 주장은 '논의 자리의 견해 표명' — 세종을 향한 개별 건의가 아니라 undirected POLICY 또는 사건 속성
- RELATIONS L1284 'ministers -> 세종 : DEFENSE_ADVICE'를 R3로 펼친 관계로 재분류(현재는 WHAT L1279 기준 R5)

**현재 해석을 유지할 근거**
- RELATIONS L1284가 '대신들 → 세종' 방향을 명시하고 WHAT L1279가 네 사람을 실명으로 명시

**판정** ☐ KEEP ☐ DOWNGRADE_TO_INTERPRETATION ☐ SPLIT ☐ REMOVE ☐ NEEDS_SOURCE  ·  검토자: ____  ·  메모: ____

<details><summary>원문 전체 문맥 — pack 항목 E1448_0307</summary>

```
1261| E1448_0307
1262| DATE: 1448-03-07
1263| TITLE: Debate over priority between long walls and town walls
1264| SOURCE:
1265| https://sillok.history.go.kr/id/kda_13003007_001
1266| 
1267| WHO:
1268| - 세종
1269| - 하연 河演
1270| - 황보인
1271| - 박종우
1272| - 김종서
1273| - 정분
1274| - 정갑손
1275| 
1276| WHAT:
1277| - Debate over whether to complete long frontier walls first
1278|   or town walls first.
1279| - Ha Yeon, Park Jong-u, Kim Jong-seo and Jeong Bun argued for
1280|   town walls as population refuges against major attacks.
1281| 
1282| RELATIONS:
1283| - 세종 -> senior ministers : POLICY_QUERY
1284| - ministers -> 세종 : DEFENSE_ADVICE
1285| 
```
</details>

## 19. `E1448_0307#9` — RECIPIENT_FROM_ENTRY_RELATION

**현재 edge** `JO_JEONGBUN` 정분 → `JO_SEJONG` 세종 · POLICY · `advise_town_walls_first` · 시각 1448년 3월 7일 · 확실성 confirmed · 인과 UNKNOWN · 근거 NORMALIZED

**적용 규칙** `R5_content_actor` (본문(WHAT·WHO·KEY CONTENT)에 명시된 행위자) · 주체 규칙 R5_content_actor

**근거 줄** `pack_v1:E1448_0307:WHAT:L1279` “Ha Yeon, Park Jong-u, Kim Jong-seo and Jeong Bun argued for” — 원문 주체/객체: Jeong Bun → (협의 소집자 세종)
- 보조 근거 `pack_v1:E1448_0307:RELATIONS:L1284` “ministers -> 세종 : DEFENSE_ADVICE”

**대안 가능한 해석**
- 네 사람의 주장은 '논의 자리의 견해 표명' — 세종을 향한 개별 건의가 아니라 undirected POLICY 또는 사건 속성
- RELATIONS L1284 'ministers -> 세종 : DEFENSE_ADVICE'를 R3로 펼친 관계로 재분류(현재는 WHAT L1279 기준 R5)

**현재 해석을 유지할 근거**
- RELATIONS L1284가 '대신들 → 세종' 방향을 명시하고 WHAT L1279가 네 사람을 실명으로 명시

**판정** ☐ KEEP ☐ DOWNGRADE_TO_INTERPRETATION ☐ SPLIT ☐ REMOVE ☐ NEEDS_SOURCE  ·  검토자: ____  ·  메모: ____

<details><summary>원문 전체 문맥 — pack 항목 E1448_0307</summary>

```
1261| E1448_0307
1262| DATE: 1448-03-07
1263| TITLE: Debate over priority between long walls and town walls
1264| SOURCE:
1265| https://sillok.history.go.kr/id/kda_13003007_001
1266| 
1267| WHO:
1268| - 세종
1269| - 하연 河演
1270| - 황보인
1271| - 박종우
1272| - 김종서
1273| - 정분
1274| - 정갑손
1275| 
1276| WHAT:
1277| - Debate over whether to complete long frontier walls first
1278|   or town walls first.
1279| - Ha Yeon, Park Jong-u, Kim Jong-seo and Jeong Bun argued for
1280|   town walls as population refuges against major attacks.
1281| 
1282| RELATIONS:
1283| - 세종 -> senior ministers : POLICY_QUERY
1284| - ministers -> 세종 : DEFENSE_ADVICE
1285| 
```
</details>

