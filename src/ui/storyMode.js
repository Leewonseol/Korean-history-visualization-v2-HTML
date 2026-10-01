/* 스토리 모드: 장면별로 타임라인 커서를 옮기고 장면 사건의 참여자만 강조한다.
   장면 서술은 문장 단위 근거(eventIds·sourceIds·narrativeStatus·provenance)를 함께 보여 준다.
   legacy 문장은 'legacy 포함', 해석 문장은 '해석 포함' 토글이 켜졌을 때만 보이고, 숨긴 수를 밝힌다. */
import { PARTICIPANT_FIELDS } from "../model/indexes.js";
import { evidenceAllowed } from "../model/temporalNetwork.js";
import { NARRATIVE_STATUS } from "../data/vocab.js";
import { esc, evidenceBadge } from "./format.js";

export function createStoryMode(idx, scenesData, api) {
  const $ = (id) => document.getElementById(id);
  let i = 0, on = false;
  const scenes = scenesData.filter((s) => s.eventIds.every((e) => idx.eventsById[e]));

  function show() {
    const s = scenes[i];
    const f = api.filters();
    const visible = s.statements.filter((st) => evidenceAllowed(idx.evidenceOf(st.provenance), f));
    const hidden = s.statements.length - visible.length;
    const evIds = [...new Set(visible.flatMap((st) => st.eventIds))];
    const anchorIds = evIds.length ? evIds : s.eventIds;
    const last = anchorIds.map((e) => idx.events.indexOf(idx.eventsById[e])).reduce((a, b) => Math.max(a, b), 0);
    api.setCursor(last);
    const focus = new Set();
    evIds.forEach((id) => {
      const ev = idx.eventsById[id];
      PARTICIPANT_FIELDS.forEach((k) => (ev[k] || []).forEach((p) => focus.add(p)));
      (ev.relations || []).filter((r) => evidenceAllowed(idx.evidenceOf(r.provenance), f))
        .forEach((r) => { focus.add(r.source); focus.add(r.target); });
    });
    api.spotlight([...focus]);
    $("storyTitle").textContent = s.title;
    $("storyNarration").innerHTML = `<ul class="story-statements">${visible.map((st) => `<li class="ns-${esc(st.narrativeStatus)}">
        ${esc(st.text)} <span class="story-src" title="${esc(NARRATIVE_STATUS[st.narrativeStatus])}">${evidenceBadge(st.provenance)}
        <small>${esc(st.narrativeStatus)} · ${st.sourceIds.map(esc).join(", ")}</small></span></li>`).join("")}</ul>
      ${hidden ? `<p class="muted small">legacy·해석 문장 ${hidden}개 숨김 — 왼쪽 '근거' 토글로 표시</p>` : ""}`;
    $("storyStep").textContent = `${i + 1} / ${scenes.length}`;
  }
  function start() { on = true; i = 0; $("storyOverlay").classList.remove("hidden"); show(); }
  function exit() { on = false; $("storyOverlay").classList.add("hidden"); api.spotlight(null); }
  $("btnStoryMode").addEventListener("click", () => (on ? exit() : start()));
  $("storyExit").addEventListener("click", exit);
  $("storyNext").addEventListener("click", () => { i = Math.min(scenes.length - 1, i + 1); show(); });
  $("storyPrev").addEventListener("click", () => { i = Math.max(0, i - 1); show(); });
  return { isOn: () => on, exit, refresh: () => on && show() };
}
