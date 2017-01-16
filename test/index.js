var assert = require('assert');
var djv = require('../');

describe('djv', function () {

    it('should exist', function () {
        assert.equal(typeof djv, 'function');
    });

    var methods = ['addSchema', 'validate', 'resolve', 'import', 'export'];
    it('should contain interface ' + methods, function () {
        methods.forEach(function(methodName){
            assert.equal(typeof djv.prototype[methodName], 'function');
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
            var env = new djv();
            env.addSchema('test', jsonSchema);
            var resolved = env.resolve('test#/common');

            assert.equal(typeof resolved, 'object');
            assert.equal(typeof resolved.fn, 'function');
        });
    });

    describe('validate()', function(){
        it('should return undefined if object is valid', function () {
            var env = new djv();
            env.addSchema('test', jsonSchema);

            var commonObj = { type: 'common' };
            var errors = env.validate('test#/common', commonObj);
            assert.equal(errors, undefined);
        });

        it('should return error if object is not valid', function () {
            var env = new djv();
            env.addSchema('test', jsonSchema);

            var customObj = { type: 'custom' };
            var errors = env.validate('test#/common', customObj);
            assert.equal(typeof errors, 'string');
        });

        it('should validate an object by a given schema without namespace', function () {
            var env = new djv();

            var customObj = { type: 'custom' };
            var errors = env.validate(jsonSchema.common, customObj);
            assert.equal(typeof errors, 'string');

            var commonObj = { type: 'common' };
            var errors = env.validate(jsonSchema.common, commonObj);
            assert.equal(errors, undefined);
        });
    });

    describe('export()', function(){
        it('should return whole internal structure', function () {
            var env = new djv();
            env.addSchema('test', jsonSchema);

            var exported = env.export();
            assert.equal(typeof exported, 'string');
            exported = JSON.parse(exported);
            assert.equal(typeof exported, 'object');
            assert.equal(typeof exported.test, 'object');
            assert.equal(typeof exported.test.fn, 'string');
            assert.equal(exported.test.name, 'test');
            assert.deepEqual(exported.test.schema, jsonSchema);
        });

        it('should return partial resolved schema by name', function () {
            var env = new djv();
            env.addSchema('test', jsonSchema);

            var exported = env.export('test#/common');
            exported = JSON.parse(exported);

            assert.equal(typeof exported, 'object');
            assert.equal(typeof exported, 'object');
            assert.equal(typeof exported.fn, 'string');
            assert.equal(exported.name, 'test#/common');
            assert.deepEqual(exported.schema, jsonSchema.common);
        });
    });

    describe('import()', function(){
        it('should restore whole environment', function () {
            var oldDjv = new djv();
            oldDjv.addSchema('test', jsonSchema);

            var exported = oldDjv.export();
            var env = new djv();
            env.import(exported);

            var commonObj = { type: 'common' };
            var errors = env.validate('test#/common', commonObj);
            assert.equal(errors, undefined);

            var customObj = { type: 'custom' };
            errors = env.validate('test#/common', customObj);
            assert.equal(typeof errors, 'string');
        });

        it('should restore environment with references', function () {
            var oldDjv = new djv();
            var refSchema = require('json-schema-test-suite/tests/draft4/allOf.json')[0].schema;

            oldDjv.addSchema('test', refSchema);

            var exported = oldDjv.export();
            var env = new djv();
            env.import(exported);

            var commonObj = { type: 'common' };
            var errors = env.validate('test', { foo: "baz", bar: 2 });
            assert.equal(errors, undefined);

            var customObj = { type: 'custom' };
            errors = env.validate('test', { foo: "baz" });
            assert.equal(typeof errors, 'string');
        });

        it('should restore partial environment', function () {
            var oldDjv = new djv();
            oldDjv.addSchema('test', jsonSchema);

            var exported = oldDjv.export('test#/common');

            var env = new djv();
            env.addSchema('test', jsonSchema);

            var env = new djv();
            env.import(exported);

            var commonObj = { type: 'common' };
            var errors = env.validate('test#/common', commonObj);
            assert.equal(errors, undefined);

            var customObj = { type: 'custom' };
            errors = env.validate('test#/common', customObj);
            assert.equal(typeof errors, 'string');
        });
    });

});