import { test } from 'node:test';
import assert from 'node:assert/strict';
import { safeUrl } from '../core/url.js';

test('safeUrl allows http/https/mailto/tel', () => {
  for (const u of ['http://a.com', 'https://a.com/x', 'mailto:a@b.com', 'tel:+8210']) {
    assert.equal(safeUrl(u), u);
  }
});
test('safeUrl allows relative, anchor, query, protocol-relative', () => {
  for (const u of ['/start', './x', '../y', '#sec', '?q=1', '//cdn.com/x']) {
    assert.equal(safeUrl(u), u);
  }
});
test('safeUrl blocks dangerous schemes → empty string', () => {
  for (const u of ['javascript:alert(1)', 'JavaScript:alert(1)', 'data:text/html,x', 'vbscript:x']) {
    assert.equal(safeUrl(u), '');
  }
});
test('safeUrl coerces null/undefined/empty → empty string', () => {
  assert.equal(safeUrl(null), '');
  assert.equal(safeUrl(undefined), '');
  assert.equal(safeUrl('  '), '');
});
test('safeUrl treats scheme-less token as relative (passes through)', () => {
  assert.equal(safeUrl('contact'), 'contact');
});
