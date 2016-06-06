var assert = require('assert');
var djv = require('../');

var jsonSchema = {
  "selection": {
    "some": {
      "type": "array",
      "minItems": 1
    },
    "none": {
      "enum": [
        "none"
      ]
    },
    "all": {
      "enum": [
        "all"
      ]
    }
  }
};

var env = new djv();
env.addSchema('words', jsonSchema);

var commonObj = { type: 'common' };
var errors = env.validate('words#/selection/some', 'some');
assert.equal(errors, undefined);