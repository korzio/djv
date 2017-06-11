const types = require('../utils/types');

module.exports = function type(schema, tpl) {
  if (!Object.prototype.hasOwnProperty.call(schema, 'type')) {
    return;
  }

  const error = tpl.error('type');
  const condition = `(${[].concat(schema.type).map(key => types[key]).join(') && (')})`;

  tpl(`if (${condition}) ${error}`, tpl.data);
};
