module.exports = function properties(schema, fn) {
  if (!schema.hasOwnProperty('properties')) {
    return;
  }

  for (const propertyKey in schema.properties) {
    const propertySchema = schema.properties[propertyKey];
    if (!Object.keys(propertySchema).length) {
      continue;
    }

    const isNotRequired = !schema.required || !~schema.required.indexOf(propertyKey);
    if (isNotRequired) {
      fn(`if (%s.hasOwnProperty("${propertyKey}")) {`, fn.data);
    }

    fn.data.push(`['${propertyKey}']`);
    fn.visit(propertySchema);
    fn.data.pop();

    if (isNotRequired) {
      fn('}');
    }
  }
};
