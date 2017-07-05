const { list: validators } = require('../validators');
const { body, restore, template } = require('./template');
const { normalize, makePath, head, fragment, isFullUri, hasProperty, cleanId } = require('./');

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
  addEntry(url, schema) {
    if (typeof schema !== 'object') {
      return schema;
    }

    const options = { inner: true };
    const entry = this.entries.get(schema) || generate(this.env, schema, this, options);
    this.entries.set(schema, entry);
    this.revealReference(url);

    return this.context.push(entry);
  },
  addReference(url, schema) {
    const schemaIndex = this.indexOf(schema);
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
  reference(url) {
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
  // TODO move to djv?
  getResolvedSchema(path) {
    if (hasProperty(this.env.resolved, path)) {
      return this.env.resolved[path].schema;
    }
    const normalPath = cleanId(path);
    if (hasProperty(this.env.resolved, normalPath)) {
      return this.env.resolved[normalPath].schema;
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

    if (
        !parentSchema ||
        this.getResolvedSchema(parentSchemaPath)
    ) {
      parentSchema = this.getResolvedSchema(parentSchemaPath);
    }

    // TODO decrease cyclomatic complexity
    // TODO move to state $ref function
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
  // TODO move to utils
  // as it doesn't have any dependencies on environment
  descent(reference, parentSchema) {
    const name = fragment(reference);
    const components = name && name.split('/');

    let currentSchema = parentSchema;
    // TODO change while to forEach
    while (components && components.length > 0) {
      const currentPath = decodeURIComponent(normalize(components[0]));
      currentSchema = currentSchema[currentPath] ||
        (currentSchema.definitions && currentSchema.definitions[currentPath]);

      if (!currentSchema) {
        throw new Error(`Schema ${name} not found`);
      }
      components.shift();
    }

    return currentSchema;
  },
  resolve(reference) {
    if (reference === '#') {
      return 0;
    }
    if (typeof reference !== 'string') {
      return reference;
    }

    const parentSchema = this.ascend(reference);
    return this.descent(reference, parentSchema);
  },
  visit(schema, tpl) {
    const initialStateLength = this.length;
    const initialResolutionLength = this.resolution.length;
    this.push(schema);

    validators.forEach(validator => validator(schema, tpl));

    this.length = initialStateLength;
    this.resolution.length = initialResolutionLength;
  },
});

module.exports = {
  State,
  generate,
};
