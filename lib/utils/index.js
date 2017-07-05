/**
 * @module utils
 * @description
 * Contains small utilities for djv project
 */

const REGEXP_URI = /:\/\//;
const REGEXP_URI_FRAGMENT = /#\/?/;
const REGEXP_URI_PATH = /(^[^:]+:\/\/.*\/).*/;

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
  return Object.prototype.hasOwnProperty.call(object, property);
}

function normalize(uri) {
  return decodeURIComponent(uri.replace(/~1/g, '/').replace(/~0/g, '~'));
}

function descent(uri, parentSchema) {
  const uriFragment = fragment(uri);
  if (!uriFragment) {
    return parentSchema;
  }

  const parts = uriFragment.split('/');
  return parts
    .map(normalize)
    .reduce((schema, part) => (
      schema[part] || (
        schema.definitions &&
        schema.definitions[part]
      ))
    , parentSchema);
}

module.exports = {
  cleanId,
  asExpression,
  hasProperty,
  // TODO move to utils/uri
  makePath,
  isFullUri,
  head,
  fragment,
  descent,
};
