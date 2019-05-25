/**
 * @module properties
 * @description
 * Validators as string for properties keyword rules.
 * A validator is a function, which when executed returns
 * - `false` if test is failed,
 * - `true` otherwise.
 */
module.exports = {
  readOnly: 'false',
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
  // This attribute defines the minimum number of values
  // in an array when the array is the instance value.
  minItems: '$1.length < $2 && Array.isArray($1)',
  // This attribute defines the maximum number of values
  // in an array when the array is the instance value.
  maxItems: '$1.length > $2 && Array.isArray($1)',
  // TODO without some
  uniqueItems(schema, fn) {
    if (!schema.uniqueItems) {
      return 'true';
    }

    fn(fn.cache('{}'));
    return `Array.isArray($1) && $1.some(function(item, key) {
      if(item !== null && typeof item === "object") key = JSON.stringify(item);
      else key = item;
      if(${fn.cache('{}')}.hasOwnProperty(key)) return true;
      ${fn.cache('{}')}[key] = true;
    })`;
  },
  // ***** object validation ****
  minProperties: '!Array.isArray($1) && typeof $1 === "object" && Object.keys($1).length < $2',
  // An object instance is valid against "maxProperties"
  // if its number of properties is less than, or equal to, the value of this keyword.
  maxProperties: '!Array.isArray($1) && typeof $1 === "object" && Object.keys($1).length > $2',
  // ****** all *****
  enum(schema, fn) {
    return schema.enum.map((value) => {
      let $1 = '$1';
      let comparedValue = value;

      if (typeof value === 'object') {
        comparedValue = `'${JSON.stringify(value)}'`;
        $1 = fn.cache('JSON.stringify($1)');
      } else if (typeof value === 'string') {
        comparedValue = `'${escape(value)}'`;
      }

      return `${$1} != decodeURIComponent(${comparedValue})`;
    }).join(' && ');
  }
};
