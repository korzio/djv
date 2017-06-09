module.exports = function $ref(schema, tpl) {
  if (!Object.prototype.hasOwnProperty.call(schema, '$ref')) {
    return;
  }

  const condition = `${tpl.resolve(schema.$ref)}(%s)`;
  const error = tpl.error('$ref');

  tpl(`if (${condition}) ${error}`, tpl.data);
};
