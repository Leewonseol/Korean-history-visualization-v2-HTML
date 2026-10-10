/* Opening possible worlds v1: finite constraint satisfaction, NOT posterior inference.
 * Historical anchors live outside canonical EVENTS. Never infer causality from same date,
 * and never upgrade unrecorded attendance, sequences or dialogue into attested facts.
 */
import { OPENING_SCENARIOS, CONTEXT_EVIDENCE } from "../data/openingContext.js";

const EVIDENCE = new Map(CONTEXT_EVIDENCE.map(e => [e.id, e]));
const ids = (s) => s.axes.map(a => a.key);
export const worldScenarios = () => OPENING_SCENARIOS;

export function checkWorld(scenario, selection) {
  if (!scenario || !Array.isArray(scenario.axes)) throw new Error("Missing scenario");
  const errors = [], assumptions = [];
  const axisKeys = new Set(ids(scenario));
  for (const axis of scenario.axes) {
    if (!axis.options.some(o => o.key === selection[axis.key])) errors.push("선택지가 정의되지 않음: " + axis.key);
  }
  for (const k of Object.keys(selection)) if (!axisKeys.has(k)) errors.push("선택에 없는 축: " + k);
  for (const eid of scenario.fixedIds) if (!EVIDENCE.has(eid)) errors.push("확정 사료 ID 누락: " + eid);
  if (errors.length) return { accepted:false, errors, assumptions };

  const { briefing, presenter, order, medicine, prince } = selection;
  if (scenario.id === "DEC_1432") {
    if (briefing === "none" && order !== "standalone")
      errors.push("기술 보고 없이 기술 보고의 앞·도중·뒤에 치보를 배치할 수 없음");
    if (briefing !== "none" && order === "standalone")
      errors.push("기술 보고를 배치했으면서 치보만 단독 장면이라고 설정함");
    if (briefing === "jang") assumptions.push("장영실의 1432-12-09 국왕 직접 보고: 직접 증거 없음");
    if (briefing === "official") assumptions.push("1432-12-09 담당 관원의 기술 보고: 직접 증거 없음");
    if (order !== "standalone" && order !== "before")
      assumptions.push("두 보고의 궁중 내 상대적 순서·장소가 미기록");
    else if (order === "before") assumptions.push("같은 날 기술 보고가 뒤따른 실제 순서 미기록");
  } else if (scenario.id === "JUN_1433") {
    if (presenter === "jangonly")
      errors.push("『세종실록』의 진상 주체 정초·박연·김진을 삭제하고 장영실만으로 대체할 수 없음");
    if (presenter === "plusjang") assumptions.push("장영실의 1433-06-09 진상 현장 배석 미기록");
    assumptions.push("동일 기사일의 두 사건이 궁중에서 실제로 진행된 순서 미기록");
  } else errors.push("알 수 없는 시나리오");

  if (medicine === "complete") {
    // 6/11 is the first attested completion entry, not proof of exact final drafting hour.
    // Exclude *as an attested on-stage assertion*, not as a metaphysical impossibility.
    errors.push("『향약집성방』 완성은 1433-06-11 기록: 이전 시점의 기완료 발언을 입증된 사실로 둘 수 없음");
  }
  if (medicine === "inprogress") assumptions.push("그날 의학서 편찬이 궁중 대화에서 언급됐다는 직접 증거 없음");
  if (prince === "present") assumptions.push("당일 왕세자 배석의 직접 증거 없음");

  return { accepted:errors.length === 0, errors, assumptions };
}

export function enumerateOpeningWorlds(scenarioId) {
  const scenario = OPENING_SCENARIOS.find(s => s.id === scenarioId);
  if (!scenario) throw new Error("Unknown opening scenario: " + scenarioId);
  const worlds = [];
  function visit(i, chosen) {
    if (i === scenario.axes.length) {
      const v = checkWorld(scenario, chosen);
      const choices = Object.fromEntries(Object.entries(chosen));
      const key = scenario.axes.map(a => choices[a.key]).join(".");
      worlds.push({ id:scenario.id + ":" + key, choices, ...v });
      return;
    }
    const a = scenario.axes[i];
    for (const option of a.options) visit(i+1, { ...chosen, [a.key]:option.key });
  }
  visit(0, {});
  const accepted = worlds.filter(w => w.accepted).sort((a,b) =>
    a.assumptions.length - b.assumptions.length || a.id.localeCompare(b.id));
  const excluded = worlds.filter(w => !w.accepted);
  return {
    scenario, anchorEvidence:scenario.fixedIds.map(id => EVIDENCE.get(id)),
    allCount:worlds.length, validCount:accepted.length, excludedCount:excluded.length,
    accepted, excluded, method:"FINITE_CONSTRAINT_SATISFACTION", probabilityEstimated:false
  };
}

export function worldReadable(scenario, world) {
  return scenario.axes.map(a => ({ key:a.key, axis:a.label,
    choice:a.options.find(o => o.key === world.choices[a.key])?.label || "?", value:world.choices[a.key] }));
}
