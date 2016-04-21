var assert = require('assert');
var djv = require('../');

describe('djvi', function () {

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
            assert.equal(typeof resolved.fn, 'function');
        });
    });

    describe('instantiate()', function(){

    });

    describe('resolve()', function(){

    });

    describe('export()', function(){

    });

    describe('import()', function(){

    });

});