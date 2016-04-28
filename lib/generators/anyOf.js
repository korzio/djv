// https://github.com/json-schema/json-schema/wiki/anyOf,-allOf,-oneOf,-not#allof
module.exports = function anyOf(schema, fn) {
    if (!Array.isArray(schema.anyOf)) {
        return;
    }

    var subSchema = schema.anyOf[0];
    var resolved = fn.resolve(subSchema);
    if(typeof resolved !== 'object' || resolved === null) {
        fn.data.unshift(resolved);
    } else {
        Object.assign(fn.data[fn.data.length - 1], resolved);
    }
};