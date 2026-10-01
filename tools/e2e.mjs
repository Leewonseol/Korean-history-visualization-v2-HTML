#!/usr/bin/env node
/* ==========================================================================
   브라우저 E2E 점검 (Playwright)
   사용법:
     python3 -m http.server 8000 &          # 저장소 루트에서
     PLAYWRIGHT_MODULE=$(npm root -g)/playwright/index.js \
     CYTOSCAPE_FILE=/path/to/cytoscape.min.js  \   # (선택) CDN 차단 환경에서 로컬 파일로 대체
     node tools/e2e.mjs [http://localhost:8000/] [screenshot.png]
   ========================================================================== */
import fs from "node:fs";
const pw = await import(process.env.PLAYWRIGHT_MODULE || "playwright");
const chromium = pw.chromium || pw.default.chromium;
const URL = process.argv[2] || "http://localhost:8000/";
const SHOT = process.argv[3];

const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
const page = await browser.newPage({ viewport: { width: 1600, height: 1000 } });
const consoleErrors = [];
page.on("console", (m) => m.type() === "error" && consoleErrors.push(m.text()));
page.on("pageerror", (e) => consoleErrors.push(String(e)));
if (process.env.CYTOSCAPE_FILE) {
  await page.route(/cytoscape\.min\.js$/, (r) => r.fulfill({ body: fs.readFileSync(process.env.CYTOSCAPE_FILE), contentType: "application/javascript" }));
}
await page.goto(URL);
await page.waitForFunction(() => window.__app);

let fails = 0;
const check = (name, ok, info = "") => { console.log(`${ok ? "ok  " : "FAIL"} ${name}${info ? " — " + info : ""}`); if (!ok) fails++; };
const app = (fn, arg) => page.evaluate(fn, arg);
const relEdgeCount = () => app(() => window.__app.net.cy.edges(".rel").length);
const contactLayers = () => app(() => [...new Set(window.__app.last().displayContacts.map((c) => c.layer))]);

/* 1. 로드 · 검증 */
check("콘솔 오류 없음", consoleErrors.length === 0, consoleErrors.join(" | "));
check("validateData 배지 통과", (await page.textContent("#validationBadge")).includes("통과"));

/* 2. 타임라인: 하드코딩 없는 slider max, 연도 jump, 재생 */
const nEvents = await app(() => window.__app.idx.events.length);
check("slider max = EVENTS.length-1", +(await page.getAttribute("#timelineSlider", "max")) === nEvents - 1, `max=${await page.getAttribute("#timelineSlider", "max")}, events=${nEvents}`);
const years = await page.$$eval("#yearJumps button", (bs) => bs.map((b) => b.dataset.year));
check("연도 jump 1432~1449 자동 생성", years[0] === "1432" && years[years.length - 1] === "1449" && years.length === 18, years.join(","));
await page.click('#yearJumps button[data-year="1449"]');
check("1449 jump → 1449 사건", (await page.textContent("#currentDate")).includes("1449"));
await page.click('#yearJumps button[data-year="1437"]');
check("1437 jump → 1437 사건", (await page.textContent("#currentDate")).includes("1437"));
await page.click("#btnFirst");
await page.click("#btnPlayPause");
await page.waitForTimeout(2600);
await page.click("#btnPlayPause");
check("재생 시 커서 전진", (await app(() => window.__app.state.cursor)) >= 1);
await page.click("#btnNext");
const c1 = await app(() => window.__app.state.cursor);
await page.click("#btnPrev");
check("이전/다음 사건 이동", (await app(() => window.__app.state.cursor)) === c1 - 1);

/* 전체 기간 끝으로 */
await app(() => window.__app.setCursor(window.__app.idx.events.length - 1));
check("전체 1432~1449 타임라인 끝까지 이동", (await page.textContent("#currentDate")).includes("1449"));
const allEdges = await relEdgeCount();

/* 3. layer filter가 실제 edge를 바꾸는가 */
await page.uncheck('#filterLayer input[value="POLICY"]');
const noPolicy = await relEdgeCount();
check("layer 필터(POLICY 해제) → edge 감소", noPolicy < allEdges, `${allEdges} → ${noPolicy}`);
check("layer 필터 후 POLICY contact 없음", !(await contactLayers()).includes("POLICY"));
await page.check('#filterLayer input[value="POLICY"]');
check("layer 필터 복원", (await relEdgeCount()) === allEdges);

/* 3b. 근거 토글: 기본 pack v1만 · legacy · 해석 */
const evStatuses = () => app(() => [...new Set(window.__app.last().displayContacts.map((c) => c.evidenceStatus))].sort());
check("근거 토글 기본값: 검증만 ON · legacy OFF · 해석 OFF",
  (await page.isChecked("#evVerifiedOnly")) && !(await page.isChecked("#evIncludeLegacy")) && !(await page.isChecked("#evIncludeInterp")));
check("기본 표시 관계는 pack v1 검증만", JSON.stringify(await evStatuses()) === '["verified"]', (await evStatuses()).join(","));
await page.check("#evIncludeLegacy");
const withLegacy = await relEdgeCount();
check("legacy 포함 → legacy 관계 추가, '검증만' 해제", (await evStatuses()).includes("legacy") && withLegacy > allEdges && !(await page.isChecked("#evVerifiedOnly")), `${allEdges} → ${withLegacy}`);
await page.check("#evIncludeInterp");
check("해석 포함 → interpretation 관계 추가", (await evStatuses()).includes("interpretation"));
await page.check("#evVerifiedOnly");
check("'검증만' 다시 켜면 legacy·해석 제외", JSON.stringify(await evStatuses()) === '["verified"]' && (await relEdgeCount()) === allEdges);

/* 3c. coverage: 1444는 '미조사/미수록', '사건 없음' 표기 없음 */
const b44 = await page.$('#yearJumps button[data-year="1444"]');
check("1444 연도 버튼: 비활성 + 미수록 표시", (await b44.isDisabled()) && (await b44.textContent()).includes("미수록") && (await b44.getAttribute("title")).includes("현재 검증팩에서 미조사/미수록"));
check("타임라인 strip에 미수록 구간 표시", (await page.$$("#eventStrip .strip-nc")).length === 1);
check("기간 선택에 1444 미수록 표기", (await page.textContent('#periodFrom option[value="1444"]')).includes("미조사/미수록"));
check("상단 안내에 1444 미수록 표기", /현재 검증팩에서 미조사\/미수록:\s*1444/.test(await page.textContent("#coverageNote")));
check("화면 어디에도 '사건 없음' 표기 없음", !/사건\s*없음/.test(await page.evaluate(() => document.body.innerText)));

/* 4. level filter */
await page.uncheck('#filterLevel input[value="L0"]');
const hasSejong = await app(() => window.__app.net.cy.getElementById("JO_SEJONG").nonempty());
check("level 필터(L0 해제) → 세종 노드 제거", !hasSejong);
await page.check('#filterLevel input[value="L0"]');
check("level 필터 복원 → 세종 노드", await app(() => window.__app.net.cy.getElementById("JO_SEJONG").nonempty()));

/* 5. theater filter */
for (const t of ["CENTRAL", "AMNOK", "MING", "UNSPECIFIED"]) await page.uncheck(`#filterTheater input[value="${t}"]`);
const duman = await app(() => window.__app.last().displayContacts.map((c) => c.theater));
check("theater 필터(DUMAN만) → DUMAN contact만", duman.length > 0 && duman.every((t) => t.includes("DUMAN")), `${duman.length} contacts`);
for (const t of ["CENTRAL", "AMNOK", "MING", "UNSPECIFIED"]) await page.check(`#filterTheater input[value="${t}"]`);

/* 6. temporal path: 시간 역행 금지, strict/possible, 경로 플래그 */
await page.click('.tab[data-tab="analysis"]');
const note = await page.textContent("#tab-analysis .note");
check("분석 패널: strict 판정·제외 수·지표 데이터셋 표시", note.includes("strict") && /시각 불확실\s*\d+/.test(note) && note.includes("pack v1"));
await page.selectOption("#pathFrom", "JO_SEJONG");
await page.selectOption("#pathTo", "JO_LEESUNMONG");
await page.click("#btnPath");
const path = await app(() => window.__app.state.pathUI.result);
const nondecreasing = path && path.steps.every((s, i) => i === 0 || s.time >= path.steps[i - 1].time);
check("Temporal Path 세종→이순몽 발견", !!path, path ? path.steps.map((s) => `${s.from}->${s.to}@${s.time}`).join(" ") : "none");
check("Temporal Path 시간 순행 + strict 플래그(EXACT/PARTIAL_ORDER)", nondecreasing && path.ok && ["EXACT", "PARTIAL_ORDER"].includes(path.flag), path && path.flag);
check("경로 플래그 화면 표시", (await page.$$("#tab-analysis .path-flag")).length > 0);
check("경로 edge 네트워크 강조", (await app(() => window.__app.net.cy.edges(".path").length)) > 0);
// 역행만 가능한 쌍: 허조→이화 경로는 있으나(1432→1437) 이화(1437)→허조는 과거 edge가 필요
await page.selectOption("#pathFrom", "JO_LEEHWA");
await page.selectOption("#pathTo", "JO_HEOJO");
await page.click("#btnPath");
check("과거 edge로 거슬러 가는 경로는 없음(이화→허조)", (await app(() => window.__app.state.pathUI.result)) === null);
await page.selectOption("#pathFrom", "JO_HEOJO");
await page.selectOption("#pathTo", "JO_LEEHWA");
await page.click("#btnPath");
check("반대 방향(허조→이화)은 시간 순행 경로 존재", !!(await app(() => window.__app.state.pathUI.result)));
// 사건 출발 경로
await page.selectOption("#pathFrom", "event:E1432_1211");
await page.selectOption("#pathTo", "JO_LEESUNMONG");
await page.click("#btnPath");
const p2 = await app(() => window.__app.state.pathUI.result);
check("사건(1432-12-11) 출발 경로 → 이순몽", !!p2 && p2.steps[0].time >= "1432-12-11", p2 ? p2.steps.map((s) => `${s.from}->${s.to}@${s.time}`).join(" ") : "none");
// 도을온 제보(1439-05-10 기사, 제보 시점은 기사일 이전 미상) → 세종: strict 경로 없음, possible은 UNCERTAIN
await page.selectOption("#pathFrom", "JZ_DOEULON");
await page.selectOption("#pathTo", "JO_SEJONG");
await page.selectOption("#pathMode", "strict");
await page.click("#btnPath");
check("시점 미상 제보는 strict 경로를 만들지 않음(도을온→세종)", (await app(() => window.__app.state.pathUI.result)) === null);
await page.selectOption("#pathMode", "possible");
await page.click("#btnPath");
const p3 = await app(() => window.__app.state.pathUI.result);
check("possible 모드: 경로를 UNCERTAIN으로 표시", !!p3 && p3.flag === "UNCERTAIN" && p3.ok, p3 ? p3.flag : "none");
await page.selectOption("#pathMode", "strict");
// 현장 보고 경로: 최윤덕 → 박호문 → 세종 (1433-05-07)
await page.selectOption("#pathFrom", "JO_PARKHOMUN");
await page.selectOption("#pathTo", "JO_SEJONG");
await page.click("#btnPath");
check("박호문 → 세종 보고 경로", !!(await app(() => window.__app.state.pathUI.result)));
await page.click("#btnPathClear");
// 피드백 루프
await page.selectOption("#loopAnchor", "JO_SEJONG");
await page.click("#btnLoops");
const loops = await app(() => window.__app.state.pathUI.loops.map((l) => ({ via: l.via, flag: l.flag, ok: l.steps.every((s, i) => i === 0 || s.time >= l.steps[i - 1].time) })));
check("세종 피드백 루프(최윤덕 경유) 존재·시간 순행·strict 플래그", loops.some((l) => l.via === "JO_CHOEYUNDEOK") && loops.every((l) => l.ok && l.flag !== "UNCERTAIN"), loops.map((l) => `${l.via}:${l.flag}`).join(","));

/* 7. centrality trajectory가 선택 기간에 따라 갱신 */
await app(() => document.querySelector('[data-person="JO_SEJONG"]').click());
await page.click('.tab[data-tab="analysis"]');
const yearsAll = await page.$$eval("#tab-analysis .chart", (cs) => cs[0].querySelectorAll(".pt").length);
await page.selectOption("#periodFrom", "1433");
await page.selectOption("#periodTo", "1434");
const yearsSub = await page.$$eval("#tab-analysis .chart", (cs) => cs[0].querySelectorAll(".pt").length);
check("trajectory 연도 수가 기간에 따라 변함", yearsAll > yearsSub && yearsSub === 2, `${yearsAll} → ${yearsSub}`);
const winTxt = await page.textContent("#tab-analysis .note");
check("분석 창 표시가 기간 반영", winTxt.includes("1433-00-00"));
await page.click("#btnResetFilters");

/* 8. 사건 패널의 원문 link */
await app(() => window.__app.setCursor(0));
await page.click('.tab[data-tab="event"]');
const links = await page.$$eval("#tab-event a.src-link", (as) => as.map((a) => ({ href: a.href, target: a.target })));
check("사건 패널 사료 link(새 탭, sillok)", links.length > 0 && links.every((l) => l.href.startsWith("https://sillok.history.go.kr/") && l.target === "_blank"), JSON.stringify(links));
const lasswell = await page.$$eval("#tab-event h4.lw", (hs) => hs.map((h) => h.firstChild.textContent.trim()));
check("Lasswell 6요소 표시", ["WHO", "GETS / LOSES WHAT", "WHEN", "HOW", "WHERE", "OUTCOME"].every((k) => lasswell.includes(k)), lasswell.join("|"));
let allLinked = true;
for (let i = 0; i < nEvents; i++) {
  await app((j) => window.__app.setCursor(j), i);
  const n = await page.$$eval("#tab-event a.src-link", (as) => as.length);
  if (n === 0) { allLinked = false; console.log("   no link at event", i); }
}
check("모든 사건에 사료 link 존재", allLinked);

/* 8b. 사건 패널 근거 필드 · 관계 근거 필드 · legacy 경고 */
await app(() => window.__app.setCursor(window.__app.idx.events.findIndex((e) => e.id === "E1432_1221")));
const evRows = await page.$$eval("#tab-event .evidence-table td:first-child", (tds) => tds.map((t) => t.textContent.trim()));
check("사건 패널: Source·Evidence status·Provenance·Date precision·Causal status", ["Source", "Evidence status", "Provenance", "Date precision", "Causal status"].every((k) => evRows.includes(k)), evRows.join("|"));
const relMeta = await page.textContent("#tab-event .rel-line .rel-meta");
check("관계 줄: 방향·근거 상태·확실성·인과·사료", ["방향", "근거 상태", "확실성", "인과", "사료"].every((k) => relMeta.includes(k)), relMeta.replace(/\s+/g, " ").slice(0, 120));
check("관계 줄: layer chip 표시", (await page.$$("#tab-event .rel-line .layer-chip")).length > 0);
await app(() => window.__app.setCursor(window.__app.idx.events.findIndex((e) => e.id === "E1433_0310")));
check("legacy 사건 패널에 '검증 데이터 아님' 경고", (await page.textContent("#tab-event")).includes("pack v1 검증 데이터가 아닙니다"));
await app(() => window.__app.setCursor(window.__app.idx.events.findIndex((e) => e.id === "E1432_1209")));
check("'기사일 이전' 사건 날짜를 범위로 표시", (await page.textContent("#currentDate")).includes("이전"));

/* 8c. 동명이인 미해결 노드 */
await app(() => window.__app.selectPerson("JO_HONGSASEOK_1437"));
const ptxt = await page.textContent("#tab-person");
check("인물 패널: 홍사석(1437) unresolved_homonym · 동일인 가능성 · 병합 안 함", ptxt.includes("unresolved_homonym") && ptxt.includes("동일인 가능성") && ptxt.includes("병합하지 않음"));

/* 9. 지표 노드 크기 · 스토리 · 장소 */
await app(() => window.__app.setCursor(window.__app.idx.events.length - 1));   // 전체 기간 누적 상태에서
await page.selectOption("#metricSelect", "betweenness");
const sizes = await app(() => [...new Set(window.__app.net.cy.nodes(".actor").map((n) => Math.round(n.data("size"))))].length);
check("노드 크기 지표 적용", sizes > 1);
await page.selectOption("#metricSelect", "none");
await page.check("#showPlaces");
check("장소 노드 overlay", (await app(() => window.__app.net.cy.nodes(".place").length)) > 0);
await page.uncheck("#showPlaces");
await page.click("#btnStoryMode");
check("스토리 모드 표시", await page.isVisible("#storyOverlay"));
check("스토리 문장마다 근거 배지·사료 id", (await page.$$("#storyNarration .story-statements li .ev-badge")).length === (await page.$$("#storyNarration .story-statements li")).length);
await page.click("#storyNext");
check("스토리: legacy 문장은 기본 숨김(숨김 수 안내)", (await page.textContent("#storyNarration")).includes("숨김"));
await page.click("#storyExit");

check("최종 콘솔 오류 없음", consoleErrors.length === 0, consoleErrors.join(" | "));

if (SHOT) {
  await app(() => window.__app.setCursor(window.__app.idx.events.findIndex((e) => e.id === "E1433_0517")));
  await page.click('[data-person="JO_CHOEYUNDEOK"]').catch(() => {});
  await page.click('.tab[data-tab="event"]');
  await page.screenshot({ path: SHOT });
}
await browser.close();
console.log(`\n${fails ? fails + " FAILED" : "all browser checks passed"}`);
process.exit(fails ? 1 : 0);
