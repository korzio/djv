const { hasProperty } = require('../utils');

module.exports = function not(schema, tpl) {
  if (!hasProperty(schema, 'not')) {
    return;
  }
  // --> BSN~
  // const condition = `${tpl.link(schema.not)}(${tpl.data})`;
  const condition = `${tpl.link(schema.not)}(${tpl.data}, params)`;
  // <-- BSN~
  const error = tpl.error('not');

  tpl(`if (!${condition}) ${error}`);
};
