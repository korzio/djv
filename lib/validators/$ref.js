module.exports = function $ref(schema, fn) {
  if (!Object.prototype.hasOwnProperty.call(schema, '$ref')) {
    return;
  }

  fn(`if (${fn.resolve(schema.$ref)}(%s))`, fn.data)(fn.error('$ref'));
};
