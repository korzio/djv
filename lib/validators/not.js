module.exports = function not(schema, tpl) {
  if (!Object.prototype.hasOwnProperty.call(schema, 'not')) {
    return;
  }

  tpl(`if (!${tpl.resolve(schema.not)}(%s)) ${tpl.error('not')}`, tpl.data);
};
