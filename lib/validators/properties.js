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
        if(isNotRequired) {
            fn('if (%s.hasOwnProperty("' + propertyKey + '")) {', fn.data);
        }

        fn.data.push(propertyKey);
        fn.visit(propertySchema);
        fn.data.pop();

        if(isNotRequired) {
            fn('}');
        }
    }
};