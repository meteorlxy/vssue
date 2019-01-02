---
sidebar: auto
---

# Vssue 指南

## 开始使用

### 选择你要使用的代码托管平台

Vssue 支持通过 Github、Gitlab 或者 Bitbucket 的 Issue 系统来为你的静态页面提供评论功能，你可以选择其中之一来使用。

前往 [配置OAuth App](#配置-oauth-app) 章节查看详细指引。

完成这一步之后，你将会配置好一个 OAuth App，并得到对应的 `client id` 和 `client secret`，它们将会用于 Vssue 的使用。

- `owner`: 对应 repository 的拥有者帐号或者团队
- `repo`: 用来存储评论的 repository
- `clientId`: OAuth App 的 `client id`
- `clientSecret`: OAuth App 的  `client secret`

### 在浏览器中使用

Vssue 可以在浏览器中通过 `<script>` 标签直接使用。由于 Vssue 依赖于 [Vue.js](https://cn.vuejs.org)，所以你还需要引入 Vue。

```html
<head>
  <!-- Vssue 的样式文件 -->
  <link rel="stylesheet" href="https://unpkg.com/vssue/dist/vssue.min.css">
</head>

<body>
  <div id="vssue"></div>

  <!-- 先引入 Vue -->

  <!-- Vue 运行时版 (runtime only)  -->
  <script src="https://unpkg.com/vue/dist/vue.runtime.min.js"></script>
  <!-- 或： Vue 完整版 (runtime + compiler) -->
  <script src="https://unpkg.com/vue/dist/vue.min.js"></script>

  <!-- 在 Vue 之后引入 Vssue -->

  <!-- Vssue Github 版  -->
  <script src="https://unpkg.com/vssue/dist/vssue.github.min.js"></script>
  <!-- 或： Vssue Gitlab 版  -->
  <script src="https://unpkg.com/vssue/dist/vssue.gitlab.min.js"></script>
  <!-- 或： Vssue Bitbucket 版  -->
  <script src="https://unpkg.com/vssue/dist/vssue.bitbucket.min.js"></script>

  <!-- 将 Vssue 作为 Vue 组件使用 -->

  <!-- 对于 Vue 运行时版，使用渲染函数（render function） -->
  <script>
    new Vue({
      el: '#vssue',

      render: h => h('Vssue', {
        props: {
          // 在这里设置当前页面对应的 Issue 标题
          title: 'Vssue Dev',

          // 在这里设置你使用的平台的 OAuth App 配置
          options: {
            owner: 'OWNER_OF_REPO',
            repo: 'NAME_OF_REPO',
            clientId: 'YOUR_CLIENT_ID',
            clientSecret: 'YOUR_CLIENT_SECRET',
          },
        }
      })
    })
  </script>

  <!-- 或：对于 Vue 完整版，可以使用模板（template） -->
  <script>
    new Vue({
      el: '#vssue',

      data: {
        title: 'Vssue Dev',

        options: {
          owner: 'OWNER_OF_REPO',
          repo: 'NAME_OF_REPO',
          clientId: 'YOUR_CLIENT_ID',
          clientSecret: 'YOUR_CLIENT_SECRET',
        },
      },

      template: `<vssue :title="title" :options="options"></vssue>`,
    })
  </script>
</body>
```

::: tip
如果你还不了解 `Vue` 的不同版本间的区别 （即 `vue.runtime.min.js`, `vue.min.js` 等），可以参考 [Vue 文档](https://cn.vuejs.org/v2/guide/installation.html#%E5%AF%B9%E4%B8%8D%E5%90%8C%E6%9E%84%E5%BB%BA%E7%89%88%E6%9C%AC%E7%9A%84%E8%A7%A3%E9%87%8A)。

`Vssue` 同样提供了不同版本的构建（部分版本和 `Vue` 很相似）。细节可以查看[对不同构建版本的解释](#对不同构建版本的解释)章节。
:::

### 在 Vue 应用中使用

Vssue 是一个 Vue 插件 / 组件，可以在 Vue 项目中引入并使用。

#### 通过 npm 安装

安装 `vssue`:

```bash
npm install vssue
```

安装对应平台的 api 包：

```bash
# 对于 Github
npm install @vssue/api-github-v3
# 或：对于 Gitlab
npm install @vssue/api-gitlab-v4
# 或：对于 Bitbucket
npm install @vssue/api-bitbucket-v2
```

#### 作为 Vue 插件使用

```js
// 引入 vue
import Vue from 'vue'
// 引入 vssue
import Vssue from 'vssue'
// 引入对应平台的 api 包
import GithubV3 from '@vssue/api-github-v3'
// 引入 vssue 的样式文件
import 'vssue/dist/vssue.min.css'

Vue.use(Vssue, {
  // 在这里设置你使用的平台的 OAuth App 配置
  owner: 'OWNER_OF_REPO',
  repo: 'NAME_OF_REPO',
  clientId: 'YOUR_CLIENT_ID',
  clientSecret: 'YOUR_CLIENT_SECRET',

  // 设置默认使用的 api
  api: GithubV3,
})
```

::: tip
注意，你这里使用的是 ES Module 语法，所以你应该使用 Vue 和 Vssue 的 ES Module 版本（即 `vue.esm.js` / `vue.runtime.esm.js` 和 `vssue.esm.js`）

- `webpack` 配置示例：

  ```js
  // webpack.config.js

  module.exports = {
    // ...

    resolve: {
      alias: {
        // Vue ESM 运行时版
        'vue$': 'vue/dist/vue.runtime.esm.js',
        // 或： Vue ESM 完整版
        'vue$': 'vue/dist/vue.esm.js',
        // Vssue ESM 版
        'vssue$': 'vssue/dist/vssue.esm.js',
      },
    },
  }
  ```

- `vue-cli` 配置示例:

  ```js
  // vue.config.js

  module.exports = {
    // ...

    chainWebpack: config => {
      // vue-cli 已经为你设置好了 `vue` 的 alias
      // 所以你只需要在这里设置 `vssue` 的 alias 即可
      config.resolve.alias
        .set('vssue$', 'vssue/dist/vssue.esm.js')
    },
  }
  ```
:::

#### 在你的单文件组件中使用

```vue
<template>
  <Vssue
    :title="title"
    :options="options"
  />
</template>

<script>
export default {
  name: 'VssueDemo',

  data () {
    return {
      // 在这里设置当前页面的 Issue 标题
      title: 'Vssue Demo',

      // 注意，这里的 options 会覆盖上面通过 `Vue.use()` 设置的默认 options
      // 如果你不想改变它们，只需要传入 `title` prop 即可，不需要传入 `options` prop
      options: {
        // owner: 'OWNER_OF_REPO',
        // repo: 'NAME_OF_REPO',
        // clientId: 'YOUR_CLIENT_ID',
        // clientSecret: 'YOUR_CLIENT_SECRET',
      },
    }
  },
}
</script>
```

### 对不同构建版本的解释

和 Vue 很类似，Vssue 也提供了不同的构建版本以供使用。

> 参考 [Vue 的不同构建版本](https://cn.vuejs.org/v2/guide/installation.html#%E5%AF%B9%E4%B8%8D%E5%90%8C%E6%9E%84%E5%BB%BA%E7%89%88%E6%9C%AC%E7%9A%84%E8%A7%A3%E9%87%8A)

- `vssue.common.js`： [Commonjs](http://wiki.commonjs.org/wiki/Modules/1.1) 版本
- `vssue.esm.js`: [ES Module](http://exploringjs.com/es6/ch_modules.html) 版本
- `vssue.bitbucket.min.js`, `vssue.gitlab.min.js`, `vssue.github.min.js`：用于不同平台的最小化/生产环境的 [UMD](https://github.com/umdjs/umd) 版本。通过 `<script>` 标签直接用在浏览器中。

## 配置 OAuth App

### Github

1. 前往 [Settings - Developer Settings - OAuth Apps](https://github.com/settings/developers)，并点击 [New OAuth App](https://github.com/settings/applications/new)

![配置 OAuth App - Github 01](/assets/img/oauth-app-github-01.png)
![配置 OAuth App - Github 02](/assets/img/oauth-app-github-02.png)
![配置 OAuth App - Github 03](/assets/img/oauth-app-github-03.png)

2. 将 `Homepage URL` 和 `Authorization callback URL` 设置为你的网站 URL。

这里我们用 `localhost:8080` 作为示例。

![配置 OAuth App - Github 04](/assets/img/oauth-app-github-04.png)

3. 现在你已经创建了一个新的 OAuth App，并得到了相应的 `Client ID` 和 `Client Secrect`。

![配置 OAuth App - Github 05](/assets/img/oauth-app-github-05.png)

4. 复制 `Client ID` 和 `Client Secrect`, 并设置 `owner` 和 `repo`。

> Github repository 的 URL 模式为 `https://github.com/${owner}/${repo}`

这里我们以 `https://github.com/meteorlxy/vssue-demo` 为例，并把 issue 的 `title` 设置为 `Vssue Demo`。

然后运行 `anywhere -h localhost 8080`，在 `localhost:8080` 监听一个 http server 并返回 `index.html`。

![配置 OAuth App - Github 06](/assets/img/oauth-app-github-06.png)

5. Vssue 已经成功运行。点击 `Login` 使用 Github 帐号登录。

![配置 OAuth App - Github 07](/assets/img/oauth-app-github-07.png)

6. 重定向到 Github 授权页面。点击 `Authorize ${你的帐号}` 来登录。

![配置 OAuth App - Github 08](/assets/img/oauth-app-github-08.png)

7. 在当前页面写下评论吧 ~

![配置 OAuth App - Github 09](/assets/img/oauth-app-github-09.png)

![配置 OAuth App - Github 10](/assets/img/oauth-app-github-10.png)

::: tip
你可以前往 [meteorlxy/vssue-demo](https://github.com/meteorlxy/vssue-demo) 来获取 demo 代码。前往该仓库的 [#1 issue](https://github.com/meteorlxy/vssue-demo/issues/1) 看看发生了什么。
:::

### Gitlab

> TODO

### Bitbucket

> TODO

## 配置

> TODO

## 在 Vuepress 中使用

> TODO
