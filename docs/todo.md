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