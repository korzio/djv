const { list: validators } = require('../validators');

function State(schema = {}, env) {
  this.push(schema);
  const { resolved = {} } = env;

  Object.assign(this, {
    current: [0],
    context: [],
    entries: new Map(),
    env,
  }, resolved);
  // TODO move resolved to a property
}

State.prototype = Object.assign(Object.create(Array.prototype), {
  reference(url) {
    const state = this;
    const { env } = this;

    const initialStateLength = state.length;
    let reference = state.resolve(url);
    if (typeof reference !== 'object') {
      return reference;
    }

    const hasStateChanged = initialStateLength !== state.length;
    let context = state.entries.get(reference);
    if (!context) {
      const options = { inner: true };
      const generate = require('../generate');
      // TODO eliminate generate, maybe move to state method
      context = generate(env, reference, state, options);
    }

    if (hasStateChanged) {
      state.length = state.current.pop();
    }

    state.entries.set(reference, context);
    reference = state.context.push(context);
    return reference;
  },
  resolve(reference) {
    if (reference === '#') {
      return 0;
    }

    if (typeof reference !== 'string') {
      return reference;
    }

    const state = this;
    const referenceParts = reference.split(/#\/?/);
    const name = referenceParts[1];
    const components = name && name.split('/');

    let uri = referenceParts[0] || '#';
    let currentSchema;

    if (uri === '#') {
      currentSchema = state[state.current[state.current.length - 1]];
    } else {
      if (!Object.prototype.hasOwnProperty.call(state, uri)) {
        uri = state.slice(state.current[state.current.length - 1] + 1).map(schema => schema.id).join('') + uri;
      }

      currentSchema = state[uri].schema;
    }

    state.current.push(state.length);
    state.push(currentSchema);

    while (components && components.length > 0) {
      const currentPath = decodeURIComponent(components[0].replace(/~1/g, '/').replace(/~0/g, '~'));
      if (!Object.prototype.hasOwnProperty.call(currentSchema, currentPath)) {
        throw new Error('Schema not found');
      }

      currentSchema = currentSchema[currentPath];
      state.push(currentSchema);
      components.shift();
    }

    return currentSchema;
  },
  visit(schema, template) {
    const state = this;
    const initialStateLength = state.length;

    state.push(schema);
    validators.forEach(validator => validator(schema, template));
    state.length = initialStateLength;
  },
});

module.exports = State;
