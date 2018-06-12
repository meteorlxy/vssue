---
sidebar: auto
---

# Vssue Guide

## Getting Started

### In Browser

Vssue provide a full bundle `dist/vssue.full.js` to be introduced in browser directly. Introduce `dist/vssue.full.js` and `dist/vssue.css` in your html file to use Vssue in this page.

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
`vssue.full.js` has packed everything together (vue.js, axios, etc), which could be introduced and used in browser directly. But the size of `vssue.full.js` is large. If your project is based on Vue, you can use Vssue as a Vue component.
:::

### In Vue app

Vssue is also a Vue component, and could be imported as a component in Vue projects.

#### Install via npm / yarn

```bash
npm install vssue
# or
yarn add vssue
```

#### Use as a Vue component

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
