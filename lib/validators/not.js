module.exports = function not(schema, fn) {
  if (!Object.prototype.hasOwnProperty.call(schema, 'not')) {
    return;
  }

  fn(`if (!${fn.resolve(schema.not)}(%s))`, fn.data)(fn.error('not'));
};
