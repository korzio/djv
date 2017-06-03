const generate = require('./generate');
const { restore, State } = require('./utils');

function Environment() {
  if (!(this instanceof Environment)) { return new Environment(); }

  this.resolved = {};
}

Environment.prototype = {
  /**
   * check if object correspond to schema
   *
   * ### Examples:
   *
   *    env.validate('test#/common', { type: 'common' });
   *    // => undefined
   *
   *    env.validate('test#/common', { type: 'custom' });
   *    // => 'required: data'
   *
   * @param {String} name
   * @param {Object} object
   * @returns {String} error - undefined if it is valid
   */
  validate(name, object) {
    return this.resolve(name).fn(object);
  },

  /**
   * add schema to djv environment
   *
   * ### Examples:
   *
   *    env.addSchema('test', jsonSchema);
   *
   * @param {String?} name
   * @param {Object} schema
   * @returns {resolved}
   */
  addSchema(name, schema) {
    const realSchema = typeof name === 'object' ? name : schema;
    const resolved = {
      schema: realSchema,
      fn: generate(this, realSchema),
    };

    if (typeof name === 'string') {
      resolved.name = name;
      this.resolved[name] = resolved;
    }

    return resolved;
  },

  /**
   * removes a schema or the whole structure from djv environment
   *
   * ### Examples:
   *
   *    env.removeSchema('test');
   *
   * @param {String} name
   */
  removeSchema(name) {
    if (name) {
      delete this.resolved[name];
    } else {
      this.resolved = {};
    }
  },

  /**
   * resolves name by existing environment
   *
   * ### Examples:
   *
   *    env.resolve('test');
   *    // => { name: 'test', schema: {} }, fn: ... }
   *
   * @param {String} name
   * @returns {resolved}
   */
  resolve(name) {
    if (typeof name === 'object' || !this.resolved[name]) {
      const state = new State(null, this);
      return this.addSchema(
        name,
        state.resolve(name)
      );
    }

    return this.resolved[name];
  },

  /**
   * exports the whole structure object from environment or by resolved name
   *
   * ### Examples:
   *
   *    env.export();
   *    // => { test: { name: 'test', schema: {}, ... } }
   *
   * @param {String} name
   * @returns {serializedInternalState}
   */
  export(name) {
    let resolved;
    if (name) {
      resolved = this.resolve(name);
      resolved = {
        name,
        schema: resolved.schema,
        fn: resolved.fn.toString()
      };
    } else {
      resolved = {};
      Object.keys(this.resolved).forEach((key) => {
        resolved[key] = {
          name: key,
          schema: this.resolved[key].schema,
          fn: this.resolved[key].fn.toString()
        };
      });
    }

    return JSON.stringify(resolved);
  },

  /**
   * imports all found structure objects to internal environment structure
   * ### Examples:
   *
   *    env.import(config);
   *
   * @param {Object} config - internal structure or only resolved schema object
   */
  import(config) {
    const item = JSON.parse(config);
    let restoreData = item;
    if (item.name && item.fn && item.schema) {
      restoreData = { [item.name]: item };
    }

    Object.keys(restoreData).forEach((key) => {
      const { name, schema, fn: source } = restoreData[key];
      const fn = restore(source, schema);
      this.resolved[name] = { name, schema, fn };
    });
  }
};

module.exports = Environment;
