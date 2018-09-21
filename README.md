[![Build Status](https://travis-ci.org/korzio/djv.svg?branch=master)](https://travis-ci.org/korzio/djv)
[![Join the chat at https://gitter.im/korzio/djv](https://badges.gitter.im/korzio/djv.svg)](https://gitter.im/korzio/djv)

# djv <a name="title"></a>

Dynamic JSON-Schema Validator

[Official Documentation](http://korzio.github.io/djv/)

Current package supports **JSON-Schema v6 and v4**. It contains utils to validate objects against schemas.
This is a part of **djv** packages aimed to work with json-schema.

- [djv](https://github.com/korzio/djv) validate object against schemas
- [djvi](https://github.com/korzio/djvi) instantiate objects by schema definition
- [jvu](https://github.com/korzio/jvu) utilities for declarative, FP usage
- [@djv/draft-04](https://github.com/korzio/@djv/draft-04) environment updates to support *draft-04*

Any contributions are welcome. Check the [contribution guide](./CONTRIBUTING.md).
Since version **1.2.0** *djv* package supports `draft-06`. Version **2.0.0** makes `draft-06` the default schema version. To use other versions check the [environment section](#environment).

## Table of contents <a name="content"></a>

* [djv](#title)
* [Table of contents](#content)
* [Install](#install)
* [Usage](#usage)
* [API](#api)
  * [Environment](#environment)
  * [addSchema](#addSchema)
  * [validate](#validate)
  * [removeSchema](#removeSchema)
  * [resolve](#resolve)
  * [export](#export)
  * [import](#import)
  * [addFormat](#addFormat)
  * [setErrorHandler](#errorHandler)
  * [useVersion](#useVersion)
* [Tests](#tests)
* [References](#references)

## Install <a name="install"></a>

```bash
npm install djv
```

or

```html
<script src="djv.js"></script>
```

There are 2 versions of validator

- `./lib/djv.js` a default one, not uglified and not transpiled
- `./djv.js` a built one with a webpack, babel and uglify (preferable for frontend)

## Usage <a name="usage"></a>

```javascript
const env = new djv();
const jsonSchema = {
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

// Use `addSchema` to add json-schema
env.addSchema('test', jsonSchema);
env.validate('test#/common', { type: 'common' });
// => undefined

env.validate('test#/common', { type: 'custom' });
// => 'required: data'
```

## API <a name="api"></a>

### Environment <a name="environment"></a>

To instantiate *djv* environment

```javascript
const djv = require('djv');
const env = djv({
  version: 'draft-06', // use json-schema draft-06
  formats: { /*...*/ }, // custom formats @see #addFormat
  errorHandler: () => { /*...*/ }, // custom error handler, @see #setErrorHandler
});
```

To use a previous version of JSON-Schema draft, use a [`draft-04` plugin](https://www.npmjs.com/package/@korzio/djv-draft-04), specified in [*optionalDependencies*](https://docs.npmjs.com/files/package.json#optionaldependencies) of *djv* package.

```javascript
const env = new djv({ version: 'draft-04' });
```

### addSchema(name: string, schema: object?) -> resolved: object <a name="addSchema"></a>

Add a schema to a current djv environment,

```javascript
env.addSchema('test', jsonSchema);
/* => {
  fn: function f0(data){...}
  name: 'test'
  schema: ...
} */
```

### validate(name: string, object: object) -> error: string <a name="validate"></a>

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

### removeSchema(name: string) <a name="removeSchema"></a>

Remove a schema or the whole structure from the djv environment

```javascript
env.removeSchema('test');
```

### resolve(name: string?) <a name="resolve"></a>

Resolve the name by existing environment

```javascript
env.resolve('test');
// => { name: 'test', schema: {} }, fn: ... }
```

### export(name: string?) -> state: object <a name="export"></a>

Export the whole structure object from environment or resolved by a given name

```javascript
env.export();
// => { test: { name: 'test', schema: {}, ... } }
```

where **state** is an internal structure or only resolved schema object

### import(config: object) <a name="import"></a>

Import all found structure objects to internal environment structure

```javascript
env.import(config);
```

### addFormat(name: string, formatter: string/function) <a name="addFormat"></a>

Add formatter to djv environment. When a string is passed it is interpreted as an expression which when returns `true` goes with an error, when returns `false` then a property is valid. When a function is passed it will be executed during schema compilation with a current schema and template helper arguments.

```javascript
env.addFormat('UpperCase', '%s !== %s.toUpperCase()');
// or
env.addFormat('isOk', function(schema, tpl){
  return `!${schema.isOk}`;
});
env.validate('ok', 'valid') // => undefined if schema contains isOk property
```

### setErrorHandler(errorHandler: function) <a name="errorHandler"></a>

Specify custom error handler which will be used in generated functions when problem found.
The function should return a string expression, which will be executed when generated validator function is executed. The simplist use case is the default one @see `template/defaultErrorHandler`
```javascript
 function defaultErrorHandler(errorType) {
   return `return "${errorType}: ${tpl.data}";`;
 }
```
It returns an expression 'return ...', so the output is an error string.

```javascript
djv({ errorHandler: () => 'return { error: true };' }) // => returns an object
djv({
  errorHandler(type) {
    return `errors.push({
      type: '${type}',
      schema: '${this.schema[this.schema.length - 1]}',
      data: '${this.data[this.data.length - 1]}'
    });`;
  }
});
```
When a custom error handler is used, the template body function adds a `error` variable inside a generated validator, which can be used to put error information. `errorType` is always passed to error handler function. Some validate utilities put extra argument, like f.e. currently processed property value. Inside the handler context is a templater instance, which contains `this.schema`, `this.data` paths arrays to identify validator position.
@see test/index/setErrorHandler for more examples

### useVersion(version: string, configure: function) <a name="useVersion"></a>

To customize environment provide a `configure` function which will update configuration for *djv* instance.

```javascript
env.useVersion('draft-04')
// or
env.useVersion('custom', configure)
```

`Configure` will get internal properties as an argument. Check the [@korzio/djv-draft-04 code](https://github.com/korzio/-djv-draft-04/blob/master/index.js).

```javascript
exposed = {
  properties,
  keywords,
  validators,
  formats,
  keys,
  transformation,
}
```

**!Important** Modifying them will affect all *djv* instances in an application.

## Tests <a name="tests"></a>

```
npm test
```

## References <a name="references"></a>

* [JSON-Schema Specification](http://json-schema.org/)
* [JSON-Schema Benchmark](https://github.com/ebdrup/json-schema-benchmark)
