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

function head(uri) {
  if (typeof uri !== 'string') {
    return uri;
  }

  const parts = uri.split(/#\/?/);
  return parts[0];
}

function tail(uri) {
  if (typeof uri !== 'string') {
    return uri;
  }

  const parts = uri.split(/#\/?/);
  return parts[1];
}

module.exports = {
  cleanId,
  asExpression,
  joinPath,
  head,
  tail,
};
