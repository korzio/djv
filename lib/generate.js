var utils = require('./utils');

var Measured = require('measured');

module.exports = function generate(env, schema, state) {
    state = state || Object.assign([schema], { current: [0] }, env.resolved);

    Object.assign(fn, utils, {
        data: ['data'],
        schema: ['schema'],
        context: Object.assign([], utils, { schema: schema }),
        lines: [],
        error: function (errorType) {
            return 'return "' + errorType + ': ' + fn.data + '";';
        },
        resolve: function (url) {
            var changedState = state.length;
            var reference = utils.resolve(url, state);
            changedState = changedState !== state.length;

            if (typeof reference === 'object') {
                env.stats.generatedFunctionsUsed.inc();
                if(!~JSON.stringify(reference).indexOf('$ref')) {
                    env.stats.generatedNonRefFunctions.inc();
                }

                reference = fn.context.push(generate(env, reference, state).toFunction());

                if(changedState) {
                    state.splice(state.current.pop(), state.length);
                }
            }

            return {
                toString: function () {
                    return 'f' + reference;
                }
            };
        },
        toFunction: function () {
            var dynamicVariables = !fn.cachedIndex ? '' : 'var i' + new Array(fn.cachedIndex).join('_').split('_').map(function(value, i){ return i + 1; }).join(',i') + ';';
            var dynamicFunctions = !fn.context.length ? '' : 'var f' + new Array(fn.context.length).join('_').split('_').map(function(value, i){
                return i + 1 + '=' + fn.context[i].toString();
            }).join(',f') + ';';

            var src = '"use strict";' + dynamicFunctions + dynamicVariables + fn.lines.join('\n');

            var generatedFn = new Function('schema', 'return function f0(data){' + src + '}')(schema);

            generatedFn.schema = schema;

            return generatedFn;
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
                var _validator = env.stats.visitsKey;
                env.stats.visitsKey = validator;
                require('./validators/' + validator)(schema, fn);
                env.stats.visitsKey = _validator;
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

        env.stats.expressionEvaluated.inc();
        if(!env.stats.expressions[expression]) {
            env.stats.expressions[expression] = new Measured.Counter();
        }
        env.stats.expressions[expression].inc();

        if(env.stats.visitsKey) {
            if(!env.stats.visits[env.stats.visitsKey]) {
                env.stats.visits[env.stats.visitsKey] = new Measured.Counter();
            }
            env.stats.visits[env.stats.visitsKey].inc();
            delete env.stats.visitsKey;
        }

        return fn.push;
    }
};