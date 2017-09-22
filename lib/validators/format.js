const formats = require('../utils/formats');
const { asExpression } = require('../utils');

module.exports = function format(schema, tpl) {
  if (typeof schema.format === 'undefined') {
    return;
  }

  const condition = asExpression(formats[schema.format], schema, tpl);
  if (!condition) {
    return;
  }
  const error = tpl.error('format');

  tpl(`if (${condition}) ${error}`, tpl.data);
};
