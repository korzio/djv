module.exports = function allOf(schema, fn) {
    if (!schema.hasOwnProperty('$ref')) {
        return;
    }

    var resolved = fn.resolve(schema.$ref);
    fn.data = resolved;
};