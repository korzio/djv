const { hasProperty } = require('../utils');
const { make: makeSchema } = require('../utils/schema');

module.exports = function constant(schema, tpl) {
  if (!hasProperty(schema, 'const')) {
    return;
  }

  const constantInstanceSchema = makeSchema(schema.const);
  tpl.visit(constantInstanceSchema);
};
