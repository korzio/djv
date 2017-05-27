const utils = require('./utils');
const { list: validators } = require('./validators');

module.exports = function generate(
  env,
  schema,
  state = Object.assign([schema], { current: [0], context: [] }, env.resolved)
) {
  function fn(expression, ...args) {
    let last;

    fn.lines.push(
      expression
        .replace(/%i/g, () => 'i')
        .replace(/\$(\d)/g, (match, index) => `${args[index - 1]}`)
        .replace(/(%[sd])/g, () => {
          if (args.length) {
            last = args.shift();
          }

          return `${last}`;
        })
    );

    return fn.push;
  }

  Object.assign(fn, utils, {
    data: ['data'],
    schema: ['schema'],
    lines: [],
    error(errorType) {
      return `return "${errorType}: ${fn.data}";`;
    },
    resolve(url) {
      let changedState = state.length;
      let reference = utils.resolve(url, state);
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
    cachedIndex: 0,
    cached: [],
    cache(expression) {
      const layer = fn.cached[fn.cached.length - 1];

      if (layer[expression]) {
        return `i${layer[expression]}`;
      }

      fn.cachedIndex += 1;
      layer[expression] = fn.cachedIndex;
      return `(i${layer[expression]} = ${expression})`;
    },
    visit(subSchema) {
      fn.cached.push({});
      state.push(subSchema);

      validators.forEach((validator) => {
        validator(subSchema, fn);
      });

      fn.cached.pop();
    },
    push: fn
  });

  function dataToString() {
    return this.join('.').replace(/\.\[/g, '[');
  }

  fn.data.toString = dataToString;
  fn.schema.toString = dataToString;

  fn.visit(schema);
  return fn;
};
