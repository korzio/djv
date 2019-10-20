const formats = require('../utils/formats');

module.exports = function format(schema, tpl) {
  if (typeof schema.format === 'undefined') {
    return;
  }

  const formatter = formats[schema.format];
  if (typeof formatter !== 'function') {
    return;
  }

  const { data } = tpl;
  const condition = formatter({ data, schema });
  const error = tpl.error('format');

  tpl(`if (${condition}) ${error}`);
};
