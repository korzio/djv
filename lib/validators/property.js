const properties = require('../utils/properties');
const keywords = require('../utils/keywords');
const { asExpression } = require('../utils');

module.exports = function property(schema, tpl) {
  Object.keys(schema)
    .forEach((key) => {
      if (keywords.indexOf(key) !== -1 || key === 'format') {
        return;
      }

      const propertyExpression = asExpression(properties[key], schema, tpl);
      if (!propertyExpression) {
        return;
      }

      tpl(`if (${propertyExpression}) ${tpl.error(key)}`, tpl.data, schema[key]);
    });
};
