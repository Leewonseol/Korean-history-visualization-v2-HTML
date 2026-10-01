# 방법론 (methodology)

## 1. 연구 질문과 Lasswell 확장

> **Who gets What, When, How, Where, and with What Outcome?**

모든 EVENT는 다음 필드를 가지며, `validateData()`는 WHO·WHAT·WHEN·HOW·WHERE·OUTCOME 중 하나라도 비면 오류를 낸다.

| 질문 | EVENT 필드 | 비고 |
|---|---|---|
| WHO | `actors`, `targets`, `decisionMakers`, `informationSources`, `beneficiaries`, `victims` | `subjects`는 '언급 대상'일 뿐 참여자가 아님 |
| GETS / LOSES WHAT | `what[] = {type, value, quantity, unit, giverId, receiverId}` | type: gain·loss·burden·transfer·recover·claim |
| WHEN | `dateMin`, `dateMax`, `datePrecision`, `recordDate`, `dateBasis` | 아래 §3 (가짜 정밀도 금지) |
| HOW | `mechanisms[]`, `documentType`, `embeddedDocumentAuthor` | 왕명·정책논의·장계·치계·회계·동원·추격·전투·외교·축성·사민·포상·처벌 등 |
| WHERE | `theater[]`, `placeIds[]`, `locationNote` | 위치 불분명은 `locationNote`에 명시. 좌표는 근거 없으면 null |
| OUTCOME | `outcomes[] = {type, subjectId, quantity, unit, reportedBy, certainty}` | `reportedBy`가 있으면 '조선 측 보고 수치' 등으로 표시 |

## 2. Multilevel 과 Multilayer 의 구분

- **LEVEL = 행위자의 제도적 위치** (노드 속성, 시간 가변): L0 왕 / L1 중앙 정책·행정 관료 / L2 중앙 군사 엘리트 / L3 지방 최고지휘관 /
  L4 현장 지휘관·군관·지방관 / L5 군졸 / L6 지방 주민 / L7 외부 정치·군사 행위자 / **LU 소속·위치 미상**
  (예: 출처 미상의 첩보 제공자, 출신이 기재되지 않은 하사 노비 — 추정해서 다른 level에 넣지 않기 위함).
  `levelAt(person, t)` = t 이전의 가장 최근 **pack 관직·역할 증언**(PERSON_ATTESTATIONS, provenance가 pack)의 level, 없으면 `defaultLevel`.
  증언은 기사일의 기록일 뿐 구간이 아니다(다음 기록 전날까지 유지됐다고 역산하지 않음). legacy(v2) 증언은 표시만 하고 level 계산에 쓰지 않는다.
  level은 편집자 분류(`levelBasis: editorial_classification`)이며 사료 용어가 아니다. 화면의 세로 band는 커서 시점의 level이다.
- **LAYER = 관계의 종류** (edge 속성): POLICY, COMMAND, REPORT, INTELLIGENCE, INVESTIGATION, LOGISTICS, MILITARY_ACTION,
  MILITARY_CONFLICT, DIPLOMACY, CLAIM, COUNTER_CLAIM, REWARD, PUNISHMENT, ACCOUNTABILITY, WELFARE, FORTIFICATION,
  RESETTLEMENT, BORDER_ADMINISTRATION, COOPERATION, **LABOR_MOBILIZATION**(부역·축성 노동 동원 — 군사 동원(COMMAND)이나
  축성 행위(FORTIFICATION)와 의미가 달라 추가). 세부 행위는 `relationType`(예: advise, solicit_opinion, propose_reward,
  official_accusation)으로 구분하고 같은 의미의 layer를 새로 만들지 않는다.
  - v2의 MEDIATION → DIPLOMACY(`mediation_order`), POLICY_ADVICE/POLICY_DISAGREEMENT → POLICY(`advise`/`remonstrate`),
    ACCUSATION → CLAIM(`official_accusation`), DEFENSE_REFORM → FORTIFICATION, MIGRATION → RESETTLEMENT,
    SUBORDINATE(소속) → edge가 아니라 관직·역할 증언(PERSON_ATTESTATIONS)으로 이동.
  - ACCOUNTABILITY(책임 추궁·탄핵 요구)와 PUNISHMENT(실제 처분)를 구분한다.
- level 필터는 **관계 시점의 양 끝 노드 level**에 적용된다(두 끝이 모두 선택된 level이어야 contact가 남는다).

## 3. 날짜 표현

- 모든 날짜는 실록의 **음력 날짜** 문자열 `YYYY-MM-DD`, 윤달은 `YYYY-MML-DD`(예: 세종 15년 윤8월 10일 = `1433-08L-10`).
  연도는 해당 음력 연도의 관용 서기 연도다(1432-12-09는 양력으로는 1433년 초). 양력 변환은 하지 않았다.
- 문자열 사전순 = 시간순이 되도록 설계했다(`'-' < 'L'`이므로 8월 < 윤8월 < 9월).
- 사건 시각은 **범위**로 쓴다: `dateMin`·`dateMax`(null = 그 쪽 경계 미상), `datePrecision` ∈ DAY / MONTH / YEAR / UNKNOWN.
  - DAY: 두 경계가 일 단위 날짜(같으면 하루, 다르면 일 단위 구간 — 예: 1433-04-10~04-19 공격).
  - MONTH: `YYYY-MM-00`~`YYYY-MM-99`(월 안의 날짜 미상). YEAR: `YYYY-00-00`~`YYYY-99-99`(지리지 연 단위 서술).
  - UNKNOWN: 한쪽 경계만 알려짐. 대표적으로 **'기사일 이전'** — 현장 행위의 날짜가 기사에 없으면 `dateMin = null, dateMax = 기사일`.
    현장 행위를 기사일에 일어난 것처럼 두지 않는다(감사 H1).
- `recordDate`: 실록 기사 게재일(지리지는 null). `dateBasis`: 날짜 근거
  (`pack_event_date` / `pack_event_range` / `court_act_on_record_date` / `report_receipt_on_record_date` / `before_record_date` / `year_only_geography` / `legacy_month`).
  조정의 논의·명령, 조정에 도달한 보고는 기사일을 행위일로 보는 관례를 쓰고 그 사실을 `dateBasis`에 남긴다.
- 관계도 자기 시각을 가질 수 있다: `dateMin`·`dateMax`·`timeKind`(instant = 범위 안의 미상 한 시점 / duration = 범위 전체 지속).
  없으면 사건 범위를 물려받는다.
- 사건 정렬·화면 배치에는 `dateMin → dateMax → recordDate` 순의 대표 날짜를 쓰지만, **순서 판단(경로·지표)에는 쓰지 않는다**(§5).
- `validateData()`는 recordDate가 사건 실록 사료의 게재일과 같은지, 정밀도와 경계 표기가 맞는지 검사한다.
- 기간 길이·지연시간은 근사 월 인덱스 `m(t) = 12·y + (월−1) + 0.5·[윤달] + (일−1)/30`으로 계산한다(정확한 일수 아님).

## 3-1. 근거 계보(provenance)와 정규화 규칙

- 모든 사건·관계·인물·증언·스토리 문장은 `provenance`를 가진다:
  `pack_v1_direct`(pack v1에 직접 명시) / `pack_v1_derived`(pack 항목을 아래 규칙으로만 변환) /
  `inherited_v2`·`legacy_anchor_seed`(legacy, 검증 데이터 아님) / `interpretation`(편집자 해석). `unknown_provenance`는 허용하지 않는다.
- `evidenceStatus` = provenance의 묶음: verified(pack 직접·정규화) / legacy / interpretation.
  **화면과 지표의 기본 데이터셋은 verified뿐**이며, 왼쪽 '근거' 토글(legacy 포함·해석 포함)을 켤 때만 다른 묶음이 들어간다.
- `pack_v1_derived`에 허용되는 규칙(`derivationRule`, vocab.DERIVATION_RULES):
  R1 조정 수신자 → 세종 노드 · R2 'A가 B를 통해' 보고 분리 · R3 집합 표현을 같은 항목 WHO 구성원으로 펼침 ·
  R4 무명 집합 → group 노드 · R5 WHAT 문장의 명시 행위자 · R6 pack 관계 라벨 → layer 매핑 · R7 조정 도달 보고의 시각 = 기사일.
  이 밖의 변환은 interpretation이다.
- 사료 사용 상태(`SOURCE_USAGE`): VERIFIED_USED / VERIFIED_UNUSED / REGISTERED_UNCHECKED(본문 미확인 — 사용하면 오류) / LEGACY / BIBLIOGRAPHIC_ONLY.
  경고를 숨기지 않고 상태별 메시지로 보여 준다(감사 M4).

## 3-2. 수신자 표기 관례

- 사료가 '조정/국왕에게' 보고·전달했다고 하면 target = 세종(R1, 조정 보고의 최종 수신자 표기 관례).
- 사료가 '조선 측' 또는 '국가(state)'로만 쓰면 `ORG_JOSEON_COURT`(주체·수신자 미특정). 이 노드로 끊긴 경로는 끊긴 그대로 둔다 —
  경로를 잇기 위해 수신자를 추정하지 않는다.
- 직위만 기록된 주체(평안도 감사, 함길도 도절제사 등)는 기관 노드로 두고 실명 인물과 병합하지 않는다.
- 기사에 이름은 나오지만 행위가 기록되지 않은 인물은 `subjects`(언급 대상)에만 넣고 관계를 만들지 않는다.
- '기대된 회신'(예: 1436 세종이 이천에게 검토를 요구)처럼 아직 일어나지 않은 행위는 관계로 만들지 않는다.
- 실록 편찬자의 평가(예: 1446 무창 실패의 원인 서술)는 행위자의 처벌 행위가 아니므로 관계가 아닌 결과(`attributed_failure`)로 기록한다.

## 4. Temporal network 정의

- 사건 e의 relation r 하나가 **contact** `c = (u, v, ℓ, [tMin, tMax], kind, κ, σ, π)` 하나가 된다.
  u→v 방향, ℓ = layer, [tMin, tMax] = 시각 범위(null = 미상), kind = instant/duration, κ = certainty, σ = causalStatus(기본 unknown), π = provenance.
- **방향 정책(layer별, vocab.DIRECTION_POLICY).** POLICY·COOPERATION만 `declared` — pack이 `<->`로 기록한 경우에만(`directionEvidence`) undirected를
  허용하고, 나머지 layer는 모두 directed. undirected relation은 두 방향의 arc로 쓴다(현재 1432-12-21 조정 논의 13건).
- **경로 대상 여부.** `pathEligible: false`는 '~에 관한' 관계(맹가첩목아의 반박이 지목한 인물, 조건부 표적 기준 등)로,
  화면에는 보이지만 경로·중심성 계산에서는 빠진다.
- EDGES 배열을 손으로 관리하지 않는다. contact는 `deriveContacts(EVENTS)`에서만 만든다.
- 분석·표시 창 W = [t0, T]와 필터 F(근거, layer, level, theater, certainty, 사료 유형)를 적용한 contact 집합이 모든 지표의 입력이다.
  창 포함 판정은 세 가지다.
  - display(화면): 표시 범위(미상 경계는 기사일 등 대표 날짜로 대체)가 W와 겹치면 표시.
  - **strict(지표 기본값)**: tMin·tMax가 모두 알려져 있고 instant는 [tMin, tMax] ⊆ W, duration은 W와 겹칠 때만. 그 밖의 관계는 빠지고
    분석 패널에 '시각 불확실 제외 n개'로 보고한다.
  - possible: 미상 경계를 열린 것으로 보고 W와 겹칠 수 있으면 포함(경로 탐색의 '가능한 순서' 모드).
  - 기간 필터: [연도 시작, 연도 끝]. '타임라인 커서까지'가 켜져 있으면 T = min(T, 커서 사건의 기사일).
  - 화면 표시 창: 누적(기간 시작~커서) / 최근 12개월 / 현재 사건만.
- 정적 네트워크에 날짜 필터만 씌운 것이 아니라, 아래 경로·중심성은 모두 contact의 **시간 순서**를 사용한다.

## 5. Time-respecting path

경로 P = (c₁, …, c_k)는 c_i의 head가 c_{i+1}의 tail이고 시간 순서를 지킬 때만 time-respecting이다. 이동 시간은 0으로 둔다.
날짜가 범위·미상일 수 있으므로 순서 판정은 두 가지 모드로 한다.

- **strict(확실한 순서, 기본)** — 직전 도착 시각 a에서
  - instant contact: `tMin ≠ null` 이고 `tMin ≥ a`일 때만 사용. 새 도착 = `tMax`(보수적: 범위 안 어느 시점이었든 그 이후).
  - duration contact: `tMax ≥ a`일 때 사용. 새 도착 = `max(a, tMin)`.
  - 따라서 '기사일 이전'(tMin 미상) 관계, 같은 해의 연 단위 관계 둘 등은 서로 순서를 매기지 않는다.
- **possible(가능한 순서)** — lo = tMin ?? −∞, hi = tMax ?? +∞. `hi ≥ a`이면 사용, 새 도착 = `max(a, lo)`(낙관적).

두 모드 모두 도착 시각이 단조 비감소이므로 라벨 L(v) = (a(v), h(v))를 사전식으로 최소화하는 label-setting(Dijkstra형) 알고리즘이 정당하다.
얻는 경로는 **모든 접두부가 라벨 최적인 foremost 경로**(prefix-optimal foremost, Buß et al. 2020의 prefix-foremost를 hop 수로 tie-break한 변형)다.

**경로 플래그.**
- `EXACT`: 모든 관계가 일 단위 단일 날짜이고 단계마다 날짜가 엄격히 증가.
- `PARTIAL_ORDER`: 순서는 확실하나 같은 날 연쇄(같은 날 안의 순서는 사료에 없음)나 범위 날짜가 섞여 정확한 시각은 모름.
- `UNCERTAIN`: 날짜만으로 순서가 확정되지 않는 단계가 있음(possible 모드에서만 생김).

- `temporalPath(C, S, v, t0, T, mode)`: 출발 집합 S(인물 하나, 또는 사건의 actors 전원 — 사건 하한 시각부터, 하한 미상이면 창 시작부터).
- `isTimeRespecting(steps, t0, mode)`: 같은 규칙으로 경로를 다시 따라가 검사(UI에 '시간 순행 검사' 표시).
- `feedbackLoops(C, a, t0, T, mode)`: a → … → x → a. 루프마다 같은 플래그를 붙인다.
- **경로 ≠ 인과.** 시간 순행 경로는 정보·명령이 흐를 '수 있었던' 통로일 뿐이다. 인과는 관계의 `causalStatus`와
  사건 사이 `eventLinks`(linkType causal / same_record / same_campaign / reference)로 따로 기록하며,
  causal 링크는 pack 문장이 직접 연결할 때(explicit) 또는 강하게 시사할 때만 허용한다. 시간 선후만으로 만들지 않는다.

## 6. 지표 정의 (모두 C(W, F) 위에서 계산)

입력 C = strict 판정의 verified(기본) contact 중 경로 대상(`pathEligible`)인 것. N = C에 등장하는 노드 수, 창의 연도 수 Y = year(T) − year(t0) + 1.

1. **Temporal in-degree / out-degree**: k_in(v) = |{c ∈ C : head(c) = v}|, k_out(v) = |{c : tail(c) = v}| (중복 contact 포함).
   degree = k_in + k_out.
2. **Temporal activity**: v가 끝점인 contact들이 속한 서로 다른 사건 수.
3. **Active span**: m(마지막 활동일) − m(첫 활동일), 개월(근사).
4. **Node persistence**: v가 contact를 가진 연도 수 / Y.
5. **Layer diversity**: v가 관여한 서로 다른 layer 수 L(v), 정규화 Shannon entropy H(v)/ln L(v) (L(v) ≥ 2일 때).
6. **Centrality trajectory**: 창 안의 각 연도 y에 대해 slice W_y = [y년 시작, y년 끝] ∩ W에서 2·8을 독립적으로 다시 계산한 수열.
   slice 입력도 strict 판정이다(그 해 안에 확실히 있는 관계만, 제외 수 보고). 연도 축은 coverage 레지스트리에서 오며,
   NOT_COVERED 연도(1444)는 0이 아니라 **값 없음(미수록)**으로 그린다. 기간 필터를 바꾸면 연도 집합 자체가 바뀐다.
7. **Earliest-arrival temporal closeness**:
   C_clo(u) = (1/(N−1)) · Σ_{v ≠ u, a_u(v) 존재} 1 / (1 + Δ_u(v)),  Δ_u(v) = m(a_u(v)) − m(t*)  (개월)
   여기서 a_u(v)는 t0에서 u를 출발한 earliest arrival, t* = max(t0, 창 안 첫 contact 시각). 도달 불가 노드는 0을 더한다
   (harmonic 형태로 비연결을 처리). 참고: Pan & Saramäki(2011)의 temporal closeness는 출발 시각에 대해 평균을 내지만,
   여기서는 창 시작 단일 출발 시각을 쓰는 단순화이므로 이름 그대로 '창 시작 기준 earliest-arrival closeness'로만 해석해야 한다.
8. **Temporal betweenness (time-respecting paths)**: 각 출발점 s에 대해 §5의 라벨을 계산하고,
   predecessor DAG = {(u→v) : contact c를 strict 규칙으로 a(u)에서 지나면 정확히 a(v)에 도착하고 h(u)+1 = h(v)}를 만든다(같은 (u,v)는 1개로 셈).
   σ_s(s)=1, σ_s(v) = Σ_{u∈pred(v)} σ_s(u)를 (a, h) 순서로 계산하고, Brandes 방식의 의존도
   δ_s(u) = Σ_{v: u∈pred(v)} (σ_s(u)/σ_s(v)) (1 + δ_s(v))를 역순으로 누적해 B(u) = Σ_{s≠u} δ_s(u).
   정규화값 B(u)/((N−1)(N−2))도 함께 제공한다. 즉 "s에서 v로 가는 prefix-optimal foremost 경로들 가운데 u를 지나는 비율"의 합이다.
   참고: Tang et al.(2010), Kim & Anderson(2012), Buß et al.(2020).
9. **Broadcast / receive (dynamic communicability)**: Grindrod et al.(2011).
   시간 slice = 창 안의 서로 다른 날짜 t₁ < … < t_K, A[k] = 날짜 t_k의 방향 인접행렬(0/1).
   **일 단위로 확정된(exact) contact만** slice에 넣는다. 범위·미상 날짜를 임의의 날짜에 배치하지 않으며 제외 수를 표시한다.
   Q = (I − αA[1])⁻¹ (I − αA[2])⁻¹ ⋯ (I − αA[K])⁻¹,  α = min(0.5, 0.9 / max_k ρ(A[k]))  (ρ = 스펙트럼 반지름, 모두 0이면 α = 0.5)
   broadcast(i) = Σ_j (Q − I)_ij,  receive(j) = Σ_i (Q − I)_ij.
   Q의 (i,j) 원소는 i에서 j로 가는 시간 순행 walk을 길이 n마다 αⁿ로 가중해 합한 값이다. 같은 날짜 안에서는 하나의 slice라
   그 날짜 안의 연쇄는 Q에 들어가지 않는다(경로 탐색과의 차이). α가 작아 수치는 0에 가까울 수 있으며 상대 비교에만 쓴다.

**계산하지 않는 것.** 정적 PageRank·정적 eigenvector·정적 betweenness는 계산하지 않으며, 이름만 '동적'인 임의 지표를 만들지 않는다.
Temporal PageRank(Rozenshtein & Gionis 2016), temporal eigenvector(Taylor et al. 2017)는 구현하지 않았다.

**주인공 자동 선정 없음.** 지표 표는 정렬 기능만 있고 '주인공'을 판정하지 않는다. 인물 패널은 최초·최종 등장, 활동기간,
사건 수, 관계 수, layer·장소 다양성, 중앙(L0–L2)↔현장(L3–L6) 연결 횟수(관계 시점 level 기준), 보고·지휘 발신/수신,
전투 참여, 포상·처벌·피해, 정책결정 참여, 연도별 degree/betweenness trajectory를 나란히 보여줄 뿐이다.

## 7. 사실·주장·해석의 분리 (certainty)

| certainty | 의미 | 선 모양 |
|---|---|---|
| confirmed | 행위가 사료에 기록됨(내용의 진위와는 별개: 예컨대 '문죄했다'는 사실) | 실선 |
| contemporary_claim | 당대 당사자의 주장 | 점선 |
| disputed | 다툼·미확정 | 점선 |
| interpretation | 편집자 해석(provenance도 interpretation이어야 함) | 파선 |
| secondary_only | 2차자료에만 근거 | 파선 |
| unverified_seed | 원문 미대조 시드(사용자 제시 anchor) | 파선 |

선 색은 layer, 선 모양은 certainty로 분리해 두 시각 변수가 충돌하지 않게 했다.
`validateData()`는 confirmed 관계가 1차·당대 사료 없이 만들어지거나, interpretation 관계가 confirmed로 표시되면 오류를 낸다.
certainty(내용의 확실성)와 provenance(근거 계보)는 별개 축이다: legacy 관계는 반투명 잔 점선으로 따로 그린다.

## 8. edge 생성 규칙

- 사료에서 구체적 행위·관계가 확인될 때만 relation을 만든다. 같은 기사에 이름이 함께 나온다는 이유만으로 만들지 않는다.
- 기관 주어 행위는 기관 노드로, 무명 집단은 group 노드로 둔다.
- 행위가 아닌 소속(관하·부하)은 관직·역할 증언으로 기록하고 edge로 만들지 않는다.
- 동일성: 이름 표기의 근거(`nameFormVerified`, pack 인명록)와 동일인 여부(`identityStatus`)를 분리한다. 동일성이 pack에 명시되지 않은
  후기 등장(홍사석 1437, 김효성 1443, 이진 1437)은 별도 노드 + `possibleSameAs`(unresolved_homonym)로 두고 자동 병합하지 않는다.
- 장소: 좌표는 넣지 않는다(`coordinateStatus: pack_no_coordinate`). 상위 장소(parentPlaceId)는 pack 서술 근거(`parentBasis`)가 있을 때만.
- 행위의 '대상'이 아닌 '언급 대상'(예: 세종의 지시 속 맹가첩목아)은 `subjects`에만 넣는다.

## 9. coverage(연도별 조사 범위)

`src/data/coverage.js`가 연도별 상태를 직접 기록한다(VERIFIED_WITH_EVENTS / VERIFIED_NO_RELEVANT_EVENT / NOT_COVERED / PARTIAL / UNKNOWN).
타임라인·연구 문서 생성기·검증기는 이 표를 읽으며 사건 유무로 추론하지 않는다. 1444년은 NOT_COVERED —
'현재 검증팩에서 미조사/미수록'이며 그 해에 사건이 없었다는 뜻이 아니다. 검증 연도도 전수 조사가 아니다(completeness SEED_ONLY).

## 10. 현재 데이터 통계

<!-- GENERATED:STATS -->
- 사건 70 · 행위자 149 · 장소 43 · 사료 69 · relation(edge) 242 · 관직·역할 증언 32
- relation 근거: pack v1 검증 175 · legacy 47 · 해석 20 · 출처 불명 0 · 사료 없는 relation 0
- 일 단위 확정 relation 188 · 범위/미상 54 · 하한 미상(기사일 이전) 42
- undirected 13 · 경로 제외('~에 관한') 6

| provenance | edge 수 |
|---|---|
| pack_v1_direct | 53 |
| pack_v1_derived | 122 |
| inherited_v2 | 46 |
| legacy_anchor_seed | 1 |
| interpretation | 20 |
| unknown_provenance | 0 |

| causalStatus | edge 수 |
|---|---|
| explicit | 20 |
| strongly_implied | 0 |
| sequence_only | 0 |
| unknown | 222 |

| layer | edge 수 |
|---|---|
| POLICY (정책(건의·논의·결정)) | 78 |
| COMMAND (명령·임명·파견) | 38 |
| REPORT (보고(장계·치계·회계)) | 16 |
| INTELLIGENCE (정보·제보) | 13 |
| INVESTIGATION (조사) | 1 |
| LOGISTICS (병참·군량·병기) | 0 |
| MILITARY_ACTION (군사행동(추격·배치·정찰)) | 6 |
| MILITARY_CONFLICT (무력충돌) | 11 |
| DIPLOMACY (외교·통교·중재) | 22 |
| CLAIM (주장·문죄) | 4 |
| COUNTER_CLAIM (반박 주장) | 3 |
| REWARD (포상) | 17 |
| PUNISHMENT (처벌·처분) | 3 |
| ACCOUNTABILITY (책임추궁·탄핵) | 4 |
| WELFARE (전사자·피해자 예우) | 6 |
| FORTIFICATION (축성·진보 설치·방비) | 7 |
| RESETTLEMENT (사민·입거·이주) | 4 |
| BORDER_ADMINISTRATION (변경 행정(군현·진 설치)) | 6 |
| LABOR_MOBILIZATION (부역·노동 동원) | 3 |
| COOPERATION (협력) | 0 |

| certainty | edge 수 |
|---|---|
| confirmed | 216 |
| contemporary_claim | 5 |
| disputed | 0 |
| interpretation | 20 |
| secondary_only | 0 |
| unverified_seed | 1 |
<!-- /GENERATED:STATS -->

## 참고문헌

- Holme, P., & Saramäki, J. (2012). Temporal networks. *Physics Reports*, 519(3), 97–125.
- Pan, R. K., & Saramäki, J. (2011). Path lengths, correlations, and centrality in temporal networks. *Physical Review E*, 84, 016105.
- Tang, J., Musolesi, M., Mascolo, C., Latora, V., & Nicosia, V. (2010). Analysing information flows and key mediators through temporal centrality metrics. *Proc. 3rd Workshop on Social Network Systems (SNS '10)*.
- Kim, H., & Anderson, R. (2012). Temporal node centrality in complex networks. *Physical Review E*, 85, 026107.
- Buß, S., Molter, H., Niedermeier, R., & Rymar, M. (2020). Algorithmic aspects of temporal betweenness. *Proc. KDD 2020*.
- Grindrod, P., Parsons, M. C., Higham, D. J., & Estrada, E. (2011). Communicability across evolving networks. *Physical Review E*, 83, 046120.
- Brandes, U. (2001). A faster algorithm for betweenness centrality. *Journal of Mathematical Sociology*, 25(2), 163–177.
- Lasswell, H. D. (1936). *Politics: Who Gets What, When, How*. New York: McGraw-Hill.
