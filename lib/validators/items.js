module.exports = function items(schema, fn) {
    if (!schema.items) {
        return;
    }

    if (Array.isArray(schema.items)) {
        if(schema.additionalItems === false) {
            fn('if (%s.length > %s)', fn.data, schema.items.length)
                (fn.error('additionalItems'));
        }

        schema.items.forEach(function(schema, index){
            fn.data.push('[' + index + ']');
            fn.visit(schema);
            fn.data.pop();
        });

        if (typeof schema.additionalItems === 'object') {
            fn('for ($1; $2 < $3.length; $2++) {', fn.cache(schema.items.length), fn.cache(schema.items.length), fn.data);
                fn.data.push('[' + fn.cache(schema.items.length) + ']');
                fn.visit(schema.additionalItems);
                fn.data.pop();
            fn('}');
        }
    } else {
        fn('for ($1; $2 < $3.length; $2++) {', fn.cache('0'), fn.cache('0'), fn.data);
            fn.data.push('[' + fn.cache('0') + ']');
            fn.visit(schema.items);
            fn.data.pop();
        fn('}');
    }
};