/**
 * @module template
 * @description
 * Defines a small templater functionality for creating functions body.
 */

/**
 * @name template
 * @type function
 * @description
 * Provides a templater function, which adds a line of code into generated function body.
 *
 * @param {object} state - used in visit and reference method to iterate and find schemas.
 * @param {DjvConfig} options
 * @return {function} tpl
 */
function template(state, options) {
  function tpl(expression, ...args) {
    let last;

    tpl.lines.push(
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

    return tpl;
  }

  const error = typeof options.errorHandler === 'function' ?
    options.errorHandler :
    function defaultErrorHandler(errorType) {
      return `return "${errorType}: ${tpl.data}";`;
    };

  Object.assign(tpl, {
    cachedIndex: 0,
    cached: [],
    cache(expression) {
      const layer = tpl.cached[tpl.cached.length - 1];
      if (layer[expression]) {
        return `i${layer[expression]}`;
      }

      tpl.cachedIndex += 1;
      layer[expression] = tpl.cachedIndex;
      return `(i${layer[expression]} = ${expression})`;
    },
    data: ['data'],
    error,
    lines: [],
    schema: ['schema'],
    push: tpl,
    /**
     * @name link
     * @description
     * Get schema validator by url
     * Call state link to generate or get cached function
     * @type {function}
     * @param {string} url
     * @return {string} functionName
     */
    link(url) {
      return `f${state.link(url)}`;
    },
    /**
     * @name visit
     * @description
     * Create new cache scope and visit given schema
     * @type {function}
     * @param {object} schema
     * @return {void}
     */
    visit(schema) {
      tpl.cached.push({});
      state.visit(schema, tpl);
      tpl.cached.pop();
    },
  });

  function dataToString() {
    return this.join('.').replace(/\.\[/g, '[');
  }
  tpl.data.toString = dataToString;
  tpl.schema.toString = dataToString;

  return tpl;
}

/**
 * @name restore
 * @type function
 * @description
 * Generate a function by given body with a schema in a closure
 *
 * @param {string} source - function inner & outer body
 * @param {object} schema - passed as argument to meta function
 * @param {DjvConfig} config
 * @return {function} tpl
 */
function restore(source, schema, { inner } = {}) {
  /* eslint-disable no-new-func */
  const tpl = new Function('schema', source)(schema);
  /* eslint-enable no-new-func */

  if (!inner) {
    tpl.toString = function toString() {
      return source;
    };
  }

  return tpl;
}

/**
 * @name body
 * @type function
 * @description
 * Generate a function body, containing internal variables and helpers
 *
 * @param {object} tpl - template instance, containing all analyzed schema related data
 * @param {object} state - state of schema generation
 * @param {DjvConfig} config
 * @return {string} body
 */
function body(tpl, state, { inner, errorHandler } = {}) {
  let dynamicVariables = '';
  let errors = '';
  let dynamicFunctions = '';

  if (tpl.cachedIndex) {
    // @see map array with holes trick
    // http://2ality.com/2013/11/initializing-arrays.html
    // TODO change var to const
    dynamicVariables = `var i${Array(...Array(tpl.cachedIndex))
      .map((value, i) => i + 1)
      .join(',i')};`;
  }
  if (errorHandler) {
    /**
     * @var {array} errors - empty array for pushing errors ability
     * @see errorHandler
     */
    dynamicVariables += 'var errors = [];';
    errors = 'if(errors.length) return errors;';
  }

  if (!inner && state.context.length) {
    const functions = [];
    const references = [];
    state.context
      .forEach((value, i) => {
        if (typeof value === 'number') {
          references.push(`${i + 1}=f${value + 1}`);
          return;
        }
        functions.push(`${i + 1}=${value}`);
      });
    dynamicFunctions = `var f${functions.concat(references).join(',f')};`;
  }

  const source = `${dynamicFunctions}
    function f0(data){
      "use strict";
      ${dynamicVariables}
      ${tpl.lines.join('\n')}
      ${errors}
    }
    return f0;`;

  return source;
}

module.exports = {
  body,
  restore,
  template,
};
