const { hasProperty } = require('../utils');

module.exports = function $ref(schema, tpl) {
  if (!hasProperty(schema, '$ref')) {
    return false;
  }
  // --> BSN~
  // const condition = `${tpl.link(schema.$ref)}(${tpl.data})`;
  const condition = `${tpl.link(schema.$ref)}(${tpl.data}, params)`;
  // <-- BSN~
  const error = tpl.error('$ref');
  tpl(`if (${condition}) ${error}`);
  // All other properties in a "$ref" object MUST be ignored.
  // @see https://tools.ietf.org/html/draft-wright-json-schema-01#section-8
  return true;
};
