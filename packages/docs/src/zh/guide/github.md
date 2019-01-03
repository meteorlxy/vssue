# GitHub OAuth App

1. 前往 [Settings - Developer Settings - OAuth Apps](https://github.com/settings/developers)，并点击 [New OAuth App](https://github.com/settings/applications/new)

![配置 OAuth App - Github 01](/assets/img/oauth-app-github-01.png)
![配置 OAuth App - Github 02](/assets/img/oauth-app-github-02.png)
![配置 OAuth App - Github 03](/assets/img/oauth-app-github-03.png)

2. 将 `Homepage URL` 和 `Authorization callback URL` 设置为你的网站 URL。

这里我们用 `localhost:8080` 作为示例。

![配置 OAuth App - Github 04](/assets/img/oauth-app-github-04.png)

3. 现在你已经创建了一个新的 OAuth App，并得到了相应的 `Client ID` 和 `Client Secrect`。

![配置 OAuth App - Github 05](/assets/img/oauth-app-github-05.png)

4. 复制 `Client ID` 和 `Client Secrect`, 并设置 `owner` 和 `repo`。

> Github repository 的 URL 模式为 `https://github.com/${owner}/${repo}`

这里我们以 `https://github.com/meteorlxy/vssue-demo` 为例，并把 issue 的 `title` 设置为 `Vssue Demo`。

然后运行 `anywhere -h localhost 8080`，在 `localhost:8080` 监听一个 http server 并返回 `index.html`。

![配置 OAuth App - Github 06](/assets/img/oauth-app-github-06.png)

5. Vssue 已经成功运行。点击 `Login` 使用 Github 帐号登录。

![配置 OAuth App - Github 07](/assets/img/oauth-app-github-07.png)

6. 重定向到 Github 授权页面。点击 `Authorize ${你的帐号}` 来登录。

![配置 OAuth App - Github 08](/assets/img/oauth-app-github-08.png)

7. 在当前页面写下评论吧 ~

![配置 OAuth App - Github 09](/assets/img/oauth-app-github-09.png)

![配置 OAuth App - Github 10](/assets/img/oauth-app-github-10.png)

::: tip
你可以前往 [meteorlxy/vssue-demo](https://github.com/meteorlxy/vssue-demo) 来获取 demo 代码。前往该仓库的 [#1 issue](https://github.com/meteorlxy/vssue-demo/issues/1) 看看发生了什么。
:::
