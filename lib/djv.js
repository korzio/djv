var generate = require('./generate');
var utils = require('./utils');

function Environment() {
    if (!(this instanceof Environment))
        return new Environment();

    this.resolved = {};
}

Environment.prototype = {
    /**
     * check if object correspond to schema
     *
     * ### Examples:
     *
     *    env.validate('test#/common', { type: 'common' });
     *    // => undefined
     *
     *    env.validate('test#/common', { type: 'custom' });
     *    // => 'required: data'
     *
     * @param {String} name
     * @param {Object} object
     * @returns {String} error - undefined if it is valid
     */
    validate: function (name, object) {
        var resolved = this.resolve(name).fn;
        var fn = { src: resolved.toString(), time: process.hrtime(), name, object, schema: JSON.stringify(resolved.schema) };
        process.stats.generatedFunctions.push(fn);

        var res = resolved(object);
        fn.time = process.hrtime(fn.time);
        fn.time = fn.time[1];//*Math.pow(10, 9) + fn.time[1];

        return res;
    },

    /**
     * add schema to djv environment
     *
     * ### Examples:
     *
     *    env.addSchema('test', jsonSchema);
     *
     * @param {String} name
     * @param {Object} schema
     * @returns {resolved}
     */
    addSchema: function (name, schema) {
        if(typeof name === 'object') {
            schema = name;
        }

        var resolved = {
            schema: schema,
            fn: generate(this, schema).toFunction()
        };

        if(typeof name === 'string') {
            resolved.name = name;
            this.resolved[name] = resolved;
        }

        return resolved;
    },

    /**
     * removes a schema or the whole structure from djv environment
     *
     * ### Examples:
     *
     *    env.removeSchema('test');
     *
     * @param {String} name
     */
    removeSchema: function (name) {
        if (name) {
            delete this.resolved[name];
        } else {
            this.resolved = {};
        }
    },

    /**
     * resolves name by existing environment
     *
     * ### Examples:
     *
     *    env.resolve('test');
     *    // => { name: 'test', schema: {} }, fn: ... }
     *
     * @param {String} name
     * @returns {resolved}
     */
    resolve: function (name) {
        if (typeof name === 'object' || !this.resolved[name]) {
            return this.addSchema(name, utils.resolve(name, Object.assign([], { current: [] }, this.resolved)));
        }

        return this.resolved[name];
    },

    /**
     * exports the whole structure object from environment or by resolved name
     *
     * ### Examples:
     *
     *    env.export();
     *    // => { test: { name: 'test', schema: {}, ... } }
     *
     * @param {String} name
     * @returns {serializedInternalState}
     */
    export: function (name) {
        if (name) {
            var resolved = this.resolve(name);
            resolved = {
                name: name,
                schema: resolved.schema,
                fn: resolved.fn.toString()
            };
        } else {
            resolved = {};

            for (var name in this.resolved) {
                resolved[name] = {
                    name: name,
                    schema: this.resolved[name].schema,
                    fn: this.resolved[name].fn.toString()
                };
            }
        }

        return JSON.stringify(resolved);
    },

    /**
     * imports all found structure objects to internal environment structure
     * ### Examples:
     *
     *    env.import(config);
     *
     * @param {Object} config - internal structure or only resolved schema object
     */
    import: function (config) {
        var item = JSON.parse(config);
        if (item.name && item.fn && item.schema) {
            var restoreData = {};
            restoreData[item.name] = item;
        } else {
            restoreData = item;
        }

        for (var name in restoreData) {
            var item = { name: restoreData[name].name, schema: restoreData[name].schema, fn: restoreData[name].fn };
            item.fn = new Function('schema', 'return ' + item.fn)(item.schema);
            this.resolved[item.name] = item;
        }
    }

};

module.exports = Environment;