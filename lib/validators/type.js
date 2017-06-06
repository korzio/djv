const types = require('../utils/types');

module.exports = function type(schema, tpl) {
  if (!Object.prototype.hasOwnProperty.call(schema, 'type')) {
    return;
  }

  if (typeof schema.type === 'string') {
    tpl(`if (${types[schema.type]})`, tpl.data)
      .push(tpl.error('type', schema.type));
  } else if (Array.isArray(schema.type)) {
    tpl(`if ((${schema.type.map(key => types[key]).join(') && (')}))`, tpl.data)
      .push(tpl.error('type', schema.type));
  }
};
