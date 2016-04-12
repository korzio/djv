[![Build Status](https://travis-ci.org/korzio/djv.svg?branch=master)](https://travis-ci.org/korzio/djv)
# djv

Dynamic Json-schema Validator

## Installation

  `npm install djv`

## Usage

```
jsonSchema = {
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
```

Use `addSchema` to add json schema
```
schema.addSchema('test', jsonSchema);
```

Use `validate` to check if object corresponds to schema reference

```
commonObj = { type: 'common' };
var errors = schema.validate('test#/common', commonObj);
```

## API

<!-- Start lib/djv.js -->

### validate(name, object)

check if object corresponds to schema

#### Examples:

```
   schema.validate('test#/common', { type: 'common' });
   // => undefined

   schema.validate('test#/common', { type: 'custom' });
   // => 'required: data'
```

#### Params:

* **String** *name*
* **Object** *object*

#### Return:

* **String** error - undefined if it is valid

### addSchema(name, schema)

add schema to djv environment

#### Examples:

```
   schema.addSchema('test', jsonSchema);
```

#### Params:

* **String** *name*
* **Object** *schema*

#### Return:

* **resolved**

### removeSchema(name)

removes a schema or the whole structure from djv environment

#### Examples:

```
   schema.removeSchema('test');
```

#### Params:

* **String** *name*

### resolve(name)

resolves name by existing environment

#### Examples:

```
   schema.resolve('test');
   // => { name: 'test', schema: {} }, fn: ... }
```

#### Params:

* **String** *name*

#### Return:

* **resolved**

### export(name)

exports the whole structure object from environment or by resolved name

#### Examples:

```
   schema.export();
   // => { test: { name: 'test', schema: {}, ... } }
```

#### Params:

* **String** *name*

#### Return:

* **serializedInternalState**

### import(config)

imports all found structure objects to internal environment structure
#### Examples:
```
   schema.import(config);
```
#### Params:

* **Object** *config* - internal structure or only resolved schema object

<!-- End lib/djv.js -->

## Tests

  `npm test`

<!---

## What relative tasks can be? Why use json-schema?

- Instantiate
- Validate
- Randomize
- Models like objectmodel validation or any format, json-schema object model
- [Validation for React](https://facebook.github.io/react/docs/reusable-components.html)
- RAML
- XSLT-for json

## How it works

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

- generatedNonRefFunctions 1377, generatedFunctionsUsed 3003 - make fn.if function, and transport scope/context/state to generate function
- { count: 361, key: 'if (Array.isArray($1) && $1.some(function(item, key) {            key = JSON.stringify(item);            if(i1.hasOwnProperty(key))            return true;            i1[key] = true;        }))' }, // http://jsperf.com/array-some-vs-loop/5
- { count: 181, key: 'if (!/[-a-zA-Z0-9@:%_\\+.~#?&//=]{2,256}\\.[a-z]{2,4}\\b(\\/[-a-zA-Z0-9@:%_\\+.~#?&//=]*)?/.test(%s))' }
- update ref usage for non-ref inline functions - if a linke does not contain refs inside (can be easily checked by json.stringify), it should be a regular if-else consequence as well - Optimize small schemas (like in allOf example - don't generate function, althought return context)
- [if optimization](http://jsperf.com/ifs-vs-expression)?
- [killing optimization](http://habrahabr.ru/company/mailru/blog/273839/)

### General

- variables names with quotes, aka properties '%%%%' will throw error
- [asmjs compile step](http://ejohn.org/blog/asmjs-javascript-compile-target/)
- add tests to json schema suite and json-schema-benchmark
- [compile with google closure or smth](https://www.npmjs.com/package/google-closure-compiler)
- $data
- ajv implementation
- add tests to [resolve](http://tools.ietf.org/html/draft-zyp-json-schema-04#section-7.2.4)

-->

## Resources

- [github source code](https://github.com/korzio/djv)
- [npm package](https://www.npmjs.com/package/djv)
- [schema ids](http://spacetelescope.github.io/understanding-json-schema/basics.html#declaring-a-unique-identifier)