#!/usr/bin/env node
/* ==========================================================================
   production build 점검 — 번들러 없는 정적 사이트(GitHub Pages)의 '빌드' 단계
   1) index.html이 참조하는 로컬 파일 존재, 외부 스크립트는 고정 버전 CDN만
   2) src/app.js부터 import 그래프를 따라가며 모든 상대 경로 모듈이 존재
   3) 각 모듈의 named import가 실제 export에 있는지(정적 검사 + DOM 없는 모듈은 실제 import)
   4) 모든 .js/.mjs 문법 검사(node --check)
   5) Cytoscape 버전 parity: package.json 고정 버전 = vendor MANIFEST = 파일 내장 버전 = index.html 경로,
      sha256 일치 — production과 E2E는 같은 vendor 파일을 쓴다(CDN 미사용)
   사용법: node tools/build-check.mjs
   ========================================================================== */
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { pathToFileURL } from "node:url";
import crypto from "node:crypto";

const ROOT = path.resolve(new URL("..", import.meta.url).pathname);
let fails = 0;
const check = (name, ok, info = "") => { console.log(`${ok ? "ok  " : "FAIL"} ${name}${info ? " — " + info : ""}`); if (!ok) fails++; };

/* 1. index.html 참조 */
const html = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");
const refs = [...html.matchAll(/(?:src|href)="([^"]+)"/g)].map((m) => m[1]);
const local = refs.filter((r) => !/^https?:|^#|^mailto:/.test(r));
check("index.html 로컬 참조 파일 존재", local.every((r) => fs.existsSync(path.join(ROOT, r))), local.join(", "));
const ext = refs.filter((r) => /^https?:/.test(r) && /\.js$/.test(r));
check("외부 CDN 스크립트 없음(배포·E2E가 같은 vendor 파일 사용)", ext.length === 0, ext.join(", "));

/* 5. Cytoscape parity */
const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, "package.json"), "utf8"));
const man = JSON.parse(fs.readFileSync(path.join(ROOT, "vendor/cytoscape/MANIFEST.json"), "utf8"));
const pinned = pkg.dependencies && pkg.dependencies.cytoscape;
check("package.json cytoscape 버전 고정(정확한 버전)", /^\d+\.\d+\.\d+$/.test(pinned || ""), pinned);
check("package.json 버전 = vendor MANIFEST 버전", pinned === man.version, `${pinned} vs ${man.version}`);
const cyRef = refs.find((r) => /cytoscape/.test(r));
check("index.html이 MANIFEST의 vendor 파일을 로드", cyRef === man.file, cyRef);
const cyBuf = fs.readFileSync(path.join(ROOT, man.file));
const sha = crypto.createHash("sha256").update(cyBuf).digest("hex");
check("vendor 파일 sha256 = MANIFEST", sha === man.sha256, sha);
const embedded = (/version="(\d+\.\d+\.\d+)"/.exec(cyBuf.toString("utf8")) || [])[1];
check("vendor 파일 내장 버전 = 고정 버전", embedded === pinned, `${embedded} vs ${pinned}`);
check("Cytoscape 라이선스 동봉", fs.existsSync(path.join(path.dirname(path.join(ROOT, man.file)), "LICENSE")));
check("진입 모듈 type=module", /<script[^>]+type="module"[^>]+src="src\/app\.js"/.test(html));

/* 2~3. import 그래프 */
const seen = new Map();   // file -> { imports: [{names, spec, resolved}], exports:Set }
function scan(file) {
  if (seen.has(file)) return;
  const src = fs.readFileSync(file, "utf8");
  const info = { imports: [], exports: new Set() };
  seen.set(file, info);
  for (const m of src.matchAll(/import\s*(?:\{([^}]*)\}\s*from\s*)?["']([^"']+)["']/g)) {
    if (!m[2].startsWith(".")) continue;
    const resolved = path.resolve(path.dirname(file), m[2]);
    const names = (m[1] || "").split(",").map((x) => x.trim().split(/\s+as\s+/)[0]).filter(Boolean);
    info.imports.push({ names, spec: m[2], resolved });
    if (!fs.existsSync(resolved)) { check(`import 해석: ${path.relative(ROOT, file)} → ${m[2]}`, false); continue; }
    scan(resolved);
  }
  for (const m of src.matchAll(/export\s+(?:async\s+)?(?:function|const|let|class)\s+([A-Za-z0-9_$]+)/g)) info.exports.add(m[1]);
  for (const m of src.matchAll(/export\s*\{([^}]*)\}/g)) m[1].split(",").map((x) => x.trim().split(/\s+as\s+/).pop()).filter(Boolean).forEach((n) => info.exports.add(n));
}
scan(path.join(ROOT, "src/app.js"));
check(`import 그래프 모듈 ${seen.size}개 모두 존재`, [...seen.keys()].every((f) => fs.existsSync(f)));
let missing = [];
for (const [file, info] of seen) for (const imp of info.imports) {
  const target = seen.get(imp.resolved);
  if (!target) continue;
  imp.names.forEach((n) => target.exports.has(n) || missing.push(`${path.relative(ROOT, file)}: ${n} ← ${imp.spec}`));
}
check("모든 named import가 export에 존재", missing.length === 0, missing.join("; "));

// DOM에 의존하지 않는 모듈(data/model/analysis)은 실제로 import해 본다
const nodeSafe = [...seen.keys()].filter((f) => /src\/(data|model|analysis)\//.test(f));
for (const f of nodeSafe) {
  try { await import(pathToFileURL(f).href); } catch (e) { check(`import 실행: ${path.relative(ROOT, f)}`, false, e.message); }
}
check(`data/model/analysis 모듈 ${nodeSafe.length}개 실제 import`, true);

/* 4. 문법 검사 */
const all = [];
const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).forEach((e) => {
  const p = path.join(d, e.name);
  if (e.isDirectory() && !["node_modules", ".git"].includes(e.name)) walk(p);
  else if (/\.(m?js)$/.test(e.name)) all.push(p);
});
walk(path.join(ROOT, "src")); walk(path.join(ROOT, "tools"));
const bad = [];
for (const f of all) { try { execFileSync(process.execPath, ["--check", f], { stdio: "pipe" }); } catch (e) { bad.push(`${path.relative(ROOT, f)}: ${String(e.stderr).split("\n")[0]}`); } }
check(`문법 검사 ${all.length}개 파일`, bad.length === 0, bad.join("; "));

console.log(`\n${fails ? fails + " FAILED" : "production build check passed"}`);
process.exit(fails ? 1 : 0);
