# 介绍

Vssue (/'vɪʃuː/，由 "V" 和 "Issue" 组合而来) 是一个 __Vue__ 组件 / 插件，可以为你的静态页面开启评论功能。

由于你的页面是“静态”的，你没有数据库和后端 API 的支持。但是你希望让你的页面拥有评论功能，让用户可以登录和发表评论。代码托管平台（如 Github、Gitlab、Bitbucket、Coding 等平台）提供了 OAuth API ，在它们的帮助下，Vssue 可以让用户通过这些平台的帐号登录，将评论存储在这些平台的 __Issue__ 系统中，并在当前页面展示。

这也是 __Vssue__ 名字的由来：由 __Vue__ 驱动并基于 __Issue__ 实现。

## Vssue 是如何工作的

代码托管平台遵从 [OAuth 2 spec](https://tools.ietf.org/html/rfc6749) 提供了 OAuth API。Vssue 利用平台提供的 OAuth API，使得用户可以登录并发表评论。

下面是 Vssue 的简要工作过程：

```
           Vssue                                               平台
  ┌──────────────────────┐                            ┌────────────────────┐
  │       点击登录        ├───────── 重定向 ──────────>│       授权页面      │
  └──────────────────────┘                            └──────────┬─────────┘
  ┌──────────────────────┐                                       │
  │                      │<──── 带有 token / code 重定向 ─────────┘
  │       处理授权        │                            ┌────────────────────┐
  │                      │<─── (可能)请求获取 token ──>│                    │
  └──────────────────────┘                            │                    │
  ┌──────────────────────┐                            │                    │
  │       获取评论        │<─── 带有 token 发出请求 ───>│      平台 API      │
  └──────────────────────┘                            │                    │
  ┌──────────────────────┐                            │                    │
  │       发表评论        │<─── 带有 token 发出请求 ───>│                    │
  └──────────────────────┘                            └────────────────────┘
          ......
```

用户在平台的授权页面允许 Vssue 接入后，平台会带有 `code` 重定向回 Vssue 的页面。

Vssue 将会根据 `code` 向平台请求获取用户的 `token`，然后将 `token` 存储在 localstorage 中，于是用户就成功使用平台的帐号“登录”了 Vssue。

接下来， Vssue 就可以获取用户的基本信息、获取当前页面的评论，用户也可以发表评论了。

## 与类似项目的比较

__Vssue__ 的灵感来自于 [__Gitment__](https://github.com/imsun/gitment) 和 [__Gitalk__](https://github.com/gitalk/gitalk)，但是和它们有些区别：

- __Vssue__ 支持 Github、Gitlab 和 Bitbucket，并且很容易扩展到其它平台。__Gitment__ 和 __Gitalk__ 仅支持 Github。
- __Vssue__ 可以发表、编辑、删除评论。__Gitment__ 和 __Gitalk__ 仅能发表评论。
- __Vssue__ 是基于 [Vue.js](https://vuejs.org) 开发的，可以集成到 Vue 项目中，并且提供了一个 [Vuepress 插件](./vuepress.md)。 __Gitment__ 基于原生JS，而 __Gitalk__ 基于 [Preact](https://github.com/developit/preact)。
