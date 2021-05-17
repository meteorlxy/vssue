## [1.4.8](https://github.com/meteorlxy/vssue/compare/v1.4.7...v1.4.8) (2021-04-23)

### Bug Fixes

- **vssue:** switch default cors proxy (close [#130](https://github.com/meteorlxy/vssue/issues/130), close [#131](https://github.com/meteorlxy/vssue/issues/131)) ([b80aba7](https://github.com/meteorlxy/vssue/commit/b80aba7977a0156892c940c2e5a7b7078118b8a4))

## [1.4.7](https://github.com/meteorlxy/vssue/compare/v1.4.6...v1.4.7) (2021-01-06)

## [1.4.6](https://github.com/meteorlxy/vssue/compare/v1.4.5...v1.4.6) (2020-05-25)

### Performance Improvements

- **vssue:** improve accessibility (close [#96](https://github.com/meteorlxy/vssue/issues/96)) ([270b110](https://github.com/meteorlxy/vssue/commit/270b11056fb03035867ecc0b1d42affdb29d8020))

## [1.4.5](https://github.com/meteorlxy/vssue/compare/v1.4.4...v1.4.5) (2020-05-19)

### Bug Fixes

- **vssue:** add alt for use avatar (close [#95](https://github.com/meteorlxy/vssue/issues/95)) ([f5b721c](https://github.com/meteorlxy/vssue/commit/f5b721c658881e8ea25158f1a0f1a3e3fb1e00b5))
- **vssue:** use div tag for transition group (close [#95](https://github.com/meteorlxy/vssue/issues/95)) ([b229602](https://github.com/meteorlxy/vssue/commit/b229602b7e824cd69113de858d0d698893070176))

## [1.4.4](https://github.com/meteorlxy/vssue/compare/v1.4.3...v1.4.4) (2020-05-06)

### Bug Fixes

- **api-gitea-v1:** add timestamp to avoid caching ([5ce7114](https://github.com/meteorlxy/vssue/commit/5ce711404426986f4e286ce3d2f1db53bb5b4c1d))
- **api-gitee-v5:** add timestamp to avoid caching ([e28ab03](https://github.com/meteorlxy/vssue/commit/e28ab03c69c449392de5156241311d41be5511ff))
- **api-github-v3:** add timestamp to avoid caching (close [#91](https://github.com/meteorlxy/vssue/issues/91)) ([0ba5fd4](https://github.com/meteorlxy/vssue/commit/0ba5fd46752f5ca43ba22909d2a6c08b76269e36))

## [1.4.3](https://github.com/meteorlxy/vssue/compare/v1.4.2...v1.4.3) (2020-03-26)

### Bug Fixes

- **api-github-v3:** handle 403 rate limit exceeded error ([4389035](https://github.com/meteorlxy/vssue/commit/438903509c7b26a87d90acdff0f4a83588bc930b))
- **api-github-v3:** migrate deprecated delete reaction api ([5b52896](https://github.com/meteorlxy/vssue/commit/5b5289684c84bb58818caef2718056d588e50c58))

## [1.4.2](https://github.com/meteorlxy/vssue/compare/v1.4.1...v1.4.2) (2020-01-03)

### Bug Fixes

- **api-gitea-v1:** get content and reactions after put-comment ([bcdcb56](https://github.com/meteorlxy/vssue/commit/bcdcb5606460387dbafb25b1a7fbc8a4ada245b9))

## [1.4.1](https://github.com/meteorlxy/vssue/compare/v1.4.0...v1.4.1) (2020-01-03)

### Bug Fixes

- **api-gitea-v1:** correct status code of post-reaction ([a76b07c](https://github.com/meteorlxy/vssue/commit/a76b07c46a2a5b4282170631b79cea7dedbcdd40))
- **vuepress-plugin-vssue:** disable import-helpers ([75f1507](https://github.com/meteorlxy/vssue/commit/75f150706458498b11701eace38a51c931e2dcf1))

# [1.4.0](https://github.com/meteorlxy/vssue/compare/v1.3.0...v1.4.0) (2020-01-03)

### Features

- **api-gitea-v1:** delete reaction if already token ([9e28bb8](https://github.com/meteorlxy/vssue/commit/9e28bb878c57fe5044e1a547ce4e4aea69946383))
- **api-github-v3:** delete reaction if already token ([33ecf23](https://github.com/meteorlxy/vssue/commit/33ecf238a7cdf33903606927bdaba121bdc7fd5b))
- add api response types ([660697f](https://github.com/meteorlxy/vssue/commit/660697fe84f88bc422d7be898753a57e04eae10b))

# [1.3.0](https://github.com/meteorlxy/vssue/compare/v1.2.2...v1.3.0) (2019-12-31)

### Features

- **api-gitea-v1:** add gitea api v1 package ([b905e34](https://github.com/meteorlxy/vssue/commit/b905e34))
- **vssue:** add gitea api v1 package ([f6792f3](https://github.com/meteorlxy/vssue/commit/f6792f3))

## [1.2.2](https://github.com/meteorlxy/vssue/compare/v1.2.1...v1.2.2) (2019-11-19)

### Bug Fixes

- **vssue:** avoid side effect in beforeMount hook ([ec99580](https://github.com/meteorlxy/vssue/commit/ec99580))

## [1.2.1](https://github.com/meteorlxy/vssue/compare/v1.2.0...v1.2.1) (2019-11-07)

### Bug Fixes

- **api-github-v4:** store issue node-id when using issue-id ([8f2065d](https://github.com/meteorlxy/vssue/commit/8f2065d))

# [1.2.0](https://github.com/meteorlxy/vssue/compare/v1.1.2...v1.2.0) (2019-10-11)

### Bug Fixes

- **api-github-v4:** workaround for deleted user ([2b3d5d2](https://github.com/meteorlxy/vssue/commit/2b3d5d2))
- **api-github-v4:** wrong issue link after create new issue ([ae43ba0](https://github.com/meteorlxy/vssue/commit/ae43ba0))

### Features

- **api-github-v4:** get issue by title via search api ([8713fca](https://github.com/meteorlxy/vssue/commit/8713fca))
- **api-github-v4:** use graphql to post comments ([e807685](https://github.com/meteorlxy/vssue/commit/e807685))
- **vssue:** add he-IL language and RTL support ([#64](https://github.com/meteorlxy/vssue/issues/64)) ([2b843e7](https://github.com/meteorlxy/vssue/commit/2b843e7))
- **vuepress-plugin-vssue:** support github-v4 ([d0b7171](https://github.com/meteorlxy/vssue/commit/d0b7171))

## [1.1.2](https://github.com/meteorlxy/vssue/compare/v1.1.1...v1.1.2) (2019-10-07)

### Bug Fixes

- **api-github-v3:** remove page limitation when searching issues ([669dd0f](https://github.com/meteorlxy/vssue/commit/669dd0f))

## [1.1.1](https://github.com/meteorlxy/vssue/compare/v1.1.0...v1.1.1) (2019-10-07)

### Bug Fixes

- **api-github-v3:** use quotation marks for queries ([b7a56f2](https://github.com/meteorlxy/vssue/commit/b7a56f2))

# [1.1.0](https://github.com/meteorlxy/vssue/compare/v1.0.3...v1.1.0) (2019-09-24)

### Bug Fixes

- **api-gitee-v5:** get comments count from headers ([#46](https://github.com/meteorlxy/vssue/issues/46)) ([b07d745](https://github.com/meteorlxy/vssue/commit/b07d745))
- **api-gitee-v5:** reject axios error as is ([acad392](https://github.com/meteorlxy/vssue/commit/acad392))

### Features

- **api-github-v4:** edit and delete comments ([aeb1a3f](https://github.com/meteorlxy/vssue/commit/aeb1a3f))

## [1.0.3](https://github.com/meteorlxy/vssue/compare/v1.0.2...v1.0.3) (2019-08-31)

### Bug Fixes

- **vssue:** better style of select element ([#56](https://github.com/meteorlxy/vssue/issues/56)) ([f2182fb](https://github.com/meteorlxy/vssue/commit/f2182fb))
- **vssue:** typo in zh-CN translation ([#50](https://github.com/meteorlxy/vssue/issues/50)) ([c14b9f3](https://github.com/meteorlxy/vssue/commit/c14b9f3))

## [1.0.2](https://github.com/meteorlxy/vssue/compare/v1.0.1...v1.0.2) (2019-07-01)

### Bug Fixes

- **api-bitbucket-v2:** bitbucket user api deprecation ([656a664](https://github.com/meteorlxy/vssue/commit/656a664))

## [1.0.1](https://github.com/meteorlxy/vssue/compare/v1.0.0...v1.0.1) (2019-06-09)

### Bug Fixes

- **vssue:** ssr bug caused by v-if (close [#47](https://github.com/meteorlxy/vssue/issues/47)) ([d4af607](https://github.com/meteorlxy/vssue/commit/d4af607))

# [1.0.0](https://github.com/meteorlxy/vssue/compare/v0.10.0...v1.0.0) (2019-06-04)

### Bug Fixes

- **vssue:** disable submit button if issue is not ready (close [#45](https://github.com/meteorlxy/vssue/issues/45)) ([dd72b40](https://github.com/meteorlxy/vssue/commit/dd72b40))
- **vssue:** disable textarea if issue is not ready ([2ae723d](https://github.com/meteorlxy/vssue/commit/2ae723d))

### Features

- **api-gitee-v5:** get issue by title via search api ([8eb4ebe](https://github.com/meteorlxy/vssue/commit/8eb4ebe))
- **api-github-v3:** get issue by title via search api ([6e21aae](https://github.com/meteorlxy/vssue/commit/6e21aae))

# [0.10.0](https://github.com/meteorlxy/vssue/compare/v0.9.1...v0.10.0) (2019-05-23)

### Features

- **api-gitee-v5:** add gitee api v5 package ([#43](https://github.com/meteorlxy/vssue/issues/43)) ([3f0dde1](https://github.com/meteorlxy/vssue/commit/3f0dde1))
- **vssue:** support gitee api ([75e0210](https://github.com/meteorlxy/vssue/commit/75e0210))
- **vuepress-plugin-vssue:** add gitee api v5 ([98982cf](https://github.com/meteorlxy/vssue/commit/98982cf))

## [0.9.1](https://github.com/meteorlxy/vssue/compare/v0.9.0...v0.9.1) (2019-04-29)

### Bug Fixes

- **vssue:** wrong click handler of login button ([64a868d](https://github.com/meteorlxy/vssue/commit/64a868d))

# [0.9.0](https://github.com/meteorlxy/vssue/compare/v0.8.2...v0.9.0) (2019-04-29)

### Bug Fixes

- **api-bitbucket-v2:** kind and response of post-issue ([ed8ed76](https://github.com/meteorlxy/vssue/commit/ed8ed76))
- **vssue:** always show the top pagination ([349e75c](https://github.com/meteorlxy/vssue/commit/349e75c))
- **vssue:** pluralization with zero comments ([f68c26d](https://github.com/meteorlxy/vssue/commit/f68c26d))
- **vssue:** vue-i18n pluralization and tweaks ([69fba8c](https://github.com/meteorlxy/vssue/commit/69fba8c))

### Features

- **vssue:** click to create issue (close [#35](https://github.com/meteorlxy/vssue/issues/35)) ([25d16b4](https://github.com/meteorlxy/vssue/commit/25d16b4))

## [0.8.2](https://github.com/meteorlxy/vssue/compare/v0.8.1...v0.8.2) (2019-03-29)

### Features

- **vssue:** add language ja-JP ([#23](https://github.com/meteorlxy/vssue/issues/23)) ([4d3c9b9](https://github.com/meteorlxy/vssue/commit/4d3c9b9))

## [0.8.1](https://github.com/meteorlxy/vssue/compare/v0.8.0...v0.8.1) (2019-03-23)

### Bug Fixes

- **api-bitbucket-v2:** filter empty comments ([17a4da8](https://github.com/meteorlxy/vssue/commit/17a4da8))
- **apt-github-v3:** support closed issues ([ea7c1c0](https://github.com/meteorlxy/vssue/commit/ea7c1c0))

### Features

- **vssue:** add auto-create-issue option ([47cd4d3](https://github.com/meteorlxy/vssue/commit/47cd4d3))

# [0.8.0](https://github.com/meteorlxy/vssue/compare/v0.7.5...v0.8.0) (2019-03-23)

### Bug Fixes

- **utils:** get correct clean url when hash only ([c53fcfb](https://github.com/meteorlxy/vssue/commit/c53fcfb))

### Features

- **api-bitbucket-v2, api-gitlab-v4:** use implicit grant type (close [#22](https://github.com/meteorlxy/vssue/issues/22)) ([78e6535](https://github.com/meteorlxy/vssue/commit/78e6535))

## [0.7.5](https://github.com/meteorlxy/vssue/compare/v0.7.4...v0.7.5) (2019-03-06)

### Features

- **vssue:** provide non-polyfill builds ([ccc435f](https://github.com/meteorlxy/vssue/commit/ccc435f))

## [0.7.4](https://github.com/meteorlxy/vssue/compare/v0.7.3...v0.7.4) (2019-02-27)

### Bug Fixes

- **vuepress-plugin-vssue:** avoid mutating options object ([331f272](https://github.com/meteorlxy/vssue/commit/331f272))

### Features

- **vssue:** add language pt-BR ([#19](https://github.com/meteorlxy/vssue/issues/19)) ([9a1eefa](https://github.com/meteorlxy/vssue/commit/9a1eefa)) (thanks to [@tgmti](https://github.com/tgmti))

## [0.7.3](https://github.com/meteorlxy/vssue/compare/v0.7.2...v0.7.3) (2019-02-24)

### Bug Fixes

- **vssue:** import vue-i18n in types file ([208b1ef](https://github.com/meteorlxy/vssue/commit/208b1ef))

### Performance Improvements

- **vssue:** better border when focus on textarea ([0ee3858](https://github.com/meteorlxy/vssue/commit/0ee3858))

## [0.7.2](https://github.com/meteorlxy/vssue/compare/v0.7.1...v0.7.2) (2019-02-22)

### Features

- **vssue:** allow admins delete comments ([d3ad13f](https://github.com/meteorlxy/vssue/commit/d3ad13f))

## [0.7.1](https://github.com/meteorlxy/vssue/compare/v0.7.0...v0.7.1) (2019-02-19)

### Features

- **vssue:** allow issue-content use async function ([59a5c50](https://github.com/meteorlxy/vssue/commit/59a5c50))

# [0.7.0](https://github.com/meteorlxy/vssue/compare/v0.6.1...v0.7.0) (2019-02-18)

### Features

- **vssue:** add issue-content option ([#10](https://github.com/meteorlxy/vssue/issues/10)) ([df99108](https://github.com/meteorlxy/vssue/commit/df99108))

## [0.6.1](https://github.com/meteorlxy/vssue/compare/v0.6.0...v0.6.1) (2019-02-18)

### Bug Fixes

- **vssue:** do not re-init when options are changed (close [#12](https://github.com/meteorlxy/vssue/issues/12)) ([3afc61a](https://github.com/meteorlxy/vssue/commit/3afc61a))

# [0.6.0](https://github.com/meteorlxy/vssue/compare/v0.5.3...v0.6.0) (2019-02-06)

### Features

- add proxy option ([65a0ee1](https://github.com/meteorlxy/vssue/commit/65a0ee1))

## [0.5.3](https://github.com/meteorlxy/vssue/compare/v0.5.2...v0.5.3) (2019-02-01)

### Bug Fixes

- **vssue:** make button background transparent ([0cded76](https://github.com/meteorlxy/vssue/commit/0cded76))

### Features

- **api-github-v3:** support github enterprise server ([c7b661d](https://github.com/meteorlxy/vssue/commit/c7b661d))
- **api-github-v4:** support github enterprise server ([999808a](https://github.com/meteorlxy/vssue/commit/999808a))

## [0.5.2](https://github.com/meteorlxy/vssue/compare/v0.5.1...v0.5.2) (2019-01-24)

### Bug Fixes

- **vssue:** force reload comments after deleting a comment (close [#4](https://github.com/meteorlxy/vssue/issues/4)) ([0e33160](https://github.com/meteorlxy/vssue/commit/0e33160))

## [0.5.1](https://github.com/meteorlxy/vssue/compare/v0.5.0...v0.5.1) (2019-01-21)

### Features

- **api-github-v4:** add github v4 api package ([433aa98](https://github.com/meteorlxy/vssue/commit/433aa98))

# [0.5.0](https://github.com/meteorlxy/vssue/compare/v0.4.3...v0.5.0) (2019-01-12)

### Features

- **vssue:** support i18n ([9a8f211](https://github.com/meteorlxy/vssue/commit/9a8f211))
- **vuepress-plugin-vssue:** auto detect locales ([c5ccb84](https://github.com/meteorlxy/vssue/commit/c5ccb84))
