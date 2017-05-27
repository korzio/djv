const required = require('./validators/required');
const property = require('./validators/property');
const type = require('./validators/type');
const $ref = require('./validators/$ref');
const not = require('./validators/not');
const anyOf = require('./validators/anyOf');
const oneOf = require('./validators/oneOf');
const allOf = require('./validators/allOf');
const dependencies = require('./validators/dependencies');
const properties = require('./validators/properties');
const patternProperties = require('./validators/patternProperties');
const items = require('./validators/items');

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
