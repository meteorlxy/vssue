# Gridsome

> [Gridsome](https://gridsome.org) 是一个免费开源的由 Vue.js 驱动的网站 & 应用快速构建框架。

## 使用方法

### 安装

通过 NPM 安装 `vssue` 和你需要使用的 API 包 ：

```bash
npm install vssue
npm install @vssue/api-github-v3
```

### 引入 Vssue

> 通过 [Gridsome 官方文档](https://gridsome.org/docs/client-api/) 查看如何使用客户端 API

创建文件 `src/main.js`:

```js
import Vssue from 'vssue';
import GithubV3 from '@vssue/api-github-v3';
import 'vssue/dist/vssue.css'

export default function (Vue) {
  Vue.use(Vssue, {
    api: GithubV3,
    owner: 'OWNER_OF_REPO',
    repo: 'NAME_OF_REPO',
    clientId: 'YOUR_CLIENT_ID',
    clientSecret: 'YOUR_CLIENT_SECRET',
  })
}
```

### 在页面中使用 Vssue

创建页面 `src/pages/Index.vue` ，使用 `<Vssue>` 组件即可:

```vue
<template>
  <div>
    <h1>Vssue Demo</h1>

    <Vssue title="Vssue Demo" />
  </div>
</template>
```

::: tip
你可以前往 [meteorlxy/vssue-demo](https://github.com/meteorlxy/vssue-demo) 来获取 demo 代码。
:::
