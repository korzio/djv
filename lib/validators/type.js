const { types } = require('../utils');

module.exports = function type(schema, fn) {
  if (!Object.prototype.hasOwnProperty.call(schema, 'type')) {
    return;
  }

  if (typeof schema.type === 'string') {
    fn(`if (${types[schema.type]})`, fn.data)(fn.error('type', schema.type));
  } else if (Array.isArray(schema.type)) {
    fn(`if ((${schema.type.map(key => types[key]).join(') && (')}))`, fn.data)(fn.error('type', schema.type));
  }
};
