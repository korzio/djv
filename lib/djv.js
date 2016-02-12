function Environment() {
    if (!(this instanceof Environment))
        return new Environment();

    this.schema = {};
}

Environment.prototype = {
    validate: function (name, object, options) {
        return this.schema[name].fn(object);
    },

    addSchema: function (name, schema) {
        var context = require('./generate')(this, schema);
        this.schema[name] = {
            schema: schema,
            context: context,
            fn: context.toFunction()
        };

        return this.schema[name];
    }
};

module.exports = Environment;