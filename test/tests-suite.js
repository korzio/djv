var assert = require('assert');
var djv = require('../');
var fs = require('fs');

describe('Local tests suite', function () {
    fs.readdirSync('test/data').forEach(file => {
        var packages = require('./data/' + file);
        describe(file, () => {
            packages.forEach(package => {
                package.tests.forEach(test => {
                    it(test.description, function () {
                        var env = new djv();
                        env.addSchema('test', package.schema);
                        var instance = env.instance('test');

                        assert.deepEqual(instance, test.data);
                    })
                })
            })
        })
    })
})


var globalPath = './../node_modules/json-schema-test-suite';
var refs = {
    'http://localhost:1234/integer.json': require('json-schema-test-suite/remotes/integer.json'),
    'http://localhost:1234/subSchemas.json': require('json-schema-test-suite/remotes/subSchemas.json'),
    'http://localhost:1234/folder/folderInteger.json': require('json-schema-test-suite/remotes/folder/folderInteger.json'),
    'http://json-schema.org/draft-04/schema': require('./resources/draft-04-schema.json')
};

describe('General tests suite', function () {
    // fs.readdirSync('test/draft4').forEach(file => {
    [
        'additionalItems',
        'additionalProperties',
        'allOf',
        'anyOf',
        'default',
        'definitions',
        'dependencies',
        'enum',
        'items',
        'maximum',
        'maxItems',
        'maxLength',
        'maxProperties',
        'minimum',
        'minItems',
        'minLength',
        'minProperties',
        'multipleOf',
        'not',
        'oneOf',
        // 'pattern',
        // 'patternProperties',
        'properties',
        'ref',
        'refRemote',
        'required',
        'type',
        'uniqueItems'
    ].forEach(file => {
        var packages = require('./test-suite/draft4/' + file);
        describe(file, () => {
            packages.forEach(package => {
                package.tests.forEach(test => {
                    it(package.description + ' - ' + test.description, function () {
                        var env = new djv();

                        Object.keys(refs).forEach(function (uri) {
                            env.addSchema(uri, refs[uri]);
                        });

                        env.addSchema('test', package.schema);
                        var instance = env.instance('test');

                        if(typeof instance === 'object') {
                            assert.deepEqual(instance, test.data);
                        } else {
                            assert.strictEqual(instance, test.data);
                        }
                    })
                })
            })
        })
    })
})