# Introduction

Vssue (/'vɪʃuː/, combined by "V" and "Issue") is a Vue component / plugin, which can enable comments for your static pages.

As your pages are "static", you don't have database nor backend APIs, but you still want users to login and post comments. With the help of OAuth API of the code hosting platforms (e.g. Github, Gitlab, Bitbucket, Coding, etc.), Vssue can help users to login with account of those platforms, store the comments in their Issue System, and display the comments on current page.

This is how __Vssue__ get its name : __Vue__-powered and __Issue__-based.

## How Vssue works

Following the [OAuth 2 spec](https://tools.ietf.org/html/rfc6749), platforms provide OAuth API. With the help of them, users can login to Vssue with accounts of the platform and access comments.

Here is the brief process about how Vssue works:

->![How Vssue Works](/assets/img/how-vssue-works-en.png)<-

After Vssue is authorized by users for the platform in the Authorization Page, the platform will redirect back to Vssue with `code` or `token`. (if with `code`, Vssue will request the platform for `token` by `code`)

After getting `token`, Vssue will store `token` in localstorage, which means that users have "logged-in" to Vssue with the account of the platform.

Then Vssue could get the users' info and get the comments of this page. And users could post comments, too.

## Comparison with similar projects

__Vssue__ is inspired by [__Gitment__](https://github.com/imsun/gitment) and [__Gitalk__](https://github.com/gitalk/gitalk), with some differences:

- __Vssue__ supports Github, Gitlab, Bitbucket, Gitee and Gitea, and can be extended to other platform easily. __Gitment__ and __Gitalk__ only support Github.
- __Vssue__ can post, edit and delete comments. __Gitment__ and __Gitalk__ can only post comments.
- __Vssue__ is based on [Vue.js](https://vuejs.org) so can be integrated into Vue projects, and provides a [VuePress Plugin](./vuepress.md). __Gitment__ is based on vanilla javascript, and __Gitalk__ is based on [Preact](https://github.com/developit/preact).
