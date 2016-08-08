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

var commonObj = { type: 'common' };
var errors = env.validate('test#/common', commonObj);
assert.equal(errors, undefined);