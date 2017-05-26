module.exports = function anyOf(schema, fn) {
  if (!schema.hasOwnProperty('anyOf')) {
    return;
  }

  fn(`if (${schema.anyOf.map(reference => `${fn.resolve(reference)}(%s)`).join(' && ')})`, fn.data)
    (fn.error('anyOf'));
};
