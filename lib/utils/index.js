/**
 * @module utils
 * @description
 * Contains small utilities for djv project
 */
function cleanId(id) {
  return (id || '').replace(/#/g, '');
}

function asExpression(fn, schema, tpl) {
  if (typeof fn !== 'function') {
    return fn;
  }

  return fn(schema, tpl);
}

function joinPath(parts) {
  return parts.reduce((memo, id) => {
    if (typeof id !== 'string') {
      return memo;
    }

    const delimiter = !memo.length || id.charAt(0) === '/' || memo.charAt(memo.length - 1) === '/' ? '' : '/';
    return memo + delimiter + id;
  }, '');
}

module.exports = {
  cleanId,
  asExpression,
  joinPath,
};
