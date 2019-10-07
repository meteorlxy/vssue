## [1.1.1](https://github.com/meteorlxy/vssue/compare/v1.1.0...v1.1.1) (2019-10-07)


### Bug Fixes

* **api-github-v3:** use quotation marks for queries ([b7a56f2](https://github.com/meteorlxy/vssue/commit/b7a56f2))



# [1.1.0](https://github.com/meteorlxy/vssue/compare/v1.0.3...v1.1.0) (2019-09-24)


### Bug Fixes

* **api-gitee-v5:** get comments count from headers ([#46](https://github.com/meteorlxy/vssue/issues/46)) ([b07d745](https://github.com/meteorlxy/vssue/commit/b07d745))
* **api-gitee-v5:** reject axios error as is ([acad392](https://github.com/meteorlxy/vssue/commit/acad392))


### Features

* **api-github-v4:** edit and delete comments ([aeb1a3f](https://github.com/meteorlxy/vssue/commit/aeb1a3f))



## [1.0.3](https://github.com/meteorlxy/vssue/compare/v1.0.2...v1.0.3) (2019-08-31)


### Bug Fixes

* **vssue:** better style of select element ([#56](https://github.com/meteorlxy/vssue/issues/56)) ([f2182fb](https://github.com/meteorlxy/vssue/commit/f2182fb))
* **vssue:** typo in zh-CN translation ([#50](https://github.com/meteorlxy/vssue/issues/50)) ([c14b9f3](https://github.com/meteorlxy/vssue/commit/c14b9f3))



## [1.0.2](https://github.com/meteorlxy/vssue/compare/v1.0.1...v1.0.2) (2019-07-01)


### Bug Fixes

* **api-bitbucket-v2:** bitbucket user api deprecation ([656a664](https://github.com/meteorlxy/vssue/commit/656a664))



## [1.0.1](https://github.com/meteorlxy/vssue/compare/v1.0.0...v1.0.1) (2019-06-09)


### Bug Fixes

* **vssue:** ssr bug caused by v-if (close [#47](https://github.com/meteorlxy/vssue/issues/47)) ([d4af607](https://github.com/meteorlxy/vssue/commit/d4af607))



# [1.0.0](https://github.com/meteorlxy/vssue/compare/v0.10.0...v1.0.0) (2019-06-04)


### Bug Fixes

* **vssue:** disable submit button if issue is not ready (close [#45](https://github.com/meteorlxy/vssue/issues/45)) ([dd72b40](https://github.com/meteorlxy/vssue/commit/dd72b40))
* **vssue:** disable textarea if issue is not ready ([2ae723d](https://github.com/meteorlxy/vssue/commit/2ae723d))


### Features

* **api-gitee-v5:** get issue by title via search api ([8eb4ebe](https://github.com/meteorlxy/vssue/commit/8eb4ebe))
* **api-github-v3:** get issue by title via search api ([6e21aae](https://github.com/meteorlxy/vssue/commit/6e21aae))



# [0.10.0](https://github.com/meteorlxy/vssue/compare/v0.9.1...v0.10.0) (2019-05-23)


### Features

* **api-gitee-v5:** add gitee api v5 package ([#43](https://github.com/meteorlxy/vssue/issues/43)) ([3f0dde1](https://github.com/meteorlxy/vssue/commit/3f0dde1))
* **vssue:** support gitee api ([75e0210](https://github.com/meteorlxy/vssue/commit/75e0210))
* **vuepress-plugin-vssue:** add gitee api v5 ([98982cf](https://github.com/meteorlxy/vssue/commit/98982cf))



## [0.9.1](https://github.com/meteorlxy/vssue/compare/v0.9.0...v0.9.1) (2019-04-29)


### Bug Fixes

* **vssue:** wrong click handler of login button ([64a868d](https://github.com/meteorlxy/vssue/commit/64a868d))



# [0.9.0](https://github.com/meteorlxy/vssue/compare/v0.8.2...v0.9.0) (2019-04-29)


### Bug Fixes

* **api-bitbucket-v2:** kind and response of post-issue ([ed8ed76](https://github.com/meteorlxy/vssue/commit/ed8ed76))
* **vssue:** always show the top pagination ([349e75c](https://github.com/meteorlxy/vssue/commit/349e75c))
* **vssue:** pluralization with zero comments ([f68c26d](https://github.com/meteorlxy/vssue/commit/f68c26d))
* **vssue:** vue-i18n pluralization and tweaks ([69fba8c](https://github.com/meteorlxy/vssue/commit/69fba8c))


### Features

* **vssue:** click to create issue (close [#35](https://github.com/meteorlxy/vssue/issues/35)) ([25d16b4](https://github.com/meteorlxy/vssue/commit/25d16b4))



## [0.8.2](https://github.com/meteorlxy/vssue/compare/v0.8.1...v0.8.2) (2019-03-29)


### Features

* **vssue:** add language ja-JP ([#23](https://github.com/meteorlxy/vssue/issues/23)) ([4d3c9b9](https://github.com/meteorlxy/vssue/commit/4d3c9b9))



## [0.8.1](https://github.com/meteorlxy/vssue/compare/v0.8.0...v0.8.1) (2019-03-23)


### Bug Fixes

* **api-bitbucket-v2:** filter empty comments ([17a4da8](https://github.com/meteorlxy/vssue/commit/17a4da8))
* **apt-github-v3:** support closed issues ([ea7c1c0](https://github.com/meteorlxy/vssue/commit/ea7c1c0))


### Features

* **vssue:** add auto-create-issue option ([47cd4d3](https://github.com/meteorlxy/vssue/commit/47cd4d3))



# [0.8.0](https://github.com/meteorlxy/vssue/compare/v0.7.5...v0.8.0) (2019-03-23)


### Bug Fixes

* **utils:** get correct clean url when hash only ([c53fcfb](https://github.com/meteorlxy/vssue/commit/c53fcfb))


### Features

* **api-bitbucket-v2, api-gitlab-v4:** use implicit grant type (close [#22](https://github.com/meteorlxy/vssue/issues/22)) ([78e6535](https://github.com/meteorlxy/vssue/commit/78e6535))



## [0.7.5](https://github.com/meteorlxy/vssue/compare/v0.7.4...v0.7.5) (2019-03-06)


### Features

* **vssue:** provide non-polyfill builds ([ccc435f](https://github.com/meteorlxy/vssue/commit/ccc435f))



## [0.7.4](https://github.com/meteorlxy/vssue/compare/v0.7.3...v0.7.4) (2019-02-27)


### Bug Fixes

* **vuepress-plugin-vssue:** avoid mutating options object ([331f272](https://github.com/meteorlxy/vssue/commit/331f272))


### Features

* **vssue:** add language pt-BR ([#19](https://github.com/meteorlxy/vssue/issues/19)) ([9a1eefa](https://github.com/meteorlxy/vssue/commit/9a1eefa)) (thanks to [@tgmti](https://github.com/tgmti))


## [0.7.3](https://github.com/meteorlxy/vssue/compare/v0.7.2...v0.7.3) (2019-02-24)


### Bug Fixes

* **vssue:** import vue-i18n in types file ([208b1ef](https://github.com/meteorlxy/vssue/commit/208b1ef))


### Performance Improvements

* **vssue:** better border when focus on textarea ([0ee3858](https://github.com/meteorlxy/vssue/commit/0ee3858))



## [0.7.2](https://github.com/meteorlxy/vssue/compare/v0.7.1...v0.7.2) (2019-02-22)


### Features

* **vssue:** allow admins delete comments ([d3ad13f](https://github.com/meteorlxy/vssue/commit/d3ad13f))



## [0.7.1](https://github.com/meteorlxy/vssue/compare/v0.7.0...v0.7.1) (2019-02-19)


### Features

* **vssue:** allow issue-content use async function ([59a5c50](https://github.com/meteorlxy/vssue/commit/59a5c50))



# [0.7.0](https://github.com/meteorlxy/vssue/compare/v0.6.1...v0.7.0) (2019-02-18)


### Features

* **vssue:** add issue-content option ([#10](https://github.com/meteorlxy/vssue/issues/10)) ([df99108](https://github.com/meteorlxy/vssue/commit/df99108))



## [0.6.1](https://github.com/meteorlxy/vssue/compare/v0.6.0...v0.6.1) (2019-02-18)


### Bug Fixes

* **vssue:** do not re-init when options are changed (close [#12](https://github.com/meteorlxy/vssue/issues/12)) ([3afc61a](https://github.com/meteorlxy/vssue/commit/3afc61a))



# [0.6.0](https://github.com/meteorlxy/vssue/compare/v0.5.3...v0.6.0) (2019-02-06)


### Features

* add proxy option ([65a0ee1](https://github.com/meteorlxy/vssue/commit/65a0ee1))



## [0.5.3](https://github.com/meteorlxy/vssue/compare/v0.5.2...v0.5.3) (2019-02-01)


### Bug Fixes

* **vssue:** make button background transparent ([0cded76](https://github.com/meteorlxy/vssue/commit/0cded76))


### Features

* **api-github-v3:** support github enterprise server ([c7b661d](https://github.com/meteorlxy/vssue/commit/c7b661d))
* **api-github-v4:** support github enterprise server ([999808a](https://github.com/meteorlxy/vssue/commit/999808a))



## [0.5.2](https://github.com/meteorlxy/vssue/compare/v0.5.1...v0.5.2) (2019-01-24)


### Bug Fixes

* **vssue:** force reload comments after deleting a comment (close [#4](https://github.com/meteorlxy/vssue/issues/4)) ([0e33160](https://github.com/meteorlxy/vssue/commit/0e33160))



## [0.5.1](https://github.com/meteorlxy/vssue/compare/v0.5.0...v0.5.1) (2019-01-21)


### Features

* **api-github-v4:** add github v4 api package ([433aa98](https://github.com/meteorlxy/vssue/commit/433aa98))



# [0.5.0](https://github.com/meteorlxy/vssue/compare/v0.4.3...v0.5.0) (2019-01-12)


### Features

* **vssue:** support i18n ([9a8f211](https://github.com/meteorlxy/vssue/commit/9a8f211))
* **vuepress-plugin-vssue:** auto detect locales ([c5ccb84](https://github.com/meteorlxy/vssue/commit/c5ccb84))
