/* ==========================================================================
   시각 불확실성 missingness 진단
   기본 지표(CERTAIN_ORDER)에서 빠지는 관계가 무작위가 아닐 수 있다. 화면에 보이는(display) 관계 중
   분석에 포함된 것과 시각 불확실로 제외된 것을 layer · 근거 등급 · relation type · 인물별로 나눠
   어떤 종류의 사료·관계가 체계적으로 빠지는지 보여 준다. 판단(편향 여부)은 사람이 한다.
   ========================================================================== */
const tally = (list, key) => {
  const m = {};
  for (const c of list) { const k = key(c); m[k] = (m[k] || 0) + 1; }
  return m;
};

/** @param {ReturnType<import("../model/temporalNetwork.js").analysisContacts>} a */
export function missingnessReport(a, { topPeople = 12 } = {}) {
  const inc = a.contacts, exc = a.excludedUncertainList, about = a.excludedAboutList;
  const dims = {
    layer: (c) => c.layer,
    evidenceClass: (c) => c.evidenceClass,
    relationType: (c) => c.relationType,
    timeShape: (c) => (c.tMin === null && c.tMax === null ? "시각 미상" : c.tMin === null ? "기사일 이전(하한 미상)"
      : c.tMax === null ? "상한 미상" : c.exact ? "일 단위 확정" : c.timeKind === "duration" ? "기간(지속)" : "범위 안 미상 시점")
  };
  const table = (key) => {
    const i = tally(inc, key), e = tally(exc, key);
    return [...new Set([...Object.keys(i), ...Object.keys(e)])]
      .map((k) => ({ key: k, included: i[k] || 0, excluded: e[k] || 0, excludedShare: (e[k] || 0) / ((i[k] || 0) + (e[k] || 0)) }))
      .sort((x, y) => y.excluded - x.excluded || y.included - x.included || (x.key < y.key ? -1 : 1));
  };
  const perPerson = {};
  for (const [list, k] of [[inc, "included"], [exc, "excluded"]]) for (const c of list) for (const p of new Set([c.source, c.target])) {
    perPerson[p] ||= { included: 0, excluded: 0 };
    perPerson[p][k]++;
  }
  const people = Object.entries(perPerson).map(([id, v]) => ({ id, ...v, excludedShare: v.excluded / (v.included + v.excluded) }))
    .filter((x) => x.excluded > 0).sort((x, y) => y.excluded - x.excluded || (x.id < y.id ? -1 : 1)).slice(0, topPeople);
  return {
    included: inc.length, excludedUncertain: exc.length, excludedAbout: about.length,
    byLayer: table(dims.layer), byEvidenceClass: table(dims.evidenceClass), byRelationType: table(dims.relationType),
    byTimeShape: table(dims.timeShape), byPerson: people
  };
}
