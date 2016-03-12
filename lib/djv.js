var generate = require('./generate');
var utils = require('./utils');

function Environment() {
    if (!(this instanceof Environment))
        return new Environment();

    this.schema = {};
    this.resolved = {};
}

Environment.prototype = {
    validate: function (name, object, options) {
        return this.resolve(name).fn(object);
    },

    addSchema: function (name, schema) {
        this.schema[name] = schema;

        var context = generate(this, schema);
        return this.resolved[name] = {
            schema: schema,
            context: context,
            fn: context.toFunction()
        };
    },

    resolve: function(name){
        if(!this.resolved[name]) {
            this.addSchema(name, utils.resolve(name, Object.assign([], { current: [] }, this.schema)));
        }

        return this.resolved[name];
    }
};

module.exports = Environment;