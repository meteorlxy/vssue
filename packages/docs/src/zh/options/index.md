---
sidebar: auto
---

# 配置参考

## Vssue 配置

Vssue 配置 （类型 `VssueOptions`）在调用 `Vue.use()` 时进行设置：

```js
import Vue from 'vue'
import Vssue from 'vssue'

Vue.use(Vssue, {
  // Vssue 配置
})
```

### api

- __类型__: `VssueAPI.Contructor`
- __详细__:

  VssueAPI 类的构造函数，而 VssueAPI 类实现了 `VssueAPI.Instance` 接口。

  Vssue 会使用它创建 VssueAPI 实例，然后通过 VssueAPI 实例向平台发出请求。

  VssueAPI 包的命名格式为 `@vssue/api-${platform}-${version}`，对应不同平台的不同 API 版本。

  目前，我们提供了以下 VssueAPI 包：

  - Github
    - API V3: `@vssue/api-github-v3`
  - Gitlab
    - API V4: `@vssue/api-gitlab-v4`
  - Bitbucket
    - API V2: `@vssue/api-bitbucket-v2`

- __示例__:

  ```js
  import Vue from 'vue'
  import Vssue from 'vssue'
  import GithubV3 from '@vssue/api-github-v3'

  Vue.use(Vssue, {
    api: GithubV3,
    // 其它 Vssue 配置
  })
  ```

  ::: tip
  实际上，平台本身对于 Vssue 来说是“不透明”的。Vssue 只是通过 API 实例来加载评论，并不关心具体的平台是什么、使用的是哪个版本的 API。Vssue 就是通过这种方法来支持多个平台的。

  所以通过创建新的 API 包，很容易支持新的平台和新的 API 版本。
  :::

### owner

- __类型__: `string`
- __详细__:

  用来存储 Issue 和评论的仓库的拥有者的名称。可能是一个用户，也可能是一个组织（__Github Organization__ / __Gitlab Group__ / __Bitbucket Team__）

  Vssue 将通过 `owner` 和 `repo` 在平台上定位这个仓库。

- __参考__: [repo](#repo)

### repo

- __类型__: `string`
- __详细__:

  用来存储 Issue 和评论的仓库的名称。

  Vssue 将通过 `owner` 和 `repo` 在平台上定位这个仓库。

- __参考__: [owner](#owner)

::: tip
仓库 URL 的常见模式是 `` `${baseURL}/${owner}/${repo}`  ``：

- Github: `https://github.com/${owner}/${repo}`
- Gitlab: `https://gitlab.com/${owner}/${repo}`
- Bitbucket: `https://bitbucket.org/${owner}/${repo}`
:::

### clientId

- __类型__: `string`
- __详细__:

  在 [OAuth2 spec](https://tools.ietf.org/html/rfc6749#section-2.3.1) 中介绍的 `client_id`。

  它是由平台分配的 client 标识符。你在创建 OAuth App 之后就可以得到它。

  Vssue 将使用 `clientId` 和 `clientSecret` 来获取用户的 access token。

- __参考__: [创建 OAuth App](../guide/supported-platforms.md), [clientSecret](#clientsecret)

### clientSecret

- __类型__: `string`
- __详细__:

  在 [OAuth2 spec](https://tools.ietf.org/html/rfc6749#section-2.3.1) 中介绍的 `client_secret`。

  它是由平台生成的 client 密钥。你在创建 OAuth App 之后就可以得到它。

  Vssue 将使用 `clientId` 和 `clientSecret` 来获取用户的 access token。

- __参考__: [创建 OAuth App](../guide/supported-platforms.md), [clientId](#clientid)

::: tip
在不同平台上， __OAuth App__、`clientId` 和 `clientSecret` 的实际名称也不同：

- Github: __OAuth App__, __Client ID__ 和 __Client Secret__
- Gitlab: __Application__, __Application ID__ 和 __Secret__
- Bitbucket: __OAuth consumer__, __Key__ 和 __Secret__
:::

### baseURL

- __类型__: `string`
- __默认值__: `undefined` （根据不同平台变化）
- __详细__:

  平台的 base URL。

  对于我们支持的平台，默认值为：

  - Github 是 `'https://github.com'`
  - Gitlab 是 `'https://gitlab.com'`
  - Bitbucket 是`'https://bitbucket.org'`

  ::: warning 注意
  只有在你要使用 __自行搭建的 Gitlab__ 时才需要设置这个选项。
  :::

- __参考__: [Gitlab Application](../guide/gitlab.md)

### state

- __类型__: `string`
- __默认值__: `'Vssue'`
- __详细__:

  在 [OAuth2 spec](https://tools.ietf.org/html/rfc6749#section-4.1.1) 中介绍的 `state`。
  
  Vssue 将会在重定向到平台认证界面时发送它，并在平台认证返回后检查它是否正确。

  它是被设计用来避免 [CSRF](https://tools.ietf.org/html/rfc6749#section-10.12) 的，但是由于我们所有东西都在静态页面上，所以它没有太大作用。忽略这个选项，或者随便设置成什么值都行。

### labels

- __类型__: `Array<string>`
- __默认值__: `['Vssue']`
- __详细__:

  用来设置 Vssue 使用的 Issue 的 labels （标签）。

  Vssue 只会请求拥有对应标签的 Issue，忽略其他的 Issue。Vssue 通过 `title` 和 `labels` 来确定用来存储评论的对应 Issue。传入多个字符串可以设置多个标签，只有同时满足这些标签的 Issue 才会被 Vssue 请求。

  ::: tip
  Bitbucket 目前不支持 Issue 标签功能，所以如果你使用 Bitbucket 的话，这个配置将会被忽略。

  Github 支持在标签名称中加入 emoji，如 `[':heart:Vssue', ':mailbox:Comments']`。
  :::

- __参考__: [title](#title)

### prefix

- __类型__: `string`
- __默认值__: `'[Vssue]'`
- __详细__:

  Issue 标题的前缀。用于生成存储评论的对应 Issue 的实际标题。

  举例来说，如果 `prefix` 是 `'[Vssue]'`，`title` 是 `'Vssue Demo'`，那么 Issue 的实际标题就是 `'[Vssue]Vssue Demo'`。

  如果 `title` 的类型是 `Function`，这个配置将会被忽略。

- __参考__: [title](#title)

### admins

- __类型__: `Array<string>`
- __默认值__: `[]`
- __详细__:

  拥有 admin 权限的用户数组。`owner` 始终视为拥有 admin 权限。

  只有 `admins` 才能在存储评论的 Issue 不存在时自动创建它。

  ::: tip
  在 `owner` 是一个组织而不是用户时，可以将你的用户名添加进 `admins` 来自动创建对应 Issue。
  :::

- __Reference__: [owner](#owner)

### perPage <Badge text="v0.2+"/>

- __类型__: `number`
- __默认值__: `10`
- __详细__:

  默认每页显示的评论数。

## 组件 Props

### title

- __类型__: `string | (options: VssueOptions) => string`
- __是否必须__: `false`
- __默认值__: `` options => `${options.prefix}${document.title}` ``
- __详细__:

  当前 Vssue 组件使用的 Issue 的标题。

  - 如果类型是 `string`，实际标题是 `` `${prefix}${title}` ``。
  - 如果类型是 `Function`，实际标题是函数的返回值。注意，这个函数的第一个参数是 Vssue 的 options，你可以通过它们来生成实际的标题。

  ::: warning 注意
  Vssue 在尝试加载评论时，将会根据 `labels` 和 `title` 来请求对应的 Issue。如果这个 Issue 不存在，将会尝试创建它。

  换句话说，`labels` 和 `title` 是存储评论的对应 Issue 的标识符。

  所以请确保不同页面的 Vssue 使用不同的 `title`。拥有相同 `title` 的 Vssue 会对应到同一个 Issue，也就会有同样的评论。
  :::

- __参考__: [prefix](#prefix), [labels](#labels)

### issueId <Badge text="v0.2+"/>

- __类型__: `string | number`
- __是否必须__: `false`
- __默认值__: `null`
- __详细__:

  当前 Vssue 组件使用的 Issue 的 ID。
  
  如果设置了 `issueId`， `labels`、 `preifx` 和 `title` 都将被忽略。

  ::: danger 注意
  如果设置了 `issueId`，Vssue 将会直接使用它来确定要使用哪个 Issue，而不是根据 `labels` 和 `title` 来查找对应的 Issue。这会加快 Vssue 的初始化过程、

  但是在这种情况下，你必须要 __手动创建 Issue__。如果对应的 Issue 不存在，Vssue 不会尝试为你创建一个新的 Issue。
  :::

### options

- __类型__: `Object` (`Partial<VssueOptions>`)
- __是否必须__: `false`
- __默认值__: `{}`
- __详细__:

  在 prop `options` 中设置的属性，会覆盖通过 `Vue.use()` 设置的属性。它可以接收 `VssueOptions` 中的所有配置。

  你可以把通过 `Vue.use()` 设置的配置当作 Vssue 的 __全局__ / __默认__ 配置，把通过 prop `options` 设置的配置当作 __局部__ 配置。

- __参考__: [Vssue 配置](#vssue-配置)
