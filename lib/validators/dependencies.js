module.exports = function dependencies(schema, tpl) {
  if (!Object.prototype.hasOwnProperty.call(schema, 'dependencies')) {
    return;
  }

  Object.keys(schema.dependencies)
    .forEach((dependency) => {
      tpl('if (%s.hasOwnProperty("%s")) {', tpl.data, dependency);
      if (Array.isArray(schema.dependencies[dependency]) || typeof schema.dependencies[dependency] === 'string') {
        [].concat(schema.dependencies[dependency]).forEach((property) => {
          tpl('if (!%s.hasOwnProperty("%s"))', tpl.data, property)(tpl.error('dependencies'));
        });
      } else if (typeof schema.dependencies[dependency] === 'object') {
        tpl.visit(schema.dependencies[dependency]);
      }
      tpl('}');
    });
};
