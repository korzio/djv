var assert = require('assert');
var djv = require('../');

describe('djv istance', function () {

    it('should exist', function () {
        assert.equal(typeof djv, 'function');
    });

    var methods = ['addSchema', 'instance', 'resolve', 'import', 'export'];
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
            assert.equal(typeof resolved.data, 'object');
        });
    });

    describe('instance()', function(){
        it('should return object for json schema common example', function () {
            var env = new djv();
            env.addSchema('test', jsonSchema);

            assert.deepEqual(env.instance('test#/common'), { type: 'common' });
            assert.deepEqual(env.instance('test'), {});
        });
    });

    describe('resolve()', function(){

    });

    describe('export()', function(){

    });

    describe('import()', function(){

    });

});