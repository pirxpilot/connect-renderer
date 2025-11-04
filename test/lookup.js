import assert from 'node:assert/strict';
import { join, resolve } from 'node:path';
import test from 'node:test';
import { lookup } from '../lib/lookup.js';

const ROOT = resolve(import.meta.dirname, 'fixtures');

test('lookup should return the full path to the view', async () => {
  const p = await lookup('one.pug', { root: ROOT, ext: '.pug' });
  assert.equal(p, resolve(ROOT, 'one.pug'));
});

test('lookup should return the full path to the view with multiple roots', async () => {
  const root2 = join(ROOT, 'alfa');
  const p = await lookup('two.hbs', { root: [ROOT, root2], ext: '.hbs' });
  assert.equal(p, resolve(root2, 'two.hbs'));
});

test('lookup should return the full path to the view with multiple roots', async () => {
  const p = await lookup('alfa/two.hbs', { root: ROOT, ext: '.hbs' });
  assert.equal(p, resolve(ROOT, 'alfa/two.hbs'));
});

test('lookup should locate index file', async () => {
  const p = await lookup('alfa', { root: ROOT, ext: '.pug' });
  assert.equal(p, resolve(ROOT, 'alfa/index.pug'));
});

test('lookup should return null for non-existing file', async () => {
  const p = await lookup('nonexistent', { root: ROOT, ext: '.pug' });
  assert.equal(p, undefined);
});
