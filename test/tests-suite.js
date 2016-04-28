var assert = require('assert');
var djv = require('../');
var fs = require('fs');

describe('Local tests suite', function () {
    fs.readdirSync('test/suite').forEach(file => {
        var packages = require('./suite/' + file);
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

describe('General tests suite', function () {
    // fs.readdirSync('test/draft4').forEach(file => {
    ['allOf', 'anyOf'].forEach(file => {
        var packages = require('./draft4/' + file);
        packages.forEach(package => {
            package.tests.forEach(test => {
                it(package.description + ' - ' + test.description, function () {
                    var env = new djv();
                    env.addSchema('test', package.schema);
                    var instance = env.instance('test');

                    assert.deepEqual(instance, test.data);
                })
            })
        })
    })
})