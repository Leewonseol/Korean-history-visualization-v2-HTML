/* ==========================================================================
   COVERAGE — 연도별 '이 데이터셋이 무엇을 조사했는가' 레지스트리.
   - EVENTS 유무에서 추론하지 않는다. 타임라인·연구 문서 생성기·검증기는 이 표를 읽는다.
   - VERIFIED_WITH_EVENTS 도 '그 해 사건 전부'가 아니다(completeness: SEED_ONLY).
   - NOT_COVERED 는 '사건이 없었다'가 아니라 'pack v1에 검증 기사가 제공되지 않았다'는 뜻이다.
   - sourceIds: 그 해에 대해 pack v1이 제공한 실록 기사. geographySourceIds: 그 해를 서술한 지리지 항목.
   - scopeStatus(vocab.COVERAGE_SCOPE): FULL / PARTIAL / NONE / UNKNOWN — 연도 중 조사 기간에 든 범위.
       FULL은 '연도 전체가 조사 기간 안'일 뿐 모든 기사를 조사했다는 뜻이 아니다(completeness는 모두 SEED_ONLY 또는 NONE).
       PARTIAL 연도(1432: 12-09부터, 1449: 07-07까지)를 FULL 연도와 사건 수로 비교하지 않는다. NONE(1444)은 0이 아니라 NA.
   ========================================================================== */

const SEED = "SEED_ONLY";
const NOT_COVERED_NOTE =
  "pack v1에 현재 검증 기사가 제공되지 않음. 이 연도는 미조사/미수록 상태이며, 해당 연도에 관련 사건이 없었다는 뜻이 아님.";

function y(year, coverageStatus, sourceIds, extra = {}) {
  return {
    year, coverageStatus, completeness: coverageStatus === "NOT_COVERED" ? "NONE" : SEED,
    scopeStatus: coverageStatus === "NOT_COVERED" ? "NONE" : "FULL",
    scope: "full_year", scopeFrom: `${year}-01-01`, scopeTo: `${year}-12-30`, sourceIds, geographySourceIds: [], note: "", ...extra
  };
}

export const COVERAGE = [
  y(1432, "VERIFIED_WITH_EVENTS", ["SRC_1432_1209", "SRC_1432_1211", "SRC_1432_1221"],
    { scope: "1432-12-09~", scopeStatus: "PARTIAL", scopeFrom: "1432-12-09", note: "작업 범위가 1432-12-09에서 시작. 그 이전은 범위 밖." }),
  y(1433, "VERIFIED_WITH_EVENTS", ["SRC_1433_0215", "SRC_1433_0226", "SRC_1433_0307", "SRC_1433_0325", "SRC_1433_0507",
    "SRC_1433_0516A", "SRC_1433_0516B", "SRC_1433_0517", "SRC_1433_0610", "SRC_1433_08L10"]),
  y(1434, "VERIFIED_WITH_EVENTS", ["SRC_1434_0803", "SRC_1434_1024"], { geographySourceIds: ["SRC_GEO_GYEONGWON", "SRC_GEO_HOERYEONG", "SRC_GEO_JONGSEONG"] }),
  y(1435, "VERIFIED_WITH_EVENTS", ["SRC_1435_0118", "SRC_1435_0312", "SRC_1435_0408", "SRC_1435_0719", "SRC_1435_0726", "SRC_1435_0918"],
    { geographySourceIds: ["SRC_GEO_JONGSEONG"] }),
  y(1436, "VERIFIED_WITH_EVENTS", ["SRC_1436_06L19", "SRC_1436_1101", "SRC_1436_1127"]),
  y(1437, "VERIFIED_WITH_EVENTS", ["SRC_1437_0611", "SRC_1437_0820", "SRC_1437_0914", "SRC_1437_0922"]),
  y(1438, "VERIFIED_WITH_EVENTS", ["SRC_1438_0729"],
    { note: "1438-08-08 기사는 최초 anchor 목록에만 있고 pack v1에 없음(legacy_anchor_seed)." }),
  y(1439, "VERIFIED_WITH_EVENTS", ["SRC_1439_0510", "SRC_1439_0617"]),
  y(1440, "VERIFIED_WITH_EVENTS", ["SRC_1440_0117", "SRC_1440_0407", "SRC_1440_1126"], { geographySourceIds: ["SRC_GEO_JONGSEONG"] }),
  y(1441, "VERIFIED_WITH_EVENTS", ["SRC_1441_0129", "SRC_1441_0519"], { geographySourceIds: ["SRC_GEO_JONGSEONG"] }),
  y(1442, "VERIFIED_WITH_EVENTS", ["SRC_1442_1022"], { geographySourceIds: ["SRC_GEO_GYEONGWON"] }),
  y(1443, "VERIFIED_WITH_EVENTS", ["SRC_1443_1005", "SRC_1443_1023"]),
  y(1444, "NOT_COVERED", [], { note: NOT_COVERED_NOTE }),
  y(1445, "VERIFIED_WITH_EVENTS", ["SRC_1445_0519", "SRC_1445_0806", "SRC_1445_1027"]),
  y(1446, "VERIFIED_WITH_EVENTS", ["SRC_1446_0420"]),
  y(1447, "VERIFIED_WITH_EVENTS", ["SRC_1447_0107", "SRC_1447_04L10", "SRC_1447_0708"]),
  y(1448, "VERIFIED_WITH_EVENTS", ["SRC_1448_0307"]),
  y(1449, "VERIFIED_WITH_EVENTS", ["SRC_1449_0707"], { geographySourceIds: ["SRC_GEO_BURYEONG"],
    scope: "~1449-07-07", scopeStatus: "PARTIAL", scopeTo: "1449-07-07", note: "작업 범위가 1449-07-07에서 끝남. 이 날짜를 북방 문제의 해결 시점으로 보지 않음." })
];

export const COVERAGE_BY_YEAR = new Map(COVERAGE.map((c) => [c.year, c]));
