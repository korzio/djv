const keywords = require('./../utils').keywords;

module.exports = function property(schema, fn) {
  for (const key in schema) {
    if (!~keywords.indexOf(key)) {
      if (key === 'format') {
        if (fn.fieldFormat[schema[key]]) {
          fn(`if (${fn.fieldFormat[schema[key]]})`, fn.data)(fn.error('format'));
        }
      } else {
        let validateStr = fn.fieldValidate[key];
        if (!validateStr) {
          return;
        }

        if (typeof validateStr === 'function') {
          validateStr = validateStr(schema, fn);
        }

        fn(`if (${validateStr})`, fn.data, schema[key])(fn.error(key));
      }
    }
  }
};
