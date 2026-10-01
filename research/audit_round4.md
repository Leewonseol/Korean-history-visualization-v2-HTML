# 4차 감사 — 사람 판정 준비(데이터·스키마·evidence model 변경 없음)

- 이번 라운드는 **사람이 판정할 검토 문서와 민감도 결과만** 만들었다. 관계·인물·동일성 상태·인과 상태·근거 등급·temporal model은 3차 감사와 같다.
- 동일성은 integrity AU4가 회귀로 검사한다. 비교 대상은 관계 242, 인물 149, DIRECT 20 / NORMALIZED 153 / LEGACY 47 / INTERPRETATION 22, VERIFIED_SAME 2 / PROBABLE_SAME 23 / UNRESOLVED_DISTINCT 3, 기본 입력 132 / 시각 제외 38이다.
- 민감도와 가상 영향은 모두 메모리 안에서만 계산했다. 데이터에 쓰지 않았고, AU6이 이를 확인한다.
- 문서는 `node tools/build-research.mjs`(또는 `node tools/audit-round4.mjs`)로 다시 만든다. 동기화와 빈 판정 칸은 AU5가 검사한다.

| 문서 (`research/audit3/`) | 내용 |
|---|---|
| `r1_manual_review.md` | R1 18건: 원문 문맥 · 원문/정규화 주체·객체 · 현재 edge · R1 적용 이유 · 수신자 후보(세종 개인/왕·국왕/조선 조정/의정부/특정 관청/불명) · 대안 edge · 세종 중심성 영향 · 판정란 |
| `r7_temporal_sensitivity.md` | CURRENT vs SOURCE_DATED_ONLY 비교 |
| `missing_pack_relations_review.md` | 그래프에 없는 pack의 인물·기관 관계 9건(L290 강조) |
| `identity_choeyundeok_manual_review.md` | 최윤덕 10개 항목 + merged/split 민감도 |
| `identity_hwangboin_manual_review.md` | 황보인 8개 항목 + merged/split 민감도 |
| `causal_manual_review.md` | EXPLICIT_CAUSAL 10건(하향 후보 3 + 제목 줄만 근거인 REVIEW 7) |

## 1. 사람이 지금 판정해야 할 항목 수

| 문서 | 판정 수 | 선택지 |
|---|---|---|
| R1 수동 검토 | 18 | KEEP_AS_SEJONG / CHANGE_TO_COURT / CHANGE_TO_INSTITUTION / DOWNGRADE_TO_INTERPRETATION / REMOVE / NEEDS_SOURCE |
| 미반영 pack 관계 | 9 | ADD_AS_DIRECT / ADD_AS_NORMALIZED / INTERPRETATION_ONLY / DO_NOT_ADD / NEEDS_SOURCE |
| 최윤덕 동일성 | 1 | VERIFIED_SAME / PROBABLE_SAME 유지 / SPLIT_REQUIRED / NEEDS_EXTERNAL_AUTHORITY |
| 황보인 동일성 | 1 | 같음 |
| EXPLICIT_CAUSAL | 10 | KEEP_EXPLICIT_CAUSAL / COMMAND_RELATION / PROCEDURAL_SEQUENCE / TEMPORAL_ASSOCIATION / UNKNOWN |
| **합계** | **39** | |

3차 감사에서 넘어온 판정은 이번 39건에 포함하지 않았다.
- 검토 표시 19건(`flagged_edges_review.md`)
- 나머지 PROBABLE_SAME 21명

## 2. 네트워크 결과에 가장 큰 영향을 주는 판정

1. **최윤덕 동일성.** split하면 betweenness가 168에서 0이 되고, 다른 노드 사이 도달 쌍 37개가 끊긴다. 기본 betweenness 2위가 이 판정 하나에 달려 있다.
2. **R1 18건(특히 일괄 방침).** 기본 입력에 들어가는 R1 관계는 14건이다.
   - 전부 제거하면 세종 betweenness는 858에서 728로, 전체 도달 쌍은 1052에서 915로 줄어든다.
   - 전부 조선 조정(ORG_JOSEON_COURT)으로 바꾸면 결과가 달라진다. 세종 betweenness는 906으로 오히려 늘고, 조정 노드가 427이 되며, 도달 쌍은 1240으로 늘어난다. 조정 노드가 새 중계점이 되기 때문이다.
   - 즉 'R1 제거'와 'R1 → 조정'은 정반대 방향으로 결과를 움직인다. 판정 선택지가 결과를 크게 가른다.
   - 개별로 보면 7건만 세종 지표를 움직인다. 해당 관계는 E1432_1209#3, E1433_0307#1, E1433_0507#1, E1434_0803#0, E1435_0408#0, E1437_0922#4, E1440_1126#0이다. 이들의 출발 노드는 세종을 거쳐서만 네트워크에 이어진다. 가장 큰 것은 1432-12-09 평안도 감사 보고로, 세종 betweenness가 37, 도달 쌍이 38 줄어든다.
   - 같은 pack 항목 WHO에 세종이 없는 R1 관계는 12건이다.
3. **황보인 동일성.** split하면 betweenness가 9에서 0이 되고, 도달 쌍 9개가 끊긴다.
4. **미반영 관계 9건.** 어느 것을 넣어도 기존 노드 사이 도달 쌍은 늘지 않는다(+0).
   - L292(지휘관들 → 대상 거주지)를 넣으면 세종 betweenness가 18, 최윤덕이 17 오른다. 새 대상 노드로 가는 경로를 중계하기 때문이다.
   - L503(현지 관원 → 조정)을 넣으면 세종이 16, 이천이 5 오른다.
   - **L290 `세종 / state -> 최윤덕 : COMMAND`는 넣어도 중심성 변화가 0이다.** 같은 방향 관계(1433-02-26 COMMAND_DESIGN, 03-25 COMMAND 등)가 이미 있기 때문이다. 원문대로 '기사일 이전' 시각을 주면 CERTAIN_ORDER 기본 지표에 아예 들어가지 않는다.
5. **EXPLICIT_CAUSAL 10건.** causalStatus는 중심성·경로 계산에 쓰이지 않는다. 판정은 인과 서술(스토리·사건 연결 해석)에만 영향을 준다.

## 3. 데이터 변경 없이 확인된 민감도 결과

**R7(기사일 대입) 민감도.** CURRENT 132건 중 108건이 기사일로 시각을 받는다. 이 108건을 빼면(SOURCE_DATED_ONLY) 결과는 다음과 같다.

| 지표 | CURRENT | SOURCE_DATED_ONLY |
|---|---|---|
| edge | 132 | 24 |
| node | 73 | 26 |
| 연결 요소 | 2 | 5 |
| 도달 쌍 | 1052 | 30 |
| 세종 기준 loop | 21 | 0 |

- 세종·황보인·김종서는 노드 자체가 사라진다.
- 최윤덕은 1433-04-10 부대 편성 관계 6건만 남고, betweenness는 168에서 0이 된다.
- 이천은 1437 정벌 지휘 관계만 남고, betweenness는 140에서 0이 된다.
- **현재 시간순 분석은 기사일 대입 규칙에 크게 의존함.**

**동일성 merged vs split 민감도**(3차 계산 재사용)

| 인물 | betweenness(merged → split) | 끊기는 도달 쌍 |
|---|---|---|
| 최윤덕 | 168 → 0 | 37 |
| 황보인 | 9 → 0 | 9 |

**R1 일괄 민감도.** 위 2-2 참조.

## 4. 현재 믿어도 되는 결과

이 결과들은 어느 판정이 나와도 바뀌지 않는다.
- 사건·관계의 **존재**: 각 관계에 붙은 pack 원문 줄 자체. 인용 대조는 integrity가 검사한다.
- **SOURCE_DATED_ONLY에 남는 24건의 순서.** pack이 사건 날짜·기간을 직접 준 현장 관계들이다.
  - 1433-04-10 최윤덕의 7개 부대 편성
  - 1435-01-13 여연성 방어
  - 1437-09 이천의 2차 정벌
  - 1443-09-14 이후 제보·방어
  - 1447-02~03 평안도 축성
- **'경로가 없다'의 의미.** CERTAIN_ORDER에서 경로가 없다는 것은 '날짜만으로 순서를 확정할 수 없다'는 뜻이다. 이 해석은 정의상 그대로 유지된다.
- 조사 범위 상태(1444 NONE, 1432·1449 PARTIAL)와 'FULL ≠ 전수 조사'.
- legacy 47건·해석 22건은 기본 분석에서 빠진다.

## 5. 아직 결론 내리면 안 되는 결과

- **세종의 중심성 수치와 순위.** 기사일 관례(B에서는 노드 소멸)와 R1 방침(제거 시 728, 조정 대체 시 906)에 모두 크게 의존한다.
- **최윤덕·황보인의 매개자 역할.** 동일성 판정 전까지 쓰지 않는다.
- **세종을 거치는 경로와 feedback loop 21개.** 모두 기사일 관례 위에 있다. B에서는 0개다.
- **'중앙 vs 현장' 행위자 비교.** A는 조정 쪽, B는 현장 쪽으로 기운다. 어느 쪽도 균형 잡힌 표본이 아니다.
- **인과 서술.** 다음 사건 연결의 인과는 판정 전까지 '정벌 때문에'로 서술하지 않는다.
  - 1433-05-16 노비 하사 ← 정벌(근거가 제목 줄뿐)
  - 1433-05-17 구휼 ← 4/19 공격
  - 1443 제보자 포상
- **김종서의 중심성.** PROBABLE_SAME이고, CERTAIN_ORDER에서 betweenness는 0이다. 반면 TEMPORALLY_NOT_EXCLUDED에서는 237이다. 시각 판정 방식과 동일성 둘 다에 달려 있다.

## 6. 다음 사람 검토 순서

1. **최윤덕 동일성** (`identity_choeyundeok_manual_review.md`)
   - 1432-12-11 중앙 협의(직책 미기재)와 1433 정벌 총지휘를 잇는 원문 진술을 찾는다.
   - 1437-08-20 'previous Gangye experience'가 본인 경험인지 확인한다.
2. **R1 일괄 방침**을 먼저 정하고, 18건을 개별 판정한다 (`r1_manual_review.md`).
   - 지표를 움직이는 7건과, WHO에 세종이 없는 12건을 우선한다.
   - 특히 E1443_1023#0은 WHO에 세종이 없고 의정부·예조가 있다.
3. **R7 관례의 타당성** (`r7_temporal_sensitivity.md`)
   - court_act 94건을 사건 유형별로 보고, 기사일 = 행위일로 볼 수 있는지 판단한다. 판정 단위는 관계가 아니라 사건 dateBasis다.
4. **L290 및 나머지 미반영 관계 8건** (`missing_pack_relations_review.md`)
   - L290은 결과 영향은 0이지만, 원문 관계가 빠져 있다는 사실 자체를 정리해야 한다.
5. **황보인 동일성** (`identity_hwangboin_manual_review.md`)
6. **EXPLICIT_CAUSAL 10건** (`causal_manual_review.md`)
   - 0516B 7건은 'pack 제목 줄이 인과 근거로 충분한가'라는 하나의 질문으로 함께 판정할 수 있다.
7. 판정이 끝난 항목만 최소 diff로 데이터에 반영한다.
   - 반영할 때는 AU4의 ROUND3_COUNTS를 판정 기록과 함께 의도적으로 갱신한다.
