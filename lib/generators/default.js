module.exports = function type(schema, fn) {
    if (!('default' in schema)) {
        return;
    }

    fn.data.unshift(schema.default);
};