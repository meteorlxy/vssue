# 在 Vuepress 中使用

> [Vuepress](https://vuepress.vuejs.org/zh/) 是 Vue 驱动的静态网站生成器

## Vuepress 插件

Vssue 提供了一个 [Vuepress 插件](https://vuepress.vuejs.org/zh/plugin/) - [@vssue/vuepress-plugin-vssue](https://www.npmjs.com/package/@vssue/vuepress-plugin-vssue) - 来帮助你在 Vuepress 中快速使用 Vssue。

::: tip
Vuepress v1.0+ 开始支持插件。
:::

::: warning 注意
现在 Vuepress 1.x 版本还处于 alpha 测试阶段，并不稳定，所以我们的插件在不同版本的 Vuepress 下可能会存在潜在的问题。
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

::: tip
如果你不设置 `locale`，Vssue 会自动使用 Vuepress 的 `$lang` 作为当前页面的语言。

> 参考 Vssue 的 [locale](../options/README.md#locale) 设置，以及 Vuepress 的 [$lang](https://vuepress.vuejs.org/zh/guide/global-computed.html#lang) 属性。
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

## 自定义样式变量

通过 Vuepress 的 [palette.styl](https://vuepress.vuejs.org/zh/config/#palette-styl)，你可以很轻松地修改 [Vssue 的样式变量](./styles.md#使用样式变量来自定义-vssue)。

默认情况下，下面这些 Vssue 的样式变量与 Vuepress 的样式变量相等：

```stylus
// @vssue/vuepress-plugin-vssue/styles/index.styl

$vssue-theme-color ?= $accentColor
$vssue-text-color ?= $textColor
$vssue-border-color ?= $borderColor
$vssue-breakpoint-mobile ?= $MQMobile
```

如果你想要覆盖它们，在你的 `palette.styl` 中设置即可：

```stylus
// .vuepress/styles/palette.styl

$accentColor = blue

$vssue-theme-color = red
```

## 不想使用我们提供的插件？

虽然 Vssue 已经在尽量适配 SSR，但是直接在 Vuepress 中使用 Vssue 可能还是会有一些问题。

所以我们建议你在 Vuepress 中通过 `@vssue/vuepress-plugin-vssue` 来使用 Vssue，该插件已经帮助你仅在客户端加载 Vssue 来避免这些问题。

如果你不想使用我们提供的插件，你可能需要将 `<Vssue>` 组件放置在 `<ClientOnly>` 组件中来避免潜在的问题，即：

```vue
<ClientOnly>
  <Vssue />
</ClientOnly>
```

> 参考 Vuepress [内置的组件 - ClientOnly](https://vuepress.vuejs.org/zh/guide/using-vue.html#clientonly)
