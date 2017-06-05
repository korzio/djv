/**
 * Configuration for template
 * @typedef {object} TemplateConfig
 * @property {boolean} inner - a generating object should be considered as inner
 */

function template(state) {
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

    return fn;
  }

  Object.assign(fn, {
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
    data: ['data'],
    error(errorType) {
      return `return "${errorType}: ${fn.data}";`;
    },
    lines: [],
    push: fn,
    resolve(url) {
      const link = state.reference(url);
      return `f${link}`;
    },
    schema: ['schema'],
    visit(schema) {
      fn.cached.push({});
      state.visit(schema, fn);
      fn.cached.pop();
    },
  });

  function dataToString() {
    return this.join('.').replace(/\.\[/g, '[');
  }
  fn.data.toString = dataToString;
  fn.schema.toString = dataToString;

  return fn;
}

/**
 * @name restore
 * @type function
 * @description
 * Generate a function by given body with a schema in a closure
 *
 * @param {string} source - function inner & outer body
 * @param {object} schema - passed as argument to meta function
 * @param {TemplateConfig} config
 * @return {function} fn
 */
function restore(source, schema, { inner } = {}) {
  /* eslint-disable no-new-func */
  const fn = new Function('schema', source)(schema);
  /* eslint-enable no-new-func */

  if (!inner) {
    fn.toString = function toString() {
      return source;
    };
  }

  return fn;
}

/**
 * @name body
 * @type function
 * @description
 * Generate a function body, containing internal variables and helpers
 *
 * @param {object} context - template instance, containing all analyzed schema related data
 * @param {object} state - state of schema generation
 * @param {TemplateConfig} config
 * @return {string} body
 */
function body(context, state, { inner } = {}) {
  // @see map array with holes trick
  // http://2ality.com/2013/11/initializing-arrays.html
  const dynamicVariables = !context.cachedIndex ? '' :
    `var i${Array(...Array(context.cachedIndex))
      .map((value, i) => i + 1)
      .join(',i')};`;

  let dynamicFunctions = '';
  if (!inner && state.context.length) {
    const functions = [];
    const references = [];
    state.context
      .forEach((value, i) => {
        if (typeof value === 'number') {
          references.push(`${i + 1}=f${value}`);
          return;
        }
        functions.push(`${i + 1}=${value}`);
      });
    dynamicFunctions = `var f${functions.concat(references).join(',f')};`;
  }

  const source = `${dynamicFunctions}return function f0(data){"use strict";${dynamicVariables}${context.lines.join('\n')}}`;
  // TODO change var to const
  return source;
}

module.exports = {
  template,
  restore,
  body,
};
