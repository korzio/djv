const { hasProperty } = require('../utils');

module.exports = function $ref(schema, tpl) {
  if (!hasProperty(schema, '$ref')) {
    return;
  }

  const condition = `${tpl.resolve(schema.$ref)}(%s)`;
  const error = tpl.error('$ref');

  tpl(`if (${condition}) ${error}`, tpl.data);
};
