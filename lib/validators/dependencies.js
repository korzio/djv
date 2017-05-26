module.exports = function dependencies(schema, fn) {
  if (!schema.hasOwnProperty('dependencies')) {
    return;
  }

  for (const dependency in schema.dependencies) {
    fn('if (%s.hasOwnProperty("%s")) {', fn.data, dependency);
    if (Array.isArray(schema.dependencies[dependency]) || typeof schema.dependencies[dependency] === 'string') {
      [].concat(schema.dependencies[dependency]).forEach((property) => {
        fn('if (!%s.hasOwnProperty("%s"))', fn.data, property)(fn.error('dependencies'));
      });
    } else if (typeof schema.dependencies[dependency] === 'object') {
      fn.visit(schema.dependencies[dependency]);
    }
    fn('}');
  }
};
