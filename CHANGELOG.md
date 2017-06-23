#### 1.1.0 (2017-6-16)

##### New Features

* **error:** Add ability to customize error handler #16 ([3b6b69ee](https://github.com/korzio/djv/commit/3b6b69ee2527685f9404ad9cb332697ccd9f5f2e))
* **format:** Add custom formatter for environment, unite generate and state in one file ([3dd47aeb](https://github.com/korzio/djv/commit/3dd47aebdbfcaabef3252e7ff7f2f18ef4cb346b))

##### Bug Fixes

* **environment:** Add clean id method #20 ([b9bfc527](https://github.com/korzio/djv/commit/b9bfc52783579f9c21e276c569956863f9c99458))
* **state:** Add deferred schema resolution for loop references #13 ([b818df12](https://github.com/korzio/djv/commit/b818df122e801dd2dc92f39fba6d6e3906c1aadf))

##### Other Changes

* **readme:** Add addFormat description #15 ([7878ff95](https://github.com/korzio/djv/commit/7878ff95830ae3772e8175a7ab55c86446d27677))
* Add throw test; Change register draft ([dd6662d9](https://github.com/korzio/djv/commit/dd6662d9d09a25d874940db91d8402fae65594cc))
* Add documentation for utilties #13 ([867fe41b](https://github.com/korzio/djv/commit/867fe41b988eaf20c850955a01fa79c36c6f8c53))
* Refactor coupled generate ([495d8ac0](https://github.com/korzio/djv/commit/495d8ac062467108392b72ce24f9ba47e9c2eb52))
* Move resolve to state prototype ([bc1167d9](https://github.com/korzio/djv/commit/bc1167d992c37a608532964405355e5a35206139))
* Restructure utils, move to folder, split into files ([2de156de](https://github.com/korzio/djv/commit/2de156dee60be45417a7b9f31f35d9527d3bf1c3))
* Refactor inner toFunction, move to generate ([a9b7f6fe](https://github.com/korzio/djv/commit/a9b7f6fe09036751946397de4ae1b8ea0dcc3ed4))
* Separate state class ([192fdfd2](https://github.com/korzio/djv/commit/192fdfd294393a08e5b90663054276ff9de8f23c))
* Add generated functions entries cache ([8a84ece3](https://github.com/korzio/djv/commit/8a84ece328ab68ce1188105937b8549435d255c2))
* Clean visited state ([44fa0d45](https://github.com/korzio/djv/commit/44fa0d45f54cbff0631dd1ca29fe4f4eade778b1))
* Move static generate functions to utils ([8acc4059](https://github.com/korzio/djv/commit/8acc4059e0ea2bd359f7f92d558da98c4e1d8834))

##### Refactors

* **validators:** Separate property and format validators #15 ([910f7674](https://github.com/korzio/djv/commit/910f7674871444d148e45235a193bd85df405bfb))
* **state:**
  * Add generate method to state #13 ([ba6d18e9](https://github.com/korzio/djv/commit/ba6d18e94d8060c616d66c4ca92bbfda0fe2525b))
  * Make state use environment resolved object #13 ([79dce9db](https://github.com/korzio/djv/commit/79dce9db0b3517504d2d1c2cde0e03cd20e7791d))

##### Code Style Changes

* **utilities:** Clean utilities format #14 ([6c994916](https://github.com/korzio/djv/commit/6c994916aa619ac44505a57a3fafb679d2760b40))
* **template:**
  * Rename fn to tpl as in other places #15 ([85217a25](https://github.com/korzio/djv/commit/85217a25df97eff618043f18ef2055c3d3df22cb))
  * Rename template instance to tpl #13 ([def56c91](https://github.com/korzio/djv/commit/def56c91d3c4c321fd388aea18bdf43ec86c1fe4))
* **lint:** Temporary fix global require with lint comment ([489717fe](https://github.com/korzio/djv/commit/489717fe66e586368abdcebee1535e7617b84390))
* **comment:** Uncomment try catch for tests ([68db5919](https://github.com/korzio/djv/commit/68db59194d61acd8ea00b3aa2d2002de0c990a79))
