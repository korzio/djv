// https://github.com/json-schema/json-schema/wiki/anyOf,-allOf,-oneOf,-not#allof
module.exports = function allOf(schema, fn) {
    if (!Array.isArray(schema.allOf)) {
        return;
    }

    schema.allOf.forEach(function(subSchema){
        Object.assign(fn.data[fn.data.length - 1], fn.resolve(subSchema));
    });
};