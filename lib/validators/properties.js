module.exports = function properties(schema, fn) {
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
          fn(`if (%s.hasOwnProperty("${propertyKey}")) {`, fn.data);
        }

        fn.data.push(`['${propertyKey}']`);
        fn.visit(propertySchema);
        fn.data.pop();

        if (isNotRequired) {
          fn('}');
        }
      });
};
