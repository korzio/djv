module.exports = function (schema, fn) {
    if (!Array.isArray(schema.required)) {
        return;
    }

    schema.required.forEach(function(name){
        var resolved;

        if('patternProperties' in schema) {
            // http://tools.ietf.org/html/draft-zyp-json-schema-03#section-5.3
            for(var propertyKey in schema.patternProperties) {
                if(new RegExp(propertyKey).test(name)) {
                    resolved = fn.resolve(schema.patternProperties[propertyKey]);
                    break;
                }
            }
        }

        if(typeof resolved === 'undefined') {
            resolved = fn.resolve(schema.properties && schema.properties[name]);
        }

        fn.data[name] = resolved;
    });
};