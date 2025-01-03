const test = require('node:test');
const assert = require('node:assert/strict');
const makeRenderer = require('..');
const { join } = require('node:path');

const ROOT = join(__dirname, 'fixtures');

test('renderer should be a middleware', (t, done) => {
  const TEXT = 'rendered text';
  const render = t.mock.fn(() => TEXT);
  const engine = {
    compile: async() => render
  };

  const renderer = makeRenderer(ROOT).engine('pug', engine);
  assert.equal(typeof renderer, 'function');
  assert.equal(renderer.length, 3);

  const req = {
    app: {
      locals: {
        appOpt: true
      }
    }
  };
  const res = {
    end: () => {},
    locals: {
      resOpt: true
    }
  };

  t.mock.method(res, 'end');
  t.mock.method(engine, 'compile');

  renderer(req, res, async (err) => {
    assert.ifError(err);
    assert.equal(typeof res.render, 'function');

    await res.render('alfa');

    assert.equal(res.end.mock.callCount(), 1, 'res.end was called once');
    assert.deepEqual(res.end.mock.calls[0].arguments, [ TEXT, 'utf-8' ]);

    assert.equal(render.mock.callCount(), 1);
    assert.equal(engine.compile.mock.callCount(), 1);

    await res.render('alfa', { option: 3 });

    assert.equal(res.end.mock.callCount(), 2);
    assert.deepEqual(res.end.mock.calls[1].arguments, [ TEXT, 'utf-8' ]);

    assert.equal(render.mock.callCount(), 2);
    assert.deepEqual(render.mock.calls[1].arguments, [ { option: 3, resOpt: true, appOpt: true } ]);
    assert.equal(engine.compile.mock.callCount(), 1);

    done();
  });
});
