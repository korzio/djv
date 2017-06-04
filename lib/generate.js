const { body, restore, State, template } = require('./utils');

function generate(env, schema, state = new State(schema, env), options) {
  const tpl = template(state);
  tpl.visit(schema);

  const source = body(tpl, state, options);
  return restore(source, schema, options);
}

module.exports = generate;
