#!/usr/bin/env node
/* scripts/handover-check.cjs — 인계(레포 전달) 전 안전 점검.
   "내 계정으로 돈이 새지 않는가 / 내 좌표가 남아 있지 않은가"를 실측한다.
   검사 항목:
     1) API 키 유출 — 레포 전체에서 sk-ant-…, AIza… 실제 키 패턴
     2) 내 계정 좌표 — 워커 주소(PROXY_URL) · Cloudflare 계정ID · KV id · Pages 도메인
     3) 개인 폴더 — sources/ .wrangler/ 가 zip에 딸려갈 위험
   단독 실행: node scripts/handover-check.cjs
   전체 비우기(BYOK 모드로 전환): node scripts/handover-check.cjs --clean */
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const CLEAN = process.argv.includes('--clean');

const SKIP_DIR = new Set(['.git', 'node_modules', 'vendor', 'sources', '.wrangler', '.gstack']);
const TEXT_EXT = new Set(['.js', '.cjs', '.html', '.toml', '.json', '.md', '.css', '.py']);

function walk(dir, out) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SKIP_DIR.has(e.name)) continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (TEXT_EXT.has(path.extname(e.name))) out.push(p);
  }
  return out;
}
const files = walk(ROOT, []);
const rel = (p) => path.relative(ROOT, p);
const read = (p) => { try { return fs.readFileSync(p, 'utf8'); } catch (e) { return ''; } };

let danger = 0, warn = 0;
const hit = (lv, msg) => { if (lv === 'x') { danger++; console.log('  ✗ ' + msg); } else { warn++; console.log('  ⚠ ' + msg); } };

/* 1) 실제 API 키 — 있으면 절대 넘기면 안 됨 */
console.log('\n[1/3] API 키 유출 검사');
const KEY_RE = [/sk-ant-[A-Za-z0-9_-]{20,}/, /AIza[A-Za-z0-9_-]{30,}/];
const PLACEHOLDER_RE = /X{8,}|YOUR_/; // 문서 예시(sk-ant-api03-XXXX…, YOUR_…)는 실키 아님
let keyFound = 0;
for (const f of files) {
  const txt = read(f);
  txt.split('\n').forEach((line, i) => {
    for (const re of KEY_RE) {
      const m = line.match(re);
      if (m && !PLACEHOLDER_RE.test(m[0])) { hit('x', `실제 키로 보이는 문자열: ${rel(f)}:${i + 1}`); keyFound++; }
    }
  });
}
if (!keyFound) console.log('  ✓ 실제 키 없음 — 파일을 통째로 넘겨도 키는 딸려가지 않는다');

/* 2) 내 계정 좌표 — 남아 있으면 인계자 테스트 비용이 내 계정으로 청구된다 */
console.log('\n[2/3] 계정 좌표 검사 (남으면 내 계정으로 과금·연결됨)');
const LLM = path.join(ROOT, 'app/llm.js');
const llmTxt = read(LLM);
const mProxy = llmTxt.match(/var PROXY_URL = '([^']*)'/);
if (mProxy && mProxy[1]) {
  hit('x', `app/llm.js PROXY_URL = ${mProxy[1]} — 인계자가 AI를 쓸 때마다 이 워커(=이 계정)로 과금된다`);
  if (CLEAN) {
    fs.writeFileSync(LLM, llmTxt.replace(/var PROXY_URL = '[^']*'/, "var PROXY_URL = ''"), 'utf8');
    console.log('    → --clean: PROXY_URL 비움. 앱이 BYOK(개인 키) 모드로 전환됨');
  }
} else console.log('  ✓ PROXY_URL 비어 있음 — BYOK 모드(인계자가 자기 키를 설정 화면에 입력)');

const WORKER = path.join(ROOT, 'proxy/worker.js');
const mAcc = read(WORKER).match(/ACCOUNT_ID = '([0-9a-f]{16,})'/);
if (mAcc) hit('⚠', `proxy/worker.js ACCOUNT_ID = ${mAcc[1].slice(0, 8)}… — 인계자 Cloudflare 계정ID로 교체 필요(AI Gateway 경로)`);

const TOML = path.join(ROOT, 'proxy/wrangler.toml');
const kvIds = [...read(TOML).matchAll(/id = "([0-9a-f]{16,})"/g)];
if (kvIds.length) hit('⚠', `proxy/wrangler.toml KV id ${kvIds.length}개 — 인계자 계정에서 새로 만들어 교체 필요`);

const pagesHits = files.filter((f) => /midas-drs\.pages\.dev/.test(read(f)) && !/sample\.html$|HANDOVER|README/.test(f));
if (pagesHits.length) hit('⚠', `프로드 도메인 하드코딩 ${pagesHits.length}개 파일 — ${pagesHits.map(rel).join(', ')}`);

/* 3) 개인 폴더 — git 전달이면 자동 제외, zip 전달이면 수동 제외 */
console.log('\n[3/3] 개인 폴더 (zip으로 넘길 때 빼야 함)');
for (const d of ['sources', '.wrangler']) {
  if (fs.existsSync(path.join(ROOT, d))) hit('⚠', `${d}/ 존재 — GitHub 전달이면 자동 제외(gitignore), zip이면 직접 빼기`);
}

/* 결론 */
console.log('\n' + '─'.repeat(60));
if (danger) {
  console.log(`✗ 그대로 넘기면 위험: ${danger}건. 위 ✗ 항목을 먼저 처리할 것.`);
  console.log('  가장 흔한 해결: node scripts/handover-check.cjs --clean  (PROXY_URL 비워 BYOK 전환)');
} else {
  console.log('✓ 넘겨도 안전. 내 계정으로 과금될 경로 없음.');
}
if (warn) console.log(`⚠ 인계자가 자기 계정으로 갈아끼울 때 손봐야 할 지점 ${warn}건 — docs/HANDOVER.html §13 참조.`);
process.exit(danger ? 1 : 0);
