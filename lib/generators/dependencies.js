// http://tools.ietf.org/html/draft-zyp-json-schema-03#section-5.8
//
// This attribute is an object that defines the requirements of a
//    property on an instance object.  If an object instance has a property
//    with the same name as a property in this attribute's object, then the
//    instance must be valid against the attribute's property value
//    (hereafter referred to as the "dependency value").
//
//    The dependency value can take one of two forms:
//
//    Simple Dependency  If the dependency value is a string, then the
//       instance object MUST have a property with the same name as the
//       dependency value.  If the dependency value is an array of strings,
//       then the instance object MUST have a property with the same name
//       as each string in the dependency value's array.
//
//    Schema Dependency  If the dependency value is a schema, then the
//       instance object MUST be valid against the schema.
//
module.exports = function dependencies(schema, fn) {
    if (!schema.hasOwnProperty('dependencies')) {
        return;
    }

    for (var dependency in schema.dependencies) {
        var value = schema.dependencies[dependency];
        if (Array.isArray(value) || typeof value === 'string') {
            if (!schema.required || !~schema.required.indexOf(dependency)) {
                continue;
            }

            [].concat(value).forEach(function (property) {
                fn.data[property] = fn.resolve(schema.properties && schema.properties[property]);
            });
        } else if (typeof value === 'object') {
            fn.extend(fn.resolve(value));
        }
    }
};