/* ==========================================================================
   하단 사건 타임라인
   - 슬라이더 max = EVENTS.length - 1 (하드코딩 없음)
   - 연도 축·jump 버튼은 COVERAGE 레지스트리에서, 사건 분포 strip은 EVENTS에서 자동 생성
   - NOT_COVERED 연도는 '현재 검증팩에서 미조사/미수록'으로 표시한다('사건 없음'이 아님)
   - 연·월 단위 사건은 점이 아니라 구간으로, '기사일 이전' 사건은 기사일에 '이전' 표시로 그린다
   ========================================================================== */
import { monthIndex, yearOf, formatDate, formatRange } from "../model/dates.js";
import { CERTAINTY, COVERAGE_STATUS, COVERAGE_SCOPE } from "../data/vocab.js";

export const NOT_COVERED_LABEL = "현재 검증팩에서 미조사/미수록";

export function createTimeline(idx, state, setCursor) {
  const $ = (id) => document.getElementById(id);
  const ev = idx.events;
  const slider = $("timelineSlider");
  slider.min = 0;
  slider.max = ev.length - 1;
  slider.addEventListener("input", () => { stop(); setCursor(+slider.value); });

  // 연도 이동: coverage 상태를 그대로 보여 준다
  const y0 = idx.years[0], y1 = idx.years[idx.years.length - 1];
  const yearBtns = [];
  for (const y of idx.years) {
    const cov = idx.coverageByYear[y];
    const first = ev.findIndex((e) => yearOf(idx.sortDateOf(e)) === y);
    if (cov.coverageStatus === "NOT_COVERED" || first < 0) {
      yearBtns.push(`<button type="button" class="not-covered cov-${cov.coverageStatus}" data-year="${y}" disabled
        title="${y}: ${cov.coverageStatus === "NOT_COVERED" ? NOT_COVERED_LABEL : COVERAGE_STATUS[cov.coverageStatus]} — ${cov.note.replace(/"/g, "'")}">${y}<small>${cov.coverageStatus === "NOT_COVERED" ? " 미수록" : ""}</small></button>`);
    } else {
      const part = cov.scopeStatus === "PARTIAL";
      yearBtns.push(`<button type="button" class="cov-${cov.coverageStatus} scope-${cov.scopeStatus}" data-year="${y}" data-idx="${first}" title="${y}: ${COVERAGE_STATUS[cov.coverageStatus]} · 조사 범위 ${cov.scopeStatus} — ${COVERAGE_SCOPE[cov.scopeStatus]}${cov.scopeStatus === "FULL" ? " (전수 조사 완료 아님)" : ""}${part ? ` (${cov.scope}) — 다른 연도와 사건 수를 단순 비교하지 말 것` : ""}">${y}${part ? "<small> 부분</small>" : ""}</button>`);
    }
  }
  $("yearJumps").innerHTML = yearBtns.join("");
  $("yearJumps").addEventListener("click", (e) => {
    const b = e.target.closest("button[data-idx]");
    if (b && !b.disabled) { stop(); setCursor(+b.dataset.idx); }
  });

  // 사건 분포 strip
  const m0 = monthIndex(`${y0}-01-01`), m1 = monthIndex(`${y1}-12-30`);
  const pct = (d) => ((monthIndex(d) - m0) / (m1 - m0)) * 100;
  let strip = "";
  for (const y of idx.years) {
    strip += `<span class="strip-year" style="left:${pct(`${y}-01-01`)}%">${String(y).slice(2)}</span>`;
    const cy = idx.coverageByYear[y];
    if (cy.scopeStatus === "PARTIAL") {
      if (cy.scopeFrom > `${y}-01-01`) strip += `<span class="strip-out" style="left:${pct(`${y}-01-01`)}%;width:${pct(cy.scopeFrom) - pct(`${y}-01-01`)}%" title="${y}: 조사 범위 밖(${cy.scope})"></span>`;
      if (cy.scopeTo < `${y}-12-30`) strip += `<span class="strip-out" style="left:${pct(cy.scopeTo)}%;width:${pct(`${y}-12-30`) - pct(cy.scopeTo)}%" title="${y}: 조사 범위 밖(${cy.scope})"></span>`;
    }
    if (cy.coverageStatus === "NOT_COVERED") {
      strip += `<span class="strip-nc" style="left:${pct(`${y}-01-01`)}%;width:${pct(`${y}-12-30`) - pct(`${y}-01-01`)}%" title="${y}: ${NOT_COVERED_LABEL}">미수록</span>`;
    }
  }
  ev.forEach((e, i) => {
    const g = idx.evidenceOfEvent(e);
    const tip = `${formatRange(e.dateMin, e.dateMax, e.datePrecision)} ${e.title.replace(/"/g, "'")} (${CERTAINTY[e.certainty].badge} · ${e.provenance})`;
    if (e.datePrecision === "YEAR" || e.datePrecision === "MONTH") {
      const l = pct(e.dateMin), w = Math.max(0.6, pct(e.dateMax) - l);
      strip += `<button type="button" class="strip-tick strip-span c-${e.certainty} v-${g}" data-i="${i}" style="left:${l}%;width:${w}%" title="${tip}"></button>`;
    } else {
      const before = e.dateMin == null ? " d-before" : "";
      strip += `<button type="button" class="strip-tick c-${e.certainty} v-${g}${before}" data-i="${i}" style="left:${pct(idx.sortDateOf(e))}%" title="${tip}"></button>`;
    }
  });
  strip += `<span class="strip-cursor" id="stripCursor"></span>`;
  $("eventStrip").innerHTML = strip;
  $("eventStrip").addEventListener("click", (e) => { const t = e.target.closest(".strip-tick"); if (t) { stop(); setCursor(+t.dataset.i); } });

  // 재생 컨트롤
  let timer = null;
  const speed = () => +$("speedSelect").value;
  function stop() { if (timer) clearInterval(timer); timer = null; $("btnPlayPause").textContent = "▶ 재생"; }
  function play() {
    if (state.cursor >= ev.length - 1) setCursor(0);
    $("btnPlayPause").textContent = "⏸ 일시정지";
    timer = setInterval(() => {
      if (state.cursor >= ev.length - 1) return stop();
      setCursor(state.cursor + 1);
    }, 2200 / speed());
  }
  $("btnPlayPause").addEventListener("click", () => (timer ? stop() : play()));
  $("btnFirst").addEventListener("click", () => { stop(); setCursor(0); });
  $("btnPrev").addEventListener("click", () => { stop(); setCursor(Math.max(0, state.cursor - 1)); });
  $("btnNext").addEventListener("click", () => { stop(); setCursor(Math.min(ev.length - 1, state.cursor + 1)); });
  $("speedSelect").addEventListener("change", () => { if (timer) { stop(); play(); } });

  function render(passesFilter) {
    const e = ev[state.cursor];
    slider.value = state.cursor;
    const span = formatRange(e.dateMin, e.dateMax, e.datePrecision);
    const sameAsRecord = e.recordDate && e.dateMin === e.recordDate && e.dateMax === e.recordDate;
    $("currentDate").textContent = sameAsRecord || !e.recordDate ? span : `${span} (기사 ${formatDate(e.recordDate)})`;
    $("currentEventTitle").textContent = e.title;
    $("currentCounter").textContent = `${state.cursor + 1} / ${ev.length}`;
    $("stripCursor").style.left = `${pct(idx.sortDateOf(e))}%`;
    document.querySelectorAll(".strip-tick").forEach((t, i) => {
      t.classList.toggle("on", i === state.cursor);
      t.classList.toggle("filtered", !passesFilter(ev[i]));
    });
    document.querySelectorAll("#yearJumps button").forEach((b) => b.classList.toggle("on", +b.dataset.year === yearOf(idx.sortDateOf(e))));
  }
  return { render, stop };
}
