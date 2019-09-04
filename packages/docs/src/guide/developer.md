# Developer Guide

Vssue is developed by [TypeScript](https://www.typescriptlang.org/), and the repository is organized as a monorepo by [lerna](https://github.com/lerna/lerna) and [yarn workspace](https://yarnpkg.com/en/docs/cli/workspace).

All the packages are located in the `packages/` directory:

- `vssue`: the main package of Vssue, containing the Vssue component.
- `docs`: the source code of [vssue.js.org](https://vssue.js.org), powered by [VuePress](https://github.com/vuejs/vuepress).
- `@vssue/api-{platform}-{version}`: the API packages for different platforms and different version of API.
- `@vssue/utils`: some util functions that used by Vssue and the API packages.
- `@vssue/vuepress-plugin-vssue`: the plugin for VuePress

## Develop

Clone the repo:

```sh
git clone https://github.com/meteorlxy/vssue.git
cd vssue
yarn
```

Vssue uses [vue-cli](https://cli.vuejs.org) for development, and [rollup](https://rollupjs.org) for production.

You should set the [Environment Variables](https://cli.vuejs.org/guide/mode-and-env.html) for your local development:

```sh
cp packages/vssue/.env.development packages/vssue/.env.development.local
```

Modify the content of `.env.development.local`:

```sh
VSSUE_PATH=src/main.ts
VSSUE_CSS_PATH=src/styles/index.styl

##
# env below should be overridden in .env.development.local
##

# the api package to develop
VSSUE_API=github-v3
# the oauth options
VUE_APP_OWNER=
VUE_APP_REPO=
VUE_APP_CLIENT_ID=
VUE_APP_CLIENT_SECRET=
# if set to true, will not call `Vue.use(Vssue)`, and only register Vssue Component
VUE_APP_ONLY_COMPONENT=false
```

You can check how these variables work in `packages/vssue/vue.config.js` and `packages/vssue/dev/main.ts`.

Run the dev script:

```sh
# For Vssue component
yarn dev
# For docs
yarn dev:docs
```

## Flow Chart

->![Flow Chart of Vssue Component](/assets/img/developer-guide-flow-chart.png)<-
