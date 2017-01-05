const assert = require('assert');
const djv = require('../../');

describe('Issue-3: Invalid keys properties', () => {
  const jsonSchema = {
    type: 'object',
    properties: {
      'abc-def': {
        type: 'object',
        properties: {
          key: {
            type: 'string',
          },
          url: {
            type: 'string',
          },
        },
        required: ['key', 'url'],
      },
    },
    required: ['abc-def'],
  };

  it('should be handled correctly', () => {
    const env = new djv();
    env.addSchema('issue-3', jsonSchema);
    const resolved = env.resolve('issue-3');

    assert.equal(typeof resolved, 'object');
    assert.equal(typeof resolved.fn, 'function');

    const obj = {
      'abc-def': {
        key: '',
        url: '',
      },
    };

    assert.equal(env.validate('issue-3', obj), undefined);
  });
});
