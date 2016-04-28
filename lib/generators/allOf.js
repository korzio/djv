// https://github.com/json-schema/json-schema/wiki/anyOf,-allOf,-oneOf,-not#allof
module.exports = function allOf(schema, fn) {
    if (!Array.isArray(schema.allOf)) {
        return;
    }

    schema.allOf.forEach(function(subSchema){
        var resolved = fn.resolve(subSchema);
        if(typeof resolved !== 'object' || resolved === null) {
            fn.data.unshift(resolved);
        } else {
            Object.assign(fn.data[fn.data.length - 1], resolved);
        }
    });
};