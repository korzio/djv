module.exports = function items(schema, fn) {
    if (schema.minItems === 0) {
        fn.data = [];
        return;
    }
    if (!('items' in schema)) {
        return;
    }

    if (Array.isArray(schema.items)) {
        fn.data = schema.items.map(function(subSchema){
            return fn.resolve(subSchema);
        })
    } else {
        fn.data = [fn.resolve(schema.items)];
    }
};
