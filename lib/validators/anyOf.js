const { hasProperty } = require('../utils');

module.exports = function anyOf(schema, tpl) {
  if (!hasProperty(schema, 'anyOf')) {
    return;
  }

  const condition = schema.anyOf.map(reference => `${tpl.link(reference)}(%s)`).join(' && ');
  const error = tpl.error('anyOf');

  tpl(`if (${condition}) ${error}`, tpl.data);
};
