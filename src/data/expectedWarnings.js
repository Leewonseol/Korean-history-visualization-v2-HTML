/* ==========================================================================
   EXPECTED_WARNINGS — 의도적으로 남겨 둔 경고(known exception) 목록
   - 이 목록의 경고는 '알려진 예외'로 표시되지만 숨기지 않는다.
   - 목록에 없는 경고(unexpected)가 생기면 tools/validate.mjs가 실패한다(CI).
   - 목록에 있는데 더 이상 발생하지 않는 항목(stale)도 실패한다 — 상태가 바뀌었으면 목록을 함께 고친다.
   "항상 경고 n개가 뜨는 상태"를 정상으로 삼지 않기 위한 장치다.
   ========================================================================== */
export const EXPECTED_WARNINGS = [
  { code: "SOURCE_REGISTERED_UNCHECKED", key: "SRC_SEOJEONGNOK",
    reason: "『서정록』 원문·국역을 확보하지 못함. 본문 대조 전까지 근거로 쓰지 않는다는 사실 자체를 계속 드러내야 함." },
  { code: "SOURCE_VERIFIED_UNUSED", key: "SRC_GEO_HOERYEONG",
    reason: "지리지 회령 항목은 pack 검증 사료지만 사건의 직접 근거가 아니라 관련 사료(relatedSourceIds)로만 참조됨." }
];
