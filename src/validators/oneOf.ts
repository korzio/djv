const { hasProperty } = require('../utils');

module.exports = function oneOf(schema, tpl) {
  if (!hasProperty(schema, 'oneOf')) {
    return;
  }

  const fns = schema.oneOf.map(reference => tpl.link(reference));
  const arr = tpl.cache(`[${fns}]`);
  const cachedArr = tpl.cache(`[${fns}]`);
  const index = tpl.cache(`${cachedArr}.length - 1`);
  const cachedIndex = tpl.cache(`${cachedArr}.length - 1`);
  const count = tpl.cache('0');
  const cachedCount = tpl.cache('0');
  const error = tpl.error('oneOf');

  tpl(`for (
    ${arr}, ${index}, ${count};
    ${cachedIndex} >= 0 && ${cachedIndex} < ${cachedArr}.length;
    ${cachedIndex}--) {
      if(!${cachedArr}[${cachedIndex}](${tpl.data})) ${cachedCount}++;
    }
    if (${cachedCount} !== 1) ${error}
  `);
};
