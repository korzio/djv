const { hasProperty } = require('../utils');
const { is: isSchema } = require('../utils/schema');

// @see http://json-schema.org/latest/json-schema-validation.html#rfc.section.6.5.7
module.exports = function dependencies(schema, tpl) {
  if (!hasProperty(schema, 'dependencies')) {
    return;
  }

  Object.keys(schema.dependencies)
    .forEach((dependency) => {
      const value = schema.dependencies[dependency];
      const error = tpl.error('dependencies');

      tpl(`if (${tpl.data}.hasOwnProperty(decodeURIComponent("${escape(dependency)}"))) {`);
      if (Array.isArray(value) || typeof value === 'string') {
        [...value]
          .map(property => `if (!${tpl.data}.hasOwnProperty(decodeURIComponent("${escape(property)}"))) ${error}`)
          .map(tpl);
      } else if (isSchema(value)) {
        tpl.visit(value);
      }
      tpl('}');
    });
};
