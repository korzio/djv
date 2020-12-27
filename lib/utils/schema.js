/**
 * @module schema
 * @description
 * Low-level utilities to check, create and transform schemas
 */

/**
 * @name transformation
 * @type {object}
 * @description
 * Schema values transformation
 */
const transformation = {
  ANY_SCHEMA: {},
  NOT_ANY_SCHEMA: { not: {} },
};

/**
 * @name is
 * @type {function}
 * @description
 * Verify the object could be a schema
 * Since draft-06 supports boolean as a schema definition
 * @param {object} schema
 * @returns {boolean} isSchema
 */
function is(schema) {
  return (
    typeof schema === 'object' ||
    typeof schema === 'boolean'
  );
}

/**
 * @name transform
 * @type {function}
 * @description
 * Transform a schema pseudo presentation
 * Since draft-06 supports boolean as a schema definition
 * @param {object} schema
 * @returns {object} schema
 */
function transform(schema) {
  if (schema === true) {
    return transformation.ANY_SCHEMA;
  } else if (schema === false) {
    return transformation.NOT_ANY_SCHEMA;
  }
  return schema;
}

/**
 * @name make
 * @type {function}
 * @description
 * Generate a simple schema by a given object
 * @param {any} instance
 * @returns {object} schema
 */
function make(instance) {
  if (typeof instance !== 'object' || instance === null) {
    return { enum: [instance] };
  }

  if (Array.isArray(instance)) {
    return {
      items: instance.map(make),
      // other items should be valid by `false` schema, aka not exist at all
      additionalItems: false
    };
  }

  const required = Object.keys(instance);
  return {
    properties: required.reduce((memo, key) => (
      Object.assign({}, memo, {
        [key]: make(instance[key])
      })
    ), {}),
    required,
    // other properties should be valid by `false` schema, aka not exist at all
    // additionalProperties: false,
  };
}

module.exports = {
  is,
  make,
  transform,
  transformation,
};
