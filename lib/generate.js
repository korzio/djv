var utils = require('./utils');

module.exports = function generate(env, schema, state) {
    // TODO refactor
    var tmpSchemaItem = { schema: schema };
    state = state || Object.assign({}, env.schema, { '#': tmpSchemaItem });

    Object.assign(fn, utils, {
        data: ['data'],
        schema: ['this.context.schema'],
        context: Object.assign([], utils, { schema: schema }),
        lines: [],
        error: function (errorType) {
            return 'return { "' + errorType + '": "' + fn.data + '" }';
        },
        resolve: function (url) {
            // TODO refactor
            if (!state['#']) {
                state['#'] = tmpSchemaItem;
            }

            var reference = utils.resolve(url, env.schema, state);
            if (typeof reference === 'object') {
                reference = fn.context.push(generate(env, reference, state).toFunction());
                // TODO refactor
                state['#'] = tmpSchemaItem;
            } else if (typeof reference === 'function') {
                reference = fn.context.push(reference);
            }

            return {
                toString: function () {
                    return 'this.context["' + reference + '"]';
                }
            };
        },
        toFunction: function () {
            var src = fn.lines.join('\n');
            // console.log('function(data){\n' + src + '\n}');

            var generatedFn = new Function('data', src).bind(fn);

            fn.context.unshift(generatedFn);
            if (typeof schema.id === 'string') {
                fn.context[schema.id] = generatedFn;
            }

            return generatedFn;
        },
        cached: [], cachedIndex: 0,
        cache: function (expression) {
            var layer = fn.cached[fn.cached.length - 1];

            if (layer[expression]) {
                return 'i' + layer[expression];
            } else {
                layer[expression] = ++fn.cachedIndex;
                return '(i' + layer[expression] + ' = ' + expression + ')';
            }

            // TODO when it is unknown whether if will be executed
            return '(%i = %i || ' + expression + ')';
        },
        visit: function (schema) {
            fn.cached.push({});

            [
                'required',
                'property',
                'type',
                '$ref',
                'not',
                'anyOf',
                'oneOf',
                'allOf',
                'dependencies',
                'properties',
                'patternProperties',
                'items'
            ].forEach(function (validator) {
                require('./validators/' + validator)(schema, fn);
            });

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