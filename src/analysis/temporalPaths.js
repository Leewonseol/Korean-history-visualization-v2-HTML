/* ==========================================================================
   Time-respecting paths
   ---------------------------------------------------------------------------
   contact = (u → v, [start, end])  — 날짜 문자열(사전순 = 시간순)
   이동 시간(traversal time) = 0 으로 둔다(같은 날 연쇄 허용).

   경로 P = (c1, c2, …, ck), 각 ci 에서 실제 사용 시각 τi ∈ [start_i, end_i] 이고
     τ1 ≥ t0,  τ1 ≤ τ2 ≤ … ≤ τk ≤ T
   일 때만 time-respecting 이다. (A→B가 t1, B→C가 t2 이면 t1 ≤ t2 일 때만 A→B→C 성립)

   라벨 L(v) = (a(v), h(v)) 를 사전식(lexicographic)으로 최소화하는 label-setting(Dijkstra형)
   알고리즘으로 계산한다.
     a(v): 가장 이른 도착 시각(earliest arrival / foremost)
     h(v): 그 라벨을 만든 경로의 hop 수
   경로를 따라가는 비용 (τ, hop)은 단조 증가하므로 label-setting이 정당하다.
   여기서 계산되는 경로는 "모든 접두부(prefix)가 라벨 최적인 foremost 경로"다
   (methodology.md §5 참조).
   ========================================================================== */
import { toArcs } from "../model/deriveEdges.js";

function better(a1, h1, a2, h2) {
  if (a2 === undefined) return true;
  return a1 < a2 || (a1 === a2 && h1 < h2);
}

// 간단한 이진 힙
class Heap {
  constructor() { this.a = []; }
  push(x) { const a = this.a; a.push(x); let i = a.length - 1; while (i > 0) { const p = (i - 1) >> 1; if (lt(a[p], a[i])) break; [a[p], a[i]] = [a[i], a[p]]; i = p; } }
  pop() {
    const a = this.a, top = a[0], last = a.pop();
    if (a.length) { a[0] = last; let i = 0; for (;;) { const l = 2 * i + 1, r = l + 1; let m = i; if (l < a.length && lt(a[l], a[m])) m = l; if (r < a.length && lt(a[r], a[m])) m = r; if (m === i) break; [a[m], a[i]] = [a[i], a[m]]; i = m; } }
    return top;
  }
  get size() { return this.a.length; }
}
function lt(x, y) { return x.t < y.t || (x.t === y.t && x.h < y.h); }

export function buildAdjacency(contacts) {
  const out = new Map();
  for (const arc of toArcs(contacts)) {
    if (!out.has(arc.u)) out.set(arc.u, []);
    out.get(arc.u).push(arc);
  }
  return out;
}

/**
 * 단일/복수 출발점에서의 earliest-arrival(라벨 최적) 탐색
 * @param {Map} adj      buildAdjacency 결과
 * @param {string[]} sources 출발 노드(사건에서 출발할 때는 그 사건의 행위자들)
 * @param {string} t0    출발 가능 시각(이 시각 이후의 contact만 사용)
 * @param {string} T     마감 시각
 * @returns {{arrival:Map, hops:Map, pred:Map}}
 */
export function earliestArrival(adj, sources, t0, T = "9999-99-99") {
  const arrival = new Map(), hops = new Map(), pred = new Map();
  const heap = new Heap();
  for (const s of sources) { arrival.set(s, t0); hops.set(s, 0); heap.push({ n: s, t: t0, h: 0 }); }
  while (heap.size) {
    const { n, t, h } = heap.pop();
    if (t !== arrival.get(n) || h !== hops.get(n)) continue; // 낡은 항목
    for (const arc of adj.get(n) || []) {
      if (arc.end < t || arc.start > T) continue;            // 이미 끝난 contact는 쓸 수 없다(시간 역행 금지)
      const tau = arc.start > t ? arc.start : t;              // 사용 시각 = max(도착시각, contact 시작)
      if (tau > T) continue;
      const nh = h + 1;
      if (better(tau, nh, arrival.get(arc.v), hops.get(arc.v))) {
        arrival.set(arc.v, tau); hops.set(arc.v, nh);
        pred.set(arc.v, { from: n, arc, time: tau });
        heap.push({ n: arc.v, t: tau, h: nh });
      }
    }
  }
  return { arrival, hops, pred };
}

/** 출발점 집합 → target 까지의 time-respecting 경로(단계 목록) 또는 null */
export function temporalPath(contacts, sources, target, t0, T) {
  const adj = buildAdjacency(contacts);
  const res = earliestArrival(adj, sources, t0, T);
  if (!res.arrival.has(target) || sources.includes(target)) return null;
  const steps = [];
  let cur = target;
  while (!sources.includes(cur)) {
    const p = res.pred.get(cur);
    steps.push({ from: p.from, to: cur, time: p.time, contact: p.arc.contact });
    cur = p.from;
  }
  steps.reverse();
  return { steps, arrival: res.arrival.get(target), hops: steps.length };
}

/** 경로가 시간을 역행하지 않는지 검사(테스트·UI 검증용) */
export function isTimeRespecting(steps, t0 = "0000-00-00") {
  let prev = t0;
  for (const s of steps) {
    const c = s.contact;
    if (s.time < prev) return false;
    if (s.time < c.startDate || s.time > c.endDate) return false;
    prev = s.time;
  }
  for (let i = 1; i < steps.length; i++) if (steps[i].from !== steps[i - 1].to) return false;
  return true;
}

/**
 * 피드백 루프: anchor → … → x → anchor 의 time-respecting 순환.
 * anchor에서 t0에 출발해 x에 a(x)에 도착하고, x→anchor contact가 a(x) 이후에 존재하면 루프.
 * x마다 가장 이른 귀환 루프 하나를 돌려준다.
 */
export function feedbackLoops(contacts, anchor, t0, T) {
  const adj = buildAdjacency(contacts);
  const res = earliestArrival(adj, [anchor], t0, T);
  const loops = [];
  const seen = new Set();
  const arcs = toArcs(contacts).filter((a) => a.v === anchor && a.u !== anchor)
    .sort((a, b) => (a.start < b.start ? -1 : 1));
  for (const arc of arcs) {
    const x = arc.u;
    if (seen.has(x) || !res.arrival.has(x)) continue;
    const ax = res.arrival.get(x);
    if (arc.end < ax || arc.start > T) continue;
    const back = arc.start > ax ? arc.start : ax;
    const out = [];
    let cur = x;
    while (cur !== anchor) { const p = res.pred.get(cur); out.push({ from: p.from, to: cur, time: p.time, contact: p.arc.contact }); cur = p.from; }
    out.reverse();
    out.push({ from: x, to: anchor, time: back, contact: arc.contact });
    seen.add(x);
    loops.push({ via: x, steps: out, closedAt: back });
  }
  return loops.sort((a, b) => (a.closedAt < b.closedAt ? -1 : 1));
}
