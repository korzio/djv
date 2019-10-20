const { hasProperty } = require('../utils');

module.exports = function not(schema, tpl) {
  if (!hasProperty(schema, 'not')) {
    return;
  }

  const condition = `${tpl.link(schema.not)}(${tpl.data})`;
  const error = tpl.error('not');

  tpl(`if (!${condition}) ${error}`);
};
