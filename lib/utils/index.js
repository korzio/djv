/**
 * @module utils
 * @description
 * Basic utilities for djv project
 */

/**
 * @name asExpression
 * @type {function}
 * @description
 * Transform function or string to expression
 * @see validators
 * @param {function|string} fn
 * @param {object} schema
 * @param {object} tpl templater instance
 * @returns {string} expression
 */
function asExpression(fn, schema, tpl) {
  if (typeof fn !== 'function') {
    return fn;
  }

  return fn(schema, tpl);
}

/**
 * @name hasProperty
 * @type {function}
 * @description
 * Check if the property exists in a given object
 * @param {object} object
 * @param {string} property
 * @returns {boolean} exists
 */
function hasProperty(object, property) {
  return (
    typeof object === 'object' &&
    Object.prototype.hasOwnProperty.call(object, property)
  );
}

module.exports = {
  asExpression,
  hasProperty,
};
