# Gitea 应用

> Vssue 同样可以配合自己搭建的 Gitea 使用。只需要将 `baseURL` 设置为你的 Gitea URL 即可。查看 [配置参考 - baseURL](../options/README.md#baseurl)

> Gitea 需要设置 `clientSecret`，因为 Gitea 目前还不支持 implicit grant type

## 创建一个新的应用

- 前往 [设置 - 应用](https://gitea.com/user/settings/applications)

->![配置 OAuth App - Gitea 01](/assets/img/oauth-app-gitea-zh-01.png)<-
->![配置 OAuth App - Gitea 02](/assets/img/oauth-app-gitea-zh-02.png)<-

- 将 `重定向 URI` 设置为你的网站 URL （这里我们用 `localhost:8080` 作为示例）
- 点击 `创建应用`

->![配置 OAuth App - Gitea 03](/assets/img/oauth-app-gitea-zh-03.png)<-

## 获取 Client ID 和 Secret

现在你已经创建了一个新的第三方应用，并得到了相应的 客户端 ID (`Client ID`) 和 客户端密钥 (`Client Secret`) 。

->![配置 OAuth App - Gitea 04](/assets/img/oauth-app-gitea-zh-04.png)<-

## 配置并启动你的 Vssue

复制 `Client ID` 和 `Client Secret`, 并设置 `owner` 和 `repo`。

> Gitea repository 的 URL 模式为 `https://gitea.com/${owner}/${repo}`

这里我们以 `https://gitea.com/meteorlxy/vssue-demo` 为例，并把 issue 的 `title` 设置为 `Vssue Demo`。

然后运行 `anywhere -h localhost 8080`，在 `localhost:8080` 监听一个 http server 并返回 `index.html`。

->![配置 OAuth App - Gitea 05](/assets/img/oauth-app-gitea-05.png)<-

## 在本地尝试 Vssue

Vssue 已经成功运行。点击 `登录` 使用 Gitea 帐号登录，并通过 `点击创建 Issue` 创建 Issue。

->![配置 OAuth App - Gitea 06](/assets/img/oauth-app-gitea-zh-06.png)<-

重定向到 Gitea 授权页面。点击 `应用授权` 来登录。

->![配置 OAuth App - Gitea 07](/assets/img/oauth-app-gitea-zh-07.png)<-

在当前页面写下评论吧 ~

->![配置 OAuth App - Gitea 08](/assets/img/oauth-app-gitea-zh-08.png)<-

->![配置 OAuth App - Gitea 09](/assets/img/oauth-app-gitea-zh-09.png)<-

::: tip 提示
你可以前往 [meteorlxy/vssue-demo](https://gitea.com/meteorlxy/vssue-demo) 来获取 demo 代码。前往该仓库的 [第一个 issue](https://gitea.com/meteorlxy/vssue-demo/issues/1) 看看发生了什么。
:::
