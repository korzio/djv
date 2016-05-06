var assert = require('assert');
var djvi = require('../');

describe('djvi istance', function () {

    it('should exist', function () {
        assert.equal(typeof djvi, 'function');
    });

    var methods = ['addSchema', 'instance', 'resolve', 'import', 'export'];
    it('should contain interface ' + methods, function () {
        methods.forEach(function(methodName){
            assert.equal(typeof djvi.prototype[methodName], 'function');
        });
    });

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

    describe('addSchema()', function(){
        it('should add schema', function () {
            var env = new djvi();
            env.addSchema('test', jsonSchema);
            var resolved = env.resolve('test#/common');

            assert.equal(typeof resolved, 'object');
            assert.equal(typeof resolved.data, 'object');
        });
    });

    describe('instance()', function(){
        it('should return object for json schema common example', function () {
            var env = new djvi();
            env.addSchema('test', jsonSchema);

            assert.deepEqual(env.instance('test#/common'), { type: 'common' });
            assert.deepEqual(env.instance('test'), {});
        });
    });

    describe('export()', function(){
        it('should return whole internal structure', function () {
            var env = new djvi();
            env.addSchema('test', jsonSchema);

            var exported = env.export();
            assert.equal(typeof exported, 'string');
            exported = JSON.parse(exported);
            assert.equal(typeof exported, 'object');
            assert.equal(typeof exported.test, 'object');
            assert.equal(typeof exported.test.data, 'object');
            assert.equal(exported.test.name, 'test');
            assert.deepEqual(exported.test.schema, jsonSchema);
        });

        it('should return partial resolved schema by name', function () {
            var env = new djvi();
            env.addSchema('test', jsonSchema);

            var exported = env.export('test#/common');
            exported = JSON.parse(exported);

            assert.equal(typeof exported, 'object');
            assert.equal(typeof exported, 'object');
            assert.equal(typeof exported.data, 'object');
            assert.equal(exported.name, 'test#/common');
            assert.deepEqual(exported.schema, jsonSchema.common);
        });
    });

    describe('import()', function(){
        it('should restore whole environment', function () {
            var oldDjvi = new djvi();
            oldDjvi.addSchema('test', jsonSchema);

            var exported = oldDjvi.export();
            var env = new djvi();
            env.import(exported);

            assert.deepEqual(env.instance('test#/common'), { type: 'common' });
        });

        it('should restore partial environment', function () {
            var oldDjvi = new djvi();
            oldDjvi.addSchema('test', jsonSchema);

            var exported = oldDjvi.export('test#/common');

            var env = new djvi();
            env.addSchema('test', jsonSchema);

            var env = new djvi();
            env.import(exported);

            assert.deepEqual(env.instance('test#/common'), { type: 'common' });
        });
    });

});