const { formats, properties, keywords } = require('../utils');

module.exports = function property(schema, fn) {
  Object.keys(schema)
      .forEach((key) => {
        if (keywords.indexOf(key) !== -1) {
          return;
        }

        if (key === 'format') {
          if (formats[schema[key]]) {
            fn(`if (${formats[schema[key]]})`, fn.data)(fn.error('format'));
          }
          return;
        }

        let validateStr = properties[key];
        if (!validateStr) {
          return;
        }

        if (typeof validateStr === 'function') {
          validateStr = validateStr(schema, fn);
        }

        fn(`if (${validateStr})`, fn.data, schema[key])(fn.error(key));
      });
};
