var assert = require('assert');
var djv = require('../');
var utils = require('../lib/utils');

// http://json-schema.org/latest/json-schema-core.html#anchor29
var schema = {
    "id": "http://x.y.z/rootschema.json#",
    "schema1": {
        "id": "#foo"
    },
    "schema2": {
        "id": "otherschema.json",
        "nested": {
            "id": "#bar"
        },
        "alsonested": {
            "id": "t/inner.json#a"
        }
    },
    "schema3": {
        "id": "some://where.else/completely#"
    }
};

var env = new djv();
env.addSchema(schema.id, schema);

// describe('resolve', function () {

    // it('should contain interface ' + methods, function () {


        // assert.equal(utils.resolveUri('http://x.y.z/rootschema.json#'), schema);


    // });

// });

// testSuite.tests.forEach(function (test) {
//     var errors = env.validate('test', test.data),
//         status = !errors ? { valid: true } : { valid: false, errors: [errors] };

//     console.log(test.description);
//     console.log('data', test.data);

//     if (test.valid !== status.valid) {
//         console.warn('wrong', errors);
//     } else {
//         console.info('ok');
//     }
// });

console.info('done');