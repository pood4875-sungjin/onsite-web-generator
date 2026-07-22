import { test } from 'node:test';
import assert from 'node:assert/strict';
import { FIELD_SPECS, SHARED_FIELDS } from '../app/field-specs.js';

test('has field specs for each of the 5 sections', () => {
  for (const type of ['nav', 'hero', 'feature', 'cta', 'footer']) {
    assert.ok(Array.isArray(FIELD_SPECS[type]), `missing specs for ${type}`);
  }
});
test('each field has key, label, kind', () => {
  for (const specs of Object.values(FIELD_SPECS)) {
    for (const f of specs) {
      assert.ok(f.key && f.label && f.kind, `bad field ${JSON.stringify(f)}`);
      assert.ok(['text', 'lines'].includes(f.kind));
    }
  }
});
test('shared fields include productName', () => {
  assert.ok(SHARED_FIELDS.some((f) => f.key === 'productName'));
});
