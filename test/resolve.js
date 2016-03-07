var assert = require('assert');
var djv = require('../');
var utils = require('../lib/utils');

var testSuite = {
    "description": "additionalItems as schema",
    "schema": {
        "items": [{}],
        "additionalItems": {"type": "integer"}
    },
    "tests": [
        {
            "description": "additional items match schema",
            "data": [ null, 2, 3, 4 ],
            "valid": true
        },
        {
            "description": "additional items do not match schema",
            "data": [ null, 2, 3, "foo" ],
            "valid": false
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