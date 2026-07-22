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
