/* ==========================================================================
   하단 사건 타임라인
   - 슬라이더 max = EVENTS.length - 1 (하드코딩 없음)
   - 연도 jump 버튼과 사건 분포 strip은 EVENTS에서 자동 생성
   ========================================================================== */
import { monthIndex, yearOf, formatDate } from "../model/dates.js";
import { CERTAINTY } from "../data/vocab.js";

export function createTimeline(idx, state, setCursor) {
  const $ = (id) => document.getElementById(id);
  const ev = idx.events;
  const slider = $("timelineSlider");
  slider.min = 0;
  slider.max = ev.length - 1;
  slider.addEventListener("input", () => { stop(); setCursor(+slider.value); });

  // 연도 이동: 사건이 있는 연도만 활성
  const y0 = idx.years[0], y1 = idx.years[idx.years.length - 1];
  const yearBtns = [];
  for (let y = y0; y <= y1; y++) {
    const first = ev.findIndex((e) => yearOf(e.eventDate) === y);
    yearBtns.push(`<button type="button" data-year="${y}" ${first < 0 ? "disabled title='이 연도에는 아직 데이터에 사건이 없습니다'" : ""} data-idx="${first}">${y}</button>`);
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
  for (let y = y0; y <= y1; y++) strip += `<span class="strip-year" style="left:${pct(`${y}-01-01`)}%">${String(y).slice(2)}</span>`;
  ev.forEach((e, i) => {
    strip += `<button type="button" class="strip-tick c-${e.certainty} v-${e.verification}" data-i="${i}" style="left:${pct(e.eventDate)}%" title="${e.eventDate} ${e.title.replace(/"/g, "'")} (${CERTAINTY[e.certainty].badge})"></button>`;
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
    const span = e.eventEndDate ? `${formatDate(e.eventDate)}~${formatDate(e.eventEndDate)}` : formatDate(e.eventDate);
    $("currentDate").textContent = e.eventDate === e.recordDate ? span : `${span} (기록 ${formatDate(e.recordDate)})`;
    $("currentEventTitle").textContent = e.title;
    $("currentCounter").textContent = `${state.cursor + 1} / ${ev.length}`;
    $("stripCursor").style.left = `${pct(e.eventDate)}%`;
    document.querySelectorAll(".strip-tick").forEach((t, i) => {
      t.classList.toggle("on", i === state.cursor);
      t.classList.toggle("filtered", !passesFilter(ev[i]));
    });
    document.querySelectorAll("#yearJumps button").forEach((b) => b.classList.toggle("on", +b.dataset.year === yearOf(e.eventDate)));
  }
  return { render, stop };
}
