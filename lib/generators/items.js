module.exports = function items(schema, fn) {
    if (!('items' in schema)) {
        return;
    }

    if (Array.isArray(schema.items)) {
        fn.data.unshift(schema.items.map(function(subSchema){
            return fn.resolve(subSchema);
        }))
    } else {
        fn.data.unshift([fn.resolve(schema.items)]);
    }
};