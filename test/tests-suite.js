var assert = require('assert');
var djv = require('../');
var fs = require('fs');

describe('Tests suite - djv instance', function () {
    fs.readdirSync('test/suite').forEach(file => {
        var packages = require('./suite/' + file);
        describe(file, () => {
            packages.forEach(package => {
                package.tests.forEach(test => {
                    it(test.description, function () {
                        var env = new djv();
                        env.addSchema('test', package.schema);
                        var instance = env.instance('test');

                        assert.deepEqual(instance, test.output);
                    })
                })
            })
        })
    })
})