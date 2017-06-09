module.exports = function anyOf(schema, tpl) {
  if (!Object.prototype.hasOwnProperty.call(schema, 'anyOf')) {
    return;
  }

  const condition = schema.anyOf.map(reference => `${tpl.resolve(reference)}(%s)`).join(' && ');
  const error = tpl.error('anyOf');

  tpl(`if (${condition}) ${error}`, tpl.data);
};
