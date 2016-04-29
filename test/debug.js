var assert = require('assert');
var djv = require('../');

// var package = require('./test-suite/draft4/dependencies.json')
//     .find(package => package.description === 'multiple dependencies subschema');

var globalPath = './../node_modules/json-schema-test-suite';
var refs = {
    // 'http://localhost:1234/integer.json': require('json-schema-test-suite/remotes/integer.json'),
    // 'http://localhost:1234/subSchemas.json': require('json-schema-test-suite/remotes/subSchemas.json'),
    // 'http://localhost:1234/folder/folderInteger.json': require('json-schema-test-suite/remotes/folder/folderInteger.json'),
    // 'http://json-schema.org/draft-04/schema': require('./resources/draft-04-schema.json')
};

var env = new djv();

Object.keys(refs).forEach(function (uri) {
    env.addSchema(uri, refs[uri]);
});

// env.addSchema('test', package.schema);
env.addSchema('test', {
    "properties": {
        "a": {
            "properties": {
                "a": {
                    "required": ["a"]
                }
            },
            "required": ["a"]
        }
    },
    "required": ["a"]
});

// assert.deepEqual(env.instance('test'), package.tests[0]);