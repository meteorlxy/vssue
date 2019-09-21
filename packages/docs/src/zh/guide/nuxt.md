# 在 Nuxt 中使用

> [Nuxt.js](https://zh.nuxtjs.org/) 是一个基于 Vue.js 的服务端渲染框架。

## 使用方法

### 安装

通过 NPM 安装 `vssue` 和你需要使用的 API 包 ：

```bash
npm install vssue
npm install @vssue/api-github-v3
```

### 创建 Nuxt 插件

> 通过 [Nuxt 官方文档](https://zh.nuxtjs.org/guide/plugins#%E4%BD%BF%E7%94%A8-vue-%E6%8F%92%E4%BB%B6) 查看创建和使用插件的详细方法

首先创建文件 `plugins/vssue.js`:

```js
import Vue from 'vue'
import Vssue from 'vssue'
import GithubV3 from '@vssue/api-github-v3'
import 'vssue/dist/vssue.css'

Vue.use(Vssue, {
  api: GithubV3,
  owner: 'OWNER_OF_REPO',
  repo: 'NAME_OF_REPO',
  clientId: 'YOUR_CLIENT_ID',
  clientSecret: 'YOUR_CLIENT_SECRET',
})
```

然后，在 `nuxt.config.js` 中引入:

```js
module.exports = {
  // Vssue 只需要在 client 中引入，因此使用 mode client 即可
  plugins: [
    { src: '~/plugins/vssue', mode: 'client' }
  ],

  // Vssue 提供的是 ES6 模块，所以需要配置 transpile
  build: {
    transpile: [
      '(@vssue|vssue)\/((?!\/node_modules\/).)*\.js$',
    ],
  },
}
```

### 在页面中使用 Vssue

创建页面 `pages/index.vue` ，使用 `<Vssue>` 组件即可:

```vue
<template>
  <div>
    <h1>Vssue Demo</h1>

    <!-- Vssue 只需要在 Client 渲染即可，所以使用 <ClientOnly> 组件包裹起来 -->
    <ClientOnly>
      <Vssue title="Vssue Demo" />
    </ClientOnly>
  </div>
</template>
```

> 参考 Nuxt [ClientOnly 组件](https://nuxtjs.org/api/components-client-only#the-lt-client-only-gt-component)

::: tip
你可以前往 [meteorlxy/vssue-demo](https://github.com/meteorlxy/vssue-demo) 来获取 demo 代码。
:::
