/**
 * @module utils
 * @description
 * Contains small utilities for djv project
 */

const REGEXP_URI = /:\/\//;
const REGEXP_URI_FRAGMENT = /#\/?/;
const REGEXP_URI_PATH = /(^[^:]+:\/\/[^?#]*\/).*/;

// TODO move to environment
const ANY_SCHEMA = {};
const NOT_ANY_SCHEMA = { not: {} };

function cleanId(id) {
  return (id || '').replace(/#.*/g, '');
}

function asExpression(fn, schema, tpl) {
  if (typeof fn !== 'function') {
    return fn;
  }

  return fn(schema, tpl);
}

function head(uri) {
  if (typeof uri !== 'string') {
    return uri;
  }

  const parts = uri.split(REGEXP_URI_FRAGMENT);
  return parts[0];
}

function isFullUri(uri) {
  return REGEXP_URI.test(uri);
}

/**
 * @name path
 * @type {function}
 * @description
 * Gets a scheme, domain and a path part from the uri
 * F.e. from http://domain.domain:2020/test/a?test
 * Should pick http://domain.domain:2020/test/
 * @param {string} uri
 * @returns {string} path
 */
function path(uri) {
  return uri.replace(REGEXP_URI_PATH, '$1');
}

/**
 * @description
 * Get the fragment (#...) part of the uri
 * @see https://tools.ietf.org/html/rfc3986#section-3
 * @param {string} uri
 * @returns {string} fragment
 */
function fragment(uri) {
  if (typeof uri !== 'string') {
    return uri;
  }

  const parts = uri.split(REGEXP_URI_FRAGMENT);
  return parts[1];
}

/**
 * @name makePath
 * @type function
 * @description
 * Concat parts into single uri
 * @see https://tools.ietf.org/html/rfc3986#section-3
 * @param {array[string]} parts
 * @returns {string} uri
 */
function makePath(parts) {
  return parts
    .filter(part => typeof part === 'string')
    .reduce((uri, id) => {
      // if id is full replace uri
      if (!uri.length || isFullUri(id)) {
        return id;
      }
      if (!id) {
        return uri;
      }

      // if fragment found
      if (id.indexOf('#') === 0) {
        // should replace uri's sharp with id
        const sharpUriIndex = uri.indexOf('#');
        if (sharpUriIndex === -1) {
          return uri + id;
        }

        return uri.slice(0, sharpUriIndex) + id;
      }

      // get path part of uri
      // and replace the rest with id
      const partialUri = path(uri) + id;
      return partialUri + (partialUri.indexOf('#') === -1 ? '#' : '');
    }, '');
}

function hasProperty(object, property) {
  return (
    typeof object === 'object' &&
    Object.prototype.hasOwnProperty.call(object, property)
  );
}

/**
 * @name isSchema
 * @type {function}
 * @description
 * Verify the object could be a schema
 * Since draft-06 supports boolean as a schema definition
 * @param {object} schema
 * @returns {boolean} isSchema
 */
function isSchema(schema) {
  return (
    typeof schema === 'object' ||
    typeof schema === 'boolean'
  );
}

/**
 * @name transformSchema
 * @type {function}
 * @description
 * Transform a schema pseudo presentation
 * Since draft-06 supports boolean as a schema definition
 * @param {object} schema
 * @returns {object} schema
 */
function transformSchema(schema) {
  if (schema === true) {
    return ANY_SCHEMA;
  } else if (schema === false) {
    return NOT_ANY_SCHEMA;
  }
  return schema;
}

function normalize(uri) {
  return decodeURIComponent(uri.replace(/~1/g, '/').replace(/~0/g, '~'));
}

/**
 * @name makeSchema
 * @type {function}
 * @description
 * Generate a simple schema by a given object
 * @param {any} instance
 * @returns {object} schema
 */
function makeSchema(instance) {
  if (typeof instance !== 'object' || instance === null) {
    return { enum: [instance] };
  }

  if (Array.isArray(instance)) {
    return {
      items: instance.map(makeSchema),
        // other items should be valid by `false` schema, aka not exist at all
      additionalItems: false
    };
  }

  const required = Object.keys(instance);
  return {
    properties: required.reduce((memo, key) => (
      Object.assign({}, memo, {
        [key]: makeSchema(instance[key])
      })
    ), {}),
    required,
    // other properties should be valid by `false` schema, aka not exist at all
    // additionalProperties: false,
  };
}

const uriKeys = Object.assign(['id', '$ref'], { id: 'id' });

module.exports = {
  cleanId,
  asExpression,
  hasProperty,
  isSchema,
  transformSchema,
  makeSchema,
  // TODO move to utils/uri
  makePath,
  isFullUri,
  head,
  fragment,
  normalize,
  uriKeys,
};
