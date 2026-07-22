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
  assert.equal(resolveVariant({ type: 'hero' }, byId.hero, samplePack), 'split');
  assert.equal(resolveVariant({ type: 'hero' }, byId.hero, { variantMap: {} }), 'split');
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
  assert.match(html, /--accent: #0066FF/);
  assert.match(html, /data-sec="hero"/);
});
