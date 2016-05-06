var fieldType = {
    null: null,
    string: '',
    boolean: false,
    number: 0,
    integer: 0,
    object: Object,
    array: Array
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
        return schema.minimum + (schema.exclusiveMinimum ? 1 : 0);
    },
    'maximum': function(schema){
        return schema.maximum - (schema.exclusiveMaximum ? 1 : 0);
    },
    'multipleOf': function(schema, fn){
        return schema.multipleOf;
    },
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
    'minLength': function(schema){
        return new Array(schema.minLength + 1).join(' ');
    },
    'maxLength': function(schema){
        return new Array(schema.maxLength + 1).join(' ');
    },
    // This attribute defines the minimum number of values in an array when the array is the instance value.
    'minItems': function(schema, fn){
        return new Array(schema.minItems).join(' ').split(' ').map(function(){ return fn.resolve({}) });
    },
    // This attribute defines the maximum number of values in an array when the array is the instance value.
    'maxItems': function(schema, fn){
        return new Array(schema.maxItems).join(' ').split(' ').map(function(){ return fn.resolve({}) });
    },
    // TODO without some
    'uniqueItems': function (schema, fn) {
        return {};
    },
    // ***** object validation ****
    'minProperties': function(schema, fn){
        var res = fn.data || {},
            l = schema.minProperties - Object.keys(res).length;

        for(var i = 0; i < l; i++) {
            res[i] = fn.resolve({});
        }

        return res;
    },
    // An object instance is valid against "maxProperties" if its number of properties is less than, or equal to, the value of this keyword.
    'maxProperties': function(){
        return {};
    },
    // ****** all *****
    // TODO
    'constant': function (v, p) {
        return JSON.stringify(v) == JSON.stringify(p);
    },
    'enum': function (schema) {
        return schema.enum[0];
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

module.exports = {
    types: ['object', 'number', 'string', 'boolean', 'array', 'null'],
    // http://json-schema.org/latest/json-schema-core.html#anchor8
    fieldType: function(type) {
        var fn = fieldType[type || 'object'];
        if(typeof fn === 'function') {
            return new fn();
        }

        return fn;
    },
    keywords: keywords,
    fieldValidate: fieldValidate,
    fieldFormat: fieldFormat,
    resolve: function resolve(reference, state) {
        if (reference === '#') {
            return 0;
        }

        if (typeof reference !== 'string') {
            return reference;
        }

        var referenceParts = reference.split(/#\/?/),
            uri = referenceParts[0] || '#',
            name = referenceParts[1],
            components = name && name.split('/');

        if (uri === '#') {
            var currentSchema = state[state.current[state.current.length - 1]];
        } else {
            if (!state.hasOwnProperty(uri)) {
                uri = state.slice(state.current[state.current.length - 1] + 1).map(function (schema) {
                    return schema.id;
                }).join('') + uri;
            }

            currentSchema = state[uri].schema;
        }

        state.current.push(state.length);
        state.push(currentSchema);

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
};