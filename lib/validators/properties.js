module.exports = function properties(schema, tpl) {
  if (!Object.prototype.hasOwnProperty.call(schema, 'properties') || typeof schema.properties !== 'object') {
    return;
  }

  Object.keys(schema.properties)
    .forEach((propertyKey) => {
      const propertySchema = schema.properties[propertyKey];
      if (!Object.keys(propertySchema).length) {
        return;
      }

      const isNotRequired = !schema.required || schema.required.indexOf(propertyKey) === -1;
      if (isNotRequired) {
        tpl(`if (%s.hasOwnProperty("${propertyKey}")) {`, tpl.data);
      }

      tpl.data.push(`['${propertyKey}']`);
      tpl.visit(propertySchema);
      tpl.data.pop();

      if (isNotRequired) {
        tpl('}');
      }
    });
};
