---
sidebar: auto
---

# Vssue Guide

## Getting Started

### Choose a platform to use

Vssue can enable comments for your static pages via the `Issue System` of `Github`, `Gitlab` or `Bitbucket`, and you can choose one of those platforms.

Go to the [Set up OAuth App](#set-up-oauth-app) section for detailed instructions.

After this step, you will get `client id` and `client secret` of your OAuth App, which will be used for Vssue options:

- `owner`: the account / group that owns the repository
- `repo`: the name of the repository to store comments
- `clientId`: the `client id` of your oauth app
- `clientSecret`: the `client secret` of your oauth app

### In Browser

Vssue can be used directly via `<script>` tag in browser. As Vssue depends on [Vue.js](https://vuejs.org), you should also import Vue.

```html
<head>
  <!-- style sheet of Vssue -->
  <link rel="stylesheet" href="https://unpkg.com/vssue/dist/vssue.min.css">
</head>

<body>
  <div id="vssue"></div>

  <!-- Introduce Vue first -->

  <!-- vue runtime build (runtime only)  -->
  <script src="https://unpkg.com/vue/dist/vue.runtime.min.js"></script>
  <!-- OR: vue full build (runtime + compiler)  -->
  <script src="https://unpkg.com/vue/dist/vue.min.js"></script>

  <!-- Introduce Vssue after Vue -->

  <!-- Vssue Github build -->
  <script src="https://unpkg.com/vssue/dist/vssue.github.min.js"></script>
  <!-- OR: Vssue Gitlab build -->
  <script src="https://unpkg.com/vssue/dist/vssue.gitlab.min.js"></script>
  <!-- OR: Vssue Bitbucket build -->
  <script src="https://unpkg.com/vssue/dist/vssue.bitbucket.min.js"></script>

  <!-- Use Vssue as a Vue component -->

  <!-- use render function for vue runtime build -->
  <script>
    new Vue({
      el: '#vssue',

      render: h => h('Vssue', {
        props: {
          // here set the title of issue of current page
          title: 'Vssue Dev',

          // here set the options for your OAuth App
          options: {
            owner: 'OWNER_OF_REPO',
            repo: 'NAME_OF_REPO',
            clientId: 'YOUR_CLIENT_ID',
            clientSecret: 'YOUR_CLIENT_SECRET',
          },
        }
      })
    })
  </script>

  <!-- OR: use template for vue full build -->
  <script>
    new Vue({
      el: '#vssue',

      data: {
        title: 'Vssue Dev',

        options: {
          owner: 'OWNER_OF_REPO',
          repo: 'NAME_OF_REPO',
          clientId: 'YOUR_CLIENT_ID',
          clientSecret: 'YOUR_CLIENT_SECRET',
        },
      },

      template: `<vssue :title="title" :options="options"></vssue>`,
    })
  </script>
</body>
```

::: tip
If you are not familiar with the different builds of `Vue` (i.e. `vue.runtime.min.js`, `vue.min.js`, etc.), see [Vue Docs](https://vuejs.org/v2/guide/installation.html#Explanation-of-Different-Builds).

`Vssue` also provide multiple builds (some builds are just like `Vue`). See [Explanation-of-Different-Builds](#explanation-of-different-builds) section for more details.
:::

### In Vue App

Vssue is a Vue Plugin / Component, so could be imported in Vue Apps.

#### Install via npm

Install `vssue`:

```bash
npm install vssue
```

Install the api package for different platform:

```bash
# for Github
npm install @vssue/api-github-v3
# OR: for Gitlab
npm install @vssue/api-gitlab-v4
# OR: for Bitbucket
npm install @vssue/api-bitbucket-v2
```

#### Use as a Vue Plugin

```js
// import vue
import Vue from 'vue'
// import vssue
import Vssue from 'vssue'
// import the api package for specific platform
import GithubV3 from '@vssue/api-github-v3'
// import the stylesheet of vssue
import 'vssue/dist/vssue.min.css'

Vue.use(Vssue, {
  // here set the default options for your OAuth App
  owner: 'OWNER_OF_REPO',
  repo: 'NAME_OF_REPO',
  clientId: 'YOUR_CLIENT_ID',
  clientSecret: 'YOUR_CLIENT_SECRET',

  // set the default platform api
  api: GithubV3,
})
```

::: tip
Notice that you are using ES module syntax, so you should use the ES Module build of Vue and Vssue (i.e. `vue.esm.js` / `vue.runtime.esm.js` and `vssue.esm.js`).

- Example for `webpack` config:

  ```js
  // webpack.config.js

  module.exports = {
    // ...

    resolve: {
      alias: {
        // Vue ESM runtime only build
        'vue$': 'vue/dist/vue.runtime.esm.js',
        // OR: Vue ESM full build
        'vue$': 'vue/dist/vue.esm.js',
        // Vssue ESM build
        'vssue$': 'vssue/dist/vssue.esm.js',
      },
    },
  }
  ```

- Example for `vue-cli` config:

  ```js
  // vue.config.js

  module.exports = {
    // ...

    chainWebpack: config => {
      // vue-cli has already set the alias of `vue` for you
      // so you only need to set the alias of `vssue` here
      config.resolve.alias
        .set('vssue$', 'vssue/dist/vssue.esm.js')
    },
  }
  ```
:::

#### Use in your SFC

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
      // here set the title of issue of current page
      title: 'Vssue Demo',

      // notice that, the options here will override the default options set by `Vue.use()` above
      // if you do not want to change them, just set the `title` prop, and ignore the `options` prop
      options: {
        // owner: 'OWNER_OF_REPO',
        // repo: 'NAME_OF_REPO',
        // clientId: 'YOUR_CLIENT_ID',
        // clientSecret: 'YOUR_CLIENT_SECRET',
      },
    }
  },
}
</script>
```

### Explanation of Different Builds

Similar to Vue, Vssue also provide different builds for different usage.

> See [different builds of Vue](https://vuejs.org/v2/guide/installation.html#Explanation-of-Different-Builds)

- `vssue.common.js`: the [Commonjs](http://wiki.commonjs.org/wiki/Modules/1.1) build
- `vssue.esm.js`: the [ES Module](http://exploringjs.com/es6/ch_modules.html) build
- `vssue.bitbucket.min.js`, `vssue.gitlab.min.js`, `vssue.github.min.js`: minified/production [UMD](https://github.com/umdjs/umd) builds for specific platform, to be used directly in the browser via a `<script>` tag

## Set up OAuth App

### Github

1. Go to [Settings - Developer Settings - OAuth Apps](https://github.com/settings/developers), and click [New OAuth App](https://github.com/settings/applications/new)

![Set up OAuth App - Github 01](/assets/img/oauth-app-github-01.png)
![Set up OAuth App - Github 02](/assets/img/oauth-app-github-02.png)
![Set up OAuth App - Github 03](/assets/img/oauth-app-github-03.png)

2. Set the `Homepage URL` and `Authorization callback URL` to your website URL.

Here we take `localhost:8080` for development example.

![Set up OAuth App - Github 04](/assets/img/oauth-app-github-04.png)

3. Then you've created a new OAuth App, and here is your `Client ID` and `Client Secrect`.

![Set up OAuth App - Github 05](/assets/img/oauth-app-github-05.png)

4. Copy the `Client ID` and `Client Secrect`, and set `owner` and `repo`.

> The URL pattern of github repo is `https://github.com/${owner}/${repo}`

Here we take `https://github.com/meteorlxy/vssue-demo` for example, and set the `title` of issue to `Vssue Demo`.

Then run `anywhere -h localhost 8080` to serve the `index.html` on `localhost:8080`.

![Set up OAuth App - Github 06](/assets/img/oauth-app-github-06.png)

5. Vssue has already run here. Click `Login` to login with github account.

![Set up OAuth App - Github 07](/assets/img/oauth-app-github-07.png)

6. Redirect to Github Authorization page. Click `Authorize ${your account}` to login.

![Set up OAuth App - Github 08](/assets/img/oauth-app-github-08.png)

7. Leave a comment on this page ~

![Set up OAuth App - Github 09](/assets/img/oauth-app-github-09.png)

![Set up OAuth App - Github 10](/assets/img/oauth-app-github-10.png)

::: tip
You can go to the repo [meteorlxy/vssue-demo](https://github.com/meteorlxy/vssue-demo) to get the demo code. Check the [#1 issue](https://github.com/meteorlxy/vssue-demo/issues/1) of that repo to see what happened.
:::

### Gitlab

> TODO

### Bitbucket

> TODO

## Options

> TODO

## Integration with Vuepress

> TODO
