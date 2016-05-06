# djvi

Dynamic Json Schema Instance

This package contains json-schema utilty for instantiate models based on schema.
This is a part of **djv** packages aimed to work with json-schema. In future (~ 1 year) all **djv** packages will be unified into single package with **djv** scope.

## Concepts

JSON Schema instantiator should generate `minimal` object, valid to a given schema.

- **not required** properties will be ommitted
- **maximum** and **minimum** will be set up for given number
- primitives schemas are instantiated with default values
```
null: null
string: ''
boolean: false
number: 0
integer: 0
object: Object
array: Array
```
- **not** recursively changes negative schema to use different types

## TODO

- each instance should be unique? Clone can help
- add posibility to customize generators
- add `allOf` and other cases to `not` schema
- add `oneOf` complex example/generator
- add regexp instantiate (pattern and patternProperties tests)
- add uniqueItems custom logic

## Resources

- [djv](https://github.com/korzio/djv)
- [djvu](https://github.com/korzio/djvu)
- [JSON Schema Instantiator tests](https://github.com/tomarad/JSON-Schema-Instantiator/blob/master/tests/tests.js)
