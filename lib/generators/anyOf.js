// https://github.com/json-schema/json-schema/wiki/anyOf,-allOf,-oneOf,-not#allof
module.exports = function anyOf(schema, fn) {
    ['anyOf', 'oneOf'].forEach(function(property) {
        if (!Array.isArray(schema[property])) {
            return;
        }

        var subSchema = schema[property][0];
        var resolved = fn.resolve(subSchema);
        fn.extend(resolved);
    });
};