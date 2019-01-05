# Introduction

Vssue is a __Vue__ component / plugin, which can enable comments for your static pages.

As your pages are "static", you don't have database nor backend APIs, but you still want users to login and post comments. With the help of OAuth API of the code hosting platforms (e.g. Github, Gitlab, Bitbucket, Coding, etc.), Vssue can help users to login with account of those platforms, and store the comments in their __Issue__ System.

This is how __Vssue__ get its name : __Vue__-powered and __Issue__-based.

## How Vssue works

Following the [OAuth 2 spec](https://tools.ietf.org/html/rfc6749), platforms provide OAuth API. With the help of them, users can login to Vssue with accounts of the platform and access comments.

Here is the brief process about how Vssue works:

```
           Vssue                                             Platform
  ┌──────────────────────┐                            ┌────────────────────┐
  │     Click Login      ├───────── redirect ────────>│ Authorization Page │
  └──────────────────────┘                            └──────────┬─────────┘
  ┌──────────────────────┐                                       │
  │                      │<─── redirect with code ───────────────┘
  │ Handle Authorization │                            ┌────────────────────┐
  │                      │<───── request token ──────>│                    │
  └──────────────────────┘                            │                    │
  ┌──────────────────────┐                            │                    │
  │     Get Comments     │<─── request with token ───>│    Platform  API   │
  └──────────────────────┘                            │                    │
  ┌──────────────────────┐                            │                    │
  │     Post Comments    ├──── request with token ───>│                    │
  └──────────────────────┘                            └────────────────────┘
          ......
```

After Vssue is authorized by users for the platform in the Authorization Page, the platform will redirect back to Vssue with `code`.

Vssue will request the platform for users' `token` with `code`, and store `token` in localstorage, which means that users have "logined" to Vssue with the account of the platform.

Then Vssue could get the user's info and get the comments of this page. And users could post comments, too.

## Comparison with similar projects

__Vssue__ is inspired by [__Gitment__](https://github.com/imsun/gitment) and [__Gitalk__](https://github.com/gitalk/gitalk), with some differences:

- __Vssue__ supports Github, Gitlab and Bitbucket, and can be extended to other platform easily. __Gitment__ and __Gitalk__ only support Github.
- __Vssue__ is based on [Vue.js](https://vuejs.org). __Gitment__ is based on vanilla javascript, and __Gitalk__ is based on [Preact](https://github.com/developit/preact).
