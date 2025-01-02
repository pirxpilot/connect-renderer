[![NPM version][npm-image]][npm-url]
[![Build Status][build-image]][build-url]
[![Dependency Status][deps-image]][deps-url]

# connect-renderer

[Connect compatible][connect] implementation of template renderer. Inspired and based on `res.render()` implementation in [Express][express]

To be used where entire [express] functionality is not needed.

## Install

```sh
$ npm install --save connect-renderer
```

## Usage

```js
var connectRenderer = require('connect-renderer');

connectRenderer('Rainbow');
```

## License

MIT © [Damian Krzeminski](https://pirxpilot.me)

[connect]: https://npmjs.org/package/connect
[express]: https://npmjs.org/package/express

[npm-image]: https://img.shields.io/npm/v/connect-renderer
[npm-url]: https://npmjs.org/package/connect-renderer

[build-url]: https://github.com/pirxpilot/connect-renderer/actions/workflows/check.yaml
[build-image]: https://img.shields.io/github/actions/workflow/status/pirxpilot/connect-renderer/check.yaml?branch=main

[deps-image]: https://img.shields.io/librariesio/release/npm/connect-renderer
[deps-url]: https://libraries.io/npm/connect-renderer
