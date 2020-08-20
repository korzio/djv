/**
 * @module template
 * @description
 * Defines a small templater functionality for creating functions body.
 */

import {State} from "./state";
import {IOptions, ISchema} from "../djv";

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

export type TemplaterData = Array<string>

export interface Templater {
  (expression: string, ...args: any[]): Templater;
  cachedIndex: number;
  cached: any[],
  schema: ISchema;
  cache: (v: string) => string;
  data: TemplaterData;
  error(errorType: string, data: TemplaterData): string;
  lines: string[];
  link: (l:string) => string;
  visit: (schema: any) => void;
}

function template(state: State, options: IOptions): Templater {
  const tpl: Templater = (expression: string, ...args: any[]) => {
    let last: string;

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

  function clearDecode(tplString: string) {
    return tplString
        .replace('[', '')
        .replace(']', '')
        .replace('(', '')
        .replace(')', '')
        .replace('decodeURIComponent', '');
  }

  const error = typeof options.errorHandler === 'function' ?
      options.errorHandler :
      function defaultErrorHandler(errorType: string) {
        const path = this.data.toString()
            .replace(/^data/, '');
        const dataPath = path
            .replace(/\['([^']+)'\]/ig, '.$1')
            .replace(/\[(i[0-9]*)\]/ig, '[\'+$1+\']');
        const schemaPath = `#${
            path
                .replace(/\[i([0-9]*)\]/ig, '/items')
                .replace(/\['([^']+)'\]/ig, '/properties/$1')
        }/${errorType}`;

        return `return {
        keyword: '${errorType}',
        dataPath: decodeURIComponent("${clearDecode(dataPath)}"),
        schemaPath: decodeURIComponent("${clearDecode(schemaPath)}")
      };`;
      };

  Object.assign(tpl, {
    cachedIndex: 0,
    cached: [],
    cache(expression: string) {
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
    lines: Array<string>(),
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
    link(url: string) {
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
    visit(schema: ISchema) {
      tpl.cached.push({});
      state.visit(schema, tpl);
      tpl.cached.pop();
    },
  });

  function dataToString(this: string[]) {
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
 * Configuration for template functions
 * @typedef {object} TemplateOptions
 * @property {string[]} context
 * @property {string[]} index
 * @property {boolean?} inner - a generating object should be considered as inner
 * @property {boolean?} defineErrors - if erros should be defined
 * @property {string[]} lines - content templates
 */

/**
 * @private
 * @name makeVariables
 * @type function
 * @description
 * Generate internal variables
 *
 * @param {TemplateOptions} options
 * @return {string} variables
 */
function makeVariables({ defineErrors, index }: {index: number; defineErrors: boolean}) {
  /**
   * @var {array} errors - empty array for pushing errors ability
   * @see errorHandler
   */
  const errors = defineErrors ? 'const errors = [];' : '';
  const variables = index ?
      `let i${Array(...Array(index))
          .map((value, i) => i + 1)
          .join(',i')};` :
      '';

  // @see map array with holes trick
  // http://2ality.com/2013/11/initializing-arrays.html
  // TODO change var to const
  return `
    ${errors}
    ${variables}
  `;
}

/**
 * @private
 * @name makeHelpers
 * @type function
 * @description
 * Generate internal helpers executed in outer function
 *
 * @param {TemplateOptions} options
 * @return {string} functions
 */
function makeHelpers({ context, inner }: {context: string[]; inner: string}) {
  if (inner || !context.length) {
    return '';
  }

  const functions: string[] = [];
  const references: string[] = [];

  context
      .forEach((value, i) => {
        if (typeof value === 'number') {
          references.push(`${i + 1} = f${value + 1}`);
          return;
        }
        functions.push(`${i + 1} = ${value}`);
      });

  return `const f${functions.concat(references).join(', f')};`;
}

/**
 * @private
 * @name makeContent
 * @type function
 * @description
 * Generate internal function body content, including variables
 *
 * @param {TemplateOptions} options
 * @return {string} functions
 */
function makeContent(options: {
  lines: string[];
  defineErrors: boolean;
}) {
  const { defineErrors, lines } = options;

  const variables = makeVariables(options);
  const errors = defineErrors ? 'if(errors.length) return errors;' : '';
  const content = lines.join('\n');

  return `
    "use strict";
    ${variables}
    ${content}
    ${errors}
  `;
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
function body({ cachedIndex, lines }, { context }, { inner, errorHandler } = {}) {
  const options = {
    context,
    inner,
    defineErrors: errorHandler,
    index: cachedIndex,
    lines,
  };

  const helpers = makeHelpers(options);
  const content = makeContent(options);

  return `
    ${helpers}
    function f0(data) {
      ${content}
    }
    return f0;
  `;
}

/**
 * @name templateExpression
 * @type function
 * @description
 * Es6 template helper function
 * Transforms a validator utilities into generated functions body
 * @return {function} template
 */
function templateExpression(strings: string[], ...keys: any[]) {
  return (...values) => {
    let dict = values[values.length - 1] || {};
    let result = [strings[0]];
    keys.forEach((key, i) => {
      let value = Number.isInteger(key) ? values[key] : dict[key];
      result.push(value, strings[i + 1]);
    });
    return result.join('');
  };
}

export {
  body,
  restore,
  template,
  templateExpression as expression,
};
