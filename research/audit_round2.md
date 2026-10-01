# 2차 감사 — '출처가 붙어 있음'과 '직접 입증됨'의 분리

- 기준: 사용자 제공 VALIDATED HISTORICAL SOURCE PACK v1만 ground truth. 새 사건·인물·관계·추론을 추가하지 않았다.
- pack 원문을 `research/pack_v1/source_pack_v1.txt`에 그대로 보관하고, 모든 근거 인용(quote)을 integrity 테스트가 원문 줄과 글자 그대로 대조한다.
- 아래 수치는 이 문서 작성 시점의 값이다. 최신 값은 코드가 계산해 `methodology.md` §10~12, `people_authority.md`, `normalized_edges_audit.md`에 자동 기록한다.

## 1. 근거 등급(evidence class)

| 등급 | 1차 감사 분류 | 2차(엄격) 분류 |
|---|---|---|
| 직접 사료 근거(DIRECT) | 53 | **20** |
| 규칙 파생(NORMALIZED, R1~R6) | 122 | **153** |
| legacy | 47 | 47 |
| 편집자 해석 | 20 | **22** |

DIRECT 기준을 형식화했다: pack RELATIONS 줄에 주체·객체가 이름(또는 'state/Joseon/court(주체)' 자리표시자)으로 그대로 있고,
라벨→layer가 일대일이며, 어떤 정규화 규칙도 쓰지 않은 경우. 이 기준을 기계적으로 적용하자 1차에서 'pack 직접'으로 표시했던
관계 35건이 실제로는 정규화가 필요한 것으로 드러났고, 반대로 R1 오적용을 고친 2건(§5-2)은 원문 줄 그대로가 되어 DIRECT가 됐다(53 − 35 + 2 = 20).

## 2. 정규화 관계 감사 가능성

- 규칙 명세: `research/normalization_rules.md`(rule_id · 입력 원문 패턴 · 생성 가능한 relation · 방향 결정 · 양방향 허용 · causal 생성 가능 여부 · 금지 사례 · 예시 · 적용 수).
- 관계별 추적: `src/data/relationTraces.js` — DIRECT·NORMALIZED 173건 전부(source_id, locator, 원문 quote, 원문 주체/객체, 정규화 주체/객체, 규칙, R3 구성원 근거 줄, 보조 근거 줄, 검토 표시).
- 감사표: `research/normalized_edges_audit.md` — 원문 → 규칙 → 생성된 edge 순서, 관계마다 사람 검토란. **자동 '정상' 판정 없음.**
- R7(조정 도달 보고의 시각 = 기사일)은 관계의 존재 근거가 아니라 시각 근거라서 근거 등급을 바꾸지 않는다(시각은 dateBasis로 따로 기록).

## 3. 동일성

| identityStatus | 수 |
|---|---|
| VERIFIED_SAME (pack 원문 근거 필수) | 2 — 세종, 이천 |
| PROBABLE_SAME (같은 이름 등장 묶음, 미해결) | 23 |
| UNRESOLVED_DISTINCT (분리, 병합 금지) | 3 — 홍사석(1437), 김효성(1443), 이진(1437) |
| SINGLE_ATTESTATION | 69 |
| COLLECTIVE_OR_OFFICE | 52 |

동일성 미해결 인물 노드 26. 병합 민감도: 최윤덕(쪼개면 다른 노드 사이 도달 쌍 37개가 끊기고 betweenness 168 → 0)·
황보인(9개)의 경로·중심성은 '같은 이름 = 같은 사람' 가정에 의존한다. 경로 결과는 이런 지점을 '동일성 가정'으로 표시한다.

## 4. 날짜 불확실성·coverage

- 일 단위로 확정되지 않은 관계 54(하한 미상 '기사일 이전' 42). 기본 지표(1432~1449 전체 창): 포함 132 · 시각 불확실 제외 38 · '~에 관한' 제외 3.
- 제외 38건은 모두 '기사일 이전' 또는 '시각 미상' 관계이며 규칙 파생(NORMALIZED)에서 제외율이 더 높다(23% vs 16%). 분포는 methodology §11.
- 경로 모드 이름: `CERTAIN_ORDER` / `TEMPORALLY_NOT_EXCLUDED`("시간 정보상 모순되지 않지만 실제 순서를 입증하지는 않음").
- 연도 범위(scopeStatus): FULL 15 · PARTIAL 2(1432: 12-09부터, 1449: 07-07까지) · NONE 1(1444, NA). FULL도 기사 전수가 아님(SEED_ONLY).

## 5. 이번에 새로 드러난 데이터 문제와 처리

1. **'직접'으로 잘못 분류된 관계 35건** → NORMALIZED로 재분류(데이터 내용은 그대로). 주된 규칙 기준:
   무명 집단을 group 노드로 바꾼 것(R4) 17, 집합 지칭을 구성원으로 펼친 것(R3) 11, 둘 이상 layer로 갈 수 있는 라벨에서 하나를 고른 것(R6) 7.
2. **R1 오적용 5건 교정**(1차 감사 M5와 같은 원칙): 정치체 '조선/Joseon'을 세종으로 바꾼 4건(`E1432_1221#0·#1`, `E1433_08L10#0·#7`)과
   주체 'court'를 세종으로 바꾼 1건(`E1443_1023#1`) → `ORG_JOSEON_COURT`. 그 결과 1432-12-21 이만주 측 주장·유을합 송환은 세종이 아니라 '조선 조정'으로 연결된다.
3. **R1~R7 밖의 추론 2건 → 해석으로 재분류**: `E1435_0312#0`('provincial government'를 지명으로 함길도 관아로 특정),
   `E1437_0922#3`('field'를 이천으로 특정). 원문 확인 전까지 기본 분석에서 빠진다.
4. **규칙 표기 오류 4건**: `E1433_0516B#*` R4→R3, `E1433_0517#1` R5→R3, `E1437_0922#4` R7→R5(+R1), `E1439_0510#2` R7→R1.
5. **사람 검토 표시 19건**: 수신자 추정(RECIPIENT_IMPLICIT 2, RECIPIENT_FROM_ENTRY_RELATION 5, RECIPIENT_SUBSTITUTED 1 — 맹가첩목아의 진술을 들은 사람을 지함으로 둠),
   다른 항목 명단으로 구성원 판정(CROSS_ENTRY_MEMBERSHIP 6 — 1433-05-16 포상 대상을 5/7 지휘관 명단으로 판정), '이만주 side'→이만주(SIDE_TO_PERSON 1),
   지명 공격 대상→피해 집단(PLACE_AS_TARGET 2), '~에 관한' 관계(ABOUT_RELATION 2).
6. **인과 상태 재정의**: EXPLICIT_CAUSAL 20(관계)·4(사건 연결) 모두 원문 이유 표현을 causalEvidence로 붙였다.
   1차의 sequence_only/same_record/same_campaign은 TEMPORAL_ASSOCIATION 1·PROCEDURAL_SEQUENCE 3으로, legacy 링크는 UNKNOWN.

## 6. 아직 사람의 사료 검토가 필요한 항목

- `normalized_edges_audit.md`의 NORMALIZED 153건 검토란, 특히 검토 표시 19건
- 해석으로 내린 2건(`E1435_0312#0`, `E1437_0922#3`)의 원문 주체
- PROBABLE_SAME 23명의 동일성(특히 병합 민감도가 큰 최윤덕·황보인)과 UNRESOLVED_DISTINCT 3쌍
- 이천 VERIFIED_SAME의 근거 문장(pack 서술 2줄)과 세종의 OFFICE_UNIQUENESS 근거가 충분한지
- legacy 16사건·47관계의 원문 재대조, 1444년과 각 연도 월별 전수 조사, 『서정록』 원문
- 1차 감사에서 남긴 D12·D15·D18·D08
