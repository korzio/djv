const assert = require('assert');
const djv = require('../../');

describe('Issue-71: Stack overflow error', () => {
  const jsonSchema = {
    "$schema": "http://json-schema.org/schema#",
    "title": "Aspect capturing a complete representation of a distribution according to Project Open Data (data.json).",
    "type": "object",
    "allOf": [
      {
        "$ref": "https://project-open-data.cio.gov/v1.1/schema/distribution.json"
      }
    ]
  };
  const obj = {
    "@type": "dcat:Distribution",
    "downloadURL": "dataset-url/dataset.csv",
    "mediaType": "text/csv"
  };

  it('should throw reference error when schema is not found, should not exceed maximum call stack', () => {
    const env = new djv();

    env.addSchema('issue-71', jsonSchema);
    assert.throws(() => env.validate('issue-71', obj), {
      name: 'ReferenceError',
      message: 'Schema for reference "https://project-open-data.cio.gov/v1.1/schema/distribution.json" not found',
    });
  });

  it('should resolve local existing reference', () => {
    const env = new djv();

    env.addSchema('issue-71', jsonSchema);
    env.addSchema('https://project-open-data.cio.gov/v1.1/schema/distribution.json', require('../resources/distribution.json'));

    assert.equal(env.validate('issue-71', obj), undefined);
  });
});
