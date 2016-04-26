module.exports = function type(schema, fn) {
    fn.data.unshift(fn.fieldType(schema.type));
};