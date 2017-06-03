/**
 * @name validators
 * @type module
 * @description
 * Contains validators functions links
 * Provides an information about the order in which validators should be applied
 */
const required = require('./required');
const property = require('./property');
const type = require('./type');
const $ref = require('./$ref');
const not = require('./not');
const anyOf = require('./anyOf');
const oneOf = require('./oneOf');
const allOf = require('./allOf');
const dependencies = require('./dependencies');
const properties = require('./properties');
const patternProperties = require('./patternProperties');
const items = require('./items');

module.exports = {
  name: {
    required,
    property,
    type,
    $ref,
    not,
    anyOf,
    oneOf,
    allOf,
    dependencies,
    properties,
    patternProperties,
    items
  },
  list: [
    required,
    property,
    type,
    $ref,
    not,
    anyOf,
    oneOf,
    allOf,
    dependencies,
    properties,
    patternProperties,
    items
  ]
};
