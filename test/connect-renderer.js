const test = require('node:test');
const assert = require('node:assert/strict');
const connectRenderer = require('../');

test.todo('connect-renderer must have at least one test', function () {
  connectRenderer();
  assert.ok('Need to write tests.');
});
