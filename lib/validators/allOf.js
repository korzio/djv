const { hasProperty } = require('../utils');

module.exports = function allOf(schema, tpl) {
  if (!hasProperty(schema, 'allOf')) {
    return;
  }

  const error = tpl.error('allOf');
  const condition = schema.allOf
    .map(reference => `${tpl.link(reference)}(${tpl.data})`)
    .join(' || ');

  tpl(`if (${condition}) ${error}`);
};
