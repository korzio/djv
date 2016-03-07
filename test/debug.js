var assert = require('assert');
var djv = require('../');
var utils = require('../lib/utils');

var testSuite = {
    "description":
    "additionalProperties being false does not allow other properties",
    "schema": {
        "properties": { "foo": {}, "bar": {} },
        "patternProperties": { "^v": {} },
        "additionalProperties": false
    },
    "tests": [
        {
            "description": "ignores non-objects",
            "data": [1, 2, 3],
            "valid": true
        }
    ]
};

var env = new djv();
env.addSchema('test', testSuite.schema);

testSuite.tests.forEach(function (test) {
    var errors = env.validate('test', test.data),
        status = !errors ? { valid: true } : { valid: false, errors: [errors] };

    console.log(test.description);
    console.log('data', test.data);

    if (test.valid !== status.valid) {
        console.warn('wrong', errors);
    } else {
        console.info('ok');
    }
});

console.info('done');