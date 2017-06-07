const formats = require('../utils/formats');
const { asExpression } = require('../utils');

module.exports = function property(schema, tpl) {
  if (typeof schema.format === 'undefined') {
    return;
  }

  const formatterExpression = asExpression(formats[schema.format], schema, tpl);
  if (!formatterExpression) {
    return;
  }

  tpl(`if (${formatterExpression}) ${tpl.error('format')}`, tpl.data);
};
