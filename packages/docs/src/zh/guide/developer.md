# 开发者指南

Vssue 使用 [TypeScript](https://www.typescriptlang.org/) 开发，代码仓库通过 [lerna](https://github.com/lerna/lerna) 和 [yarn workspace](https://yarnpkg.com/en/docs/cli/workspace) 组织为 Monorepo。

所有 Packages 均位于 `packages/` 目录下：

- `vssue`：Vssue 的主要 Package，包含了 Vssue 组件；
- `docs`：文档网站 [vssue.js.org](https://vssue.js.org) 的源代码，由 [VuePress](https://github.com/vuejs/vuepress) 驱动；
- `@vssue/api-{platform}-{version}`：不同平台和不同版本 API 对应的 API Packages；
- `@vssue/utils`：一些供 Vssue 和 API Packages 使用的工具函数；
- `@vssue/vuepress-plugin-vssue`：VuePress 插件。

## 开发

Clone 仓库：

```sh
git clone https://github.com/meteorlxy/vssue.git
cd vssue
yarn
```

Vssue 使用 [vue-cli](https://cli.vuejs.org/zh) 进行开发，使用 [rollup](https://rollupjs.org) 进行打包。

你需要为你的本地开发设置[环境变量](https://cli.vuejs.org/zh/guide/mode-and-env.html)：

```sh
cp packages/vssue/.env.development packages/vssue/.env.development.local
```

修改 `.env.development.local` 文件的内容：

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

你可以在 `packages/vssue/vue.config.js` 和 `packages/vssue/dev/main.ts` 中查看这些变量是如何工作的。

运行开发脚本：

```sh
# 开发 Vssue 组件
yarn dev
# 开发文档
yarn dev:docs
```

## 流程图

->![Vssue 组件流程图](/assets/img/developer-guide-flow-chart.png)<-
