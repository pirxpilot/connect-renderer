const test = require('node:test');
const assert = require('node:assert/strict');
const { lookup } = require('../lib/lookup');
const { join, resolve } = require('node:path');

const ROOT = join(__dirname, 'fixtures');

test('lookup should return the full path to the view', async () => {
  const p = await lookup('one.pug', { root: ROOT, ext: '.pug' });
  assert.equal(p, resolve(ROOT, 'one.pug'));
});

test('lookup should return the full path to the view with multiple roots', async () => {
  const root2 = join(ROOT, 'alfa');
  const p = await lookup('two.hbs', { root: [ ROOT, root2 ], ext: '.hbs' });
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
