# Integration with Vuepress

> [Vuepress](https://vuepress.vuejs.org/) is a Vue-powered Static Site Generator

## Vuepress Plugin

Vssue provides a [Vuepress Plugin](https://vuepress.vuejs.org/plugin/) - [@vssue/vuepress-plugin-vssue](https://www.npmjs.com/package/@vssue/vuepress-plugin-vssue) - to help use Vssue in Vuepress quickly.

::: tip
Only Vuepress v1.0+ supports plugins, which is in alpha stage for now.
:::

## Usage

### Installation

Install `@vssue/vuepress-plugin-vssue` via NPM:

```bash
npm install -D @vssue/vuepress-plugin-vssue
```

### Use the plugin

> See [Vuepress Offical Docs](https://vuepress.vuejs.org/plugin/using-a-plugin.html) for how to use a plugin in detail

```js
// .vuepress/config.js

module.exports = {
  plugins: {
    '@vssue/vuepress-plugin-vssue': {
      // set `platform` rather than `api`
      platform: 'github',

      // all other options of Vssue are allowed
      owner: 'OWNER_OF_REPO',
      repo: 'NAME_OF_REPO',
      clientId: 'YOUR_CLIENT_ID',
      clientSecret: 'YOUR_CLIENT_SECRET',
    },
  },
}
```

::: tip
The only difference is that, you should set `platform` rather than the `api` package itself.

`@vssue/vuepress-plugin-vssue` will auto resolve the corresponding api package according to the value of `platform`:

- platform `github` - api package `@vssue/api-github-v3`
- platform `gitlab` - api package `@vssue/api-gitlab-v4`
- platform `bitbucket` - api package `@vssue/api-bitbucket-v2`
:::

### Use Vssue Component

`Vssue` has already been registered as a Vue component, and can be used in your Vuepress markdown directly.

```md
<!-- README.md -->

# Vssue Demo

<Vssue title="Vssue Demo" />
```

::: tip
You can go to the repo [meteorlxy/vssue-demo](https://github.com/meteorlxy/vssue-demo) to get the demo code.
:::

## Custom Style Variables

With the power of [palette.styl](https://vuepress.vuejs.org/config/#palette-styl) of Vuepress, you can set the [Variables of Vssue Style](./styles.md#use-variables-to-customize-vssue) easily.

By default, those Vssue variables are set to Vuepress variables:

```stylus
// @vssue/vuepress-plugin-vssue/styles/index.styl

$vssue-theme-color ?= $accentColor
$vssue-text-color ?= $textColor
$vssue-border-color ?= $borderColor
$vssue-breakpoint-mobile ?= $MQMobile
```

If you want to override them, just set them in your `palette.styl`:

```stylus
// .vuepress/styles/palette.styl

$vssue-theme-color = red
```
