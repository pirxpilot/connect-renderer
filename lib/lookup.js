const fs = require('node:fs/promises');
const { resolve, dirname, basename, join } = require('node:path/posix');
const debug = require('debug')('connect:renderer');

module.exports = { lookup };

/**
 * Lookup view by the given name.
 *
 * @param {string} name
 * @param {object} options with root and ext
 * @returns {Promise<string>} full path to the view or undefined if not found
 */

async function lookup(name, { root, ext }) {
  const roots = [].concat(root);

  debug('lookup "%s"', name);

  for (const root of roots) {
    // resolve the path
    const loc = resolve(root, name);
    const dir = dirname(loc);
    const file = basename(loc);

    // resolve the file
    const path = await resolvePath(dir, file, ext);
    if (path) {
      return path;
    }
  }
}

/**
 * Resolve the file within the given directory.
 *
 * @param {string} dir
 * @param {string} file
 * @param {string} ext
 */

async function resolvePath(dir, file, ext) {
  // <path>.<ext>
  let path = join(dir, file);
  if (await isFile(path)) {
    return path;
  }

  // <path>/index.<ext>
  path = join(dir, basename(file, ext), `index${ext}`);
  if (await isFile(path)) {
    return path;
  }
}

async function isFile(path) {
  const stat = await fs.stat(path).catch(() => null);
  return stat?.isFile();
}
