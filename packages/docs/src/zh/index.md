---
home: true
heroImage: /logo.png
actionText: 开始使用 →
actionLink: /guide/
features:
- title: 页面评论
  details: 为静态页面开启评论功能，基于代码托管服务的 Issue 系统。
- title: 多平台
  details: 支持多个代码托管平台，包括 GitHub, GitLab 和 BitBucket。
- title: 基于Vue
  details: 可以作为 Vue 插件使用，轻松集成到你的 Vue 应用中。
footer: MIT Licensed | Vssue
---

## 演示

::: tip 提示
在你评论了一个 Issue 之后，每当有新评论，平台都会给你发送邮件提醒。有新用户在这个演示页面留下评论时，这些提醒邮件可能会比较烦人。

你可以前往 [Issue 页面](https://github.com/meteorlxy/vssue/issues/1)来取消订阅提醒（unsubscribe the notifications）。
:::

<Vssue :issue-id="1" />
