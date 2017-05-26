module.exports = function oneOf(schema, fn) {
  if (!schema.hasOwnProperty('oneOf')) {
    return;
  }

  const fns = schema.oneOf.map(reference => fn.resolve(reference));
  const arr = fn.cache(`[${fns}]`);
  const cachedArr = fn.cache(`[${fns}]`);
  const iterator = fn.cache(`${cachedArr}.length - 1`);
  const cachedIterator = fn.cache(`${cachedArr}.length - 1`);
  const count = fn.cache('0');
  const cachedCount = fn.cache('0');

  fn(
    'for ($1, $3, $5; $4 >= 0 && $4 < $2.length; $4--) {',
    arr,
    cachedArr,
    iterator,
    cachedIterator,
    count
  )
    ('if(!%s[%s](%s))', cachedArr, cachedIterator, fn.data)
    ('%s++', cachedCount)
    ('}')
    ('if (%s !== 1)', cachedCount)
    (fn.error('oneOf'));
};
