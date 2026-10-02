#!/usr/bin/env node
/* scripts/sync-prompts.cjs — 워커(proxy/worker.js)의 웹 AI 지시문을 브라우저용 app/prompts.js로 복제.
   중계 서버 없이 "개인 키(BYOK)"로 쓰는 배포본에서도 서버와 같은 품질(맞춤 질문·섹션 제목·검수 규칙)을 내기 위함.
   워커 지시문을 고친 뒤엔 반드시 재실행: node scripts/sync-prompts.cjs */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const ROOT = path.join(__dirname, '..');
const src = fs.readFileSync(path.join(ROOT, 'proxy/worker.js'), 'utf8');
const NAMES = ['WEB_SYSTEM', 'INTAKE_SYSTEM', 'WEB_EDIT_SYSTEM', 'TRANSLATE_SYSTEM'];
// export default 이전(상수 정의부)만 떼어 평가 — 상수끼리 참조(GENNX_FACTS 등)가 있어 통째로 실행
const head = src.slice(0, src.indexOf('export default'));
const ctx = {};
vm.createContext(ctx);
vm.runInContext(head.replace(/^const /gm, 'var ') + '\n;globalThis.__P = {' + NAMES.map(n => n + ':' + n).join(',') + '};', ctx);
const P = ctx.__P;
NAMES.forEach(n => { if (typeof P[n] !== 'string' || !P[n]) throw new Error('추출 실패: ' + n); });
const out = '/* app/prompts.js — 자동 생성(scripts/sync-prompts.cjs). 직접 수정 금지 — proxy/worker.js를 고치고 재생성.\n' +
  '   개인 키(BYOK) 모드에서 llm.js가 워커와 같은 지시문을 쓰게 한다. */\n' +
  'window.WORKER_PROMPTS = ' + JSON.stringify(P, null, 0) + ';\n';
const OUTP = path.join(ROOT, 'app/prompts.js');
if (process.argv.includes('--check')) {
  const cur = fs.existsSync(OUTP) ? fs.readFileSync(OUTP, 'utf8') : '';
  if (cur !== out) { console.log('  ✗ app/prompts.js가 워커 지시문과 다름 — node scripts/sync-prompts.cjs 실행'); process.exit(1); }
  console.log('  ✓ 개인 키 모드 지시문 = 워커 지시문'); process.exit(0);
}
fs.writeFileSync(OUTP, out, 'utf8');
console.log('app/prompts.js 생성 — ' + NAMES.map(n => n + ' ' + P[n].length + '자').join(' · '));
