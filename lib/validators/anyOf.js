module.exports = function anyOf(schema, tpl) {
  if (!Object.prototype.hasOwnProperty.call(schema, 'anyOf')) {
    return;
  }

  tpl(`if (${schema.anyOf.map(reference => `${tpl.resolve(reference)}(%s)`).join(' && ')})`, tpl.data)
    .push(tpl.error('anyOf'));
};
