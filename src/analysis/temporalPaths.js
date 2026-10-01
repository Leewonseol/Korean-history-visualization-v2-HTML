/* ==========================================================================
   Time-respecting paths (불확실한 날짜를 정직하게 다루는 버전)
   ---------------------------------------------------------------------------
   contact c: u → v, 시각 범위 [tMin, tMax] (null = 미상), timeKind instant|duration
   이동 시간 = 0 (같은 날 연쇄 허용 — 단, 같은 날 연쇄는 '부분 순서'로 표시)

   두 가지 순서 판정 모드
   CERTAIN_ORDER(확실한 순서, 분석 기본값)
     instant  : 직전 도착 a 이후임이 확실해야 사용 → tMin ≠ null, tMin ≥ a.  새 도착 = tMax (보수적)
     duration : 지속 구간이 a 이후까지 이어져야 사용 → tMin·tMax ≠ null, tMax ≥ a. 새 도착 = max(a, tMin)
   TEMPORALLY_NOT_EXCLUDED(시간상 배제되지 않음)
     lo = tMin ?? −∞, hi = tMax ?? +∞.  hi ≥ a 이면 사용. 새 도착 = max(a, lo) (낙관적)
     — 시간 정보와 모순되지 않을 뿐 실제 순서를 입증하지 않는다.

   두 모드 모두 도착 시각이 단조 비감소이므로 (도착, hop) 사전식 label-setting(Dijkstra형)이 정당하다.
   pathEligible=false 관계('~에 관한' 주장 등)는 analysisContacts 단계에서 이미 빠진다.

   경로 플래그(classifyPath)
     EXACT         : 모든 관계가 일 단위 단일 날짜이고, 단계마다 날짜가 엄격히 증가
     PARTIAL_ORDER : 순서는 확실하지만 같은 날 연쇄 또는 범위 날짜가 섞여 정확한 시각은 모름
     UNCERTAIN     : 적어도 한 단계의 순서가 날짜만으로는 확정되지 않음 — 시간 정보상 모순되지 않지만 실제 순서를 입증하지 않음
                     (TEMPORALLY_NOT_EXCLUDED 모드에서만 발생)
   근거 범위: 입력 contacts는 model/evidence.js assertScope로 검사한다(기본 범위에서 해석·legacy가 섞이면 실패).
   ========================================================================== */
import { toArcs } from "../model/deriveEdges.js";
import { MIN_BOUND, MAX_BOUND } from "../model/dates.js";
import { assertScope } from "../model/evidence.js";

export const PATH_MODES = ["CERTAIN_ORDER", "TEMPORALLY_NOT_EXCLUDED"];
const checkMode = (m) => { if (!PATH_MODES.includes(m)) throw new Error(`unknown path mode ${m}`); return m; };

/** 시각 t에 u에 도착했을 때 arc를 지나 v에 도착하는 시각(못 쓰면 null) */
export function traverse(arc, t, mode = "CERTAIN_ORDER", T = MAX_BOUND) {
  const c = arc.contact;
  let next;
  if (checkMode(mode) === "CERTAIN_ORDER") {
    if (c.tMin === null || c.tMax === null) return null;
    if (c.timeKind === "duration") { if (c.tMax < t) return null; next = c.tMin > t ? c.tMin : t; }
    else { if (c.tMin < t) return null; next = c.tMax; }
  } else {
    const lo = c.tMin ?? MIN_BOUND, hi = c.tMax ?? MAX_BOUND;
    if (hi < t) return null;
    next = lo > t ? lo : t;
  }
  return next > T ? null : next;
}

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
 * @returns {{arrival:Map, hops:Map, pred:Map}}
 */
export function earliestArrival(adj, sources, t0, T = MAX_BOUND, mode = "CERTAIN_ORDER") {
  const arrival = new Map(), hops = new Map(), pred = new Map();
  const heap = new Heap();
  for (const s of sources) { arrival.set(s, t0); hops.set(s, 0); heap.push({ n: s, t: t0, h: 0 }); }
  while (heap.size) {
    const { n, t, h } = heap.pop();
    if (t !== arrival.get(n) || h !== hops.get(n)) continue; // 낡은 항목
    for (const arc of adj.get(n) || []) {
      const tau = traverse(arc, t, mode, T);
      if (tau === null) continue;
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
export function temporalPath(contacts, sources, target, t0, T, mode = "CERTAIN_ORDER", scope) {
  assertScope(contacts, scope, "temporalPath");
  const adj = buildAdjacency(contacts);
  const res = earliestArrival(adj, sources, t0, T, mode);
  if (!res.arrival.has(target) || sources.includes(target)) return null;
  const steps = [];
  let cur = target;
  while (!sources.includes(cur)) {
    const p = res.pred.get(cur);
    steps.push({ from: p.from, to: cur, time: p.time, contact: p.arc.contact });
    cur = p.from;
  }
  steps.reverse();
  return { steps, arrival: res.arrival.get(target), hops: steps.length, mode, flag: classifyPath(steps, t0) };
}

/** 경로 플래그: EXACT / PARTIAL_ORDER / UNCERTAIN (위 설명 참조) */
export function classifyPath(steps, t0 = MIN_BOUND) {
  let cons = t0, certain = true, allExact = true, strictlyIncreasing = true, prevExact = null;
  for (const s of steps) {
    const c = s.contact;
    const next = traverse({ contact: c }, cons, "CERTAIN_ORDER");
    if (next === null) { certain = false; cons = c.tMax ?? cons; }
    else cons = next;
    if (!c.exact) allExact = false;
    if (c.exact && prevExact !== null && c.tMin <= prevExact) strictlyIncreasing = false;
    prevExact = c.exact ? c.tMin : null;
  }
  if (!certain) return "UNCERTAIN";
  return allExact && strictlyIncreasing ? "EXACT" : "PARTIAL_ORDER";
}

/** 경로가 시간을 역행하지 않는지 검사(테스트·UI 검증용). mode에 맞는 순서 규칙으로 다시 따라간다. */
export function isTimeRespecting(steps, t0 = MIN_BOUND, mode = "CERTAIN_ORDER") {
  let t = t0;
  for (let i = 0; i < steps.length; i++) {
    const s = steps[i];
    if (i > 0 && s.from !== steps[i - 1].to) return false;
    if (!s.contact.pathEligible) return false;
    const next = traverse({ contact: s.contact }, t, mode);
    if (next === null || next !== s.time) return false;
    t = next;
  }
  return true;
}

/**
 * 피드백 루프: anchor → … → x → anchor 의 time-respecting 순환.
 * x마다 가장 이른 귀환 루프 하나를 돌려준다. 플래그는 경로와 같은 규칙.
 */
export function feedbackLoops(contacts, anchor, t0, T, mode = "CERTAIN_ORDER", scope) {
  assertScope(contacts, scope, "feedbackLoops");
  const adj = buildAdjacency(contacts);
  const res = earliestArrival(adj, [anchor], t0, T, mode);
  const loops = [];
  const seen = new Set();
  const arcs = toArcs(contacts).filter((a) => a.v === anchor && a.u !== anchor);
  const cands = [];
  for (const arc of arcs) {
    const x = arc.u;
    if (!res.arrival.has(x)) continue;
    const back = traverse(arc, res.arrival.get(x), mode, T);
    if (back !== null) cands.push({ arc, x, back });
  }
  cands.sort((a, b) => (a.back < b.back ? -1 : a.back > b.back ? 1 : 0));
  for (const { arc, x, back } of cands) {
    if (seen.has(x)) continue;
    const out = [];
    let cur = x;
    while (cur !== anchor) { const p = res.pred.get(cur); out.push({ from: p.from, to: cur, time: p.time, contact: p.arc.contact }); cur = p.from; }
    out.reverse();
    out.push({ from: x, to: anchor, time: back, contact: arc.contact });
    seen.add(x);
    loops.push({ via: x, steps: out, closedAt: back, mode, flag: classifyPath(out, t0) });
  }
  return loops;
}
