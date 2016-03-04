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
function ucs2decodeLength(string) {
    var output = [],
        counter = 0,
        length = string.length,
        value,
        extra;

    while (counter < length) {
        value = string.charCodeAt(counter++);
        if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
            // high surrogate, and there is a next character
            extra = string.charCodeAt(counter++);
            if ((extra & 0xFC00) == 0xDC00) { // low surrogate
                output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
            } else {
                // unmatched surrogate; only append this code unit, in case the next
                // code unit is the high surrogate of a surrogate pair
                output.push(value);
                counter--;
            }
        } else {
            output.push(value);
        }
    }

    return output.length;
}

var fieldType = {
    'null': '%s !== null',
    'string': 'typeof %s !== "string"',
    'boolean': 'typeof %s !== "boolean"',
    'number': 'typeof %s !== "number" || %s !== %s',
    'integer': 'typeof %s !== "number" || %s % 1 !== 0',
    'object': '!%s || typeof %s !== "object" || Array.isArray(%s)',
    'array': '!Array.isArray(%s)',
    'date': '!(%s instanceof Date)'
};

var fieldFormat = {
    'alpha': '!/^[a-zA-Z]+$/.test(%s)',
    'alphanumeric': '!/^[a-zA-Z0-9]+$/.test(%s)',
    'identifier': '!/^[-_a-zA-Z0-9]+$/.test(%s)',
    'hexadecimal': '!/^[a-fA-F0-9]+$/.test(%s)',
    'numeric': '!/^[0-9]+$/.test(%s)',
    'date-time': 'isNaN(Date.parse(%s)) || ~%s.indexOf(\'/\')',
    'uppercase': '%s !== %s.toUpperCase()',
    'lowercase': '%s !== %s.toLowerCase()',
    'hostname': '%s.length >= 256 || !/^([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\\-]{0,61}[a-zA-Z0-9])(\\.([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\\-]{0,61}[a-zA-Z0-9]))*$/.test(%s)',
    'uri': '!/[-a-zA-Z0-9@:%_\\+.~#?&//=]{2,256}\\.[a-z]{2,4}\\b(\\/[-a-zA-Z0-9@:%_\\+.~#?&//=]*)?/.test(%s)',
    'email': '!/^[^@]+@[^@]+\\.[^@]+$/.test(%s)',
    'ipv4': '!/^(\\d?\\d?\\d){0,255}\\.(\\d?\\d?\\d){0,255}\\.(\\d?\\d?\\d){0,255}\\.(\\d?\\d?\\d){0,255}$/.test($1) || $1.split(".")[3] > 255',
    'ipv6': '!/^((?=.*::)(?!.*::.+::)(::)?([\\dA-F]{1,4}:(:|\\b)|){5}|([\\dA-F]{1,4}:){6})((([\\dA-F]{1,4}((?!\\3)::|:\\b|$))|(?!\\2\\3)){2}|(((2[0-4]|1\\d|[1-9])?\\d|25[0-5])\\.?\\b){4})$/.test(%s)'
};

var fieldValidate = {
    'readOnly': 'false',
    'minimum': function(schema){
        return '%s <' + (schema.exclusiveMinimum ? '=' : '' ) + ' ' + schema.minimum;
    },
    'maximum': function(schema){
        return '%s >' + (schema.exclusiveMaximum ? '=' : '' ) + ' ' + schema.maximum;
    },
    'multipleOf': '($1/$2) % 1 !== 0 && typeof $1 === "number"',
    // When the instance value is a string, this provides a regular expression that a string instance MUST match in order to be valid.
    'pattern': function (schema) {
        var pattern, modifiers;
        if (typeof schema.pattern === 'string')
            pattern = schema.pattern;
        else {
            pattern = schema.pattern[0];
            modifiers = schema.pattern[1];
        }

        var regex = new RegExp(pattern, modifiers);
        return 'typeof ($1) === "string" && !' + regex + '.test($1)';
    },
    'minLength': 'typeof $1 === "string" && this.context.ucs2decodeLength($1) < $2',
    'maxLength': 'typeof $1 === "string" && this.context.ucs2decodeLength($1) > $2',
    // This attribute defines the minimum number of values in an array when the array is the instance value.
    'minItems': '$1.length < $2 && Array.isArray($1)',
    // This attribute defines the maximum number of values in an array when the array is the instance value.
    'maxItems': '$1.length > $2 && Array.isArray($1)',
    // TODO without some
    'uniqueItems': function (schema, fn) {
        if(!schema.uniqueItems) {
            return 'true';
        }

        fn(fn.cache('{}'));
        return 'Array.isArray($1) && $1.some(function(item, key) {\
            key = JSON.stringify(item);\
            if(' + fn.cache('{}') + '.hasOwnProperty(key))\
            return true;\
            ' + fn.cache('{}') + '[key] = true;\
        })';
    },
    // ***** object validation ****
    'minProperties': 'typeof $1 === "object" && Object.keys($1).length < $2',
    // An object instance is valid against "maxProperties" if its number of properties is less than, or equal to, the value of this keyword.
    'maxProperties': 'typeof $1 === "object" && Object.keys($1).length > $2',
    // ****** all *****
    // TODO
    'constant': function (v, p) {
        return JSON.stringify(v) == JSON.stringify(p);
    },
    'enum': function (schema, fn) {
        return schema.enum.map(function(value){
            var $1 = '$1';
            switch(typeof value) {
                case 'object':
                    value = JSON.stringify(value);
                    $1 = fn.cache('JSON.stringify($1)');
                case 'string':
                    value = '\'' + value + '\'';
            }

            return $1 + ' !== ' + value;
        }).join(' && ');
    }
};

var keywords = [
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
    if(reference === '#'){
        return 0;
    }

    if(typeof reference !== 'string') {
        return reference;
    }

    var referenceParts = reference.split(/#\/?/),
        uri = referenceParts[0] || '#',
        name = referenceParts[1],
        currentSchema = state[uri],
        components = name && name.split('/');

    if(uri === '#') {
        currentSchema = state[state.current.length - 1];
    }
    state.push(currentSchema, true);

    while (components && components.length > 0) {
        var currentPath = decodeURIComponent(components[0].replace(/~1/g, '/').replace(/~0/g, '~'));
        if (!currentSchema.hasOwnProperty(currentPath)) {
            throw new Error('Schema not found');
        }

        currentSchema = currentSchema[currentPath];
        state.push(currentSchema);
        components.shift();
    }

    return currentSchema;
}

module.exports = {
    fieldType: fieldType,
    fieldFormat: fieldFormat,
    fieldValidate: fieldValidate,
    ucs2decodeLength: ucs2decodeLength,
    keywords: keywords,
    resolve: resolve
};