const { hasProperty } = require('../utils');

module.exports = function propertyNames(schema, tpl) {
  if (!hasProperty(schema, 'propertyNames')) {
    return;
  }

  const fn = tpl.resolve(schema.propertyNames);
  const error = tpl.error('propertyNames');

  tpl(`if(Object.keys(%s).some(${fn})) ${error}`, tpl.data);
};
