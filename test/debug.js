var assert = require('assert');
var djv = require('../');

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

var env = new djv();
env.addSchema('test', jsonSchema);

assert.equal(env.instance('test#/common'), { type: 'common' });