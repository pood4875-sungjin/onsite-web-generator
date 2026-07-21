import { test } from 'node:test';
import assert from 'node:assert/strict';
import { hero } from '../core/sections/hero.js';
import { feature } from '../core/sections/feature.js';
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
