module.exports = function properties(schema, fn) {
    var hasAdditionalProperties = schema.hasOwnProperty('additionalProperties') && schema.additionalProperties !== true,
        hasPatternProperties = schema.hasOwnProperty('patternProperties');

    if (!hasAdditionalProperties && !hasPatternProperties) {
        return;
    }

    // When the instance value is an object, the property values of the instance object MUST conform to the property definitions in this object.
    fn('if(!Array.isArray(%s))', fn.data)
    
    // TODO property, matched to dynamic
    fn('for (var property in %s) {', fn.data);
    if (hasAdditionalProperties && hasPatternProperties) {
        fn(fn.cache('false'));
    }

    if (hasPatternProperties) {
        for (var propertyKey in schema.patternProperties) {
            var propertySchema = schema.patternProperties[propertyKey];

            fn('if (%s.test(property)) {', new RegExp(propertyKey), fn.data);
            if (hasAdditionalProperties) {
                fn(fn.cache('false') + ' = true;');
            }

            fn.data.push('[property]');
            fn.visit(propertySchema);
            fn.data.pop();
            fn('}');

            if(schema.properties) {
                fn('if(' +  (hasAdditionalProperties ? fn.cache('false') + ' || ' : '') + ' %s.properties[property]) continue;', fn.schema);
            } else if(hasAdditionalProperties){
                fn('if(' + fn.cache('false') + ') continue;');
            }

            visitAdditionalProperties();
        }
    } else {
        if(schema.properties) {
            fn('if(%s.properties[property]) continue;', fn.schema);
        }
        visitAdditionalProperties();
    }

    fn('}');

    //
    function visitAdditionalProperties() {
        if (schema.additionalProperties === false) {
            fn(fn.error('additionalProperties'));
        } else if (schema.additionalProperties) {
            fn.data.push('[property]');
            fn.visit(schema.additionalProperties);
            fn.data.pop();
        }
    }
};