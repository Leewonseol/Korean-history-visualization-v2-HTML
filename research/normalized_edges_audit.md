# 정규화 관계 감사표 (normalized edges audit)

> 자동 생성: `node tools/build-research.mjs` — 원본 `src/data/relationTraces.js`, 원문 `research/pack_v1/source_pack_v1.txt`.
> **이 문서는 '정상' 판정을 내리지 않는다.** 각 관계를 원문 → 규칙 → 생성된 edge 순서로 보여 주고, 사람이 검토란을 채운다.
> quote는 tools/integrity.mjs가 원문 파일의 해당 줄과 글자 그대로 대조한다.

- NORMALIZED 153 · DIRECT 20 (전체 relation 근거 등급: 직접 사료 근거 20 · 규칙 파생(R1~R7) 153 · legacy(v2 이관·시드) 47 · 편집자 해석 22)
- 규칙별 적용 수: R1_court_recipient 18 · R2_carrier_split 2 · R3_who_expansion 87 · R4_group_placeholder 34 · R5_content_actor 13 · R6_layer_normalize 43 · R7_report_on_record 0
- 검토 표시(flag)가 붙은 관계: 19

## NORMALIZED 관계

### `E1432_1209#0` — 1432 여연 침입 야인 기병(약 400기, 주체 미확정) → 1432 여연 피랍·피해 주민 (MILITARY_CONFLICT · `raid`)
1. **원문** `pack_v1:E1432_1209:RELATIONS:L57` (SRC_1432_1209): “야인 -> 여연 주민 : MILITARY_ATTACK”
   - 원문 주체/객체: 야인 → 여연 주민
2. **규칙** `R4_group_placeholder` · 주체 R4_group_placeholder · 객체 R4_group_placeholder
3. **생성된 edge** `GRP_1432_RAIDERS` → `GRP_1432_YEOYEON_RESIDENTS` · MILITARY_CONFLICT · 시각 1432년 12월 9일 이전(정확한 시점 미상) · 확실성 confirmed · 인과 UNKNOWN
- 사람 검토: ☐ 원문과 일치 ☐ 규칙 적용 적절 ☐ 수정 필요 — 메모:

### `E1432_1209#1` — 박초 → 1432 여연 침입 야인 기병(약 400기, 주체 미확정) (MILITARY_CONFLICT · `pursue_and_engage`)
1. **원문** `pack_v1:E1432_1209:RELATIONS:L58` (SRC_1432_1209): “박초 -> 야인 : PURSUIT / MILITARY_CONFLICT”
   - 원문 주체/객체: 박초 → 야인
2. **규칙** `R4_group_placeholder` + `R6_layer_normalize` · 객체 R4_group_placeholder
3. **생성된 edge** `JO_PARKCHO` → `GRP_1432_RAIDERS` · MILITARY_CONFLICT · 시각 1432년 12월 9일 이전(정확한 시점 미상) · 확실성 confirmed · 인과 UNKNOWN
- 사람 검토: ☐ 원문과 일치 ☐ 규칙 적용 적절 ☐ 수정 필요 — 메모:

### `E1432_1209#2` — 박초 → 1432 여연 피랍·피해 주민 (MILITARY_ACTION · `recover_and_protect_captives`)
1. **원문** `pack_v1:E1432_1209:RELATIONS:L59` (SRC_1432_1209): “박초 -> 조선 포로 : RECOVERY / PROTECTION”
   - 원문 주체/객체: 박초 → 조선 포로
2. **규칙** `R4_group_placeholder` · 객체 R4_group_placeholder
3. **생성된 edge** `JO_PARKCHO` → `GRP_1432_YEOYEON_RESIDENTS` · MILITARY_ACTION · 시각 1432년 12월 9일 이전(정확한 시점 미상) · 확실성 confirmed · 인과 UNKNOWN
- 사람 검토: ☐ 원문과 일치 ☐ 규칙 적용 적절 ☐ 수정 필요 — 메모:

### `E1432_1209#3` — 평안도 감사(실명 미기재) → 세종 (REPORT · `frontier_report`)
1. **원문** `pack_v1:E1432_1209:WHO:L37` (SRC_1432_1209): “평안도 감사 [reporting institution/officeholder not named in excerpt]”
   - 원문 주체/객체: 평안도 감사 → (수신자 미기재: 조정)
2. **규칙** `R5_content_actor` + `R1_court_recipient` · 주체 R5_content_actor · 객체 R1_court_recipient
3. **생성된 edge** `ORG_PYEONGAN_GAMSA` → `JO_SEJONG` · REPORT · 시각 1432년 12월 9일 · 확실성 confirmed · 인과 UNKNOWN
- ⚑ 검토 표시: RECIPIENT_IMPLICIT
- 사람 검토: ☐ 원문과 일치 ☐ 규칙 적용 적절 ☐ 수정 필요 — 메모:

### `E1432_1211#0` — 세종 → 최윤덕 (POLICY · `consult`)
1. **원문** `pack_v1:E1432_1211:RELATIONS:L98` (SRC_1432_1211): “세종 -> listed ministers/generals : POLICY_CONSULTATION”
   - 원문 주체/객체: 세종 → listed ministers/generals
   - 구성원 근거 `pack_v1:E1432_1211:WHO:L73`: “최윤덕 崔閏德”
2. **규칙** `R3_who_expansion` · 객체 R3_who_expansion
3. **생성된 edge** `JO_SEJONG` → `JO_CHOEYUNDEOK` · POLICY · 시각 1432년 12월 11일 · 확실성 confirmed · 인과 UNKNOWN
- 사람 검토: ☐ 원문과 일치 ☐ 규칙 적용 적절 ☐ 수정 필요 — 메모:

### `E1432_1211#1` — 세종 → 허조 (POLICY · `consult`)
1. **원문** `pack_v1:E1432_1211:RELATIONS:L98` (SRC_1432_1211): “세종 -> listed ministers/generals : POLICY_CONSULTATION”
   - 원문 주체/객체: 세종 → listed ministers/generals
   - 구성원 근거 `pack_v1:E1432_1211:WHO:L74`: “허조 許稠”
2. **규칙** `R3_who_expansion` · 객체 R3_who_expansion
3. **생성된 edge** `JO_SEJONG` → `JO_HEOJO` · POLICY · 시각 1432년 12월 11일 · 확실성 confirmed · 인과 UNKNOWN
- 사람 검토: ☐ 원문과 일치 ☐ 규칙 적용 적절 ☐ 수정 필요 — 메모:

### `E1432_1211#2` — 세종 → 하경복 (POLICY · `consult`)
1. **원문** `pack_v1:E1432_1211:RELATIONS:L98` (SRC_1432_1211): “세종 -> listed ministers/generals : POLICY_CONSULTATION”
   - 원문 주체/객체: 세종 → listed ministers/generals
   - 구성원 근거 `pack_v1:E1432_1211:WHO:L75`: “하경복 河敬復”
2. **규칙** `R3_who_expansion` · 객체 R3_who_expansion
3. **생성된 edge** `JO_SEJONG` → `JO_HAGYEONGBOK` · POLICY · 시각 1432년 12월 11일 · 확실성 confirmed · 인과 UNKNOWN
- 사람 검토: ☐ 원문과 일치 ☐ 규칙 적용 적절 ☐ 수정 필요 — 메모:

### `E1432_1211#3` — 세종 → 정흠지 (POLICY · `consult`)
1. **원문** `pack_v1:E1432_1211:RELATIONS:L98` (SRC_1432_1211): “세종 -> listed ministers/generals : POLICY_CONSULTATION”
   - 원문 주체/객체: 세종 → listed ministers/generals
   - 구성원 근거 `pack_v1:E1432_1211:WHO:L76`: “정흠지 鄭欽之”
2. **규칙** `R3_who_expansion` · 객체 R3_who_expansion
3. **생성된 edge** `JO_SEJONG` → `JO_JEONGHEUMJI` · POLICY · 시각 1432년 12월 11일 · 확실성 confirmed · 인과 UNKNOWN
- 사람 검토: ☐ 원문과 일치 ☐ 규칙 적용 적절 ☐ 수정 필요 — 메모:

### `E1432_1211#4` — 세종 → 조말생 (POLICY · `consult`)
1. **원문** `pack_v1:E1432_1211:RELATIONS:L98` (SRC_1432_1211): “세종 -> listed ministers/generals : POLICY_CONSULTATION”
   - 원문 주체/객체: 세종 → listed ministers/generals
   - 구성원 근거 `pack_v1:E1432_1211:WHO:L77`: “조말생 趙末生”
2. **규칙** `R3_who_expansion` · 객체 R3_who_expansion
3. **생성된 edge** `JO_SEJONG` → `JO_JOMALSAENG` · POLICY · 시각 1432년 12월 11일 · 확실성 confirmed · 인과 UNKNOWN
- 사람 검토: ☐ 원문과 일치 ☐ 규칙 적용 적절 ☐ 수정 필요 — 메모:

### `E1432_1211#5` — 세종 → 이천 (POLICY · `consult`)
1. **원문** `pack_v1:E1432_1211:RELATIONS:L98` (SRC_1432_1211): “세종 -> listed ministers/generals : POLICY_CONSULTATION”
   - 원문 주체/객체: 세종 → listed ministers/generals
   - 구성원 근거 `pack_v1:E1432_1211:WHO:L78`: “이천 李蕆”
2. **규칙** `R3_who_expansion` · 객체 R3_who_expansion
3. **생성된 edge** `JO_SEJONG` → `JO_LEECHEON` · POLICY · 시각 1432년 12월 11일 · 확실성 confirmed · 인과 UNKNOWN
- 사람 검토: ☐ 원문과 일치 ☐ 규칙 적용 적절 ☐ 수정 필요 — 메모:

### `E1432_1211#6` — 세종 → 최해산 (POLICY · `consult`)
1. **원문** `pack_v1:E1432_1211:RELATIONS:L98` (SRC_1432_1211): “세종 -> listed ministers/generals : POLICY_CONSULTATION”
   - 원문 주체/객체: 세종 → listed ministers/generals
   - 구성원 근거 `pack_v1:E1432_1211:WHO:L79`: “최해산 崔海山”
2. **규칙** `R3_who_expansion` · 객체 R3_who_expansion
3. **생성된 edge** `JO_SEJONG` → `JO_CHOEHAESAN` · POLICY · 시각 1432년 12월 11일 · 확실성 confirmed · 인과 UNKNOWN
- 사람 검토: ☐ 원문과 일치 ☐ 규칙 적용 적절 ☐ 수정 필요 — 메모:

### `E1432_1211#7` — 세종 → 안숭선 (POLICY · `consult`)
1. **원문** `pack_v1:E1432_1211:RELATIONS:L98` (SRC_1432_1211): “세종 -> listed ministers/generals : POLICY_CONSULTATION”
   - 원문 주체/객체: 세종 → listed ministers/generals
   - 구성원 근거 `pack_v1:E1432_1211:WHO:L80`: “안숭선 安崇善”
2. **규칙** `R3_who_expansion` · 객체 R3_who_expansion
3. **생성된 edge** `JO_SEJONG` → `JO_ANSUNGSEON` · POLICY · 시각 1432년 12월 11일 · 확실성 confirmed · 인과 UNKNOWN
- 사람 검토: ☐ 원문과 일치 ☐ 규칙 적용 적절 ☐ 수정 필요 — 메모:

### `E1432_1211#10` — 정흠지 → 세종 (POLICY · `advise_firearms_training`)
1. **원문** `pack_v1:E1432_1211:KEY CONTENT:L91` (SRC_1432_1211): “Yi Cheon, Choe Hae-san, Jeong Heum-ji and others argued for first sending”
   - 원문 주체/객체: Jeong Heum-ji → (협의 소집자 세종)
   - 보조 근거 `pack_v1:E1432_1211:RELATIONS:L98`: “세종 -> listed ministers/generals : POLICY_CONSULTATION”
2. **규칙** `R5_content_actor` · 주체 R5_content_actor
3. **생성된 edge** `JO_JEONGHEUMJI` → `JO_SEJONG` · POLICY · 시각 1432년 12월 11일 · 확실성 confirmed · 인과 UNKNOWN
- ⚑ 검토 표시: RECIPIENT_FROM_ENTRY_RELATION
- 사람 검토: ☐ 원문과 일치 ☐ 규칙 적용 적절 ☐ 수정 필요 — 메모:

### `E1432_1221#0` — 유을합 → 조선 국가·조정(주체·수신자 미특정) (DIPLOMACY · `return_captives_and_convey_claim`)
1. **원문** `pack_v1:E1432_1221:RELATIONS:L142` (SRC_1432_1221): “유을합 -> 조선 : CLAIM / DIPLOMACY”
   - 원문 주체/객체: 유을합 → 조선
2. **규칙** `R6_layer_normalize`
3. **생성된 edge** `JZ_YUEULHAP` → `ORG_JOSEON_COURT` · DIPLOMACY · 시각 1432년 12월 21일 · 확실성 confirmed · 인과 UNKNOWN
- 사람 검토: ☐ 원문과 일치 ☐ 규칙 적용 적절 ☐ 수정 필요 — 메모:

### `E1432_1221#2` — 세종 → 안숭선 (POLICY · `deliberate_truth_and_responsibility`)
1. **원문** `pack_v1:E1432_1221:RELATIONS:L144` (SRC_1432_1221): “세종 <-> 대신들 : INVESTIGATION / DELIBERATION”
   - 원문 주체/객체: 세종 → 대신들
   - 구성원 근거 `pack_v1:E1432_1221:WHO:L115`: “안숭선”
2. **규칙** `R3_who_expansion` + `R6_layer_normalize` · 객체 R3_who_expansion
3. **생성된 edge** `JO_SEJONG` → `JO_ANSUNGSEON` · POLICY · 시각 1432년 12월 21일 · 확실성 confirmed · 인과 UNKNOWN
- 사람 검토: ☐ 원문과 일치 ☐ 규칙 적용 적절 ☐ 수정 필요 — 메모:

### `E1432_1221#3` — 세종 → 김종서 (POLICY · `deliberate_truth_and_responsibility`)
1. **원문** `pack_v1:E1432_1221:RELATIONS:L144` (SRC_1432_1221): “세종 <-> 대신들 : INVESTIGATION / DELIBERATION”
   - 원문 주체/객체: 세종 → 대신들
   - 구성원 근거 `pack_v1:E1432_1221:WHO:L116`: “김종서”
2. **규칙** `R3_who_expansion` + `R6_layer_normalize` · 객체 R3_who_expansion
3. **생성된 edge** `JO_SEJONG` → `JO_KIMJONGSEO` · POLICY · 시각 1432년 12월 21일 · 확실성 confirmed · 인과 UNKNOWN
- 사람 검토: ☐ 원문과 일치 ☐ 규칙 적용 적절 ☐ 수정 필요 — 메모:

### `E1432_1221#4` — 세종 → 안순 (POLICY · `deliberate_truth_and_responsibility`)
1. **원문** `pack_v1:E1432_1221:RELATIONS:L144` (SRC_1432_1221): “세종 <-> 대신들 : INVESTIGATION / DELIBERATION”
   - 원문 주체/객체: 세종 → 대신들
   - 구성원 근거 `pack_v1:E1432_1221:WHO:L117`: “안순”
2. **규칙** `R3_who_expansion` + `R6_layer_normalize` · 객체 R3_who_expansion
3. **생성된 edge** `JO_SEJONG` → `JO_ANSUN` · POLICY · 시각 1432년 12월 21일 · 확실성 confirmed · 인과 UNKNOWN
- 사람 검토: ☐ 원문과 일치 ☐ 규칙 적용 적절 ☐ 수정 필요 — 메모:

### `E1432_1221#5` — 세종 → 하경복 (POLICY · `deliberate_truth_and_responsibility`)
1. **원문** `pack_v1:E1432_1221:RELATIONS:L144` (SRC_1432_1221): “세종 <-> 대신들 : INVESTIGATION / DELIBERATION”
   - 원문 주체/객체: 세종 → 대신들
   - 구성원 근거 `pack_v1:E1432_1221:WHO:L118`: “하경복”
2. **규칙** `R3_who_expansion` + `R6_layer_normalize` · 객체 R3_who_expansion
3. **생성된 edge** `JO_SEJONG` → `JO_HAGYEONGBOK` · POLICY · 시각 1432년 12월 21일 · 확실성 confirmed · 인과 UNKNOWN
- 사람 검토: ☐ 원문과 일치 ☐ 규칙 적용 적절 ☐ 수정 필요 — 메모:

### `E1432_1221#6` — 세종 → 황희 (POLICY · `deliberate_truth_and_responsibility`)
1. **원문** `pack_v1:E1432_1221:RELATIONS:L144` (SRC_1432_1221): “세종 <-> 대신들 : INVESTIGATION / DELIBERATION”
   - 원문 주체/객체: 세종 → 대신들
   - 구성원 근거 `pack_v1:E1432_1221:WHO:L119`: “황희”
2. **규칙** `R3_who_expansion` + `R6_layer_normalize` · 객체 R3_who_expansion
3. **생성된 edge** `JO_SEJONG` → `JO_HWANGHUI` · POLICY · 시각 1432년 12월 21일 · 확실성 confirmed · 인과 UNKNOWN
- 사람 검토: ☐ 원문과 일치 ☐ 규칙 적용 적절 ☐ 수정 필요 — 메모:

### `E1432_1221#7` — 세종 → 허조 (POLICY · `deliberate_truth_and_responsibility`)
1. **원문** `pack_v1:E1432_1221:RELATIONS:L144` (SRC_1432_1221): “세종 <-> 대신들 : INVESTIGATION / DELIBERATION”
   - 원문 주체/객체: 세종 → 대신들
   - 구성원 근거 `pack_v1:E1432_1221:WHO:L120`: “허조”
2. **규칙** `R3_who_expansion` + `R6_layer_normalize` · 객체 R3_who_expansion
3. **생성된 edge** `JO_SEJONG` → `JO_HEOJO` · POLICY · 시각 1432년 12월 21일 · 확실성 confirmed · 인과 UNKNOWN
- 사람 검토: ☐ 원문과 일치 ☐ 규칙 적용 적절 ☐ 수정 필요 — 메모:

### `E1432_1221#8` — 세종 → 신장 (POLICY · `deliberate_truth_and_responsibility`)
1. **원문** `pack_v1:E1432_1221:RELATIONS:L144` (SRC_1432_1221): “세종 <-> 대신들 : INVESTIGATION / DELIBERATION”
   - 원문 주체/객체: 세종 → 대신들
   - 구성원 근거 `pack_v1:E1432_1221:WHO:L121`: “신장”
2. **규칙** `R3_who_expansion` + `R6_layer_normalize` · 객체 R3_who_expansion
3. **생성된 edge** `JO_SEJONG` → `JO_SINJANG` · POLICY · 시각 1432년 12월 21일 · 확실성 confirmed · 인과 UNKNOWN
- 사람 검토: ☐ 원문과 일치 ☐ 규칙 적용 적절 ☐ 수정 필요 — 메모:

### `E1432_1221#9` — 세종 → 김익정 (POLICY · `deliberate_truth_and_responsibility`)
1. **원문** `pack_v1:E1432_1221:RELATIONS:L144` (SRC_1432_1221): “세종 <-> 대신들 : INVESTIGATION / DELIBERATION”
   - 원문 주체/객체: 세종 → 대신들
   - 구성원 근거 `pack_v1:E1432_1221:WHO:L122`: “김익정”
2. **규칙** `R3_who_expansion` + `R6_layer_normalize` · 객체 R3_who_expansion
3. **생성된 edge** `JO_SEJONG` → `JO_KIMIKJEONG` · POLICY · 시각 1432년 12월 21일 · 확실성 confirmed · 인과 UNKNOWN
- 사람 검토: ☐ 원문과 일치 ☐ 규칙 적용 적절 ☐ 수정 필요 — 메모:

### `E1432_1221#10` — 세종 → 성억 (POLICY · `deliberate_truth_and_responsibility`)
1. **원문** `pack_v1:E1432_1221:RELATIONS:L144` (SRC_1432_1221): “세종 <-> 대신들 : INVESTIGATION / DELIBERATION”
   - 원문 주체/객체: 세종 → 대신들
   - 구성원 근거 `pack_v1:E1432_1221:WHO:L123`: “성억”
2. **규칙** `R3_who_expansion` + `R6_layer_normalize` · 객체 R3_who_expansion
3. **생성된 edge** `JO_SEJONG` → `JO_SEONGEOK` · POLICY · 시각 1432년 12월 21일 · 확실성 confirmed · 인과 UNKNOWN
- 사람 검토: ☐ 원문과 일치 ☐ 규칙 적용 적절 ☐ 수정 필요 — 메모:

### `E1432_1221#11` — 세종 → 정연 (POLICY · `deliberate_truth_and_responsibility`)
1. **원문** `pack_v1:E1432_1221:RELATIONS:L144` (SRC_1432_1221): “세종 <-> 대신들 : INVESTIGATION / DELIBERATION”
   - 원문 주체/객체: 세종 → 대신들
   - 구성원 근거 `pack_v1:E1432_1221:WHO:L124`: “정연”
2. **규칙** `R3_who_expansion` + `R6_layer_normalize` · 객체 R3_who_expansion
3. **생성된 edge** `JO_SEJONG` → `JO_JEONGYEON` · POLICY · 시각 1432년 12월 21일 · 확실성 confirmed · 인과 UNKNOWN
- 사람 검토: ☐ 원문과 일치 ☐ 규칙 적용 적절 ☐ 수정 필요 — 메모:

### `E1432_1221#12` — 세종 → 조계생 (POLICY · `deliberate_truth_and_responsibility`)
1. **원문** `pack_v1:E1432_1221:RELATIONS:L144` (SRC_1432_1221): “세종 <-> 대신들 : INVESTIGATION / DELIBERATION”
   - 원문 주체/객체: 세종 → 대신들
   - 구성원 근거 `pack_v1:E1432_1221:WHO:L125`: “조계생”
2. **규칙** `R3_who_expansion` + `R6_layer_normalize` · 객체 R3_who_expansion
3. **생성된 edge** `JO_SEJONG` → `JO_JOGYESAENG` · POLICY · 시각 1432년 12월 21일 · 확실성 confirmed · 인과 UNKNOWN
- 사람 검토: ☐ 원문과 일치 ☐ 규칙 적용 적절 ☐ 수정 필요 — 메모:

### `E1432_1221#13` — 세종 → 이맹균 (POLICY · `deliberate_truth_and_responsibility`)
1. **원문** `pack_v1:E1432_1221:RELATIONS:L144` (SRC_1432_1221): “세종 <-> 대신들 : INVESTIGATION / DELIBERATION”
   - 원문 주체/객체: 세종 → 대신들
   - 구성원 근거 `pack_v1:E1432_1221:WHO:L126`: “이맹균”
2. **규칙** `R3_who_expansion` + `R6_layer_normalize` · 객체 R3_who_expansion
3. **생성된 edge** `JO_SEJONG` → `JO_LEEMAENGGYUN` · POLICY · 시각 1432년 12월 21일 · 확실성 confirmed · 인과 UNKNOWN
- 사람 검토: ☐ 원문과 일치 ☐ 규칙 적용 적절 ☐ 수정 필요 — 메모:

### `E1432_1221#14` — 세종 → 조말생 (POLICY · `deliberate_truth_and_responsibility`)
1. **원문** `pack_v1:E1432_1221:RELATIONS:L144` (SRC_1432_1221): “세종 <-> 대신들 : INVESTIGATION / DELIBERATION”
   - 원문 주체/객체: 세종 → 대신들
   - 구성원 근거 `pack_v1:E1432_1221:WHO:L127`: “조말생”
2. **규칙** `R3_who_expansion` + `R6_layer_normalize` · 객체 R3_who_expansion
3. **생성된 edge** `JO_SEJONG` → `JO_JOMALSAENG` · POLICY · 시각 1432년 12월 21일 · 확실성 confirmed · 인과 UNKNOWN
- 사람 검토: ☐ 원문과 일치 ☐ 규칙 적용 적절 ☐ 수정 필요 — 메모:

### `E1433_0215#0` — 세종 → 황희 (POLICY · `secret_query`)
1. **원문** `pack_v1:E1433_0215:RELATIONS:L173` (SRC_1433_0215): “세종 -> central officials : POLICY_QUERY”
   - 원문 주체/객체: 세종 → central officials
   - 구성원 근거 `pack_v1:E1433_0215:WHO:L158`: “황희”
2. **규칙** `R3_who_expansion` · 객체 R3_who_expansion
3. **생성된 edge** `JO_SEJONG` → `JO_HWANGHUI` · POLICY · 시각 1433년 2월 15일 · 확실성 confirmed · 인과 UNKNOWN
- 사람 검토: ☐ 원문과 일치 ☐ 규칙 적용 적절 ☐ 수정 필요 — 메모:

### `E1433_0215#1` — 황희 → 세종 (POLICY · `advise`)
1. **원문** `pack_v1:E1433_0215:RELATIONS:L174` (SRC_1433_0215): “officials -> 세종 : POLICY_ADVICE”
   - 원문 주체/객체: officials → 세종
   - 구성원 근거 `pack_v1:E1433_0215:WHO:L158`: “황희”
2. **규칙** `R3_who_expansion` · 주체 R3_who_expansion
3. **생성된 edge** `JO_HWANGHUI` → `JO_SEJONG` · POLICY · 시각 1433년 2월 15일 · 확실성 confirmed · 인과 UNKNOWN
- 사람 검토: ☐ 원문과 일치 ☐ 규칙 적용 적절 ☐ 수정 필요 — 메모:

### `E1433_0215#2` — 세종 → 권진 (POLICY · `secret_query`)
1. **원문** `pack_v1:E1433_0215:RELATIONS:L173` (SRC_1433_0215): “세종 -> central officials : POLICY_QUERY”
   - 원문 주체/객체: 세종 → central officials
   - 구성원 근거 `pack_v1:E1433_0215:WHO:L159`: “권진”
2. **규칙** `R3_who_expansion` · 객체 R3_who_expansion
3. **생성된 edge** `JO_SEJONG` → `JO_GWONJIN` · POLICY · 시각 1433년 2월 15일 · 확실성 confirmed · 인과 UNKNOWN
- 사람 검토: ☐ 원문과 일치 ☐ 규칙 적용 적절 ☐ 수정 필요 — 메모:

### `E1433_0215#3` — 권진 → 세종 (POLICY · `advise`)
1. **원문** `pack_v1:E1433_0215:RELATIONS:L174` (SRC_1433_0215): “officials -> 세종 : POLICY_ADVICE”
   - 원문 주체/객체: officials → 세종
   - 구성원 근거 `pack_v1:E1433_0215:WHO:L159`: “권진”
2. **규칙** `R3_who_expansion` · 주체 R3_who_expansion
3. **생성된 edge** `JO_GWONJIN` → `JO_SEJONG` · POLICY · 시각 1433년 2월 15일 · 확실성 confirmed · 인과 UNKNOWN
- 사람 검토: ☐ 원문과 일치 ☐ 규칙 적용 적절 ☐ 수정 필요 — 메모:

### `E1433_0215#4` — 세종 → 허조 (POLICY · `secret_query`)
1. **원문** `pack_v1:E1433_0215:RELATIONS:L173` (SRC_1433_0215): “세종 -> central officials : POLICY_QUERY”
   - 원문 주체/객체: 세종 → central officials
   - 구성원 근거 `pack_v1:E1433_0215:WHO:L160`: “허조”
2. **규칙** `R3_who_expansion` · 객체 R3_who_expansion
3. **생성된 edge** `JO_SEJONG` → `JO_HEOJO` · POLICY · 시각 1433년 2월 15일 · 확실성 confirmed · 인과 UNKNOWN
- 사람 검토: ☐ 원문과 일치 ☐ 규칙 적용 적절 ☐ 수정 필요 — 메모:

### `E1433_0215#5` — 허조 → 세종 (POLICY · `advise`)
1. **원문** `pack_v1:E1433_0215:RELATIONS:L174` (SRC_1433_0215): “officials -> 세종 : POLICY_ADVICE”
   - 원문 주체/객체: officials → 세종
   - 구성원 근거 `pack_v1:E1433_0215:WHO:L160`: “허조”
2. **규칙** `R3_who_expansion` · 주체 R3_who_expansion
3. **생성된 edge** `JO_HEOJO` → `JO_SEJONG` · POLICY · 시각 1433년 2월 15일 · 확실성 confirmed · 인과 UNKNOWN
- 사람 검토: ☐ 원문과 일치 ☐ 규칙 적용 적절 ☐ 수정 필요 — 메모:

### `E1433_0307#0` — 최윤덕 → 최치운 (REPORT · `entrust_plan`)
1. **원문** `pack_v1:E1433_0307:WHAT:L216` (SRC_1433_0307): “Choe submitted operational plan via Choe Chi-un.”
   - 원문 주체/객체: Choe → Choe Chi-un
2. **규칙** `R2_carrier_split` · 주체 R2_carrier_split
3. **생성된 edge** `JO_CHOEYUNDEOK` → `JO_CHOECHIUN` · REPORT · 시각 1433년 3월 7일 이전(정확한 시점 미상) · 확실성 confirmed · 인과 UNKNOWN
- 사람 검토: ☐ 원문과 일치 ☐ 규칙 적용 적절 ☐ 수정 필요 — 메모:

### `E1433_0307#1` — 최치운 → 세종 (REPORT · `carry_report`)
1. **원문** `pack_v1:E1433_0307:RELATIONS:L223` (SRC_1433_0307): “최치운 -> court : REPORT_CARRIER”
   - 원문 주체/객체: 최치운 → court
2. **규칙** `R1_court_recipient` · 객체 R1_court_recipient
3. **생성된 edge** `JO_CHOECHIUN` → `JO_SEJONG` · REPORT · 시각 1433년 3월 7일 · 확실성 confirmed · 인과 UNKNOWN
- 사람 검토: ☐ 원문과 일치 ☐ 규칙 적용 적절 ☐ 수정 필요 — 메모:

### `E1433_0410#0` — 최윤덕 → 이순몽 (COMMAND · `assign_column_command`)
1. **원문** `pack_v1:E1433_0507:RELATIONS:L291` (SRC_1433_0507): “최윤덕 -> six subordinate columns : COMMAND”
   - 원문 주체/객체: 최윤덕 → six subordinate columns
   - 구성원 근거 `pack_v1:E1433_0507:MAJOR COMMANDERS AND FORCE SIZES:L262`: “이순몽: 2,515”
2. **규칙** `R3_who_expansion` · 객체 R3_who_expansion
3. **생성된 edge** `JO_CHOEYUNDEOK` → `JO_LEESUNMONG` · COMMAND · 시각 1433년 4월 10일 · 확실성 confirmed · 인과 UNKNOWN
- 사람 검토: ☐ 원문과 일치 ☐ 규칙 적용 적절 ☐ 수정 필요 — 메모:

### `E1433_0410#1` — 최윤덕 → 최해산 (COMMAND · `assign_column_command`)
1. **원문** `pack_v1:E1433_0507:RELATIONS:L291` (SRC_1433_0507): “최윤덕 -> six subordinate columns : COMMAND”
   - 원문 주체/객체: 최윤덕 → six subordinate columns
   - 구성원 근거 `pack_v1:E1433_0507:MAJOR COMMANDERS AND FORCE SIZES:L263`: “최해산: 2,070”
2. **규칙** `R3_who_expansion` · 객체 R3_who_expansion
3. **생성된 edge** `JO_CHOEYUNDEOK` → `JO_CHOEHAESAN` · COMMAND · 시각 1433년 4월 10일 · 확실성 confirmed · 인과 UNKNOWN
- 사람 검토: ☐ 원문과 일치 ☐ 규칙 적용 적절 ☐ 수정 필요 — 메모:

### `E1433_0410#2` — 최윤덕 → 이각 (COMMAND · `assign_column_command`)
1. **원문** `pack_v1:E1433_0507:RELATIONS:L291` (SRC_1433_0507): “최윤덕 -> six subordinate columns : COMMAND”
   - 원문 주체/객체: 최윤덕 → six subordinate columns
   - 구성원 근거 `pack_v1:E1433_0507:MAJOR COMMANDERS AND FORCE SIZES:L264`: “이각 李恪: 1,770”
2. **규칙** `R3_who_expansion` · 객체 R3_who_expansion
3. **생성된 edge** `JO_CHOEYUNDEOK` → `JO_LEEGAK` · COMMAND · 시각 1433년 4월 10일 · 확실성 confirmed · 인과 UNKNOWN
- 사람 검토: ☐ 원문과 일치 ☐ 규칙 적용 적절 ☐ 수정 필요 — 메모:

### `E1433_0410#3` — 최윤덕 → 이징석 (COMMAND · `assign_column_command`)
1. **원문** `pack_v1:E1433_0507:RELATIONS:L291` (SRC_1433_0507): “최윤덕 -> six subordinate columns : COMMAND”
   - 원문 주체/객체: 최윤덕 → six subordinate columns
   - 구성원 근거 `pack_v1:E1433_0507:MAJOR COMMANDERS AND FORCE SIZES:L265`: “이징석 李澄石: 3,010”
2. **규칙** `R3_who_expansion` · 객체 R3_who_expansion
3. **생성된 edge** `JO_CHOEYUNDEOK` → `JO_LEEJINGSEOK` · COMMAND · 시각 1433년 4월 10일 · 확실성 confirmed · 인과 UNKNOWN
- 사람 검토: ☐ 원문과 일치 ☐ 규칙 적용 적절 ☐ 수정 필요 — 메모:

### `E1433_0410#4` — 최윤덕 → 김효성 (COMMAND · `assign_column_command`)
1. **원문** `pack_v1:E1433_0507:RELATIONS:L291` (SRC_1433_0507): “최윤덕 -> six subordinate columns : COMMAND”
   - 원문 주체/객체: 최윤덕 → six subordinate columns
   - 구성원 근거 `pack_v1:E1433_0507:MAJOR COMMANDERS AND FORCE SIZES:L266`: “김효성 金孝誠: 1,888”
2. **규칙** `R3_who_expansion` · 객체 R3_who_expansion
3. **생성된 edge** `JO_CHOEYUNDEOK` → `JO_KIMHYOSEONG` · COMMAND · 시각 1433년 4월 10일 · 확실성 confirmed · 인과 UNKNOWN
- 사람 검토: ☐ 원문과 일치 ☐ 규칙 적용 적절 ☐ 수정 필요 — 메모:

### `E1433_0410#5` — 최윤덕 → 홍사석 (COMMAND · `assign_column_command`)
1. **원문** `pack_v1:E1433_0507:RELATIONS:L291` (SRC_1433_0507): “최윤덕 -> six subordinate columns : COMMAND”
   - 원문 주체/객체: 최윤덕 → six subordinate columns
   - 구성원 근거 `pack_v1:E1433_0507:MAJOR COMMANDERS AND FORCE SIZES:L267`: “홍사석 洪師錫: 1,110”
2. **규칙** `R3_who_expansion` · 객체 R3_who_expansion
3. **생성된 edge** `JO_CHOEYUNDEOK` → `JO_HONGSASEOK` · COMMAND · 시각 1433년 4월 10일 · 확실성 confirmed · 인과 UNKNOWN
- 사람 검토: ☐ 원문과 일치 ☐ 규칙 적용 적절 ☐ 수정 필요 — 메모:

### `E1433_0507#0` — 최윤덕 → 박호문 (REPORT · `entrust_battle_report`)
1. **원문** `pack_v1:E1433_0507:REPORTER:L258` (SRC_1433_0507): “최윤덕, via 박호문”
   - 원문 주체/객체: 최윤덕 → 박호문
2. **규칙** `R2_carrier_split` · 객체 R2_carrier_split
3. **생성된 edge** `JO_CHOEYUNDEOK` → `JO_PARKHOMUN` · REPORT · 시각 1433년 5월 7일 이전(정확한 시점 미상) · 확실성 confirmed · 인과 UNKNOWN
- 사람 검토: ☐ 원문과 일치 ☐ 규칙 적용 적절 ☐ 수정 필요 — 메모:

### `E1433_0507#1` — 박호문 → 세종 (REPORT · `carry_battle_report`)
1. **원문** `pack_v1:E1433_0507:RELATIONS:L293` (SRC_1433_0507): “박호문 -> court : REPORT”
   - 원문 주체/객체: 박호문 → court
2. **규칙** `R1_court_recipient` · 객체 R1_court_recipient
3. **생성된 edge** `JO_PARKHOMUN` → `JO_SEJONG` · REPORT · 시각 1433년 5월 7일 · 확실성 confirmed · 인과 UNKNOWN
- 사람 검토: ☐ 원문과 일치 ☐ 규칙 적용 적절 ☐ 수정 필요 — 메모:

### `E1433_0516A#0` — 세종 → 최윤덕 (REWARD · `promotion_for_campaign_merit`)
1. **원문** `pack_v1:E1433_0516_A:RELATIONS:L327` (SRC_1433_0516A): “세종 -> campaign commanders : REWARD / APPOINTMENT”
   - 원문 주체/객체: 세종 → campaign commanders
   - 구성원 근거 `pack_v1:E1433_0516_A:WHO:L303`: “최윤덕”
   - 구성원 근거 `pack_v1:E1433_0507:MAJOR COMMANDERS AND FORCE SIZES:L261`: “최윤덕: 2,599”
2. **규칙** `R3_who_expansion` + `R6_layer_normalize` · 객체 R3_who_expansion
3. **생성된 edge** `JO_SEJONG` → `JO_CHOEYUNDEOK` · REWARD · 시각 1433년 5월 16일 · 확실성 confirmed · 인과 EXPLICIT_CAUSAL
- ⚑ 검토 표시: CROSS_ENTRY_MEMBERSHIP
- 사람 검토: ☐ 원문과 일치 ☐ 규칙 적용 적절 ☐ 수정 필요 — 메모:

### `E1433_0516A#1` — 세종 → 이순몽 (REWARD · `promotion_for_campaign_merit`)
1. **원문** `pack_v1:E1433_0516_A:RELATIONS:L327` (SRC_1433_0516A): “세종 -> campaign commanders : REWARD / APPOINTMENT”
   - 원문 주체/객체: 세종 → campaign commanders
   - 구성원 근거 `pack_v1:E1433_0516_A:WHO:L305`: “이순몽”
   - 구성원 근거 `pack_v1:E1433_0507:MAJOR COMMANDERS AND FORCE SIZES:L262`: “이순몽: 2,515”
2. **규칙** `R3_who_expansion` + `R6_layer_normalize` · 객체 R3_who_expansion
3. **생성된 edge** `JO_SEJONG` → `JO_LEESUNMONG` · REWARD · 시각 1433년 5월 16일 · 확실성 confirmed · 인과 EXPLICIT_CAUSAL
- ⚑ 검토 표시: CROSS_ENTRY_MEMBERSHIP
- 사람 검토: ☐ 원문과 일치 ☐ 규칙 적용 적절 ☐ 수정 필요 — 메모:

### `E1433_0516A#2` — 세종 → 이각 (REWARD · `promotion_for_campaign_merit`)
1. **원문** `pack_v1:E1433_0516_A:RELATIONS:L327` (SRC_1433_0516A): “세종 -> campaign commanders : REWARD / APPOINTMENT”
   - 원문 주체/객체: 세종 → campaign commanders
   - 구성원 근거 `pack_v1:E1433_0516_A:WHO:L307`: “이각”
   - 구성원 근거 `pack_v1:E1433_0507:MAJOR COMMANDERS AND FORCE SIZES:L264`: “이각 李恪: 1,770”
2. **규칙** `R3_who_expansion` + `R6_layer_normalize` · 객체 R3_who_expansion
3. **생성된 edge** `JO_SEJONG` → `JO_LEEGAK` · REWARD · 시각 1433년 5월 16일 · 확실성 confirmed · 인과 EXPLICIT_CAUSAL
- ⚑ 검토 표시: CROSS_ENTRY_MEMBERSHIP
- 사람 검토: ☐ 원문과 일치 ☐ 규칙 적용 적절 ☐ 수정 필요 — 메모:

### `E1433_0516A#3` — 세종 → 이징석 (REWARD · `promotion_for_campaign_merit`)
1. **원문** `pack_v1:E1433_0516_A:RELATIONS:L327` (SRC_1433_0516A): “세종 -> campaign commanders : REWARD / APPOINTMENT”
   - 원문 주체/객체: 세종 → campaign commanders
   - 구성원 근거 `pack_v1:E1433_0516_A:WHO:L308`: “이징석”
   - 구성원 근거 `pack_v1:E1433_0507:MAJOR COMMANDERS AND FORCE SIZES:L265`: “이징석 李澄石: 3,010”
2. **규칙** `R3_who_expansion` + `R6_layer_normalize` · 객체 R3_who_expansion
3. **생성된 edge** `JO_SEJONG` → `JO_LEEJINGSEOK` · REWARD · 시각 1433년 5월 16일 · 확실성 confirmed · 인과 EXPLICIT_CAUSAL
- ⚑ 검토 표시: CROSS_ENTRY_MEMBERSHIP
- 사람 검토: ☐ 원문과 일치 ☐ 규칙 적용 적절 ☐ 수정 필요 — 메모:

### `E1433_0516A#4` — 세종 → 김효성 (REWARD · `promotion_for_campaign_merit`)
1. **원문** `pack_v1:E1433_0516_A:RELATIONS:L327` (SRC_1433_0516A): “세종 -> campaign commanders : REWARD / APPOINTMENT”
   - 원문 주체/객체: 세종 → campaign commanders
   - 구성원 근거 `pack_v1:E1433_0516_A:WHO:L312`: “김효성”
   - 구성원 근거 `pack_v1:E1433_0507:MAJOR COMMANDERS AND FORCE SIZES:L266`: “김효성 金孝誠: 1,888”
2. **규칙** `R3_who_expansion` + `R6_layer_normalize` · 객체 R3_who_expansion
3. **생성된 edge** `JO_SEJONG` → `JO_KIMHYOSEONG` · REWARD · 시각 1433년 5월 16일 · 확실성 confirmed · 인과 EXPLICIT_CAUSAL
- ⚑ 검토 표시: CROSS_ENTRY_MEMBERSHIP
- 사람 검토: ☐ 원문과 일치 ☐ 규칙 적용 적절 ☐ 수정 필요 — 메모:

### `E1433_0516A#5` — 세종 → 홍사석 (REWARD · `promotion_for_campaign_merit`)
1. **원문** `pack_v1:E1433_0516_A:RELATIONS:L327` (SRC_1433_0516A): “세종 -> campaign commanders : REWARD / APPOINTMENT”
   - 원문 주체/객체: 세종 → campaign commanders
   - 구성원 근거 `pack_v1:E1433_0516_A:WHO:L313`: “홍사석”
   - 구성원 근거 `pack_v1:E1433_0507:MAJOR COMMANDERS AND FORCE SIZES:L267`: “홍사석 洪師錫: 1,110”
2. **규칙** `R3_who_expansion` + `R6_layer_normalize` · 객체 R3_who_expansion
3. **생성된 edge** `JO_SEJONG` → `JO_HONGSASEOK` · REWARD · 시각 1433년 5월 16일 · 확실성 confirmed · 인과 EXPLICIT_CAUSAL
- ⚑ 검토 표시: CROSS_ENTRY_MEMBERSHIP
- 사람 검토: ☐ 원문과 일치 ☐ 규칙 적용 적절 ☐ 수정 필요 — 메모:

### `E1433_0516B#0` — 조선 국가·조정(주체·수신자 미특정) → 최윤덕 (REWARD · `bestow_nobi`)
1. **원문** `pack_v1:E1433_0516_B:RELATIONS:L349` (SRC_1433_0516B): “state -> commanders : REWARD”
   - 원문 주체/객체: state → commanders
   - 구성원 근거 `pack_v1:E1433_0516_B:WHO / WHAT:L337`: “최윤덕: 10”
2. **규칙** `R3_who_expansion` · 객체 R3_who_expansion
3. **생성된 edge** `ORG_JOSEON_COURT` → `JO_CHOEYUNDEOK` · REWARD · 시각 1433년 5월 16일 · 확실성 confirmed · 인과 EXPLICIT_CAUSAL
- 사람 검토: ☐ 원문과 일치 ☐ 규칙 적용 적절 ☐ 수정 필요 — 메모:

### `E1433_0516B#1` — 조선 국가·조정(주체·수신자 미특정) → 이순몽 (REWARD · `bestow_nobi`)
1. **원문** `pack_v1:E1433_0516_B:RELATIONS:L349` (SRC_1433_0516B): “state -> commanders : REWARD”
   - 원문 주체/객체: state → commanders
   - 구성원 근거 `pack_v1:E1433_0516_B:WHO / WHAT:L338`: “이순몽: 8”
2. **규칙** `R3_who_expansion` · 객체 R3_who_expansion
3. **생성된 edge** `ORG_JOSEON_COURT` → `JO_LEESUNMONG` · REWARD · 시각 1433년 5월 16일 · 확실성 confirmed · 인과 EXPLICIT_CAUSAL
- 사람 검토: ☐ 원문과 일치 ☐ 규칙 적용 적절 ☐ 수정 필요 — 메모:

### `E1433_0516B#2` — 조선 국가·조정(주체·수신자 미특정) → 이각 (REWARD · `bestow_nobi`)
1. **원문** `pack_v1:E1433_0516_B:RELATIONS:L349` (SRC_1433_0516B): “state -> commanders : REWARD”
   - 원문 주체/객체: state → commanders
   - 구성원 근거 `pack_v1:E1433_0516_B:WHO / WHAT:L339`: “이각: 6”
2. **규칙** `R3_who_expansion` · 객체 R3_who_expansion
3. **생성된 edge** `ORG_JOSEON_COURT` → `JO_LEEGAK` · REWARD · 시각 1433년 5월 16일 · 확실성 confirmed · 인과 EXPLICIT_CAUSAL
- 사람 검토: ☐ 원문과 일치 ☐ 규칙 적용 적절 ☐ 수정 필요 — 메모:

### `E1433_0516B#3` — 조선 국가·조정(주체·수신자 미특정) → 이징석 (REWARD · `bestow_nobi`)
1. **원문** `pack_v1:E1433_0516_B:RELATIONS:L349` (SRC_1433_0516B): “state -> commanders : REWARD”
   - 원문 주체/객체: state → commanders
   - 구성원 근거 `pack_v1:E1433_0516_B:WHO / WHAT:L340`: “이징석: 6”
2. **규칙** `R3_who_expansion` · 객체 R3_who_expansion
3. **생성된 edge** `ORG_JOSEON_COURT` → `JO_LEEJINGSEOK` · REWARD · 시각 1433년 5월 16일 · 확실성 confirmed · 인과 EXPLICIT_CAUSAL
- 사람 검토: ☐ 원문과 일치 ☐ 규칙 적용 적절 ☐ 수정 필요 — 메모:

### `E1433_0516B#4` — 조선 국가·조정(주체·수신자 미특정) → 홍사석 (REWARD · `bestow_nobi`)
1. **원문** `pack_v1:E1433_0516_B:RELATIONS:L349` (SRC_1433_0516B): “state -> commanders : REWARD”
   - 원문 주체/객체: state → commanders
   - 구성원 근거 `pack_v1:E1433_0516_B:WHO / WHAT:L341`: “홍사석: 5”
2. **규칙** `R3_who_expansion` · 객체 R3_who_expansion
3. **생성된 edge** `ORG_JOSEON_COURT` → `JO_HONGSASEOK` · REWARD · 시각 1433년 5월 16일 · 확실성 confirmed · 인과 EXPLICIT_CAUSAL
- 사람 검토: ☐ 원문과 일치 ☐ 규칙 적용 적절 ☐ 수정 필요 — 메모:

### `E1433_0516B#5` — 조선 국가·조정(주체·수신자 미특정) → 김효성 (REWARD · `bestow_nobi`)
1. **원문** `pack_v1:E1433_0516_B:RELATIONS:L349` (SRC_1433_0516B): “state -> commanders : REWARD”
   - 원문 주체/객체: state → commanders
   - 구성원 근거 `pack_v1:E1433_0516_B:WHO / WHAT:L342`: “김효성: 4”
2. **규칙** `R3_who_expansion` · 객체 R3_who_expansion
3. **생성된 edge** `ORG_JOSEON_COURT` → `JO_KIMHYOSEONG` · REWARD · 시각 1433년 5월 16일 · 확실성 confirmed · 인과 EXPLICIT_CAUSAL
- 사람 검토: ☐ 원문과 일치 ☐ 규칙 적용 적절 ☐ 수정 필요 — 메모:

### `E1433_0517#0` — 조선 국가·조정(주체·수신자 미특정) → 1433 정벌 전사·병사자와 유가족 (WELFARE · `commemorate_and_compensate`)
1. **원문** `pack_v1:E1433_0517:RELATIONS:L381` (SRC_1433_0517): “state -> dead soldiers : HONOR”
   - 원문 주체/객체: state → dead soldiers
   - 보조 근거 `pack_v1:E1433_0517:RELATIONS:L382`: “state -> bereaved households : WELFARE”
2. **규칙** `R4_group_placeholder` · 객체 R4_group_placeholder
3. **생성된 edge** `ORG_JOSEON_COURT` → `GRP_1433_WARDEAD` · WELFARE · 시각 1433년 5월 17일 · 확실성 confirmed · 인과 EXPLICIT_CAUSAL
- 사람 검토: ☐ 원문과 일치 ☐ 규칙 적용 적절 ☐ 수정 필요 — 메모:

### `E1433_0517#1` — 조선 국가·조정(주체·수신자 미특정) → 안을경 (WELFARE · `commemorate_named_dead`)
1. **원문** `pack_v1:E1433_0517:RELATIONS:L381` (SRC_1433_0517): “state -> dead soldiers : HONOR”
   - 원문 주체/객체: state → dead soldiers
   - 구성원 근거 `pack_v1:E1433_0517:WHO:L360`: “안을경 安乙敬 and other named/unnamed dead”
2. **규칙** `R3_who_expansion` · 객체 R3_who_expansion
3. **생성된 edge** `ORG_JOSEON_COURT` → `JO_ANEULGYEONG` · WELFARE · 시각 1433년 5월 17일 · 확실성 confirmed · 인과 EXPLICIT_CAUSAL
- 사람 검토: ☐ 원문과 일치 ☐ 규칙 적용 적절 ☐ 수정 필요 — 메모:

### `E1433_0517#2` — 조선 국가·조정(주체·수신자 미특정) → 1433 정벌군(평안도 1만·황해도 5천) (WELFARE · `compensate_horse_loss`)
1. **원문** `pack_v1:E1433_0517:RELATIONS:L383` (SRC_1433_0517): “state -> soldiers/officers : COMPENSATION”
   - 원문 주체/객체: state → soldiers/officers
   - 보조 근거 `pack_v1:E1433_0517:WHAT:L377`: “For loss of horse:”
2. **규칙** `R4_group_placeholder` · 객체 R4_group_placeholder
3. **생성된 edge** `ORG_JOSEON_COURT` → `GRP_1433_EXPEDITION_TROOPS` · WELFARE · 시각 1433년 5월 17일 · 확실성 confirmed · 인과 UNKNOWN
- 사람 검토: ☐ 원문과 일치 ☐ 규칙 적용 적절 ☐ 수정 필요 — 메모:

### `E1433_0610#0` — 맹가첩목아 → 지함 (DIPLOMACY · `protest_and_statement_to_envoy`)
1. **원문** `pack_v1:E1433_0610:RELATIONS:L409` (SRC_1433_0610): “맹가첩목아 -> 조선 : CLAIM / DIPLOMATIC_PROTEST”
   - 원문 주체/객체: 맹가첩목아 → 조선
   - 보조 근거 `pack_v1:E1433_0610:WHAT:L399`: “Ji Ham returned from Almuha and reported Menggetemur's statements.”
2. **규칙** `R5_content_actor` + `R6_layer_normalize` · 객체 R5_content_actor
3. **생성된 edge** `JZ_MENGGETEMUR` → `JO_JIHAM` · DIPLOMACY · 시각 1433년 6월 10일 이전(정확한 시점 미상) · 확실성 confirmed · 인과 EXPLICIT_CAUSAL
- ⚑ 검토 표시: RECIPIENT_SUBSTITUTED
- 사람 검토: ☐ 원문과 일치 ☐ 규칙 적용 적절 ☐ 수정 필요 — 메모:

### `E1433_0610#1` — 맹가첩목아 → 임합라 (COUNTER_CLAIM · `identify_as_ringleader`)
1. **원문** `pack_v1:E1433_0610:WHAT:L400` (SRC_1433_0610): “Menggetemur asserted that Im Hab-ra was the real leader of the attack”
   - 원문 주체/객체: Menggetemur → Im Hab-ra
2. **규칙** `R5_content_actor` · 주체 R5_content_actor · 객체 R5_content_actor
3. **생성된 edge** `JZ_MENGGETEMUR` → `JZ_IMHALA` · COUNTER_CLAIM · 시각 1433년 6월 10일 이전(정확한 시점 미상) · 확실성 contemporary_claim · 인과 UNKNOWN · 경로 제외
- ⚑ 검토 표시: ABOUT_RELATION
- 사람 검토: ☐ 원문과 일치 ☐ 규칙 적용 적절 ☐ 수정 필요 — 메모:

### `E1433_0610#2` — 맹가첩목아 → 이만주 (COUNTER_CLAIM · `exculpate`)
1. **원문** `pack_v1:E1433_0610:WHAT:L400` (SRC_1433_0610): “Menggetemur asserted that Im Hab-ra was the real leader of the attack”
   - 원문 주체/객체: Menggetemur → Yi Manju
   - 보조 근거 `pack_v1:E1433_0610:WHAT:L401`: “and Yi Manju had tried to stop it.”
2. **규칙** `R5_content_actor` · 주체 R5_content_actor · 객체 R5_content_actor
3. **생성된 edge** `JZ_MENGGETEMUR` → `JZ_MANJU` · COUNTER_CLAIM · 시각 1433년 6월 10일 이전(정확한 시점 미상) · 확실성 contemporary_claim · 인과 UNKNOWN · 경로 제외
- ⚑ 검토 표시: ABOUT_RELATION
- 사람 검토: ☐ 원문과 일치 ☐ 규칙 적용 적절 ☐ 수정 필요 — 메모:

### `E1433_08L10#1` — 선덕제 → 양목답올 (DIPLOMACY · `imperial_mediation_order`)
1. **원문** `pack_v1:E1433_0810:RELATIONS:L443` (SRC_1433_08L10): “선덕제 -> Jurchen actors : MEDIATION / IMPERIAL_ORDER”
   - 원문 주체/객체: 선덕제 → Jurchen actors
   - 구성원 근거 `pack_v1:E1433_0810:WHO:L424`: “양목답올”
2. **규칙** `R3_who_expansion` · 객체 R3_who_expansion
3. **생성된 edge** `MING_XUANDE` → `JZ_YANGMOKDABOL` · DIPLOMACY · 시각 시점 미상 · 확실성 confirmed · 인과 UNKNOWN
- 사람 검토: ☐ 원문과 일치 ☐ 규칙 적용 적절 ☐ 수정 필요 — 메모:

### `E1433_08L10#2` — 선덕제 → 살만답실리 (DIPLOMACY · `imperial_mediation_order`)
1. **원문** `pack_v1:E1433_0810:RELATIONS:L443` (SRC_1433_08L10): “선덕제 -> Jurchen actors : MEDIATION / IMPERIAL_ORDER”
   - 원문 주체/객체: 선덕제 → Jurchen actors
   - 구성원 근거 `pack_v1:E1433_0810:WHO:L425`: “살만답실리”
2. **규칙** `R3_who_expansion` · 객체 R3_who_expansion
3. **생성된 edge** `MING_XUANDE` → `JZ_SALMANDAPSILI` · DIPLOMACY · 시각 시점 미상 · 확실성 confirmed · 인과 UNKNOWN
- 사람 검토: ☐ 원문과 일치 ☐ 규칙 적용 적절 ☐ 수정 필요 — 메모:

### `E1433_08L10#3` — 선덕제 → 맹가첩목아 (DIPLOMACY · `imperial_mediation_order`)
1. **원문** `pack_v1:E1433_0810:RELATIONS:L443` (SRC_1433_08L10): “선덕제 -> Jurchen actors : MEDIATION / IMPERIAL_ORDER”
   - 원문 주체/객체: 선덕제 → Jurchen actors
   - 구성원 근거 `pack_v1:E1433_0810:WHO:L426`: “맹가첩목아”
2. **규칙** `R3_who_expansion` · 객체 R3_who_expansion
3. **생성된 edge** `MING_XUANDE` → `JZ_MENGGETEMUR` · DIPLOMACY · 시각 시점 미상 · 확실성 confirmed · 인과 UNKNOWN
- 사람 검토: ☐ 원문과 일치 ☐ 규칙 적용 적절 ☐ 수정 필요 — 메모:

### `E1433_08L10#4` — 선덕제 → 범찰 (DIPLOMACY · `imperial_mediation_order`)
1. **원문** `pack_v1:E1433_0810:RELATIONS:L443` (SRC_1433_08L10): “선덕제 -> Jurchen actors : MEDIATION / IMPERIAL_ORDER”
   - 원문 주체/객체: 선덕제 → Jurchen actors
   - 구성원 근거 `pack_v1:E1433_0810:WHO:L427`: “범찰”
2. **규칙** `R3_who_expansion` · 객체 R3_who_expansion
3. **생성된 edge** `MING_XUANDE` → `JZ_FANCHA` · DIPLOMACY · 시각 시점 미상 · 확실성 confirmed · 인과 UNKNOWN
- 사람 검토: ☐ 원문과 일치 ☐ 규칙 적용 적절 ☐ 수정 필요 — 메모:

### `E1433_08L10#5` — 선덕제 → 이만주 (DIPLOMACY · `imperial_mediation_order`)
1. **원문** `pack_v1:E1433_0810:RELATIONS:L443` (SRC_1433_08L10): “선덕제 -> Jurchen actors : MEDIATION / IMPERIAL_ORDER”
   - 원문 주체/객체: 선덕제 → Jurchen actors
   - 구성원 근거 `pack_v1:E1433_0810:WHO:L428`: “이만주”
2. **규칙** `R3_who_expansion` · 객체 R3_who_expansion
3. **생성된 edge** `MING_XUANDE` → `JZ_MANJU` · DIPLOMACY · 시각 시점 미상 · 확실성 confirmed · 인과 UNKNOWN
- 사람 검토: ☐ 원문과 일치 ☐ 규칙 적용 적절 ☐ 수정 필요 — 메모:

### `E1433_08L10#6` — 선덕제 → 아라답 (DIPLOMACY · `imperial_mediation_order`)
1. **원문** `pack_v1:E1433_0810:RELATIONS:L443` (SRC_1433_08L10): “선덕제 -> Jurchen actors : MEDIATION / IMPERIAL_ORDER”
   - 원문 주체/객체: 선덕제 → Jurchen actors
   - 구성원 근거 `pack_v1:E1433_0810:WHO:L429`: “아라답”
2. **규칙** `R3_who_expansion` · 객체 R3_who_expansion
3. **생성된 edge** `MING_XUANDE` → `JZ_ARADAP` · DIPLOMACY · 시각 시점 미상 · 확실성 confirmed · 인과 UNKNOWN
- 사람 검토: ☐ 원문과 일치 ☐ 규칙 적용 적절 ☐ 수정 필요 — 메모:

### `E1433_08L10#7` — 조선 국가·조정(주체·수신자 미특정) → 선덕제 (CLAIM · `prior_account_to_ming`)
1. **원문** `pack_v1:E1433_0810:RELATIONS:L445` (SRC_1433_08L10): “Joseon -> Ming : CLAIM”
   - 원문 주체/객체: Joseon → Ming
   - 보조 근거 `pack_v1:E1433_0810:WHAT:L432`: “Ming court received conflicting accounts.”
2. **규칙** `R1_court_recipient` · 객체 R1_court_recipient
3. **생성된 edge** `ORG_JOSEON_COURT` → `MING_XUANDE` · CLAIM · 시각 1433년 윤8월 10일 이전(정확한 시점 미상) · 확실성 confirmed · 인과 UNKNOWN
- 사람 검토: ☐ 원문과 일치 ☐ 규칙 적용 적절 ☐ 수정 필요 — 메모:

### `E1433_08L10#8` — 이만주 → 선덕제 (CLAIM · `prior_account_to_ming`)
1. **원문** `pack_v1:E1433_0810:RELATIONS:L444` (SRC_1433_08L10): “이만주 side -> Ming : CLAIM”
   - 원문 주체/객체: 이만주 side → Ming
   - 구성원 근거 `pack_v1:E1433_0810:WHO:L428`: “이만주”
   - 보조 근거 `pack_v1:E1433_0810:WHAT:L432`: “Ming court received conflicting accounts.”
2. **규칙** `R3_who_expansion` + `R1_court_recipient` · 주체 R3_who_expansion · 객체 R1_court_recipient
3. **생성된 edge** `JZ_MANJU` → `MING_XUANDE` · CLAIM · 시각 1433년 윤8월 10일 이전(정확한 시점 미상) · 확실성 confirmed · 인과 UNKNOWN
- ⚑ 검토 표시: SIDE_TO_PERSON
- 사람 검토: ☐ 원문과 일치 ☐ 규칙 적용 적절 ☐ 수정 필요 — 메모:

### `E1434_0803#0` — 1434 범찰 관련 첩보 출처(미상) → 세종 (INTELLIGENCE · `report_rumor`)
1. **원문** `pack_v1:E1434_0803:RELATIONS:L477` (SRC_1434_0803): “local intelligence -> court : INTELLIGENCE”
   - 원문 주체/객체: local intelligence → court
2. **규칙** `R4_group_placeholder` + `R1_court_recipient` · 주체 R4_group_placeholder · 객체 R1_court_recipient
3. **생성된 edge** `GRP_1434_INTEL_SOURCE` → `JO_SEJONG` · INTELLIGENCE · 시각 1434년 8월 3일 · 확실성 confirmed · 인과 UNKNOWN
- 사람 검토: ☐ 원문과 일치 ☐ 규칙 적용 적절 ☐ 수정 필요 — 메모:

### `E1435_0113#0` — 오량합 기병(1435-01 여연성 포위, 약 2,700기) → 1435-01 여연성 수비 군사(부상 4·사망 1) (MILITARY_CONFLICT · `siege`)
1. **원문** `pack_v1:E1435_0113:RELATIONS:L531` (SRC_1435_0118): “Oryanghap -> Yŏyŏn : MILITARY_ATTACK”
   - 원문 주체/객체: Oryanghap → Yŏyŏn
   - 보조 근거 `pack_v1:E1435_0113:WHO:L520`: “unnamed soldiers”
   - 보조 근거 `pack_v1:E1435_0113:WHAT:L524`: “defenders fought from morning into afternoon.”
2. **규칙** `R4_group_placeholder` · 주체 R4_group_placeholder · 객체 R4_group_placeholder
3. **생성된 edge** `GRP_ORYANGHAP_1435` → `GRP_1435_YEOYEON_GARRISON` · MILITARY_CONFLICT · 시각 1435년 1월 13일 · 확실성 confirmed · 인과 UNKNOWN
- ⚑ 검토 표시: PLACE_AS_TARGET
- 사람 검토: ☐ 원문과 일치 ☐ 규칙 적용 적절 ☐ 수정 필요 — 메모:

### `E1435_0113#1` — 김윤수 → 1435-01 여연성 수비 군사(부상 4·사망 1) (COMMAND · `command_defenders`)
1. **원문** `pack_v1:E1435_0113:RELATIONS:L532` (SRC_1435_0118): “김윤수/이진/여성렬/김수연 -> defenders : COMMAND”
   - 원문 주체/객체: 김윤수 → defenders
   - 보조 근거 `pack_v1:E1435_0113:WHO:L520`: “unnamed soldiers”
2. **규칙** `R4_group_placeholder` · 객체 R4_group_placeholder
3. **생성된 edge** `JO_KIMYUNSU` → `GRP_1435_YEOYEON_GARRISON` · COMMAND · 시각 1435년 1월 13일 · 확실성 confirmed · 인과 UNKNOWN
- 사람 검토: ☐ 원문과 일치 ☐ 규칙 적용 적절 ☐ 수정 필요 — 메모:

### `E1435_0113#2` — 이진 → 1435-01 여연성 수비 군사(부상 4·사망 1) (COMMAND · `command_defenders`)
1. **원문** `pack_v1:E1435_0113:RELATIONS:L532` (SRC_1435_0118): “김윤수/이진/여성렬/김수연 -> defenders : COMMAND”
   - 원문 주체/객체: 이진 → defenders
   - 보조 근거 `pack_v1:E1435_0113:WHO:L520`: “unnamed soldiers”
2. **규칙** `R4_group_placeholder` · 객체 R4_group_placeholder
3. **생성된 edge** `JO_LEEJIN` → `GRP_1435_YEOYEON_GARRISON` · COMMAND · 시각 1435년 1월 13일 · 확실성 confirmed · 인과 UNKNOWN
- 사람 검토: ☐ 원문과 일치 ☐ 규칙 적용 적절 ☐ 수정 필요 — 메모:

### `E1435_0113#3` — 여성렬 → 1435-01 여연성 수비 군사(부상 4·사망 1) (COMMAND · `command_defenders`)
1. **원문** `pack_v1:E1435_0113:RELATIONS:L532` (SRC_1435_0118): “김윤수/이진/여성렬/김수연 -> defenders : COMMAND”
   - 원문 주체/객체: 여성렬 → defenders
   - 보조 근거 `pack_v1:E1435_0113:WHO:L520`: “unnamed soldiers”
2. **규칙** `R4_group_placeholder` · 객체 R4_group_placeholder
3. **생성된 edge** `JO_YEOSEONGRYEOL` → `GRP_1435_YEOYEON_GARRISON` · COMMAND · 시각 1435년 1월 13일 · 확실성 confirmed · 인과 UNKNOWN
- 사람 검토: ☐ 원문과 일치 ☐ 규칙 적용 적절 ☐ 수정 필요 — 메모:

### `E1435_0113#4` — 김수연 → 1435-01 여연성 수비 군사(부상 4·사망 1) (COMMAND · `command_defenders`)
1. **원문** `pack_v1:E1435_0113:RELATIONS:L532` (SRC_1435_0118): “김윤수/이진/여성렬/김수연 -> defenders : COMMAND”
   - 원문 주체/객체: 김수연 → defenders
   - 보조 근거 `pack_v1:E1435_0113:WHO:L520`: “unnamed soldiers”
2. **규칙** `R4_group_placeholder` · 객체 R4_group_placeholder
3. **생성된 edge** `JO_KIMSUYEON` → `GRP_1435_YEOYEON_GARRISON` · COMMAND · 시각 1435년 1월 13일 · 확실성 confirmed · 인과 UNKNOWN
- 사람 검토: ☐ 원문과 일치 ☐ 규칙 적용 적절 ☐ 수정 필요 — 메모:

### `E1435_0113#5` — 1435-01 여연성 수비 군사(부상 4·사망 1) → 오량합 기병(1435-01 여연성 포위, 약 2,700기) (MILITARY_CONFLICT · `defend`)
1. **원문** `pack_v1:E1435_0113:RELATIONS:L533` (SRC_1435_0118): “defenders -> Oryanghap : DEFENSE”
   - 원문 주체/객체: defenders → Oryanghap
   - 보조 근거 `pack_v1:E1435_0113:WHO:L519`: “Oryanghap force c. 2,700”
2. **규칙** `R4_group_placeholder` · 주체 R4_group_placeholder · 객체 R4_group_placeholder
3. **생성된 edge** `GRP_1435_YEOYEON_GARRISON` → `GRP_ORYANGHAP_1435` · MILITARY_CONFLICT · 시각 1435년 1월 13일 · 확실성 confirmed · 인과 UNKNOWN
- 사람 검토: ☐ 원문과 일치 ☐ 규칙 적용 적절 ☐ 수정 필요 — 메모:

### `E1435_0408#0` — 함길도 도절제사(실명 미기재) → 세종 (REPORT · `settler_condition_report`)
1. **원문** `pack_v1:E1435_0408:RELATIONS:L569` (SRC_1435_0408): “field command -> court : REPORT”
   - 원문 주체/객체: field command → court
   - 보조 근거 `pack_v1:E1435_0408:WHAT:L564`: “Hamgil provincial commander reports problems of settlers,”
2. **규칙** `R5_content_actor` + `R1_court_recipient` · 주체 R5_content_actor · 객체 R1_court_recipient
3. **생성된 edge** `ORG_HAMGIL_DOJEOLJESA` → `JO_SEJONG` · REPORT · 시각 1435년 4월 8일 · 확실성 confirmed · 인과 UNKNOWN
- 사람 검토: ☐ 원문과 일치 ☐ 규칙 적용 적절 ☐ 수정 필요 — 메모:

### `E1435_0408#1` — 조선 국가·조정(주체·수신자 미특정) → 1435 함길도 북방(길주 이북·회령·경원) 신 입거민 (RESETTLEMENT · `settler_agricultural_policy`)
1. **원문** `pack_v1:E1435_0408:RELATIONS:L570` (SRC_1435_0408): “state -> settlers : RESETTLEMENT / AGRICULTURAL_POLICY”
   - 원문 주체/객체: state → settlers
2. **규칙** `R4_group_placeholder` · 객체 R4_group_placeholder
3. **생성된 edge** `ORG_JOSEON_COURT` → `GRP_1435_NORTHERN_SETTLERS` · RESETTLEMENT · 시각 시점 미상 · 확실성 confirmed · 인과 UNKNOWN
- 사람 검토: ☐ 원문과 일치 ☐ 규칙 적용 적절 ☐ 수정 필요 — 메모:

### `E1435_0719#0` — 조선 국가·조정(주체·수신자 미특정) → 1435 회령에서 분할된 400호(종성) (BORDER_ADMINISTRATION · `partition_households_new_county`)
1. **원문** `pack_v1:E1435_0719:RELATIONS:L585` (SRC_1435_0719): “state -> population : BORDER_ADMINISTRATION / RESETTLEMENT”
   - 원문 주체/객체: state → population
   - 보조 근거 `pack_v1:E1435_0719:WHAT:L580`: “400 Hoeryŏng households separated to establish Jongseong county.”
2. **규칙** `R4_group_placeholder` + `R6_layer_normalize` · 객체 R4_group_placeholder
3. **생성된 edge** `ORG_JOSEON_COURT` → `GRP_1435_HOERYEONG_400HH` · BORDER_ADMINISTRATION · 시각 1435년 7월 19일 · 확실성 confirmed · 인과 UNKNOWN
- 사람 검토: ☐ 원문과 일치 ☐ 규칙 적용 적절 ☐ 수정 필요 — 메모:

### `E1435_0719#1` — 조선 국가·조정(주체·수신자 미특정) → 1435 경원에서 분할된 300호(공성) (BORDER_ADMINISTRATION · `partition_households_new_county`)
1. **원문** `pack_v1:E1435_0719:RELATIONS:L585` (SRC_1435_0719): “state -> population : BORDER_ADMINISTRATION / RESETTLEMENT”
   - 원문 주체/객체: state → population
   - 보조 근거 `pack_v1:E1435_0719:WHAT:L581`: “300 Kyŏngwŏn households separated to establish Gongseong county.”
2. **규칙** `R4_group_placeholder` + `R6_layer_normalize` · 객체 R4_group_placeholder
3. **생성된 edge** `ORG_JOSEON_COURT` → `GRP_1435_GYEONGWON_300HH` · BORDER_ADMINISTRATION · 시각 1435년 7월 19일 · 확실성 confirmed · 인과 UNKNOWN
- 사람 검토: ☐ 원문과 일치 ☐ 규칙 적용 적절 ☐ 수정 필요 — 메모:

### `E1435_0726#0` — 조선 국가·조정(주체·수신자 미특정) → 1435 입거 선정 실무 수령·향리·감고·토호(실명 미기재) (PUNISHMENT · `punish_selection_manipulation`)
1. **원문** `pack_v1:E1435_0726:RELATIONS:L611` (SRC_1435_0726): “state -> local agents : ACCOUNTABILITY / PUNISHMENT”
   - 원문 주체/객체: state → local agents
   - 보조 근거 `pack_v1:E1435_0726:WHO:L596`: “local clerks / inspectors”
   - 보조 근거 `pack_v1:E1435_0726:WHO:L597`: “local elites”
   - 보조 근거 `pack_v1:E1435_0726:WHO:L598`: “magistrates”
2. **규칙** `R4_group_placeholder` + `R6_layer_normalize` · 객체 R4_group_placeholder
3. **생성된 edge** `ORG_JOSEON_COURT` → `GRP_1435_RESETTLE_AGENTS` · PUNISHMENT · 시각 1435년 7월 26일 · 확실성 confirmed · 인과 UNKNOWN
- 사람 검토: ☐ 원문과 일치 ☐ 규칙 적용 적절 ☐ 수정 필요 — 메모:

### `E1435_0726#1` — 조선 국가·조정(주체·수신자 미특정) → 1435 입거 대상 민호(도피·환귀자 포함) (RESETTLEMENT · `coercive_resettlement`)
1. **원문** `pack_v1:E1435_0726:RELATIONS:L612` (SRC_1435_0726): “state -> households : COERCIVE_RESETTLEMENT”
   - 원문 주체/객체: state → households
   - 보조 근거 `pack_v1:E1435_0726:WHO:L599`: “migrant households”
2. **규칙** `R4_group_placeholder` · 객체 R4_group_placeholder
3. **생성된 edge** `ORG_JOSEON_COURT` → `GRP_1435_MIGRANT_HH` · RESETTLEMENT · 시각 1435년 7월 26일 · 확실성 confirmed · 인과 UNKNOWN
- 사람 검토: ☐ 원문과 일치 ☐ 규칙 적용 적절 ☐ 수정 필요 — 메모:

### `E1435_0918#0` — 조선 국가·조정(주체·수신자 미특정) → 김윤수 (REWARD · `promote_one_grade`)
1. **원문** `pack_v1:E1435_0918:RELATIONS:L639` (SRC_1435_0918): “state -> meritorious soldiers : REWARD”
   - 원문 주체/객체: state → meritorious soldiers
   - 구성원 근거 `pack_v1:E1435_0918:WHO:L622`: “김윤수”
2. **규칙** `R3_who_expansion` · 객체 R3_who_expansion
3. **생성된 edge** `ORG_JOSEON_COURT` → `JO_KIMYUNSU` · REWARD · 시각 1435년 9월 18일 · 확실성 confirmed · 인과 EXPLICIT_CAUSAL
- 사람 검토: ☐ 원문과 일치 ☐ 규칙 적용 적절 ☐ 수정 필요 — 메모:

### `E1435_0918#1` — 조선 국가·조정(주체·수신자 미특정) → 장사우 (REWARD · `promote_one_grade`)
1. **원문** `pack_v1:E1435_0918:RELATIONS:L639` (SRC_1435_0918): “state -> meritorious soldiers : REWARD”
   - 원문 주체/객체: state → meritorious soldiers
   - 구성원 근거 `pack_v1:E1435_0918:WHO:L623`: “장사우 張思祐”
2. **규칙** `R3_who_expansion` · 객체 R3_who_expansion
3. **생성된 edge** `ORG_JOSEON_COURT` → `JO_JANGSAU` · REWARD · 시각 1435년 9월 18일 · 확실성 confirmed · 인과 EXPLICIT_CAUSAL
- 사람 검토: ☐ 원문과 일치 ☐ 규칙 적용 적절 ☐ 수정 필요 — 메모:

### `E1435_0918#2` — 조선 국가·조정(주체·수신자 미특정) → 배철 (REWARD · `promote_one_grade`)
1. **원문** `pack_v1:E1435_0918:RELATIONS:L639` (SRC_1435_0918): “state -> meritorious soldiers : REWARD”
   - 원문 주체/객체: state → meritorious soldiers
   - 구성원 근거 `pack_v1:E1435_0918:WHO:L624`: “배철 裵哲”
2. **규칙** `R3_who_expansion` · 객체 R3_who_expansion
3. **생성된 edge** `ORG_JOSEON_COURT` → `JO_BAECHEOL` · REWARD · 시각 1435년 9월 18일 · 확실성 confirmed · 인과 EXPLICIT_CAUSAL
- 사람 검토: ☐ 원문과 일치 ☐ 규칙 적용 적절 ☐ 수정 필요 — 메모:

### `E1435_0918#3` — 조선 국가·조정(주체·수신자 미특정) → 1435 여연 전투 전사자와 유가족 (WELFARE · `posthumous_office_and_aid`)
1. **원문** `pack_v1:E1435_0918:RELATIONS:L640` (SRC_1435_0918): “state -> dead/bereaved : WELFARE / HONOR”
   - 원문 주체/객체: state → dead/bereaved
   - 보조 근거 `pack_v1:E1435_0918:WHO:L625`: “unnamed dead soldiers”
2. **규칙** `R4_group_placeholder` · 객체 R4_group_placeholder
3. **생성된 edge** `ORG_JOSEON_COURT` → `GRP_1435_WARDEAD` · WELFARE · 시각 1435년 9월 18일 · 확실성 confirmed · 인과 UNKNOWN
- 사람 검토: ☐ 원문과 일치 ☐ 규칙 적용 적절 ☐ 수정 필요 — 메모:

### `E1435_0918#4` — 조선 국가·조정(주체·수신자 미특정) → 1435 방비 소홀·소극 군사·감독자(실명 미기재) (PUNISHMENT · `punish_by_law`)
1. **원문** `pack_v1:E1435_0918:RELATIONS:L641` (SRC_1435_0918): “state -> negligent personnel : ACCOUNTABILITY / PUNISHMENT”
   - 원문 주체/객체: state → negligent personnel
   - 보조 근거 `pack_v1:E1435_0918:WHO:L626`: “unnamed negligent soldiers/overseers”
2. **규칙** `R4_group_placeholder` + `R6_layer_normalize` · 객체 R4_group_placeholder
3. **생성된 edge** `ORG_JOSEON_COURT` → `GRP_1435_NEGLIGENT` · PUNISHMENT · 시각 1435년 9월 18일 · 확실성 confirmed · 인과 UNKNOWN
- 사람 검토: ☐ 원문과 일치 ☐ 규칙 적용 적절 ☐ 수정 필요 — 메모:

### `E1436_06L19#0` — 1436 4품 이상 방어 건의자(실명 미기재) → 세종 (POLICY · `submit_anti_incursion_proposals`)
1. **원문** `pack_v1:E1436_0619:RELATIONS:L666` (SRC_1436_06L19): “central officials -> 세종 : POLICY_ADVICE”
   - 원문 주체/객체: central officials → 세종
   - 보조 근거 `pack_v1:E1436_0619:WHO:L653`: “unnamed fourth-rank-and-above proposal writers”
2. **규칙** `R4_group_placeholder` · 주체 R4_group_placeholder
3. **생성된 edge** `GRP_1436_PROPOSERS` → `JO_SEJONG` · POLICY · 시각 1436년 윤6월 19일 이전(정확한 시점 미상) · 확실성 confirmed · 인과 UNKNOWN
- 사람 검토: ☐ 원문과 일치 ☐ 규칙 적용 적절 ☐ 수정 필요 — 메모:

### `E1436_06L19#1` — 세종 → 이천 (POLICY · `transfer_proposals_and_order_review`)
1. **원문** `pack_v1:E1436_0619:RELATIONS:L667` (SRC_1436_06L19): “세종 -> 이천 : POLICY_TRANSFER / COMMAND”
   - 원문 주체/객체: 세종 → 이천
2. **규칙** `R6_layer_normalize`
3. **생성된 edge** `JO_SEJONG` → `JO_LEECHEON` · POLICY · 시각 1436년 윤6월 19일 · 확실성 confirmed · 인과 UNKNOWN
- 사람 검토: ☐ 원문과 일치 ☐ 규칙 적용 적절 ☐ 수정 필요 — 메모:

### `E1436_1101#0` — 김종서 → 세종 (POLICY · `propose_defense_plan`)
1. **원문** `pack_v1:E1436_1101:RELATIONS:L687` (SRC_1436_1101): “김종서 -> court : POLICY_ADVICE”
   - 원문 주체/객체: 김종서 → court
2. **규칙** `R1_court_recipient` · 객체 R1_court_recipient
3. **생성된 edge** `JO_KIMJONGSEO` → `JO_SEJONG` · POLICY · 시각 1436년 11월 1일 · 확실성 confirmed · 인과 UNKNOWN
- 사람 검토: ☐ 원문과 일치 ☐ 규칙 적용 적절 ☐ 수정 필요 — 메모:

### `E1436_1101#1` — 정흠지 → 세종 (POLICY · `propose_defense_plan`)
1. **원문** `pack_v1:E1436_1101:RELATIONS:L688` (SRC_1436_1101): “정흠지 -> court : POLICY_ADVICE”
   - 원문 주체/객체: 정흠지 → court
2. **규칙** `R1_court_recipient` · 객체 R1_court_recipient
3. **생성된 edge** `JO_JEONGHEUMJI` → `JO_SEJONG` · POLICY · 시각 1436년 11월 1일 · 확실성 confirmed · 인과 UNKNOWN
- 사람 검토: ☐ 원문과 일치 ☐ 규칙 적용 적절 ☐ 수정 필요 — 메모:

### `E1436_1127#0` — 세종 → 이징옥 (COMMAND · `instruct_force_with_conciliation`)
1. **원문** `pack_v1:E1436_1127:WHAT:L709` (SRC_1436_1127): “Sejong instructed Yi Jing-ok about combining force with humane treatment.”
   - 원문 주체/객체: Sejong → Yi Jing-ok
   - 보조 근거 `pack_v1:E1436_1127:RELATIONS:L715`: “central -> frontier : COMMAND / DEFENSE_REFORM”
2. **규칙** `R5_content_actor` · 주체 R5_content_actor · 객체 R5_content_actor
3. **생성된 edge** `JO_SEJONG` → `JO_LEEJINGOK` · COMMAND · 시각 1436년 11월 27일 · 확실성 confirmed · 인과 UNKNOWN
- 사람 검토: ☐ 원문과 일치 ☐ 규칙 적용 적절 ☐ 수정 필요 — 메모:

### `E1436_1127#2` — 조선 국가·조정(주체·수신자 미특정) → 1436 자성·강계 등 화포 교습관 (COMMAND · `assign_firearm_training`)
1. **원문** `pack_v1:E1436_1127:RELATIONS:L715` (SRC_1436_1127): “central -> frontier : COMMAND / DEFENSE_REFORM”
   - 원문 주체/객체: central → frontier
   - 보조 근거 `pack_v1:E1436_1127:WHAT:L711`: “Firearms training officials assigned to Jasŏng, Gangye etc.”
2. **규칙** `R4_group_placeholder` + `R6_layer_normalize` · 객체 R4_group_placeholder
3. **생성된 edge** `ORG_JOSEON_COURT` → `GRP_1436_FIREARM_INSTRUCTORS` · COMMAND · 시각 1436년 11월 27일 · 확실성 confirmed · 인과 UNKNOWN
- 사람 검토: ☐ 원문과 일치 ☐ 규칙 적용 적절 ☐ 수정 필요 — 메모:

### `E1436_1127#3` — 김종서 → 세종 (POLICY · `advise_headquarters`)
1. **원문** `pack_v1:E1436_1127:RELATIONS:L716` (SRC_1436_1127): “김종서 -> court : POLICY_ADVICE”
   - 원문 주체/객체: 김종서 → court
2. **규칙** `R1_court_recipient` · 객체 R1_court_recipient
3. **생성된 edge** `JO_KIMJONGSEO` → `JO_SEJONG` · POLICY · 시각 1436년 11월 27일 · 확실성 confirmed · 인과 UNKNOWN
- 사람 검토: ☐ 원문과 일치 ☐ 규칙 적용 적절 ☐ 수정 필요 — 메모:

### `E1436_1127#4` — 정흠지 → 세종 (POLICY · `dissent_headquarters_move`)
1. **원문** `pack_v1:E1436_1127:RELATIONS:L717` (SRC_1436_1127): “정흠지 -> court : POLICY_DISAGREEMENT”
   - 원문 주체/객체: 정흠지 → court
2. **규칙** `R1_court_recipient` · 객체 R1_court_recipient
3. **생성된 edge** `JO_JEONGHEUMJI` → `JO_SEJONG` · POLICY · 시각 1436년 11월 27일 · 확실성 confirmed · 인과 UNKNOWN
- 사람 검토: ☐ 원문과 일치 ☐ 규칙 적용 적절 ☐ 수정 필요 — 메모:

### `E1437_0611#0` — 이천 → 세종 (REPORT · `self_accountability_and_strategy`)
1. **원문** `pack_v1:E1437_0611:RELATIONS:L738` (SRC_1437_0611): “이천 -> 세종 : REPORT / SELF_ACCOUNTABILITY / MILITARY_ADVICE”
   - 원문 주체/객체: 이천 → 세종
2. **규칙** `R6_layer_normalize`
3. **생성된 edge** `JO_LEECHEON` → `JO_SEJONG` · REPORT · 시각 1437년 6월 11일 · 확실성 confirmed · 인과 UNKNOWN
- 사람 검토: ☐ 원문과 일치 ☐ 규칙 적용 적절 ☐ 수정 필요 — 메모:

### `E1437_0820#0` — 최윤덕 → 세종 (POLICY · `defense_advice`)
1. **원문** `pack_v1:E1437_0820:RELATIONS:L759` (SRC_1437_0820): “최윤덕 -> 세종 : DEFENSE_ADVICE”
   - 원문 주체/객체: 최윤덕 → 세종
2. **규칙** `R6_layer_normalize`
3. **생성된 edge** `JO_CHOEYUNDEOK` → `JO_SEJONG` · POLICY · 시각 1437년 8월 20일 · 확실성 confirmed · 인과 UNKNOWN
- 사람 검토: ☐ 원문과 일치 ☐ 규칙 적용 적절 ☐ 수정 필요 — 메모:

### `E1437_0820#1` — 세종 → 함길도 도절제사(실명 미기재) (FORTIFICATION · `order_reinforcement`)
1. **원문** `pack_v1:E1437_0820:RELATIONS:L760` (SRC_1437_0820): “세종 -> frontier commander : COMMAND / FORTIFICATION”
   - 원문 주체/객체: 세종 → frontier commander
   - 구성원 근거 `pack_v1:E1437_0820:WHO:L750`: “함길도 도절제사”
2. **규칙** `R3_who_expansion` + `R6_layer_normalize` · 객체 R3_who_expansion
3. **생성된 edge** `JO_SEJONG` → `ORG_HAMGIL_DOJEOLJESA` · FORTIFICATION · 시각 1437년 8월 20일 · 확실성 confirmed · 인과 UNKNOWN
- 사람 검토: ☐ 원문과 일치 ☐ 규칙 적용 적절 ☐ 수정 필요 — 메모:

### `E1437_0914#0` — 이천 → 이화 (COMMAND · `command_column`)
1. **원문** `pack_v1:E1437_0914:RELATIONS:L789` (SRC_1437_0914): “이천 -> subordinate forces : COMMAND”
   - 원문 주체/객체: 이천 → subordinate forces
   - 구성원 근거 `pack_v1:E1437_0914:WHO / FORCE:L772`: “이화 李樺: 1,818”
2. **규칙** `R3_who_expansion` · 객체 R3_who_expansion
3. **생성된 edge** `JO_LEECHEON` → `JO_LEEHWA` · COMMAND · 시각 1437년 9월 7일 · 확실성 confirmed · 인과 UNKNOWN
- 사람 검토: ☐ 원문과 일치 ☐ 규칙 적용 적절 ☐ 수정 필요 — 메모:

### `E1437_0914#1` — 이천 → 정덕성 (COMMAND · `command_column`)
1. **원문** `pack_v1:E1437_0914:RELATIONS:L789` (SRC_1437_0914): “이천 -> subordinate forces : COMMAND”
   - 원문 주체/객체: 이천 → subordinate forces
   - 구성원 근거 `pack_v1:E1437_0914:WHO / FORCE:L773`: “정덕성 鄭德成: 1,203”
2. **규칙** `R3_who_expansion` · 객체 R3_who_expansion
3. **생성된 edge** `JO_LEECHEON` → `JO_JEONGDEOKSEONG` · COMMAND · 시각 1437년 9월 7일 · 확실성 confirmed · 인과 UNKNOWN
- 사람 검토: ☐ 원문과 일치 ☐ 규칙 적용 적절 ☐ 수정 필요 — 메모:

### `E1437_0914#2` — 이천 → 홍사석(1437 이천 본군) (COMMAND · `command_column`)
1. **원문** `pack_v1:E1437_0914:RELATIONS:L789` (SRC_1437_0914): “이천 -> subordinate forces : COMMAND”
   - 원문 주체/객체: 이천 → subordinate forces
   - 구성원 근거 `pack_v1:E1437_0914:WHO / FORCE:L774`: “홍사석: with Yi Cheon”
2. **규칙** `R3_who_expansion` · 객체 R3_who_expansion
3. **생성된 edge** `JO_LEECHEON` → `JO_HONGSASEOK_1437` · COMMAND · 시각 1437년 9월 7일 · 확실성 confirmed · 인과 UNKNOWN
- 사람 검토: ☐ 원문과 일치 ☐ 규칙 적용 적절 ☐ 수정 필요 — 메모:

### `E1437_0914#3` — 이천 → 이진(1437 이천 본군) (COMMAND · `command_column`)
1. **원문** `pack_v1:E1437_0914:RELATIONS:L789` (SRC_1437_0914): “이천 -> subordinate forces : COMMAND”
   - 원문 주체/객체: 이천 → subordinate forces
   - 구성원 근거 `pack_v1:E1437_0914:WHO / FORCE:L775`: “이진: with Yi Cheon”
2. **규칙** `R3_who_expansion` · 객체 R3_who_expansion
3. **생성된 edge** `JO_LEECHEON` → `JO_LEEJIN_1437` · COMMAND · 시각 1437년 9월 7일 · 확실성 confirmed · 인과 UNKNOWN
- 사람 검토: ☐ 원문과 일치 ☐ 규칙 적용 적절 ☐ 수정 필요 — 메모:

### `E1437_0922#0` — 이천 → 1437 정벌 대상 거주지·무리(세력 미특정) (MILITARY_ACTION · `search_burn_and_fight`)
1. **원문** `pack_v1:E1437_0922:RELATIONS:L820` (SRC_1437_0922): “Joseon armies -> target settlements : MILITARY_ACTION”
   - 원문 주체/객체: Joseon armies → target settlements
   - 구성원 근거 `pack_v1:E1437_0922:WHO:L801`: “이천”
   - 보조 근거 `pack_v1:E1437_0922:WHAT:L809`: “Multiple settlements/farms searched/burned.”
2. **규칙** `R3_who_expansion` + `R4_group_placeholder` · 주체 R3_who_expansion · 객체 R4_group_placeholder
3. **생성된 edge** `JO_LEECHEON` → `GRP_1437_PAJEOGANG_TARGET` · MILITARY_ACTION · 시각 1437년 9월 7일 ~ 1437년 9월 16일 · 확실성 confirmed · 인과 UNKNOWN
- 사람 검토: ☐ 원문과 일치 ☐ 규칙 적용 적절 ☐ 수정 필요 — 메모:

### `E1437_0922#1` — 이화 → 1437 정벌 대상 거주지·무리(세력 미특정) (MILITARY_ACTION · `search_burn_and_fight`)
1. **원문** `pack_v1:E1437_0922:RELATIONS:L820` (SRC_1437_0922): “Joseon armies -> target settlements : MILITARY_ACTION”
   - 원문 주체/객체: Joseon armies → target settlements
   - 구성원 근거 `pack_v1:E1437_0922:WHO:L802`: “이화”
   - 보조 근거 `pack_v1:E1437_0922:WHAT:L809`: “Multiple settlements/farms searched/burned.”
2. **규칙** `R3_who_expansion` + `R4_group_placeholder` · 주체 R3_who_expansion · 객체 R4_group_placeholder
3. **생성된 edge** `JO_LEEHWA` → `GRP_1437_PAJEOGANG_TARGET` · MILITARY_ACTION · 시각 1437년 9월 7일 ~ 1437년 9월 16일 · 확실성 confirmed · 인과 UNKNOWN
- 사람 검토: ☐ 원문과 일치 ☐ 규칙 적용 적절 ☐ 수정 필요 — 메모:

### `E1437_0922#2` — 정덕성 → 1437 정벌 대상 거주지·무리(세력 미특정) (MILITARY_ACTION · `search_burn_and_fight`)
1. **원문** `pack_v1:E1437_0922:RELATIONS:L820` (SRC_1437_0922): “Joseon armies -> target settlements : MILITARY_ACTION”
   - 원문 주체/객체: Joseon armies → target settlements
   - 구성원 근거 `pack_v1:E1437_0922:WHO:L803`: “정덕성”
   - 보조 근거 `pack_v1:E1437_0922:WHAT:L809`: “Multiple settlements/farms searched/burned.”
2. **규칙** `R3_who_expansion` + `R4_group_placeholder` · 주체 R3_who_expansion · 객체 R4_group_placeholder
3. **생성된 edge** `JO_JEONGDEOKSEONG` → `GRP_1437_PAJEOGANG_TARGET` · MILITARY_ACTION · 시각 1437년 9월 7일 ~ 1437년 9월 16일 · 확실성 confirmed · 인과 UNKNOWN
- 사람 검토: ☐ 원문과 일치 ☐ 규칙 적용 적절 ☐ 수정 필요 — 메모:

### `E1437_0922#4` — 최정안 → 세종 (REPORT · `separate_victory_report`)
1. **원문** `pack_v1:E1437_0922:WHO:L805` (SRC_1437_0922): “최정안 mentioned as separate victory reporter”
   - 원문 주체/객체: 최정안 → (수신자 미기재: 조정)
   - 보조 근거 `pack_v1:E1437_0922:RELATIONS:L821`: “field -> court : VICTORY_REPORT”
2. **규칙** `R5_content_actor` + `R1_court_recipient` · 주체 R5_content_actor · 객체 R1_court_recipient
3. **생성된 edge** `JO_CHOEJEONGAN` → `JO_SEJONG` · REPORT · 시각 1437년 9월 22일 · 확실성 confirmed · 인과 UNKNOWN
- ⚑ 검토 표시: RECIPIENT_IMPLICIT
- 사람 검토: ☐ 원문과 일치 ☐ 규칙 적용 적절 ☐ 수정 필요 — 메모:

### `E1438_0729#1` — 김종서 → 세종 (REPORT · `hoegye_intelligence_assessment`)
1. **원문** `pack_v1:E1438_0729:RELATIONS:L849` (SRC_1438_0729): “김종서 -> 세종 : INTELLIGENCE_REPORT”
   - 원문 주체/객체: 김종서 → 세종
2. **규칙** `R6_layer_normalize`
3. **생성된 edge** `JO_KIMJONGSEO` → `JO_SEJONG` · REPORT · 시각 1438년 7월 29일 · 확실성 confirmed · 인과 UNKNOWN
- 사람 검토: ☐ 원문과 일치 ☐ 규칙 적용 적절 ☐ 수정 필요 — 메모:

### `E1439_0510#1` — 김종서 → 거을가개의 자손·관련자 (DIPLOMACY · `deescalate_false_rumor`)
1. **원문** `pack_v1:E1439_0510:RELATIONS:L877` (SRC_1439_0510): “김종서 -> Jurchen actors : DIPLOMATIC_DEESCALATION”
   - 원문 주체/객체: 김종서 → Jurchen actors
   - 보조 근거 `pack_v1:E1439_0510:WHAT:L867`: “His descendants and associates reportedly considered retaliation.”
2. **규칙** `R4_group_placeholder` · 객체 R4_group_placeholder
3. **생성된 edge** `JO_KIMJONGSEO` → `GRP_1439_GEOEUL_KIN` · DIPLOMACY · 시각 1439년 5월 10일 이전(정확한 시점 미상) · 확실성 confirmed · 인과 UNKNOWN
- 사람 검토: ☐ 원문과 일치 ☐ 규칙 적용 적절 ☐ 수정 필요 — 메모:

### `E1439_0510#2` — 김종서 → 세종 (REPORT · `chigye`)
1. **원문** `pack_v1:E1439_0510:RELATIONS:L878` (SRC_1439_0510): “김종서 -> court : REPORT”
   - 원문 주체/객체: 김종서 → court
2. **규칙** `R1_court_recipient` · 객체 R1_court_recipient
3. **생성된 edge** `JO_KIMJONGSEO` → `JO_SEJONG` · REPORT · 시각 1439년 5월 10일 · 확실성 confirmed · 인과 UNKNOWN
- 사람 검토: ☐ 원문과 일치 ☐ 규칙 적용 적절 ☐ 수정 필요 — 메모:

### `E1439_0617#0` — 나읍대 → 조선 국가·조정(주체·수신자 미특정) (INTELLIGENCE · `warn_of_planned_raid`)
1. **원문** `pack_v1:E1439_0617:RELATIONS:L903` (SRC_1439_0617): “Jurchen informants -> Joseon : INTELLIGENCE”
   - 원문 주체/객체: Jurchen informants → Joseon
   - 구성원 근거 `pack_v1:E1439_0617:WHO:L890`: “나읍대 羅邑大”
2. **규칙** `R3_who_expansion` · 주체 R3_who_expansion
3. **생성된 edge** `JZ_NAEUPDAE` → `ORG_JOSEON_COURT` · INTELLIGENCE · 시각 1439년 6월 17일 이전(정확한 시점 미상) · 확실성 confirmed · 인과 UNKNOWN
- 사람 검토: ☐ 원문과 일치 ☐ 규칙 적용 적절 ☐ 수정 필요 — 메모:

### `E1439_0617#1` — 마기 → 조선 국가·조정(주체·수신자 미특정) (INTELLIGENCE · `warn_of_planned_raid`)
1. **원문** `pack_v1:E1439_0617:RELATIONS:L903` (SRC_1439_0617): “Jurchen informants -> Joseon : INTELLIGENCE”
   - 원문 주체/객체: Jurchen informants → Joseon
   - 구성원 근거 `pack_v1:E1439_0617:WHO:L891`: “마기 麽氣”
2. **규칙** `R3_who_expansion` · 주체 R3_who_expansion
3. **생성된 edge** `JZ_MAGI` → `ORG_JOSEON_COURT` · INTELLIGENCE · 시각 1439년 6월 17일 이전(정확한 시점 미상) · 확실성 confirmed · 인과 UNKNOWN
- 사람 검토: ☐ 원문과 일치 ☐ 규칙 적용 적절 ☐ 수정 필요 — 메모:

### `E1439_0617#2` — 야오시 → 조선 국가·조정(주체·수신자 미특정) (INTELLIGENCE · `warn_of_planned_raid`)
1. **원문** `pack_v1:E1439_0617:RELATIONS:L903` (SRC_1439_0617): “Jurchen informants -> Joseon : INTELLIGENCE”
   - 원문 주체/객체: Jurchen informants → Joseon
   - 구성원 근거 `pack_v1:E1439_0617:WHO:L892`: “야오시 耶吾時”
2. **규칙** `R3_who_expansion` · 주체 R3_who_expansion
3. **생성된 edge** `JZ_YAOSI` → `ORG_JOSEON_COURT` · INTELLIGENCE · 시각 1439년 6월 17일 이전(정확한 시점 미상) · 확실성 confirmed · 인과 UNKNOWN
- 사람 검토: ☐ 원문과 일치 ☐ 규칙 적용 적절 ☐ 수정 필요 — 메모:

### `E1439_0617#3` — 라라토 → 조선 국가·조정(주체·수신자 미특정) (INTELLIGENCE · `warn_of_planned_raid`)
1. **원문** `pack_v1:E1439_0617:RELATIONS:L903` (SRC_1439_0617): “Jurchen informants -> Joseon : INTELLIGENCE”
   - 원문 주체/객체: Jurchen informants → Joseon
   - 구성원 근거 `pack_v1:E1439_0617:WHO:L893`: “라라토”
2. **규칙** `R3_who_expansion` · 주체 R3_who_expansion
3. **생성된 edge** `JZ_RARATO` → `ORG_JOSEON_COURT` · INTELLIGENCE · 시각 1439년 6월 17일 이전(정확한 시점 미상) · 확실성 confirmed · 인과 UNKNOWN
- 사람 검토: ☐ 원문과 일치 ☐ 규칙 적용 적절 ☐ 수정 필요 — 메모:

### `E1439_0617#4` — 타롱합마홀 → 조선 국가·조정(주체·수신자 미특정) (INTELLIGENCE · `warn_of_planned_raid`)
1. **원문** `pack_v1:E1439_0617:RELATIONS:L903` (SRC_1439_0617): “Jurchen informants -> Joseon : INTELLIGENCE”
   - 원문 주체/객체: Jurchen informants → Joseon
   - 구성원 근거 `pack_v1:E1439_0617:WHO:L894`: “타롱합마홀”
2. **규칙** `R3_who_expansion` · 주체 R3_who_expansion
3. **생성된 edge** `JZ_TARONGHAPMAHOL` → `ORG_JOSEON_COURT` · INTELLIGENCE · 시각 1439년 6월 17일 이전(정확한 시점 미상) · 확실성 confirmed · 인과 UNKNOWN
- 사람 검토: ☐ 원문과 일치 ☐ 규칙 적용 적절 ☐ 수정 필요 — 메모:

### `E1439_0617#5` — 단아롱합 → 조선 국가·조정(주체·수신자 미특정) (INTELLIGENCE · `warn_of_planned_raid`)
1. **원문** `pack_v1:E1439_0617:RELATIONS:L903` (SRC_1439_0617): “Jurchen informants -> Joseon : INTELLIGENCE”
   - 원문 주체/객체: Jurchen informants → Joseon
   - 구성원 근거 `pack_v1:E1439_0617:WHO:L895`: “단아롱합”
2. **규칙** `R3_who_expansion` · 주체 R3_who_expansion
3. **생성된 edge** `JZ_DANARONGHAP` → `ORG_JOSEON_COURT` · INTELLIGENCE · 시각 1439년 6월 17일 이전(정확한 시점 미상) · 확실성 confirmed · 인과 UNKNOWN
- 사람 검토: ☐ 원문과 일치 ☐ 규칙 적용 적절 ☐ 수정 필요 — 메모:

### `E1439_0617#6` — 세종 → 김종서 (POLICY · `instruction`)
1. **원문** `pack_v1:E1439_0617:RELATIONS:L904` (SRC_1439_0617): “세종 -> 김종서 : POLICY / INSTRUCTION”
   - 원문 주체/객체: 세종 → 김종서
2. **규칙** `R6_layer_normalize`
3. **생성된 edge** `JO_SEJONG` → `JO_KIMJONGSEO` · POLICY · 시각 1439년 6월 17일 · 확실성 confirmed · 인과 UNKNOWN
- 사람 검토: ☐ 원문과 일치 ☐ 규칙 적용 적절 ☐ 수정 필요 — 메모:

### `E1440_0407#0` — 김종서 → 동자음파 (DIPLOMACY · `manage_flight_anxiety`)
1. **원문** `pack_v1:E1440_0407:RELATIONS:L956` (SRC_1440_0407): “김종서 -> groups : DIPLOMATIC_MANAGEMENT”
   - 원문 주체/객체: 김종서 → groups
   - 구성원 근거 `pack_v1:E1440_0407:WHO:L944`: “동자음파”
2. **규칙** `R3_who_expansion` · 객체 R3_who_expansion
3. **생성된 edge** `JO_KIMJONGSEO` → `JZ_DONGJAEUMPA` · DIPLOMACY · 시각 1440년 4월 7일 이전(정확한 시점 미상) · 확실성 confirmed · 인과 UNKNOWN
- 사람 검토: ☐ 원문과 일치 ☐ 규칙 적용 적절 ☐ 수정 필요 — 메모:

### `E1440_0407#1` — 김종서 → 동창 (DIPLOMACY · `manage_flight_anxiety`)
1. **원문** `pack_v1:E1440_0407:RELATIONS:L956` (SRC_1440_0407): “김종서 -> groups : DIPLOMATIC_MANAGEMENT”
   - 원문 주체/객체: 김종서 → groups
   - 구성원 근거 `pack_v1:E1440_0407:WHO:L945`: “동창”
2. **규칙** `R3_who_expansion` · 객체 R3_who_expansion
3. **생성된 edge** `JO_KIMJONGSEO` → `JZ_DONGCHANG` · DIPLOMACY · 시각 1440년 4월 7일 이전(정확한 시점 미상) · 확실성 confirmed · 인과 UNKNOWN
- 사람 검토: ☐ 원문과 일치 ☐ 규칙 적용 적절 ☐ 수정 필요 — 메모:

### `E1440_0407#2` — 김종서 → 범찰 (DIPLOMACY · `manage_flight_anxiety`)
1. **원문** `pack_v1:E1440_0407:RELATIONS:L956` (SRC_1440_0407): “김종서 -> groups : DIPLOMATIC_MANAGEMENT”
   - 원문 주체/객체: 김종서 → groups
   - 구성원 근거 `pack_v1:E1440_0407:WHO:L946`: “범찰”
2. **규칙** `R3_who_expansion` · 객체 R3_who_expansion
3. **생성된 edge** `JO_KIMJONGSEO` → `JZ_FANCHA` · DIPLOMACY · 시각 1440년 4월 7일 이전(정확한 시점 미상) · 확실성 confirmed · 인과 UNKNOWN
- 사람 검토: ☐ 원문과 일치 ☐ 규칙 적용 적절 ☐ 수정 필요 — 메모:

### `E1440_0407#3` — 김종서 → 세종 (REPORT · `situation_report`)
1. **원문** `pack_v1:E1440_0407:RELATIONS:L957` (SRC_1440_0407): “김종서 -> central : REPORT”
   - 원문 주체/객체: 김종서 → central
2. **규칙** `R1_court_recipient` · 객체 R1_court_recipient
3. **생성된 edge** `JO_KIMJONGSEO` → `JO_SEJONG` · REPORT · 시각 1440년 4월 7일 · 확실성 confirmed · 인과 UNKNOWN
- 사람 검토: ☐ 원문과 일치 ☐ 규칙 적용 적절 ☐ 수정 필요 — 메모:

### `E1440_1126#0` — 함길도 감사·도절제사 등 도 관아(구분·실명 미기재) → 세종 (FORTIFICATION · `defense_planning_report`)
1. **원문** `pack_v1:E1440_1126:RELATIONS:L974` (SRC_1440_1126): “field administration -> court : DEFENSE_PLANNING”
   - 원문 주체/객체: field administration → court
   - 보조 근거 `pack_v1:E1440_1126:WHAT:L967`: “Hamgil governor/commander assesses relocation of forts and new settlements.”
2. **규칙** `R5_content_actor` + `R1_court_recipient` + `R6_layer_normalize` · 주체 R5_content_actor · 객체 R1_court_recipient
3. **생성된 edge** `ORG_HAMGIL_FIELD` → `JO_SEJONG` · FORTIFICATION · 시각 1440년 11월 26일 · 확실성 confirmed · 인과 UNKNOWN
- 사람 검토: ☐ 원문과 일치 ☐ 규칙 적용 적절 ☐ 수정 필요 — 메모:

### `E1441_0129#0` — 조선 국가·조정(주체·수신자 미특정) → 황보인 (COMMAND · `dispatch_inspection_restructure`)
1. **원문** `pack_v1:E1441_0129:RELATIONS:L997` (SRC_1441_0129): “central government -> 황보인 : INSPECTION / COMMAND”
   - 원문 주체/객체: central government → 황보인
2. **규칙** `R6_layer_normalize`
3. **생성된 edge** `ORG_JOSEON_COURT` → `JO_HWANGBOIN` · COMMAND · 시각 1441년 1월 29일 · 확실성 confirmed · 인과 UNKNOWN
- 사람 검토: ☐ 원문과 일치 ☐ 규칙 적용 적절 ☐ 수정 필요 — 메모:

### `E1441_0129#1` — 조선 국가·조정(주체·수신자 미특정) → 1441 남도·경원에서 옮긴 입거민 (RESETTLEMENT · `relocate_settlers`)
1. **원문** `pack_v1:E1441_0129:RELATIONS:L998` (SRC_1441_0129): “state -> frontier : FORTIFICATION / RESETTLEMENT / BORDER_ADMINISTRATION”
   - 원문 주체/객체: state → frontier
   - 보조 근거 `pack_v1:E1441_0129:WHAT:L993`: “settlers from southern provinces and Kyŏngwŏn moved in.”
2. **규칙** `R4_group_placeholder` + `R6_layer_normalize` · 객체 R4_group_placeholder
3. **생성된 edge** `ORG_JOSEON_COURT` → `GRP_1441_SETTLERS` · RESETTLEMENT · 시각 시점 미상 · 확실성 confirmed · 인과 UNKNOWN
- 사람 검토: ☐ 원문과 일치 ☐ 규칙 적용 적절 ☐ 수정 필요 — 메모:

### `E1441_0519#0` — 황보인 → 세종 (FORTIFICATION · `propose_fort_relocation`)
1. **원문** `pack_v1:E1441_0519:RELATIONS:L1015` (SRC_1441_0519): “황보인 -> court : DEFENSE_ADVICE”
   - 원문 주체/객체: 황보인 → court
2. **규칙** `R1_court_recipient` + `R6_layer_normalize` · 객체 R1_court_recipient
3. **생성된 edge** `JO_HWANGBOIN` → `JO_SEJONG` · FORTIFICATION · 시각 1441년 5월 19일 이전(정확한 시점 미상) · 확실성 confirmed · 인과 UNKNOWN
- 사람 검토: ☐ 원문과 일치 ☐ 규칙 적용 적절 ☐ 수정 필요 — 메모:

### `E1442_1022#0` — 명 변경 군사 측 정보원(1442) → 조선 국가·조정(주체·수신자 미특정) (INTELLIGENCE · `warn_possible_raid`)
1. **원문** `pack_v1:E1442_1022:RELATIONS:L1038` (SRC_1442_1022): “external intelligence -> Joseon : INTELLIGENCE”
   - 원문 주체/객체: external intelligence → Joseon
   - 보조 근거 `pack_v1:E1442_1022:WHO:L1030`: “Ming frontier military source”
2. **규칙** `R4_group_placeholder` · 주체 R4_group_placeholder
3. **생성된 edge** `GRP_1442_MING_INTEL` → `ORG_JOSEON_COURT` · INTELLIGENCE · 시각 1442년 10월 22일 이전(정확한 시점 미상) · 확실성 confirmed · 인과 UNKNOWN
- 사람 검토: ☐ 원문과 일치 ☐ 규칙 적용 적절 ☐ 수정 필요 — 메모:

### `E1442_1022#1` — 세종 → 평안도 감사·도절제사(실명 미기재) (COMMAND · `defense_alert_and_crossing_ban`)
1. **원문** `pack_v1:E1442_1022:RELATIONS:L1039` (SRC_1442_1022): “세종 -> frontier commanders : DEFENSE_ORDER / BORDER_CONTROL”
   - 원문 주체/객체: 세종 → frontier commanders
   - 구성원 근거 `pack_v1:E1442_1022:WHO:L1027`: “Pyeongan/Hamgil governors and commanders”
2. **규칙** `R3_who_expansion` · 객체 R3_who_expansion
3. **생성된 edge** `JO_SEJONG` → `ORG_PYEONGAN_FIELD` · COMMAND · 시각 1442년 10월 22일 · 확실성 confirmed · 인과 UNKNOWN
- 사람 검토: ☐ 원문과 일치 ☐ 규칙 적용 적절 ☐ 수정 필요 — 메모:

### `E1442_1022#2` — 세종 → 함길도 감사·도절제사 등 도 관아(구분·실명 미기재) (COMMAND · `defense_alert_and_crossing_ban`)
1. **원문** `pack_v1:E1442_1022:RELATIONS:L1039` (SRC_1442_1022): “세종 -> frontier commanders : DEFENSE_ORDER / BORDER_CONTROL”
   - 원문 주체/객체: 세종 → frontier commanders
   - 구성원 근거 `pack_v1:E1442_1022:WHO:L1027`: “Pyeongan/Hamgil governors and commanders”
2. **규칙** `R3_who_expansion` · 객체 R3_who_expansion
3. **생성된 edge** `JO_SEJONG` → `ORG_HAMGIL_FIELD` · COMMAND · 시각 1442년 10월 22일 · 확실성 confirmed · 인과 UNKNOWN
- 사람 검토: ☐ 원문과 일치 ☐ 규칙 적용 적절 ☐ 수정 필요 — 메모:

### `E1443_1005#1` — 한서룡 → 1443 한서룡 휘하 진보 군사 (COMMAND · `order_garrisons_prepare`)
1. **원문** `pack_v1:E1443_0914_1005:RELATIONS:L1066` (SRC_1443_1005): “한서룡 -> garrisons : COMMAND”
   - 원문 주체/객체: 한서룡 → garrisons
   - 보조 근거 `pack_v1:E1443_0914_1005:WHAT:L1058`: “Han Seo-ryong had garrisons prepare.”
2. **규칙** `R4_group_placeholder` · 객체 R4_group_placeholder
3. **생성된 edge** `JO_HANSEORYONG` → `GRP_1443_GARRISONS` · COMMAND · 시각 1443년 9월 14일 ~ 1443년 10월 5일 · 확실성 confirmed · 인과 UNKNOWN
- 사람 검토: ☐ 원문과 일치 ☐ 규칙 적용 적절 ☐ 수정 필요 — 메모:

### `E1443_1005#3` — 1443 한서룡 휘하 진보 군사 → 우디거 1,000여 기(1443) (MILITARY_CONFLICT · `repel_raid`)
1. **원문** `pack_v1:E1443_0914_1005:RELATIONS:L1068` (SRC_1443_1005): “garrisons -> attackers : DEFENSE”
   - 원문 주체/객체: garrisons → attackers
   - 보조 근거 `pack_v1:E1443_0914_1005:WHO:L1054`: “multiple Udige, c. 1,000+”
2. **규칙** `R4_group_placeholder` · 주체 R4_group_placeholder · 객체 R4_group_placeholder
3. **생성된 edge** `GRP_1443_GARRISONS` → `GRP_1443_UDIGE` · MILITARY_CONFLICT · 시각 1443년 9월 14일 ~ 1443년 10월 5일 · 확실성 confirmed · 인과 UNKNOWN
- 사람 검토: ☐ 원문과 일치 ☐ 규칙 적용 적절 ☐ 수정 필요 — 메모:

### `E1443_1005#4` — 조선 국가·조정(주체·수신자 미특정) → 배마라가 (REWARD · `reward_informant`)
1. **원문** `pack_v1:E1443_0914_1005:RELATIONS:L1067` (SRC_1443_1005): “state -> informants : REWARD”
   - 원문 주체/객체: state → informants
   - 구성원 근거 `pack_v1:E1443_0914_1005:WHO:L1052`: “배마라가 裵磨剌可”
2. **규칙** `R3_who_expansion` · 객체 R3_who_expansion
3. **생성된 edge** `ORG_JOSEON_COURT` → `JZ_BAEMARAGA` · REWARD · 시각 1443년 10월 5일 · 확실성 confirmed · 인과 EXPLICIT_CAUSAL
- 사람 검토: ☐ 원문과 일치 ☐ 규칙 적용 적절 ☐ 수정 필요 — 메모:

### `E1443_1005#5` — 조선 국가·조정(주체·수신자 미특정) → 창고리 (REWARD · `reward_informant`)
1. **원문** `pack_v1:E1443_0914_1005:RELATIONS:L1067` (SRC_1443_1005): “state -> informants : REWARD”
   - 원문 주체/객체: state → informants
   - 구성원 근거 `pack_v1:E1443_0914_1005:WHO:L1053`: “창고리 昌古里”
2. **규칙** `R3_who_expansion` · 객체 R3_who_expansion
3. **생성된 edge** `ORG_JOSEON_COURT` → `JZ_CHANGGORI` · REWARD · 시각 1443년 10월 5일 · 확실성 confirmed · 인과 EXPLICIT_CAUSAL
- 사람 검토: ☐ 원문과 일치 ☐ 규칙 적용 적절 ☐ 수정 필요 — 메모:

### `E1443_1023#0` — 동소로가무 → 세종 (DIPLOMACY · `propose_joint_attack_and_walls`)
1. **원문** `pack_v1:E1443_1023:RELATIONS:L1096` (SRC_1443_1023): “동소로가무 -> court : MILITARY_PROPOSAL”
   - 원문 주체/객체: 동소로가무 → court
2. **규칙** `R1_court_recipient` + `R6_layer_normalize` · 객체 R1_court_recipient
3. **생성된 edge** `JZ_DONGSOROGAMU` → `JO_SEJONG` · DIPLOMACY · 시각 1443년 10월 23일 이전(정확한 시점 미상) · 확실성 confirmed · 인과 UNKNOWN
- 사람 검토: ☐ 원문과 일치 ☐ 규칙 적용 적절 ☐ 수정 필요 — 메모:

### `E1445_0519#0` — 황보인 → 세종 (FORTIFICATION · `propose_signal_system`)
1. **원문** `pack_v1:E1445_0519:RELATIONS:L1116` (SRC_1445_0519): “황보인 -> 세종 : DEFENSE_ADVICE”
   - 원문 주체/객체: 황보인 → 세종
2. **규칙** `R6_layer_normalize`
3. **생성된 edge** `JO_HWANGBOIN` → `JO_SEJONG` · FORTIFICATION · 시각 1445년 5월 19일 · 확실성 confirmed · 인과 UNKNOWN
- 사람 검토: ☐ 원문과 일치 ☐ 규칙 적용 적절 ☐ 수정 필요 — 메모:

### `E1445_0806#0` — 세종 → 평안도 감사·도절제사(실명 미기재) (FORTIFICATION · `defense_reform_order`)
1. **원문** `pack_v1:E1445_0806:RELATIONS:L1137` (SRC_1445_0806): “세종 -> frontier commanders : DEFENSE_REFORM”
   - 원문 주체/객체: 세종 → frontier commanders
   - 구성원 근거 `pack_v1:E1445_0806:WHO:L1128`: “Pyeongan/Hamgil commanders”
2. **규칙** `R3_who_expansion` + `R6_layer_normalize` · 객체 R3_who_expansion
3. **생성된 edge** `JO_SEJONG` → `ORG_PYEONGAN_FIELD` · FORTIFICATION · 시각 1445년 8월 6일 · 확실성 confirmed · 인과 UNKNOWN
- 사람 검토: ☐ 원문과 일치 ☐ 규칙 적용 적절 ☐ 수정 필요 — 메모:

### `E1445_0806#1` — 세종 → 함길도 감사·도절제사 등 도 관아(구분·실명 미기재) (FORTIFICATION · `defense_reform_order`)
1. **원문** `pack_v1:E1445_0806:RELATIONS:L1137` (SRC_1445_0806): “세종 -> frontier commanders : DEFENSE_REFORM”
   - 원문 주체/객체: 세종 → frontier commanders
   - 구성원 근거 `pack_v1:E1445_0806:WHO:L1128`: “Pyeongan/Hamgil commanders”
2. **규칙** `R3_who_expansion` + `R6_layer_normalize` · 객체 R3_who_expansion
3. **생성된 edge** `JO_SEJONG` → `ORG_HAMGIL_FIELD` · FORTIFICATION · 시각 1445년 8월 6일 · 확실성 confirmed · 인과 UNKNOWN
- 사람 검토: ☐ 원문과 일치 ☐ 규칙 적용 적절 ☐ 수정 필요 — 메모:

### `E1445_1027#0` — 세종 → 함길도 도절제사(실명 미기재) (COMMAND · `instruct_odori_policy`)
1. **원문** `pack_v1:E1445_1027:RELATIONS:L1159` (SRC_1445_1027): “세종 -> frontier commander : DIPLOMATIC_POLICY”
   - 원문 주체/객체: 세종 → frontier commander
   - 구성원 근거 `pack_v1:E1445_1027:WHO:L1149`: “함길도 도절제사”
2. **규칙** `R3_who_expansion` + `R6_layer_normalize` · 객체 R3_who_expansion
3. **생성된 edge** `JO_SEJONG` → `ORG_HAMGIL_DOJEOLJESA` · COMMAND · 시각 1445년 10월 27일 · 확실성 confirmed · 인과 UNKNOWN
- 사람 검토: ☐ 원문과 일치 ☐ 규칙 적용 적절 ☐ 수정 필요 — 메모:

### `E1445_1027#1` — 조선 국가·조정(주체·수신자 미특정) → 동소로가무 (DIPLOMACY · `conciliation_and_control`)
1. **원문** `pack_v1:E1445_1027:RELATIONS:L1160` (SRC_1445_1027): “state -> Odori groups : CONCILIATION / CONTROL”
   - 원문 주체/객체: state → Odori groups
   - 구성원 근거 `pack_v1:E1445_1027:WHO:L1150`: “동소로가무 and related groups”
2. **규칙** `R3_who_expansion` · 객체 R3_who_expansion
3. **생성된 edge** `ORG_JOSEON_COURT` → `JZ_DONGSOROGAMU` · DIPLOMACY · 시각 시점 미상 · 확실성 confirmed · 인과 UNKNOWN
- 사람 검토: ☐ 원문과 일치 ☐ 규칙 적용 적절 ☐ 수정 필요 — 메모:

### `E1446_0420#0` — 1446 무창 침입자 50여 명(세력 미특정) → 1446 무창 피살 5·피랍 17명 (MILITARY_CONFLICT · `raid`)
1. **원문** `pack_v1:E1446_0420:RELATIONS:L1183` (SRC_1446_0420): “raiders -> Muchang : MILITARY_ATTACK”
   - 원문 주체/객체: raiders → Muchang
   - 보조 근거 `pack_v1:E1446_0420:WHO:L1172`: “50+ raiders”
   - 보조 근거 `pack_v1:E1446_0420:WHAT:L1175`: “5 people killed”
   - 보조 근거 `pack_v1:E1446_0420:WHAT:L1176`: “17 captured”
2. **규칙** `R4_group_placeholder` · 주체 R4_group_placeholder · 객체 R4_group_placeholder
3. **생성된 edge** `GRP_1446_MUCHANG_RAIDERS` → `GRP_1446_MUCHANG_VICTIMS` · MILITARY_CONFLICT · 시각 1446년 4월 20일 이전(정확한 시점 미상) · 확실성 confirmed · 인과 UNKNOWN
- ⚑ 검토 표시: PLACE_AS_TARGET
- 사람 검토: ☐ 원문과 일치 ☐ 규칙 적용 적절 ☐ 수정 필요 — 메모:

### `E1446_0420#1` — 배찬 → 1446 무창 침입자 50여 명(세력 미특정) (MILITARY_ACTION · `pursue_across_river_failed`)
1. **원문** `pack_v1:E1446_0420:RELATIONS:L1184` (SRC_1446_0420): “배찬 -> raiders : PURSUIT”
   - 원문 주체/객체: 배찬 → raiders
2. **규칙** `R4_group_placeholder` + `R6_layer_normalize` · 객체 R4_group_placeholder
3. **생성된 edge** `JO_BAECHAN` → `GRP_1446_MUCHANG_RAIDERS` · MILITARY_ACTION · 시각 1446년 4월 20일 이전(정확한 시점 미상) · 확실성 confirmed · 인과 UNKNOWN
- 사람 검토: ☐ 원문과 일치 ☐ 규칙 적용 적절 ☐ 수정 필요 — 메모:

### `E1447_0107#0` — 조선 국가·조정(주체·수신자 미특정) → 1447 평안도 축성 부역민(5,740·400) (LABOR_MOBILIZATION · `mobilize_wall_labor`)
1. **원문** `pack_v1:E1447_0107:RELATIONS:L1209` (SRC_1447_0107): “state -> population : LABOR_MOBILIZATION”
   - 원문 주체/객체: state → population
   - 보조 근거 `pack_v1:E1447_0107:WHO:L1200`: “Pyeongan labor population”
2. **규칙** `R4_group_placeholder` · 객체 R4_group_placeholder
3. **생성된 edge** `ORG_JOSEON_COURT` → `GRP_1447_PYEONGAN_LABOR` · LABOR_MOBILIZATION · 시각 1447년 2월 15일 ~ 1447년 3월 15일 · 확실성 confirmed · 인과 UNKNOWN
- 사람 검토: ☐ 원문과 일치 ☐ 규칙 적용 적절 ☐ 수정 필요 — 메모:

### `E1447_04L10#0` — 황보인 → 세종 (REPORT · `policy_report`)
1. **원문** `pack_v1:E1447_LUNAR4_10:RELATIONS:L1237` (SRC_1447_04L10): “황보인 -> court : POLICY_REPORT”
   - 원문 주체/객체: 황보인 → court
2. **규칙** `R1_court_recipient` · 객체 R1_court_recipient
3. **생성된 edge** `JO_HWANGBOIN` → `JO_SEJONG` · REPORT · 시각 1447년 윤4월 10일 · 확실성 confirmed · 인과 UNKNOWN
- 사람 검토: ☐ 원문과 일치 ☐ 규칙 적용 적절 ☐ 수정 필요 — 메모:

### `E1447_0708#0` — 조선 국가·조정(주체·수신자 미특정) → 1447 함길도 축성 부역민 8,526 (LABOR_MOBILIZATION · `mobilize_wall_labor`)
1. **원문** `pack_v1:E1447_0708:RELATIONS:L1257` (SRC_1447_0708): “state -> civilian labor : LABOR_MOBILIZATION”
   - 원문 주체/객체: state → civilian labor
   - 보조 근거 `pack_v1:E1447_0708:WHO:L1249`: “8,526 Hamgil people”
2. **규칙** `R4_group_placeholder` · 객체 R4_group_placeholder
3. **생성된 edge** `ORG_JOSEON_COURT` → `GRP_1447_HAMGIL_LABOR` · LABOR_MOBILIZATION · 시각 1447년 7월 8일 이전(정확한 시점 미상) · 확실성 confirmed · 인과 UNKNOWN
- 사람 검토: ☐ 원문과 일치 ☐ 규칙 적용 적절 ☐ 수정 필요 — 메모:

### `E1447_0708#1` — 조선 국가·조정(주체·수신자 미특정) → 1447 갑산·삼수 부역민 1,000 (LABOR_MOBILIZATION · `mobilize_wall_labor`)
1. **원문** `pack_v1:E1447_0708:RELATIONS:L1257` (SRC_1447_0708): “state -> civilian labor : LABOR_MOBILIZATION”
   - 원문 주체/객체: state → civilian labor
   - 보조 근거 `pack_v1:E1447_0708:WHO:L1250`: “1,000 Kapsan/Samsu people”
2. **규칙** `R4_group_placeholder` · 객체 R4_group_placeholder
3. **생성된 edge** `ORG_JOSEON_COURT` → `GRP_1447_GAPSAN_SAMSU_LABOR` · LABOR_MOBILIZATION · 시각 1447년 7월 8일 이전(정확한 시점 미상) · 확실성 confirmed · 인과 UNKNOWN
- 사람 검토: ☐ 원문과 일치 ☐ 규칙 적용 적절 ☐ 수정 필요 — 메모:

### `E1448_0307#0` — 세종 → 하연 (POLICY · `policy_query`)
1. **원문** `pack_v1:E1448_0307:RELATIONS:L1283` (SRC_1448_0307): “세종 -> senior ministers : POLICY_QUERY”
   - 원문 주체/객체: 세종 → senior ministers
   - 구성원 근거 `pack_v1:E1448_0307:WHO:L1269`: “하연 河演”
2. **규칙** `R3_who_expansion` · 객체 R3_who_expansion
3. **생성된 edge** `JO_SEJONG` → `JO_HAYEON` · POLICY · 시각 1448년 3월 7일 · 확실성 confirmed · 인과 UNKNOWN
- 사람 검토: ☐ 원문과 일치 ☐ 규칙 적용 적절 ☐ 수정 필요 — 메모:

### `E1448_0307#1` — 세종 → 황보인 (POLICY · `policy_query`)
1. **원문** `pack_v1:E1448_0307:RELATIONS:L1283` (SRC_1448_0307): “세종 -> senior ministers : POLICY_QUERY”
   - 원문 주체/객체: 세종 → senior ministers
   - 구성원 근거 `pack_v1:E1448_0307:WHO:L1270`: “황보인”
2. **규칙** `R3_who_expansion` · 객체 R3_who_expansion
3. **생성된 edge** `JO_SEJONG` → `JO_HWANGBOIN` · POLICY · 시각 1448년 3월 7일 · 확실성 confirmed · 인과 UNKNOWN
- 사람 검토: ☐ 원문과 일치 ☐ 규칙 적용 적절 ☐ 수정 필요 — 메모:

### `E1448_0307#2` — 세종 → 박종우 (POLICY · `policy_query`)
1. **원문** `pack_v1:E1448_0307:RELATIONS:L1283` (SRC_1448_0307): “세종 -> senior ministers : POLICY_QUERY”
   - 원문 주체/객체: 세종 → senior ministers
   - 구성원 근거 `pack_v1:E1448_0307:WHO:L1271`: “박종우”
2. **규칙** `R3_who_expansion` · 객체 R3_who_expansion
3. **생성된 edge** `JO_SEJONG` → `JO_PARKJONGU` · POLICY · 시각 1448년 3월 7일 · 확실성 confirmed · 인과 UNKNOWN
- 사람 검토: ☐ 원문과 일치 ☐ 규칙 적용 적절 ☐ 수정 필요 — 메모:

### `E1448_0307#3` — 세종 → 김종서 (POLICY · `policy_query`)
1. **원문** `pack_v1:E1448_0307:RELATIONS:L1283` (SRC_1448_0307): “세종 -> senior ministers : POLICY_QUERY”
   - 원문 주체/객체: 세종 → senior ministers
   - 구성원 근거 `pack_v1:E1448_0307:WHO:L1272`: “김종서”
2. **규칙** `R3_who_expansion` · 객체 R3_who_expansion
3. **생성된 edge** `JO_SEJONG` → `JO_KIMJONGSEO` · POLICY · 시각 1448년 3월 7일 · 확실성 confirmed · 인과 UNKNOWN
- 사람 검토: ☐ 원문과 일치 ☐ 규칙 적용 적절 ☐ 수정 필요 — 메모:

### `E1448_0307#4` — 세종 → 정분 (POLICY · `policy_query`)
1. **원문** `pack_v1:E1448_0307:RELATIONS:L1283` (SRC_1448_0307): “세종 -> senior ministers : POLICY_QUERY”
   - 원문 주체/객체: 세종 → senior ministers
   - 구성원 근거 `pack_v1:E1448_0307:WHO:L1273`: “정분”
2. **규칙** `R3_who_expansion` · 객체 R3_who_expansion
3. **생성된 edge** `JO_SEJONG` → `JO_JEONGBUN` · POLICY · 시각 1448년 3월 7일 · 확실성 confirmed · 인과 UNKNOWN
- 사람 검토: ☐ 원문과 일치 ☐ 규칙 적용 적절 ☐ 수정 필요 — 메모:

### `E1448_0307#5` — 세종 → 정갑손 (POLICY · `policy_query`)
1. **원문** `pack_v1:E1448_0307:RELATIONS:L1283` (SRC_1448_0307): “세종 -> senior ministers : POLICY_QUERY”
   - 원문 주체/객체: 세종 → senior ministers
   - 구성원 근거 `pack_v1:E1448_0307:WHO:L1274`: “정갑손”
2. **규칙** `R3_who_expansion` · 객체 R3_who_expansion
3. **생성된 edge** `JO_SEJONG` → `JO_JEONGGAPSON` · POLICY · 시각 1448년 3월 7일 · 확실성 confirmed · 인과 UNKNOWN
- 사람 검토: ☐ 원문과 일치 ☐ 규칙 적용 적절 ☐ 수정 필요 — 메모:

### `E1448_0307#6` — 하연 → 세종 (POLICY · `advise_town_walls_first`)
1. **원문** `pack_v1:E1448_0307:WHAT:L1279` (SRC_1448_0307): “Ha Yeon, Park Jong-u, Kim Jong-seo and Jeong Bun argued for”
   - 원문 주체/객체: Ha Yeon → (협의 소집자 세종)
   - 보조 근거 `pack_v1:E1448_0307:RELATIONS:L1284`: “ministers -> 세종 : DEFENSE_ADVICE”
2. **규칙** `R5_content_actor` · 주체 R5_content_actor
3. **생성된 edge** `JO_HAYEON` → `JO_SEJONG` · POLICY · 시각 1448년 3월 7일 · 확실성 confirmed · 인과 UNKNOWN
- ⚑ 검토 표시: RECIPIENT_FROM_ENTRY_RELATION
- 사람 검토: ☐ 원문과 일치 ☐ 규칙 적용 적절 ☐ 수정 필요 — 메모:

### `E1448_0307#7` — 박종우 → 세종 (POLICY · `advise_town_walls_first`)
1. **원문** `pack_v1:E1448_0307:WHAT:L1279` (SRC_1448_0307): “Ha Yeon, Park Jong-u, Kim Jong-seo and Jeong Bun argued for”
   - 원문 주체/객체: Park Jong-u → (협의 소집자 세종)
   - 보조 근거 `pack_v1:E1448_0307:RELATIONS:L1284`: “ministers -> 세종 : DEFENSE_ADVICE”
2. **규칙** `R5_content_actor` · 주체 R5_content_actor
3. **생성된 edge** `JO_PARKJONGU` → `JO_SEJONG` · POLICY · 시각 1448년 3월 7일 · 확실성 confirmed · 인과 UNKNOWN
- ⚑ 검토 표시: RECIPIENT_FROM_ENTRY_RELATION
- 사람 검토: ☐ 원문과 일치 ☐ 규칙 적용 적절 ☐ 수정 필요 — 메모:

### `E1448_0307#8` — 김종서 → 세종 (POLICY · `advise_town_walls_first`)
1. **원문** `pack_v1:E1448_0307:WHAT:L1279` (SRC_1448_0307): “Ha Yeon, Park Jong-u, Kim Jong-seo and Jeong Bun argued for”
   - 원문 주체/객체: Kim Jong-seo → (협의 소집자 세종)
   - 보조 근거 `pack_v1:E1448_0307:RELATIONS:L1284`: “ministers -> 세종 : DEFENSE_ADVICE”
2. **규칙** `R5_content_actor` · 주체 R5_content_actor
3. **생성된 edge** `JO_KIMJONGSEO` → `JO_SEJONG` · POLICY · 시각 1448년 3월 7일 · 확실성 confirmed · 인과 UNKNOWN
- ⚑ 검토 표시: RECIPIENT_FROM_ENTRY_RELATION
- 사람 검토: ☐ 원문과 일치 ☐ 규칙 적용 적절 ☐ 수정 필요 — 메모:

### `E1448_0307#9` — 정분 → 세종 (POLICY · `advise_town_walls_first`)
1. **원문** `pack_v1:E1448_0307:WHAT:L1279` (SRC_1448_0307): “Ha Yeon, Park Jong-u, Kim Jong-seo and Jeong Bun argued for”
   - 원문 주체/객체: Jeong Bun → (협의 소집자 세종)
   - 보조 근거 `pack_v1:E1448_0307:RELATIONS:L1284`: “ministers -> 세종 : DEFENSE_ADVICE”
2. **규칙** `R5_content_actor` · 주체 R5_content_actor
3. **생성된 edge** `JO_JEONGBUN` → `JO_SEJONG` · POLICY · 시각 1448년 3월 7일 · 확실성 confirmed · 인과 UNKNOWN
- ⚑ 검토 표시: RECIPIENT_FROM_ENTRY_RELATION
- 사람 검토: ☐ 원문과 일치 ☐ 규칙 적용 적절 ☐ 수정 필요 — 메모:

## DIRECT 관계(참고 — 규칙 없이 원문 RELATIONS 줄 그대로)

| relation | 원문 | edge |
|---|---|---|
| `E1432_1211#8` | `pack_v1:E1432_1211:RELATIONS:L99` “이천 -> 세종 : POLICY_ADVICE” | 이천 → 세종 (POLICY) |
| `E1432_1211#9` | `pack_v1:E1432_1211:RELATIONS:L101` “최해산 -> 세종 : MILITARY_TECH_ADVICE” | 최해산 → 세종 (POLICY) |
| `E1432_1211#11` | `pack_v1:E1432_1211:RELATIONS:L100` “최윤덕 -> 세종 : POLICY_ADVICE” | 최윤덕 → 세종 (POLICY) |
| `E1432_1221#1` | `pack_v1:E1432_1221:RELATIONS:L143` “이만주 -> 조선 : COUNTER_CLAIM” | 이만주 → 조선 국가·조정(주체·수신자 미특정) (COUNTER_CLAIM) |
| `E1433_0226#0` | `pack_v1:E1433_0226:RELATIONS:L199` “세종 -> 최윤덕 : COMMAND_DESIGN” | 세종 → 최윤덕 (COMMAND) |
| `E1433_0226#1` | `pack_v1:E1433_0226:RELATIONS:L200` “이순몽 -> 세종 : POLICY_DISAGREEMENT” | 이순몽 → 세종 (POLICY) |
| `E1433_0307#2` | `pack_v1:E1433_0307:RELATIONS:L222` “최윤덕 -> 세종 : MILITARY_ADVICE” | 최윤덕 → 세종 (POLICY) |
| `E1433_0325#0` | `pack_v1:E1433_0325:RELATIONS:L246` “세종 -> 최윤덕 : COMMAND” | 세종 → 최윤덕 (COMMAND) |
| `E1433_0325#1` | `pack_v1:E1433_0325:RELATIONS:L247` “세종 -> 맹가첩목아 : CONDITIONAL_TARGET_STATUS” | 세종 → 맹가첩목아 (POLICY) |
| `E1433_0610#3` | `pack_v1:E1433_0610:RELATIONS:L410` “지함 -> 세종 : REPORT” | 지함 → 세종 (REPORT) |
| `E1433_08L10#0` | `pack_v1:E1433_0810:RELATIONS:L442` “선덕제 -> 조선 : MEDIATION / IMPERIAL_ORDER” | 선덕제 → 조선 국가·조정(주체·수신자 미특정) (DIPLOMACY) |
| `E1434_0803#1` | `pack_v1:E1434_0803:RELATIONS:L478` “최윤덕 -> 세종 : POLICY_ADVICE” | 최윤덕 → 세종 (POLICY) |
| `E1434_0803#2` | `pack_v1:E1434_0803:RELATIONS:L479` “안숭선 -> 세종 : POLICY_ADVICE” | 안숭선 → 세종 (POLICY) |
| `E1438_0729#0` | `pack_v1:E1438_0729:RELATIONS:L848` “세종 -> 김종서 : INTELLIGENCE_REQUEST” | 세종 → 김종서 (INTELLIGENCE) |
| `E1439_0510#0` | `pack_v1:E1439_0510:RELATIONS:L876` “도을온 -> 김종서 : INTELLIGENCE” | 도을온 → 김종서 (INTELLIGENCE) |
| `E1440_0117#0` | `pack_v1:E1440_0117:RELATIONS:L933` “사헌부 -> 김종서 : ACCOUNTABILITY” | 사헌부 → 김종서 (ACCOUNTABILITY) |
| `E1440_0117#1` | `pack_v1:E1440_0117:RELATIONS:L932` “김종서 -> 세종 : SELF_DEFENSE / REPORT” | 김종서 → 세종 (REPORT) |
| `E1443_1005#0` | `pack_v1:E1443_0914_1005:RELATIONS:L1064` “배마라가 -> Joseon : INTELLIGENCE” | 배마라가 → 조선 국가·조정(주체·수신자 미특정) (INTELLIGENCE) |
| `E1443_1005#2` | `pack_v1:E1443_0914_1005:RELATIONS:L1065` “창고리 -> Joseon : INTELLIGENCE” | 창고리 → 조선 국가·조정(주체·수신자 미특정) (INTELLIGENCE) |
| `E1443_1023#1` | `pack_v1:E1443_1023:RELATIONS:L1097` “court -> 동소로가무 : LIMITED_ACCEPTANCE / NON_ESCALATION” | 조선 국가·조정(주체·수신자 미특정) → 동소로가무 (DIPLOMACY) |
