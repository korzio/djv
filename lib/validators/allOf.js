const { hasProperty } = require('../utils');

module.exports = function allOf(schema, tpl) {
  if (!hasProperty(schema, 'allOf')) {
    return;
  }

  const error = tpl.error('allOf');
  const condition = schema.allOf
    // --> BSN~
    // .map(reference => `${tpl.link(reference)}(${tpl.data})`)
    .map(reference => `${tpl.link(reference)}(${tpl.data}, params)`)
    // <-- BSN~
    .join(' || ');

  tpl(`if (${condition}) ${error}`);
};
