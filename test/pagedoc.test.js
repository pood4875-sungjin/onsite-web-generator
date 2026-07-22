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
