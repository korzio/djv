module.exports = function not(schema, fn) {
    if (!schema.hasOwnProperty('not')) {
        return;
    }

    var notSchema = JSON.parse(JSON.stringify(schema.not));
    notSchema.type = notSchema.type || 'object';

    if ('type' in notSchema) {
        var notTypes = [].concat(notSchema.type),
            notType = fn.types.find(function (type) {
                return !~notTypes.indexOf(type)
            });

        if(notType) {
            notSchema.type = notType;
            fn.data = fn.resolve(notSchema);
        }
    }
};