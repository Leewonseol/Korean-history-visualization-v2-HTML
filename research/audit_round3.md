# 3차 감사 — 역사적 의미 검증(새 기능·새 관계 없음)

- 이번 라운드는 **데이터를 바꾸지 않았다.** 관계·인물·동일성 상태·인과 상태·근거 등급은 2차 감사 그대로다(1444 NONE, 1432·1449 PARTIAL, legacy 47·해석 22 기본 제외 유지).
- 바뀐 것: 사람 검토 문서 생성(`research/audit3/*.md`, `node tools/build-research.mjs` 또는 `node tools/audit-round3.mjs`)과 결과 화면의 해석 경고뿐이다.
- 검토 문서는 **판정 칸을 비워 둔다.** 대안 해석·유지 근거·후보 표시는 `tools/audit3-notes.mjs`의 검토 메모이며 판정이 아니다.
- 아래 수치는 작성 시점 값이다. 최신 값은 생성 문서가 데이터에서 다시 계산한다(무결성 테스트 AU1이 동기화 여부를 검사).

| 문서 | 내용 |
|---|---|
| `audit3/flagged_edges_review.md` | 검토 표시 19건: 원문 전체 문맥 · 현재 edge · 적용 규칙 · 대안 해석 · 유지 근거 · 판정란(KEEP / DOWNGRADE_TO_INTERPRETATION / SPLIT / REMOVE / NEEDS_SOURCE) |
| `audit3/identity_choeyundeok_hwangboin.md` | 최윤덕(pack 등장 27줄·10항목)·황보인(8항목)의 모든 등장: 날짜·직책 표현·사건·함께 등장한 인물·연속성·충돌 |
| `audit3/identity_sensitivity_merged_vs_split.md` | 두 사람을 merged / split 했을 때 중심성·도달 경로 비교 |
| `audit3/probable_same_identity_audit.md` | PROBABLE_SAME 23명 전체 감사표 |
| `audit3/rule_risk_audit.md` | R1~R7 사용 빈도·위험도(R1·R7 별도 절) |
| `audit3/explicit_causal_audit.md` | EXPLICIT_CAUSAL 24건 전수(근거 문구·판단 이유·후보) |
| `audit3/pack_relations_not_encoded.md` | 그래프에 반영되지 않은 pack RELATIONS 줄 23개 |

## 1. 이번 라운드에서 확인한 고위험 가정

1. **기사일 = 행위·도달일 관례.** CERTAIN_ORDER 기본 입력 132건 중 **108건**의 날짜가 이 관례에 의존한다(조정 행위 95 · 보고 접수 6 · 좁은 의미의 R7 5 · 구간 3, 검증 관계 기준 109). 경로의 '순서'와 같은 날 연쇄(PARTIAL_ORDER)는 대부분 이 관례에서 나온다.
2. **'같은 이름 = 같은 사람'(PROBABLE_SAME 23명).** pack은 세종·이천 말고는 누구도 여러 등장을 같은 사람이라고 진술하지 않는다.
   - 최윤덕을 사건별로 나누면 다른 인물 사이의 도달 쌍 37개가 끊긴다. 그의 betweenness 168은 전부 사건 사이를 잇는 데서 나오고, 나누면 0이 된다.
   - 황보인은 도달 쌍 9개가 끊기고 betweenness는 9에서 0이 된다.
   - 두 사람의 중심성은 사실상 동일인 가정의 산물이다.
3. **R1(조정 수신자 → 세종) 축약.** R1 18건 중 16건이 세종으로 간다. 세종의 기본 입력 in-degree 35 중 14가 R1이다. R1 관계를 빼면 세종의 betweenness는 858에서 728로, 이천은 140에서 115로 줄어든다. 세종 중심성의 일부는 '조정 = 국왕'이라는 표기 관례에서 나온다.
4. **규칙 파생 비중.** 기본 입력의 88%(132건 중 116건)가 NORMALIZED다. 원문 RELATIONS 줄을 그대로 옮긴 DIRECT 관계는 16건뿐이다. 그래프 구조의 대부분은 R3(집합→구성원 87건)·R4(무명 집단 34건)·R6(layer 선택 43건) 변환에 기대고 있다.
5. **시각 불확실 제외.** '기사일 이전'·시각 미상 관계 38건이 기본 지표에서 빠진다. 대부분 현장 행위(전투·추격·제보)라서, 지표는 조정 쪽 행위자를 상대적으로 과대평가하고 현장 행위자를 과소평가하는 방향으로 기울 수 있다.

## 2. 결과에 가장 큰 영향을 주는 데이터 문제

| 순위 | 문제 | 영향 | 문서 |
|---|---|---|---|
| 1 | 최윤덕 동일성(PROBABLE_SAME, 10개 pack 항목) | 기본 betweenness 2위 전체가 이 가정에 의존. 도달 쌍 37개 | identity_*.md |
| 2 | R1 축약(세종 in-degree의 40%) | 세종 betweenness 약 15% 차이 | rule_risk_audit.md |
| 3 | pack 관계 줄 미반영: `세종 / state -> 최윤덕 : COMMAND`(1433-05-07 L290) 등 인물·기관 사이 관계 9줄 | 최윤덕·세종 사이 정벌 명령 경로가 그래프에 없음. 반영 여부는 사람이 판단 | pack_relations_not_encoded.md |
| 4 | 기사일 관례(108/132) | 순서·경로 결과 전반 | rule_risk_audit.md R7 절 |
| 5 | EXPLICIT_CAUSAL 24건 중 REVIEW 11·DOWNGRADE_CANDIDATE 3 | 인과 링크 해석(지표에는 쓰이지 않음) | explicit_causal_audit.md |
| 6 | 1433-05-16 포상 대상의 다른 항목 명단 교차 참조(CROSS_ENTRY_MEMBERSHIP 6) | 최윤덕·이순몽 등의 REWARD 관계 6건 | flagged_edges_review.md |

## 3. 사람 검토 우선순위

1. **최윤덕 동일성:** 1432-12-11 중앙 협의 참여자와 1433 정벌 총지휘, 1434·1437 건의자를 원문 기사 본문으로 확인한다. 다음으로 황보인(1441~47 변경 실무와 1448 대신 논의).
2. **미반영 pack 관계 줄 9개:** 특히 L290 `세종 / state -> 최윤덕 : COMMAND`. 반영(새 관계 추가)은 사람 판정 뒤에만 한다.
3. **검토 표시 19건:** 우선순위는 다음과 같다.
   - RECIPIENT_SUBSTITUTED(`E1433_0610#0`)
   - SIDE_TO_PERSON(`E1433_08L10#8`)
   - CROSS_ENTRY_MEMBERSHIP 6건
   - RECIPIENT_IMPLICIT·RECIPIENT_FROM_ENTRY_RELATION 7건
   - PLACE_AS_TARGET 2건
   - ABOUT_RELATION 2건
4. **EXPLICIT_CAUSAL 하향 후보 3건:**
   - `E1443_1005#4·#5`: '기여가 크다'와 포상 사이에 '그래서'에 해당하는 표현이 없음
   - `E1433_0517 ← E1433_0419`: 병사자까지 포함하는데 연결 대상이 공격 사건
   - REVIEW 11건 중 근거가 pack 제목뿐인 0516B 7건
5. **R1 18건:** 'court → 세종' 축약을 유지할지, 조정 자리표시자(ORG_JOSEON_COURT)로 둘지 일괄 판단한다.
6. **PROBABLE_SAME 나머지 21명:** 특히 등장 공백이 4년 이상인 김종서(1432→1436, 1440→1448 공백 + 역할 범주 L3→L1 변화)·범찰(1433→1440)·정흠지(1432→1436). 생성표의 '검토 신호' 열 참고.

## 4. 아직 결론 내리면 안 되는 분석 결과

- **최윤덕·황보인의 중심성 순위.** 동일인 가정이 풀리면 0이 된다. "최윤덕이 중앙과 현장을 잇는 핵심 매개자였다" 같은 서술은 동일성 확인 전까지 쓰지 않는다.
- **세종의 압도적 중심성.** R1 관례와 기사일 관례에 크게 의존한다. 세종이 '모든 흐름의 중심'이라는 결론은 표기 관례의 결과일 수 있다.
- **연도별 변화.** 1432·1449는 PARTIAL, 1444는 NA다. FULL 연도도 seed 기사뿐이므로 연도 간 활동량 비교 결론은 내릴 수 없다.
- **CERTAIN_ORDER 경로의 '부재'.** 경로가 없다는 것은 시각이 확정된 관계로는 이어지지 않는다는 뜻이다. 실제로 정보가 흐르지 않았다는 결론이 아니다(시각 불확실 제외 38건).
- **TEMPORALLY_NOT_EXCLUDED·UNCERTAIN 경로.** 시간과 모순되지 않을 뿐, 순서를 입증하지 않는다.
- **EXPLICIT_CAUSAL 사건 연결 4건의 인과 범위.** '정벌 전체'인지 '4/19 공격'인지 미확정이다.
- **현장 행위자의 낮은 중심성.** 시각 불확실 제외와 group 노드 처리(R4) 때문에 체계적으로 낮게 나올 수 있다.

## 5. 이번 라운드의 코드 변경(검토 보조만)

- `tools/audit-round3.mjs`, `tools/audit3-notes.mjs`: 검토 문서 생성기와 검토 메모(판정 없음). `research/audit3/round1_direct_relations.json`: 1차 분류 스냅샷.
- `src/analysis/caveats.js` + UI: 중심성·경로 결과(분석 탭 지표표·경로·루프·trajectory·layer표, 인물 탭 지표, 노드 크기 지표 사용 시 네트워크 상태줄)에 해석 경고를 붙였다.
  - 경고 항목: 동일성 미해결 노드 수, 시각 불확실 제외 수, 규칙 파생 비중, 조사 범위 불완전 연도
  - FULL 연도도 '전수 조사 완료'가 아님을 UI·문서에 명시했다.
- 테스트:
  - integrity: AU1(검토 문서 동기화, 판정 칸 비움), AU2(동일성 자동 승격 없음), AU3(경고 계산)
  - E2E: 경고 표시 3곳
