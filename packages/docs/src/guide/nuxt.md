# Nuxt

> [Nuxt.js](https://nuxtjs.org) is a framework for creating Vue.js applications

## Usage

### Installation

Install `vssue` and API package via NPM:

```bash
npm install vssue
npm install @vssue/api-github-v3
```

### Create Nuxt Plugin

> See [Nuxt Official Docs](https://nuxtjs.org/guide/plugins#vue-plugins) for how to create and use a plugin in detail

Create the file `plugins/vssue.js`:

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

Then add the file path inside the `plugins` key of your `nuxt.config.js`:

```js
module.exports = {
  // Vssue only needs to work in the browser, so we use client mode
  plugins: [
    { src: '~/plugins/vssue', mode: 'client' }
  ],

  // Vssue provides ES6 module, so we need to add it to the transpile build option
  build: {
    transpile: [
      '(@vssue|vssue)\/((?!\/node_modules\/).)*\.js$',
    ],
  },
}
```

### Use Vssue in Pages

Create page `pages/index.vue`, and use `<Vssue>` component:

```vue
<template>
  <div>
    <h1>Vssue Demo</h1>

    <!-- Vssue only needs to be rendered in client, so wrapper it with <ClientOnly> component -->
    <ClientOnly>
      <Vssue title="Vssue Demo" />
    </ClientOnly>
  </div>
</template>
```

> See [ClientOnly component](https://nuxtjs.org/api/components-client-only#the-lt-client-only-gt-component) of Nuxt

::: tip
You can go to the repo [meteorlxy/vssue-demo](https://github.com/meteorlxy/vssue-demo) to get the demo code.
:::
