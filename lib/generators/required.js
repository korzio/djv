module.exports = function (schema, fn) {
    if (!Array.isArray(schema.required)) {
        return;
    }

    schema.required.forEach(function(name){
        fn.data[fn.data.length - 1][name] = fn.resolve(schema.properties[name]);
    });
};