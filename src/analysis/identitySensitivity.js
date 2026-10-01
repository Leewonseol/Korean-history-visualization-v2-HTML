/* ==========================================================================
   동일성(identity) 민감도
   같은 이름의 등장을 한 노드로 묶은 PROBABLE_SAME 노드는 동일성이 사료로 확인되지 않았다.
   - unresolvedNodeCount: 분석 노드 중 동일성 미해결 노드 수(PROBABLE_SAME · UNRESOLVED · UNRESOLVED_DISTINCT)
   - pathIdentityAssumptions: 경로가 미해결 노드를 '다른 사건의 등장끼리' 이어서 지나가면 그 가정을 표시
   - mergeSensitivity: 미해결 노드를 사건별 등장으로 쪼갰을 때 도달 가능한 (출발, 도착) 쌍과 betweenness가
     얼마나 바뀌는지 계산 — 잘못된 병합이 경로·중심성에 주는 영향을 탐지(판정은 사람이 함)
   ========================================================================== */
import { IDENTITY_UNRESOLVED } from "../data/vocab.js";
import { buildAdjacency, earliestArrival } from "./temporalPaths.js";
import { computeMetrics } from "./centrality.js";

export const isUnresolved = (idx, id) => !!idx.identityOf[id] && IDENTITY_UNRESOLVED.has(idx.identityOf[id].status);

export function unresolvedNodeCount(idx, nodeIds) {
  const ids = [...new Set(nodeIds)].filter((id) => idx.peopleById[id] && idx.peopleById[id].entityType === "person");
  const unresolved = ids.filter((id) => isUnresolved(idx, id));
  return { persons: ids.length, unresolved: unresolved.length, ids: unresolved };
}

/** 경로 단계 사이에서 같은 노드를 '다른 사건'의 등장으로 이어 붙인 지점(동일성 가정) */
export function pathIdentityAssumptions(idx, steps) {
  const out = [];
  for (let i = 1; i < steps.length; i++) {
    const node = steps[i].from, a = steps[i - 1].contact.eventId, b = steps[i].contact.eventId;
    if (a !== b && idx.identityOf[node] && idx.identityOf[node].status === "PROBABLE_SAME") out.push({ node, inEvent: a, outEvent: b });
  }
  return out;
}

const reachPairs = (contacts, win, mode) => {
  const adj = buildAdjacency(contacts);
  const nodes = [...new Set(contacts.flatMap((c) => [c.source, c.target]))];
  const pairs = new Set();
  for (const s of nodes) for (const [v] of earliestArrival(adj, [s], win.from, win.to, mode).arrival) if (v !== s) pairs.add(`${s}>${v}`);
  return pairs;
};
// 노드 하나를 사건별 등장으로 분리(노드 id@eventId)
const splitNode = (contacts, id) => contacts.map((c) => (c.source === id || c.target === id)
  ? { ...c, source: c.source === id ? `${id}@${c.eventId}` : c.source, target: c.target === id ? `${id}@${c.eventId}` : c.target } : c);

export function mergeSensitivity(idx, contacts, win, { mode = "CERTAIN_ORDER", scope } = {}) {
  const base = reachPairs(contacts, win, mode);
  const baseM = computeMetrics(contacts, win, { communicability: false, mode, scope }).metrics;
  const rows = [];
  const candidates = [...new Set(contacts.flatMap((c) => [c.source, c.target]))]
    .filter((id) => idx.identityOf[id] && idx.identityOf[id].status === "PROBABLE_SAME");
  for (const id of candidates.sort()) {
    const events = new Set(contacts.filter((c) => c.source === id || c.target === id).map((c) => c.eventId));
    if (events.size < 2) continue;                               // 창 안에서 한 사건에만 등장하면 병합 영향 없음
    const split = splitNode(contacts, id);
    const after = reachPairs(split, win, mode);
    const lost = [...base].filter((p) => {
      const [s, t] = p.split(">");
      if (s === id || t === id) return false;                    // 분리된 노드 자신의 쌍은 비교 대상 아님
      return !after.has(p);
    });
    const splitM = computeMetrics(split, win, { communicability: false, mode, scope }).metrics;
    const splitBetw = Object.entries(splitM).filter(([k]) => k.startsWith(`${id}@`)).reduce((a, [, m]) => a + m.betweenness, 0);
    rows.push({ id, events: events.size, reachablePairsLost: lost.length, lostExamples: lost.slice(0, 5),
      betweennessMerged: baseM[id] ? baseM[id].betweenness : 0, betweennessSplitSum: splitBetw });
  }
  rows.sort((a, b) => b.reachablePairsLost - a.reachablePairsLost || b.betweennessMerged - a.betweennessMerged);
  return { baselineReachablePairs: base.size, rows, sensitive: rows.filter((r) => r.reachablePairsLost > 0 || r.betweennessMerged !== r.betweennessSplitSum) };
}
