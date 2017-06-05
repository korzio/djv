const { body, restore, State, template } = require('./utils');

/**
 * Configuration for template
 * @typedef {object} TemplateConfig
 * @property {boolean} inner - a generating object should be considered as inner
 */
function generate(env, schema, state = new State(schema, env), options) {
  const tpl = template(state);
  tpl.visit(schema);

  const source = body(tpl, state, options);
  return restore(source, schema, options);
}

module.exports = generate;
