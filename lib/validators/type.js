const types = require('../utils/types');
const { hasProperty } = require('../utils');

module.exports = function type(schema, tpl) {
  if (!hasProperty(schema, 'type')) {
    return;
  }

  const error = tpl.error('type', schema.type);
  const condition = `(${[].concat(schema.type).map(key => types[key]).join(') && (')})`;

  tpl(`if (${condition}) ${error}`, tpl.data);
};
