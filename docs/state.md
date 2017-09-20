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

Generate API
- **generate** - A main entry point, both for external `djv` *addSchema* and internal helpers (@see `state::link`).

Template API
- **visit** - Create new cache scope and visit given schema
- **resolve** - Get schema validator function by url

State API and actors
- **context** - states or schemas stack. During the parsing validators via calling state API may or may not save subschema in a `context` stack. This stack is used during the resolution process (@see `link` below).
- **link** - A way to generate (or get cached) internal function utility to be used inside final validator function. Contains logic of caching functions and checking for doubled schemas processing.
- **visit** - Calls each registered validator with given schema and template instance. Validator may or may not add code to generated validator function. `Visit` is partially responsible for saving current schema. After executing all validators it reverts the states stack to original length. The `visit` is a general way of parsing schema.

Each time the schema is passed to the `state::visit` function validator saves it in the `context`.
If the `state::visit` function was called directly from `template::visit` API, then if will not create an internal helper function to check subSchema.
If the `state::visit` was called during the `link` execution, it can either get a cached helper for that subSchema or to generate a new one. when a new internal helper function is generating, it goes through the normal.
To resolve a reference `context` is iterated in order to find an appropriate parent schema instance resolution.

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

#### Recursive references between schemas

*Given a schema with node and tree suschema definitions*

```json
{
  "id": "http://localhost:1234/tree",
  "description": "tree of nodes",
  "type": "object",
  "properties": {
    "meta": {"type": "string"},
    "nodes": {
      "type": "array",
      "items": {"$ref": "node"}
    }
  },
  "required": ["meta", "nodes"],
  "definitions": {
    "node": {
      "id": "http://localhost:1234/node",
      "description": "node",
      "type": "object",
      "properties": {
        "value": {"type": "number"},
        "subtree": {"$ref": "tree"}
      },
      "required": ["value"]
    }
  }
}
```

*When the test data is passed to validator*

```json
{
  "meta": "root",
  "nodes": [{
    "value": 1,
    "subtree": {
      "meta": "child",
      "nodes": [
        {"value": 1.1},
        {"value": 1.2}
      ]
    }
  }, {
    "value": 2,
    "subtree": {
      "meta": "child",
      "nodes": [
        {"value": 2.1},
        {"value": 2.2}
      ]
    }
  }]
}
```

*Then the validation should pass*

In a given example the first instance `{ "meta": "root", ... }` should be validated against the top level schema, containing

> "required": ["meta", "nodes"]

Then when properties are checked, validation process should go into the `nodes` array and validate each one of instance nodes items against the *node* referenced subSchema.

To find a *node* subSchema validator should get the current base URI. For that reason it iterates over the `context` in reverse order. That process is called `ascend`. When it ecounters the current base schema (which is *http://localhost:1234/tree*), it then solves it within the `descend` method - it goes through its properties (in general) and `definitions` property. When it ecounters the schema with an *node* id, it resolves a search. A *node* schema then is passed to the `addEntry` method, which checks for existing cached helper, as it doesn't exist generates a new one.

It passes a schema and a state among the options `inner: true` flag to `generate` in order to process a template a bit different. The main difference between `inner` modes is that the outer function will be generated as a wrapper for all inner helper utilities, and inner functions should use that wrapper. This difference is mostly done on a `template` level.

The process continues, and each *node* is checked against the subSchema. Eventually validator encounters the ref to *tree* again. It searches then a schema by a `node` path part and the base schema URI domain part (*http://localhost:1234/*). If finds an equal schema id in a `context`, passes it to `addEntry`. `addEntry` knows that the process has already started to generate a helper for that subSchema, so it will return a reference to the function, which will be used during the template phase.

#### ref within remote ref

*Given a schema with remote ref definition*

```json
{
  "$ref": "http://localhost:1234/subSchemas.json#/refToInteger"
}
```
*Given remote schemas defined*

```json
{
  "integer": {
    "type": "integer"
  },
  "refToInteger": {
    "$ref": "#/integer"
  }
}
```

*When the test data `1` is passed to validator*

*Then the validation should pass*

In the current scenario a problem after the link to *refInteger* is resolved, the validator tries to solve it's reference to *#/integer*, which starts from the first context instance, so it runs an infinite loop. To avoid that problem it was decided to add an `until not a reference` rule to `ascend` method.

```javascript
while (
  parentSchema.$ref &&
  // avoid infinite loop
  parentSchema.$ref !== reference &&
  // > All other properties in a "$ref" object MUST be ignored.
  // @see https://tools.ietf.org/html/draft-wright-json-schema-01#section-8
  Object.keys(parentSchema).length === 1
) {
  parentSchema = this.ascend(parentSchema.$ref);
}
```