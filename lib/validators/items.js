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
            fn('for (var i = %s; i < %s.length; i++) {', schema.items.length, fn.data);
                fn.data.push('[i]');
                fn.visit(schema.additionalItems);
                fn.data.pop();
            fn('}');
        }
    } else {
        fn('for (var i = 0; i < %s.length; i++) {', fn.data);
        fn.data.push('[i]');
        fn.visit(schema.items);
        fn.data.pop();
        fn('}');
    }
};