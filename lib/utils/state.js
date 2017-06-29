const { list: validators } = require('../validators');
const { body, restore, template } = require('./template');
const { joinPath } = require('./');

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
    const initialStateLength = this.length;

    const schema = this.resolve(url);
    const entry = this.addReference(url, schema) || this.addEntry(url, schema);

    const hasStateChanged = initialStateLength !== this.length;
    if (hasStateChanged) {
      this.length = this.resolution.pop();
    }

    return entry;
  },
  // pure scope resolution methods
  push(schema) {
    if (schema && schema.id && this.length) {
      this.resolution.push(this.length);
    }
    Array.prototype.push.call(this, schema);
  },
  ascend(uri) {
    const indexOfParent = this.resolution[this.resolution.length - 1];
    if (uri === '#') {
      return this[indexOfParent];
    }
    if (Object.prototype.hasOwnProperty.call(this, uri)) {
      return this.env.resolved[uri].schema;
    }

    const parentSchemaParts = this.slice(indexOfParent + 1)
      .map(({ id }) => id)
      .concat(uri);

    const subSchemaPath = joinPath(parentSchemaParts);
    const parentSchema = this.env.resolved[subSchemaPath].schema;

    return parentSchema;
  },
  descent(name, parentSchema) {
    let currentSchema = parentSchema;

    const components = name && name.split('/');
    while (components && components.length > 0) {
      const currentPath = decodeURIComponent(components[0].replace(/~1/g, '/').replace(/~0/g, '~'));
      if (!Object.prototype.hasOwnProperty.call(currentSchema, currentPath)) {
        throw new Error('Schema not found');
      }

      currentSchema = currentSchema[currentPath];
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

    const referenceParts = reference.split(/#\/?/);
    const name = referenceParts[1];
    const parentReference = referenceParts[0] || '#';
    const parentSchema = this.ascend(parentReference);

    this.push(parentSchema);

    return this.descent(name, parentSchema);
  },
  visit(schema, tpl) {
    const initialStateLength = this.length;

    this.push(schema);
    validators.forEach(validator => validator(schema, tpl));
    this.length = initialStateLength;
  },
});

module.exports = {
  State,
  generate,
};
