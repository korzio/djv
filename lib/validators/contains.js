const { hasProperty } = require('../utils');

module.exports = function contains(schema, tpl) {
  if (!hasProperty(schema, 'contains')) {
    return;
  }

  const error = tpl.error('contains');
  const fn = `${tpl.link(schema.contains)}`;

  const { data } = tpl;
  const zeroIndex = tpl.cache('0');
  const index = tpl.cache('0');
  const dataAtIndex = data.toString.apply(data.concat(`[${index}]`));

  tpl(`if (Array.isArray(${data})) {
    if (${data}.length === 0) ${error}
      for (${zeroIndex}; ${index} < ${data}.length; ${index}++) {
        if (!${fn}(${dataAtIndex})) break;
        if (${index} === ${data}.length - 1) ${error}
      }
  }`);
};
