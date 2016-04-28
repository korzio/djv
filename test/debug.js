var assert = require('assert');
var djv = require('../');

var jsonSchema = {
    "allOf": [
        {"maximum": 30},
        {"minimum": 20}
    ]
};

var env = new djv();
env.addSchema('test', jsonSchema);

assert.deepEqual(env.instance('test'), 20);