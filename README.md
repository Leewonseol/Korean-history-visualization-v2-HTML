# 세종대 북방 군사·행정 시간 네트워크 (1432–1449)

**Who gets What, When, How, Where, and with What Outcome?**

1432년 12월 여연 침입부터 1449년 7월 부령도호부 승격·진 설치(작업상의 종점)까지, 세종대 북방 군사·행정정책을
**temporal + multilevel + multilayer + spatial network**로 복원하는 정적 GitHub Pages 프로젝트입니다.
중앙 정책결정 → 지휘 → 현장 실행 → 결과 → 보고(장계·치계·회계) → 새 정책결정의 흐름을 **시간 순서를 지키는 경로**로 추적합니다.

> **데이터 근거 현황.** 사건 70건 = 사용자가 실록 원문과 대조한 **VALIDATED HISTORICAL SOURCE PACK v1** 기반 54건
> (실록 기사 기반 51 + 『세종실록』 지리지 연 단위 3) · 이전 v2 데이터 이관(원문 재대조 전) 15건 · 미검증 시드 1건.
> 이것은 **검증된 seed set이지 1432~1449 전수 추출이 아닙니다.** 1444년은 사건이 없으나 '미조사'입니다.
> 작업 환경에서는 실록·한국민족문화대백과·규장각 사이트가 네트워크 정책으로 차단되어 있어, 이 저장소의 작업 세션이 원문을 직접 열람한 적은 없습니다.
> 연도별 상태: [`research/chronology_1432_1449.md`](research/chronology_1432_1449.md).

## 실행

빌드 단계가 없습니다. ES module을 쓰므로 `file://`로 열지 말고 정적 서버로 여세요.

```bash
python3 -m http.server 8000      # 저장소 루트에서
# http://localhost:8000
```

GitHub Pages: Settings → Pages → Deploy from a branch → 브랜치 / `(root)`. Cytoscape.js는 cdnjs에서 받습니다.

### 검증·테스트

```bash
node tools/validate.mjs          # validateData(): 참조 무결성·날짜·Lasswell 필드·사료 수준 검사
node tools/test.mjs              # 데이터 검증 + time-respecting path·betweenness·communicability 단위 테스트
node tools/build-research.mjs    # research/*.md 의 표를 데이터에서 재생성
# 브라우저 E2E (Playwright 필요)
PLAYWRIGHT_MODULE=$(npm root -g)/playwright/index.js node tools/e2e.mjs http://localhost:8000/
```

## 파일 구조

```
index.html  style.css
src/
  app.js                    상태 관리·모듈 연결
  data/
    vocab.js                LEVEL · LAYER · certainty · theater · 세력 · 메커니즘 · 결과 · 사료 유형 어휘
    people.js               PEOPLE(authority) · PERSON_STATES(날짜별 관직·level)
    places.js               PLACES (좌표는 근거 없으면 null)
    sources.js              SOURCES (edge 수준 provenance)
    events.js               EVENTS (단일 source of truth) · DISCREPANCIES
    story.js                스토리 모드 장면
    index.js                DATA 묶음
  model/
    dates.js                음력 날짜 문자열(윤달 'MML') 비교·근사 월 계산
    indexes.js              id 조회, levelAt(person, t), 첫/마지막 등장, 인물별 사건·사료
    deriveEdges.js          EVENTS.relations → temporal contacts (EDGES 수동 관리 없음)
    temporalNetwork.js      기간·layer·level·theater·certainty·사료유형 필터
    validate.js             validateData()
  analysis/
    temporalPaths.js        time-respecting path, 피드백 루프
    centrality.js           temporal metrics, dynamic communicability, 인물 서사 지표
    trajectories.js         연도별 centrality trajectory, layer별 중심성
  ui/
    networkView.js          Cytoscape (level band 배치, layer 색, certainty 선모양)
    timeline.js             사건 슬라이더(max = EVENTS.length−1), 연도 jump, 재생
    filters.js              왼쪽 필터 패널·범례
    eventPanel.js           [사건] 탭: Who / Gets·Loses What / When / How / Where / Outcome
    personPanel.js          [인물] 탭
    analysisPanel.js        [분석] 탭: metrics · trajectory · layer별 · Temporal Path · 피드백 루프
    charts.js format.js storyMode.js
research/
  chronology_1432_1449.md   연도별 조사 기록(18개 연도 전부, 조사 못 한 연도 명시)
  sources.md                사료 목록(클릭 가능한 링크, 유형·수준·검증 상태·지지 event)
  people_authority.md       인물 authority table · 동명이인 검토 · 보류 엔티티
  discrepancies.md          실록 vs 서정록 · 주장 vs 반박 · 날짜·숫자·동일성 쟁점
  methodology.md            temporal network·경로·모든 지표의 수식과 참고문헌
tools/  validate.mjs  test.mjs  e2e.mjs  build-research.mjs
```

## 데이터 모델

- **EVENT가 단일 source of truth**입니다. 네트워크 edge는 `EVENTS[*].relations`에서만 파생됩니다.
  각 relation: `source, target, layer, relationType, startDate, endDate, direction, certainty, causalStatus, sourceIds, note`.
- 각 EVENT의 Lasswell 필드: `actors/targets/decisionMakers/informationSources/beneficiaries/victims`(WHO), `what[]`(GETS/LOSES WHAT),
  `eventDate/recordDate/datePrecision`(WHEN), `mechanisms/documentType/embeddedDocumentAuthor`(HOW), `theater/placeIds/locationNote`(WHERE),
  `outcomes[]`(OUTCOME). 비어 있으면 `validateData()`가 오류를 냅니다.
- **LEVEL**(행위자 위치, L0 왕 ~ L7 외부 행위자, LU 미상)은 노드의 시간 가변 속성이고, **LAYER**(관계 종류 20개: 요구된 19개 + 부역·노동 동원)는 edge 속성입니다.
- 근거 등급(`verification`)은 사건과 관계 단위로 모두 기록합니다. pack v1 사건 안의 v2 전용 관계는 따로 표시됩니다.
- 실록 기사 안에 인용된 김종서의 장계·치계·회계는 `embeddedDocumentAuthor` + `documentType`으로 분리 저장합니다.
- 인과는 `causedBy[]`의 `causalStatus`(explicit / strongly_implied / sequence_only / unknown)로만 기록하며, 시간 선후만으로 만들지 않습니다.

## 화면

- **왼쪽**: 기간(연도, 타임라인 커서까지 제한, 누적/최근 12개월/현재 사건만) · level · layer · theater(중앙/압록강/두만강/명/불명) · certainty · **근거 등급(pack v1 / v2 이관 / 시드)** · 사료 유형 · 노드 크기 지표 · 장소 노드 overlay · 범례
- **가운데**: level band 배치 네트워크(위→아래: 왕, 중앙 관료, 중앙 군사, 지방 최고지휘, 현장 지휘, 군졸, 주민; 외부 세력은 오른쪽 세력별 열),
  사건 분포 strip, 슬라이더, 재생/일시정지, 이전·다음, **EVENTS에서 자동 생성되는 연도 jump**
- **오른쪽 탭**: [사건] Lasswell 6요소·관계·인과·사료 링크·certainty·discrepancy / [인물] 시점별 관직·level, 활동기간, 서사 판단용 지표, 연도별 trajectory, 사건·관계·장소·사료 / [분석] temporal metrics 표, trajectory, layer별 중심성, **Temporal Path**, 피드백 루프
- 시각 규칙: 노드 색 = 세력, 모양 = 개인/집단/기관, 세로 위치 = 시점 level, 크기 = 선택 지표(기본 균일), 선 색 = layer,
  **실선 = 사료 기록 사실 · 점선 = 당대 주장/다툼 · 파선 = 해석/2차/미검증 시드**, 흐린 선 = 과거 관계, 굵은 선 = 현재 사건

## Temporal 지표 (정의는 [`research/methodology.md`](research/methodology.md))

| 지표 | 정의 요약 |
|---|---|
| Temporal in/out-degree | 창 안 contact 수(방향별) |
| Temporal activity | 관계로 참여한 서로 다른 사건 수 |
| Active span | 첫~마지막 활동 근사 개월 |
| Node persistence | 활동 연도 수 / 창의 연도 수 |
| Layer diversity | 서로 다른 layer 수, 정규화 Shannon entropy |
| Centrality trajectory | 연도별 slice에서 degree·betweenness 재계산 |
| Earliest-arrival temporal closeness | (1/(N−1)) Σ 1/(1+Δ개월), Δ = 가장 이른 도착 − 창 내 첫 contact |
| Temporal betweenness | prefix-optimal foremost time-respecting 경로 위 Brandes식 의존도 합 |
| Broadcast / receive | Grindrod et al.(2011) dynamic communicability Q = Π(I−αA_k)⁻¹ 의 행·열 합 |

time-respecting path: τ₁ ≤ τ₂ ≤ … ≤ τ_k (같은 날 연쇄 허용, 과거 edge로 역행 불가).
정적 PageRank 등 시간을 무시한 지표는 계산하지 않으며, 알고리즘이 '주인공'을 정하지 않습니다.

## 사료·서술 원칙

- 사료에서 구체적 행위가 확인될 때만 edge를 만들며, 같은 기사에 이름이 함께 나온다는 이유로 관계를 만들지 않습니다.
- 이만주 측 주장·제보자 진술은 `contemporary_claim`(점선). 조선 측 전과·사상자 수치에는 '조선 측 보고 수치' 표시.
- 여진을 하나로 합치지 않고(건주위·파저강 기타·건주좌위·홀라온·오량합·세력 미특정 분리), 맹가첩목아·범찰·동창·임합라를 이만주의 부하로 그리지 않습니다.
- 4군·6진을 파저강 정벌 하나의 직접 결과로 단순화하지 않으며(자성군 설치 인과 = `sequence_only`), 1449년을 북방 문제 해결 시점으로 묘사하지 않습니다.
- confirmed 관계가 1차 사료 없이 만들어지면 `validateData()`가 막습니다.

## 다음 단계

1. 세종실록 월별 기사목록(세종 14년 12월 ~ 31년 7월)을 연도별로 전수 조사(현재는 seed set). 특히 1444년과 각 연도의 '남은 확인 과제'
2. v2 이관 15건을 원문과 대조해 `pack_v1` 수준으로 올리거나 수정(성죄방목, 1434 이만주 교섭, 1435 정월 침입·문책 등)
3. 1433 정벌 부대별 전과 수치를 '조선 측 보고 수치'로 입력
4. 『서정록』 원문 또는 1989 역본 확보 후 실록과 사건 단위 대조(`discrepancies.md` D08)
5. 김종서 장계·치계·회계의 인용 본문 구간 추출, REPORT layer corpus 확장
