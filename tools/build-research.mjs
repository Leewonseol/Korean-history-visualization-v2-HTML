#!/usr/bin/env node
/* ==========================================================================
   research/*.md 의 표 부분을 데이터에서 다시 생성한다(손으로 중복 관리하지 않기 위해).
   각 파일의  <!-- GENERATED:name --> … <!-- /GENERATED:name -->  사이만 교체한다.
   연도별 상태는 COVERAGE 레지스트리를 읽어 출력한다(콘솔에도 연도별 coverageStatus를 출력).
   사용법: node tools/build-research.mjs
   ========================================================================== */
import fs from "node:fs";
import { DATA } from "../src/data/index.js";
import { generateResearch } from "./research-gen.mjs";
import { generateAudit3 } from "./audit-round3.mjs";

const gen = generateResearch(DATA);
for (const [file, content] of Object.entries(gen.__files || {})) fs.writeFileSync(new URL(`../research/${file}`, import.meta.url), content);
for (const [file, sections] of Object.entries(gen)) {
  if (file === "__files") continue;
  const path = new URL(`../research/${file}`, import.meta.url);
  let src = fs.readFileSync(path, "utf8");
  for (const [name, body] of Object.entries(sections)) {
    const re = new RegExp(`(<!-- GENERATED:${name} -->)[\\s\\S]*?(<!-- /GENERATED:${name} -->)`);
    if (!re.test(src)) throw new Error(`${file}: marker ${name} 없음`);
    src = src.replace(re, (_, a, b) => `${a}\n${body.trim()}\n${b}`);
  }
  fs.writeFileSync(path, src);
}
for (const c of DATA.COVERAGE) console.log(`${c.year}  ${c.coverageStatus.padEnd(22)} scope ${c.scopeStatus.padEnd(8)} sources ${c.sourceIds.length}${c.scopeStatus === "PARTIAL" ? `  — 부분 조사(${c.scope}): 다른 연도와 단순 비교 금지` : ""}${c.coverageStatus === "NOT_COVERED" ? "  — " + c.note : ""}`);
for (const [f, body] of Object.entries(generateAudit3(DATA))) fs.writeFileSync(new URL(`../research/audit3/${f}`, import.meta.url), body);
console.log("research tables regenerated (+ research/audit3)");
