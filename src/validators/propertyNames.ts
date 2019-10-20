const { hasProperty } = require('../utils');

module.exports = function propertyNames(schema, tpl) {
  if (!hasProperty(schema, 'propertyNames')) {
    return;
  }

  const fn = tpl.link(schema.propertyNames);
  const error = tpl.error('propertyNames');

  tpl(`if (Object.keys(${tpl.data}).some(${fn})) ${error}`);
};
