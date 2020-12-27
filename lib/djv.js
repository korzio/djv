const { restore, expression } = require('./utils/template');
const formats = require('./utils/formats');
const { generate, State } = require('./utils/state');
const { add, use } = require('./utils/environment.js');

/**
 * Configuration for template
 * @typedef {object} DjvConfig
 * @property {string?} version - defines which version of json-schema draft to use,
 * draft-04 by default
 * @property {function?} versionConfigure - handler to apply for environment version
 * @property {boolean?} inner - a generating object should be considered as inner
 * Default value is false/undefined.
 * If true, then it avoid creating variables in a generated function body,
 * however without proper wrapper function approach will not work.
 * @see template/body, template/body
 * @property {object?} formats - an object containing list of formatters to add for environment
 * @property {function?} errorHandler - a handler to use for generating custom error messages
 */

/**
 * @name Environment
 * @description
 * Key constructor used for creating enivornment instance
 * @type {function} constructor
 * @param {DjvConfig} options passed to templater and utilities
 *
 * Usage
 *
 * ```javascript
 * const env = djv();
 * const env = new djv();
 * const env = new djv({ errorHandler: () => ';' });
 * ```
 */
function Environment(options = {}) {
  if (!(this instanceof Environment)) { return new Environment(options); }

  this.options = options;
  this.resolved = {};
  this.state = new State(null, this);

  this.useVersion(options.version, options.versionConfigure);
  this.addFormat(options.formats);
}

Object.assign(Environment, {
  expression,
});

Object.assign(Environment.prototype, {
  /**
   * check if object correspond to schema
   *
   * Usage
   *
   * ```javascript
   * env.validate('test#/common', { type: 'common' });
   * // => undefined
   *
   * env.validate('test#/common', { type: 'custom' });
   * // => 'required: data'
   *
   * @param {string} name
   * @param {object} object
   * @returns {string} error - undefined if it is valid
   */
  validate(name, object) {
    const foundSchema = this.resolve(name);
    return foundSchema.fn(object);
  },

  /**
   * add schema to djv environment
   *
   * Usage
   *
   * ```javascript
   * env.addSchema('test', jsonSchema);
   * ```
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
      fn: generate(this, realSchema, undefined, this.options),
    };

    [name, schema.id]
      .filter(id => typeof id === 'string')
      .forEach((id) => {
        this.resolved[id] = Object.assign({ name: id }, resolved);
      });

    return resolved;
  },

  /**
   * removes a schema or the whole structure from djv environment
   *
   * Usage
   *
   * ```javascript
   * env.removeSchema('test');
   * ```
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
   * Usage
   *
   * ```javascript
   * env.resolve('test');
   * // => { name: 'test', schema: {} }, fn: ... }
   * ```
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
   * Usage
   *
   * ```javascript
   * env.export();
   * // => { test: { name: 'test', schema: {}, ... } }
   * ```
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
   * Usage
   *
   * ```javascript
   * env.import(config);
   * ```
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
      const fn = restore(source, schema, this.options);
      this.resolved[name] = { name, schema, fn };
    });
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
   * Usage
   *
   * ```javascript
   * env.addFormat('UpperCase', '%s !== %s.toUpperCase()');
   * // or
   * env.addFormat('isOk', function(schema, tpl){
   *   return `!${schema.isOk} || %s !== %s.toUpperCase()`;
   * });
   * ```
   *
   * @param {string/object?} name
   * @param {string/function} formatter
   */
  addFormat(name, formatter) {
    if (typeof name === 'string') {
      formats[name] = formatter;
      return;
    }

    if (typeof name === 'object') {
      Object.assign(formats, name);
    }
  },

  /**
   * @name setErrorHandler
   * @type function
   * @description
   * Specify custom error handler which will be used in generated functions when problem found.
   * The function should return a string expression, which will be executed when generated
   * validator function is executed. The simpliest use case is the default one
   * @see template/defaultErrorHandler
   * ```javascript
   *  function defaultErrorHandler(errorType) {
   *    return `return "${errorType}: ${tpl.data}";`;
   *  }
   * ```
   * It returns an expression 'return ...', so the output is an error string.
   * Usage
   * ```javascript
   * djv({ errorHandler: () => 'return { error: true };' }) // => returns an object
   * djv({
   *  errorHandler: function customErrorHandler(errorType, property) {
   *    return `errors.push({
   *      type: "${errorType}",
   *      schema: "${this.schema[this.schema.length - 1]}",
   *      data: "${this.data[this.data.length - 1]}"
   *    });`;
   *  }
   * });
   * ```
   * When a custom error handler is used, the template body function adds a `error` variable inside
   * a generated validator, which can be used to put error information. `errorType` is always
   * passed to error handler function. Some validate utilities put extra argument, like f.e.
   * currently processed property value. Inside the handler context is a templater instance,
   * which contains `this.schema`, `this.data` paths arrays to identify validator position.
   * @see test/index/setErrorHandler for more examples
   * @param {function} errorHandler - a function called each time compiler creates an error branch
   * @returns void
   */
  setErrorHandler(errorHandler) {
    Object.assign(this.options, { errorHandler });
  },
  /**
  * @name useVersion
  * @type {function}
  * @description
  * Add a specification version for environment
  * A configure function is called with exposed environments, like keys, formats, etc.
  * Updates internals utilities and configurations to fix versions implementation conflicts
  * @param {string} version of json-schema specification to use
  * @param {function} configure
  * @returns void
  */
  useVersion(version, configure) {
    if (typeof configure !== 'function' && version === 'draft-04') {
      /* eslint-disable no-param-reassign, global-require, import/no-extraneous-dependencies */
      configure = require('@korzio/djv-draft-04');
      /* eslint-enable no-param-reassign, global-require, import/no-extraneous-dependencies */
    }
    if (typeof configure === 'function') {
      add(version, configure);
    }
    use(version);
  },
});

module.exports = Environment;
