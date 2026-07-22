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
