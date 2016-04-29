module.exports = function type(schema, fn) {
    if (!('default' in schema)) {
        return;
    }

    fn.data = schema.default;
};