module.exports = function type(schema, fn) {
  if (!schema.hasOwnProperty('type')) {
    return;
  }

  if (typeof schema.type === 'string') {
    fn(`if (${fn.fieldType[schema.type]})`, fn.data)(fn.error('type', schema.type));
  } else if (Array.isArray(schema.type)) {
    fn(`if ((${schema.type.map(key => fn.fieldType[key]).join(') && (')}))`, fn.data)
      (fn.error('type', schema.type));
  }
};
