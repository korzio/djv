/**
 * @module state
 * @description
 * State module is responsible for scope schemas resolution.
 * It also exports a main `generate` function.
 */

const { list: validators } = require('../validators');
const { body, restore, template } = require('./template');
const { hasProperty } = require('./');
const {
  normalize,
  makePath,
  head,
  isFullUri,
  fragment,
  keys,
} = require('./uri');
const {
  is: isSchema,
  transform: transformSchema,
} = require('./schema');

/* eslint-disable no-unused-vars */
function State(schema = {}, env) {
/* eslint-enable no-unused-vars */
  Object.assign(this, {
    context: [],
    entries: new Map(),
    env,
  });
}

/**
 * @name generate
 * @type {function}
 * @description
 * The main schema process function.
 * Available and used both in external and internal generation.
 * Saves the state for internal recursive calls.
 * @param {object} env - djv environment
 * @param {object} schema - to process
 * @param {State} state - saved state
 * @param {Environment} options
 * @returns {function} restoredFunction
 */
function generate(env, schema, state = new State(schema, env), options) {
  const tpl = template(state, options);
  tpl.visit(schema);

  const source = body(tpl, state, options);
  return restore(source, schema, options);
}

State.prototype = Object.assign(Object.create(Array.prototype), {
  /**
   * @name addEntry
   * @type {function}
   * @description
   * Generates an internal function.
   * Usually necessary for `allOf` types of validators.
   * Caches generated functions by schema object key.
   * Checks for an existing schema in a context stack to avoid double parsing and generation.
   * @param {string} url
   * @param {object} schema
   * @returns {number/boolean} index
   */
  addEntry(url, schema) {
    let entry = this.entries.get(schema);
    if (entry === false) {
      // has already been added to process queue
      // will be revealed as an entry
      return this.context.push(schema);
    }

    if (typeof entry === 'undefined') {
      // start to process schema
      this.entries.set(schema, false);
      entry = generate(this.env, schema, this, { inner: true });
      this.entries.set(schema, entry);
      this.revealReference(schema);
    }

    return this.context.push(entry);
  },
  /**
   * @name revealReference
   * @type {function}
   * @description
   * If a schema was added during the add entry phase
   * Then it should be revealed in this step
   * @param {object} schema
   * @returns {void}
   */
  revealReference(schema) {
    for (
      let doubled = this.context.indexOf(schema);
      doubled !== -1;
      doubled = this.context.indexOf(schema)
    ) {
      this.context[doubled] = this.context.length;
    }
  },
  /**
   * @name link
   * @type {function}
   * @description
   * Returns an entry's index in a context stack.
   * @param {string} url
   * @returns {string} entry
   */
  link(url) {
    const schema = this.resolve(url);
    const entry = this.addEntry(url, schema);
    return entry;
  },
  /**
   * @name resolveReference
   * @type {function}
   * @description
   * Resolve reference against the stack.
   * @param {string} reference
   * @returns {string} resolvedReference
   */
  resolveReference(reference) {
    if (isFullUri(reference)) {
      return reference;
    }

    // find last full URI schema
    let lastFullURIReference;
    let lastFullURISchemaIndex;

    for (let i = this.length - 1; i >= 0; i -= 1, lastFullURIReference = false) {
      const { [keys.id]: id, $ref } = this[i];
      lastFullURIReference = id || $ref;
      if (isFullUri(lastFullURIReference)) {
        lastFullURISchemaIndex = i;
        break;
      }
    }

    // collect all partial routes for it
    const partialReferences = [];
    for (let i = this.length - 1; i > lastFullURISchemaIndex; i -= 1) {
      const { [keys.id]: id, $ref } = this[i];
      const partialReference = id || $ref;
      if (head(partialReference)) {
        partialReferences.push(partialReference);
      }
    }

    // attach reference and make path
    const path = makePath([lastFullURIReference, ...partialReferences, reference]);
    return path;
  },
  /**
   * @name ascend
   * @private
   * @type {function}
   * @description
   * Search for a parent schema by reference.
   * Iterates over the chain of schemas.
   * @param {string} reference
   * @returns {object} parentSchema
   */
  ascend(reference) {
    const path = head(reference);
    let { schema: parentSchema = this[0] } = this.env.resolved[path] || {};

    // Search while it is a full schema, not a ref
    while (
      parentSchema.$ref &&
      // avoid infinite loop
      head(parentSchema.$ref) !== head(reference) &&
      // > All other properties in a "$ref" object MUST be ignored.
      // @see https://tools.ietf.org/html/draft-wright-json-schema-01#section-8
      Object.keys(parentSchema).length === 1
    ) {
      parentSchema = this.ascend(parentSchema.$ref);
    }

    return parentSchema;
  },
  /**
   * @name descend
   * @private
   * @type {function}
   * @description
   * Search for a child schema by reference.
   * Iterates over the chain of schemas.
   * @param {string} reference
   * @returns {object} currentSchema
   */
  descend(reference, parentSchema) {
    let uriFragment = fragment(reference);
    if (!uriFragment && isFullUri(reference)) {
      return parentSchema;
    }

    if (!uriFragment) {
      uriFragment = reference;
    }

    const parts = uriFragment.split('/');
    const currentSchema = parts
      .map(normalize)
      .reduce((schema, part, index) => {
        let subSchema = schema[part];
        if (!isSchema(subSchema)) {
          subSchema = schema.definitions && schema.definitions[part];
        }

        if (
          // last will be pushed on visit
          // @see /draft4/refRemote.json:http://localhost:1234/scope_change_defs2.json
          index !== parts.length - 1 &&
          hasProperty(subSchema, keys.id)
        ) {
          this.push(subSchema);
        }

        return subSchema;
      }, parentSchema);

    return isSchema(currentSchema) ? currentSchema : parentSchema;
  },
  /**
   * @name resolve
   * @type {function}
   * @description
   * Resolves schema by given reference and current registered context stack.
   * @param {string} url
   * @returns {object} schema
   */
  resolve(reference) {
    if (typeof reference !== 'string') {
      return reference;
    }

    const fullReference = this.resolveReference(reference);
    const parentSchema = this.ascend(fullReference);
    const subSchema = this.descend(reference, parentSchema);

    return subSchema;
  },
  /**
   * @name visit
   * @type {function}
   * @description
   * Calls each registered validator with given schema and template instance.
   * Validator may or may not add code to generated validator function.
   * @param {object} pseudoSchema
   * @param {object} tpl
   * @returns {void}
   */
  visit(pseudoSchema, tpl) {
    const schema = transformSchema(pseudoSchema);
    const initialLength = this.length;
    this.push(schema);

    validators.some(validator => (
      validator(schema, tpl)
    ));

    this.length = initialLength;
  },
});

module.exports = {
  State,
  generate,
};
