const assert = require('assert');
const djv = require('../../');
const formats = require('../../lib/utils/formats');

describe('Issue-95: Format validators ignore non-strings', () => {
  ['date-time', 'date', 'time'].forEach((format) => {
    it(format + ' should ignore non-strings', () => {
      const env = djv();
      env.addSchema('format', {
        def: {
          format: format
        }
      });

      assert.equal(env.validate('format#/def', null), undefined);
      assert.equal(env.validate('format#/def', 9), undefined);
      assert.equal(env.validate('format#/def', true), undefined);
    });
  });
});

describe('Issue-95: Correct date and time formats', () => {
  const jsonSchema = {
    datetime: {
      format: 'date-time'
    },
    date: {
      format: 'date'
    },
    time: {
      format: 'time'
    }
  };

  it('should validate date-time values', () => {
    const env = djv();
    env.addSchema('format', jsonSchema);

    assert.equal(env.validate('format#/datetime', '2020-01-02T00:00:00Z'), undefined);
    assert.equal(env.validate('format#/datetime', '2020-01-02t23:59:59z'), undefined);
    assert.equal(env.validate('format#/datetime', '2020-01-02T10:23:32+00:00'), undefined);
    assert.equal(env.validate('format#/datetime', '2020-01-02T10:23:32-23:59'), undefined);
    assert.notEqual(env.validate('format#/datetime', '2020-21-02T10:23:32Z'), undefined);
    assert.notEqual(env.validate('format#/datetime', '2020-12-02T33:23:32Z'), undefined);
    assert.notEqual(env.validate('format#/datetime', '08/08/2020 22:00'), undefined);
  });

  it('should validate date values', () => {
    const env = djv();
    env.addSchema('format', jsonSchema);

    assert.equal(env.validate('format#/date', '2020-01-02'), undefined);
    assert.equal(env.validate('format#/date', '2020-12-31'), undefined);
    assert.notEqual(env.validate('format#/date', '2020-13-31'), undefined);
    assert.notEqual(env.validate('format#/date', '2020-21-02'), undefined);
    assert.notEqual(env.validate('format#/date', '08/08/2020'), undefined);
  });

  it('should validate time values', () => {
    const env = djv();
    env.addSchema('format', jsonSchema);

    assert.equal(env.validate('format#/time', '00:00:00Z'), undefined);
    assert.equal(env.validate('format#/time', '23:59:59z'), undefined);
    assert.equal(env.validate('format#/time', '10:23:32+00:00'), undefined);
    assert.equal(env.validate('format#/time', '10:23:32-23:59'), undefined);
    assert.notEqual(env.validate('format#/time', '33:23:32Z'), undefined);
    assert.notEqual(env.validate('format#/time', '22:00'), undefined);
  });
});
