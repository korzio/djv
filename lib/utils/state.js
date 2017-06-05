const { list: validators } = require('../validators');

function State(schema = {}, env) {
  this.push(schema);

  Object.assign(this, {
    current: [0],
    context: [],
    entries: new Map(),
    env,
  });
}

State.prototype = Object.assign(Object.create(Array.prototype), {
  generate(schema, options = { inner: true }) {
    const generate = require('../generate');
    // TODO remove dynamic require
    return generate(this.env, schema, this, options);
  },
  reference(url) {
    const initialStateLength = this.length;

    let reference = this.resolve(url);
    if (typeof reference !== 'object') {
      return reference;
    }

    const hasStateChanged = initialStateLength !== this.length;
    const context = this.entries.get(reference) || this.generate(reference);
    this.entries.set(reference, context);

    if (hasStateChanged) {
      this.length = this.current.pop();
    }

    reference = this.context.push(context);
    return reference;
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
    const components = name && name.split('/');

    let uri = referenceParts[0] || '#';
    let currentSchema;

    if (uri === '#') {
      currentSchema = this[this.current[this.current.length - 1]];
    } else {
      if (!Object.prototype.hasOwnProperty.call(this, uri)) {
        uri = this.slice(this.current[this.current.length - 1] + 1).map(schema => schema.id).join('') + uri;
      }

      currentSchema = this.env.resolved[uri].schema;
    }

    this.current.push(this.length);
    this.push(currentSchema);

    while (components && components.length > 0) {
      const currentPath = decodeURIComponent(components[0].replace(/~1/g, '/').replace(/~0/g, '~'));
      if (!Object.prototype.hasOwnProperty.call(currentSchema, currentPath)) {
        throw new Error('Schema not found');
      }

      currentSchema = currentSchema[currentPath];
      this.push(currentSchema);
      components.shift();
    }

    return currentSchema;
  },
  visit(schema, tpl) {
    const initialStateLength = this.length;

    this.push(schema);
    validators.forEach(validator => validator(schema, tpl));
    this.length = initialStateLength;
  },
});

module.exports = State;
