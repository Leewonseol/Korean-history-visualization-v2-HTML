#!/usr/bin/env node
/* 사용법: node tools/validate.mjs
   - 오류가 있으면 exit 1
   - 예상 밖 경고(EXPECTED_WARNINGS에 없는 경고)나, 더 이상 발생하지 않는 허용 목록 항목(stale)이 있어도 exit 1 */
import { DATA } from "../src/data/index.js";
import { validateData } from "../src/model/validate.js";

const { errors, notices, stats, warningReport: wr } = validateData(DATA);
console.log("stats:", JSON.stringify(stats));
notices.forEach((n) => console.log("NOTE ", n));
wr.expected.forEach((w) => console.log(`WARN (expected · known exception) [${w.code}:${w.key}] ${w.message}\n      사유: ${w.reason}`));
wr.unexpected.forEach((w) => console.log(`\x1b[31mWARN (UNEXPECTED) [${w.code}:${w.key}] ${w.message}\x1b[0m`));
wr.stale.forEach((w) => console.log(`\x1b[31mSTALE expected warning [${w.code}:${w.key}] — 더 이상 발생하지 않음. data/expectedWarnings.js를 갱신할 것\x1b[0m`));
errors.forEach((e) => console.log("ERROR", e));
console.log(`\n${errors.length} error(s) · warnings: expected ${wr.expected.length} · unexpected ${wr.unexpected.length} · stale allowlist ${wr.stale.length} · ${notices.length} notice(s)`);
process.exit(errors.length || wr.unexpected.length || wr.stale.length ? 1 : 0);
