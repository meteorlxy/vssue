---
sidebar: auto
---

# Configuração

## Opções do Vssue

As opções do Vssue (type `VssueOptions`) são definidas na chamada de `Vue.use()`:

```js
import Vue from 'vue'
import Vssue from 'vssue'

Vue.use(Vssue, {
  // Vssue Options
})
```

### api

- __Tipo__: `VssueAPI.Constructor`
- __Detalhes__:

  O construtor da classe VssueAPI implementa a interface `VssueAPI.Instance`.

  O Vssue o usará para criar uma instância do VssueAPI, que por sua vez irá enviar requisições à plataforma.

  O formato de nomenclatura dos pacotes VssueAPI é `@vssue/api-${platform}-${version}`, para suportar diferentes versões de API para diferentes plataformas.

  Consulte [Plataformas Suportadas](../guide/supported-platforms.md) para ver os pacotes VssueAPI disponíveis.

- __Exemplo__:

  ```js
  import Vue from 'vue'
  import Vssue from 'vssue'
  import GithubV3 from '@vssue/api-github-v3'

  Vue.use(Vssue, {
    api: GithubV3,
    // Other Vssue Options
  })
  ```

  ::: tip Dica
  De fato, a própria plataforma é "opaca" para o Vssue. O Vssue apenas carrega comentários por meio da instância da API e não se importa com o que a plataforma é e o que é a versão da API. É assim que o Vssue suporta diferentes plataformas.

  Por isso, é fácil oferecer suporte a novas plataformas / novas versões da API criando novos pacotes de API. 
  :::

### owner

- __Tipo__: `string`
- __Detalhes__:

  O nome do proprietário do repositório para armazenar as issues e comentários. Pode ser o nome de um __user__ ou de uma organização (__Github Organization__ / __Gitlab Group__ / __Bitbucket Team__).

  Juntamente com `repo`, o Vssue consegue localizar o repositório na plataforma.

- __Referência__: [repo](#repo)

### repo

- __Tipo__: `string`
- __Detalhes__:

  O nome do repositório para armazenar as issues e comentários.

  Juntamente com `owner`, o Vssue consegue localizar o repositório na plataforma.

- __Referência__: [owner](#owner)

::: tip Dica
O padrão comum para URL de repositório é `` `${baseURL}/${owner}/${repo}`  ``:

- Github: `https://github.com/${owner}/${repo}`
- Gitlab: `https://gitlab.com/${owner}/${repo}`
- Bitbucket: `https://bitbucket.org/${owner}/${repo}`
:::

### clientId

- __Tipo__: `string`
- __Detalhes__:

  O `client_id` foi introduzido na [especificação OAuth2](https://tools.ietf.org/html/rfc6749#section-2.3.1).

  É o identificador do cliente que é emitido pela plataforma. Você o obterá depois de configurar o aplicativo OAuth.

  O Vssue irá usá-lo junto com o `clientSecret` para obter o token de acesso do usuário.

- __Referência__:
  - [clientSecret](#clientsecret)
  - [Configurar OAuth App](../guide/supported-platforms.md)
  - [Segurança](../guide/security.md)

### clientSecret

- __Tipo__: `string`
- __Detalhes__:

  O `client_secret` foi introduzido na [especificação OAuth2](https://tools.ietf.org/html/rfc6749#section-2.3.1).

  É a chave secreta do cliente gerada pela plataforma. Você o obterá depois de configurar o aplicativo OAuth.

  O Vssue irá usá-lo junto com o `clientId` para obter o token de acesso do usuário.

- __Referência__:
  - [clientId](#clientid)
  - [Configurar OAuth App](../guide/supported-platforms.md)
  - [Segurança](../guide/security.md)

- __Referência__: 

::: tip Dica
Em plataformas diferentes, o nome para os `clientId` e `clientSecret` da __OAuth App__ diferem::

- Github: __OAuth App__, __Client ID__ e __Client Secret__
- Gitlab: __Application__, __Application ID__ e __Secret__
- Bitbucket: __OAuth consumer__, __Key__ e __Secret__
:::

### baseURL

- __Tipo__: `string`
- __Padrão__: `undefined` (de acordo com a plataforma)
- __Detalhes__:

  Esta é a URL Base da sua plataforma.

  Os valores padrão pra as plataformas suportadas são:

  - `'https://github.com'` para Github
  - `'https://gitlab.com'` para Gitlab
  - `'https://bitbucket.org'` para Bitbucket

  ::: warning ATENÇÃO

  Somente quando você usar uma plataforma __self-hosted__ deve configurar esta opção. (ex. __GitLab Community/Enterprise Edition__ ou __GitHub Enterprise Server__)
  :::

- __Referência__:
  - [GitHub OAuth App](../guide/github.md)
  - [GitLab Application](../guide/gitlab.md)

### state

- __Tipo__: `string`
- __Padrão__: `'Vssue'`
- __Detalhes__:

  O elemento `state` foi introduzido na [especificação OAuth2](https://tools.ietf.org/html/rfc6749#section-4.1.1).
  
  O Vssue irá enviá-lo com o redirecionamento OAuth e verificar se ele é correspondido no retorno de chamada (callback).

   Ele foi projetado para evitar [CSRF](https://tools.ietf.org/html/rfc6749#section-10.12), mas não é tão útil aqui, pois colocamos tudo em uma página estática. Então, simplesmente ignore ou defina como quiser.

### labels

- __Tipo__: `string`
- __Padrão__: `['Vssue']`
- __Detalhes__:

  Para definir os rótulos das issues que o Vssue usa.

  O Vssue só solicitará as issues com os rótulos e ignorará outros. Juntamente com `title`, `labels` ajudará a identificar a issue correspondente do Vssue. Se você usar vários rótulos definindo mais strings, somente as issues com todos esses rótulos serão requisitadas pelo Vssue.

  ::: tip Dica
  O Bitbucket não suporta etiquetas de edição por enquanto, então esta opção será ignorada se você estiver usando o Bitbucket.

  O Github suporta emoji no nome dos marcadores, por exemplo `[':heart:Vssue', ':mailbox:Comments']`.
  :::

- __Referência__: [title](#title)

### prefix

- __Tipo__: `string`
- __Padrão__: `'[Vssue]'`
- __Detalhes__:

  O prefixo do título das issues. Usado para gerar o título real da issue correspondente.

  Por exemplo, se o `prefix` é `'[Vssue]'` e o `title` é `'Vssue Demo'`, o título real da issue correspondente é `'[Vssue]Vssue Demo'`.

  Será ignorado se o tipo de `title` for `Function`.

- __Referência__: [title](#title)

### admins

- __Tipo__: `Array<string>`
- __Padrão__: `[]`
- __Detalhes__:

  Lista de usernames que tem acesso de admin no Vssue. O `owner` sempre tem acesso de admin.

  Somente `admins` podem criar automaticamente a issue correspondente caso ela não exista.

  ::: tip Dica
  Se você quiser criar automaticamente a issue quando o `owner` for uma organização em vez de um usuário, você poderá adicionar seu nome de usuário em `admins`.
  :::

- __Referência__: [owner](#owner)

### perPage <Badge text="v0.2+"/>

- __Tipo__: `number`
- __Padrão__: `10`
- __Detalhes__:

  O valor padrão para quantos comentários exibir por página.

### locale <Badge text="v0.5+"/>

- __Tipo__: `string`
- __Padrão__: `undefined`
- __Detalhes__:

  O idioma local.

  Se não definido, Vssue usará uma das `window.navigator.languages`, ou `'en'` se nenhuma for suportada.

  ::: tip Dica
  O Vssue usa [vue-i18n](https://kazupon.github.io/vue-i18n/) para internacionalização, mas isso não afetará outras partes do seu aplicativo Vue.
  E se você já tiver o vue-i18n em seu projeto, isso não afetará o Vssue.

  Pacotes de idiomas localizados no diretório `src/i18n/lang`.
  
  Atualmente, suportamos:

  - `'en'` (`'en-US'`)
  - `'zh'` (`'zh-CN'`)
  - `'ptbr'` (`'pt-BR'`)

  Contribuições são bem-vindas para mais suporte a idiomas.
  :::

### proxy <Badge text="v0.6+"/>

- __Tipo__: `string | ((url: string) => string)`
- __Padrão__: `` url => `https://cors-anywhere.herokuapp.com/${url}` ``
- __Detalhes__:

  A API de acesso via token das plataformas não suporta o CORS (consulte a [issue do GitHub](https://github.com/isaacs/github/issues/330)). 
  Como o Vssue é um plugin de front-end puro, precisamos usar um proxy para solicitar o token de acesso.

  Por padrão, usamos um serviço de proxy CORS de código aberto [cors-anywhere](https://github.com/Rob--W/cors-anywhere) para isso.

  Se você quiser usar seu próprio proxy, precisa definir essa opção.

- __Exemplo__:

  ```js
  proxy: url => `https://your.cors.porxy?target=${url}`
  ```

- __Referência__: [Security](../guide/security.md)

### issueContent <Badge text="v0.7+"/>

- __Tipo__: `((param: { options: Vssue.Options, url: string }) => string | Promise<string>)`
- __Padrão__: `({ url }) => url`
- __Detalhes__:

  O conteúdo da issue criada automaticamente pelo Vssue.

  O Vssue usará o valor de retorno da função como o conteúdo.

  O parâmetro inclui duas propriedades:

  - `options` são as opções do Vssue.
  - "url" é o URL da página atual, que é o conteúdo padrão.

- __Exemplo__:

  ```js
  issueContent: ({ url }) => `This issue is auto created by Vssue to store comments of this page: ${url}`
  ```

  ::: tip Dica
  A opção `issueContent` é usada apenas para criar automaticamente a issue relacionada quando ela não existir.

  Se a issue já existir, o Vssue não tentará atualizar o conteúdo.
  :::

## Component Props

### title

- __Tipo__: `string | ((options: VssueOptions) => string)`
- __Obrigatório__: `false`
- __Padrão__: `` options => `${options.prefix}${document.title}` ``
- __Detalhes__:

  O título da issue usado por este componente do Vssue 

  - Se o tipo for `string`, o título real da issue será `` `${prefix}${title}` ``.
  - Se o tipo for `Function`, o título real da issue será o valor de retorno da função. Observe que o primeiro parâmetro da função são as opções do Vssue, e você pode usá-las para gerar o título real.

  ::: warning ATENÇÃO
  Quando está tentando carrregar os comentários, Vssue irá requisitar a issue correspondente de acordo com os `labels` e `title`. Se a issue não existir, Vssue tentará criar uma nova issue usando `title`, `issueContent` e `labels`.

  Em outras palavras, `labels` e `title` são os identificadores da issue correspondente.
  
  Portanto, certifique-se de que o Vssue tenha diferentes `title`s em páginas diferentes. Vssue com o mesmo `title` corresponderá à mesma issue e compartilhará os mesmos comentários.
  :::

- __Referência__:
  - [prefix](#prefix)
  - [labels](#labels)
  - [issueContent](#issuecontent)

### issueId <Badge text="v0.2+"/>

- __Tipo__: `string | number`
- __Obrigatório__: `false`
- __Padrão__: `null`
- __Detalhes__:

  O id da issue usado por este componte Vssue.

  Se `issueId` estiver definido, estes parâmetros serão ignorados:

  - Options: `labels`, `prefix` e `issueContent`
  - Props: `title`

  ::: danger ATENÇÃO
  Se `issueId` estiver definido, Vssue irá usá-lo diretamente para determinar qual issue é a correspondente, ao invés de requisitar de acordo com `labels` e `title`. Isso fará a inicialização do processo Vssue mais rápida.

  Neste caso, no entando, você terá que __criar a issue manualmente__. Se a issue correspondente não for encontrada, Vssue não irá criar uma nova para você.
  :::

### options

- __Tipo__: `Object` (`Partial<VssueOptions>`)
- __Obrigatório__: `false`
- __Padrão__: `{}`
- __Detalhes__:

  As propriedades definidas aqui sobrescreverão aquelas definidas por `Vue.use()`. Aceita todas as propriedades de `VssueOptions`.

  Você pode usar as `options` definidas por `Vue.use()` como as configurações __globais__ / __padrão__, e as `options` de `prop` como configurações __locais__.

- __Referência__: [Vssue Options](#vssue-options)
