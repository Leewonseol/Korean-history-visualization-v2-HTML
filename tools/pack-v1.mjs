/* ==========================================================================
   VALIDATED HISTORICAL SOURCE PACK v1 원문(research/pack_v1/source_pack_v1.txt) 파서 — Node 전용
   - 사용자 제공 pack 원문을 수정 없이 보관하고, 관계 추적(trace)의 quote·locator를 이 파일과 대조한다.
   - locator 형식: "pack_v1:<entryId>:<SECTION>:L<원문 줄번호>"
   ========================================================================== */
import fs from "node:fs";

export const PACK_PATH = new URL("../research/pack_v1/source_pack_v1.txt", import.meta.url);

// 데이터 사건 ID → pack 항목 ID (pack 표기와 데이터 ID 표기가 다른 경우만)
export const EVENT_TO_PACK_ENTRY = {
  E1433_0410: "E1433_0507", E1433_0419: "E1433_0507", E1433_0516A: "E1433_0516_A", E1433_0516B: "E1433_0516_B",
  E1433_08L10: "E1433_0810", E1436_06L19: "E1436_0619", E1443_1005: "E1443_0914_1005", E1447_04L10: "E1447_LUNAR4_10",
  E1432_INVEST: "E1432_1221",
  E1434_GEO_GYEONGWON: "GEO_GYEONGWON", E1441_GEO_JONGSEONG: "GEO_JONGSEONG", E1442_GEO_GYEONGWON: "GEO_GYEONGWON"
};
export const packEntryOf = (eventId) => EVENT_TO_PACK_ENTRY[eventId] || eventId;

const GEO_HEAD = { "Hoeryŏng Dohobu geography": "GEO_HOERYEONG", "Jongseong Dohobu geography": "GEO_JONGSEONG",
  "Puryŏng Dohobu geography": "GEO_BURYEONG", "Kyŏngwŏn Dohobu geography": "GEO_GYEONGWON" };

export function loadPack() {
  const text = fs.readFileSync(PACK_PATH, "utf8");
  const lines = text.split("\n");
  const entries = {};
  let cur = null, section = null;
  lines.forEach((raw, i) => {
    const n = i + 1, line = raw.replace(/\s+$/, "");
    if (/^=+$/.test(line) || /^-{10,}$/.test(line)) { cur = null; section = null; return; }
    if (/^E14\d\d_[A-Z0-9_]+$/.test(line)) { cur = entries[line] = { id: line, line: n, sections: {} }; section = "HEAD"; return; }
    if (GEO_HEAD[line]) { cur = entries[GEO_HEAD[line]] = { id: GEO_HEAD[line], line: n, sections: {} }; section = "HEAD"; return; }
    if (!cur) return;
    const h = /^([A-Z][A-Z0-9 /_()-]*[A-Z)])(?: [a-z][a-z ]*)?:\s*(.*)$/.exec(line);   // 'WHO includes:' 등
    if (h && !/^https?/.test(line)) {
      section = h[1].trim();
      (cur.sections[section] ||= []);
      if (h[2]) cur.sections[section].push({ line: n, text: h[2].trim() });
      return;
    }
    if (/^Verified summary:/.test(line)) { section = "VERIFIED SUMMARY"; cur.sections[section] = []; return; }
    if (line.trim() === "") return;
    (cur.sections[section || "HEAD"] ||= []).push({ line: n, text: line.trim().replace(/^-\s+/, "") });
  });
  return { text, lines, entries };
}

/** locator → 원문 줄 텍스트(정규화: 앞의 '- ' 제거, 양끝 공백 제거). 없으면 null */
export function resolveLocator(pack, locator) {
  const m = /^pack_v1:([A-Z0-9_]+):([A-Z0-9 /_()-]+):L(\d+)$/.exec(locator || "");
  if (!m) return null;
  const e = pack.entries[m[1]];
  if (!e || !e.sections[m[2]]) return null;
  const hit = e.sections[m[2]].find((x) => x.line === +m[3]);
  return hit ? hit.text : null;
}
