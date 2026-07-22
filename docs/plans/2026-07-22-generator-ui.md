# Minimal Generator UI Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development. Steps use checkbox (`- [ ]`) syntax.

**Goal:** A working web page where a person picks a page type + volume, fills content in a form, sees a **live preview** update as they type, and **downloads** the finished HTML. First hands-on end-to-end of the generator (PRD §3, §12) — the "AX 대화형 폼" flow in its minimal functional form (plain UI; Framer-chrome polish deferred).

**Architecture:** Pure logic in small testable ESM modules (`app/field-specs.js`, `app/generator-state.js`); thin DOM wiring in `app/generator.html`. The page imports the merged engine (`core/template.js`, `core/renderer.js`, `core/packs/sample`) via `<script type="module">`. Live preview renders into an **iframe** (via `srcdoc`) so the output's own CSS/tokens are isolated from the app chrome. Must be served over http (module imports + iframe); `file://` won't work.

**Tech Stack:** Vanilla JS ESM, no framework/build. Node v24 `node:test` for the pure modules. Browser verification for the UI.

---

## File Structure

```
app/
  field-specs.js       # per-section form field definitions (pure data)
  generator-state.js   # default state + stateToContent(state) → content object
  generator.html       # the UI: form + live iframe preview + download
test/
  field-specs.test.js
  generator-state.test.js
```

**Content-from-form approach (kept simple):**
- Scalar fields → text inputs (product name, hero title/lead/eyebrow, cta heading/sub).
- Repeating lists → a `<textarea>`, one item per line, fields separated by `|`:
  - feature items: `제목|설명` per line
  - nav links: `라벨|url` per line
  - footer columns: `컬럼제목|링크라벨|링크url` per line (one link per column for MVP)
- `stateToContent(state)` parses these into the exact `content` object `buildPageDoc` expects.

---

### Task 1: `field-specs.js` — form field definitions

**Files:** Create `app/field-specs.js`; Test `test/field-specs.test.js`

- [ ] **Step 1: Write the failing test**

```js
// test/field-specs.test.js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { FIELD_SPECS, SHARED_FIELDS } from '../app/field-specs.js';

test('has field specs for each of the 5 sections', () => {
  for (const type of ['nav', 'hero', 'feature', 'cta', 'footer']) {
    assert.ok(Array.isArray(FIELD_SPECS[type]), `missing specs for ${type}`);
  }
});
test('each field has key, label, kind', () => {
  for (const specs of Object.values(FIELD_SPECS)) {
    for (const f of specs) {
      assert.ok(f.key && f.label && f.kind, `bad field ${JSON.stringify(f)}`);
      assert.ok(['text', 'lines'].includes(f.kind));
    }
  }
});
test('shared fields include productName', () => {
  assert.ok(SHARED_FIELDS.some((f) => f.key === 'productName'));
});
```

- [ ] **Step 2: Run — confirm FAIL**

Run: `node --test test/field-specs.test.js`

- [ ] **Step 3: Implement**

```js
// app/field-specs.js
// 각 섹션 폼에 어떤 입력을 띄울지 정의. kind: 'text'=한 줄, 'lines'=여러 줄(줄당 항목, | 로 필드 구분).
export const SHARED_FIELDS = [
  { key: 'productName', label: '제품명', kind: 'text', placeholder: '예: ONSITE' },
];

export const FIELD_SPECS = {
  nav: [
    { key: 'links', label: '메뉴 (한 줄에 하나: 라벨|링크)', kind: 'lines', placeholder: '제품|#\n요금|#' },
    { key: 'ctaLabel', label: '버튼 텍스트', kind: 'text', placeholder: '무료로 시작' },
    { key: 'ctaHref', label: '버튼 링크', kind: 'text', placeholder: '/start' },
  ],
  hero: [
    { key: 'eyebrow', label: '작은 라벨', kind: 'text', placeholder: '현장 업무 플랫폼' },
    { key: 'title', label: '큰 제목', kind: 'text', placeholder: '현장의 모든 일, 하나로' },
    { key: 'lead', label: '설명', kind: 'text', placeholder: '한 줄 소개' },
    { key: 'ctaLabel', label: '주 버튼', kind: 'text', placeholder: '무료로 시작하기' },
    { key: 'ctaHref', label: '주 버튼 링크', kind: 'text', placeholder: '/start' },
  ],
  feature: [
    { key: 'heading', label: '섹션 제목', kind: 'text', placeholder: '현장에 필요한 모든 것' },
    { key: 'items', label: '기능들 (한 줄에 하나: 제목|설명)', kind: 'lines', placeholder: '실시간 메시지|읽음 확인까지\n일정 관리|팀 일정 공유' },
  ],
  cta: [
    { key: 'heading', label: '제목', kind: 'text', placeholder: '지금 시작하세요' },
    { key: 'sub', label: '보조 문구', kind: 'text', placeholder: '설치 없이 웹에서' },
    { key: 'buttonLabel', label: '버튼', kind: 'text', placeholder: '도입 문의하기' },
    { key: 'buttonHref', label: '버튼 링크', kind: 'text', placeholder: '/contact' },
  ],
  footer: [
    { key: 'columns', label: '컬럼 (한 줄에 하나: 컬럼제목|링크라벨|링크주소)', kind: 'lines', placeholder: '제품|기능|#\n회사|소개|#' },
  ],
};
```

- [ ] **Step 4: Run — confirm PASS (3 tests)** — `node --test test/field-specs.test.js`

- [ ] **Step 5: Commit**

```bash
git add app/field-specs.js test/field-specs.test.js
git commit -m "feat(app): form field specs per section"
```

---

### Task 2: `generator-state.js` — `stateToContent()`

Turns flat form state into the nested `content` object `buildPageDoc` expects. Pure + testable.

**Files:** Create `app/generator-state.js`; Test `test/generator-state.test.js`

- [ ] **Step 1: Write the failing test**

```js
// test/generator-state.test.js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { defaultState, stateToContent } from '../app/generator-state.js';
import { buildPageDoc } from '../core/template.js';
import { mainTemplate } from '../core/templates/main.js';
import { validatePageDoc } from '../core/pagedoc.js';

test('defaultState has meta.title, volume, shared, sections', () => {
  const s = defaultState();
  assert.equal(typeof s.title, 'string');
  assert.equal(s.volume, 'heavy');
  assert.ok(s.shared && typeof s.shared === 'object');
  assert.ok(s.sections && typeof s.sections === 'object');
});

test('hero scalar fields map into content.hero', () => {
  const s = defaultState();
  s.sections.hero.title = '현장의 모든 일';
  s.sections.hero.eyebrow = '플랫폼';
  const c = stateToContent(s);
  assert.equal(c.hero.title, '현장의 모든 일');
  assert.equal(c.hero.eyebrow, '플랫폼');
});

test('hero cta fields become a ctas array', () => {
  const s = defaultState();
  s.sections.hero.ctaLabel = '시작';
  s.sections.hero.ctaHref = '/s';
  const c = stateToContent(s);
  assert.deepEqual(c.hero.ctas, [{ label: '시작', href: '/s' }]);
});

test('feature items lines parse into {title,desc}[]', () => {
  const s = defaultState();
  s.sections.feature.items = 'A|a\nB|b';
  const c = stateToContent(s);
  assert.deepEqual(c.feature.items, [{ title: 'A', desc: 'a' }, { title: 'B', desc: 'b' }]);
});

test('nav links + cta parse correctly', () => {
  const s = defaultState();
  s.sections.nav.links = '제품|#\n요금|/pricing';
  s.sections.nav.ctaLabel = '시작';
  s.sections.nav.ctaHref = '/start';
  const c = stateToContent(s);
  assert.deepEqual(c.nav.links, [{ label: '제품', href: '#' }, { label: '요금', href: '/pricing' }]);
  assert.deepEqual(c.nav.cta, { label: '시작', href: '/start' });
});

test('footer columns parse into {title, links:[{label,href}]}[]', () => {
  const s = defaultState();
  s.sections.footer.columns = '제품|기능|#\n회사|소개|/about';
  const c = stateToContent(s);
  assert.deepEqual(c.footer.columns, [
    { title: '제품', links: [{ label: '기능', href: '#' }] },
    { title: '회사', links: [{ label: '소개', href: '/about' }] },
  ]);
});

test('meta.title carried, and result builds a valid PageDoc', () => {
  const s = defaultState();
  s.title = '온사이트';
  s.sections.hero.title = 'T';
  const c = stateToContent(s);
  assert.equal(c.meta.title, '온사이트');
  const doc = buildPageDoc({ template: mainTemplate, volume: s.volume, content: c, sharedFacts: c._shared });
  assert.equal(validatePageDoc(doc).ok, true);
});

test('empty lines and blank fields are ignored', () => {
  const s = defaultState();
  s.sections.feature.items = 'A|a\n\n  \nB|b';
  const c = stateToContent(s);
  assert.equal(c.feature.items.length, 2);
});
```

- [ ] **Step 2: Run — confirm FAIL** — `node --test test/generator-state.test.js`

- [ ] **Step 3: Implement**

```js
// app/generator-state.js
import { FIELD_SPECS, SHARED_FIELDS } from './field-specs.js';

/** 빈 폼 상태. sections[type][fieldKey] = '' */
export function defaultState() {
  const sections = {};
  for (const [type, specs] of Object.entries(FIELD_SPECS)) {
    sections[type] = {};
    for (const f of specs) sections[type][f.key] = '';
  }
  const shared = {};
  for (const f of SHARED_FIELDS) shared[f.key] = '';
  return { title: '', volume: 'heavy', shared, sections };
}

/** "a|b|c" 줄들을 [[a,b,c], ...]로. 빈 줄 무시. */
function parseLines(raw) {
  return String(raw || '')
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => l.split('|').map((p) => p.trim()));
}

/** 폼 상태 → buildPageDoc용 content 객체 (+ _shared로 sharedFacts 전달) */
export function stateToContent(state) {
  const s = state.sections;
  const content = {
    meta: { title: state.title || '' },
    _shared: { ...state.shared },
    nav: {
      links: parseLines(s.nav.links).map(([label, href]) => ({ label, href: href || '#' })),
    },
    hero: {
      eyebrow: s.hero.eyebrow, title: s.hero.title, lead: s.hero.lead,
    },
    feature: {
      heading: s.feature.heading,
      items: parseLines(s.feature.items).map(([title, desc]) => ({ title, desc: desc || '' })),
    },
    cta: { heading: s.cta.heading, sub: s.cta.sub },
    footer: {
      columns: parseLines(s.footer.columns).map(([title, label, href]) => ({
        title, links: label ? [{ label, href: href || '#' }] : [],
      })),
    },
  };
  if (s.nav.ctaLabel) content.nav.cta = { label: s.nav.ctaLabel, href: s.nav.ctaHref || '#' };
  if (s.hero.ctaLabel) content.hero.ctas = [{ label: s.hero.ctaLabel, href: s.hero.ctaHref || '#' }];
  if (s.cta.buttonLabel) content.cta.button = { label: s.cta.buttonLabel, href: s.cta.buttonHref || '#' };
  return content;
}
```

Note: `content._shared` carries sharedFacts (product name). `buildPageDoc` ignores unknown keys like `_shared` when mapping sections (it only reads `content[sectionType]`), so passing the full content object is safe; the UI passes `sharedFacts: content._shared` explicitly.

- [ ] **Step 4: Run — confirm PASS (8 tests)** — `node --test test/generator-state.test.js`

- [ ] **Step 5: Commit**

```bash
git add app/generator-state.js test/generator-state.test.js
git commit -m "feat(app): form-state → content mapping"
```

---

### Task 3: `generator.html` — the UI

Wires everything: form (built from field-specs) → live iframe preview → download. Verified in the browser by the controller (not the subagent).

**Files:** Create `app/generator.html`

- [ ] **Step 1: Create the page**

```html
<!doctype html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>ONSITE Generator</title>
<style>
  *{box-sizing:border-box}
  body{margin:0;font-family:system-ui,"Apple SD Gothic Neo",sans-serif;display:flex;height:100vh;color:#16181d}
  .panel{width:380px;flex:0 0 380px;border-right:1px solid #e6e9ef;overflow-y:auto;padding:20px}
  .preview{flex:1;background:#f5f7fa;display:flex;flex-direction:column}
  .preview .bar{padding:10px 16px;border-bottom:1px solid #e6e9ef;background:#fff;display:flex;gap:8px;align-items:center}
  .preview iframe{flex:1;width:100%;border:0;background:#fff}
  h1{font-size:16px;margin:0 0 16px}
  h2{font-size:13px;text-transform:uppercase;letter-spacing:.04em;color:#5b6270;margin:22px 0 8px}
  label{display:block;font-size:12px;color:#5b6270;margin:10px 0 4px}
  input,select,textarea{width:100%;padding:8px 10px;border:1px solid #e6e9ef;border-radius:8px;font-size:13px;font-family:inherit}
  textarea{min-height:64px;resize:vertical}
  .seg{display:flex;gap:6px;margin-top:6px}
  .seg button{flex:1;padding:7px;border:1px solid #e6e9ef;background:#fff;border-radius:8px;font-size:13px;cursor:pointer}
  .seg button.on{background:#0066FF;color:#fff;border-color:#0066FF}
  .dl{margin-left:auto;padding:7px 14px;background:#0066FF;color:#fff;border:0;border-radius:8px;font-size:13px;cursor:pointer}
</style>
</head>
<body>
  <div class="panel">
    <h1>ONSITE Generator</h1>
    <label>페이지 제목</label>
    <input id="pageTitle" placeholder="온사이트 — 현장 업무 플랫폼">
    <label>볼륨 (섹션 양)</label>
    <div class="seg" id="volume">
      <button data-v="compact">컴팩트</button>
      <button data-v="mid">중간</button>
      <button data-v="heavy" class="on">헤비</button>
    </div>
    <div id="fields"></div>
  </div>
  <div class="preview">
    <div class="bar">
      <span style="font-size:13px;color:#5b6270">라이브 미리보기</span>
      <button class="dl" id="download">HTML 다운로드</button>
    </div>
    <iframe id="frame" title="preview"></iframe>
  </div>

<script type="module">
  import { FIELD_SPECS, SHARED_FIELDS } from './field-specs.js';
  import { defaultState, stateToContent } from './generator-state.js';
  import { buildPageDoc } from '../core/template.js';
  import { mainTemplate } from '../core/templates/main.js';
  import { renderDocument } from '../core/renderer.js';
  import { samplePack } from '../core/packs/sample/pack.js';

  const state = defaultState();
  const fieldsEl = document.getElementById('fields');
  const frame = document.getElementById('frame');

  // build shared + per-section fields
  function fieldInput(scope, f) {
    const id = `${scope}.${f.key}`;
    const el = f.kind === 'lines' ? document.createElement('textarea') : document.createElement('input');
    el.placeholder = f.placeholder || '';
    el.dataset.scope = scope; el.dataset.key = f.key;
    el.addEventListener('input', () => { setValue(scope, f.key, el.value); render(); });
    const wrap = document.createElement('div');
    const lab = document.createElement('label'); lab.textContent = f.label; lab.htmlFor = id;
    el.id = id; wrap.append(lab, el); return wrap;
  }
  function setValue(scope, key, val) {
    if (scope === 'shared') state.shared[key] = val;
    else state.sections[scope][key] = val;
  }
  function buildForm() {
    const shH = document.createElement('h2'); shH.textContent = '공유 정보'; fieldsEl.append(shH);
    for (const f of SHARED_FIELDS) fieldsEl.append(fieldInput('shared', f));
    for (const [type, specs] of Object.entries(FIELD_SPECS)) {
      const h = document.createElement('h2'); h.textContent = type; fieldsEl.append(h);
      for (const f of specs) fieldsEl.append(fieldInput(type, f));
    }
  }

  let lastHtml = '';
  function render() {
    state.title = document.getElementById('pageTitle').value;
    const content = stateToContent(state);
    const doc = buildPageDoc({ template: mainTemplate, volume: state.volume, content, sharedFacts: content._shared });
    lastHtml = renderDocument(doc, samplePack);
    frame.srcdoc = lastHtml;
  }

  document.getElementById('pageTitle').addEventListener('input', render);
  document.getElementById('volume').addEventListener('click', (e) => {
    const b = e.target.closest('button'); if (!b) return;
    document.querySelectorAll('#volume button').forEach((x) => x.classList.remove('on'));
    b.classList.add('on'); state.volume = b.dataset.v; render();
  });
  document.getElementById('download').addEventListener('click', () => {
    const blob = new Blob([lastHtml], { type: 'text/html' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = 'page.html'; a.click();
    URL.revokeObjectURL(a.href);
  });

  buildForm();
  render();
</script>
</body>
</html>
```

- [ ] **Step 2: Report DONE** — the controller will start a static server and verify in the browser (fill fields → preview updates; switch volume → section count changes; download works). Note in your report that browser verification is deferred to the controller.

- [ ] **Step 3: Commit**

```bash
git add app/generator.html
git commit -m "feat(app): minimal generator UI (form + live preview + download)"
```

---

## Self-Review

**Spec coverage (PRD):**
- §12 대화형 폼 (form-driven input) → Tasks 1-3 ✓ (minimal: plain form, not chat-bubble UI; per-section grouping present)
- §12 live preview (model B is per-section; here whole-page live preview via iframe — simpler, still "see it as you type") → Task 3 ✓
- §3 pipeline (type→volume→content→render) wired end-to-end → Task 3 ✓
- §9 HTML download (single file) → Task 3 download button ✓
- **Deferred:** Framer chrome polish, per-section mini-preview (using whole-page preview instead), style-pack switcher UI, more page types, save/load projects. Noted, not gaps.

**Placeholder scan:** none — full code for every file.

**Type consistency:** `stateToContent` output keys (`nav/hero/feature/cta/footer` + `_shared` + `meta`) match `buildPageDoc`'s `content[type]` reads and the sections' slot names (hero.title/lead/eyebrow/ctas, feature.heading/items, nav.links/cta, cta.heading/sub/button, footer.columns) — cross-checked against `core/sections/*`. `defaultState().volume` = 'heavy' matches the UI's default `.on` button. Field `kind` values ('text'|'lines') match the input-vs-textarea branch in `generator.html`.
