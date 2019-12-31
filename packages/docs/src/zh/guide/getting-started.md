# 开始使用

## 选择你要使用的代码托管平台

Vssue 支持通过 Github, Gitlab, Bitbucket, Gitee 或者 Gitea 的 Issue 系统来为你的静态页面提供评论功能，你可以选择其中之一来使用。

前往 [支持的代码托管平台 - 创建 OAuth App](./supported-platforms.md) 查看详细指引。

完成这一步之后，你将会配置好一个 OAuth App，并得到对应的 `client id` 和 `client secret`，它们将会用于 Vssue 的使用。

- `owner`: 对应 repository 的拥有者帐号或者团队
- `repo`: 用来存储评论的 repository
- `clientId`: OAuth App 的 `client id`
- `clientSecret`: OAuth App 的  `client secret` （只有在使用某些平台时需要）

## 在浏览器中使用

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
  <!-- 或： Vssue Gitee 版  -->
  <script src="https://unpkg.com/vssue/dist/vssue.gitee.min.js"></script>
  <!-- 或： Vssue Gitea 版  -->
  <script src="https://unpkg.com/vssue/dist/vssue.gitea.min.js"></script>

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
            clientSecret: 'YOUR_CLIENT_SECRET', // 只有在使用某些平台时需要
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
          clientSecret: 'YOUR_CLIENT_SECRET', // 只有在使用某些平台时需要
        },
      },

      template: `<vssue :title="title" :options="options"></vssue>`,
    })
  </script>
</body>
```

::: tip
如果你还不了解 `Vue` 的不同版本间的区别 （即 `vue.runtime.min.js`, `vue.min.js` 等），可以参考 [Vue 文档](https://cn.vuejs.org/v2/guide/installation.html#%E5%AF%B9%E4%B8%8D%E5%90%8C%E6%9E%84%E5%BB%BA%E7%89%88%E6%9C%AC%E7%9A%84%E8%A7%A3%E9%87%8A)。

`Vssue` 同样提供了不同版本的构建。细节可以查看[对不同构建版本的解释](#对不同构建版本的解释)章节。
:::

## 在 Vue 应用中使用

Vssue 是一个 Vue 插件 / 组件，可以在 Vue 项目中引入并使用。

::: tip
Vssue 只提供了 [ES2015](https://github.com/lukehoban/es6features) 代码，因为我们假设你在使用 [vue-cli](https://cli.vuejs.org/zh/) 或其他工具。
:::

### 通过 npm 安装

安装 `vssue`:

```bash
npm install vssue
```

安装对应平台的 api 包：

> 详情可以查看 [支持的代码托管平台](./supported-platforms.md)。

```bash
# 使用 Github V3
npm install @vssue/api-github-v3
# 或：使用 Github V4
npm install @vssue/api-github-v4
# 或：使用 Gitlab V4
npm install @vssue/api-gitlab-v4
# 或：使用 Bitbucket V2
npm install @vssue/api-bitbucket-v2
# 或：使用 Gitee V5
npm install @vssue/api-gitee-v5
# 或：使用 Gitea V1
npm install @vssue/api-gitea-v1
```

### 作为 Vue 插件使用

通过 `import Vssue from 'vssue'` 你会得到一个 Vue 插件。调用 `Vue.use()` 来使用它并进行配置。这会注册一个名称为 `Vssue` 的全局组件。

> 关于配置的详情，可以查看 [配置参考 - Vssue 配置](../options/README.md#vssue-配置)

```js
// 引入 vue
import Vue from 'vue'
// 引入 vssue
import Vssue from 'vssue'
// 引入对应平台的 api 包
import GithubV3 from '@vssue/api-github-v3'
// 引入 vssue 的样式文件
import 'vssue/dist/vssue.css'

Vue.use(Vssue, {
  // 设置要使用的平台 api
  api: GithubV3,

  // 在这里设置你使用的平台的 OAuth App 配置
  owner: 'OWNER_OF_REPO',
  repo: 'NAME_OF_REPO',
  clientId: 'YOUR_CLIENT_ID',
  clientSecret: 'YOUR_CLIENT_SECRET', // 只有在使用某些平台时需要
})
```

然后你就可以在 [SFC](https://cn.vuejs.org/v2/guide/single-file-components.html) 中使用 Vssue 组件了：

> 关于组件 Props 的详情，可以查看 [配置参考 - 组件 Props](../options/README.md#组件-props)

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
        // clientSecret: 'YOUR_CLIENT_SECRET', // 只有在使用某些平台时需要
      },
    }
  },
}
</script>
```

### 作为 Vue 组件使用

通过 `import { VssueComponent } from 'vssue'` 你会得到一个 Vue 组件。

::: tip
当你通过 `Vue.use()` 把 Vssue 作为插件使用时，这个组件就已经通过 `Vue.component()` 注册为一个名称为 `Vssue` 的全局组件了。

如果你不想把它注册为全局组件，你可以通过这种方式引入它。

需要注意的是，如果你只作为组件引入 Vssue，就没有通过 `Vue.use()` 设置的“全局”配置了，你必须通过 Prop `options` 传入所有必需的 Vssue 配置。参考 [组件 Props - options](../options/README.md#options)。
:::

```vue
<template>
  <Vssue
    :title="title"
    :options="options"
  />
</template>

<script>
import { VssueComponent } from 'vssue'
import GithubV3 from '@vssue/api-github-v3'
import 'vssue/dist/vssue.css'

export default {
  name: 'VssueDemo',

  components: {
    'Vssue': VssueComponent,
  },

  data () {
    return {
      title: 'Vssue Demo',
      options: {
        api: GithubV3,
        owner: 'OWNER_OF_REPO',
        repo: 'NAME_OF_REPO',
        clientId: 'YOUR_CLIENT_ID',
        clientSecret: 'YOUR_CLIENT_SECRET', // 只有在使用某些平台时需要
      },
    }
  },
}
</script>
```

## 对不同构建版本的解释

和 Vue 类似，Vssue 也提供了不同的构建版本以供使用。

这些文件放置在 [dist](https://github.com/meteorlxy/vssue/tree/master/packages/vssue/dist) 文件夹中：

| 文件名                            | 类型      | Minified | Polyfills | 用途                                  |
|----------------------------------|-----------|----------|-----------|----------------------------------------|
| vssue.js                         | ES Module | false    | false     | 使用构建工具                            |
| vssue.[platform].min.js          | UMD       | true     | false     | 通过现代浏览器的 `<script>` 标签引入     |
| vssue.[platform].polyfill.min.js | UMD       | true     | true      | 通过旧版浏览器的 `<script>` 标签引入     |

> 参考 [Vue 的不同构建版本](https://cn.vuejs.org/v2/guide/installation.html#%E5%AF%B9%E4%B8%8D%E5%90%8C%E6%9E%84%E5%BB%BA%E7%89%88%E6%9C%AC%E7%9A%84%E8%A7%A3%E9%87%8A)
