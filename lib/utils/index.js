/**
 * @module utils
 * @description
 * Contains small utilities for djv project
 */

const REGEXP_URI = /:\/\//;
const REGEXP_URI_FRAGMENT = /#\/?/;
const REGEXP_URI_PATH = /(^[^:]+:\/\/.*\/).*/;
const ANY_SCHEMA = {};
const NOT_ANY_SCHEMA = { not: {} };

function cleanId(id) {
  return (id || '').replace(/#/g, '');
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
      if (!uri.length) {
        return id;
      }

      // if id is full replace uri
      if (isFullUri(id)) {
        return id;
      }

      // if fragment found
      if (id.indexOf('#') === 0) {
        // should replace uri's sharp with id
        const sharpUriIndex = uri.indexOf('#');
        return uri.slice(0, sharpUriIndex) + id;
      }

      // get path part of uri
      // and replace the rest with id
      const partialUri = path(uri) + id;
      return partialUri + (partialUri.indexOf('#') === -1 ? '#' : '');
    }, '');
}

function hasProperty(object, property) {
  return typeof object === 'object' && Object.prototype.hasOwnProperty.call(object, property);
}

/**
 * @name isSchema
 * @type {function}
 * @description
 * Verify the object could be a schema
 * Since draft-06 supports boolean as a schema definition
 * @param {object} schema
 */
function isSchema(schema) {
  return typeof schema === 'object' || typeof schema === 'boolean';
}

/**
 * @name transformSchema
 * @type {function}
 * @description
 * Transform a schema pseudo presentation
 * Since draft-06 supports boolean as a schema definition
 * @param {object} schema
 */
function transformSchema(schema) {
  if (schema === true) {
    return ANY_SCHEMA;
  } else if (schema === false) {
    return NOT_ANY_SCHEMA;
  }
}

function normalize(uri) {
  return decodeURIComponent(uri.replace(/~1/g, '/').replace(/~0/g, '~'));
}

function descent(uri, parentSchema) {
  let uriFragment = fragment(uri);
  if (!uriFragment && isFullUri(uri)) {
    return parentSchema;
  }

  if (!uriFragment) {
    uriFragment = uri;
  }

  const parts = uriFragment.split('/');
  const currentSchema = parts
    .map(normalize)
    .reduce((schema, part) => (
      schema[part] || (
        schema.definitions &&
        schema.definitions[part]
      ))
    , parentSchema);

  return currentSchema || parentSchema;
}

module.exports = {
  cleanId,
  asExpression,
  hasProperty,
  isSchema,
  transformSchema,
  // TODO move to utils/uri
  makePath,
  isFullUri,
  head,
  fragment,
  descent,
};
