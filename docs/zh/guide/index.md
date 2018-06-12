---
sidebar: auto
---

# Vssue 指南

## 开始使用

### 在浏览器中使用

Vssue 提供了完整文件 `dist/vssue.full.js` 用来在浏览器中直接使用。在 HTML 文件中引入 `dist/vssue.full.js` 和 `dist/vssue.css` 就可以在当前页面中使用Vssue。

```html
<head>
  <link href="path/to/vssue.css" rel="stylesheet">
</head>

<body>
  <div id="vssue"></div>

  <script src="path/to/vssue.full.js"></script>

  <script>
    new Vssue({
      el: '#vssue',
      platform: 'github',
      owner: 'repo-owner',
      repo: 'repo-name',
      clientId: 'oauth-app-client-id',
      clientSecret: 'oauth-app-client-serect'
    })
  </script>
</body>
```

::: tip
`vssue.full.js` 打包了所有Vssue所需依赖 (vue.js, axios, 等等)，可以直接在浏览器中引入并使用。但`vssue.full.js`文件较大，如果你的项目原本就使用了Vue，可以将Vssue作为Vue组件使用。
:::

### 在 Vue 应用中使用

Vssue 同样也是一个 Vue 组件，可以在 Vue 项目中引入并作为组件使用。

#### 通过 npm / yarn 安装

```bash
npm install vssue
# 或者
yarn add vssue
```

#### 作为 Vue 组件使用

```vue
<template>
  <Vssue :options="vssueOptions"/>
</template>

<script>
import Vssue from 'vssue'
export default {
  name: 'VssueDemo',

  components: {
    Vssue
  },

  data () {
    return {
      vssueOptions: {
        platform: 'github',
        owner: 'repo-owner',
        repo: 'repo-name',
        clientId: 'oauth-app-client-id',
        clientSecret: 'oauth-app-client-serect'
      }
    }
  }
}
</script>

<style src="vssue/dist/vssue.css"></style>
```
