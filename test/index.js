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

});