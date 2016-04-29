var keywords = require('./../utils').keywords;

module.exports = function property(schema, fn) {
	for (var key in schema) {
		if (!~keywords.indexOf(key)) {
			if (key === 'format') {
                if(fn.fieldFormat[schema[key]]) {
                    fn('if (' + fn.fieldFormat[schema[key]] + ')', fn.data)
                        (fn.error('format'));
                }
			} else {
                var validateStr = fn.fieldValidate[key];
                if(!validateStr) {
                    return;
                }

                if(typeof validateStr === 'function') {
                    validateStr = validateStr(schema, fn);
                }

                // http://tools.ietf.org/html/draft-zyp-json-schema-03#section-5.1
                // priority to fieldValidate
                fn.data = validateStr;
			}
		}
	}
};