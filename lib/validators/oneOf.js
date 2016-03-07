module.exports = function oneOf(schema, fn) {
    if (!schema.hasOwnProperty('oneOf')) {
        return;
    }

    var fns = schema.oneOf.map(function(reference){
        return fn.resolve(reference);
    });

    var arr = fn.cache('[' + fns + ']'),
        cachedArr = fn.cache('[' + fns + ']'),
        iterator = fn.cache(cachedArr + '.length - 1'),
        cachedIterator = fn.cache(cachedArr + '.length - 1'),
        count = fn.cache('0'),
        cachedCount = fn.cache('0');

    fn(
        'for ($1, $3, $5; $4 >= 0 && $4 < $2.length; $4--) {',
        arr,
        cachedArr,
        iterator,
        cachedIterator,
        count
    )
        ('if(%s[%s](%s))', cachedArr, cachedIterator, fn.data)
            ('%s++', cachedCount)
    ('}')
    ('if (%s !== 1)', cachedCount)
        (fn.error('oneOf'));
};