const assert = require('assert');
const djv = require('../');

const refSchema = require('json-schema-test-suite/tests/draft4/allOf.json')[0].schema;

describe('djv', () => {
  it('should exist', () => {
    assert.equal(typeof djv, 'function');
  });

  const methods = ['addSchema', 'validate', 'resolve', 'import', 'export', 'addFormat'];
  it(`should contain interface ${methods}`, () => {
    methods.forEach((methodName) => {
      assert.equal(typeof djv.prototype[methodName], 'function');
    });
  });

  const jsonSchema = {
    common: {
      properties: {
        type: {
          enum: ['common']
        }
      },
      required: [
        'type'
      ]
    }
  };

  describe('addSchema()', () => {
    it('should add schema', () => {
      const env = djv();
      env.addSchema('test', jsonSchema);
      const resolved = env.resolve('test#/common');

      assert.equal(typeof resolved, 'object');
      assert.equal(typeof resolved.fn, 'function');
    });
  });

  describe('validate()', () => {
    it('should return undefined if object is valid', () => {
      const env = djv();
      env.addSchema('test', jsonSchema);

      const commonObj = { type: 'common' };
      const errors = env.validate('test#/common', commonObj);
      assert.equal(errors, undefined);
    });

    it('should return error if object is not valid', () => {
      const env = djv();
      env.addSchema('test', jsonSchema);

      const customObj = { type: 'custom' };
      const errors = env.validate('test#/common', customObj);
      assert.equal(typeof errors, 'string');
    });

    it('should validate an object by a given schema without namespace', () => {
      const env = djv();

      const customObj = { type: 'custom' };
      let errors = env.validate(jsonSchema.common, customObj);
      assert.equal(typeof errors, 'string');

      const commonObj = { type: 'common' };
      errors = env.validate(jsonSchema.common, commonObj);
      assert.equal(errors, undefined);
    });
  });

  describe('export()', () => {
    it('should return whole internal structure', () => {
      const env = djv();
      env.addSchema('test', jsonSchema);

      let exported = env.export();
      assert.equal(typeof exported, 'string');
      exported = JSON.parse(exported);
      assert.equal(typeof exported, 'object');
      assert.equal(typeof exported.test, 'object');
      assert.equal(typeof exported.test.fn, 'string');
      assert.equal(exported.test.name, 'test');
      assert.deepEqual(exported.test.schema, jsonSchema);
    });

    it('should return partial resolved schema by name', () => {
      const env = djv();
      env.addSchema('test', jsonSchema);

      let exported = env.export('test#/common');
      exported = JSON.parse(exported);

      assert.equal(typeof exported, 'object');
      assert.equal(typeof exported, 'object');
      assert.equal(typeof exported.fn, 'string');
      assert.equal(exported.name, 'test#/common');
      assert.deepEqual(exported.schema, jsonSchema.common);
    });
  });

  describe('import()', () => {
    it('should restore whole environment', () => {
      const oldDjv = djv();
      oldDjv.addSchema('test', jsonSchema);

      const exported = oldDjv.export();
      const env = djv();
      env.import(exported);

      const commonObj = { type: 'common' };
      let errors = env.validate('test#/common', commonObj);
      assert.equal(errors, undefined);

      const customObj = { type: 'custom' };
      errors = env.validate('test#/common', customObj);
      assert.equal(typeof errors, 'string');
    });

    it('should restore environment with references', () => {
      const oldDjv = djv();

      oldDjv.addSchema('test', refSchema);

      const exported = oldDjv.export();
      const env = djv();
      env.import(exported);

      let errors = env.validate('test', { foo: 'baz', bar: 2 });
      assert.equal(errors, undefined);

      errors = env.validate('test', { foo: 'baz' });
      assert.equal(typeof errors, 'string');
    });

    it('should restore partial environment', () => {
      const oldDjv = djv();
      oldDjv.addSchema('test', jsonSchema);

      const exported = oldDjv.export('test#/common');

      let env = djv();
      env.addSchema('test', jsonSchema);

      env = djv();
      env.import(exported);

      const commonObj = { type: 'common' };
      let errors = env.validate('test#/common', commonObj);
      assert.equal(errors, undefined);

      const customObj = { type: 'custom' };
      errors = env.validate('test#/common', customObj);
      assert.equal(typeof errors, 'string');
    });
  });

  describe('addFormat()', () => {
    it('should add custom formatter as expression', () => {
      const env = djv();

      env.addFormat('UpperCase', '%s !== %s.toUpperCase()');
      env.addSchema('test', {
        format: 'UpperCase',
        type: 'string'
      });

      assert.equal(env.validate('test', 'VALID'), undefined);
      assert.equal(typeof env.validate('test', 'invalid'), 'string');
    });

    it('should add custom formatter as function', () => {
      const env = djv();

      env.addFormat('isOk', schema => `!${schema.isOk}`);
      env.addSchema('ok', {
        format: 'isOk',
        type: 'string',
        isOk: true
      });
      env.addSchema('notok', {
        format: 'isOk',
        type: 'string'
      });

      assert.equal(env.validate('ok', 'valid'), undefined);
      assert.equal(typeof env.validate('notok', 'invalid'), 'string');
    });
  });
});
