/**
 * @module validators
 * @description
 * Contains validators functions links
 * Provides an information about the order in which validators should be applied
 * Each validator may return true, which means, others will be ignored
 * @see $ref
 */
const required = require('./required');
const format = require('./format');
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
const contains = require('../validators/contains');
const constant = require('../validators/const');
const propertyNames = require('../validators/propertyNames');

module.exports = {
  name: {
    $ref,
    required,
    format,
    property,
    type,
    not,
    anyOf,
    oneOf,
    allOf,
    dependencies,
    properties,
    patternProperties,
    items,
    contains,
    constant,
    propertyNames,
  },
  list: [
    $ref,
    required,
    format,
    property,
    type,
    not,
    anyOf,
    oneOf,
    allOf,
    dependencies,
    properties,
    patternProperties,
    items,
    contains,
    constant,
    propertyNames
  ]
};
