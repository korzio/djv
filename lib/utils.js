const fieldType = {
  null: '%s !== null',
  string: 'typeof %s !== "string"',
  boolean: 'typeof %s !== "boolean"',
  number: 'typeof %s !== "number" || %s !== %s',
  integer: 'typeof %s !== "number" || %s % 1 !== 0',
  object: '!%s || typeof %s !== "object" || Array.isArray(%s)',
  array: '!Array.isArray(%s)',
  date: '!(%s instanceof Date)'
};

const fieldFormat = {
  alpha: '!/^[a-zA-Z]+$/.test(%s)',
  alphanumeric: '!/^[a-zA-Z0-9]+$/.test(%s)',
  identifier: '!/^[-_a-zA-Z0-9]+$/.test(%s)',
  hexadecimal: '!/^[a-fA-F0-9]+$/.test(%s)',
  numeric: '!/^[0-9]+$/.test(%s)',
  'date-time': 'isNaN(Date.parse(%s)) || ~%s.indexOf(\'/\')',
  uppercase: '%s !== %s.toUpperCase()',
  lowercase: '%s !== %s.toLowerCase()',
  hostname: '%s.length >= 256 || !/^([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\\-]{0,61}[a-zA-Z0-9])(\\.([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\\-]{0,61}[a-zA-Z0-9]))*$/.test(%s)',
  uri: '!/[-a-zA-Z0-9@:%_\\+.~#?&//=]{2,256}\\.[a-z]{2,4}\\b(\\/[-a-zA-Z0-9@:%_\\+.~#?&//=]*)?/.test(%s)',
  email: '!/^[^@]+@[^@]+\\.[^@]+$/.test(%s)',
  ipv4: '!/^(\\d?\\d?\\d){0,255}\\.(\\d?\\d?\\d){0,255}\\.(\\d?\\d?\\d){0,255}\\.(\\d?\\d?\\d){0,255}$/.test($1) || $1.split(".")[3] > 255',
  ipv6: '!/^((?=.*::)(?!.*::.+::)(::)?([\\dA-F]{1,4}:(:|\\b)|){5}|([\\dA-F]{1,4}:){6})((([\\dA-F]{1,4}((?!\\3)::|:\\b|$))|(?!\\2\\3)){2}|(((2[0-4]|1\\d|[1-9])?\\d|25[0-5])\\.?\\b){4})$/.test(%s)'
};

const fieldValidate = {
  readOnly: 'false',
  minimum(schema) {
    return `%s <${schema.exclusiveMinimum ? '=' : ''} ${schema.minimum}`;
  },
  maximum(schema) {
    return `%s >${schema.exclusiveMaximum ? '=' : ''} ${schema.maximum}`;
  },
  multipleOf: '($1/$2) % 1 !== 0 && typeof $1 === "number"',
  // When the instance value is a string
  // this provides a regular expression that a string instance MUST match in order to be valid.
  pattern(schema) {
    let pattern;
    let modifiers;

    if (typeof schema.pattern === 'string') { pattern = schema.pattern; } else {
      pattern = schema.pattern[0];
      modifiers = schema.pattern[1];
    }

    const regex = new RegExp(pattern, modifiers);
    return `typeof ($1) === "string" && !${regex}.test($1)`;
  },
  /**
  * Creates an array containing the numeric code points of each Unicode
  * character in the string. While JavaScript uses UCS-2 internally,
  * this function will convert a pair of surrogate halves (each of which
  * UCS-2 exposes as separate characters) into a single code point,
  * matching UTF-16.
  * @see `punycode.ucs2.encode`
  * @see <https://mathiasbynens.be/notes/javascript-encoding>
  * @memberOf punycode.ucs2
  * @name decode
  * @param {String} string The Unicode input string (UCS-2).
  * @returns {Array} The new array of code points.
  */
  minLength: 'typeof $1 === "string" && function dltml(b,c){for(var a=0,d=b.length;a<d&&c;){var e=b.charCodeAt(a++);55296<=e&&56319>=e&&a<d&&56320!==(b.charCodeAt(a++)&64512)&&a--;c--}return!!c}($1, $2)',
  maxLength: 'typeof $1 === "string" && function dmtml(b,c){for(var a=0,d=b.length;a<d&&0<=c;){var e=b.charCodeAt(a++);55296<=e&&56319>=e&&a<d&&56320!==(b.charCodeAt(a++)&64512)&&a--;c--}return 0>c}($1, $2)',
  minItems: '$1.length < $2 && Array.isArray($1)',
  maxItems: '$1.length > $2 && Array.isArray($1)',
  // TODO without some
  uniqueItems(schema, fn) {
    if (!schema.uniqueItems) {
      return 'true';
    }

    fn(fn.cache('{}'));
    return `Array.isArray($1) && $1.some(function(item, key) {\
            if(item !== null && typeof item === "object") key = JSON.stringify(item);\
            else key = item;\
            if(${fn.cache('{}')}.hasOwnProperty(key))\
                return true;\
            ${fn.cache('{}')}[key] = true;\
        })`;
  },
  // ***** object validation ****
  minProperties: 'typeof $1 === "object" && Object.keys($1).length < $2',
  maxProperties: 'typeof $1 === "object" && Object.keys($1).length > $2',
  // ****** all *****
  // TODO
  constant(v, p) {
    return JSON.stringify(v) === JSON.stringify(p);
  },
  enum(schema, fn) {
    return schema.enum.map((value) => {
      let $1 = '$1';
      let comparedValue = value;

      if (typeof value === 'object') {
        comparedValue = `'${JSON.stringify(value)}'`;
        $1 = fn.cache('JSON.stringify($1)');
      } else if (typeof value === 'string') {
        comparedValue = `'${value}'`;
      }

      return `${$1} !== ${comparedValue}`;
    }).join(' && ');
  }
};

const keywords = [
  'type',
  'not',
  'anyOf',
  'allOf',
  'oneOf',
  '$ref',
  '$schema',
  'id',
  'exclusiveMaximum',
  'exclusiveMininum',
  'properties',
  'patternProperties',
  'additionalProperties',
  'items',
  'additionalItems',
  'required',
  'default',
  'title',
  'description',
  'definitions',
  'dependencies'
];

function resolve(reference, state) {
  if (reference === '#') {
    return 0;
  }

  if (typeof reference !== 'string') {
    return reference;
  }

  const referenceParts = reference.split(/#\/?/);
  const name = referenceParts[1];
  const components = name && name.split('/');
  let uri = referenceParts[0] || '#';
  let currentSchema;

  if (uri === '#') {
    currentSchema = state[state.current[state.current.length - 1]];
  } else {
    if (!state[uri]) {
      uri = state.slice(state.current[state.current.length - 1] + 1).map(schema => schema.id).join('') + uri;
    }

    currentSchema = state[uri].schema;
  }

  state.current.push(state.length);
  state.push(currentSchema);

  while (components && components.length > 0) {
    const currentPath = decodeURIComponent(components[0].replace(/~1/g, '/').replace(/~0/g, '~'));
    if (!currentSchema[currentPath]) {
      throw new Error('Schema not found');
    }

    currentSchema = currentSchema[currentPath];
    state.push(currentSchema);
    components.shift();
  }

  return currentSchema;
}

module.exports = {
  fieldType,
  fieldFormat,
  fieldValidate,
  keywords,
  resolve
};
