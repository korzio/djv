const { list: validators } = require('../validators');
const { body, restore, template } = require('./template');
const {
  descent,
  makePath,
  head,
  isFullUri,
  hasProperty,
  cleanId,
  isSchema,
  transformSchema,
} = require('./');

function State(schema = {}, env) {
  Object.assign(this, {
    resolution: [0],
    context: [],
    entries: new Map(),
    env,
  });

  this.push(schema);
}

function generate(env, schema, state = new State(schema, env), options) {
  const tpl = template(state, options);
  tpl.visit(schema);

  const source = body(tpl, state, options);
  return restore(source, schema, options);
}

State.prototype = Object.assign(Object.create(Array.prototype), {
  // template related methods
  /**
   * @name addEntry
   * @type {function}
   * @description
   * Generates an internal function.
   * Usually necessary for `allOf` types of validators.
   * Caches generated functions by schema object key.
   * @param {string} url
   * @param {object} schema
   * @returns {number/boolean} index
   */
  addEntry(url, schema) {
    if (!isSchema(schema)) {
      return schema;
    }

    const options = { inner: true };
    const entry = this.entries.get(schema) || generate(this.env, schema, this, options);
    this.entries.set(schema, entry);
    this.revealReference(url);

    return this.context.push(entry);
  },
  /**
   * @name addReference
   * @type {function}
   * @description
   * Checks for an existing schema in a context stack to avoid double parsing and generation.
   * @param {string} url
   * @param {object} schema
   * @returns {number/boolean} index
   */
  addReference(url, schema) {
    const schemaIndex = this.indexOf(schema);
    // reference to itself
    if (schemaIndex === 0) {
      return this.context.push(0);
    }
    if (schemaIndex !== -1 && schemaIndex !== this.length - 1) {
      // has already been added to process queue
      return this.context.push(url);
    }
    return false;
  },
  revealReference(url) {
    for (
      let doubled = this.context.indexOf(url);
      doubled !== -1;
      doubled = this.context.indexOf(url)
    ) {
      this.context[doubled] = this.context.length;
    }
  },
  /**
   * @name link
   * @type {function}
   * @description
   * Resolves schema by given url and current registered context stack.
   * Returns either an index of an entry in a context stack.
   * @param {string} url
   * @returns {string} entry
   */
  link(url) {
    const schema = this.resolve(url);
    const entry = this.addReference(url, schema) || this.addEntry(url, schema);

    return entry;
  },
  // pure scope resolution methods
  push(schema) {
    // if schema id is partial
    // it should be resolved against the closest parent(s)
    // so only valid URIs added to resolution
    if (schema && schema.id && this.length && isFullUri(schema.id)) {
      this.resolution.push(this.length);
    }

    Array.prototype.push.call(this, schema);
  },
  getResolvedSchema(path) {
    if (hasProperty(this.env.resolved, path)) {
      return this.env.resolved[path].schema;
    }

    const cleanPath = cleanId(path);
    if (hasProperty(this.env.resolved, cleanPath)) {
      return this.env.resolved[cleanPath].schema;
    }

    if (cleanPath) {
      const foundResolvedIndex = this.resolution
        .reverse()
        .find(index => this[index].id && (
          this[index].id === cleanPath ||
          this[index].id === path
        ));

      if (typeof foundResolvedIndex !== 'undefined') {
        return this[foundResolvedIndex];
      }
    }

    return null;
  },
  /**
   * @name ascend
   * @type {function}
   * @description
   * Search for a parent schema by reference.
   * Iterates over the chain of schemas.
   * @param {string} reference
   * @returns {object} parentSchema
   */
  ascend(reference) {
    const indexOfParent = Math.max(this.resolution[this.resolution.length - 1], 1);

    let parentSchemaPath = head(reference);
    let parentSchema = this[indexOfParent];

    if (parentSchemaPath && this.length > 1 && !isFullUri(reference)) {
      parentSchemaPath = makePath(
        this.slice(indexOfParent)
          .map(({ id }) => id)
          .concat(parentSchemaPath)
      );
    }

    const resolvedSchema = this.getResolvedSchema(parentSchemaPath);
    if (!parentSchema || resolvedSchema) {
      parentSchema = resolvedSchema;
    }

    // try to resolve it against environment
    if (hasProperty(parentSchema, '$ref')) {
      const ref = head(parentSchema.$ref);
      if (ref !== '#' && this.getResolvedSchema(ref)) {
        parentSchema = this.getResolvedSchema(ref);
      }
    }

    this.push(parentSchema);
    return parentSchema;
  },
  resolve(reference) {
    if (reference === '#') {
      return 0;
    }
    if (typeof reference !== 'string') {
      return reference;
    }

    const parent = this.ascend(reference);
    const resolved = descent(reference, parent);

    return resolved;
  },
  /**
   * @name visit
   * @type {function}
   * @description
   * Calls each registered validator with given schema and template instance.
   * Validator may or may not add code to generated validator function.
   * @param {object} pseudoSchema
   * @param {object} tpl
   * @returns {void}
   */
  visit(pseudoSchema, tpl) {
    const initialStateLength = this.length;
    const initialResolutionLength = this.resolution.length;

    const schema = transformSchema(pseudoSchema);
    this.push(schema);

    validators.forEach((validator) => {
      validator(schema, tpl);
    });

    this.length = initialStateLength;
    this.resolution.length = initialResolutionLength;
  },
});

module.exports = {
  State,
  generate,
};
