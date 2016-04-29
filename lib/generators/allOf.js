// https://github.com/json-schema/json-schema/wiki/anyOf,-allOf,-oneOf,-not#allof
module.exports = function allOf(schema, fn) {
    if (!Array.isArray(schema.allOf)) {
        return;
    }

    schema.allOf.forEach(function(subSchema){
        var resolved = fn.resolve(subSchema);
        fn.extend(resolved);
    });
};