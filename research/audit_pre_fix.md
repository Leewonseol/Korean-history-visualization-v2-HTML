# READ-ONLY DATA AUDIT (수정 전 상태)

- 대상 커밋: `c1dc072` (pack v1 통합 직후)
- 방법: 데이터 모듈을 읽기 전용으로 import해 레코드를 전수 출력한 뒤, pack v1 원문 텍스트(사용자 제공)와 한 줄씩 대조
- 원칙: 새 사건·인물·관계를 추가하지 않는다. 외부 사이트(sillok 등)는 접근 불가, 일반지식으로 보충하지 않는다.
- 이 문서는 **수정 전** 상태의 기록이다. 수정 결과는 `research/audit_post_fix.md`.

## 요약 수치 (수정 전)

| 항목 | 값 |
|---|---|
| EVENT | 70 (pack_v1 표시 54 · inherited_v2 15 · seed 1) |
| RELATION | 242 (pack_v1 표시 198 · inherited_v2 표시 43 · seed 1) |
| 그중 pack_v1로 **잘못** 표시된 v2 관계 | 3 (`E1433_0419#0~#2`) |
| certainty=interpretation인데 기본 분석에 포함 | 5 |
| causalStatus 미기재 → 코드가 `explicit`로 기본 채움 | 237 / 242 |
| causedBy 링크 | 26 (그중 `sequence_only` 13, pack 근거 없는 explicit/strongly_implied 다수) |
| undirected 관계 | 13 (모두 `E1432_1221`, pack "세종 <-> 대신들") |
| PERSON_STATE | 28 (confirmed인데 v2 사료만 근거 4, pack 사료를 인용했지만 관직명은 v2 3) |
| PLACE parentPlaceId | 20 (pack 근거 있는 것 3) |
| 편집자 지식으로 넣은 한자 | 인물 15 · 장소 23 |
| STORY_SCENE | 16 (provenance 필드 없음, v2 사건 참조 4장면) |
| 기본 화면·분석·통계에 v2 포함 | **예** (근거 등급 필터 기본값이 3종 모두 ON) |

## A. Provenance

분류: `pack_v1_direct` / `pack_v1_derived`(정규화) / `inherited_v2` / `interpretation` / `unknown_provenance`.

### A-1. inherited_v2 — 사건 단위 (15)
`E1433_0310` `E1433_0511` `E1433_0601` `E1433_1221` `E1434_0416` `E1434_0422` `E1434_0426` `E1434_0914` `E1434_1010` `E1434_1012`
`E1435_JANRAID` `E1435_0125` `E1435_0224` `E1435_0613` `E1435_0617` — 관계 31개 포함.

### A-2. inherited_v2 — pack 사건 안의 관계 단위
| 관계 | 표시 상태 | 문제 |
|---|---|---|
| `E1432_INVEST#0` 세종→홍사석 파견 | inherited_v2 | 사건 자체가 `pack_v1`로 표시됨(pack은 "돌아올 조사관" 언급뿐) |
| `E1433_0215#6~#15` (맹사성·안순·정흠지·이순몽·최사강 질의/자문) | inherited_v2 | 정상 표시 |
| `E1433_0419#0~#2` 이순몽→이만주, 김효성→임합라, 최윤덕→임합라 | **pack_v1로 표시** | **pack은 "commanders → target settlements"만 기록. 부대↔대상 대응은 v2** |
| `E1435_0113#6~#7` 김수연 추격대 | inherited_v2 | 정상 표시 |

### A-3. interpretation (기본 분석에 포함되어 있음)
`E1433_0410#6` 최윤덕→정벌군 · `E1434_1024#0~#3` 현지 관원별 재편 건의 (certainty=interpretation, 그러나 기본 ON).
**interpretation인데 confirmed로 표시된 것**:
- `E1433_0226#1~#3` 의정부·육조·삼군도진무→세종 자문 — pack은 "General preference"의 주체를 특정하지 않음.
- `E1433_0516A#6~#16` 비지휘관 11명 관직 제수 — pack 관계는 "세종 → campaign commanders"뿐.
- `E1436_1127#1` 병조→세종 건의 — pack은 "병조의 방어책이 시행 명령됨"만 기록, 건의 행위·수신자 미기재.

### A-4. pack_v1_derived (정규화 규칙 필요)
- R1 '조정/court' 수신 → 세종: `E1432_1209#3`, `E1433_0307#1`, `E1433_0507#1`, `E1433_0610#3`, `E1434_0803#0`, `E1435_0408#0`, `E1436_1101#*`, `E1436_06L19#0`, `E1437_0611`, `E1440_1126`, `E1441_0519`, `E1443_1023#0`, `E1445_0519`, `E1447_04L10` 등
- R2 'via X' 전달자 분리: `E1433_0307#0`, `E1433_0507#0`
- R3 WHO 목록으로 집합 확장: `E1432_1221#2~#14`, `E1433_08L10#1~#6`, `E1440_0407#0~#2`
- R4 무명 집합 → group 노드: 다수
- R5 WHAT 문장 속 행위자 → 관계: `E1432_1211#10`(정흠지), `E1433_0610#0`(지함 대상)
- **규칙 위반(→ R1 오적용)**: `E1442_1022#0` pack "external intelligence -> **Joseon**"인데 세종으로 연결.

### A-5. unknown_provenance
- 인물 한자 15건(世宗, 崔士康, 盧閈, 申商, 宣德帝, 忽剌溫, 兀良哈, 기관 8종)과 장소 한자 23건: pack에 없음 → 편집자 일반지식.
- `PL_PAJEOGANG.modernLocationNote` "명 영역 내 건주위 일대" — pack 근거 없음.
- `D03` 상세 문구의 "선덕제 사망(1435년 초)" — 편집자 배경지식.
- 세력 라벨 "건주위", "건주좌위" — pack에 없는 명칭(v2/일반지식).
- 사건 theater 일부(아래 G).

## B. Relation direction

- 현재 direction 정책은 layer별로 정의되어 있지 않고 relation마다 기본 `directed`.
- undirected 13건은 모두 `E1432_1221` 세종↔대신 논의로, pack이 `세종 <-> 대신들`로 명시. **테스트를 통과시키려고 방향을 바꾼 관계는 없다.**
  다만 이 undirected 관계가 들어온 뒤 brute-force 테스트가 실패했고, 테스트를 arc 기반으로 고쳤다. 이 수정은 정당하지만 layer별 정책 없이 이루어졌다.
- **새로 발견한 문제**: CLAIM/COUNTER_CLAIM/조건부 표적 지위처럼 '~에 관한' 관계(aboutness)가 접촉(contact)처럼 경로·중심성 계산에 들어감.
  예: 맹가첩목아 → 임합라(주범 지목) 때문에 맹가첩목아에서 임합라로 "정보가 흐른" 경로가 생김.

## C. Temporal precision

- 날짜 정밀도 enum이 `day / record_date_only / month / year`로, `record_date_only` 사건(10건)도 관계 시각을 **기사일(일 단위)로 확정**함.
  예: 1432 여연 침입·추격(기사일 12/9 이전 발생), 1433 맹가첩목아의 진술(6/10 이전, 알목하), 1446 무창 피습, 1447 축성 부역.
- 1433 윤8월 칙서 이전의 조선·이만주 측 진술(`E1433_08L10#7~#8`)을 칙서 기사일로 표기 → 가짜 정밀도.
- 1440 사헌부 탄핵(`E1440_0117#0`)도 변론 기사일로 표기.
- 범위 관계(1433-04-10~19, 1437-09-07~16, 1443-09-14~10-05)를 "그 기간 내내 활성"으로 처리 → 실제로는 "기간 중 미상 시점"이라 순서가 불확실한데 경로 계산에 확정 순서로 사용됨.
- 연 단위 사건 3건(지리지)은 관계가 없어 경로에는 영향 없음. 단 타임라인에서 연초 한 점으로 그려져 정밀해 보임.
- `E1432_INVEST` 시작일을 '1432-12-00'(12월 초)로 둠 → pack은 12/21 이전이라는 것만 알려 줌.

## D. Coverage

- 연도별 조사 상태를 EVENT 존재 여부로 추론(`build-research.mjs`).
- 앱 상단 안내문이 "사건이 없는 연도: 1444"라고 표시. 연도 버튼 툴팁도 "사건이 없습니다".
- 별도 coverage 메타데이터 없음.

## E. Source usage

- `validate.js`가 `not_accessed` 사료를 '미사용 경고'에서 제외 → 경고 소거로 통과.
- `SRC_ENCY_SEOJEONGNOK`(pack 서지만 확인)과 `SRC_SEOJEONGNOK`(본문 미확보)이 같은 범주로 다뤄지지 않음. seed 사료(`SRC_1438_0808`)와 검증 사료가 같은 '사용됨'으로 집계.

## F. Person authority

- `hanjaVerified`가 "pack에 이 표기가 있다"와 "동일인이다"를 구분하지 않음.
- 동명 처리 불일치: 이진(1435 vs 1437)은 분리했지만 홍사석(1433 vs 1437), 김효성(1433 vs 1443)은 자동 병합.
- PERSON_STATE 4건(`PS_LG_2`, `PS_CSG_1`, `PS_SS_1`, `PS_CGM_1`)이 v2 사료만으로 `confirmed`. `PS_LJ_1`·`PS_KYS_1`·`PS_MANJU_1`은 관직명이 v2인데 pack 사료를 인용.
- 상태 종료일(예: `PS_HONG_2` ~1437-09-06, `PS_LG_1` ~1435-06-12)은 다음 상태에서 역산한 값으로 사료에 없음.
- `levelAt`이 v2 상태를 기본 사용.

## G. Geography

- 모든 좌표가 null(정상)이지만 '좌표 없음'과 '위치 불명'을 구분하는 필드가 없음. 1433/1437 지명 9곳의 메모가 "위치 불명(pack v1 지명 목록)".
- `parentPlaceId: "PL_PAJEOGANG"` 3건(이만주 채리, 임합라 채리, 임합라 부모 채리): pack에 '파저강 일대'라는 상위 관계 진술 없음 → **근거 없음**.
- 그 밖의 parentPlaceId 17건 중 pack 근거: 석보→회령(pack "Seokbo station in Hoeryŏng"), 회령·삼수→함길도(1447-07-08 "Hamgil frontier … Hoeryŏng and Samsu"). 나머지 14건(여연·강계·자성·무창·이산·삭주→평안도, 경원·종성·공성·길주·경흥·갑산·혜산·부령→함길도)은 일반지식.
- 사건 theater 중 pack 근거가 없는 것: `E1446_0420`(무창→AMNOK), `E1449_0707`(삭주→AMNOK), `E1438_0729`·`E1439_0510`·`E1439_0617`(장소 '함길도'를 붙여 DUMAN), `E1436_1127`의 DUMAN, `E1433_0325`·`E1433_08L10`·`E1432_1221`의 AMNOK 등.

## H. Event/relation causal audit

- relation.causalStatus 237건이 미기재 → `deriveEdges`가 `explicit`으로 채움(**심각**: 모든 관계가 '명시적 인과'로 보임).
- causedBy 26건 중 pack 근거 없는 인과/선후 링크:
  `E1433_0215←E1432_1221`, `E1433_0226←E1433_0215`, `E1433_0307←E1433_0226`, `E1433_0410←E1433_0226`(explicit로 표시), `E1433_0410←E1433_0307`,
  `E1435_0408←E1435_0312`, `E1435_0726←E1435_0719`, `E1436_1127←E1436_1101`, `E1437_0611←E1436_06L19`, `E1437_0914←E1437_0611`, `E1441_0519←E1441_0129`,
  `E1432_1211←E1432_1209`(pack 제목 'immediately after'는 선후일 뿐인데 strongly_implied).
  필드 이름이 `causedBy`인데 `sequence_only` 값을 담아 "선후 = 인과" 오해를 유발.

## I. Story

- 16장면 모두 `sourceIds`·`narrativeStatus` 없음. 문장 단위 근거 없음.
- v2 사건을 기본 서사에 포함: S04(성죄방목), S07(이만주 사절), S09(정월 침입), S11(문책·사헌부).
- pack보다 강한 서술: S10 "변경 건설은 자발적·조화로운 과정만이 아니었다"(pack 지침의 해석), S14 제목 "정보·보고 네트워크"(분석적 해석), S05 "파저강 일대 거주지"(거주지의 '파저강 일대' 귀속은 pack 미기재), S06 "시간 순행 루프를 볼 수 있다"(v2 제외 시 성립 여부 미검증).

## 심각도 분류

| 등급 | 항목 |
|---|---|
| **CRITICAL** | C1 v2 관계·사건이 기본 네트워크/분석/스토리/통계에 포함 · C2 `E1433_0419` v2 관계 3건이 pack_v1로 표시 · C3 causalStatus 미기재 237건이 `explicit`로 기본 처리 |
| **HIGH** | H1 record-only 사건의 현장 행위를 기사일로 확정(가짜 정밀도) · H2 기간 관계를 '전 기간 활성'으로 처리해 순서 확정 · H3 근거 없는 causedBy 12건 · H4 confirmed로 표시된 interpretation 관계 15건 · H5 PERSON_STATE 7건 근거 과장 · H6 aboutness 관계가 경로·중심성에 포함 · H7 coverage를 EVENT 유무로 추론, "사건 없음" 문구 · H8 동명이인 처리 불일치(홍사석·김효성) |
| **MEDIUM** | M1 parentPlaceId 17건 근거 없음(PL_PAJEOGANG 3 포함) · M2 편집자 한자 38건 · M3 theater 근거 미표시·일부 근거 없음 · M4 source 상태 미구분, not_accessed 경고 소거 · M5 `E1442_1022#0` 수신자 규칙 오적용 · M6 상태 종료일 역산 · M7 story 문장 provenance 없음 · M8 D03 문구의 배경지식 · M9 layer별 direction 정책 부재 |
| **LOW** | L1 '위치 불명' 표현 · L2 세력 라벨의 pack 외 명칭 · L3 WHO에만 있는 인물(맹날가래·최진)을 actors로 표기 · L4 '생산 빌드' 점검 도구 없음(정적 사이트) |

## 수정 계획 (파일별)

| 파일 | 수정 |
|---|---|
| `src/data/vocab.js` | PROVENANCE · EVIDENCE_STATUS · DIRECTION_POLICY(layer별) · DATE_PRECISION(DAY/MONTH/YEAR/UNKNOWN) · COVERAGE_STATUS · IDENTITY_STATUS · COORDINATE/LOCATION_STATUS · NARRATIVE_STATUS · SOURCE_USAGE 추가, 세력 라벨 중립화 |
| `src/data/events.js` | 모든 관계에 provenance·derivationRule·causalStatus(기본 unknown)·시각 범위(dateMin/dateMax/kind)·pathEligible 명시. 사건 날짜를 dateMin/dateMax/datePrecision으로. causedBy → eventLinks(pack 근거 있는 것만). C2·H4·M5 교정, 근거 없는 theater/장소 제거. 새 사건·인물·관계 추가 없음 |
| `src/data/people.js` | hanjaVerified → nameFormVerified/nameFormSource, identityStatus, 편집자 한자 제거, 홍사석·김효성 후기 등장 분리(possibleSameAs), PERSON_STATES → 근거 있는 attestation(종료일 역산 제거, v2는 legacy) |
| `src/data/places.js` | 근거 없는 parentPlaceId 제거, 편집자 한자·메모 제거, coordinateStatus·locationStatus·theaterBasis |
| `src/data/sources.js` | 상태 필드 정리(usage는 계산) |
| `src/data/coverage.js` (신규 메타데이터) | 1432~1449 연도별 coverageStatus |
| `src/data/story.js` | 장면을 문장 단위(statements)로, 각 문장에 eventIds·sourceIds·narrativeStatus·provenance |
| `src/model/deriveEdges.js` | 시각 범위·provenance·evidenceStatus·pathEligible·방향 정책 적용 |
| `src/model/indexes.js` | sortDate, attestation 기반 levelAt(pack만) |
| `src/model/temporalNetwork.js` | 근거 필터(pack 기본, legacy·interpretation 선택), 표시용(가능) vs 분석용(확실) 포함 구분 |
| `src/analysis/temporalPaths.js` | strict(확실한 순서) / possible(가능한 순서) 이중 모드, 경로 플래그 EXACT/PARTIAL_ORDER/UNCERTAIN |
| `src/analysis/centrality.js`, `trajectories.js` | 확실한 순서만 사용, 결과 플래그·제외 수 보고 |
| `src/model/validate.js` | 새 규칙(방향 정책, provenance, causal, 날짜 정밀도, coverage, identity, parentPlace) · source usage 상태별 메시지 |
| `src/ui/*`, `index.html`, `style.css` | 근거 토글 3종, 사건/관계 패널 필드, coverage 타임라인, '사건 없음' 문구 제거, 스토리 문장 필터 |
| `tools/integrity.mjs` (신규), `tools/test.mjs`, `tools/e2e.mjs`, `tools/build-check.mjs` (신규), `tools/build-research.mjs` | 무결성 테스트, coverage 기반 문서 생성, 정적 빌드 점검 |
| `research/*.md`, `README.md` | 방법론·규칙 갱신, 수정 후 감사 보고 |
