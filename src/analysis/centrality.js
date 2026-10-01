/* ==========================================================================
   Temporal metrics — 모든 정의는 research/methodology.md 와 README에 수식으로 기록.
   입력은 이미 기간·layer·level·theater·certainty·사료유형 필터가 적용된 contacts다.
   정적 PageRank 등 시간을 무시하는 지표는 계산하지 않는다.
   ========================================================================== */
import { toArcs } from "../model/deriveEdges.js";
import { buildAdjacency, earliestArrival } from "./temporalPaths.js";
import { monthsBetween, yearOf } from "../model/dates.js";

/**
 * @param {Array} contacts filterContacts 결과
 * @param {{from:string,to:string}} win 분석 기간(t0, T)
 * @param {object} opts { betweenness=true, communicability=true }
 */
export function computeMetrics(contacts, win, opts = {}) {
  const { betweenness = true, communicability = true } = opts;
  const nodes = [...new Set(contacts.flatMap((c) => [c.source, c.target]))].sort();
  const M = {};
  for (const n of nodes) {
    M[n] = { id: n, inDeg: 0, outDeg: 0, inNbrs: new Set(), outNbrs: new Set(), events: new Set(), dates: [],
      layers: {}, years: new Set(), closeness: 0, reach: 0, betweenness: 0, betweennessNorm: 0, broadcast: 0, receive: 0 };
  }

  /* 1~5: degree, activity, span, persistence, layer diversity */
  for (const c of contacts) {
    const s = M[c.source], t = M[c.target];
    const both = c.direction === "undirected";
    s.outDeg++; t.inDeg++; s.outNbrs.add(c.target); t.inNbrs.add(c.source);
    if (both) { t.outDeg++; s.inDeg++; t.outNbrs.add(c.source); s.inNbrs.add(c.target); }
    for (const x of [s, t]) {
      x.events.add(c.eventId); x.dates.push(c.startDate); x.years.add(yearOf(c.startDate));
      x.layers[c.layer] = (x.layers[c.layer] || 0) + 1;
    }
  }
  const y0 = yearOf(win.from), y1 = yearOf(win.to);
  const nYears = Math.max(1, y1 - y0 + 1);
  for (const n of nodes) {
    const m = M[n];
    m.dates.sort();
    m.firstActive = m.dates[0];
    m.lastActive = m.dates[m.dates.length - 1];
    m.spanMonths = Math.max(0, monthsBetween(m.firstActive, m.lastActive));
    m.activity = m.events.size;
    m.persistence = m.years.size / nYears;
    const counts = Object.values(m.layers), tot = counts.reduce((a, b) => a + b, 0);
    m.layerCount = counts.length;
    const H = counts.reduce((h, k) => h - (k / tot) * Math.log(k / tot), 0);
    m.layerEntropy = counts.length > 1 ? H / Math.log(counts.length) : 0; // 정규화 Shannon entropy
    m.degree = m.inDeg + m.outDeg;
  }

  /* 7. earliest-arrival temporal closeness, 8. temporal betweenness */
  const N = nodes.length;
  if (N > 1) {
    const adj = buildAdjacency(contacts);
    const arcs = toArcs(contacts);
    // 지연시간 기준점 t* = max(분석 시작, 기간 내 첫 contact 시각)
    const firstC = contacts.reduce((m, c) => (c.startDate < m ? c.startDate : m), "9999-99-99");
    const base = firstC > win.from ? firstC : win.from;
    for (const s of nodes) {
      const { arrival, hops } = earliestArrival(adj, [s], win.from, win.to);
      // closeness: (1/(N-1)) Σ 1/(1+Δ개월),  Δ = a(v) − t*  (도달 못하면 0)
      let cl = 0, reach = 0;
      for (const [v, a] of arrival) {
        if (v === s) continue;
        reach++;
        const d = Math.max(0, monthsBetween(base, a));
        cl += 1 / (1 + d);
      }
      M[s].closeness = cl / (N - 1);
      M[s].reach = reach;
      if (!betweenness) continue;
      // 라벨 최적 predecessor DAG
      const preds = new Map();
      for (const arc of arcs) {
        if (!arrival.has(arc.u) || !arrival.has(arc.v) || arc.v === s) continue;
        const au = arrival.get(arc.u);
        if (arc.end < au) continue;
        const tau = arc.start > au ? arc.start : au;
        if (tau > win.to) continue;
        if (tau === arrival.get(arc.v) && hops.get(arc.u) + 1 === hops.get(arc.v)) {
          if (!preds.has(arc.v)) preds.set(arc.v, new Set());
          preds.get(arc.v).add(arc.u);
        }
      }
      const order = [...arrival.keys()].sort((x, y) => {
        const ax = arrival.get(x), ay = arrival.get(y);
        return ax < ay ? -1 : ax > ay ? 1 : hops.get(x) - hops.get(y);
      });
      const sigma = new Map([[s, 1]]);
      for (const v of order) {
        if (v === s) continue;
        let sg = 0;
        for (const u of preds.get(v) || []) sg += sigma.get(u) || 0;
        sigma.set(v, sg);
      }
      const delta = new Map();
      for (let i = order.length - 1; i >= 0; i--) {
        const w = order[i];
        const dw = delta.get(w) || 0;
        for (const u of preds.get(w) || []) {
          delta.set(u, (delta.get(u) || 0) + (sigma.get(u) / sigma.get(w)) * (1 + dw));
        }
        if (w !== s) M[w].betweenness += dw;
      }
    }
    const norm = (N - 1) * (N - 2);
    for (const n of nodes) M[n].betweennessNorm = norm > 0 ? M[n].betweenness / norm : 0;
  }

  /* 9. broadcast / receive (Grindrod et al. 2011 dynamic communicability) */
  if (communicability && N > 0) {
    const { broadcast, receive, alpha, slices } = dynamicCommunicability(contacts, nodes);
    nodes.forEach((n, i) => { M[n].broadcast = broadcast[i]; M[n].receive = receive[i]; });
    M.__meta = { alpha, slices };
  }
  const meta = M.__meta || {};
  delete M.__meta;
  return { nodes, metrics: M, meta: { ...meta, N, years: nYears } };
}

/* ---------------- Dynamic communicability ----------------
   시간 조각(slice) = 서로 다른 날짜. A[k]는 그 날짜의 방향 인접행렬(0/1).
   Q = (I − αA[1])^-1 (I − αA[2])^-1 … (I − αA[K])^-1
   α = min(0.5, 0.9 / max_k ρ(A[k]))   (ρ: 스펙트럼 반지름, 거듭제곱법으로 추정)
   broadcast_i = Σ_j (Q − I)_ij,  receive_j = Σ_i (Q − I)_ij
*/
export function dynamicCommunicability(contacts, nodes) {
  const N = nodes.length, ix = new Map(nodes.map((n, i) => [n, i]));
  const byDate = new Map();
  for (const a of toArcs(contacts)) {
    // 구간 contact는 시작일 slice에 넣는다(현재 데이터의 관계는 모두 단일 날짜).
    if (!byDate.has(a.start)) byDate.set(a.start, []);
    byDate.get(a.start).push(a);
  }
  const dates = [...byDate.keys()].sort();
  const mats = dates.map((d) => {
    const A = Array.from({ length: N }, () => new Float64Array(N));
    for (const a of byDate.get(d)) A[ix.get(a.u)][ix.get(a.v)] = 1;
    return A;
  });
  let rho = 0;
  for (const A of mats) rho = Math.max(rho, spectralRadius(A));
  const alpha = rho > 0 ? Math.min(0.5, 0.9 / rho) : 0.5;
  let Q = identity(N);
  for (const A of mats) {
    const B = identity(N);
    for (let i = 0; i < N; i++) for (let j = 0; j < N; j++) B[i][j] -= alpha * A[i][j];
    Q = matMul(Q, invert(B));
  }
  const broadcast = new Array(N).fill(0), receive = new Array(N).fill(0);
  for (let i = 0; i < N; i++) for (let j = 0; j < N; j++) {
    const v = Q[i][j] - (i === j ? 1 : 0);
    broadcast[i] += v; receive[j] += v;
  }
  return { broadcast, receive, alpha, slices: dates.length };
}

function identity(N) { return Array.from({ length: N }, (_, i) => { const r = new Float64Array(N); r[i] = 1; return r; }); }
function matMul(A, B) {
  const N = A.length, C = Array.from({ length: N }, () => new Float64Array(N));
  for (let i = 0; i < N; i++) for (let k = 0; k < N; k++) { const a = A[i][k]; if (!a) continue; const Bk = B[k], Ci = C[i]; for (let j = 0; j < N; j++) Ci[j] += a * Bk[j]; }
  return C;
}
function invert(M) {
  const N = M.length, A = M.map((r) => Float64Array.from(r)), I = identity(N);
  for (let c = 0; c < N; c++) {
    let p = c; for (let r = c + 1; r < N; r++) if (Math.abs(A[r][c]) > Math.abs(A[p][c])) p = r;
    [A[c], A[p]] = [A[p], A[c]]; [I[c], I[p]] = [I[p], I[c]];
    const d = A[c][c];
    if (Math.abs(d) < 1e-12) throw new Error("singular matrix in communicability");
    for (let j = 0; j < N; j++) { A[c][j] /= d; I[c][j] /= d; }
    for (let r = 0; r < N; r++) if (r !== c && A[r][c]) { const f = A[r][c]; for (let j = 0; j < N; j++) { A[r][j] -= f * A[c][j]; I[r][j] -= f * I[c][j]; } }
  }
  return I;
}
function spectralRadius(A) {
  const N = A.length;
  if (!A.some((r) => r.some((x) => x))) return 0;
  let v = new Float64Array(N).fill(1 / Math.sqrt(N)), lam = 0;
  for (let it = 0; it < 200; it++) {
    const w = new Float64Array(N);
    for (let i = 0; i < N; i++) for (let j = 0; j < N; j++) w[i] += A[i][j] * v[j];
    const norm = Math.hypot(...w);
    if (norm < 1e-12) return 0; // 멱영(nilpotent) 행렬: ρ = 0
    const next = norm / Math.hypot(...v);
    v = w.map((x) => x / norm);
    if (Math.abs(next - lam) < 1e-9) return next;
    lam = next;
  }
  return lam;
}

/* ---------- 인물 서사 지표(주인공 자동 선정 없음, 지표만 제시) ---------- */
const CENTER = new Set(["L0", "L1", "L2"]), FIELD = new Set(["L3", "L4", "L5", "L6"]);
export function personProfile(idx, personId, contacts) {
  const mine = contacts.filter((c) => c.source === personId || c.target === personId);
  const evIds = new Set(idx.eventsByPerson[personId] || []);
  const evs = [...evIds].map((id) => idx.eventsById[id]);
  const places = new Set(evs.flatMap((e) => e.placeIds));
  const count = (pred) => mine.filter(pred).length;
  const isOut = (c) => c.source === personId, isIn = (c) => c.target === personId;
  const bridge = count((c) => {
    const a = idx.levelAt(c.source, c.startDate), b = idx.levelAt(c.target, c.startDate);
    return (CENTER.has(a) && FIELD.has(b)) || (FIELD.has(a) && CENTER.has(b));
  });
  return {
    firstSeen: idx.firstSeen[personId], lastSeen: idx.lastSeen[personId],
    spanMonths: idx.firstSeen[personId] ? Math.max(0, monthsBetween(idx.firstSeen[personId], idx.lastSeen[personId])) : 0,
    eventCount: evIds.size,
    relationCount: mine.length,
    layerDiversity: new Set(mine.map((c) => c.layer)).size,
    placeDiversity: places.size,
    centralFieldBridges: bridge,
    reportsSent: count((c) => isOut(c) && c.layer === "REPORT"),
    reportsReceived: count((c) => isIn(c) && c.layer === "REPORT"),
    commandsGiven: count((c) => isOut(c) && c.layer === "COMMAND"),
    commandsReceived: count((c) => isIn(c) && c.layer === "COMMAND"),
    combat: count((c) => c.layer === "MILITARY_CONFLICT" || c.layer === "MILITARY_ACTION"),
    rewards: count((c) => isIn(c) && c.layer === "REWARD"),
    punishments: count((c) => isIn(c) && (c.layer === "PUNISHMENT" || c.layer === "ACCOUNTABILITY")),
    harms: evs.filter((e) => (e.victims || []).includes(personId)).length,
    policyParticipation: count((c) => c.layer === "POLICY") + evs.filter((e) => (e.decisionMakers || []).includes(personId)).length,
    places: [...places]
  };
}
