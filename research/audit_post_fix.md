# 데이터 감사 — 수정 후 보고 (audit_post_fix)

- 기준: `research/audit_pre_fix.md`(수정 전, 커밋 `b4f1ceb`)의 심각도 분류와 파일별 계획
- ground truth: 사용자 제공 VALIDATED HISTORICAL SOURCE PACK v1만 사용. 외부 사료 사이트는 접근 불가였고, 일반지식으로 보충하지 않았다.
- **새 사건·인물·관계를 추가하지 않았다.** 이번 수정은 기존 레코드의 근거 표시, 날짜 정밀도, 동일성, 장소, 서술 근거를 바로잡은 것이다.
  (노드 ID 2개 `JO_HONGSASEOK_1437`·`JO_KIMHYOSEONG_1443`는 새 인물이 아니라, 기존 노드에 병합돼 있던 후기 등장을 분리한 것이다.)
- 이 문서의 목표: **무엇을 아는지(pack v1 검증), 무엇을 모르는지(미수록·미상), 무엇이 추론인지(정규화 규칙·해석·legacy)**를 구분해 적는다.

## 1. 수치 (수정 후)

| 항목 | 값 |
|---|---|
| EVENT | 70 — pack v1 검증 54 (직접 53 · 정규화 1) · legacy 16 (v2 이관 15 · anchor 시드 1) |
| RELATION | 242 — **pack v1 검증 175** (직접 53 · 정규화 122) · **legacy 47** (v2 46 · 시드 1) · **해석 20** · 출처 불명 0 |
| **사료 없는 relation** | **0** |
| causalStatus | 242/242 기록 — explicit 20 (모두 pack 근거) · unknown 222. 기본값 `explicit` 채움 제거 |
| 사건 연결(eventLinks, 구 causedBy) | 26 → 12. 인과(causal) 4건만 남김(모두 pack 정규화 근거) · 언급(reference) 5건(legacy 인과 4건 강등 포함) · 같은 기사/같은 작전 3 |
| undirected | 13 (모두 `E1432_1221`, pack "세종 <-> 대신들", `directionEvidence` 기록) |
| 경로 제외(`pathEligible: false`) | 6 ('~에 관한' 관계: 반박 주장의 지목 대상, 조건부 표적 기준 등) |
| 관계 시각 | 일 단위 확정 188 · 범위/미상 54 (그중 하한 미상 = '기사일 이전' 42) |
| 기본 지표 입력(strict, 1432~1449 전체 창) | 133 contact · 시각 불확실 제외 39 · '~에 관한' 제외 3 |
| 관직·역할 증언 | 32 (pack 24 · legacy 8). 구간·종료일 역산 0 |
| PLACE parentPlaceId | 20 → 3 (모두 pack 근거 `parentBasis`) |
| 편집자 한자 | 인물 15 + 장소 23 → 0 |
| 스토리 | 16장면 · 문장 58개, 모두 eventIds·sourceIds·narrativeStatus·provenance 보유 |
| 기본 화면·지표의 데이터셋 | **pack v1 검증만** (legacy·해석은 토글로만) |

## 2. 심각도별 처리 결과

| ID | 문제(수정 전) | 처리 |
|---|---|---|
| C1 | v2가 기본 화면·지표에 포함 | 근거 토글 3개(검증만 ON · legacy OFF · 해석 OFF). `filterContacts`·`eventPasses`·스토리·인물 패널 모두 같은 규칙 |
| C2 | `E1433_0419#0~#2` v2 관계가 pack으로 표시 | `inherited_v2`. 지휘관↔대상 대응은 D12(open)로 기록 |
| C3 | causalStatus 237건 미기재 → explicit 자동 채움 | 모든 관계에 명시, 기본 unknown. 검증기: 미기재·legacy explicit 오류 |
| H1 | 기사일만 있는 사건의 현장 행위를 기사일로 확정 | `dateMin=null, dateMax=기사일`(UNKNOWN, '기사일 이전'). 조정 접수 보고만 기사일(R7) |
| H2 | 기간 관계를 전 기간 활성으로 처리 | `timeKind`(instant/duration). strict 순서 규칙에서 범위 instant는 상한 도착 |
| H3 | 근거 없는 causedBy | 14건 삭제, legacy 인과 4건 reference로 강등 |
| H4 | interpretation이 confirmed로 표시 15건 | provenance·certainty 모두 interpretation (현재 20건: 기존 5 + 15) |
| H5 | PERSON_STATE 근거 과장 7건 | PERSON_ATTESTATIONS로 전환. v2 직함은 legacy 증언(level 계산 제외) |
| H6 | '~에 관한' 관계가 경로·중심성에 포함 | `pathEligible: false` 6건, 분석에서 제외하고 제외 수 표시 |
| H7 | coverage를 사건 유무로 추론, "사건 없음" | `coverage.js` 레지스트리. 1444 = NOT_COVERED, 화면·문서 '현재 검증팩에서 미조사/미수록' |
| H8 | 홍사석·김효성 동명이인 처리 불일치 | 후기 등장 분리(unresolved_homonym, possibleSameAs). 이진과 같은 규칙 |
| M1 | parentPlaceId 17건 근거 없음 | 삭제(PL_PAJEOGANG 하위 3건 포함). 남은 3건은 `parentBasis` |
| M2 | 편집자 한자 38건 | 삭제. 인물 한자는 pack 인명록 표기만(`nameFormVerified`, `nameFormSource`) |
| M3 | theater 근거 미표시 | `theaterBasis`. 근거 없는 전구는 UNSPECIFIED(1446 무창, 삭주, 황해도 등) |
| M4 | 사료 상태 미구분, not_accessed 경고 소거 | `SOURCE_USAGE` 5종, 상태별 경고·안내. 『서정록』 원문 = REGISTERED_UNCHECKED 경고 |
| M5 | `E1442_1022#0` R1 오적용 | 수신자 `ORG_JOSEON_COURT`(pack "Joseon") |
| M6 | 상태 종료일 역산 | 증언(기사일) 단위로만 기록 |
| M7 | 스토리 문장 근거 없음 | 문장 단위 eventIds·sourceIds·narrativeStatus·provenance |
| M8 | D03 배경지식 | 선덕제 사망 서술 삭제 |
| M9 | layer별 방향 정책 없음 | `DIRECTION_POLICY`: POLICY·COOPERATION만 declared(근거 있을 때 undirected), 나머지 directed |
| L1~L4 | 라벨·문구 | 세력 라벨 중립화("이만주 및 관하" 등), "위치 불명" → "pack 서술 없음/현대 비정 없음" |

## 3. 삭제한 추론 데이터

- **인과 링크** 14건 삭제(구 causedBy 26 중 pack 근거 없는 것), legacy 인과 4건(`E1433_0310`, `E1434_0422`, `E1435_0613`, `E1435_0617`)은 인과가 아닌 언급으로 강등.
- **기본 인과값** `explicit` 자동 채움 237건 → unknown.
- **상위 장소** 17건(여연·강계·자성·무창·이산·삭주→평안도, 경원·종성·공성·길주·경흥·갑산·혜산·부령→함길도, 이만주·임합라·임합라 부모 채리→파저강).
- **편집자 한자** 38건(인물 15: 世宗·崔士康·盧閈·申商·宣德帝·忽剌溫·兀良哈·기관 8 / 장소 23).
- **일반지식 메모**: PL_PAJEOGANG "명 영역 내 건주위 일대", D03 "선덕제 사망(1435년 초)".
- **사용처가 없어진 장소 노드** `PL_PAJEOGANG`, `PL_HOLLAON_AREA`(근거 없는 상위 관계 삭제 뒤 참조 0).
- **관직 구간의 종료일** 28건 전부(역산값) — 증언 32건으로 대체.
- **가짜 정밀도**: 현장 행위에 붙어 있던 기사일 확정 날짜(기사일 이전으로), 1437 정벌 현장 행동의 단일 날짜(9/7~9/16 범위로).
- **편집 전구**: 1438·1439 사건의 PL_HAMGIL, 1446 사건 전구(→UNSPECIFIED), 1449 사건의 AMNOK(→DUMAN만), 1433-03-25·1432-12-21 전구(→CENTRAL).
- **언급만 된 이름의 행위 관계**(맹날가래·최진·하한·심도원·의정부 등) → `subjects`(언급 대상)로 이동.
- **지리지의 사건 근거 지위**: `E1434_1024`·`E1441_0129`의 지리지 출처를 `relatedSourceIds`(관련 사료, 근거 아님)로 이동.
- **스토리 서술의 근거 없는 문구**(예: 1433 장면의 "세종→최윤덕→박호문→세종 루프" 단정) 삭제.

## 4. legacy로 격리한 데이터 (기본 화면·지표에서 제외, 토글로만 표시)

- 사건 16: `E1433_0310` `E1433_0511` `E1433_0601` `E1433_1221` `E1434_0416` `E1434_0422` `E1434_0426` `E1434_0914` `E1434_1010` `E1434_1012`
  `E1435_JANRAID` `E1435_0125` `E1435_0224` `E1435_0613` `E1435_0617` `E1438_0808`(anchor 시드)
- pack 사건 안의 legacy 관계: `E1432_INVEST`(1) · `E1433_0215`(10) · `E1433_0419`(3) · `E1435_0113`(2)
- 관계 47 · 사료 15(v2 14 · 시드 1) · 관직 증언 8 · 스토리 문장 6(S02·S04·S05·S07·S09·S11) · 사건 연결 4
- v2에서만 등장하는 노드 18: 최사강·김청·최경명·노한·신상·강계부·자성군·1434 자성군 갑사·1435 김수연 추격대·1435 정월 피해 주민·
  왕답올·유살독·장교하·유포자·왕안탄·심타납노·귀화 제보자·명 조정

## 5. 동일성 미해결 목록

- `unresolved_homonym`(별도 노드, 자동 병합 금지): **홍사석(1437 이천 본군)** `JO_HONGSASEOK_1437` ↔ `JO_HONGSASEOK` ·
  **김효성(1443 기사)** `JO_KIMHYOSEONG_1443` ↔ `JO_KIMHYOSEONG` · **이진(1437 이천 본군)** `JO_LEEJIN_1437` ↔ `JO_LEEJIN`
- `probable_same_person`(같은 이름의 pack 등장을 한 노드로 두었으나 pack이 동일성을 명시하지 않음) 23:
  황희, 허조, 정흠지, 하경복, 조말생, 안숭선, 황보인, 김종서, 최윤덕, 최해산, 이순몽, 이각, 이징석, 이징옥, 김효성, 홍사석, 김윤수, 이화, 정덕성, 이만주, 맹가첩목아, 범찰, 동소로가무
- `confirmed_same_person`: 세종, 이천(pack이 1432·1436·1437 등장을 명시적으로 연결)
- 그 밖: 1435 평안도 도절제사 이각(v2) — legacy 증언, 동일성 검증 안 됨 · `D03` 1435-02-24 칙서 발신자(명 조정) — open

## 6. 미수록 연도·범위

- **1444년: NOT_COVERED** — pack v1에 검증 기사가 제공되지 않음. 화면·문서에는 '현재 검증팩에서 미조사/미수록'. 사건이 없었다는 뜻이 아니다.
- 1432년은 12-09부터, 1449년은 07-07까지만 작업 범위.
- 나머지 16개 연도도 VERIFIED_WITH_EVENTS이지만 completeness = SEED_ONLY(전수 조사 아님).

## 7. 날짜가 모호한 사건 (일 단위 단일 날짜가 아닌 17건)

| 정밀도 | 사건 |
|---|---|
| UNKNOWN('기사일 이전') | `E1432_1209` `E1432_INVEST` `E1433_0610` `E1433_08L10` `E1435_0312` `E1438_0808` `E1439_0510` `E1440_0407` `E1446_0420` `E1447_0708` |
| DAY 구간 | `E1433_0419`(04-10~04-19) · `E1437_0922`(09-07~09-16) · `E1443_1005`(09-14~10-05) |
| MONTH | `E1435_JANRAID`(1435-01, legacy) |
| YEAR | `E1434_GEO_GYEONGWON` · `E1441_GEO_JONGSEONG` · `E1442_GEO_GYEONGWON`(지리지) |

이 사건들의 관계는 strict 지표에서 순서를 매기지 않으며(가짜 순서 금지), possible 경로에서는 UNCERTAIN으로 표시된다.

## 8. 남은 확인 과제(사료 접근 후)

- D12 1433 지휘관별 공격 대상(v2 대응) · D15 홍사석 파견 주체·날짜 · D18 홍사석·김효성·이진 후기 등장의 동일성
- D08 실록 vs 『서정록』 — 원문 미확보로 평가하지 않음(차이가 없다는 뜻 아님)
- 1444년 및 각 연도 월별 기사목록 전수 조사
- legacy 16사건·47관계의 원문 재대조(통과 전까지 검증 데이터로 승격하지 않음)

## 9. 검증 절차

`node tools/validate.mjs` · `node tools/test.mjs`(unit 24) · `node tools/integrity.mjs`(역사 무결성 30) ·
`node tools/build-check.mjs`(production build) · `node tools/e2e.mjs`(브라우저 54) — 결과는 커밋 메시지와 최종 보고에 기록.
