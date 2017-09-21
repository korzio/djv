const jsonSchemaTest = require('json-schema-test');
const djv = require('../');

describe.skip = xdescribe;

const refs = {
  'http://localhost:1234/name.json': require('json-schema-test-suite/remotes/name.json'),
  'http://localhost:1234/integer.json': require('json-schema-test-suite/remotes/integer.json'),
  'http://localhost:1234/subSchemas.json': require('json-schema-test-suite/remotes/subSchemas.json'),
  'http://localhost:1234/folder/folderInteger.json': require('json-schema-test-suite/remotes/folder/folderInteger.json'),
  'http://json-schema.org/draft-04/schema': require('./resources/draft-04-schema.json'),
};

const factory = function djvTestSuiteAdapter(version) {
  return {
    validate(schema, instance) {
      try {
        const env = djv({ version });
        Object.keys(refs).forEach((uri) => {
          env.addSchema(uri, refs[uri]);
        });
        env.addSchema('test', schema);
        const error = env.validate('test', instance);

        this.errors = error ? [error] : null;
        return !error;
      } catch (error) {
        console.error(error.stack);
        this.errors = [error.message];
        return false;
      }
    },
  };
};

function runTest(draft) {
  jsonSchemaTest(factory(`draft-0${draft}`), {
    description: `Test suite draft-0${draft}`,
    suites: { tests: `../node_modules/json-schema-test-suite/tests/draft${draft}/{**/,}*.json` },
    cwd: __dirname,
    hideFolder: 'tests/'
  });
}

runTest(4);
runTest(6);
