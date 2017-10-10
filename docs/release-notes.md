# Release Notes <a name="title"></a>

This document contains all notes about the past djv releases.
Announcements are also sent to [the gitter channel](https://gitter.im/korzio/djv).

[![Join the chat at https://gitter.im/korzio/djv](https://badges.gitter.im/korzio/djv.svg)]

## Table of contents <a name="content"></a>

* [Release Notes](#title)
* [Table of contents](#content)
* [2.0.0](#2.0.0) - 2017-10-10
* [1.2.0](#1.2.0) - 2017-09-27
* [1.2.0](#1.1.1) - 2017-07-20
* [1.0.0](#1.0.0) - 2017-06-17

## 2.0.0 <a name="2.0.0"></a>

Supports **draft-06** by default.

All *draft-04* specific code is removed from the codebase. Within the release a separate library [is published](https://www.npmjs.com/package/@korzio/djv-draft-04) to support *draft-04*. It is installed by default as an [optional dependency](https://docs.npmjs.com/files/package.json#optionaldependencies) for *djv* package.

To specify *draft-04* usage instantiate

```javascript
const env = djv({
  version: 'draft-04',
});
// or
djv.useVersion('draft-04')
```

**!Important** Applying the *draft-04* configuration will affect all *djv* instances in an application. Check the [documentation](/README.md#useVersion).

## 1.2.0 (2017-09-27) <a name="1.2.0"></a>

A [MR](https://github.com/korzio/djv/pull/50) which replaces the previous one and contains 2 big features:
1. State refactoring - now tests are passing, the algorithm is redesigned (however there are still things to do in future)
2. Draft-06 implemented

Supports *draft-04* by default and can be configured to validate instances against *draft-06* specification.

## 1.1.1 <a name="1.1.1"></a>

[The release story](https://github.com/korzio/djv/issues/35)
[The changelog](https://github.com/korzio/djv/blob/master/CHANGELOG.md#111-2017-07-20)

In short - this release was about fixing [the major part of bugs](https://github.com/korzio/djv/issues/35#issuecomment-316698036) of updated json schema benchmark.
The most of the work was done related to state management. I've tried to refactor that functionality. However the most tests regarding references are passing , there are still a few (5) of them failing. Next release will be about v5/v6 support, and the one after will be state refactoring again - I hope to rewrite it in a "wise" way, with algorithm description, tests analytics, etc.
The other part was in updating the documentation, so I've created a [document](https://github.com/korzio/djv/blob/master/CONTRIBUTING.md) with a few guides how-to debug and release the package. It will be updated in future.

Great thanks for all comments and participation.

## 1.1.0 <a name="1.1.0"></a>

The release contains
- 2 features of a custom error format and adding formatters into environment
- a big refactoring of utils and cleaning the structure
- a few bug fixes (with a huge improvement of pending internals schemas)

Here is the log for release - https://github.com/korzio/djv/issues/26
Changelog - https://github.com/korzio/djv/blob/master/CHANGELOG.md
Great thanks for all comments and participants.