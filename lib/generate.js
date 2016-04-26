var utils = require('./utils');
var fs = require('fs');

module.exports = function generate(env, schema, state) {
    state = state || Object.assign([schema], { current: [0] }, env.resolved);

    Object.assign(fn, utils, {
        data: [],
        schema: ['schema'],
        context: Object.assign([], { schema: schema }),
        lines: [],
        error: function (errorType) {
            return 'return "' + errorType + ': ' + fn.data + '"';
        },
        resolve: function (url) {
            var changedState = state.length;
            var reference = utils.resolve(url, state);
            changedState = changedState !== state.length;

            if (typeof reference === 'object') {
                reference = fn.context.push(generate(env, reference, state).toObject());

                if (changedState) {
                    state.splice(state.current.pop(), state.length);
                }
            }

            return fn.context[fn.context.length - 1];
        },
        toObject: function () {
            return fn.data[0];
        },
        cachedIndex: 0,
        cached: [],
        cache: function (expression) {
            var layer = fn.cached[fn.cached.length - 1];

            if (layer[expression]) {
                return 'i' + layer[expression];
            }

            layer[expression] = ++fn.cachedIndex;
            return '(i' + layer[expression] + ' = ' + expression + ')';
        },
        visit: function (schema) {
            fn.cached.push({});
            state.push(schema);

            ['type', 'required', 'property']
                .forEach(file => require('./generators/' + file)(schema, fn));

            fn.cached.pop();
        },
        push: fn
    });

    fn.data.toString = fn.schema.toString = function () {
        return this.join('.').replace(/\.\[/g, '[');
    };

    fn.visit(schema);
    return fn;

    //
    function fn(expression) {
        var args = Array.prototype.slice.call(arguments, 1),
            last;

        fn.lines.push(
            expression
                .replace(/%i/g, function (match, index) {
                    return 'i';
                })
                .replace(/\$(\d)/g, function (match, index) {
                    return '' + args[index - 1];
                })
                .replace(/(%[sd])/g, function (match) {
                    if (args.length) {
                        last = args.shift();
                    }

                    return '' + last;
                })
        );

        return fn.push;
    }
};