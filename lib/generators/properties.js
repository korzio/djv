module.exports = function properties(schema, fn) {
    if(!schema.hasOwnProperty('patternProperties')) {
        return;
    }

    for (var propertyKey in schema.patternProperties) {
    }
}