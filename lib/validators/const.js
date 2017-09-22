const { hasProperty, makeSchema } = require('../utils');

module.exports = function constant(schema, tpl) {
  if (!hasProperty(schema, 'const')) {
    return;
  }

  const constantInstanceSchema = makeSchema(schema.const);
  tpl.visit(constantInstanceSchema);
};
