module.exports = function dependencies(schema, fn) {
  if (!Object.prototype.hasOwnProperty.call(schema, 'dependencies')) {
    return;
  }

  Object.keys(schema.dependencies)
    .forEach((dependency) => {
      fn('if (%s.hasOwnProperty("%s")) {', fn.data, dependency);
      if (Array.isArray(schema.dependencies[dependency]) || typeof schema.dependencies[dependency] === 'string') {
        [].concat(schema.dependencies[dependency]).forEach((property) => {
          fn('if (!%s.hasOwnProperty("%s"))', fn.data, property)(fn.error('dependencies'));
        });
      } else if (typeof schema.dependencies[dependency] === 'object') {
        fn.visit(schema.dependencies[dependency]);
      }
      fn('}');
    });
};
