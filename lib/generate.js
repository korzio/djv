const { factory, resolve } = require('./utils');
const { list: validators } = require('./validators');

module.exports = function generate(
  env,
  schema,
  state = Object.assign([schema], { current: [0], context: [] }, env.resolved)
) {
  const fn = factory();

  Object.assign(fn, {
    resolve(url) {
      let changedState = state.length;
      let reference = resolve(url, state);
      changedState = changedState !== state.length;

      if (typeof reference === 'object') {
        reference = state.context.push(generate(env, reference, state).toFunction(true));

        if (changedState) {
          state.splice(state.current.pop(), state.length);
        }
      }

      return {
        toString() {
          return `f${reference}`;
        }
      };
    },
    toFunction(isInner) {
      const dynamicVariables = !fn.cachedIndex ?
        '' :
        `var i${new Array(fn.cachedIndex).join('_').split('_').map((value, i) => i + 1)
          .join(',i')};`;
      let dynamicFunctions = '';

      if (!isInner && state.context.length) {
        dynamicFunctions = `var f${state.context.map((value, i) => `${i + 1}=${state.context[i].toString()}`).join(',f')};`;
      }

      const src = `${dynamicFunctions}return function f0(data){"use strict";${dynamicVariables}${fn.lines.join('\n')}}`;
      /* eslint-disable no-new-func */
      const generatedFn = new Function('schema', src)(schema);
      /* eslint-enable no-new-func */

      if (!isInner) {
        generatedFn.toString = function toString() {
          return src;
        };
      }

      return generatedFn;
    },
    visit(subSchema) {
      fn.cached.push({});
      const stateLengthBefore = state.length;
      state.push(subSchema);

      validators.forEach((validator) => {
        validator(subSchema, fn);
      });

      state.length = stateLengthBefore;
      fn.cached.pop();
    },
    push: fn,
  });

  fn.visit(schema);
  return fn;
};
