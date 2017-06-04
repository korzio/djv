const { body, restore, State, template } = require('./utils');

function generate(env, schema, state = new State(schema, env), options) {
  const instance = template(state);
  instance.visit(schema);

  const source = body(instance, state, options);
  return restore(source, schema, options);
}

module.exports = generate;
