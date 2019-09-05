const assert = require('assert');
const djv = require('../../');
const jsonSchema = {
  def: {
    type: 'string',
    format: 'ipv4',
  },
};


describe('Issue-86: ipv4 regular expression', () => {
  it('should handle valid ipv4 addresses', () => {
    const env = djv();
    env.addSchema('issue-86', jsonSchema);

    const ipv4 = '192.168.1.1';
    const errors = env.validate('issue-86#/def', ipv4);
    assert.equal(!errors, true);
  });
  it('should fail if there are less than for quads', () => {
    const env = djv();
    env.addSchema('issue-86', jsonSchema);

    const ipv4 = '192.168.1';
    const errors = env.validate('issue-86#/def', ipv4);
    assert.equal(typeof errors, 'object');
  });
  it('should fail if last quad is absent', () => {
    const env = djv();
    env.addSchema('issue-86', jsonSchema);

    const ipv4 = '192.168.1.';
    const errors = env.validate('issue-86#/def', ipv4);
    assert.equal(typeof errors, 'object');
  });
  it('should fail more than three digits in a quad1', () => {
    const env = djv();
    env.addSchema('issue-86', jsonSchema);

    const ipv4 = '1111.1.1.1';
    const errors = env.validate('issue-86#/def', ipv4);
    assert.equal(typeof errors, 'object');
  });
  it('should fail more than three digits in a quad2', () => {
    const env = djv();
    env.addSchema('issue-86', jsonSchema);

    const ipv4 = '1.1111.1.1';
    const errors = env.validate('issue-86#/def', ipv4);
    assert.equal(typeof errors, 'object');
  });
  it('should fail more than three digits in a quad3', () => {
    const env = djv();
    env.addSchema('issue-86', jsonSchema);

    const ipv4 = '1.1.1111.1';
    const errors = env.validate('issue-86#/def', ipv4);
    assert.equal(typeof errors, 'object');
  });
  it('should fail more than three digits in a quad4', () => {
    const env = djv();
    env.addSchema('issue-86', jsonSchema);

    const ipv4 = '1.1.1.1111';
    const errors = env.validate('issue-86#/def', ipv4);
    assert.equal(typeof errors, 'object');
  });
  it('should fail if value of quad 1 is more than 255', () => {
    const env = djv();
    env.addSchema('issue-86', jsonSchema);

    const ipv4 = '256.1.1.1';
    const errors = env.validate('issue-86#/def', ipv4);
    assert.equal(typeof errors, 'object');
  });
  it('should fail if value of quad 2 is more than 255', () => {
    const env = djv();
    env.addSchema('issue-86', jsonSchema);

    const ipv4 = '1.256.1.1';
    const errors = env.validate('issue-86#/def', ipv4);
    assert.equal(typeof errors, 'object');
  });
  it('should fail if value of quad 3 is more than 255', () => {
    const env = djv();
    env.addSchema('issue-86', jsonSchema);

    const ipv4 = '1.1.256.1';
    const errors = env.validate('issue-86#/def', ipv4);
    assert.equal(typeof errors, 'object');
  });
  it('should fail if value of quad 4 is more than 255', () => {
    const env = djv();
    env.addSchema('issue-86', jsonSchema);

    const ipv4 = '1.1.1.256';
    const errors = env.validate('issue-86#/def', ipv4);
    assert.equal(typeof errors, 'object');
  });
});
