import assert from 'node:assert/strict';
import { join } from 'node:path';
import test from 'node:test';
import makeView from '../lib/view.js';

const ROOT = join(import.meta.dirname, 'fixtures');

test('view renders existing template', async t => {
  const TEXT = 'rendered text';
  const render = t.mock.fn(() => TEXT);
  const engine = {
    compile: async () => render
  };

  t.afterEach(() => render.mock.resetCalls());

  await t.test('no ext', async () => {
    const view = makeView('one', {
      root: ROOT,
      defaultEngine: 'pug',
      engines: {
        '.pug': engine
      }
    });
    t.mock.method(engine, 'compile');
    assert.equal(await view.render(), TEXT);
    assert.equal(engine.compile.mock.callCount(), 1);
    assert.equal(render.mock.callCount(), 1);
    assert.deepEqual(render.mock.calls[0].arguments, [{}]);

    assert.equal(await view.render({ option: 4 }), TEXT);
    assert.equal(engine.compile.mock.callCount(), 1);
    assert.equal(render.mock.callCount(), 2);
    assert.deepEqual(render.mock.calls[1].arguments, [{ option: 4 }]);
  });

  await t.test('engine options', async () => {
    const pug = {
      compile: () => render,
      options: { pretty: true }
    };
    const view = makeView('one', {
      root: ROOT,
      defaultEngine: 'pug',
      engines: {
        '.pug': pug
      }
    });
    t.mock.method(pug, 'compile');
    assert.equal(await view.render(), TEXT);
    assert.equal(pug.compile.mock.callCount(), 1);
    assert.deepEqual(pug.compile.mock.calls[0].arguments[1], {
      pretty: true,
      filename: join(ROOT, 'one.pug')
    });
  });

  await t.test('no defaultEngine', async () => {
    const view = makeView('one.pug', {
      root: ROOT,
      engines: {
        '.pug': engine
      }
    });
    assert.equal(await view.render(), TEXT);
  });

  await t.test('invalid template name', async () => {
    const view = makeView('two.pug', {
      root: ROOT,
      engines: {
        '.pug': engine
      }
    });
    await assert.rejects(view.render(), { message: /two.pug/ });
  });

  await t.test('no defaultEngine and now ext', () => {
    assert.throws(
      () =>
        makeView('one', {
          root: ROOT,
          engines: {
            '.pug': engine
          }
        }),
      {
        message: 'No default engine was specified and no extension was provided.'
      }
    );
  });

  await t.test('no matching engine', () => {
    assert.throws(
      () =>
        makeView('one.hbs', {
          root: ROOT,
          engines: {
            '.pug': engine
          }
        }),
      { message: 'Engine not found for the ".hbs" file extension' }
    );
  });
});
