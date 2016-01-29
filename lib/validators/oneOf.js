module.exports = function oneOf(schema, fn) {
    if (!schema.hasOwnProperty('oneOf')) {
        return;
    }

    var fns = schema.oneOf.map(function(reference){
        return fn.resolve(reference);
    });

    // TODO i, arr, count
    fn('for (var arr = [%s], i = arr.length - 1, count = 0; i >= 0 && count < 2; i--) {', fns)
        ('if(arr[i](%s))', fn.data)
            ('count++')
    ('}')
    ('if (count !== 1)')
        (fn.error('oneOf'));
};