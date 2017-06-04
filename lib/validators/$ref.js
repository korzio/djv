module.exports = function $ref(schema, tpl) {
  if (!Object.prototype.hasOwnProperty.call(schema, '$ref')) {
    return;
  }

  tpl(`if (${tpl.resolve(schema.$ref)}(%s))`, tpl.data)
    .push(tpl.error('$ref'));
};
