# 방법론 (methodology)

## 1. 연구 질문과 Lasswell 확장

> **Who gets What, When, How, Where, and with What Outcome?**

모든 EVENT는 다음 필드를 가지며, `validateData()`는 WHO·WHAT·WHEN·HOW·WHERE·OUTCOME 중 하나라도 비면 오류를 낸다.

| 질문 | EVENT 필드 | 비고 |
|---|---|---|
| WHO | `actors`, `targets`, `decisionMakers`, `informationSources`, `beneficiaries`, `victims` | `subjects`는 '언급 대상'일 뿐 참여자가 아님 |
| GETS / LOSES WHAT | `what[] = {type, value, quantity, unit, giverId, receiverId}` | type: gain·loss·burden·transfer·recover·claim |
| WHEN | `eventDate`, `recordDate`, `datePrecision` | 아래 §3 |
| HOW | `mechanisms[]`, `documentType`, `embeddedDocumentAuthor` | 왕명·정책논의·장계·치계·회계·동원·추격·전투·외교·축성·사민·포상·처벌 등 |
| WHERE | `theater[]`, `placeIds[]`, `locationNote` | 위치 불분명은 `locationNote`에 명시. 좌표는 근거 없으면 null |
| OUTCOME | `outcomes[] = {type, subjectId, quantity, unit, reportedBy, certainty}` | `reportedBy`가 있으면 '조선 측 보고 수치' 등으로 표시 |

## 2. Multilevel 과 Multilayer 의 구분

- **LEVEL = 행위자의 제도적 위치** (노드 속성, 시간 가변): L0 왕 / L1 중앙 정책·행정 관료 / L2 중앙 군사 엘리트 / L3 지방 최고지휘관 /
  L4 현장 지휘관·군관·지방관 / L5 군졸 / L6 지방 주민 / L7 외부 정치·군사 행위자.
  `levelAt(person, t)` = t를 덮는 PERSON_STATE의 level, 없으면 `defaultLevel`. 화면의 세로 band는 커서 시점의 level이다.
- **LAYER = 관계의 종류** (edge 속성): POLICY, COMMAND, REPORT, INTELLIGENCE, INVESTIGATION, LOGISTICS, MILITARY_ACTION,
  MILITARY_CONFLICT, DIPLOMACY, CLAIM, COUNTER_CLAIM, REWARD, PUNISHMENT, ACCOUNTABILITY, WELFARE, FORTIFICATION,
  RESETTLEMENT, BORDER_ADMINISTRATION, COOPERATION. 세부 행위는 `relationType`(예: advise, solicit_opinion, propose_reward,
  official_accusation)으로 구분하고 같은 의미의 layer를 새로 만들지 않는다.
  - v2의 MEDIATION → DIPLOMACY(`mediation_order`), POLICY_ADVICE/POLICY_DISAGREEMENT → POLICY(`advise`/`remonstrate`),
    ACCUSATION → CLAIM(`official_accusation`), DEFENSE_REFORM → FORTIFICATION, MIGRATION → RESETTLEMENT,
    SUBORDINATE(소속) → edge가 아니라 PERSON_STATE로 이동.
  - ACCOUNTABILITY(책임 추궁·탄핵 요구)와 PUNISHMENT(실제 처분)를 구분한다.
- level 필터는 **관계 시점의 양 끝 노드 level**에 적용된다(두 끝이 모두 선택된 level이어야 contact가 남는다).

## 3. 날짜 표현

- 모든 날짜는 실록의 **음력 날짜** 문자열 `YYYY-MM-DD`, 윤달은 `YYYY-MML-DD`(예: 세종 15년 윤8월 10일 = `1433-08L-10`).
  연도는 해당 음력 연도의 관용 서기 연도다(1432-12-09는 양력으로는 1433년 초). 양력 변환은 하지 않았다.
- 문자열 사전순 = 시간순이 되도록 설계했다(`'-' < 'L'`이므로 8월 < 윤8월 < 9월).
- `eventDate`: 실제 발생일. 기사에 발생일이 따로 없으면 `eventDate = recordDate`, `datePrecision = record_date_only`.
  월만 알면 day `00`, `datePrecision = month`.
- `recordDate`: 실록 기사 게재일. `validateData()`는 recordDate가 그 사건 실록 사료의 게재일 중 하나와 같은지 검사해
  사건일·기록일 혼동을 잡는다.
- 기간 길이·지연시간은 근사 월 인덱스 `m(t) = 12·y + (월−1) + 0.5·[윤달] + (일−1)/30`으로 계산한다(정확한 일수 아님).

## 4. Temporal network 정의

- 사건 e의 relation r 하나가 **contact** `c = (u, v, ℓ, [s_c, e_c], κ, σ)` 하나가 된다.
  u→v 방향, ℓ = layer, [s_c, e_c] = 유효 구간(기본은 사건일 하루, s_c = e_c), κ = certainty, σ = causalStatus.
  `direction = undirected`인 relation은 두 방향의 arc로 쓴다(현재 데이터에는 없음).
- EDGES 배열을 손으로 관리하지 않는다. contact는 `deriveContacts(EVENTS)`에서만 만든다.
- 분석·표시 창 W = [t0, T]와 필터 F(layer, level, theater, certainty, 사료 유형)를 적용한 contact 집합 C(W, F)가 모든 지표의 입력이다.
  - 기간 필터: [연도 시작, 연도 끝]. '타임라인 커서까지'가 켜져 있으면 T = min(T, 커서 사건일).
  - 화면 표시 창: 누적(기간 시작~커서) / 최근 12개월 / 현재 사건만.
- 정적 네트워크에 날짜 필터만 씌운 것이 아니라, 아래 경로·중심성은 모두 contact의 **시간 순서**를 사용한다.

## 5. Time-respecting path

경로 P = (c₁, …, c_k)는 c_i의 head가 c_{i+1}의 tail이고, 각 c_i를 쓰는 시각 τ_i ∈ [s_{c_i}, e_{c_i}]가

  t0 ≤ τ₁ ≤ τ₂ ≤ … ≤ τ_k ≤ T

를 만족할 때만 time-respecting이다. 이동 시간은 0으로 두어 **같은 날짜의 연쇄(τ_i = τ_{i+1})는 허용**한다
(같은 기사 안의 순서는 사료에서 알 수 없기 때문). 과거의 contact를 미래 이후에 이어붙이는 것은 불가능하다.

**계산.** 노드 v의 라벨 L(v) = (a(v), h(v))를 사전식으로 최소화하는 label-setting(Dijkstra형) 알고리즘을 쓴다.
a(v)는 earliest arrival(foremost) 시각, h(v)는 그 라벨을 만든 경로의 hop 수이다. u에서 contact c로 나갈 때
τ = max(a(u), s_c) (단 a(u) ≤ e_c, τ ≤ T), 새 라벨 (τ, h(u)+1). 비용이 경로를 따라 단조 증가하므로 label-setting이 정당하다.
이렇게 얻는 경로는 **모든 접두부(prefix)가 라벨 최적인 foremost 경로**(prefix-optimal foremost path)이다.
이는 Buß et al.(2020)의 prefix-foremost 개념을 hop 수로 tie-break한 변형이며, "foremost 중 hop 최소" 경로와는 일부 경우 다를 수 있다.

- `temporalPath(C, S, v, t0, T)`: 출발 집합 S(인물 하나, 또는 사건에서 출발할 때는 그 사건의 actors 전원, t0 = max(t0, 사건일))에서 v까지.
- `isTimeRespecting(steps)`: 결과 경로의 τ가 비감소이고 각 τ가 contact 구간 안에 있는지 다시 검사한다(UI에 '시간 순행 검사' 표시).
- `feedbackLoops(C, a, t0, T)`: a → … → x → a. a에서 x까지 foremost 경로로 도착한 뒤(a(x)), x→a contact를 a(x) 이후에 쓸 수 있으면 루프.
- **경로 ≠ 인과.** 시간 순행 경로는 정보·명령이 흐를 '수 있었던' 통로일 뿐이다. 인과는 `causedBy[].causalStatus`
  (explicit / strongly_implied / sequence_only / unknown)로 따로 기록하며, 시간 선후만으로 explicit를 만들지 않는다.

## 6. 지표 정의 (모두 C(W, F) 위에서 계산)

N = C(W, F)에 등장하는 노드 수, 창의 연도 수 Y = year(T) − year(t0) + 1.

1. **Temporal in-degree / out-degree**: k_in(v) = |{c ∈ C : head(c) = v}|, k_out(v) = |{c : tail(c) = v}| (중복 contact 포함).
   degree = k_in + k_out.
2. **Temporal activity**: v가 끝점인 contact들이 속한 서로 다른 사건 수.
3. **Active span**: m(마지막 활동일) − m(첫 활동일), 개월(근사).
4. **Node persistence**: v가 contact를 가진 연도 수 / Y.
5. **Layer diversity**: v가 관여한 서로 다른 layer 수 L(v), 정규화 Shannon entropy H(v)/ln L(v) (L(v) ≥ 2일 때).
6. **Centrality trajectory**: 창 안의 각 연도 y에 대해 slice W_y = [y년 시작, y년 끝] ∩ W에서 2·8을 독립적으로 다시 계산한 수열.
   이전 연도의 경로를 이어받지 않는다. 기간 필터를 바꾸면 연도 집합 자체가 바뀐다.
7. **Earliest-arrival temporal closeness**:
   C_clo(u) = (1/(N−1)) · Σ_{v ≠ u, a_u(v) 존재} 1 / (1 + Δ_u(v)),  Δ_u(v) = m(a_u(v)) − m(t*)  (개월)
   여기서 a_u(v)는 t0에서 u를 출발한 earliest arrival, t* = max(t0, 창 안 첫 contact 시각). 도달 불가 노드는 0을 더한다
   (harmonic 형태로 비연결을 처리). 참고: Pan & Saramäki(2011)의 temporal closeness는 출발 시각에 대해 평균을 내지만,
   여기서는 창 시작 단일 출발 시각을 쓰는 단순화이므로 이름 그대로 '창 시작 기준 earliest-arrival closeness'로만 해석해야 한다.
8. **Temporal betweenness (time-respecting paths)**: 각 출발점 s에 대해 §5의 라벨을 계산하고,
   predecessor DAG = {(u→v) : contact c가 있어 a(u) ≤ e_c, max(a(u), s_c) = a(v), h(u)+1 = h(v)}를 만든다(같은 (u,v)는 1개로 셈).
   σ_s(s)=1, σ_s(v) = Σ_{u∈pred(v)} σ_s(u)를 (a, h) 순서로 계산하고, Brandes 방식의 의존도
   δ_s(u) = Σ_{v: u∈pred(v)} (σ_s(u)/σ_s(v)) (1 + δ_s(v))를 역순으로 누적해 B(u) = Σ_{s≠u} δ_s(u).
   정규화값 B(u)/((N−1)(N−2))도 함께 제공한다. 즉 "s에서 v로 가는 prefix-optimal foremost 경로들 가운데 u를 지나는 비율"의 합이다.
   참고: Tang et al.(2010), Kim & Anderson(2012), Buß et al.(2020).
9. **Broadcast / receive (dynamic communicability)**: Grindrod et al.(2011).
   시간 slice = 창 안의 서로 다른 날짜 t₁ < … < t_K, A[k] = 날짜 t_k의 방향 인접행렬(0/1).
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
| interpretation | 편집자 해석(예: 총지휘관→동원 군졸 지휘관계) | 파선 |
| secondary_only | 2차자료에만 근거 | 파선 |
| unverified_seed | 원문 미대조 시드(사용자 제시 anchor) | 파선 |

선 색은 layer, 선 모양은 certainty로 분리해 두 시각 변수가 충돌하지 않게 했다.
`validateData()`는 confirmed 관계가 1차·당대 사료 없이(2차자료만, 또는 시드 사료만) 만들어지면 오류를 낸다.

## 8. edge 생성 규칙

- 사료에서 구체적 행위·관계가 확인될 때만 relation을 만든다. 같은 기사에 이름이 함께 나온다는 이유만으로 만들지 않는다.
- 기관 주어 행위는 기관 노드로, 무명 집단은 group 노드로 둔다.
- 행위가 아닌 소속(관하·부하)은 PERSON_STATE로 기록하고 edge로 만들지 않는다.
- 행위의 '대상'이 아닌 '언급 대상'(예: 세종의 지시 속 맹가첩목아)은 `subjects`에만 넣는다.

## 9. 현재 데이터 통계

<!-- GENERATED:STATS -->
- 사건 35 · 행위자 65 · 장소 15 · 사료 32 · relation(edge) 94 · 인물 상태 23

| layer | edge 수 |
|---|---|
| POLICY (정책(건의·논의·결정)) | 33 |
| COMMAND (명령·임명·파견) | 12 |
| REPORT (보고(장계·치계·회계)) | 4 |
| INTELLIGENCE (정보·제보) | 2 |
| INVESTIGATION (조사) | 1 |
| LOGISTICS (병참·군량·병기) | 0 |
| MILITARY_ACTION (군사행동(추격·배치·정찰)) | 1 |
| MILITARY_CONFLICT (무력충돌) | 12 |
| DIPLOMACY (외교·통교·중재) | 12 |
| CLAIM (주장·문죄) | 3 |
| COUNTER_CLAIM (반박 주장) | 2 |
| REWARD (포상) | 3 |
| PUNISHMENT (처벌·처분) | 1 |
| ACCOUNTABILITY (책임추궁·탄핵) | 3 |
| WELFARE (전사자·피해자 예우) | 3 |
| FORTIFICATION (축성·진보 설치·방비) | 1 |
| RESETTLEMENT (사민·입거·이주) | 1 |
| BORDER_ADMINISTRATION (변경 행정(군현·진 설치)) | 0 |
| COOPERATION (협력) | 0 |

| certainty | edge 수 |
|---|---|
| confirmed | 83 |
| contemporary_claim | 5 |
| disputed | 0 |
| interpretation | 1 |
| secondary_only | 0 |
| unverified_seed | 5 |
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
