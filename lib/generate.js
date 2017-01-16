var utils = require('./utils');

module.exports = function generate(env, schema, state) {
    state = state || Object.assign([schema], { current: [0], context: [] }, env.resolved);

    Object.assign(fn, utils, {
        data: ['data'],
        schema: ['schema'],
        lines: [],
        error: function (errorType) {
            return 'return "' + errorType + ': ' + fn.data + '";';
        },
        resolve: function (url) {
            var changedState = state.length;
            var reference = utils.resolve(url, state);
            changedState = changedState !== state.length;

            if (typeof reference === 'object') {
                reference = state.context.push(generate(env, reference, state).toFunction(true));

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
        toFunction: function (isInner) {
            var dynamicVariables = !fn.cachedIndex ? '' : 'var i' + new Array(fn.cachedIndex).join('_').split('_').map(function(value, i){ return i + 1; }).join(',i') + ';';
            var dynamicFunctions = '';

            if(!isInner && state.context.length) {
                dynamicFunctions = 'var f' + state.context.map(function(value, i){
                    return i + 1 + '=' + state.context[i].toString();
                }).join(',f') + ';';
            }

            var src = dynamicFunctions + 'return function f0(data){"use strict";' + dynamicVariables + fn.lines.join('\n') + '}';
            var generatedFn = new Function('schema', src)(schema);

            if(!isInner) {
                generatedFn.toString = function(){
                    return src;
                };
            }

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