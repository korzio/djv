/**
 * @module environment
 * @description
 * Update the given environment
 */
const properties = require('./properties');
const keywords = require('./keywords');
const validators = require('../validators');

const contains = require('../validators/contains');
const constant = require('../validators/const');
const propertyNames = require('../validators/propertyNames');

const environmentConfig = {
  // TODO remove side effects
  // TODO make draft-06 default
  'draft-06': () => {
    Object.assign(properties, {
      exclusiveMinimum(schema) {
        return `%s <= ${schema.exclusiveMinimum}`;
      },
      minimum(schema) {
        return `%s < ${schema.minimum}`;
      },
      exclusiveMaximum(schema) {
        return `%s >= ${schema.exclusiveMaximum}`;
      },
      maximum(schema) {
        return `%s > ${schema.maximum}`;
      },
    });

    ['exclusiveMaximum', 'exclusiveMininum'].forEach((key) => {
      const index = keywords.indexOf(key);
      if (index === -1) {
        return;
      }

      keywords.splice(index, 1);
    });

    if (validators.list.indexOf(contains) === -1) {
      validators.list.push(
        contains,
        constant,
        propertyNames
      );
    }

    Object.assign(validators.name, {
      contains,
      constant,
      propertyNames
    });
  },
};

module.exports = function environment(version) {
  if (!version || !environmentConfig[version]) {
    return;
  }

  const patchEnvironment = environmentConfig[version];
  patchEnvironment();
};
