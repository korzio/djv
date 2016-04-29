module.exports = function items(schema, fn) {
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