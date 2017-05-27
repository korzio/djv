module.exports = function patternProperties(schema, fn) {
  const hasAdditionalProperties = Object.prototype.hasOwnProperty.call(schema, 'additionalProperties') && schema.additionalProperties !== true;
  const hasPatternProperties = Object.prototype.hasOwnProperty.call(schema, 'patternProperties');

  if (!hasAdditionalProperties && !hasPatternProperties) {
    return;
  }

  // When the instance value is an object,
  // the property values of the instance object
  // MUST conform to the property definitions in this object.
  fn('if(!Array.isArray(%s)) {', fn.data);

  fn(fn.cache('null'));
  const property = fn.cache('null');
  const visitAdditionalProperties = () => {
    if (schema.additionalProperties === false) {
      fn(fn.error('additionalProperties'));
    } else if (schema.additionalProperties) {
      fn.data.push(`[${property}]`);
      fn.visit(schema.additionalProperties);
      fn.data.pop();
    }
  };

  fn('for (%s in %s) {', property, fn.data);
  if (hasAdditionalProperties && hasPatternProperties) {
    fn(fn.cache('false'));
  }

  if (hasPatternProperties) {
    Object.keys(schema.patternProperties)
      .forEach((propertyKey) => {
        const propertySchema = schema.patternProperties[propertyKey];

        fn('if (%s.test(%s)) {', new RegExp(propertyKey), property);
        if (hasAdditionalProperties) {
          fn(`${fn.cache('false')} = true;`);
        }

        fn.data.push(`[${property}]`);
        fn.visit(propertySchema);
        fn.data.pop();
        fn('}');

        if (schema.properties) {
          fn(`if (${hasAdditionalProperties ? `${fn.cache('false')} || ` : ''} %s.properties.hasOwnProperty(${property})) continue;`, fn.schema);
        } else if (hasAdditionalProperties) {
          fn(`if (${fn.cache('false')}) continue;`);
        }

        visitAdditionalProperties();
      });
  } else {
    if (schema.properties) {
      fn(`if(%s.properties.hasOwnProperty(${property})) continue;`, fn.schema);
    }
    visitAdditionalProperties();
  }

  fn('}}');
};
