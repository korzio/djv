var utils = require('./utils');

module.exports = function generate(env, schema, state) {
    state = state || Object.assign([schema], { current: [0] }, env.resolved);

    Object.assign(fn, utils, {
        data: {},
        schema: ['schema'],
        context: Object.assign([], { schema: schema }),
        resolve: function (url) {
            var changedState = state.length;
            var reference = utils.resolve(url, state) || {};

            changedState = changedState !== state.length;

            if (typeof reference === 'object') {
                reference = fn.context.push(generate(env, reference, state).data);

                if (changedState) {
                    state.splice(state.current.pop(), state.length);
                }
            }

            return fn.context[fn.context.length - 1];
        },
        visit: function (schema) {
            state.push(schema);
            [
                'type',
                'required',
                'property',
                'default',
                'allOf',
                'anyOf',
                'items',
                '$ref',
                'dependencies'
            ]
            .forEach(file => require('./generators/' + file)(schema, fn));
        },
        extend: function(resolved){
            if(typeof resolved !== 'object' || resolved === null) {
                fn.data = resolved;
            } else {
                Object.assign(fn.data, resolved);
            }
        },
        push: fn
    });

    fn.visit(schema);
    return fn;

    //
    function fn(expression) {}
};