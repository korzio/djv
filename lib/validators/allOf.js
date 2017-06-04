module.exports = function allOf(schema, tpl) {
  if (!Object.prototype.hasOwnProperty.call(schema, 'allOf')) {
    return;
  }

  tpl('if (')(schema.allOf.map(reference => tpl.resolve(reference))
    .join('(%s) || '), tpl.data)('(%s))', tpl.data)(tpl.error('allOf'));
};
