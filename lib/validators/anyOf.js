const { hasProperty } = require('../utils');

module.exports = function anyOf(schema, tpl) {
  if (!hasProperty(schema, 'anyOf')) {
    return;
  }

  const error = tpl.error('anyOf');
  const condition = schema.anyOf
    // --> BSN~
    // .map(reference => `${tpl.link(reference)}(${tpl.data})`)
    .map(reference => `${tpl.link(reference)}(${tpl.data}, params)`)
    // <-- BSN~
    .join(' && ');

  tpl(`if (${condition}) ${error}`);
};
