module.exports = function type(schema, fn) {
    fn.data = fn.fieldType(schema.type);
};