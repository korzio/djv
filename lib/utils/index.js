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

module.exports = {
  cleanId,
  asExpression,
};
