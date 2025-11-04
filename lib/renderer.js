import makeView from './view.js';
export default function getMiddleware(opts = {}) {
  if (typeof opts === 'string') {
    opts = { root: opts };
  }
  opts.engines ??= Object.create(null);
  opts.root ??= process.cwd();
  const renderer = makeRenderer();
  return Object.assign(middleware, { engine });

  function engine(name, module) {
    if (!module) {
      module = require(name);
    }
    opts.engines[`.${name}`] = module;
    opts.defaultEngine ??= name;
    return middleware;
  }

  function middleware(req, res, next) {
    res.render = render;
    next();

    async function render(name, opts) {
      opts = Object.assign({}, req.app?.locals, res.locals, opts);
      const text = await renderer.render(name, opts);
      if (!res.hasHeader('Content-Type')) {
        res.setHeader('Content-Type', 'text/html');
      }
      res.setHeader('Content-Length', Buffer.byteLength(text));
      res.end(text);
    }
  }

  function makeRenderer() {
    const viewCache = new Map();
    const { locals, engines } = opts;

    return {
      render
    };

    function render(name, renderOptions) {
      let view = viewCache.get(name);
      // view
      if (!view) {
        view = makeView(name, {
          defaultEngine: opts.defaultEngine,
          root: opts.root,
          engines
        });
        viewCache.set(name, view);
      }

      // render
      return view.render(Object.assign({}, locals, renderOptions));
    }
  }
}
