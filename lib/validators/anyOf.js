module.exports = function anyOf(schema, fn) {
  if (!Object.prototype.hasOwnProperty.call(schema, 'anyOf')) {
    return;
  }

  fn(`if (${schema.anyOf.map(reference => `${fn.resolve(reference)}(%s)`).join(' && ')})`, fn.data)(fn.error('anyOf'));
};
