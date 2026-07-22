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
