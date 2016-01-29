module.exports = function properties(schema, fn) {
    if(!schema.hasOwnProperty('properties')) {
        return;
    }

    for(var propertyKey in schema.properties) {
        var propertySchema = schema.properties[propertyKey];
        if(!Object.keys(propertySchema).length) {
            continue;
        }

        var isNotRequired = !schema.required || !~schema.required.indexOf(propertyKey);

        fn.data.push(propertyKey);
        if(isNotRequired) {
            fn('if (%s) {', fn.data);
        }
        fn.visit(propertySchema);
        if(isNotRequired) {
            fn('}');
        }

        fn.data.pop();
    }
};