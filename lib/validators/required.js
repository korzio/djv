module.exports = function (schema, fn) {
    if (!Array.isArray(schema.required)) {
        return;
    }

    schema.required.forEach(function(name){
        fn('if (!%s.hasOwnProperty("%s"))', fn.data, name)
            (fn.error('required'))
    });
};