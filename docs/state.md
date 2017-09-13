# State <a name="title"></a>

The **state document** describes basic concepts of resolving schemas inside the `djv` validator.

## Table of contents <a name="content"></a>

* [State](#title)
* [History](#history)
* [Overview](#overview)
  * [State Flow](#state_flow)
* [References](#references)

## History <a name="history"></a>

The state functionality is responsible for the resolving schemas inside `djv` library.
Historically, up to [draft-04 version](https://tools.ietf.org/html/draft-zyp-json-schema-04#section-7.2.3) of json-schema specification there was described two different ways of resolving resources inside a validator. It could be an **canonical** or **inline** dereferencing algorithms. The main difference between two of them was in a way how to interpreter references met during the work of a validator. **canonical** approach assumed that a library will recognize or transform a given uri and then fetch a corresponding resource. Meanwhile the **inline** approach proposed to solve a uri and a resource inside the validator stored schemas.
Most validators implemented the further approach, as there is no need for fetching external resources code. That said the **inline** way of resolving schema is a current standard within the json-schema specification.

## Overview <a name="overview"></a>

The **djv** package contains a few conceptual attendees inside a library:
- [`djv`](https://github.com/korzio/djv/blob/master/lib/djv.js) environment class, by instantiating which allows to use [public methods](https://github.com/korzio/djv#api) such as `addSchema`, `validate`, etc.
- A set of [`validators`](https://github.com/korzio/djv/tree/master/lib/validators) used inside the library. This is a core of an [validation specification](https://tools.ietf.org/html/draft-wright-json-schema-validation-01) implementation.
- [`template`](https://github.com/korzio/djv/blob/master/lib/utils/template.js) utility with a minimum methods to generate high optimized validation functions.
- [`state`](https://github.com/korzio/djv/blob/master/lib/utils/state.js) an internal schema resolution algorithm.

**State** is a key part for resolving schemas inside the validator. Every time the validation function is generating, there are methods in templater which can help resolve sub-schema.

### State Flow <a name="state_flow"></a>

The state remembers all the schemas which were parsed during the schema processing. Each validator has `template` instance injected as an argument, and through its api subschemas can be parsed.

Template API
- **visit** - Create new cache scope and visit given schema
- **resolve** - Get schema validator function by url

State API and actors
- **context** - states or schemas stack. During the parsing validators via calling state API may or may not save subschema in a `context` stack. This stack is used during the resolution process (@see `link` below).
- **link** - A way to generate (or get cached) internal function utility to be used inside final validator function. Contains logic of caching functions and checking for doubled schemas processing.
- **visit** - Calls each registered validator with given schema and template instance. Validator may or may not add code to generated validator function. `Visit` is partially responsible for saving current schema. After executing all validators it reverts the states stack to original length. The `visit` is a general way of parsing schema.

### Why change

Tests are not passing, the resolving process doesn't work perfect.

- `validation of URIs, an invalid protocol-relative URI Reference`
- `ref overrides any sibling keywords, ref valid, maxItems ignored`
- `base URI change - change folder in subschema, number is valid`
- `root ref in remote ref, string is valid`
- `root ref in remote ref, object is invalid`

## Refactoring

### Process

### Example