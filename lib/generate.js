const { body, resolve, restore, State, template } = require('./utils');
const { list: validators } = require('./validators');

function generate(env, schema, state = new State(schema, env), inner) {
  const fn = make(env, schema, state);

  const source = body(fn, state, { inner });
  const generatedFn = restore(source, schema, { inner });

  return generatedFn;
}

function make(env, schema, state) {
  const fn = template();

  Object.assign(fn, {
    resolve(url) {
      const initialStateLength = state.length;
      let reference = resolve(url, state);
      if (typeof reference !== 'object') {
        return `f${reference}`;
      }

      const hasStateChanged = initialStateLength !== state.length;
      let context = state.getContext(reference);
      if (!context) {
        context = generate(env, reference, state, true);
      }

      if (hasStateChanged) {
        state.length = state.current.pop();
      }

      reference = state.addContext(reference, context);
      return `f${reference}`;
    },
    visit(subSchema) {
      const initialStateLength = state.length;
      fn.cached.push({});
      state.push(subSchema);

      validators.forEach((validator) => {
        validator(subSchema, fn);
      });

      state.length = initialStateLength;
      fn.cached.pop();
    },
  });

  fn.visit(schema);
  return fn;
}

module.exports = generate;
