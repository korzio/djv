function Environment() {
    if (!(this instanceof Environment))
        return new Environment();

    this.schema = {};
    this.resolved = {};
}

Environment.prototype = {
    validate: function (name, object, options) {
        return this.resolved[name].fn(object);
    },

    addSchema: function (name, schema) {
        this.schema[name] = schema;

        var context = require('./generate')(this, schema);
        this.resolved[name] = {
            schema: schema,
            context: context,
            fn: context.toFunction()
        };
    }
};

module.exports = Environment;