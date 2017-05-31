module.exports = function property(schema, fn) {
  Object.keys(schema)
      .forEach((key) => {
        if (fn.keywords.indexOf(key) !== -1) {
          return;
        }

        if (key === 'format') {
          if (fn.fieldFormat[schema[key]]) {
            fn(`if (${fn.fieldFormat[schema[key]]})`, fn.data)(fn.error('format'));
          }
          return;
        }

        let validateStr = fn.fieldValidate[key];
        if (!validateStr) {
          return;
        }

        if (typeof validateStr === 'function') {
          validateStr = validateStr(schema, fn);
        }

        fn(`if (${validateStr})`, fn.data, schema[key])(fn.error(key));
      });
};
