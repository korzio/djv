// https://github.com/json-schema/json-schema/wiki/anyOf,-allOf,-oneOf,-not#allof
module.exports = function anyOf(schema, fn) {
    if (!Array.isArray(schema.anyOf)) {
        return;
    }

    var subSchema = schema.anyOf[0];
    var resolved = fn.resolve(subSchema);
    fn.extend(resolved);
};