module.exports = function $ref(schema, fn) {
  if (!schema.hasOwnProperty('$ref')) {
    return;
  }

  fn(`if (${fn.resolve(schema.$ref)}(%s))`, fn.data)(fn.error('$ref'));
};
