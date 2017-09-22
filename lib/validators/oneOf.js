const { hasProperty } = require('../utils');

module.exports = function oneOf(schema, tpl) {
  if (!hasProperty(schema, 'oneOf')) {
    return;
  }

  const fns = schema.oneOf.map(reference => tpl.link(reference));
  const arr = tpl.cache(`[${fns}]`);
  const cachedArr = tpl.cache(`[${fns}]`);
  const iterator = tpl.cache(`${cachedArr}.length - 1`);
  const cachedIterator = tpl.cache(`${cachedArr}.length - 1`);
  const count = tpl.cache('0');
  const cachedCount = tpl.cache('0');

  tpl(
    'for ($1, $3, $5; $4 >= 0 && $4 < $2.length; $4--) {',
    arr,
    cachedArr,
    iterator,
    cachedIterator,
    count
  )('if(!%s[%s](%s))', cachedArr, cachedIterator, tpl.data)('%s++', cachedCount)('}')('if (%s !== 1)', cachedCount)(tpl.error('oneOf'));
};
