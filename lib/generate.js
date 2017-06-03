const { factory, resolve, State } = require('./utils');
const { list: validators } = require('./validators');

function restore(source, schema) {
  /* eslint-disable no-new-func */
  const fn = new Function('schema', source)(schema);
  /* eslint-enable no-new-func */
  return fn;
}

function generate(env, schema, state = new State(schema, env), inner) {
  const fn = make(env, schema, state);

  // @see map array with holes trick
  // http://2ality.com/2013/11/initializing-arrays.html
  const dynamicVariables = !fn.cachedIndex ? '' :
    `var i${Array(...Array(fn.cachedIndex))
      .map((value, i) => i + 1)
      .join(',i')};`;

  let dynamicFunctions = '';
  if (!inner && state.context.length) {
    dynamicFunctions = `var f${state.context.map((value, i) => `${i + 1}=${state.context[i].toString()}`).join(',f')};`;
  }

  const source = `${dynamicFunctions}return function f0(data){"use strict";${dynamicVariables}${fn.lines.join('\n')}}`;
  const generatedFn = restore(source, schema);

  if (!inner) {
    generatedFn.toString = function toString() {
      return source;
    };
  }

  return generatedFn;
}

function make(env, schema, state) {
  const fn = factory();

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

module.exports = {
  generate,
  restore,
};
