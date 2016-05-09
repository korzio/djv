[![Build Status](https://travis-ci.org/korzio/djvi.svg?branch=master)](https://travis-ci.org/korzio/djvi)
[![Join the chat at https://gitter.im/korzio/djvi](https://badges.gitter.im/korzio/djvi.svg)](https://gitter.im/korzio/djvi?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

# djvi

Dynamic Json Schema Instance

This package contains json-schema utilty for instantiate models based on schema.
This is a part of **djv** packages aimed to work with json-schema. In future (~1 year) all **djv** packages will be unified into single package with **djv** scope.

## Usage

For node - package is not minimized

```
npm install djvi
```

For browser

```
<script src="djvi/djvi.js"></script>
```

## Concepts

JSON Schema instantiator should generate `minimal` object, valid to a given schema.

- **not required** properties will be ommitted
- **maximum** and **minimum** will be set up for given number
- primitives **types** are instantiated with default values
```
null: null
string: ''
boolean: false
number: 0
integer: 0
object: {}
array: []
```
- **not** recursively changes negative schema to use different types
- **anyOf** and **oneOf** are solved with first property instance (for **oneOf** it should be also checked with single matching only - it is not implemented yet)
- [simple](http://tools.ietf.org/html/draft-zyp-json-schema-03#section-5.8) **dependency** instantiates only for required fields
- **items** keyword instantiates an array with fit objects
- **minItems, maxItems** instantiates an array with default types
- Each instance is an unique object (Unless unique = false is not used)
```
env.instance('test#/common') !== env.instance('test#/common')
```

## Examples

Primitives [types](https://github.com/json-schema/json-schema/wiki/Type) with default values

```
{"type":"number","default":100}
// => 100

{"type": "null"}
// => null

{"type": ["integer", "string"]}
// => 0

{"type": "array"}
// => []
```

[All of](https://github.com/json-schema/json-schema/wiki/anyOf,-allOf,-oneOf,-not#allof) types
```
{ "allOf":[
        {"type":"object","properties":{"title":{"type":"string"}},"required":["title"]},
        {"type":"object","properties":{"amount":{"type":"number","default":1}},"required":["amount"]}
]}
// => {"title":"","amount":1}
```

[Items](https://github.com/json-schema/json-schema/wiki/additionalItems-and-items) keywords should be an array with default instances
```
{"minItems": 1}
// => [{}]

{"items":[{"type":"integer"},{"type":"string"}]}
// => [0, ""]
```

## API

```
var jsonSchema = {"common":{"properties":{"type":{"enum":["common"]}},"required":["type"]}};

var env = new djvi();
env.addSchema('test', jsonSchema);
env.instance('test#/common');
// => { type: 'common' }
```

### instance(name, unique)

instantiate an object that corresponds to a schema
```
env.instance('test#/common');
// => { type: 'common' }
```

### addSchema(name, schema)

add a schema to djvi environment

```
env.addSchema('test', jsonSchema);
```

### removeSchema(name)

removes a schema or the whole structure from djvi environment

```
env.removeSchema('test');
```

### resolve(name)

resolves name by existing environment

```
env.resolve('test');
// => { name: 'test', schema: {} }, fn: ... }
```

### export(name)

exports the whole structure object from environment or by resolved name

```
env.export();
// => { test: { name: 'test', schema: {}, ... } }
```

### import(config)

imports all found structure objects to internal environment structure

```
env.import(config);
```

### utils()

returns `{ types, fieldTypes, fieldValidate, fieldFormat }` generators that can be overridden for use cases

```
env.utils();
```

## TODO

- add `allOf` and other cases to `not` schema
- add `oneOf` complex example/generator
- add regexp instantiate (pattern and patternProperties tests)
- add uniqueItems custom logic
- add format generators
- move tests to separated repo/package

## Resources

- [JSON Schema wiki](https://github.com/json-schema/json-schema/wiki)
- [JSON schema specification](tools.ietf.org/html/draft-zyp-json-schema-04)
- [djv](https://github.com/korzio/djv)
- [djvu](https://github.com/korzio/djvu)
- [JSON Schema Instantiator tests](https://github.com/tomarad/JSON-Schema-Instantiator/blob/master/tests/tests.js)
