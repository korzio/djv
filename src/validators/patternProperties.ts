const { hasProperty } = require('../utils');

module.exports = function patternProperties(schema, tpl) {
  const hasAdditionalProperties = hasProperty(schema, 'additionalProperties') && schema.additionalProperties !== true;
  const hasPatternProperties = hasProperty(schema, 'patternProperties');

  if (!hasAdditionalProperties && !hasPatternProperties) {
    return;
  }

  // When the instance value is an object,
  // the property values of the instance object
  // MUST conform to the property definitions in this object.
  tpl(`if(typeof ${tpl.data} === 'object' && !Array.isArray(${tpl.data})) {`);

  tpl(tpl.cache('null'));
  const property = tpl.cache('null');
  const visitAdditionalProperties = () => {
    if (schema.additionalProperties === false) {
      tpl(tpl.error('additionalProperties'));
    } else if (schema.additionalProperties) {
      tpl.data.push(`[${property}]`);
      tpl.visit(schema.additionalProperties);
      tpl.data.pop();
    }
  };

  tpl(`for (${property} in ${tpl.data}) {`);
  if (hasAdditionalProperties && hasPatternProperties) {
    tpl(tpl.cache('false'));
  }

  if (hasPatternProperties) {
    Object.keys(schema.patternProperties)
      .forEach((propertyKey) => {
        tpl(`if (${new RegExp(propertyKey)}.test(${property})) {`);
        if (hasAdditionalProperties) {
          tpl(`${tpl.cache('false')} = true;`);
        }

        const propertySchema = schema.patternProperties[propertyKey];
        tpl.data.push(`[${property}]`);
        tpl.visit(propertySchema);
        tpl.data.pop();
        tpl('}');

        if (schema.properties) {
          tpl(`if (${hasAdditionalProperties ? `${tpl.cache('false')} || ` : ''} ${tpl.schema}.properties.hasOwnProperty(${property})) continue;`);
        } else if (hasAdditionalProperties) {
          tpl(`if (${tpl.cache('false')}) continue;`);
        }

        visitAdditionalProperties();
      });
  } else {
    if (schema.properties) {
      tpl(`if(${tpl.schema}.properties.hasOwnProperty(${property})) continue;`);
    }
    visitAdditionalProperties();
  }

  tpl('}}');
};
