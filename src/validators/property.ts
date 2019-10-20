const properties = require('../utils/properties');
const keywords = require('../utils/keywords');
const { asExpression } = require('../utils');

module.exports = function property(schema, tpl) {
  Object.keys(schema)
    .forEach((key) => {
      if (keywords.indexOf(key) !== -1 || key === 'format') {
        return;
      }

      const condition = asExpression(properties[key], schema, tpl);
      if (!condition) {
        return;
      }
      const error = tpl.error(key);

      tpl(`if (${condition}) ${error}`, tpl.data, schema[key]);
    });
};
