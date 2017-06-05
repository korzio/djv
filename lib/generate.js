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

// if (typeof schema.id === 'string') {
//   this.register(schema.id, generatedFn);
// }
// register: function register(name, generatedFn) {
//   const resolved = {
//     schema,
//     fn: generatedFn,
//   };

//   if (typeof name === 'string') {
//     const normalizedName = clearSchemaName(name);
//     resolved[normalizedName] = normalizedName;
//     env.resolved[normalizedName] = resolved;
//   }

//   return resolved;
// },
// function clearSchemaName(name) {
//   return (name || '').replace(/#/g, '');
// }

module.exports = generate;
