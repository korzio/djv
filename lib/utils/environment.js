/**
 * @module environment
 * @description
 * Update the given environment
 */
const properties = require('./properties');
const keywords = require('./keywords');

const environmentConfig = {
  // TODO remove side effects
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
  },
};

module.exports = function environment(version) {
  if (!version || !environmentConfig[version]) {
    return;
  }

  const patchEnvironment = environmentConfig[version];
  patchEnvironment();
};
