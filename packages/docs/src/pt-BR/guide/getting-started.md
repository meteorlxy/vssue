# Começar

## Escolha uma plataforma para usar

O Vssue pode habilitar comentários para suas páginas estáticas através do `Sistema de Issues` do `Github`, `Gitlab` ou `Bitbucket`, e você pode escolher uma dessas plataformas.

Vá para [Plataformas Suportadas - Configurar Aplicativo OAuth](./supported-platforms.md) para obter instruções detalhadas.

Após este passo, você obterá o `client id` e `client secret` do seu aplicativo OAuth, que será usado para as opções do Vssue:

- `owner`: a conta / grupo proprietário o repositório
- `repo`: o nome do repositório para armazenar comentários
- `clientId`: o `client id` do seu aplicativo oauth
- `clientSecret`: o `client secret` do seu aplicativo oauth

## No Browser

Vssue pode ser usado diretamente via tag `<script>` no browser. Como o Vssue depende do [Vue.js](https://vuejs.org), você também deve importar o Vue.

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

::: tip Dica
Se você não está familiarizado com as diferentes distribuições do `Vue` (ex.: `vue.runtime.min.js`, `vue.min.js`, etc.), veja [Vue Docs](https://br.vuejs.org/v2/guide/installation.html#Explicacao-das-Distribuicoes).

`Vssue` também fornece várias distribuições. Veja a seção [Explicacao-das-Distribuicoes](#explicacao-das-distribuicoes) para mais detalhes.
:::

## Em Aplicativos Vue

Vssue é um Plugin / Componente Vue, portanto, pode ser importado em aplicativos Vue.

::: tip Dica
O Vssue fornece apenas o código [ES2015](https://github.com/lukehoban/es6features), pois supomos que você esteja usando [vue-cli](https://cli.vuejs.org) ou outras ferramentas.
:::

### Instalar via npm

Instalar `vssue`:

```bash
npm install vssue
```

Instação do pacote api em diferentes plataformas:

> Veja [Plataformas Suportadas](./supported-platforms.md) para mais detalhes.

```bash
# use Github V3
npm install @vssue/api-github-v3
# OR: use Github V4
npm install @vssue/api-github-v4
# OR: use Gitlab V4
npm install @vssue/api-gitlab-v4
# OR: use Bitbucket V2
npm install @vssue/api-bitbucket-v2
```

### Usando como um Plugin Vue

Com `import Vssue from 'vssue'` você obtém um plugin Vue. Chame `Vue.use()` para usá-lo e defina as opções. Um componente global chamado `Vssue` será registrado.

> Para detalhes sobre as opções, consulte [Configuração - Opções do Vssue](../options/README.md#vssue-options)

```js
// import vue
import Vue from 'vue'
// import vssue
import Vssue from 'vssue'
// import the api package for specific platform
import GithubV3 from '@vssue/api-github-v3'
// import the stylesheet of vssue
import 'vssue/dist/vssue.css'

Vue.use(Vssue, {
  // set the platform api
  api: GithubV3,

  // here set the default options for your OAuth App
  owner: 'OWNER_OF_REPO',
  repo: 'NAME_OF_REPO',
  clientId: 'YOUR_CLIENT_ID',
  clientSecret: 'YOUR_CLIENT_SECRET',
})

```

Então você pode usar o Componente Vssue no seu [SFC](https://br.vuejs.org/v2/guide/single-file-components.html):

> Para as propriedades do componente, consulte [Configuração - Component Props](../options/README.md#component-props)

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
      // aqui é definido o título da issue na página atual
      title: 'Vssue Demo',

      // observe que, as opções aqui irão sobrescrever as opções padrão definidas por `Vue.use()` acima
      // se você não quiser alterá-los, apenas configure a prop `title` e ignore a prop `options`
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

### Usando como um componente Vue

Com `import { VssueComponent } from 'vssue'` você obtém um componente Vue.

::: tip Dica
Quando você usa Vssue como Plugin com `Vue.use()`, este componente já está registrado como global, chamado `Vssue` via `Vue.component()`.

Se você não quiser registrá-lo globalmente, poderá importá-lo dessa maneira.

Observe que, se você importar apenas o componente Vssue, não haverá opções no componente global configurado por `Vue.use()`, e você terá que configurar todas as opções Vssue necessárias através da propriedade `options`. Veja [Configuração - opções](../options/README.md#options).

:::

```vue
<template>
  <Vssue
    :title="title"
    :options="options"
  />
</template>

<script>
import { VssueComponent } from 'vssue'
import GithubV3 from '@vssue/api-github-v3'
import 'vssue/dist/vssue.css'

export default {
  name: 'VssueDemo',

  components: {
    'Vssue': VssueComponent,
  },

  data () {
    return {
      title: 'Vssue Demo',
      options: {
        api: GithubV3,
        owner: 'OWNER_OF_REPO',
        repo: 'NAME_OF_REPO',
        clientId: 'YOUR_CLIENT_ID',
        clientSecret: 'YOUR_CLIENT_SECRET',
      },
    }
  },
}
</script>
```

## Explicacao das Distribuições

Semelhante ao Vue, o Vssue também fornece distribuições diferentes para uso diferente.

Esses arquivos estão localizados na pasta [dist](https://github.com/meteorlxy/vssue/tree/master/packages/vssue/dist):

| Filename                         | Type      | Minified | Polyfills | Usage                                  |
|----------------------------------|-----------|----------|-----------|----------------------------------------|
| vssue.js                         | ES Module | false    | false     | with bundler                           |
| vssue.[platform].min.js          | UMD       | true     | false     | in modern browser via a `<script>` tag |
| vssue.[platform].polyfill.min.js | UMD       | true     | true      | in old browser via a `<script>` tag    |

> Veja [distribuições do Vue](https://br.vuejs.org/v2/guide/installation.html#Explicacao-das-Distribuicoes)
