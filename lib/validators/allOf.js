module.exports = function allOf(schema, fn) {
  if (!schema.hasOwnProperty('allOf')) {
    return;
  }

  fn('if (')(schema.allOf.map(reference => fn.resolve(reference))
    .join('(%s) || '), fn.data)
    ('(%s))', fn.data)
    (fn.error('allOf'));
};
