(function () {
    function Environment() {
        if (!(this instanceof Environment))
            return new Environment();

        this.schema = {};
    }

    Environment.prototype = {
        validate: function (name, object, options) {
            return this.resolve(name).fn(object);
        },

        resolve: function (name) {
            return this.schema[name];
        },

        addSchema: function (name, schema) {
            // TODO refactor
            this.schema['#'] = { schema: schema };
            var context = require('./generate')(this, schema);
            this.schema[name] = {
                schema: schema,
                context: context,
                fn: context.toFunction()
            };

            return this.schema[name];
        }
    };

    // Export for use in server and client.
    if (typeof module !== 'undefined' && typeof module.exports !== 'undefined')
        module.exports = Environment;
    else if (typeof define === 'function' && define.amd)
        define(function () { return Environment; });
    else
        this.jjv = Environment;
}).call(this);
