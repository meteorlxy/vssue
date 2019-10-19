# Gridsome

> [Gridsome](https://gridsome.org) is a free and open source Vue.js-powered framework for building websites & apps that are fast by default.

## Usage

### Installation

Install `vssue` and API package via NPM:

```bash
npm install vssue
npm install @vssue/api-github-v3
```

### Import Vssue

> See [Gridsome Official Docs](https://gridsome.org/docs/client-api/) for how to use Client API

Create the file `src/main.js`:

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

### Use Vssue in Pages

Create page `src/pages/Index.vue`, and use `<Vssue>` component:

```vue
<template>
  <div>
    <h1>Vssue Demo</h1>

    <Vssue title="Vssue Demo" />
  </div>
</template>
```

::: tip
You can go to the repo [meteorlxy/vssue-demo](https://github.com/meteorlxy/vssue-demo) to get the demo code.
:::
