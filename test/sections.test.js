import { test } from 'node:test';
import assert from 'node:assert/strict';
import { hero } from '../core/sections/hero.js';
import { feature } from '../core/sections/feature.js';
import { nav } from '../core/sections/nav.js';
import { cta } from '../core/sections/cta.js';
import { footer } from '../core/sections/footer.js';
import { sections, byId } from '../core/sections/index.js';
import { esc } from '../core/esc.js';

const ctx = { esc, shared: { productName: 'ONSITE' } };

test('hero renders title from data (escaped)', () => {
  const html = hero.render({ title: 'A & B', lead: '', ctas: [] }, 'split', ctx);
  assert.match(html, /A &amp; B/);
});
test('hero renders each cta label + href', () => {
  const html = hero.render({ title: 'T', ctas: [{ label: '시작', href: '/start' }] }, 'split', ctx);
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

test('feature renders one card per item', () => {
  const html = feature.render(
    { heading: '기능', items: [
      { title: 'A', desc: 'a' }, { title: 'B', desc: 'b' }, { title: 'C', desc: 'c' },
    ] }, 'grid', ctx);
  const cards = html.match(/class="card"/g) || [];
  assert.equal(cards.length, 3);
});
test('feature escapes item text', () => {
  const html = feature.render({ heading: 'H', items: [{ title: '<x>', desc: '' }] }, 'grid', ctx);
  assert.match(html, /&lt;x&gt;/);
});

test('nav shows product name from shared facts', () => {
  const html = nav.render({ links: [{ label: '제품', href: '#' }] }, 'solid', ctx);
  assert.match(html, /ONSITE/);
});
test('nav cta renders label and href when provided', () => {
  const html = nav.render({ links: [], cta: { label: '무료로 시작', href: '/start' } }, 'solid', ctx);
  assert.match(html, /무료로 시작/);
  assert.match(html, /href="\/start"/);
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
test('hero strips javascript: cta href', () => {
  const html = hero.render({ title: 'T', ctas: [{ label: 'x', href: 'javascript:alert(1)' }] }, 'split', ctx);
  assert.doesNotMatch(html, /javascript:/);
});

test('index exposes all sections by type', () => {
  ['nav', 'hero', 'feature', 'cta', 'footer'].forEach((t) => {
    assert.equal(byId[t].type, t);
  });
  assert.ok(Array.isArray(sections));
});
