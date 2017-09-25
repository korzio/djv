# const <a name="title"></a>

The keyword [const](https://tools.ietf.org/html/draft-wright-json-schema-validation-01#section-6.24) has appeared in draft-06,
meaning the comparison to exact value of a given json-schema const property.

## Table of contents <a name="content"></a>

* [const](#title)
* [Table of contents](#content)
* [Overview](#overview)
* [Examples](#examples)
* [Summary](#summary)

## Overview <a name="overview"></a>

In a current implementation there were already a special constant property defined. However it was under "TODO" comment, and apparently was never tested before. I could not find any tests regarding it in [json-schema-benchmark](https://github.com/ebdrup/json-schema-benchmark/search?utf8=%E2%9C%93&q=constant&type=) as well. Anyways, the current implementation was not good enough to use it in a new specification. If you look into the definition of [instance equality](https://tools.ietf.org/html/draft-wright-json-schema-01#section-4.3) for objects it says

> both are objects, and each property in one has exactly one property with a key equal to the other's, and that other property has an equal value.

And a `JSON.stringify` uses the [sort of "random"](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...in) properties order, so it cannot be applied here. The other solution is to use a `deep equal comparison` function, as the others validators do. It is easy work in simple data cases, when a string or number are being compared. However if the `const` value is an array or an object, things there are coming tougher - you have to iterate all keys of *array/object*, compare to the same values on the second *array/object* and sometimes go recursively. However this approach is pretty straightforward, I still assume there could be a better solution. And it is quite relative to the json schema validator tecnhique.

The solution is to preprocess the object given by a `const` keyword in a way normally a validator does it - gets all valuable information on the pre-processing phase and then creates a `function` (or it could be a inline-implementation as well) to check that the object corresponds to const definition of it. Of course there should be a combination of both techniques - if simple objects are not the same, then obviously the utility should return false. To implement the `const` utility first we generate the schema by the object, generate the validator for it, and then on the runtime we call it against the data object as usual.

## Examples <a name="examples"></a>

The tests [examples](https://github.com/json-schema-org/JSON-Schema-Test-Suite/blob/05fdba41bd7844de1d527455e208addd50d41a01/tests/draft6/const.json#L24)

```json
{ "const": 2 }
// =>
{
  "enum": [2]
}
```

Objects

```json
...
"description": "const with object",
"schema": {"const": {"foo": "bar", "baz": "bax"}},
... // -> schema
{
  properties: {
    "foo": { enum: "bar" },
    "baz": { enum: "bax" }
  },
  required: ["foo", "baz"],
  additionalProperties: false // other properties should be valid by `false` schema, aka do not exist at all
}
```

Arrays (created [a PR](https://github.com/json-schema-org/JSON-Schema-Test-Suite/pull/191) to json schema test suite)
```json
...
"description": "const with object",
"schema": {"const": [{ foo: "bar" }]},
... // -> schema
{
  items: [{
    "properties": {
      "foo": { enum: "bar" },
     },
     required: ["foo"]
  }],
  additionalItems: false // other items should be valid by `false` schema, aka do not exist at all
}
```

So for simple objects we could use only `required`, `enum` and `additionalProperties` validation. The same for arrays - adding `items` and `additionalItems`.

Do we need anything else? The key difference between schema and instances is that there is no need to define a group or class of objects by schema, there only one object that should be checked against this schema.

## Summary <a name="summary"></a>

- A created package could be a start point for the *generate schema by instance* library