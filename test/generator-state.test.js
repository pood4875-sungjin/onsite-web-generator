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
