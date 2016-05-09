var assert = require('assert');
var djvi = require('../');

var jsonSchema = {
    "common": {
        "properties": {
            "type": {
                "enum": ["common"]
            }
        },
        "required": [
            "type"
        ]
    }
};

var env = new djvi();
env.addSchema('test', jsonSchema);

assert.deepEqual(env.instance('test#/common'), { type: 'common' });