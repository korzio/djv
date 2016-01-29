module.exports = function not(schema, fn) {
    if (!schema.hasOwnProperty('not')) {
        return;
    }

    fn('if (!' + fn.resolve(schema.not) + '(%s))', fn.data)
        (fn.error('not'));
};