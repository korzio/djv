const { cleanId } = require('./utils');
const { restore } = require('./utils/template');
const formats = require('./utils/formats');
const { generate, State } = require('./utils/state');

function Environment() {
  if (!(this instanceof Environment)) { return new Environment(); }

  this.resolved = {};
  this.state = new State(null, this);
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
   * @param {string} name
   * @param {object} object
   * @returns {string} error - undefined if it is valid
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
   * @param {string?} name
   * @param {object} schema
   * @param {object} schema
   * @returns {resolved}
   */
  addSchema(name, schema) {
    const realSchema = typeof name === 'object' ? name : schema;
    const resolved = {
      schema: realSchema,
      fn: generate(this, realSchema),
    };

    [name, schema.id]
      .filter(id => typeof id === 'string')
      .map(cleanId)
      .forEach((id) => {
        this.resolved[id] = Object.assign({ name: id }, resolved);
      });

    return resolved;
  },

  /**
   * @name addFormat
   * @type function
   * @description
   * Add formatter to djv environment.
   * When a string is passed it is interpreted as an expression which
   * when returns `true` goes with an error, when returns `false` then a property is valid.
   * When a function is passed it will be executed during schema compilation
   * with a current schema and template helper arguments.
   * @see utils/formats
   *
   * ### Examples:
   *
   *    env.addFormat('UpperCase', '%s !== %s.toUpperCase()');
   *    // or
   *    env.addFormat('isOk', function(schema, tpl){
   *      return `!${schema.isOk} || %s !== %s.toUpperCase()`;
   *    });
   *
   * @param {string?} name
   * @param {string/function} formatter
   * @returns {formatter}
   */
  addFormat(name, formatter) {
    formats[name] = formatter;
    return formatter;
  },

  /**
   * removes a schema or the whole structure from djv environment
   *
   * ### Examples:
   *
   *    env.removeSchema('test');
   *
   * @param {string} name
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
   * @param {string} name
   * @returns {resolved}
   */
  resolve(name) {
    if (typeof name === 'object' || !this.resolved[name]) {
      return this.addSchema(
        name,
        this.state.resolve(name)
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
   * @param {string} name
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
   * @param {object} config - internal structure or only resolved schema object
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
