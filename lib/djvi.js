var generate = require('./generate');
var utils = require('./utils');

function Environment() {
    if (!(this instanceof Environment))
        return new Environment();

    this.resolved = {};
}

Environment.prototype = {
    /**
     * instantiate an object that corresponds to schema
     *
     * ### Examples:
     *
     *    env.instance('test#/common');
     *    // => { type: 'common' }
     *
     * @param {String} name
     * @param {Boolean} unique
     * @returns {Object} data
     */
    instance: function(name, unique) {
        var data = this.resolve(name).data;
        if(unique === false) {
            return data;
        }

        return JSON.parse(JSON.stringify(data));
    },

    /**
     * add schema to djvi environment
     *
     * ### Examples:
     *
     *    env.addSchema('test', jsonSchema);
     *
     * @param {String} name
     * @param {Object} schema
     * @returns {resolved}
     */
    addSchema: function(name, schema) {
        return this.resolved[name] = {
            name: name,
            schema: schema,
            data: generate(this, schema).data
        };
    },

    /**
     * removes a schema or the whole structure from djvi environment
     *
     * ### Examples:
     *
     *    env.removeSchema('test');
     *
     * @param {String} name
     */
    removeSchema: function(name) {
        if(name) {
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
    resolve: function(name) {
        if (!this.resolved[name]) {
            this.addSchema(name, utils.resolve(name, Object.assign([], { current: [] }, this.resolved)));
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
    export: function(name) {
        var resolved = name ? this.resolve(name): this.resolved;
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
    import: function(config) {
        var item = JSON.parse(config);
        if (item.name && item.data && item.schema) {
            var restoreData = {};
            restoreData[item.name] = item;
        } else {
            restoreData = item;
        }

        for(var name in restoreData) {
            var item = { name: restoreData[name].name, schema: restoreData[name].schema, data: restoreData[name].data };
            this.resolved[item.name] = item;
        }
    }

};

module.exports = Environment;