const { hasProperty } = require('../utils');

module.exports = function not(schema, tpl) {
  if (!hasProperty(schema, 'not')) {
    return;
  }

  tpl(`if (!${tpl.resolve(schema.not)}(%s)) ${tpl.error('not')}`, tpl.data);
};
