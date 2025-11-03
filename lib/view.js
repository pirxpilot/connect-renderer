const fs = require('node:fs/promises');
const { extname } = require('node:path');
const { lookup } = require('./lookup');

const debug = require('debug')('connect:view');

module.exports = view;

/**
 * Create view for the given view name and options.
 *
 * @param {string} name of the view relative to the views directory
 * @param {object} options with defaultEngine, engines, and root
 * @returns {object} view with render function
 */
function view(name, { defaultEngine, engines, root }) {
  let ext = extname(name);

  if (!ext && !defaultEngine) {
    throw new Error('No default engine was specified and no extension was provided.');
  }

  let fileName = name;

  if (!ext) {
    // use default engine name as file extension
    ext = `.${defaultEngine}`;
    fileName += ext;
  }
  const engine = engines[ext];
  if (!engine) {
    throw new Error(`Engine not found for the "${ext}" file extension`);
  }
  const futureRenderFn = compile();

  return {
    render
  };

  /**
   * Render with the given options.
   *
   * @param {object} options passed to the render function
   * @returns {Promise<string>} rendered view
   */
  async function render(options = {}) {
    const renderFn = await futureRenderFn;
    return renderFn(options);
  }

  /**
   * Compile the template.
   *
   * @param {object} options passed to the compile function
   * @returns {Promise<function>} render function
   */
  async function compile() {
    const path = await checkPath();
    debug('compile "%s"', path);
    const template = await fs.readFile(path, 'utf8');
    const { options = {} } = engine;
    return engine.compile(template, {
      ...options,
      filename: path
    });
  }

  /**
   * Locates the template file corresponding to the view.
   *
   * @param {string} fileName
   * @param {string|Array<string>} root directory or list of directories
   * @throws {Error} if the view cannot be found
   * @returns {Promise<string>} full path to the template file
   *
   */
  async function checkPath() {
    const path = await lookup(fileName, { root, ext });
    if (!path) {
      const err = new Error(`Failed to lookup view "${name}" in views ${root}`);
      err.view = this;
      throw err;
    }
    return path;
  }
}
