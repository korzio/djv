const assert = require('assert');
const djv = require('../../');

describe('Issue-3: Semver example', () => {
  const jsonSchema = {
    type: 'object',
    properties: {
      major: { type: 'integer' },
      minor: { type: 'integer' },
      patch: { type: 'integer' },
      prerelease: { type: 'array', items: { $ref: '#/prerelease' } },
      meta: { pattern: '^[0-9A-Za-z-]+$' },
    },
    required: ['major', 'minor', 'patch'],
    prerelease: { pattern: '^(?:0[a-zA-Z]*|[a-zA-Z1-9][0-9A-Za-z-]*)$' },
  };

  it('should be handled correctly', () => {
    const env = new djv();
    env.addSchema('issue-5', jsonSchema);
    const resolved = env.resolve('issue-5');

    assert.equal(typeof resolved, 'object');
    assert.equal(typeof resolved.fn, 'function');

    const obj = {
      major: 0,
      minor: 0,
      patch: 0,
    };

    assert.equal(!env.validate('issue-5', obj), true);

    Object.assign(obj, {
      prerelease: ['11', 'asd'],
      meta: 'safdsfdsafdsa',
    });
    assert.equal(!env.validate('issue-5', obj), true);
  });
});
