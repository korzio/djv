# State <a name="title"></a>

The **state document** describes basic concepts of resolving schemas inside the `djv` validator.

## Table of contents <a name="content"></a>

* [State](#title)
* [Table of contents](#content)
* [History](#history)
* [Overview](#overview)
* [State Flow](#state_flow)
* [Why change](#change)
* [Refactor](#refactor)
* [Example](#example)
  * [Recursive references between schemas](#recursive_references)
  * [ref within remote ref](#remote_ref)

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

## State Flow <a name="state_flow"></a>

The state remembers all the schemas which were parsed during the schema processing. Each validator has `template` instance injected as an argument, and through its api subschemas can be parsed.

Generate API
- **generate** - A main entry point, both for external `djv` *addSchema* and internal helpers (@see `state::link`).

Template API
- **visit** - Create new cache scope and visit given schema
- **resolve** - Get schema validator function by url

State API and actors
- **stack** - states or schemas stack. During the parsing validators via calling state API may or may not save subschema in a *stack*. It is used during the resolution process (@see `link` below).
- **context** - a storage of schemas to be parsed. Before resolution the algorithm checks whether a schema is already added to the *context*. If so, it will be omitted for the single processing purpose.
- **link** - A way to generate (or get cached) internal function utility to be used inside final validator function. Contains logic of caching functions and checking for doubled schemas processing.
- **visit** - Calls each registered validator with given schema and template instance. Validator may or may not add code to generated validator function. `Visit` is partially responsible for saving current schema. After executing all validators it reverts the states stack to original length. The `visit` is a general way of parsing schema.

Each time the schema is passed to the `state::visit` function validator saves it in the *context*.
If the `state::visit` function was called directly from `template::visit` API, then if will not create an internal helper function to check subSchema.
If the `state::visit` was called during the `link` execution, it can either get a cached helper for that subSchema or to generate a new one. when a new internal helper function is generating, it goes through the normal.
To resolve a reference *stack* is iterated in order to find an appropriate parent schema instance resolution.

## Why change <a name="change"></a>

Tests are not passing, the resolving process doesn't work well. In an old algorithm version the state was saved in a container called *resolution*. The resolution array kept all important schemas comparing to the *stack*. For instance it was saving schemas with a full URI id. That works in most cases, but the complete resolution was not solved - it still needed to iterate through the stack.

## Refactor <a name="refactor"></a>

During the refactoring there were a few tries to implement the resolution algorithm.
The new algorithm relies on a *stack* only. It adds a function `resolveReference`, which iterates backwards through the *stack* - in order to find a *base* schema - for which it can resolve a current reference. Usually it means a schema with a full URI but also it could be a referenced item with a full URI *$ref* schema. As soon as the nearest ancestor is found, the algorithm iterates through all intermediate items in the *stack* to collect all valuable partial references - it can be a schema with [an id *t/inner.json*](https://tools.ietf.org/html/draft-wright-json-schema-01#section-9.2) or a fragment id. After all puzzles

- the full URI,
- partial references,
- current reference

 are collected, it merges them together in a way [NodeJS path.join](https://nodejs.org/dist/latest-v8.x/docs/api/path.html#path_path_join_paths) does it (not exactly).

 ```javascript
const fullReference = this.resolveReference(reference);
const parentSchema = this.ascend(fullReference);
const subSchema = this.descend(reference, parentSchema);
 ```

The next step is to find a schema for the constructed path. For that reason `ascend` tried to find already resolved schema in a environment by a *head* (a [non-fragment](https://tools.ietf.org/html/rfc3986#section-3) part) of a given path.
The last part is an `descend` function, which takes the path's fragment and a parentSchema and iterates it's hierarchy (including [definitions properties](https://tools.ietf.org/html/draft-wright-json-schema-01#section-9.2)).

## Example <a name="example"></a>

### Recursive references between schemas <a name="recursive_references"></a>

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

To find a *node* subSchema validator should get the current base URI. For that reason it iterates over the *stack* in reverse order. That process is called `ascend`. When it ecounters the current base schema (which is *http://localhost:1234/tree*), it then solves it within the `descend` method - it goes through its properties (in general) and *definitions* property. When it ecounters the schema with an *node* id, it resolves a search. A *node* schema then is passed to the `addEntry` method, which checks for existing cached helper, as it doesn't exist generates a new one.

It passes a schema and a state among the options `inner: true` flag to `generate` in order to process a template a bit different. The main difference between *inner* modes is that the outer function will be generated as a wrapper for all inner helper utilities, and inner functions should use that wrapper. This difference is mostly done on a `template` level.

The process continues, and each *node* is checked against the subSchema. Eventually validator encounters the ref to *tree* again. It searches then a schema by a *node* path part and the base schema URI domain part (*http://localhost:1234/*). If finds an equal schema id in a *context*, passes it to `addEntry`. `addEntry` knows that the process has already started to generate a helper for that subSchema, so it will return a reference to the function, which will be used during the template phase.

### ref within remote ref <a name="remote_ref"></a>

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
// Search while it is a full schema, not a ref
while (
  parentSchema.$ref &&
  // avoid infinite loop
  head(parentSchema.$ref) !== head(reference) &&
  // > All other properties in a "$ref" object MUST be ignored.
  // @see https://tools.ietf.org/html/draft-wright-json-schema-01#section-8
  Object.keys(parentSchema).length === 1
) {
  parentSchema = this.ascend(parentSchema.$ref);
}
```