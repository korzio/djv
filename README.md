[![Build Status](https://travis-ci.org/korzio/djv.svg?branch=master)](https://travis-ci.org/korzio/djv)
[![Join the chat at https://gitter.im/korzio/djv](https://badges.gitter.im/korzio/djv.svg)](https://gitter.im/korzio/djv?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

# djv

Dynamic JSON Schema Validator

Current package supports **JSON Schema v4** and it contains utils for validating objects against schemas.
This is a part of **djv** packages aimed to work with json-schema.

- [djv](https://github.com/korzio/djv) validate object against schemas
- [djvi](https://github.com/korzio/djvi) instantiate objects by schema definition
- [jvu](https://github.com/korzio/jvu) utilities for declarative, FP usage

## Installation

```
npm install djv
```

or

```html
<script src="djv.js"></script>
```

## Usage

```javascript
var env = new djv();
var jsonSchema = {
    "common": {
        "properties": {
            "type": {
                "enum": ["common"]
            }
        },
        "required": [
            "type"
        ]
    }
};

// Use `addSchema` to add json schema
env.addSchema('test', jsonSchema);
env.validate('test#/common', { type: 'common' });
// => undefined

env.validate('test#/common', { type: 'custom' });
// => 'required: data'
```

## API

### addSchema(name: string, schema: object?) -> resolved: object

Add a schema to a current djv environment,

```javascript
env.addSchema('test', jsonSchema);
/* => {
    fn: function f0(data){...}
    name: 'test'
    schema: ...
} */
```

### validate(name: string, object: object) -> error: string

Check if object is valid against the schema

```javascript
env.validate('test#/common', { type: 'common' });
// => undefined

env.validate('test#/common', { type: 'custom' });
// => 'required: data'
```

where

* *name* - schema path in current environment
* *object* - object to validate
* *error* - undefined if it is valid

### removeSchema(name: string)

Remove a schema or the whole structure from the djv environment

```javascript
env.removeSchema('test');
```

### resolve(name: string?)

Resolve the name by existing environment

```javascript
env.resolve('test');
// => { name: 'test', schema: {} }, fn: ... }
```

### export(name: string?) -> state: object

Export the whole structure object from environment or resolved by a given name

```javascript
env.export();
// => { test: { name: 'test', schema: {}, ... } }
```

where **state** is an internal structure or only resolved schema object

### import(config: object)

Import all found structure objects to internal environment structure

```javascript
env.import(config);
```

### addFormat(name: string, formatter: string/function)

Add formatter to djv environment. When a string is passed it is interpreted as an expression which when returns `true` goes with an error, when returns `false` then a property is valid. When a function is passed it will be executed during schema compilation with a current schema and template helper arguments.

```javascript
env.addFormat('UpperCase', '%s !== %s.toUpperCase()');
// or
env.addFormat('isOk', function(schema, tpl){
  return `!${schema.isOk}`;
});
env.validate('ok', 'valid') // => undefined if schema contains isOk property
```

### setErrorHandler(errorHandler: function)

Specify custom error handler which will be used in generated functions when problem found.
The function should return a string expression, which will be executed when generated validator function is executed. The simpliest use case is the default one @see `template/defaultErrorHandler`
```javascript
 function defaultErrorHandler(errorType) {
   return `return "${errorType}: ${tpl.data}";`;
 }
```
It returns an expression 'return ...', so the output is an error string.

```javascript
djv({ errorHandler: () => 'return { error: true };' }) // => returns an object
djv({
 errorHandler: function customErrorHandler(errorType, property) {
   return `errors.push({
     type: '${type}',
     schema: '${this.schema[this.schema.length - 1]}',
     data: '${this.data[this.data.length - 1]}'
   });
 }
})`;
```
When a custom error handler is used, the template body function adds a `error` variable inside a generated validator, which can be used to put error information. `errorType` is always passed to error handler function. Some validate utilities put extra argument, like f.e. currently processed property value. Inside the handler context is a templater instance, which contains `this.schema`, `this.data` paths arrays to identify validator position.
@see test/index/setErrorHandler for more examples


## Tests

```
npm test
```

## References

* [JSON Schema Benchmark](https://github.com/ebdrup/json-schema-benchmark)

<!---

## What relative tasks can be? Why use json-schema?

### Meta programming

What is [generate-function](https://www.npmjs.com/package/generate-function)? How to write well-optimized functions?

- Templates
- Validators

### Goals

- keep structure and code clean

in is-my-json-schema-valid and jjv packages structure is - one file

- add architecture ability to set instantiate and randomize data
- fast validation
- normal speed generation

### Refactoring jjv

- splitted into files
- updated variable names

### Refactoring for generated function

investigate c++ inline functions

- is-my-json-valid implementation
- got a generated-function
- updated generated function with few methods - resolve, error, etc, cache - Maybe it is better to use some meta language for it?

### Optimized things

- Added Measured
- Describe All measurements

### Google Closure Advanced

- features
- what is used
- why still need optimizations

## TODO

### Todo Optimizations List

- generatedNonReffunctions 1377, generatedfunctionsUsed 3003 - make fn.if function, and transport scope/context/state to generate function
- update ref usage for non-ref inline functions - if a linke does not contain refs inside (can be easily checked by json.stringify), it should be a regular if-else consequence as well - Optimize small schemas (like in allOf example - don't generate function, althought return context)
- [if optimization](http://jsperf.com/ifs-vs-expression)?
- [killing optimization](http://habrahabr.ru/company/mailru/blog/273839/)

### General

- [asmjs compile step](http://ejohn.org/blog/asmjs-javascript-compile-target/)
- [compile with google closure or smth](https://www.npmjs.com/package/google-closure-compiler)
- $data
- add posibility to customize validators
- add nested tests
- add tests to [resolve](http://tools.ietf.org/html/draft-zyp-json-schema-04#section-7.2.4)

-->
