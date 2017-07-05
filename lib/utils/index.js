/**
 * @module utils
 * @description
 * Contains small utilities for djv project
 */
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

  const parts = uri.split(/#\/?/);
  return parts[0];
}

function isFullUri(uri) {
  return /:\/\//.test(uri);
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
  return uri.replace(/(^[^:]+:\/\/.*\/).*/, '$1');
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

  const parts = uri.split(/#\/?/);
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

      // if sharp delimiter found
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
  return uri.replace(/~1/g, '/').replace(/~0/g, '~');
}

function descent(reference, parentSchema) {
  const name = fragment(reference);
  const components = name && name.split('/');

  let currentSchema = parentSchema;
  // TODO change while to forEach
  while (components && components.length > 0) {
    const currentPath = decodeURIComponent(normalize(components[0]));
    currentSchema = currentSchema[currentPath] ||
      (currentSchema.definitions && currentSchema.definitions[currentPath]);

    if (!currentSchema) {
      throw new Error(`Schema ${name} not found`);
    }
    components.shift();
  }

  return currentSchema;
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
