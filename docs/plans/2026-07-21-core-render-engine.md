# Core Render Engine Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A pure, deterministic render engine — `renderDocument(pageDoc, pack) -> HTML string` — that turns a data-driven `PageDoc` into a styled single-file HTML page, with a small set of data-driven sections and one sample style pack. Node-testable, no build tools. This is the spine of the generator (PRD §4, §5, §9) and the probe for minimum StylePack completeness (PRD §2).

**Architecture:** ESM modules under `core/`. Content flows `PageDoc (data) → renderer → HTML`; sections are pure functions `render(data, variant, ctx) -> string`. Style comes entirely from a swappable `pack` (tokens + variantMap). The renderer never hardcodes copy or design values. Existing `sections/registry.js` (hardcoded gallery) is left untouched — `core/` is a clean parallel structure that later plans migrate the builder/gallery onto.

**Tech Stack:** Vanilla JS (ESM), Node.js v24 built-in `node:test` + `node:assert` for tests. No dependencies, no bundler. Browser consumes the same ESM via `<script type="module">` in later plans.

---

## Why a new `core/` instead of editing `registry.js`

`sections/registry.js` bakes copy into each `render` (e.g. `<h1>현장의 모든 일…`). The engine needs `render(data, …)` where copy comes from `data`. Rewriting registry.js in place would break `app/builder.html` and `app/gallery.html` which load it as a browser global. So we build `core/` fresh (ESM, data-driven, tested) and migrate consumers in a later plan. The existing render functions are a useful **reference** for markup/variant shapes — copy their structure, replace hardcoded strings with `data` fields.

## File Structure

```
core/
  esc.js              # HTML-escape util (pure)
  pagedoc.js          # PageDoc shape + validatePageDoc()
  sections/
    index.js          # aggregates sections into { [type]: def }, byId lookup
    nav.js            # nav section def
    hero.js           # hero section def
    feature.js        # feature-grid section def
    cta.js            # cta section def
    footer.js         # footer section def
  packs/
    sample/
      pack.js         # sample pack: meta, tokens (object), variantMap
      tokens.css.js   # exported CSS string built from tokens (single source)
  renderer.js         # resolveVariant, renderSections, renderDocument
  probe/
    sample-page.js    # a hardcoded PageDoc (a mini "메인홈")
    build.js          # renders sample-page → writes probe/out.html
test/
  esc.test.js
  pagedoc.test.js
  sections.test.js
  renderer.test.js
package.json          # { "type": "module", "scripts": { "test": "node --test" } }
docs/plans/PROBE-NOTES.md   # created in final task: minimum-pack findings
```

**Section contract (every section def):**
```js
{
  type: 'hero',
  variants: ['split', 'center'],           // first = default
  slots: {                                  // slotSchema (PRD §14 open q, minimal here)
    title: { kind: 'text', required: true },
    lead:  { kind: 'text', default: '' },
    ctas:  { kind: 'list', min: 0, max: 2, item: { label: 'text', href: 'link' } },
    media: { kind: 'media', default: null },
  },
  render(data, variant, ctx) { return '<...>'; }  // pure, uses ctx.esc for text
}
```

**Renderer contract:**
- `resolveVariant(section, def, pack)` → `section.variant || pack.variantMap[section.type] || def.variants[0]`
- `renderSections(pageDoc, pack)` → sections joined, each wrapped `<section class="sx" data-sec="TYPE">…</section>`
- `renderDocument(pageDoc, pack)` → full `<!doctype html>` with pack tokens inlined in `<style>` (single-file output, PRD §9).

**ctx passed to each render:** `{ esc, shared }` where `shared` = `pageDoc.sharedFacts` (product name, logo, primary CTA, contact link — PRD §12). Sections read shared facts from `ctx.shared`, section-specific data from `data`.

---

### Task 0: Test scaffolding

**Files:**
- Create: `package.json`

- [ ] **Step 1: Create package.json** (enables ESM + `npm test`)

```json
{
  "name": "onsite-web-generator",
  "version": "0.1.0",
  "type": "module",
  "private": true,
  "scripts": {
    "test": "node --test"
  }
}
```

- [ ] **Step 2: Verify the test runner works with zero tests**

Run: `cd ~/onsite-web-generator && node --test`
Expected: exits 0 with "tests 0" (no test files yet is fine; if it errors, node version is wrong — require v18+).

- [ ] **Step 3: Commit**

```bash
git add package.json
git commit -m "chore: add package.json for ESM + node:test"
```

---

### Task 1: `esc()` — HTML escape util

Text slots are user content → must be escaped to prevent broken markup / injection.

**Files:**
- Create: `core/esc.js`
- Test: `test/esc.test.js`

- [ ] **Step 1: Write the failing test**

```js
// test/esc.test.js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { esc } from '../core/esc.js';

test('esc escapes html-significant chars', () => {
  assert.equal(esc('<b>&"\'</b>'), '&lt;b&gt;&amp;&quot;&#39;&lt;/b&gt;');
});

test('esc coerces null/undefined to empty string', () => {
  assert.equal(esc(null), '');
  assert.equal(esc(undefined), '');
});

test('esc leaves plain text untouched', () => {
  assert.equal(esc('현장 메신저'), '현장 메신저');
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test test/esc.test.js`
Expected: FAIL — cannot find module `../core/esc.js`.

- [ ] **Step 3: Write minimal implementation**

```js
// core/esc.js
const MAP = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
export function esc(v) {
  if (v === null || v === undefined) return '';
  return String(v).replace(/[&<>"']/g, (c) => MAP[c]);
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test test/esc.test.js`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add core/esc.js test/esc.test.js
git commit -m "feat(core): esc() html-escape util"
```

---

### Task 2: `PageDoc` shape + `validatePageDoc()`

PageDoc is the renderer contract (PRD §4). Minimal runtime validation catches malformed docs early.

**Files:**
- Create: `core/pagedoc.js`
- Test: `test/pagedoc.test.js`

- [ ] **Step 1: Write the failing test**

```js
// test/pagedoc.test.js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validatePageDoc } from '../core/pagedoc.js';

const good = {
  sharedFacts: { productName: 'ONSITE' },
  sections: [
    { type: 'hero', variant: 'split', slotValues: { title: '현장의 모든 일' } },
  ],
};

test('valid pagedoc returns { ok: true, errors: [] }', () => {
  const r = validatePageDoc(good);
  assert.equal(r.ok, true);
  assert.deepEqual(r.errors, []);
});

test('missing sections array is an error', () => {
  const r = validatePageDoc({ sharedFacts: {} });
  assert.equal(r.ok, false);
  assert.ok(r.errors.some((e) => e.includes('sections')));
});

test('section without type is an error', () => {
  const r = validatePageDoc({ sections: [{ slotValues: {} }] });
  assert.equal(r.ok, false);
  assert.ok(r.errors.some((e) => e.includes('type')));
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test test/pagedoc.test.js`
Expected: FAIL — cannot find module `../core/pagedoc.js`.

- [ ] **Step 3: Write minimal implementation**

```js
// core/pagedoc.js
/**
 * @typedef {Object} PageDoc
 * @property {Object} [sharedFacts]  프로젝트 공유 사실 (제품명·로고·주CTA·문의링크)
 * @property {SectionInstance[]} sections  렌더 순서대로
 *
 * @typedef {Object} SectionInstance
 * @property {string} type         섹션 타입 (core/sections 의 키)
 * @property {string} [variant]    미지정 시 pack.variantMap 또는 def 기본값
 * @property {Object} [slotValues] 섹션 슬롯 값
 */

/** @param {any} doc @returns {{ok: boolean, errors: string[]}} */
export function validatePageDoc(doc) {
  const errors = [];
  if (!doc || typeof doc !== 'object') {
    return { ok: false, errors: ['pageDoc must be an object'] };
  }
  if (!Array.isArray(doc.sections)) {
    errors.push('pageDoc.sections must be an array');
  } else {
    doc.sections.forEach((s, i) => {
      if (!s || typeof s.type !== 'string' || !s.type) {
        errors.push(`sections[${i}].type must be a non-empty string`);
      }
    });
  }
  return { ok: errors.length === 0, errors };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test test/pagedoc.test.js`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add core/pagedoc.js test/pagedoc.test.js
git commit -m "feat(core): PageDoc shape + validatePageDoc()"
```

---

### Task 3: First data-driven section — `hero`

Establishes the section contract. Copy markup shape from `sections/registry.js` hero (lines ~56-62) but replace hardcoded copy with `data`/`ctx`.

**Files:**
- Create: `core/sections/hero.js`
- Test: `test/sections.test.js`

- [ ] **Step 1: Write the failing test**

```js
// test/sections.test.js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { hero } from '../core/sections/hero.js';
import { esc } from '../core/esc.js';

const ctx = { esc, shared: { productName: 'ONSITE' } };

test('hero renders title from data (escaped)', () => {
  const html = hero.render({ title: 'A & B', lead: '', ctas: [] }, 'split', ctx);
  assert.match(html, /A &amp; B/);
});

test('hero renders each cta label + href', () => {
  const html = hero.render(
    { title: 'T', ctas: [{ label: '시작', href: '/start' }] },
    'split', ctx,
  );
  assert.match(html, /시작/);
  assert.match(html, /href="\/start"/);
});

test('hero center variant adds center class', () => {
  const html = hero.render({ title: 'T', ctas: [] }, 'center', ctx);
  assert.match(html, /class="[^"]*center/);
});

test('hero declares slots and variants', () => {
  assert.equal(hero.type, 'hero');
  assert.ok(hero.variants.includes('split'));
  assert.ok(hero.slots.title.required);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test test/sections.test.js`
Expected: FAIL — cannot find module `../core/sections/hero.js`.

- [ ] **Step 3: Write minimal implementation**

```js
// core/sections/hero.js
export const hero = {
  type: 'hero',
  variants: ['split', 'center'],
  slots: {
    eyebrow: { kind: 'text', default: '' },
    title:   { kind: 'text', required: true },
    lead:    { kind: 'text', default: '' },
    ctas:    { kind: 'list', min: 0, max: 2, item: { label: 'text', href: 'link' } },
    media:   { kind: 'media', default: null },
  },
  render(data, variant, ctx) {
    const { esc } = ctx;
    const center = variant === 'center';
    const ctas = (data.ctas || [])
      .map((c, i) =>
        `<a class="btn ${i === 0 ? 'primary' : ''}" href="${esc(c.href)}">${esc(c.label)}</a>`)
      .join('');
    const eyebrow = data.eyebrow ? `<div class="eyebrow">${esc(data.eyebrow)}</div>` : '';
    const lead = data.lead ? `<p class="lead">${esc(data.lead)}</p>` : '';
    const txt =
      `<div>${eyebrow}<h1>${esc(data.title)}</h1>${lead}` +
      `<div class="row">${ctas}</div></div>`;
    const media = data.media
      ? `<img class="hero-media" src="${esc(data.media)}" alt="">`
      : '<div class="hero-media placeholder"></div>';
    const body = center ? txt : txt + media;
    return `<div class="container"><div class="hero ${center ? 'center' : ''}">${body}</div></div>`;
  },
};
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test test/sections.test.js`
Expected: PASS (4 tests).

- [ ] **Step 5: Commit**

```bash
git add core/sections/hero.js test/sections.test.js
git commit -m "feat(core): data-driven hero section"
```

---

### Task 4: `feature` section (list slot, count-driven grid)

Proves the list slot + content-driven item count (PRD §4 listSlot, grid wraps).

**Files:**
- Create: `core/sections/feature.js`
- Test: append to `test/sections.test.js`

- [ ] **Step 1: Add failing tests**

```js
// append to test/sections.test.js
import { feature } from '../core/sections/feature.js';

test('feature renders one card per item', () => {
  const html = feature.render(
    { heading: '기능', items: [
      { title: 'A', desc: 'a' }, { title: 'B', desc: 'b' }, { title: 'C', desc: 'c' },
    ] },
    'grid', ctx,
  );
  const cards = html.match(/class="card"/g) || [];
  assert.equal(cards.length, 3);
});

test('feature escapes item text', () => {
  const html = feature.render({ heading: 'H', items: [{ title: '<x>', desc: '' }] }, 'grid', ctx);
  assert.match(html, /&lt;x&gt;/);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test test/sections.test.js`
Expected: FAIL — cannot find module `../core/sections/feature.js`.

- [ ] **Step 3: Write implementation**

```js
// core/sections/feature.js
export const feature = {
  type: 'feature',
  variants: ['grid', 'list'],
  slots: {
    eyebrow: { kind: 'text', default: '' },
    heading: { kind: 'text', required: true },
    sub:     { kind: 'text', default: '' },
    items:   { kind: 'list', min: 2, max: 12, item: { title: 'text', desc: 'text' } },
  },
  render(data, variant, ctx) {
    const { esc } = ctx;
    const eyebrow = data.eyebrow ? `<div class="eyebrow">${esc(data.eyebrow)}</div>` : '';
    const sub = data.sub ? `<p class="sub">${esc(data.sub)}</p>` : '';
    const cards = (data.items || [])
      .map((it) =>
        `<div class="card"><h3>${esc(it.title)}</h3><p class="muted">${esc(it.desc)}</p></div>`)
      .join('');
    const layout = variant === 'list' ? 'stack' : 'grid';
    return (
      `<div class="band"><div class="container">` +
      `<div class="center">${eyebrow}<h2 class="h-sec">${esc(data.heading)}</h2>${sub}</div>` +
      `<div class="${layout}">${cards}</div></div></div>`
    );
  },
};
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test test/sections.test.js`
Expected: PASS (6 tests total in file).

- [ ] **Step 5: Commit**

```bash
git add core/sections/feature.js test/sections.test.js
git commit -m "feat(core): data-driven feature section (list slot)"
```

---

### Task 5: `nav`, `cta`, `footer` sections + section index

Three simpler sections + the aggregator. `nav`/`footer` read shared facts (product name) from `ctx.shared`.

**Files:**
- Create: `core/sections/nav.js`, `core/sections/cta.js`, `core/sections/footer.js`, `core/sections/index.js`
- Test: append to `test/sections.test.js`

- [ ] **Step 1: Add failing tests**

```js
// append to test/sections.test.js
import { nav } from '../core/sections/nav.js';
import { cta } from '../core/sections/cta.js';
import { footer } from '../core/sections/footer.js';
import { sections, byId } from '../core/sections/index.js';

test('nav shows product name from shared facts', () => {
  const html = nav.render({ links: [{ label: '제품', href: '#' }] }, 'solid', ctx);
  assert.match(html, /ONSITE/);
});

test('cta renders heading and button', () => {
  const html = cta.render({ heading: '지금 시작', button: { label: '문의', href: '/c' } }, 'band', ctx);
  assert.match(html, /지금 시작/);
  assert.match(html, /href="\/c"/);
});

test('footer shows product name', () => {
  const html = footer.render({ columns: [] }, 'full', ctx);
  assert.match(html, /ONSITE/);
});

test('index exposes all sections by type', () => {
  ['nav', 'hero', 'feature', 'cta', 'footer'].forEach((t) => {
    assert.equal(byId[t].type, t);
  });
  assert.ok(Array.isArray(sections));
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test test/sections.test.js`
Expected: FAIL — cannot find module `../core/sections/nav.js`.

- [ ] **Step 3: Write implementations**

```js
// core/sections/nav.js
export const nav = {
  type: 'nav',
  variants: ['solid', 'transparent'],
  slots: {
    links: { kind: 'list', min: 0, max: 8, item: { label: 'text', href: 'link' } },
    cta:   { kind: 'text', default: '' },
  },
  render(data, variant, ctx) {
    const { esc, shared } = ctx;
    const brand = esc(shared?.productName || '');
    const links = (data.links || [])
      .map((l) => `<a href="${esc(l.href)}">${esc(l.label)}</a>`)
      .join('');
    const cta = data.cta ? `<a class="btn primary">${esc(data.cta)}</a>` : '';
    return `<div class="gnb ${variant === 'transparent' ? 'trans' : ''}">` +
      `<div class="logo">${brand}</div><nav>${links}</nav>${cta}</div>`;
  },
};
```

```js
// core/sections/cta.js
export const cta = {
  type: 'cta',
  variants: ['band', 'boxed'],
  slots: {
    heading: { kind: 'text', required: true },
    sub:     { kind: 'text', default: '' },
    button:  { kind: 'text', item: { label: 'text', href: 'link' } },
  },
  render(data, variant, ctx) {
    const { esc } = ctx;
    const b = data.button || {};
    const sub = data.sub ? `<p class="sub">${esc(data.sub)}</p>` : '';
    const btn = b.label ? `<a class="btn primary" href="${esc(b.href)}">${esc(b.label)}</a>` : '';
    return `<div class="band ${variant === 'boxed' ? 'boxed' : 'alt'}"><div class="container center">` +
      `<h2 class="h-sec">${esc(data.heading)}</h2>${sub}<div class="row">${btn}</div></div></div>`;
  },
};
```

```js
// core/sections/footer.js
export const footer = {
  type: 'footer',
  variants: ['full', 'slim'],
  slots: {
    columns: { kind: 'list', min: 0, max: 5,
      item: { title: 'text', links: 'list' } },
  },
  render(data, variant, ctx) {
    const { esc, shared } = ctx;
    const brand = esc(shared?.productName || '');
    const cols = (data.columns || [])
      .map((c) => {
        const links = (c.links || []).map((l) => `<a href="${esc(l.href)}">${esc(l.label)}</a>`).join('');
        return `<div class="fcol"><b>${esc(c.title)}</b>${links}</div>`;
      })
      .join('');
    return `<div class="footer ${variant === 'slim' ? 'slim' : ''}"><div class="container">` +
      `<div class="fbrand">${brand}</div><div class="fcols">${cols}</div></div></div>`;
  },
};
```

```js
// core/sections/index.js
import { nav } from './nav.js';
import { hero } from './hero.js';
import { feature } from './feature.js';
import { cta } from './cta.js';
import { footer } from './footer.js';

export const sections = [nav, hero, feature, cta, footer];
export const byId = Object.fromEntries(sections.map((s) => [s.type, s]));
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test test/sections.test.js`
Expected: PASS (10 tests total in file).

- [ ] **Step 5: Commit**

```bash
git add core/sections/nav.js core/sections/cta.js core/sections/footer.js core/sections/index.js test/sections.test.js
git commit -m "feat(core): nav/cta/footer sections + section index"
```

---

### Task 6: Sample style pack (tokens + variantMap)

The probe pack (PRD §2, §6). Tokens live once as an object; `tokensCss()` derives the CSS string.

**Files:**
- Create: `core/packs/sample/pack.js`, `core/packs/sample/tokens.css.js`

- [ ] **Step 1: Write the token → CSS builder**

```js
// core/packs/sample/tokens.css.js
// 토큰 = 단일 소스(객체). CSS 변수 문자열은 여기서 파생.
export const tokens = {
  '--accent': '#0066FF',
  '--ink': '#16181d',
  '--ink-2': '#5b6270',
  '--bg': '#ffffff',
  '--bg-2': '#f5f7fa',
  '--line': '#e6e9ef',
  '--radius': '12px',
  '--fs-h1': '44px',
  '--fs-h2': '30px',
  '--fs-body': '16px',
  '--sp-2': '8px',
  '--sp-4': '16px',
  '--sp-6': '24px',
  '--container': '1120px',
};

export function tokensCss() {
  const body = Object.entries(tokens).map(([k, v]) => `  ${k}: ${v};`).join('\n');
  return `:root{\n${body}\n}`;
}
```

- [ ] **Step 2: Write the pack**

```js
// core/packs/sample/pack.js
import { tokens, tokensCss } from './tokens.css.js';

// 섹션 × (기본) variant. MVP은 섹션당 1개; 페이지타입별 차등은 후속(PRD §Q2-b).
export const samplePack = {
  meta: { id: 'sample', name: 'Sample (probe)', motionDefault: 'subtle' },
  tokens,
  tokensCss,
  variantMap: {
    nav: 'solid',
    hero: 'split',
    feature: 'grid',
    cta: 'band',
    footer: 'full',
  },
};
```

- [ ] **Step 3: Smoke-check it loads**

Run: `node -e "import('./core/packs/sample/pack.js').then(m=>console.log(m.samplePack.meta.id, m.samplePack.tokensCss().slice(0,7)))"`
Expected: prints `sample :root{`

- [ ] **Step 4: Commit**

```bash
git add core/packs/sample/pack.js core/packs/sample/tokens.css.js
git commit -m "feat(core): sample style pack (tokens + variantMap)"
```

---

### Task 7: Renderer — `resolveVariant`, `renderSections`, `renderDocument`

The deterministic engine. `renderDocument` produces a single self-contained HTML file (PRD §9 단일).

**Files:**
- Create: `core/renderer.js`
- Test: `test/renderer.test.js`

- [ ] **Step 1: Write the failing tests**

```js
// test/renderer.test.js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { resolveVariant, renderSections, renderDocument } from '../core/renderer.js';
import { byId } from '../core/sections/index.js';
import { samplePack } from '../core/packs/sample/pack.js';

const doc = {
  sharedFacts: { productName: 'ONSITE' },
  meta: { title: '온사이트' },
  sections: [
    { type: 'nav', slotValues: { links: [{ label: '제품', href: '#' }] } },
    { type: 'hero', slotValues: { title: '현장의 모든 일', ctas: [{ label: '시작', href: '/s' }] } },
  ],
};

test('resolveVariant: explicit > packMap > default', () => {
  assert.equal(resolveVariant({ type: 'hero', variant: 'center' }, byId.hero, samplePack), 'center');
  assert.equal(resolveVariant({ type: 'hero' }, byId.hero, samplePack), 'split');       // packMap
  assert.equal(resolveVariant({ type: 'hero' }, byId.hero, { variantMap: {} }), 'split'); // def default
});

test('renderSections wraps each section with .sx + data-sec', () => {
  const html = renderSections(doc, samplePack);
  assert.match(html, /<section class="sx" data-sec="nav">/);
  assert.match(html, /<section class="sx" data-sec="hero">/);
  assert.match(html, /현장의 모든 일/);
});

test('renderSections skips unknown section types safely', () => {
  const d = { sections: [{ type: 'nope' }, { type: 'hero', slotValues: { title: 'T' } }] };
  const html = renderSections(d, samplePack);
  assert.match(html, /data-sec="hero"/);
  assert.doesNotMatch(html, /data-sec="nope"/);
});

test('renderDocument returns a full self-contained HTML doc with tokens inlined', () => {
  const html = renderDocument(doc, samplePack);
  assert.match(html, /^<!doctype html>/i);
  assert.match(html, /<title>온사이트<\/title>/);
  assert.match(html, /--accent: #0066FF/);          // pack tokens inlined
  assert.match(html, /data-sec="hero"/);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test test/renderer.test.js`
Expected: FAIL — cannot find module `../core/renderer.js`.

- [ ] **Step 3: Write implementation**

```js
// core/renderer.js
import { esc } from './esc.js';
import { byId } from './sections/index.js';

export function resolveVariant(section, def, pack) {
  if (section.variant) return section.variant;
  const mapped = pack?.variantMap?.[section.type];
  if (mapped) return mapped;
  return def.variants[0];
}

export function renderSections(pageDoc, pack) {
  const shared = pageDoc.sharedFacts || {};
  const ctx = { esc, shared };
  return (pageDoc.sections || [])
    .map((s) => {
      const def = byId[s.type];
      if (!def) return ''; // unknown type → skip (no runtime invention, PRD §5.8)
      const variant = resolveVariant(s, def, pack);
      const data = s.slotValues || {};
      return `<section class="sx" data-sec="${esc(s.type)}">${def.render(data, variant, ctx)}</section>`;
    })
    .filter(Boolean)
    .join('\n');
}

export function renderDocument(pageDoc, pack) {
  const title = esc(pageDoc.meta?.title || pack?.meta?.name || 'Untitled');
  const motion = esc(pack?.meta?.motionDefault || 'subtle');
  const tokens = pack?.tokensCss ? pack.tokensCss() : '';
  const body = renderSections(pageDoc, pack);
  return `<!doctype html>
<html lang="ko" data-motion="${motion}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>
<style>
${tokens}
/* base scaffold — pack-agnostic minimal layout so probe is viewable */
*{box-sizing:border-box} body{margin:0;background:var(--bg);color:var(--ink);font-family:system-ui,"Apple SD Gothic Neo",sans-serif}
.container{max-width:var(--container);margin:0 auto;padding:0 24px}
.band{padding:64px 0} .band.alt{background:var(--bg-2)}
.center{text-align:center} h1{font-size:var(--fs-h1);margin:0 0 16px} .h-sec{font-size:var(--fs-h2)}
.btn{display:inline-block;padding:10px 18px;border:1px solid var(--line);border-radius:var(--radius);text-decoration:none;color:var(--ink)}
.btn.primary{background:var(--accent);color:#fff;border-color:var(--accent)}
.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:24px;margin-top:32px}
.card{border:1px solid var(--line);border-radius:var(--radius);padding:24px}
.hero{display:grid;grid-template-columns:1fr 1fr;gap:40px;align-items:center;padding:64px 0}
.hero.center{grid-template-columns:1fr;text-align:center}
.hero-media{width:100%;aspect-ratio:4/3;background:var(--bg-2);border-radius:var(--radius)}
.gnb{display:flex;align-items:center;gap:24px;padding:16px 24px;border-bottom:1px solid var(--line)}
.gnb nav{display:flex;gap:16px;flex:1} .gnb a{text-decoration:none;color:var(--ink-2)}
.footer{background:var(--bg-2);padding:48px 0;margin-top:48px} .row{display:flex;gap:12px}
</style>
</head>
<body>
${body}
</body>
</html>`;
}
```

> Note: the base scaffold CSS here is a **minimal pack-agnostic layout** so the probe renders viewably. In the real pack model (PRD §6), grid/component/layout CSS becomes part of the pack. This scaffold is deliberately thin — what it has to include to look non-broken is itself a **probe finding** (Task 8).

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test test/renderer.test.js`
Expected: PASS (4 tests).

- [ ] **Step 5: Run the whole suite**

Run: `node --test`
Expected: PASS — all files (esc, pagedoc, sections, renderer).

- [ ] **Step 6: Commit**

```bash
git add core/renderer.js test/renderer.test.js
git commit -m "feat(core): deterministic renderer (sections + single-file document)"
```

---

### Task 8: Probe — render a sample page, verify in browser, capture findings

Proves the engine end-to-end and produces the **minimum-pack findings** the user asked for (PRD §2 probe).

**Files:**
- Create: `core/probe/sample-page.js`, `core/probe/build.js`
- Create: `docs/plans/PROBE-NOTES.md`

- [ ] **Step 1: Write a hardcoded sample PageDoc (a mini 메인홈)**

```js
// core/probe/sample-page.js
export const samplePage = {
  meta: { title: '온사이트 — 현장 업무 플랫폼' },
  sharedFacts: { productName: 'ONSITE' },
  sections: [
    { type: 'nav', slotValues: { links: [
      { label: '제품', href: '#' }, { label: '기능', href: '#' }, { label: '요금', href: '#' },
    ], cta: '무료로 시작' } },
    { type: 'hero', slotValues: {
      eyebrow: '현장 업무 플랫폼',
      title: '현장의 모든 일, 하나로 연결됩니다',
      lead: '메시지·일정·문서를 한 곳에서. 현장과 본사가 실시간으로 이어집니다.',
      ctas: [{ label: '무료로 시작하기', href: '/start' }, { label: '도입 문의', href: '/contact' }],
    } },
    { type: 'feature', slotValues: {
      eyebrow: 'Features', heading: '현장에 필요한 모든 것',
      items: [
        { title: '실시간 메시지', desc: '읽음 확인까지 한눈에.' },
        { title: '일정 관리', desc: '팀 일정을 공유하고 알림.' },
        { title: '문서 보관', desc: '현장 문서를 안전하게.' },
        { title: '권한 관리', desc: '역할별 접근 제어.' },
      ],
    } },
    { type: 'cta', slotValues: {
      heading: '지금 바로 시작하세요',
      sub: '설치 없이 웹에서 바로.',
      button: { label: '도입 문의하기', href: '/contact' },
    } },
    { type: 'footer', slotValues: { columns: [
      { title: '제품', links: [{ label: '기능', href: '#' }, { label: '요금', href: '#' }] },
      { title: '회사', links: [{ label: '소개', href: '#' }, { label: '채용', href: '#' }] },
    ] } },
  ],
};
```

- [ ] **Step 2: Write the build script**

```js
// core/probe/build.js
import { writeFileSync } from 'node:fs';
import { renderDocument } from '../renderer.js';
import { validatePageDoc } from '../pagedoc.js';
import { samplePack } from '../packs/sample/pack.js';
import { samplePage } from './sample-page.js';

const v = validatePageDoc(samplePage);
if (!v.ok) { console.error('Invalid PageDoc:', v.errors); process.exit(1); }

const html = renderDocument(samplePage, samplePack);
writeFileSync(new URL('./out.html', import.meta.url), html);
console.log('wrote core/probe/out.html —', html.length, 'bytes');
```

- [ ] **Step 3: Run the build**

Run: `node core/probe/build.js`
Expected: prints `wrote core/probe/out.html — <N> bytes`, file exists.

- [ ] **Step 4: Verify visually in the browser**

Run a static server, then open the probe page and confirm it renders (nav, hero with 2 CTAs, 4 feature cards, CTA band, footer):

Run: `cd ~/onsite-web-generator && python3 -m http.server 4788` (background), then open `http://localhost:4788/core/probe/out.html`.

Use the browser preview tools: `read_page` to confirm the section order and that copy comes from `sample-page.js` (not hardcoded), `screenshot` for proof. Expected: a coherent one-page site, styled by the sample pack's `--accent`.

- [ ] **Step 5: Capture probe findings**

Create `docs/plans/PROBE-NOTES.md` recording what the sample pack + base scaffold had to provide for the page to look non-broken — i.e. the **minimum StylePack completeness** (feeds PRD §6 and track B's onsite-pack target). Use this template and fill each bullet from what you actually observed:

```markdown
# Probe Notes — Minimum Pack Completeness

Source: core/probe/out.html (sample pack + base scaffold).

## Tokens the page could not render without
- (list each --var actually consumed by the 5 sections; note any missing that forced a fallback)

## Layout/grid rules that had to live somewhere
- (container width, hero 2-col, feature auto-grid, band padding rhythm — which are pack vs base scaffold?)

## Component styles needed
- (.btn / .btn.primary, .card, .gnb — enumerate)

## Gaps found (sections that looked wrong)
- (e.g. footer columns unstyled, hero media placeholder empty → what a real pack must add)

## Conclusion — minimum a StylePack must ship (updates PRD §6)
- (2-4 bullets: the real floor for "a pack that produces a non-broken page")
```

- [ ] **Step 6: Commit**

```bash
git add core/probe/sample-page.js core/probe/build.js core/probe/out.html docs/plans/PROBE-NOTES.md
git commit -m "feat(core): probe harness — render sample page + minimum-pack findings"
```

---

## Self-Review

**Spec coverage (PRD):**
- §4 PageDoc / Section / StylePack → Tasks 2, 3-5, 6 ✓
- §5.7 생성=조립(규칙) → renderer is pure string assembly, no AI ✓
- §5.8 런타임 창작 금지 → unknown section types skipped, no invention (Task 7 test) ✓
- §5.9 시스템 정의 → tokens as scale object, sections reference vars (Task 6) ✓
- §6 StylePack (tokens/variantMap subset) → Task 6; full 8-scope is later plans; probe (Task 8) measures the real floor ✓
- §9 단일 HTML 1파일 → renderDocument self-contained (Task 7) ✓
- §12 sharedFacts injection → ctx.shared in nav/footer (Task 5) ✓
- §2 probe → Task 8 ✓
- **Deferred to later plans (out of scope here, by design):** template/volume (§3), input UX (§12), builder (§8), multi-page zip packaging (§9), remaining ~40 sections. Noted so it's not mistaken for a gap.

**Placeholder scan:** No TBD/TODO in steps; every code step has full code; probe-notes template is a fill-in-during-execution artifact, not a plan placeholder. ✓

**Type consistency:** section def shape `{type, variants[], slots{}, render(data,variant,ctx)}` identical across Tasks 3-5. `ctx = {esc, shared}` consistent (Tasks 3,7). `resolveVariant(section, def, pack)` signature matches call site in `renderSections` (Task 7). `pack.tokensCss()` defined (Task 6) and called (Task 7). ✓
