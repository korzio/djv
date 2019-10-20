/**
 * @module utils
 * @description
 * Utilities to check and normalize uri
 */
const REGEXP_URI = /:\/\//;
const REGEXP_URI_FRAGMENT = /#\/?/;
const REGEXP_URI_PATH = /(^[^:]+:\/\/[^?#]*\/).*/;

/**
 * @name keys
 * @type {object}
 * @description
 * Keys to apply schema attributes & values
 */
const keys = {
  id: '$id',
};

/**
 * @name head
 * @type {function}
 * @description
 * Clean an id from its fragment
 * @example
 * head('http://domain.domain:2020/test/a#test')
 * // returns 'http://domain.domain:2020/test/a'
 * @param {string} id
 * @returns {string} cleaned
 */
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
 * @example
 * path('http://domain.domain:2020/test/a?test')
 * // returns 'http://domain.domain:2020/test/'
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
 * @param {array<string>} parts
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

/**
 * @name normalize
 * @type {function}
 * @description
 * Replace json-pointer special symbols in a given uri.
 * @param {string} uri
 * @returns {string} normalizedUri
 */
function normalize(uri) {
  return decodeURIComponent(uri.replace(/~1/g, '/').replace(/~0/g, '~'));
}

module.exports = {
  makePath,
  isFullUri,
  head,
  fragment,
  normalize,
  keys,
};
