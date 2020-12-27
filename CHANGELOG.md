#### 2.1.4 (2020-12-27)

##### Chores

* **npm:**  regenerate package lock ([46bfdbe8](https://github.com/korzio/djv/commit/46bfdbe86fe821e9bb4ed9b39ea1830840204742))
* **code:**  Move clear decode function to outer scope ([5e65fda4](https://github.com/korzio/djv/commit/5e65fda4edbaa7a7495fd759fb5ab942fa06308f))

#### 2.1.2 (2019-03-06)

##### Other Changes

*  Update package version to 2.1.2 [#76](https://github.com/korzio/djv/pull/76) ([9b40c9d5](https://github.com/korzio/djv/commit/9b40c9d5ae50ce0d1324b5b25d3d9f8b8169882e))
*  Fix required validator throwing on null values [#75](https://github.com/korzio/djv/pull/76)

#### 2.1.1 (2018-09-04)

##### Other Changes

*  Update package version to 2.1.1 [#69](https://github.com/korzio/djv/pull/69) ([44190e9d](https://github.com/korzio/djv/commit/44190e9d9fab723942d93cc34a36c22e85c0b11d))

[Add `browser` field](https://docs.npmjs.com/files/package.json#browser)

#### 2.1.0 (2018-06-24)

##### New Features

* **error code** [BREAKING CHANGE] Change default error handlers to output error objects instead of strings ([#54](https://github.com/korzio/djv/commit/014a38285ede3e26455bb07c02d1613541892897))

##### Other Changes

* Update package version to 2.1.0 [#65](https://github.com/korzio/djv/pull/65) ([6fd3445f](https://github.com/korzio/djv/commit/6fd3445f3a7374d186a2519f068826a76e0887ea))

#### 2.0.0 (2017-10-10)

##### New Features

* **env** [BREAKING CHANGE] Make schema v6 default #48 ([bd1d4cae](https://github.com/korzio/djv/commit/bd1d4cae9d275c188536d37d721236745c4a1dc2))

##### Documentation Changes

* **api** Add auto-generated docs #48 ([440ff67d](https://github.com/korzio/djv/commit/440ff67d84aad429ab5a334aed384f59c5a96aa7))
* **site** Add index documentation page #48 ([cb4db59b](https://github.com/korzio/djv/commit/cb4db59b1db66f5107a834b236ad461e04e3e6cb))
* **env** Add environment section to describe options ([5e0e1a91](https://github.com/korzio/djv/commit/5e0e1a91e1eead2942032545e220e44f24c87dfd))

#### 1.2.0 (2017-09-25)

##### Documentation Changes

* **npm:** Remove docs folder from npm files #51 ([d5d2a8de](https://github.com/korzio/djv/commit/d5d2a8decd75db3351734ba25175b98533ca2d75))
* **readme:** Update v6 support #51 ([2ec9d7f0](https://github.com/korzio/djv/commit/2ec9d7f0abe53edb5b0e0c2d23b0747dd1cafbca))
* **const:** Add const documentation #51 ([b7f0355d](https://github.com/korzio/djv/commit/b7f0355d61e048d88ee485007d006f47831de0c9))
* **state:**
  * Fix state documentation #51 ([7a000072](https://github.com/korzio/djv/commit/7a000072b038bf6ffa3a4d0c98252c739fecd7c3))
  * Add resolution exampes #41 ([a89658c0](https://github.com/korzio/djv/commit/a89658c07dfb65848920425404e278b5c099eaa7))
  * Add state description #41 ([ff1b7a75](https://github.com/korzio/djv/commit/ff1b7a75392e807098c29d0a719b99cdb1f596d6))
* **todo:** Add todo for draft-06 #41 ([4fa64971](https://github.com/korzio/djv/commit/4fa64971c550fa558fda3031c93bd62ef061a7aa))
* **contribute:** Change tests debug description ([b0d03069](https://github.com/korzio/djv/commit/b0d03069c24c462cee82c8c6b5c78baeb4cc4f41))
* **contributing:**
  * Fix version ([351a8eb8](https://github.com/korzio/djv/commit/351a8eb88648b2939ecc7e6a87c9c6ce1f762f1d))
  * Fix typo ([66b62f3e](https://github.com/korzio/djv/commit/66b62f3eab75768403eae9682bb49ebf859f99eb))
  * Add release branch MR description ([faf53856](https://github.com/korzio/djv/commit/faf538564894a47d386e621b7de8a21602020052))
* **release:** Add table of contents, update release contributing #35 ([2f69a166](https://github.com/korzio/djv/commit/2f69a1660c3d882bc783e42dbd8ea45e7173d824))
* Update api docs, format utils ([11cae181](https://github.com/korzio/djv/commit/11cae1815de6f786abc24a71616eb50e18b2beaf))

##### New Features

* **id:** Add $id, examples keywords #44 ([1ef4745f](https://github.com/korzio/djv/commit/1ef4745f1658857c6c132264b8319fdaa73ccbcc))
* **format:** Add uri formats #44 ([79802269](https://github.com/korzio/djv/commit/79802269650e530228f2719497ddda165acfba81))
* **validator:**
  * Add json-pointer format #44 ([7a522f8a](https://github.com/korzio/djv/commit/7a522f8a9da29504190140329d12faf0aa29d4c5))
  * Add propertyNames validator #44 ([5ad9d343](https://github.com/korzio/djv/commit/5ad9d343575558be0e6a69bd2420b958e1d4dc00))
  * Add const validator #44 ([1d4fa106](https://github.com/korzio/djv/commit/1d4fa10656d4bb7caffd2fd9b598ecfccf1d71eb))
  * Add contains validator #44 ([8ecf27d8](https://github.com/korzio/djv/commit/8ecf27d81621b7638e6199c75c1ab623f47561ec))
* **validators:** Add useVersion method to change environment version; Add exlusive maximum/minimum properties #44 ([f57f9116](https://github.com/korzio/djv/commit/f57f9116204ad0f9f4126a81e6ead89bbce25f58))

##### Bug Fixes

* **test:**
  * Add name json mock data to test environment #41 ([c1d0e13b](https://github.com/korzio/djv/commit/c1d0e13bb50ccab189e88b7f6d6e2568c47a3770))
* **rename:** Rename template resolve to link as in state #41 ([34fc6e4d](https://github.com/korzio/djv/commit/34fc6e4d3f378a82378244a354817cd9ec4a6e3e))
* **format:** Add regex, fix uri formatters #44 ([757397d7](https://github.com/korzio/djv/commit/757397d7fb1a698a92953596804cf37d28b325d1))
* **draft-06:**
  * Move validators to patch environment #44 ([9f7412bc](https://github.com/korzio/djv/commit/9f7412bc3ed8148d119b729cf30b6f8d4c7fbb82))
  * Fix properties strict type check #44 ([f663f7ba](https://github.com/korzio/djv/commit/f663f7ba6285ed04575050ac9d27eb4509420c01))
* **boolean:** Fix transform default schema ([69488621](https://github.com/korzio/djv/commit/694886218a5f1330d5c49671d88932b645185b95))
* **tests:** Add isSchema, transformSchema utilities for boolean schema presentation #44 ([cb48a2a1](https://github.com/korzio/djv/commit/cb48a2a1da27a7a9c1c373a412b2c0624b8f8f7d))
* **validator:** Add not array required check #44 ([83b01279](https://github.com/korzio/djv/commit/83b01279824698d783aedc8c39b0b434c404f22b))

##### Other Changes

* **state:** Fix skip describe for jasmine #41 ([52ffd0c7](https://github.com/korzio/djv/commit/52ffd0c7f500bf793dfd26df6b46a6551b7ef328))
* **debug:** Add console output if error is thrown ([6b61a465](https://github.com/korzio/djv/commit/6b61a4657668fbee616acf1a7092cfc4a9c53a4c))
* Add draft-06 tests; Switch to json schema test package #44 ([1a9ce7e7](https://github.com/korzio/djv/commit/1a9ce7e77b200fb475735997928edc378e9caf19))

##### Refactors

* **files:**
  * Clean code; Remove deprecated #51 ([b815f6dc](https://github.com/korzio/djv/commit/b815f6dcafa1b40f13895b1ffb3d348dff4ed2b4))
  * Clean code; Split utils to uri and schema; Move transforms to environment #51 ([7c497fb5](https://github.com/korzio/djv/commit/7c497fb50613680afec2b011a1a46012c0c7b247))
* **performance:** Clean code; Change uri keys utils; Rewrite state resolution id algorithm to not use multiple functions calls #51 ([1fe9339d](https://github.com/korzio/djv/commit/1fe9339d4fefdcbaf75b54e3df53c9c1b5a08f06))
* **state:**
  * Clean code; Change cleanId to head #51 ([465749a4](https://github.com/korzio/djv/commit/465749a4c48bab74d34158b15abaacdd44ffdb17))
  * Add draft-06 meta schema to tests; Add uriKeys variable to contain id/$id changes; Fix boolean schema descend resolution #41 ([01b37316](https://github.com/korzio/djv/commit/01b37316529752a1fe982f3028bf9065b5a5fbc1))
  * Move descend to state; Fix intermediate ids resolution #41 ([ad70e8e7](https://github.com/korzio/djv/commit/ad70e8e775a6834034a1e17a6052eeb9c3b2b47b))
  * Fix uri utils regexps #41 ([0df12100](https://github.com/korzio/djv/commit/0df121002385e679a9dfe339f7c2ce66a5e2d86c))
  * Fix ignore other properties in $ref schemas; Clean schemas stack after visit #41 ([fe85a55b](https://github.com/korzio/djv/commit/fe85a55b49b8acb6a9013f452a6cb4554a03dd07))
  * Add reference schema resolution; Add resolution by id #41 ([64d9ba5e](https://github.com/korzio/djv/commit/64d9ba5e1dacc4b61c2e561290564bbb372c6635))
  * Simplify resolution; Rename descend utils  #41 ([c55f3af6](https://github.com/korzio/djv/commit/c55f3af6cc96e11909c28648164e105e450866c5))
* **validators:**
  * Change hasOwnProperty usage; Add checks for boolean schemas #44 ([af5fcc75](https://github.com/korzio/djv/commit/af5fcc755788215b9c6f26f09a3aee7ae72c760d))

##### Code Style Changes

* **state:** Normalize if-else utils clauses #41 ([b9b11e29](https://github.com/korzio/djv/commit/b9b11e2996607ffe566f33ecd5ab4409bec9f280))

##### Tests

* **properties:** Add check for object type #44 ([3fb8bcbb](https://github.com/korzio/djv/commit/3fb8bcbb56b8915bef2e492524eb1bc8387d75aa))

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
