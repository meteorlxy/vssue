---
sidebar: auto
---

# 配置参考

## Vssue 配置

Vssue 配置 （类型 `VssueOptions`）在调用 `Vue.use()` 时进行设置：

```js
import Vue from 'vue';
import Vssue from 'vssue';

Vue.use(Vssue, {
  // Vssue 配置
});
```

### api

- **类型**: `VssueAPI.Constructor`
- **详细**:

  VssueAPI 类的构造函数，而 VssueAPI 类实现了 `VssueAPI.Instance` 接口。

  Vssue 会使用它创建 VssueAPI 实例，然后通过 VssueAPI 实例向平台发出请求。

  VssueAPI 包的命名格式为 `@vssue/api-${platform}-${version}`，对应不同平台的不同 API 版本。

  查看 [支持的代码托管平台](../guide/supported-platforms.md) 了解目前提供的 VssueAPI 包。

- **示例**:

  ```js
  import Vue from 'vue';
  import Vssue from 'vssue';
  import GithubV3 from '@vssue/api-github-v3';

  Vue.use(Vssue, {
    api: GithubV3,
    // 其它 Vssue 配置
  });
  ```

  ::: tip
  实际上，平台本身对于 Vssue 来说是“不透明”的。Vssue 只是通过 API 实例来加载评论，并不关心具体的平台是什么、使用的是哪个版本的 API。Vssue 就是通过这种方法来支持多个平台的。

  所以通过创建新的 API 包，很容易支持新的平台和新的 API 版本。
  :::

### owner

- **类型**: `string`
- **详细**:

  用来存储 Issue 和评论的仓库的拥有者的名称。可能是一个用户，也可能是一个组织（**Github Organization** / **Gitlab Group** / **Bitbucket Team**）

  Vssue 将通过 `owner` 和 `repo` 在平台上定位这个仓库。

- **参考**: [repo](#repo)

### repo

- **类型**: `string`
- **详细**:

  用来存储 Issue 和评论的仓库的名称。

  Vssue 将通过 `owner` 和 `repo` 在平台上定位这个仓库。

- **参考**: [owner](#owner)

::: tip
仓库 URL 的常见模式是 `` `${baseURL}/${owner}/${repo}` ``：

- Github: `https://github.com/${owner}/${repo}`
- Gitlab: `https://gitlab.com/${owner}/${repo}`
- Bitbucket: `https://bitbucket.org/${owner}/${repo}`
- Gitee: `https://gitee.com/${owner}/${repo}`
- Gitea: `https://gitea.com/${owner}/${repo}`
  :::

### clientId

- **类型**: `string`
- **详细**:

  在 [OAuth2 spec](https://tools.ietf.org/html/rfc6749#section-2.3.1) 中介绍的 `client_id`。

  它是由平台分配的 client 标识符。你在创建 OAuth App 之后就可以得到它。

  Vssue 将使用 `clientId` 来获取用户的 access token。

- **参考**:
  - [创建 OAuth App](../guide/supported-platforms.md)

### clientSecret

- **类型**: `string`
- **默认值**: `undefined`
- **详细**:

  在 [OAuth2 spec](https://tools.ietf.org/html/rfc6749#section-2.3.1) 中介绍的 `client_secret`。

  它是由平台生成的 client 密钥。你在创建 OAuth App 之后就可以得到它。

  在和某些平台一起使用时， Vssue 将使用 `clientId` 和 `clientSecret` 来获取用户的 access token。

  ::: tip
  一些平台（如 Bitbucket 和 GitLab）支持 [Implicit Grant](https://tools.ietf.org/html/rfc6749#section-4.2)，所以在使用这些平台时不需要 `clientSecret`。

  然而，有一些平台（如 GitHub, Gitee 和 Gitea）不支持它，所以在使用这些平台时 `clientSecret` 是必须的。
  :::

- **参考**:
  - [clientId](#clientid)
  - [proxy](#proxy)
  - [创建 OAuth App](../guide/supported-platforms.md)

### baseURL

- **类型**: `string`
- **默认值**: `undefined` （根据不同平台变化）
- **详细**:

  平台的 base URL。

  对于我们支持的平台，默认值为：

  - Github 是 `'https://github.com'`
  - Gitlab 是 `'https://gitlab.com'`
  - Bitbucket 是`'https://bitbucket.org'`
  - Gitee 是`'https://gitee.com'`
  - Gitea 是`'https://gitea.com'`

  ::: warning 注意
  只有在你要使用 **自行搭建的** 平台时才需要设置这个选项。（比如 **GitLab Community / Enterprise Edition** 或 **GitHub Enterprise Server**）
  :::

- **参考**:
  - [GitHub OAuth App](../guide/github.md)
  - [GitLab Application](../guide/gitlab.md)

### state

- **类型**: `string`
- **默认值**: `'Vssue'`
- **详细**:

  在 [OAuth2 spec](https://tools.ietf.org/html/rfc6749#section-4.1.1) 中介绍的 `state`。

  Vssue 将会在重定向到平台认证界面时发送它，并在平台认证返回后检查它是否正确。

  它是被设计用来避免 [CSRF](https://tools.ietf.org/html/rfc6749#section-10.12) 的，但是由于我们所有东西都在静态页面上，所以它没有太大作用。忽略这个选项，或者随便设置成什么值都行。

### labels

- **类型**: `Array<string>`
- **默认值**: `['Vssue']`
- **详细**:

  用来设置 Vssue 使用的 Issue 的 labels （标签）。

  Vssue 只会请求拥有对应标签的 Issue，忽略其他的 Issue。Vssue 通过 `title` 和 `labels` 来确定用来存储评论的对应 Issue。传入多个字符串可以设置多个标签，只有同时满足这些标签的 Issue 才会被 Vssue 请求。

  ::: tip
  Bitbucket 目前不支持 Issue 标签功能，所以如果你使用 Bitbucket 的话，这个配置将会被忽略。

  Github 支持在标签名称中加入 emoji，如 `[':heart:Vssue', ':mailbox:Comments']`。
  :::

- **参考**: [title](#title)

### prefix

- **类型**: `string`
- **默认值**: `'[Vssue]'`
- **详细**:

  Issue 标题的前缀。用于生成存储评论的对应 Issue 的实际标题。

  举例来说，如果 `prefix` 是 `'[Vssue]'`，`title` 是 `'Vssue Demo'`，那么 Issue 的实际标题就是 `'[Vssue]Vssue Demo'`。

  如果 `title` 的类型是 `Function`，这个配置将会被忽略。

- **参考**: [title](#title)

### admins

- **类型**: `Array<string>`
- **默认值**: `[]`
- **详细**:

  拥有 admin 权限的用户数组。`owner` 始终视为拥有 admin 权限。

  拥有 admin 权限的用户可以删除所有用户的评论，而其他用户只能删除自己的评论。

  只有 `admins` 才能在存储评论的 Issue 不存在时自动创建它。

  ::: tip
  在 `owner` 是一个组织而不是用户时，可以将你的用户名添加进 `admins` 来自动创建对应 Issue。
  :::

- **参考**: [owner](#owner)

### perPage

- **类型**: `number`
- **默认值**: `10`
- **详细**:

  默认每页显示的评论数。

### locale

- **类型**: `string`
- **默认值**: `undefined`
- **详细**:

  使用的语言。

  不设置该选项时，Vssue 会使用 `window.navigator.languages` 中的语言，如果其中没有 Vssue 支持的语言则会默认使用 `'en'`。

  ::: tip
  Vssue 使用 [vue-i18n](https://kazupon.github.io/vue-i18n/) 实现国际化，但是并不会影响你的 Vue 应用的其他部分。
  如果你在项目中已经使用了 vue-i18n，也不会对 Vssue 造成影响。

  语言包在 [src/i18n/langs](https://github.com/meteorlxy/vssue/tree/master/packages/vssue/src/i18n/langs) 目录下。目前我们支持：

  - `'en'` (`'en-US'`)
  - `'zh'` (`'zh-CN'`, `'zh-TW'`)
  - `'pt'` (`'pt-BR'`)
  - `'ja'` (`'ja-JP'`)
  - `'he'` (`'he-IL'`)
  - `'ko'` (`'ko-KR'`)
  - `'fr'` (`'fr-FR'`)

  欢迎贡献代码帮助 Vssue 支持更多语言。
  :::

### proxy

- **类型**: `string | ((url: string) => string)`
- **默认值**: `` url => `https://cors-anywhere.azm.workers.dev/${url}` ``
- **详细**:

  某些平台（如 GitHub, Gitee 和 Gitea）不支持 Implicit Grant，所以我们必须通过请求平台的 API 来获取 Access Token。

  然而，平台的 Access Token API 不支持 CORS （详见 [GitHub 的相关 Issue](https://github.com/isaacs/github/issues/330)）。由于 Vssue 是一个纯前端插件，我们必须要通过代理来请求 Access Token。

  默认情况下，我们使用一个开源的 CORS 代理服务 [cors-anywhere](https://github.com/Rob--W/cors-anywhere)。

  如果你希望使用自己的代理，就需要设置这个选项。

  如果你使用的平台不需要设置 `clientSecret`，那么该选项会被忽略。

- **示例**:

  ```js
  proxy: url => `https://your.cors.porxy?target=${url}`;
  ```

- **参考**:
  - [clientSecret](#clientsecret)

### issueContent

- **类型**: `((param: { options: Vssue.Options, url: string }) => string | Promise<string>)`
- **默认值**: `({ url }) => url`
- **详细**:

  Vssue 自动创建 Issue 时使用的内容。

  Vssue 将使用该函数的返回值作为 Issue 的内容。

  参数包含两个属性：

  - `options` 是 Vssue 的 options。
  - `url` 是当前页面的 URL ，是 Vssue 生成 Issue 时默认使用的内容。

- **示例**:

  ```js
  issueContent: ({ url }) =>
    `这个 Issue 由 Vssue 自动创建，用来存储该页面的评论：${url}`;
  ```

  ::: tip
  `issueContent` 只用来在对应 Issue 不存在时新建 Issue。

  如果对应的 Issue 已经存在，Vssue 不会更新 Issue 的内容。
  :::

### autoCreateIssue

- **类型**: `boolean`
- **默认值**: `false`
- **详细**:

  如果 `autoCreateIssue` 设置为 `true`，在对应的 Issue 不存在时，Vssue 会自动尝试为你创建 Issue。注意，若你当前没有登录，则 Vssue 会自动跳转到平台的认证页面。

  如果 `autoCreateIssue` 设置为 `false`，你必须手动创建 Issue。

## 组件 Props

Vssue 组件 Props 是在使用 `<Vssue />` 组件时设置的：

```vue
<!-- 使用 title -->
<Vssue title="Hello, Vssue!" :options="{ locale: 'zh' }" />

<!-- 或：使用 issueId -->
<Vssue :issue-id="1" :options="{ locale: 'zh' }" />
```

### title

- **类型**: `string | ((options: VssueOptions) => string)`
- **是否必须**: `false`
- **默认值**: `` options => `${options.prefix}${document.title}` ``
- **详细**:

  当前 Vssue 组件使用的 Issue 的标题。

  - 如果类型是 `string`，实际标题是 `` `${prefix}${title}` ``。
  - 如果类型是 `Function`，实际标题是函数的返回值。注意，这个函数的第一个参数是 Vssue 的 options，你可以通过它们来生成实际的标题。

  ::: tip 提示
  虽然 `title` 有默认值，但是我们建议你在 SPA 中明确设置 `title` 的值，否则在 SPA 的不同页面间切换时，Vue.js 可能会只使用同一个 Vssue 组件实例。当然，你也可以使用 [key](https://cn.vuejs.org/v2/api/#key) 来帮助 Vue.js 辨识组件。
  :::

  ::: warning 注意
  Vssue 在尝试加载评论时，将会根据 `labels` 和 `title` 来请求对应的 Issue。如果这个 Issue 不存在，将会使用 `title` 、 `issueContent` 和 `labels` 来创建一个新的 Issue。

  换句话说，`labels` 和 `title` 是存储评论的对应 Issue 的标识符。

  所以请确保不同页面的 Vssue 使用不同的 `title`。拥有相同 `title` 的 Vssue 会对应到同一个 Issue，也就会有同样的评论。
  :::

- **参考**:
  - [prefix](#prefix)
  - [labels](#labels)
  - [issueContent](#issuecontent)

### issueId

- **类型**: `string | number`
- **是否必须**: `false`
- **默认值**: `null`
- **详细**:

  当前 Vssue 组件使用的 Issue 的 ID。

  如果设置了 `issueId`，下列参数将会被忽略：

  - Options: `labels`, `prefix`, `issueContent` 和 `autoCreateIssue`
  - Props: `title`

  ::: danger 注意
  如果设置了 `issueId`，Vssue 将会直接使用它来确定要使用哪个 Issue，而不是根据 `labels` 和 `title` 来查找对应的 Issue。这会加快 Vssue 的初始化过程。

  但是在这种情况下，你必须要 **手动创建 Issue**。如果对应的 Issue 不存在，Vssue 不会尝试为你创建一个新的 Issue。
  :::

### options

- **类型**: `Object` (`Partial<VssueOptions>`)
- **是否必须**: `false`
- **默认值**: `{}`
- **详细**:

  在 prop `options` 中设置的属性，会覆盖通过 `Vue.use()` 设置的属性。它可以接收 `VssueOptions` 中的所有配置。

  你可以把通过 `Vue.use()` 设置的配置当作 Vssue 的 **全局** / **默认** 配置，把通过 prop `options` 设置的配置当作 **局部** 配置。

- **参考**: [Vssue 配置](#vssue-配置)
