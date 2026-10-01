#!/usr/bin/env node
/* 사용법: node tools/validate.mjs   — 오류가 있으면 exit code 1 */
import { DATA } from "../src/data/index.js";
import { validateData } from "../src/model/validate.js";

const { errors, warnings, stats } = validateData(DATA);
console.log("stats:", JSON.stringify(stats));
warnings.forEach((w) => console.log("WARN ", w));
errors.forEach((e) => console.log("ERROR", e));
console.log(`\n${errors.length} error(s), ${warnings.length} warning(s)`);
process.exit(errors.length ? 1 : 0);
