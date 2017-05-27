module.exports = function allOf(schema, fn) {
  if (!Object.prototype.hasOwnProperty.call(schema, 'allOf')) {
    return;
  }

  fn('if (')(schema.allOf.map(reference => fn.resolve(reference))
    .join('(%s) || '), fn.data)('(%s))', fn.data)(fn.error('allOf'));
};
