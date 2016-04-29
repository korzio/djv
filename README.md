# djvi

Dynamic Json Schema Instance

This package contains json-schema utilty for instantiate models based on schema.
This is a part of **djv** packages aimed to work with json-schema. In future (~ 1 year) all **djv** packages will be unified into single package with **djv** scope.

## Concepts

JSON Schema instantiator should generate `minimal` object, valid to a given schema.

- not required properties will be ommitted
- maximum and minimum will be set up for given number
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

## TODO

- add common json schema tests as in json-schema validate suite
- each instance should be unique? Clone can help
- add nested structure schema test
- add backward tests to generated objects valid by schema
- add posibility to customize generators

## Resources

- [djv](https://github.com/korzio/djv)
- [djvu](https://github.com/korzio/djvu)
- [JSON Schema Instantiator tests](https://github.com/tomarad/JSON-Schema-Instantiator/blob/master/tests/tests.js)
