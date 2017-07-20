const djv = require('../')();
const testRunner = require('json-schema-benchmark/testRunner');

const refs = {
  'http://json-schema.org/draft-04/schema': require('json-schema-benchmark/refs/json-schema-draft-04.json'),
  'http://localhost:1234/integer.json': require('json-schema-benchmark/JSON-Schema-Test-Suite/remotes/integer.json'),
  'http://localhost:1234/subSchemas.json': require('json-schema-benchmark/JSON-Schema-Test-Suite/remotes/subSchemas.json'),
  'http://localhost:1234/name.json': require('json-schema-benchmark/JSON-Schema-Test-Suite/remotes/name.json'),
  'http://localhost:1234/folder/folderInteger.json': require('json-schema-benchmark/JSON-Schema-Test-Suite/remotes/folder/folderInteger.json')
};

Object.keys(refs).forEach((uri) => {
  djv.addSchema(uri, refs[uri]);
});

testRunner([
  {
    name: 'djv',
    setup(schema) {
      return djv.addSchema('test', schema).fn;
    },
    test(instance, json) {
      return instance(json) === undefined;
    }
  }
]);
