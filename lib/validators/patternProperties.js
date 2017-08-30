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
  tpl('if(typeof %s === \'object\' && !Array.isArray(%s)) {', tpl.data);

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

  tpl('for (%s in %s) {', property, tpl.data);
  if (hasAdditionalProperties && hasPatternProperties) {
    tpl(tpl.cache('false'));
  }

  if (hasPatternProperties) {
    Object.keys(schema.patternProperties)
      .forEach((propertyKey) => {
        const propertySchema = schema.patternProperties[propertyKey];

        tpl('if (%s.test(%s)) {', new RegExp(propertyKey), property);
        if (hasAdditionalProperties) {
          tpl(`${tpl.cache('false')} = true;`);
        }

        tpl.data.push(`[${property}]`);
        tpl.visit(propertySchema);
        tpl.data.pop();
        tpl('}');

        if (schema.properties) {
          tpl(`if (${hasAdditionalProperties ? `${tpl.cache('false')} || ` : ''} %s.properties.hasOwnProperty(${property})) continue;`, tpl.schema);
        } else if (hasAdditionalProperties) {
          tpl(`if (${tpl.cache('false')}) continue;`);
        }

        visitAdditionalProperties();
      });
  } else {
    if (schema.properties) {
      tpl(`if(%s.properties.hasOwnProperty(${property})) continue;`, tpl.schema);
    }
    visitAdditionalProperties();
  }

  tpl('}}');
};
