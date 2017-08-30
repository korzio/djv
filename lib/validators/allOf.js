const { hasProperty } = require('../utils');

module.exports = function allOf(schema, tpl) {
  if (!hasProperty(schema, 'allOf')) {
    return;
  }

  const condition = `${schema.allOf.map(reference => `${tpl.resolve(reference)}`).join('(%s) || ')}(%s)`;
  const error = tpl.error('allOf');

  tpl(`if (${condition}) ${error}`, tpl.data);
};
