const { hasProperty } = require('../utils');
const { is: isSchema } = require('../utils/schema');

module.exports = function dependencies(schema, tpl) {
  if (!hasProperty(schema, 'dependencies')) {
    return;
  }

  Object.keys(schema.dependencies)
    .forEach((dependency) => {
      tpl('if (%s.hasOwnProperty("%s")) {', tpl.data, dependency);
      if (Array.isArray(schema.dependencies[dependency]) || typeof schema.dependencies[dependency] === 'string') {
        [].concat(schema.dependencies[dependency]).forEach((property) => {
          tpl('if (!%s.hasOwnProperty("%s"))', tpl.data, property)(tpl.error('dependencies'));
        });
      } else if (isSchema(schema.dependencies[dependency])) {
        tpl.visit(schema.dependencies[dependency]);
      }
      tpl('}');
    });
};
