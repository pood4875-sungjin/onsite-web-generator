/* i18n 커버리지 체커 — 앱 코드의 모든 로컬라이징 대상 문구를 긁어 i18n.js MAP 등재 여부를 검사.
   사용: node _src-check-i18n.cjs        → 미등재 한국어 문구 목록 출력(빌드 게이트용 exit 1)
        node _src-check-i18n.cjs --json  → JSON 배열로 출력(자동 등재 파이프라인용)
   대상: _L('…') · tL('…') · L('…') 호출 + data-i18n / data-i18n-ph / data-i18n-placeholder / data-i18n-title 속성.
   한국어가 없는 문구(영문·이모지 전용)는 통과 — 번역 불필요. */
const fs = require('fs');
const path = require('path');

const APP = path.join(__dirname, '..', 'app');   /* scripts/ 하위 이동 — 루트 기준 유지 */
const FILES = [
  'index.html', 'projects.html', 'studio/studio.html', 'modal.js', 'templates.js', 'llm.js',
].map((f) => path.join(APP, f)).filter((f) => fs.existsSync(f));

const found = new Set();
const CALL_RE = /\b_?[tL]L?\(\s*'((?:[^'\\]|\\.)*)'\s*[,)]/g;   // _L('…') · tL('…') · L('…')
const ATTR_RE = /data-i18n(?:-ph|-placeholder|-title)?="([^"]+)"/g;
// 배열 상수 경유 문구 — 정의부의 리터럴은 렌더 지점에서 _L/tL로 감싸이므로 여기 것도 등재 대상
const CONST_RE = /(?:const|let|var)\s+(?:FIRST_SAMPLES|FIXED_QS|PPT_LENGTHS|BRIEF_PROMPT|BRIEF_PH|chips)\s*=\s*[\[{][\s\S]*?[\]}];/g;
const STR_RE = /'((?:[^'\\\n]|\\.)*)'/g;
for (const f of FILES) {
  const src = fs.readFileSync(f, 'utf8');
  let m;
  while ((m = CALL_RE.exec(src))) found.add(m[1].replace(/\\'/g, "'"));
  while ((m = ATTR_RE.exec(src))) found.add(m[1]);
  let cb;
  while ((cb = CONST_RE.exec(src))) {
    let s;
    while ((s = STR_RE.exec(cb[0]))) found.add(s[1].replace(/\\'/g, "'").replace(/\\n/g, '\n'));
  }
}

const i18n = fs.readFileSync(path.join(APP, 'i18n.js'), 'utf8');
const keys = new Set();
const KEY_RE = /^\s*'((?:[^'\\]|\\.)*)':\s*\[/gm;
let k;
while ((k = KEY_RE.exec(i18n))) keys.add(k[1].replace(/\\'/g, "'").replace(/\\n/g, '\n'));

const hasKo = (s) => /[가-힣]/.test(s);
const missing = [...found].filter((s) => hasKo(s) && !keys.has(s)).sort();

if (process.argv.includes('--json')) { console.log(JSON.stringify(missing, null, 2)); process.exit(0); }
if (!missing.length) { console.log('i18n OK — 미등재 한국어 문구 없음 (' + found.size + '개 스캔, MAP ' + keys.size + '키)'); process.exit(0); }
console.log('미등재 ' + missing.length + '개:');
missing.forEach((s) => console.log('  ' + s));
process.exit(1);
