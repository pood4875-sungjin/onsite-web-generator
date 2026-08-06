#!/usr/bin/env node
/* scripts/check.cjs — 커밋 전 통합 검수기 (pre-commit 훅이 자동 실행)
   검사 항목:
     1) JS 문법 전수 — packs/**, app/*.js, scripts/*.cjs (vendor 제외)
     2) 한국어 하드코딩 폴백 — 팩 렌더러의 `|| '한글'` 패턴(로컬라이징 지뢰)
     3) core 단위 테스트 — node --test (esc·volume)
   실패 시 exit 1 → 커밋 차단. 단독 실행: node scripts/check.cjs */
'use strict';
const { execFileSync, spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');

let failed = false;
const bad = (msg) => { failed = true; console.error('  ✗ ' + msg); };

function jsFiles(dir, recursive) {
  const out = [];
  for (const e of fs.readdirSync(path.join(ROOT, dir), { withFileTypes: true })) {
    if (e.name === 'vendor' || e.name.startsWith('.')) continue;
    const rel = path.join(dir, e.name);
    if (e.isDirectory() && recursive) out.push(...jsFiles(rel, true));
    else if (e.isFile() && (e.name.endsWith('.js') || e.name.endsWith('.cjs'))) out.push(rel);
  }
  return out;
}

/* 1) 문법 전수 */
console.log('[1/3] JS 문법 검사');
const targets = [...jsFiles('packs', true), ...jsFiles('app', false), ...jsFiles('scripts', false)];
for (const f of targets) {
  try { execFileSync('node', ['--check', path.join(ROOT, f)], { stdio: 'pipe' }); }
  catch (e) { bad(f + ' 문법 오류\n' + String(e.stderr).split('\n').slice(0, 3).join('\n')); }
}
console.log('  ' + targets.length + '개 파일');

/* 2) 팩 한국어 폴백 지뢰 — 4개 언어로 나가는 "활성 팩"만 검사.
   레거시 팩(aether·saturn·krds·midas·ppt·pitch·honors·pastel·sfmi·edm)은 KO 전용 세대라 제외 */
console.log('[2/3] 활성 팩 한국어 하드코딩 폴백 검사');
const FBRE = /\|\|\s*['"][가-힣]/;
const LOCALIZED = ['packs.naver.js', 'packs.rams.js', 'packs.machine.js', 'packs.mbm.js', 'packs.axday.js', 'packs.orbit.js', 'packs.toss.js'];
for (const f of jsFiles('packs', true).filter(p => LOCALIZED.includes(path.basename(p)))) {
  const lines = fs.readFileSync(path.join(ROOT, f), 'utf8').split('\n');
  lines.forEach((ln, i) => {
    if (FBRE.test(ln)) bad(`${f}:${i + 1} 한국어 폴백 — 언어인지 사전(lf/TT)으로 바꿀 것: ${ln.trim().slice(0, 80)}`);
  });
}

/* 3) core 단위 테스트 */
console.log('[3/3] core 단위 테스트 (node --test)');
const t = spawnSync('node', ['--test'], { cwd: ROOT, encoding: 'utf8' });
if (t.status !== 0) bad('단위 테스트 실패\n' + (t.stdout || '').split('\n').filter(l => l.includes('fail') || l.includes('✖')).slice(0, 5).join('\n'));
else console.log('  ' + ((t.stdout.match(/pass (\d+)/) || [])[1] || '?') + '개 통과');

if (failed) { console.error('\n검수 불합격 — 위 항목 수정 전 커밋 불가'); process.exit(1); }
console.log('\n검수 합격 ✓');
