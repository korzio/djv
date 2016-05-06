module.exports = function type(schema, fn) {
    var type = schema.type;
    if(schema.type instanceof Array) {
        type = schema.type[0];
    }

    fn.data = fn.fieldType(type);
};