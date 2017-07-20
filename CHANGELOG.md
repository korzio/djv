#### 1.1.1 (2017-07-20)

##### Documentation Changes

* **contributing:**
  * Add benchmark suite debug description ([b0c05722](https://github.com/korzio/djv/commit/b0c05722c39477fc80fd95c189c6129ccc937c4e))
  * Add contributing rules file ([3a0db5b4](https://github.com/korzio/djv/commit/3a0db5b4b2f4b04f27a20f479eaee043069daf15))
* Fix text ([470ec0f0](https://github.com/korzio/djv/commit/470ec0f0f3ba5a3b0b31f8ca7b32bbd80baf0742))
* Change changelog package version ([f7f44e88](https://github.com/korzio/djv/commit/f7f44e8807cfe2b029e98961841edcdb3dae9c99))
* **error handle:** Fix example ([9b7a5545](https://github.com/korzio/djv/commit/9b7a554547e3cd1148f43c35d99ce3e1114a5983))

##### New Features

* **webpack:**
  * Add source maps, add manual test html, update docs #34 ([40ecd525](https://github.com/korzio/djv/commit/40ecd525e6f45d8a07282e424272e52de5826d8a))
  * Update webpack #34 ([73cfa621](https://github.com/korzio/djv/commit/73cfa621a8378fd61f5b74680e01522632f2d7fb))

##### Bug Fixes

* **utils:** Add type checking ([038d89a7](https://github.com/korzio/djv/commit/038d89a796ccbdac335fff6d143222da2a7db3ec))
* **validators:** Add required type object check ([4970bc5e](https://github.com/korzio/djv/commit/4970bc5ed1cf438db2dfae644ac62de682e14fbd))
* **items:** Add items is array check #29 ([d13cdcd2](https://github.com/korzio/djv/commit/d13cdcd27df4f59556dceb34a1ea5bfce5477475))
* **test:** Add latest suite tests ([323c9a0d](https://github.com/korzio/djv/commit/323c9a0ddb87ca748e473cc6d790494831290519))

##### Refactors

* **state:**
  * Handle circular self schema dependency ([7bbefcc5](https://github.com/korzio/djv/commit/7bbefcc56e9ef79468a937db91cb18a07fed1620))
  * Add resolution schema search ([05307fcc](https://github.com/korzio/djv/commit/05307fcc0458adfb16af87ad6df20102c0658bb9))
  * Add iterate through fragment even it is not a fragment ([068114c1](https://github.com/korzio/djv/commit/068114c19ca124cc63afca646c482345b34ced21))
  * Clean descent utils method ([fd18b7d8](https://github.com/korzio/djv/commit/fd18b7d8f7ccda0cb1084d27674cd7b0939dd581))
  * Move descent outside of the state ([3691b361](https://github.com/korzio/djv/commit/3691b36161dad7ab2a0945db324f660a0b3e0b7f))
  * Change domain to path usage in  url resolution ([856f1a52](https://github.com/korzio/djv/commit/856f1a52fe9162da45ac277ab7dfb72a38c34949))
  * Add full uri check for resolution purpose ([1bdf4e88](https://github.com/korzio/djv/commit/1bdf4e88f979c9885351dea5c7c3e61b1a510626))
  * Add experimental strategy to resolve state ([fb9c5a96](https://github.com/korzio/djv/commit/fb9c5a9608e705c93a4ae910e618aaacd429a6ea))
  * Change ascend method to solve parentSchema ([e366f3dc](https://github.com/korzio/djv/commit/e366f3dc8e29493cfd61038247fe4938adfbd813))
  * Draft rename resolution scope ([99aaea1e](https://github.com/korzio/djv/commit/99aaea1e22fff1c1fd59b9f5a9c2b9f1e82b0772))
  * Add join path utility ([8dc9cee2](https://github.com/korzio/djv/commit/8dc9cee2b6f7595b3e7d8559627fa35e2b36b301))

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
