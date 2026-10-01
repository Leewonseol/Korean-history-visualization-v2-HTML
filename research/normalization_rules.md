# 정규화 규칙 formal specification (R1~R7)

> 자동 생성: `node tools/build-research.mjs` — 원본은 `src/data/vocab.js`의 `NORMALIZATION_RULES`·`PACK_LABEL_LAYERS`.
> 이 규칙들은 pack v1 원문을 그래프 표현으로 옮기는 **변환 규칙**이며, 새 사실을 만드는 규칙이 아니다. 목록 밖의 변환은 INTERPRETATION이다.

## 근거 등급

- **DIRECT** — 직접 사료 근거 (provenance: pack_v1_direct)
- **NORMALIZED** — 규칙 파생(R1~R7) (provenance: pack_v1_derived)
- **LEGACY** — legacy(v2 이관·시드) (provenance: inherited_v2, legacy_anchor_seed)
- **INTERPRETATION** — 편집자 해석 (provenance: interpretation)

DIRECT는 pack RELATIONS 줄에 주체·객체가 이름(또는 자리표시자 'state/Joseon/court(주체)' → `ORG_JOSEON_COURT`)으로 그대로 있고 라벨→layer가 일대일인 경우뿐이다.
시각 규칙(R7)은 관계의 존재 근거가 아니라 시각 근거라서 근거 등급을 바꾸지 않는다(dateBasis로 따로 기록).

## R1_court_recipient — 조정 수신자 → 군주 노드

| 항목 | 내용 |
|---|---|
| rule_id | `R1_court_recipient` |
| 바꾸는 부분 | object |
| 입력 원문 패턴 | pack RELATIONS의 수신자 토큰이 'court' / 'central' / '조정'(조선) 또는 같은 항목 WHAT이 'Ming court'로 쓴 명(Ming)이고, layer가 의사소통(REPORT·POLICY·CLAIM·COUNTER_CLAIM·DIPLOMACY·INTELLIGENCE·FORTIFICATION 건의) |
| 생성 가능한 relation | 주체 → 세종(조선 조정) 또는 같은 항목 WHO의 황제(명 조정). layer는 원문 라벨(R6 표) |
| 방향 결정 | 원문 화살표 방향 유지(수신자만 치환) |
| 양방향 허용 | false |
| causal edge 생성 | 불가 — 규칙은 인과를 만들지 않음 |
| 금지 사례 | '조선/Joseon/state'(정치체)를 세종으로 바꾸기 — 이 경우 ORG_JOSEON_COURT(자리표시자) 사용<br>'court'가 행위 주체일 때 세종으로 바꾸기 — 주체 'court/central/state'는 ORG_JOSEON_COURT<br>보고가 조정에 도달했다는 서술 없이 현장 수신자를 세종으로 바꾸기 |
| 예시 | 원문 “박호문 -> court : REPORT” → 박호문 → 세종 (REPORT) |
| 현재 적용 관계 수 | 18 |

## R2_carrier_split — 전달자 경유 보고 분리

| 항목 | 내용 |
|---|---|
| rule_id | `R2_carrier_split` |
| 바꾸는 부분 | subject/object |
| 입력 원문 패턴 | pack에 'A … via B' (WHAT·REPORTER)가 있고 B → court 관계가 따로 있음 |
| 생성 가능한 relation | A → B (REPORT, 위탁) 하나. B → 조정은 R1로 별도 |
| 방향 결정 | A → B |
| 양방향 허용 | false |
| causal edge 생성 | 불가 — 규칙은 인과를 만들지 않음 |
| 금지 사례 | A → 세종 직접 관계를 추가로 만들기(원문이 직접 관계를 따로 쓴 경우만 DIRECT로 허용) |
| 예시 | 원문 “REPORTER: 최윤덕, via 박호문” → 최윤덕 → 박호문 (REPORT) |
| 현재 적용 관계 수 | 2 |

## R3_who_expansion — 집합·일반 지칭 → 명시된 구성원

| 항목 | 내용 |
|---|---|
| rule_id | `R3_who_expansion` |
| 바꾸는 부분 | subject/object |
| 입력 원문 패턴 | pack RELATIONS의 한쪽이 집합·일반 지칭('listed ministers', 'campaign commanders', 'Jurchen actors', 'frontier commander(s)', 'groups', 'informants', 'meritorious soldiers', 'X side')이고, 그 구성원이 같은 항목(또는 명시적으로 표시한 다른 pack 항목)의 WHO·WHAT·명단 줄에 실명·직위로 나열됨 |
| 생성 가능한 relation | 구성원마다 관계 1개. 구성원 근거 줄(members locator)을 trace에 기록 |
| 방향 결정 | 원문 화살표 방향 유지. '<->'는 양쪽 방향 원문일 때만 undirected |
| 양방향 허용 | 원문이 '<->'인 경우만(directionEvidence 필수) |
| causal edge 생성 | 불가 — 규칙은 인과를 만들지 않음 |
| 금지 사례 | WHO에 이름만 있고 집합 지칭에 속한다는 근거가 없는 사람을 구성원으로 넣기<br>구성원 사이의 관계(상하관계 등)를 만들기<br>다른 항목 명단을 쓸 때 CROSS_ENTRY_MEMBERSHIP 표시 없이 쓰기 |
| 예시 | 원문 “세종 -> listed ministers/generals : POLICY_CONSULTATION” → 세종 → 허조 (POLICY) — 구성원 근거: WHO '허조 許稠' |
| 현재 적용 관계 수 | 87 |

## R4_group_placeholder — 무명 집합 → group 노드

| 항목 | 내용 |
|---|---|
| rule_id | `R4_group_placeholder` |
| 바꾸는 부분 | subject/object |
| 입력 원문 패턴 | pack이 실명 없이 집합(야인, defenders, settlers, population, local agents, informants source 등)으로 쓰거나, MILITARY_ATTACK의 대상이 지명이고 같은 항목이 그 지명의 피해자·수비자를 기록(PLACE_AS_TARGET) |
| 생성 가능한 relation | 해당 사건 전용 group 노드(예: '1435-01 여연성 수비 군사')와의 관계 |
| 방향 결정 | 원문 화살표 방향 유지 |
| 양방향 허용 | false |
| causal edge 생성 | 불가 — 규칙은 인과를 만들지 않음 |
| 금지 사례 | 무명 집합 안의 개인을 창작하기<br>서로 다른 사건의 무명 집합을 한 노드로 합치기<br>여진 집단을 하나로 합치기 |
| 예시 | 원문 “Oryanghap -> Yŏyŏn : MILITARY_ATTACK” → 오량합 기병(1435-01) → 1435-01 여연성 수비 군사 (MILITARY_CONFLICT) |
| 현재 적용 관계 수 | 34 |

## R5_content_actor — 본문(WHAT·WHO·KEY CONTENT)에 명시된 행위자

| 항목 | 내용 |
|---|---|
| rule_id | `R5_content_actor` |
| 바꾸는 부분 | subject/object |
| 입력 원문 패턴 | RELATIONS 줄이 없거나 일반 지칭인데, 같은 항목 WHAT·WHO·KEY CONTENT 문장이 특정 인물·기관을 그 행위의 행위자(또는 대상)로 명시 |
| 생성 가능한 relation | 그 문장의 행위 1개. 수신자가 문장에 없으면 같은 항목 RELATIONS의 수신자를 support locator로 기록(RECIPIENT_FROM_ENTRY_RELATION) |
| 방향 결정 | 문장의 행위 방향 |
| 양방향 허용 | false |
| causal edge 생성 | 불가 — 규칙은 인과를 만들지 않음 |
| 금지 사례 | 문장에 없는 행위자를 지명·직위·관례로 추정하기(예: 지명으로 도 관아를 특정)<br>문장의 주장 내용을 사실 관계로 바꾸기(주장 대상은 pathEligible:false) |
| 예시 | 원문 “Yi Cheon, Choe Hae-san, Jeong Heum-ji and others argued for first sending” → 정흠지 → 세종 (POLICY advise) |
| 현재 적용 관계 수 | 13 |

## R6_layer_normalize — pack 관계 라벨 → layer (비일대일 매핑)

| 항목 | 내용 |
|---|---|
| rule_id | `R6_layer_normalize` |
| 바꾸는 부분 | layer |
| 입력 원문 패턴 | pack 라벨(예: 'REWARD / APPOINTMENT', 'DEFENSE_ADVICE')이 PACK_LABEL_LAYERS 표에서 둘 이상의 layer로 갈 수 있어 편집자가 하나를 고름 |
| 생성 가능한 relation | 표가 허용하는 layer 중 하나. 일대일 라벨은 R6 없이 DIRECT에서 허용 |
| 방향 결정 | 변경 없음 |
| 양방향 허용 | false |
| causal edge 생성 | 불가 — 규칙은 인과를 만들지 않음 |
| 금지 사례 | 표에 없는 layer 선택<br>라벨에 없는 관계 유형 추가 |
| 예시 | 원문 “이천 -> 세종 : REPORT / SELF_ACCOUNTABILITY / MILITARY_ADVICE” → 이천 → 세종 (REPORT) |
| 현재 적용 관계 수 | 43 |

## R7_report_on_record — 조정 도달 보고·전달의 시각 = 기사일

| 항목 | 내용 |
|---|---|
| rule_id | `R7_report_on_record` |
| 바꾸는 부분 | time |
| 입력 원문 패턴 | 보고·전달이 조정(세종·조선 조정)에 도달한 것이 기사에 실려 있고 도달일이 따로 없음 |
| 생성 가능한 relation | 관계 시각 dateMin = dateMax = 기사일. 현장 행위는 '기사일 이전'으로 둠 |
| 방향 결정 | 변경 없음 |
| 양방향 허용 | false |
| causal edge 생성 | 불가 — 규칙은 인과를 만들지 않음 |
| 금지 사례 | 현장 행위(전투·추격·이동)를 기사일에 일어난 것으로 두기 |
| 예시 | 원문 “김종서 -> court : REPORT (치계, 1439-05-10 기사)” → 김종서 → 세종 @1439-05-10 |
| 현재 적용 관계 수 | 0 |

## R6 라벨 → layer 표

| pack 라벨 | 허용 layer |
|---|---|
| MILITARY_ATTACK | MILITARY_CONFLICT |
| PURSUIT | MILITARY_CONFLICT, MILITARY_ACTION (선택 시 R6) |
| MILITARY_CONFLICT | MILITARY_CONFLICT |
| RECOVERY | MILITARY_ACTION |
| PROTECTION | MILITARY_ACTION |
| DEFENSE | MILITARY_CONFLICT |
| MILITARY_ACTION | MILITARY_ACTION |
| DEPLOYMENT | MILITARY_ACTION |
| CROSS_BORDER_OPERATION | MILITARY_ACTION |
| POLICY_CONSULTATION | POLICY |
| POLICY_ADVICE | POLICY |
| MILITARY_TECH_ADVICE | POLICY |
| MILITARY_ADVICE | POLICY |
| POLICY_QUERY | POLICY |
| POLICY_DISAGREEMENT | POLICY |
| POLICY_TRANSFER | POLICY |
| POLICY | POLICY |
| DELIBERATION | POLICY |
| CONDITIONAL_TARGET_STATUS | POLICY |
| INSTRUCTION | POLICY, COMMAND (선택 시 R6) |
| DEFENSE_ADVICE | POLICY, FORTIFICATION (선택 시 R6) |
| DEFENSE_PLANNING | FORTIFICATION, POLICY (선택 시 R6) |
| MILITARY_PROPOSAL | POLICY, DIPLOMACY (선택 시 R6) |
| COMMAND | COMMAND |
| COMMAND_DESIGN | COMMAND |
| DEFENSE_ORDER | COMMAND |
| BORDER_CONTROL | COMMAND |
| APPOINTMENT | COMMAND |
| INSPECTION | COMMAND, INVESTIGATION (선택 시 R6) |
| DEFENSE_REFORM | FORTIFICATION, COMMAND (선택 시 R6) |
| DIPLOMATIC_POLICY | COMMAND, DIPLOMACY (선택 시 R6) |
| REPORT | REPORT |
| REPORT_CARRIER | REPORT |
| SELF_ACCOUNTABILITY | REPORT |
| SELF_DEFENSE | REPORT |
| POLICY_REPORT | REPORT |
| VICTORY_REPORT | REPORT |
| INTELLIGENCE_REPORT | REPORT, INTELLIGENCE (선택 시 R6) |
| INTELLIGENCE | INTELLIGENCE |
| INTELLIGENCE_REQUEST | INTELLIGENCE |
| INVESTIGATION | INVESTIGATION |
| CLAIM | CLAIM |
| COUNTER_CLAIM | COUNTER_CLAIM |
| DIPLOMACY | DIPLOMACY |
| DIPLOMATIC_PROTEST | DIPLOMACY |
| MEDIATION | DIPLOMACY |
| IMPERIAL_ORDER | DIPLOMACY |
| DIPLOMATIC_DEESCALATION | DIPLOMACY |
| DIPLOMATIC_MANAGEMENT | DIPLOMACY |
| LIMITED_ACCEPTANCE | DIPLOMACY |
| NON_ESCALATION | DIPLOMACY |
| CONCILIATION | DIPLOMACY |
| CONTROL | DIPLOMACY |
| REWARD | REWARD |
| HONOR | WELFARE |
| WELFARE | WELFARE |
| COMPENSATION | WELFARE |
| RELIEF | WELFARE |
| ACCOUNTABILITY | ACCOUNTABILITY |
| PUNISHMENT | PUNISHMENT |
| RESETTLEMENT | RESETTLEMENT |
| AGRICULTURAL_POLICY | RESETTLEMENT |
| COERCIVE_RESETTLEMENT | RESETTLEMENT |
| BORDER_ADMINISTRATION | BORDER_ADMINISTRATION |
| ADMIN_REORGANIZATION | BORDER_ADMINISTRATION |
| FORTIFICATION | FORTIFICATION |
| LABOR_MOBILIZATION | LABOR_MOBILIZATION |
| LOGISTICS | LOGISTICS |
