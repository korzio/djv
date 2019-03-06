const assert = require('assert');
const djv = require('../../');

describe('Issue-74: Required validator throws on null values', () => {
  const jsonSchema = {
    def: {
      type: 'object',
      properties: {
        foo: { type: 'string' }
      },
      required: ['foo'],
    },
  };

  it('should handle nulls without throwing', () => {
    const env = djv();
    env.addSchema('issue-74', jsonSchema);

    const obj = null;
    const errors = env.validate('issue-74#/def', obj);
    assert.equal(typeof errors, 'object');
  });
});
