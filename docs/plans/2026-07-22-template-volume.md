# Template + Volume Layer Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans. Steps use checkbox (`- [ ]`) syntax.

**Goal:** Add the assembly layer above the render engine — pick a page-type **template** (ordered sections with volume tiers), choose a **volume** (compact/mid/heavy), attach content, and produce a `PageDoc` the existing engine renders. Result: "choose page type + volume → get a page" without hand-writing a PageDoc. (PRD §3, §4, §13.)

**Architecture:** Pure functions over data, same style as `core/`. A template is a data file (`{pageType, sections:[{type, tier}]}`). `buildPageDoc({template, volume, content, sharedFacts})` filters sections by tier≤volume and attaches per-section content, yielding a valid PageDoc. Feeds unchanged into the existing `renderDocument`. No engine changes.

**Tech Stack:** Vanilla JS ESM, Node v24 `node:test`. Builds on the merged core render engine (`core/renderer.js`, `core/pagedoc.js`, `core/sections/*`, `core/packs/sample`).

---

## File Structure

```
core/
  volume.js            # tier/volume constants + includesTier(volume, tier)
  template.js          # buildPageDoc({template, volume, content, sharedFacts})
  templates/
    main.js            # 메인홈 template: ordered sections + tiers
  probe/
    build-volumes.js   # render main template at compact & heavy → two html files
test/
  volume.test.js
  template.test.js
```

**Concepts:**
- **Tier** (per section in a template): `core` (always shown), `mid`, `rich`.
- **Volume** (chosen per page): `compact` (core only), `mid` (core+mid), `heavy` (all).
- A section is included when its tier's threshold ≤ the chosen volume's threshold.

---

### Task 1: `volume.js` — tier/volume logic

**Files:** Create `core/volume.js`; Test `test/volume.test.js`

- [ ] **Step 1: Write the failing test**

```js
// test/volume.test.js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { includesTier, VOLUMES, TIERS } from '../core/volume.js';

test('compact includes only core', () => {
  assert.equal(includesTier('compact', 'core'), true);
  assert.equal(includesTier('compact', 'mid'), false);
  assert.equal(includesTier('compact', 'rich'), false);
});
test('mid includes core + mid, not rich', () => {
  assert.equal(includesTier('mid', 'core'), true);
  assert.equal(includesTier('mid', 'mid'), true);
  assert.equal(includesTier('mid', 'rich'), false);
});
test('heavy includes everything', () => {
  assert.equal(includesTier('heavy', 'core'), true);
  assert.equal(includesTier('heavy', 'mid'), true);
  assert.equal(includesTier('heavy', 'rich'), true);
});
test('exposes VOLUMES and TIERS lists', () => {
  assert.deepEqual(VOLUMES, ['compact', 'mid', 'heavy']);
  assert.deepEqual(TIERS, ['core', 'mid', 'rich']);
});
```

- [ ] **Step 2: Run — confirm FAIL**

Run: `node --test test/volume.test.js` → cannot find module.

- [ ] **Step 3: Implement**

```js
// core/volume.js
// 볼륨 = 페이지가 보여줄 깊이. 섹션 tier가 볼륨 임계값 이하면 포함.
export const VOLUMES = ['compact', 'mid', 'heavy'];
export const TIERS = ['core', 'mid', 'rich'];

const VOLUME_LEVEL = { compact: 0, mid: 1, heavy: 2 };
const TIER_LEVEL = { core: 0, mid: 1, rich: 2 };

/** @param {string} volume @param {string} tier @returns {boolean} */
export function includesTier(volume, tier) {
  const v = VOLUME_LEVEL[volume];
  const t = TIER_LEVEL[tier];
  if (v === undefined || t === undefined) return false;
  return t <= v;
}
```

- [ ] **Step 4: Run — confirm PASS (4 tests)**

Run: `node --test test/volume.test.js`

- [ ] **Step 5: Commit**

```bash
git add core/volume.js test/volume.test.js
git commit -m "feat(core): volume/tier inclusion logic"
```

---

### Task 2: `templates/main.js` — 메인홈 template

**Files:** Create `core/templates/main.js` (no separate test — exercised via Task 3)

- [ ] **Step 1: Create the template**

```js
// core/templates/main.js
// 메인홈 페이지 타입의 섹션 구성. 순서 = 렌더 순서. tier = 볼륨에 따라 포함 여부.
export const mainTemplate = {
  pageType: 'main',
  sections: [
    { type: 'nav', tier: 'core' },
    { type: 'hero', tier: 'core' },
    { type: 'feature', tier: 'mid' },
    { type: 'cta', tier: 'rich' },
    { type: 'footer', tier: 'core' },
  ],
};
```

- [ ] **Step 2: Smoke-check it loads**

Run: `node -e "import('./core/templates/main.js').then(m=>console.log(m.mainTemplate.pageType, m.mainTemplate.sections.length))"`
Expected: prints `main 5`

- [ ] **Step 3: Commit**

```bash
git add core/templates/main.js
git commit -m "feat(core): main page-type template"
```

---

### Task 3: `template.js` — `buildPageDoc()`

**Files:** Create `core/template.js`; Test `test/template.test.js`

- [ ] **Step 1: Write the failing test**

```js
// test/template.test.js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildPageDoc } from '../core/template.js';
import { mainTemplate } from '../core/templates/main.js';
import { validatePageDoc } from '../core/pagedoc.js';

const content = {
  meta: { title: '온사이트' },
  hero: { title: '현장의 모든 일' },
  feature: { heading: '기능', items: [{ title: 'A', desc: 'a' }, { title: 'B', desc: 'b' }] },
  cta: { heading: '지금 시작' },
};

test('compact keeps only core sections (nav, hero, footer)', () => {
  const doc = buildPageDoc({ template: mainTemplate, volume: 'compact', content });
  assert.deepEqual(doc.sections.map((s) => s.type), ['nav', 'hero', 'footer']);
});
test('heavy keeps all sections in template order', () => {
  const doc = buildPageDoc({ template: mainTemplate, volume: 'heavy', content });
  assert.deepEqual(doc.sections.map((s) => s.type), ['nav', 'hero', 'feature', 'cta', 'footer']);
});
test('attaches per-section content as slotValues', () => {
  const doc = buildPageDoc({ template: mainTemplate, volume: 'heavy', content });
  const hero = doc.sections.find((s) => s.type === 'hero');
  assert.equal(hero.slotValues.title, '현장의 모든 일');
});
test('sections missing from content get empty slotValues', () => {
  const doc = buildPageDoc({ template: mainTemplate, volume: 'compact', content: {} });
  assert.deepEqual(doc.sections.find((s) => s.type === 'nav').slotValues, {});
});
test('passes sharedFacts and meta through', () => {
  const doc = buildPageDoc({
    template: mainTemplate, volume: 'compact', content, sharedFacts: { productName: 'ONSITE' },
  });
  assert.equal(doc.sharedFacts.productName, 'ONSITE');
  assert.equal(doc.meta.title, '온사이트');
});
test('output is a valid PageDoc', () => {
  const doc = buildPageDoc({ template: mainTemplate, volume: 'heavy', content });
  assert.equal(validatePageDoc(doc).ok, true);
});
```

- [ ] **Step 2: Run — confirm FAIL**

Run: `node --test test/template.test.js` → cannot find module.

- [ ] **Step 3: Implement**

```js
// core/template.js
import { includesTier } from './volume.js';

/**
 * 템플릿 + 볼륨 + 콘텐츠 → PageDoc.
 * @param {{template: {sections: {type:string,tier:string}[]}, volume: string,
 *          content?: Object, sharedFacts?: Object}} args
 * @returns {import('./pagedoc.js').PageDoc}
 */
export function buildPageDoc({ template, volume, content = {}, sharedFacts = {} }) {
  const sections = template.sections
    .filter((s) => includesTier(volume, s.tier))
    .map((s) => ({ type: s.type, slotValues: content[s.type] || {} }));
  return {
    meta: content.meta || {},
    sharedFacts,
    sections,
  };
}
```

- [ ] **Step 4: Run — confirm PASS (6 tests)**

Run: `node --test test/template.test.js`

- [ ] **Step 5: Commit**

```bash
git add core/template.js test/template.test.js
git commit -m "feat(core): buildPageDoc (template + volume → PageDoc)"
```

---

### Task 4: Probe — render main template at compact vs heavy

Proves the whole chain (template → volume → PageDoc → engine → HTML) and gives a visible compact-vs-heavy comparison.

**Files:** Create `core/probe/build-volumes.js`

- [ ] **Step 1: Write the build script**

```js
// core/probe/build-volumes.js
import { writeFileSync } from 'node:fs';
import { buildPageDoc } from '../template.js';
import { mainTemplate } from '../templates/main.js';
import { renderDocument } from '../renderer.js';
import { samplePack } from '../packs/sample/pack.js';

const sharedFacts = { productName: 'ONSITE' };
const content = {
  meta: { title: '온사이트 — 볼륨 데모' },
  nav: { links: [{ label: '제품', href: '#' }, { label: '요금', href: '#' }],
         cta: { label: '무료로 시작', href: '/start' } },
  hero: { eyebrow: '현장 업무 플랫폼', title: '현장의 모든 일, 하나로 연결됩니다',
          lead: '메시지·일정·문서를 한 곳에서.',
          ctas: [{ label: '무료로 시작하기', href: '/start' }] },
  feature: { eyebrow: 'Features', heading: '현장에 필요한 모든 것',
    items: [
      { title: '실시간 메시지', desc: '읽음 확인까지.' },
      { title: '일정 관리', desc: '팀 일정 공유.' },
      { title: '문서 보관', desc: '안전하게.' },
    ] },
  cta: { heading: '지금 바로 시작하세요', sub: '설치 없이 웹에서.',
         button: { label: '도입 문의하기', href: '/contact' } },
  footer: { columns: [
    { title: '제품', links: [{ label: '기능', href: '#' }] },
    { title: '회사', links: [{ label: '소개', href: '#' }] },
  ] },
};

for (const volume of ['compact', 'heavy']) {
  const doc = buildPageDoc({ template: mainTemplate, volume, content, sharedFacts });
  const html = renderDocument(doc, samplePack);
  writeFileSync(new URL(`./out-${volume}.html`, import.meta.url), html);
  console.log(`wrote core/probe/out-${volume}.html — ${doc.sections.length} sections`);
}
```

- [ ] **Step 2: Run it**

Run: `node core/probe/build-volumes.js`
Expected: prints `wrote core/probe/out-compact.html — 3 sections` and `wrote core/probe/out-heavy.html — 5 sections`. Both files exist.

- [ ] **Step 3: Run the full suite**

Run: `node --test`
Expected: all pass (prior 27 + 10 new = 37).

- [ ] **Step 4: Commit**

```bash
git add core/probe/build-volumes.js core/probe/out-compact.html core/probe/out-heavy.html
git commit -m "feat(core): volume probe — main template at compact vs heavy"
```

---

## Self-Review

**Spec coverage (PRD):**
- §3 pipeline (page type → template → volume → PageDoc) → Tasks 2, 3 ✓
- §4 Template shape (sections + tier) → Task 2 ✓
- §4 volume = section count via tiers → Task 1, 3 ✓
- §4 sharedFacts pass-through → Task 3 ✓
- Feeds unchanged into engine (§4 앞문/뒷문 분리) → Task 4 proves it ✓
- **Deferred (not this plan):** more page-type templates, input UX to gather `content`, more sections, multi-page. Only the `main` template + the assembly function are in scope.

**Placeholder scan:** none — every step has full code and exact commands.

**Type consistency:** `includesTier(volume, tier)` signature identical in volume.js and template.js call site. Template shape `{pageType, sections:[{type,tier}]}` matches what `buildPageDoc` reads. `buildPageDoc` output `{meta, sharedFacts, sections:[{type, slotValues}]}` matches `validatePageDoc` + `renderSections` expectations (verified against merged engine).
