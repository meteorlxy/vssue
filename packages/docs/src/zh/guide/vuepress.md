# 在 Vuepress 中使用

> [Vuepress](https://vuepress.vuejs.org/zh/) 是 Vue 驱动的静态网站生成器

## Vuepress 插件

Vssue 提供了一个 [Vuepress 插件](https://vuepress.vuejs.org/zh/plugin/) - [@vssue/vuepress-plugin-vssue](https://www.npmjs.com/package/@vssue/vuepress-plugin-vssue) - 来帮助你在 Vuepress 中快速使用 Vssue。

::: tip
Vuepress v1.0+ 才支持插件，现在 Vuepress 1.0 版本还处于 alpha 测试阶段。
:::

## 使用方法

### 安装

通过 NPM 安装 `@vssue/vuepress-plugin-vssue` ：

```bash
npm install -D @vssue/vuepress-plugin-vssue
```

### 使用插件

> 通过 [Vuepress 官方文档](https://vuepress.vuejs.org/zh/plugin/using-a-plugin.html) 查看使用插件的详细方法

```js
// .vuepress/config.js

module.exports = {
  plugins: {
    '@vssue/vuepress-plugin-vssue': {
      // 设置 `platform` 而不是 `api`
      platform: 'github',

      // 其他的 Vssue 配置
      owner: 'OWNER_OF_REPO',
      repo: 'NAME_OF_REPO',
      clientId: 'YOUR_CLIENT_ID',
      clientSecret: 'YOUR_CLIENT_SECRET',
    },
  },
}
```

::: tip
唯一的区别在于，你需要设置 `platform` 而不是对应的 `api` 包。

`@vssue/vuepress-plugin-vssue` 会自动根据你设置的 `platform` 为你解析对应的 api 包：

- platform `github` - api 包 `@vssue/api-github-v3`
- platform `gitlab` - api 包 `@vssue/api-gitlab-v4`
- platform `bitbucket` - api 包 `@vssue/api-bitbucket-v2`
:::

### 使用 Vssue 组件

`Vssue` 已经注册为 Vue 组件，你可以在你的 Vuepress Markdown 文件中直接使用它。

```md
<!-- README.md -->

# Vssue Demo

<Vssue title="Vssue Demo" />
```

::: tip
你可以前往 [meteorlxy/vssue-demo](https://github.com/meteorlxy/vssue-demo) 来获取 demo 代码。
:::
