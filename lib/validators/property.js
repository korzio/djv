const formats = require('../utils/formats');
const properties = require('../utils/properties');
const keywords = require('../utils/keywords');

module.exports = function property(schema, tpl) {
  Object.keys(schema)
      .forEach((key) => {
        if (keywords.indexOf(key) !== -1) {
          return;
        }

        if (key === 'format') {
          if (formats[schema[key]]) {
            tpl(`if (${formats[schema[key]]})`, tpl.data)
              .push(tpl.error('format'));
          }
          return;
        }

        let validateStr = properties[key];
        if (!validateStr) {
          return;
        }

        if (typeof validateStr === 'function') {
          validateStr = validateStr(schema, tpl);
        }

        tpl(`if (${validateStr})`, tpl.data, schema[key])
          .push(tpl.error(key));
      });
};
