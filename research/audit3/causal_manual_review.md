# EXPLICIT_CAUSAL 수동 검토 — 하향 후보 3건 + 제목 줄만 근거인 REVIEW 7건

> 자동 생성: `node tools/audit-round4.mjs` · 대상 10건(3차 감사 `explicit_causal_audit.md`의 DOWNGRADE_CANDIDATE + 근거 locator가 TITLE인 REVIEW). **판정 칸은 모두 비어 있고 causalStatus는 바꾸지 않았다.**
> 판정 선택지: KEEP_EXPLICIT_CAUSAL / COMMAND_RELATION / PROCEDURAL_SEQUENCE / TEMPORAL_ASSOCIATION / UNKNOWN.
> '본문 인과 표현'·'선후관계'·'명령 관계'·'제목이 추가한 인과' 칸은 `tools/audit4-notes.mjs`의 검토 메모다.

## 요약표

| # | 종류 | id | 3차 후보 | 근거 locator | 판정 |
|---|---|---|---|---|---|
| 1 | 관계 | `E1433_0516B#0` | REVIEW | `pack_v1:E1433_0516_B:TITLE:L332` |  |
| 2 | 관계 | `E1433_0516B#1` | REVIEW | `pack_v1:E1433_0516_B:TITLE:L332` |  |
| 3 | 관계 | `E1433_0516B#2` | REVIEW | `pack_v1:E1433_0516_B:TITLE:L332` |  |
| 4 | 관계 | `E1433_0516B#3` | REVIEW | `pack_v1:E1433_0516_B:TITLE:L332` |  |
| 5 | 관계 | `E1433_0516B#4` | REVIEW | `pack_v1:E1433_0516_B:TITLE:L332` |  |
| 6 | 관계 | `E1433_0516B#5` | REVIEW | `pack_v1:E1433_0516_B:TITLE:L332` |  |
| 7 | 관계 | `E1443_1005#4` | DOWNGRADE_CANDIDATE(UNKNOWN) | `pack_v1:E1443_0914_1005:WHAT:L1061` |  |
| 8 | 관계 | `E1443_1005#5` | DOWNGRADE_CANDIDATE(UNKNOWN) | `pack_v1:E1443_0914_1005:WHAT:L1061` |  |
| 9 | 사건 연결 | `E1433_0516B ← E1433_0419` | REVIEW | `pack_v1:E1433_0516_B:TITLE:L332` |  |
| 10 | 사건 연결 | `E1433_0517 ← E1433_0419` | DOWNGRADE_CANDIDATE(UNKNOWN) | `pack_v1:E1433_0517:TITLE:L354` |  |

## 1. `E1433_0516B#0`

| 항목 | 내용 |
|---|---|
| 제목 | “Enslaved persons bestowed as campaign rewards” (L332) |
| 현재 causal edge | `ORG_JOSEON_COURT` 조선 국가·조정(주체·수신자 미특정) → `JO_CHOEYUNDEOK` 최윤덕 · REWARD · `bestow_nobi` · 시각 1433년 5월 16일 · 인과 EXPLICIT_CAUSAL · 근거 NORMALIZED |
| 현재 causalStatus | `EXPLICIT_CAUSAL` |
| causalEvidence | “Enslaved persons bestowed as campaign rewards” `pack_v1:E1433_0516_B:TITLE:L332` |
| 3차 후보(메모) | REVIEW — 근거가 pack 제목 줄이며 본문 줄에는 이유 진술이 없음 |
| 본문에 실제 인과 표현이 있는가 | 없음 — 본문(WHO / WHAT L337-342)은 사람별 노비 수만, RELATIONS L349는 'state -> commanders : REWARD'. '정벌 포상'이라는 성격은 제목(L332)에만 있음 |
| 단순 선후관계인가 | 5/7 정벌 보고 → 5/16 하사의 시간 선후는 분명함 |
| 명령 관계인가 | 국가 → 지휘관 하사 — 명령 관계가 아니라 수여(REWARD) 관계 |
| 편집 제목이 인과를 추가했는가 | 그렇다 — 이유(정벌 포상)는 pack 제목에서만 나옴. pack 제목이 원문 기사 제목인지 검증자 요약인지 pack은 구분하지 않음(사람 확인) |

**판정** ☐ KEEP_EXPLICIT_CAUSAL ☐ COMMAND_RELATION ☐ PROCEDURAL_SEQUENCE ☐ TEMPORAL_ASSOCIATION ☐ UNKNOWN  ·  검토자: ____  ·  메모: ____

원문 본문:

<details><summary>원문 전체 문맥 — pack 항목 E1433_0516_B</summary>

```
 330| E1433_0516_B
 331| DATE: 1433-05-16
 332| TITLE: Enslaved persons bestowed as campaign rewards
 333| SOURCE:
 334| https://sillok.history.go.kr/id/kda_11505016_004
 335| 
 336| WHO / WHAT:
 337| - 최윤덕: 10
 338| - 이순몽: 8
 339| - 이각: 6
 340| - 이징석: 6
 341| - 홍사석: 5
 342| - 김효성: 4
 343| 
 344| IMPORTANT:
 345| Represent this according to the historical institution of the period;
 346| do not sanitize it as a generic "prize".
 347| 
 348| RELATIONS:
 349| - state -> commanders : REWARD
 350| 
```
</details>

## 2. `E1433_0516B#1`

| 항목 | 내용 |
|---|---|
| 제목 | “Enslaved persons bestowed as campaign rewards” (L332) |
| 현재 causal edge | `ORG_JOSEON_COURT` 조선 국가·조정(주체·수신자 미특정) → `JO_LEESUNMONG` 이순몽 · REWARD · `bestow_nobi` · 시각 1433년 5월 16일 · 인과 EXPLICIT_CAUSAL · 근거 NORMALIZED |
| 현재 causalStatus | `EXPLICIT_CAUSAL` |
| causalEvidence | “Enslaved persons bestowed as campaign rewards” `pack_v1:E1433_0516_B:TITLE:L332` |
| 3차 후보(메모) | REVIEW — 근거가 pack 제목 줄이며 본문 줄에는 이유 진술이 없음 |
| 본문에 실제 인과 표현이 있는가 | 없음 — 본문(WHO / WHAT L337-342)은 사람별 노비 수만, RELATIONS L349는 'state -> commanders : REWARD'. '정벌 포상'이라는 성격은 제목(L332)에만 있음 |
| 단순 선후관계인가 | 5/7 정벌 보고 → 5/16 하사의 시간 선후는 분명함 |
| 명령 관계인가 | 국가 → 지휘관 하사 — 명령 관계가 아니라 수여(REWARD) 관계 |
| 편집 제목이 인과를 추가했는가 | 그렇다 — 이유(정벌 포상)는 pack 제목에서만 나옴. pack 제목이 원문 기사 제목인지 검증자 요약인지 pack은 구분하지 않음(사람 확인) |

**판정** ☐ KEEP_EXPLICIT_CAUSAL ☐ COMMAND_RELATION ☐ PROCEDURAL_SEQUENCE ☐ TEMPORAL_ASSOCIATION ☐ UNKNOWN  ·  검토자: ____  ·  메모: ____

원문 본문:

<details><summary>원문 전체 문맥 — pack 항목 E1433_0516_B</summary>

```
 330| E1433_0516_B
 331| DATE: 1433-05-16
 332| TITLE: Enslaved persons bestowed as campaign rewards
 333| SOURCE:
 334| https://sillok.history.go.kr/id/kda_11505016_004
 335| 
 336| WHO / WHAT:
 337| - 최윤덕: 10
 338| - 이순몽: 8
 339| - 이각: 6
 340| - 이징석: 6
 341| - 홍사석: 5
 342| - 김효성: 4
 343| 
 344| IMPORTANT:
 345| Represent this according to the historical institution of the period;
 346| do not sanitize it as a generic "prize".
 347| 
 348| RELATIONS:
 349| - state -> commanders : REWARD
 350| 
```
</details>

## 3. `E1433_0516B#2`

| 항목 | 내용 |
|---|---|
| 제목 | “Enslaved persons bestowed as campaign rewards” (L332) |
| 현재 causal edge | `ORG_JOSEON_COURT` 조선 국가·조정(주체·수신자 미특정) → `JO_LEEGAK` 이각 · REWARD · `bestow_nobi` · 시각 1433년 5월 16일 · 인과 EXPLICIT_CAUSAL · 근거 NORMALIZED |
| 현재 causalStatus | `EXPLICIT_CAUSAL` |
| causalEvidence | “Enslaved persons bestowed as campaign rewards” `pack_v1:E1433_0516_B:TITLE:L332` |
| 3차 후보(메모) | REVIEW — 근거가 pack 제목 줄이며 본문 줄에는 이유 진술이 없음 |
| 본문에 실제 인과 표현이 있는가 | 없음 — 본문(WHO / WHAT L337-342)은 사람별 노비 수만, RELATIONS L349는 'state -> commanders : REWARD'. '정벌 포상'이라는 성격은 제목(L332)에만 있음 |
| 단순 선후관계인가 | 5/7 정벌 보고 → 5/16 하사의 시간 선후는 분명함 |
| 명령 관계인가 | 국가 → 지휘관 하사 — 명령 관계가 아니라 수여(REWARD) 관계 |
| 편집 제목이 인과를 추가했는가 | 그렇다 — 이유(정벌 포상)는 pack 제목에서만 나옴. pack 제목이 원문 기사 제목인지 검증자 요약인지 pack은 구분하지 않음(사람 확인) |

**판정** ☐ KEEP_EXPLICIT_CAUSAL ☐ COMMAND_RELATION ☐ PROCEDURAL_SEQUENCE ☐ TEMPORAL_ASSOCIATION ☐ UNKNOWN  ·  검토자: ____  ·  메모: ____

원문 본문:

<details><summary>원문 전체 문맥 — pack 항목 E1433_0516_B</summary>

```
 330| E1433_0516_B
 331| DATE: 1433-05-16
 332| TITLE: Enslaved persons bestowed as campaign rewards
 333| SOURCE:
 334| https://sillok.history.go.kr/id/kda_11505016_004
 335| 
 336| WHO / WHAT:
 337| - 최윤덕: 10
 338| - 이순몽: 8
 339| - 이각: 6
 340| - 이징석: 6
 341| - 홍사석: 5
 342| - 김효성: 4
 343| 
 344| IMPORTANT:
 345| Represent this according to the historical institution of the period;
 346| do not sanitize it as a generic "prize".
 347| 
 348| RELATIONS:
 349| - state -> commanders : REWARD
 350| 
```
</details>

## 4. `E1433_0516B#3`

| 항목 | 내용 |
|---|---|
| 제목 | “Enslaved persons bestowed as campaign rewards” (L332) |
| 현재 causal edge | `ORG_JOSEON_COURT` 조선 국가·조정(주체·수신자 미특정) → `JO_LEEJINGSEOK` 이징석 · REWARD · `bestow_nobi` · 시각 1433년 5월 16일 · 인과 EXPLICIT_CAUSAL · 근거 NORMALIZED |
| 현재 causalStatus | `EXPLICIT_CAUSAL` |
| causalEvidence | “Enslaved persons bestowed as campaign rewards” `pack_v1:E1433_0516_B:TITLE:L332` |
| 3차 후보(메모) | REVIEW — 근거가 pack 제목 줄이며 본문 줄에는 이유 진술이 없음 |
| 본문에 실제 인과 표현이 있는가 | 없음 — 본문(WHO / WHAT L337-342)은 사람별 노비 수만, RELATIONS L349는 'state -> commanders : REWARD'. '정벌 포상'이라는 성격은 제목(L332)에만 있음 |
| 단순 선후관계인가 | 5/7 정벌 보고 → 5/16 하사의 시간 선후는 분명함 |
| 명령 관계인가 | 국가 → 지휘관 하사 — 명령 관계가 아니라 수여(REWARD) 관계 |
| 편집 제목이 인과를 추가했는가 | 그렇다 — 이유(정벌 포상)는 pack 제목에서만 나옴. pack 제목이 원문 기사 제목인지 검증자 요약인지 pack은 구분하지 않음(사람 확인) |

**판정** ☐ KEEP_EXPLICIT_CAUSAL ☐ COMMAND_RELATION ☐ PROCEDURAL_SEQUENCE ☐ TEMPORAL_ASSOCIATION ☐ UNKNOWN  ·  검토자: ____  ·  메모: ____

원문 본문:

<details><summary>원문 전체 문맥 — pack 항목 E1433_0516_B</summary>

```
 330| E1433_0516_B
 331| DATE: 1433-05-16
 332| TITLE: Enslaved persons bestowed as campaign rewards
 333| SOURCE:
 334| https://sillok.history.go.kr/id/kda_11505016_004
 335| 
 336| WHO / WHAT:
 337| - 최윤덕: 10
 338| - 이순몽: 8
 339| - 이각: 6
 340| - 이징석: 6
 341| - 홍사석: 5
 342| - 김효성: 4
 343| 
 344| IMPORTANT:
 345| Represent this according to the historical institution of the period;
 346| do not sanitize it as a generic "prize".
 347| 
 348| RELATIONS:
 349| - state -> commanders : REWARD
 350| 
```
</details>

## 5. `E1433_0516B#4`

| 항목 | 내용 |
|---|---|
| 제목 | “Enslaved persons bestowed as campaign rewards” (L332) |
| 현재 causal edge | `ORG_JOSEON_COURT` 조선 국가·조정(주체·수신자 미특정) → `JO_HONGSASEOK` 홍사석 · REWARD · `bestow_nobi` · 시각 1433년 5월 16일 · 인과 EXPLICIT_CAUSAL · 근거 NORMALIZED |
| 현재 causalStatus | `EXPLICIT_CAUSAL` |
| causalEvidence | “Enslaved persons bestowed as campaign rewards” `pack_v1:E1433_0516_B:TITLE:L332` |
| 3차 후보(메모) | REVIEW — 근거가 pack 제목 줄이며 본문 줄에는 이유 진술이 없음 |
| 본문에 실제 인과 표현이 있는가 | 없음 — 본문(WHO / WHAT L337-342)은 사람별 노비 수만, RELATIONS L349는 'state -> commanders : REWARD'. '정벌 포상'이라는 성격은 제목(L332)에만 있음 |
| 단순 선후관계인가 | 5/7 정벌 보고 → 5/16 하사의 시간 선후는 분명함 |
| 명령 관계인가 | 국가 → 지휘관 하사 — 명령 관계가 아니라 수여(REWARD) 관계 |
| 편집 제목이 인과를 추가했는가 | 그렇다 — 이유(정벌 포상)는 pack 제목에서만 나옴. pack 제목이 원문 기사 제목인지 검증자 요약인지 pack은 구분하지 않음(사람 확인) |

**판정** ☐ KEEP_EXPLICIT_CAUSAL ☐ COMMAND_RELATION ☐ PROCEDURAL_SEQUENCE ☐ TEMPORAL_ASSOCIATION ☐ UNKNOWN  ·  검토자: ____  ·  메모: ____

원문 본문:

<details><summary>원문 전체 문맥 — pack 항목 E1433_0516_B</summary>

```
 330| E1433_0516_B
 331| DATE: 1433-05-16
 332| TITLE: Enslaved persons bestowed as campaign rewards
 333| SOURCE:
 334| https://sillok.history.go.kr/id/kda_11505016_004
 335| 
 336| WHO / WHAT:
 337| - 최윤덕: 10
 338| - 이순몽: 8
 339| - 이각: 6
 340| - 이징석: 6
 341| - 홍사석: 5
 342| - 김효성: 4
 343| 
 344| IMPORTANT:
 345| Represent this according to the historical institution of the period;
 346| do not sanitize it as a generic "prize".
 347| 
 348| RELATIONS:
 349| - state -> commanders : REWARD
 350| 
```
</details>

## 6. `E1433_0516B#5`

| 항목 | 내용 |
|---|---|
| 제목 | “Enslaved persons bestowed as campaign rewards” (L332) |
| 현재 causal edge | `ORG_JOSEON_COURT` 조선 국가·조정(주체·수신자 미특정) → `JO_KIMHYOSEONG` 김효성 · REWARD · `bestow_nobi` · 시각 1433년 5월 16일 · 인과 EXPLICIT_CAUSAL · 근거 NORMALIZED |
| 현재 causalStatus | `EXPLICIT_CAUSAL` |
| causalEvidence | “Enslaved persons bestowed as campaign rewards” `pack_v1:E1433_0516_B:TITLE:L332` |
| 3차 후보(메모) | REVIEW — 근거가 pack 제목 줄이며 본문 줄에는 이유 진술이 없음 |
| 본문에 실제 인과 표현이 있는가 | 없음 — 본문(WHO / WHAT L337-342)은 사람별 노비 수만, RELATIONS L349는 'state -> commanders : REWARD'. '정벌 포상'이라는 성격은 제목(L332)에만 있음 |
| 단순 선후관계인가 | 5/7 정벌 보고 → 5/16 하사의 시간 선후는 분명함 |
| 명령 관계인가 | 국가 → 지휘관 하사 — 명령 관계가 아니라 수여(REWARD) 관계 |
| 편집 제목이 인과를 추가했는가 | 그렇다 — 이유(정벌 포상)는 pack 제목에서만 나옴. pack 제목이 원문 기사 제목인지 검증자 요약인지 pack은 구분하지 않음(사람 확인) |

**판정** ☐ KEEP_EXPLICIT_CAUSAL ☐ COMMAND_RELATION ☐ PROCEDURAL_SEQUENCE ☐ TEMPORAL_ASSOCIATION ☐ UNKNOWN  ·  검토자: ____  ·  메모: ____

원문 본문:

<details><summary>원문 전체 문맥 — pack 항목 E1433_0516_B</summary>

```
 330| E1433_0516_B
 331| DATE: 1433-05-16
 332| TITLE: Enslaved persons bestowed as campaign rewards
 333| SOURCE:
 334| https://sillok.history.go.kr/id/kda_11505016_004
 335| 
 336| WHO / WHAT:
 337| - 최윤덕: 10
 338| - 이순몽: 8
 339| - 이각: 6
 340| - 이징석: 6
 341| - 홍사석: 5
 342| - 김효성: 4
 343| 
 344| IMPORTANT:
 345| Represent this according to the historical institution of the period;
 346| do not sanitize it as a generic "prize".
 347| 
 348| RELATIONS:
 349| - state -> commanders : REWARD
 350| 
```
</details>

## 7. `E1443_1005#4`

| 항목 | 내용 |
|---|---|
| 제목 | “Jurchen informants enable prepared defense against 1,000+ Udige” (L1045) |
| 현재 causal edge | `ORG_JOSEON_COURT` 조선 국가·조정(주체·수신자 미특정) → `JZ_BAEMARAGA` 배마라가 · REWARD · `reward_informant` · 시각 1443년 10월 5일 · 인과 EXPLICIT_CAUSAL · 근거 NORMALIZED |
| 현재 causalStatus | `EXPLICIT_CAUSAL` |
| causalEvidence | “Court judged both informants' contributions major.” `pack_v1:E1443_0914_1005:WHAT:L1061` |
| 3차 후보(메모) | DOWNGRADE_CANDIDATE(UNKNOWN) — '기여가 크다고 판단'과 '포상(L1067)'이 나란히 있을 뿐 '그래서 포상'이라는 연결 표현이 없음 |
| 본문에 실제 인과 표현이 있는가 | 약함 — L1061 'Court judged both informants' contributions major.'(기여 평가)와 RELATIONS L1067 'state -> informants : REWARD'가 나란히 있을 뿐 '그래서 포상'이라는 연결 표현 없음 |
| 단순 선후관계인가 | 제보(9/14·습격일) → 방어 성공 → 기여 평가 → 포상의 서술 순서는 있음 |
| 명령 관계인가 | 명령 관계 아님 |
| 편집 제목이 인과를 추가했는가 | 아니다 — 근거는 본문 줄. 다만 인과 연결은 두 줄을 이어 읽은 것 |

**판정** ☐ KEEP_EXPLICIT_CAUSAL ☐ COMMAND_RELATION ☐ PROCEDURAL_SEQUENCE ☐ TEMPORAL_ASSOCIATION ☐ UNKNOWN  ·  검토자: ____  ·  메모: ____

원문 본문:

<details><summary>원문 전체 문맥 — pack 항목 E1443_0914_1005</summary>

```
1042| E1443_0914_1005
1043| EVENT DATE: 1443-09-14 and subsequent raid
1044| RECORD DATE: 1443-10-05
1045| TITLE: Jurchen informants enable prepared defense against 1,000+ Udige
1046| SOURCE:
1047| https://sillok.history.go.kr/popup/print.do?gubun=kor&id=kda_12510005_001
1048| 
1049| WHO:
1050| - 한서룡 韓瑞龍
1051| - 김효성
1052| - 배마라가 裵磨剌可
1053| - 창고리 昌古里
1054| - multiple Udige, c. 1,000+
1055| 
1056| WHAT:
1057| - Baemalaga warned in advance that 1,000+ Udige had departed to raid.
1058| - Han Seo-ryong had garrisons prepare.
1059| - On day of raid, Changgori provided additional warning.
1060| - Joseon forces were able to prepare and repel attackers.
1061| - Court judged both informants' contributions major.
1062| 
1063| RELATIONS:
1064| - 배마라가 -> Joseon : INTELLIGENCE
1065| - 창고리 -> Joseon : INTELLIGENCE
1066| - 한서룡 -> garrisons : COMMAND
1067| - state -> informants : REWARD
1068| - garrisons -> attackers : DEFENSE
1069| 
```
</details>

## 8. `E1443_1005#5`

| 항목 | 내용 |
|---|---|
| 제목 | “Jurchen informants enable prepared defense against 1,000+ Udige” (L1045) |
| 현재 causal edge | `ORG_JOSEON_COURT` 조선 국가·조정(주체·수신자 미특정) → `JZ_CHANGGORI` 창고리 · REWARD · `reward_informant` · 시각 1443년 10월 5일 · 인과 EXPLICIT_CAUSAL · 근거 NORMALIZED |
| 현재 causalStatus | `EXPLICIT_CAUSAL` |
| causalEvidence | “Court judged both informants' contributions major.” `pack_v1:E1443_0914_1005:WHAT:L1061` |
| 3차 후보(메모) | DOWNGRADE_CANDIDATE(UNKNOWN) — '기여가 크다고 판단'과 '포상(L1067)'이 나란히 있을 뿐 '그래서 포상'이라는 연결 표현이 없음 |
| 본문에 실제 인과 표현이 있는가 | 약함 — L1061 'Court judged both informants' contributions major.'(기여 평가)와 RELATIONS L1067 'state -> informants : REWARD'가 나란히 있을 뿐 '그래서 포상'이라는 연결 표현 없음 |
| 단순 선후관계인가 | 제보(9/14·습격일) → 방어 성공 → 기여 평가 → 포상의 서술 순서는 있음 |
| 명령 관계인가 | 명령 관계 아님 |
| 편집 제목이 인과를 추가했는가 | 아니다 — 근거는 본문 줄. 다만 인과 연결은 두 줄을 이어 읽은 것 |

**판정** ☐ KEEP_EXPLICIT_CAUSAL ☐ COMMAND_RELATION ☐ PROCEDURAL_SEQUENCE ☐ TEMPORAL_ASSOCIATION ☐ UNKNOWN  ·  검토자: ____  ·  메모: ____

원문 본문:

<details><summary>원문 전체 문맥 — pack 항목 E1443_0914_1005</summary>

```
1042| E1443_0914_1005
1043| EVENT DATE: 1443-09-14 and subsequent raid
1044| RECORD DATE: 1443-10-05
1045| TITLE: Jurchen informants enable prepared defense against 1,000+ Udige
1046| SOURCE:
1047| https://sillok.history.go.kr/popup/print.do?gubun=kor&id=kda_12510005_001
1048| 
1049| WHO:
1050| - 한서룡 韓瑞龍
1051| - 김효성
1052| - 배마라가 裵磨剌可
1053| - 창고리 昌古里
1054| - multiple Udige, c. 1,000+
1055| 
1056| WHAT:
1057| - Baemalaga warned in advance that 1,000+ Udige had departed to raid.
1058| - Han Seo-ryong had garrisons prepare.
1059| - On day of raid, Changgori provided additional warning.
1060| - Joseon forces were able to prepare and repel attackers.
1061| - Court judged both informants' contributions major.
1062| 
1063| RELATIONS:
1064| - 배마라가 -> Joseon : INTELLIGENCE
1065| - 창고리 -> Joseon : INTELLIGENCE
1066| - 한서룡 -> garrisons : COMMAND
1067| - state -> informants : REWARD
1068| - garrisons -> attackers : DEFENSE
1069| 
```
</details>

## 9. `E1433_0516B ← E1433_0419`

| 항목 | 내용 |
|---|---|
| 제목 | “Enslaved persons bestowed as campaign rewards” (L332) |
| 현재 causal edge | 사건 연결: `E1433_0419` 제1차 파저강 정벌: 각 부대의 거주지 공격 → `E1433_0516B` 정벌 지휘관에게 노비 하사 |
| 현재 causalStatus | `EXPLICIT_CAUSAL` |
| causalEvidence | “Enslaved persons bestowed as campaign rewards” `pack_v1:E1433_0516_B:TITLE:L332` |
| 3차 후보(메모) | REVIEW — 같은 이유 + 연결 대상이 공격 사건 하나로 좁혀짐 |
| 본문에 실제 인과 표현이 있는가 | 없음 — 본문(WHO / WHAT L337-342)은 사람별 노비 수만, RELATIONS L349는 'state -> commanders : REWARD'. '정벌 포상'이라는 성격은 제목(L332)에만 있음 |
| 단순 선후관계인가 | 5/7 정벌 보고 → 5/16 하사의 시간 선후는 분명함 |
| 명령 관계인가 | 국가 → 지휘관 하사 — 명령 관계가 아니라 수여(REWARD) 관계 |
| 편집 제목이 인과를 추가했는가 | 그렇다 — 이유(정벌 포상)는 pack 제목에서만 나옴. pack 제목이 원문 기사 제목인지 검증자 요약인지 pack은 구분하지 않음(사람 확인) |

**판정** ☐ KEEP_EXPLICIT_CAUSAL ☐ COMMAND_RELATION ☐ PROCEDURAL_SEQUENCE ☐ TEMPORAL_ASSOCIATION ☐ UNKNOWN  ·  검토자: ____  ·  메모: ____

원문 본문:

<details><summary>원문 전체 문맥 — pack 항목 E1433_0516_B</summary>

```
 330| E1433_0516_B
 331| DATE: 1433-05-16
 332| TITLE: Enslaved persons bestowed as campaign rewards
 333| SOURCE:
 334| https://sillok.history.go.kr/id/kda_11505016_004
 335| 
 336| WHO / WHAT:
 337| - 최윤덕: 10
 338| - 이순몽: 8
 339| - 이각: 6
 340| - 이징석: 6
 341| - 홍사석: 5
 342| - 김효성: 4
 343| 
 344| IMPORTANT:
 345| Represent this according to the historical institution of the period;
 346| do not sanitize it as a generic "prize".
 347| 
 348| RELATIONS:
 349| - state -> commanders : REWARD
 350| 
```
</details>

## 10. `E1433_0517 ← E1433_0419`

| 항목 | 내용 |
|---|---|
| 제목 | “Welfare and commemoration for campaign dead and sick” (L354) |
| 현재 causal edge | 사건 연결: `E1433_0419` 제1차 파저강 정벌: 각 부대의 거주지 공격 → `E1433_0517` 전사·병사자 치제와 구휼·복호 |
| 현재 causalStatus | `EXPLICIT_CAUSAL` |
| causalEvidence | “Welfare and commemoration for campaign dead and sick” `pack_v1:E1433_0517:TITLE:L354` |
| 3차 후보(메모) | DOWNGRADE_CANDIDATE(UNKNOWN) — 병사(sick)는 4/19 공격 사건의 결과가 아닐 수 있는데 링크는 공격 사건(E1433_0419)에 걸려 있음 |
| 본문에 실제 인과 표현이 있는가 | 부분적 — 본문 WHAT L366 'For those killed:'·L372 'For those who died from illness:'·L377 'For loss of horse:'는 지급 대상 기준. '정벌 때문에'라는 진술은 제목 L354 'campaign dead and sick'에만 있음 |
| 단순 선후관계인가 | 정벌(4월) → 5/17 구휼의 선후는 분명함 |
| 명령 관계인가 | 명령 관계 아님(국가 → 사망자·유가족 구휼) |
| 편집 제목이 인과를 추가했는가 | 부분적 — '정벌' 연결은 제목. 또 링크 대상이 4/19 공격 사건 하나인데 병사자(L372)는 공격 사건의 결과가 아닐 수 있음 |

**판정** ☐ KEEP_EXPLICIT_CAUSAL ☐ COMMAND_RELATION ☐ PROCEDURAL_SEQUENCE ☐ TEMPORAL_ASSOCIATION ☐ UNKNOWN  ·  검토자: ____  ·  메모: ____

원문 본문:

<details><summary>원문 전체 문맥 — pack 항목 E1433_0517</summary>

```
 352| E1433_0517
 353| DATE: 1433-05-17
 354| TITLE: Welfare and commemoration for campaign dead and sick
 355| SOURCE:
 356| https://sillok.history.go.kr/id/kda_11505017_002
 357| 
 358| WHO:
 359| - 세종
 360| - 안을경 安乙敬 and other named/unnamed dead
 361| - 군관
 362| - 군졸
 363| - bereaved households
 364| 
 365| WHAT:
 366| For those killed:
 367| - ritual for the dead
 368| - military officers: rice + beans 5 seok each
 369| - soldiers: 3 seok
 370| - household service exemption: 5 years
 371| 
 372| For those who died from illness:
 373| - officers: rice + beans 3 seok
 374| - soldiers: 2 seok
 375| - exemption: 2 years
 376| 
 377| For loss of horse:
 378| - exemption: 2 years
 379| 
 380| RELATIONS:
 381| - state -> dead soldiers : HONOR
 382| - state -> bereaved households : WELFARE
 383| - state -> soldiers/officers : COMPENSATION
 384| 
```
</details>

