var assert = require('assert');
var djv = require('../');

describe('djv', function () {

    it('should exist', function () {
        assert.equal(typeof djv, 'function');
    });

    var methods = ['addSchema', 'validate', 'resolve'];
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

            var commonObj = { type: 'custom' };
            var errors = env.validate('test#/common', commonObj);
            assert.equal(typeof errors, 'string');
        });
    });

});