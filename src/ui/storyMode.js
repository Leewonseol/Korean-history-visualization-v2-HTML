/* 스토리 모드: 장면별로 타임라인 커서를 옮기고 장면 사건의 참여자만 강조한다. */
import { STORY_SCENES } from "../data/story.js";
import { PARTICIPANT_FIELDS } from "../model/indexes.js";

export function createStoryMode(idx, api) {
  const $ = (id) => document.getElementById(id);
  let i = 0, on = false;
  const scenes = STORY_SCENES.filter((s) => s.eventIds.every((e) => idx.eventsById[e]));

  function show() {
    const s = scenes[i];
    const last = s.eventIds.map((e) => idx.events.indexOf(idx.eventsById[e])).reduce((a, b) => Math.max(a, b), 0);
    api.setCursor(last);
    const focus = new Set();
    s.eventIds.forEach((id) => {
      const ev = idx.eventsById[id];
      PARTICIPANT_FIELDS.forEach((f) => (ev[f] || []).forEach((p) => focus.add(p)));
      (ev.relations || []).forEach((r) => { focus.add(r.source); focus.add(r.target); });
    });
    api.spotlight([...focus]);
    $("storyTitle").textContent = s.title;
    $("storyNarration").textContent = s.narration;
    $("storyStep").textContent = `${i + 1} / ${scenes.length}`;
  }
  function start() { on = true; i = 0; $("storyOverlay").classList.remove("hidden"); show(); }
  function exit() { on = false; $("storyOverlay").classList.add("hidden"); api.spotlight(null); }
  $("btnStoryMode").addEventListener("click", () => (on ? exit() : start()));
  $("storyExit").addEventListener("click", exit);
  $("storyNext").addEventListener("click", () => { i = Math.min(scenes.length - 1, i + 1); show(); });
  $("storyPrev").addEventListener("click", () => { i = Math.max(0, i - 1); show(); });
  return { isOn: () => on, exit };
}
