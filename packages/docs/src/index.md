---
home: true
heroImage: /logo.png
actionText: Get Started →
actionLink: /guide/
features:
- title: Comments
  details: Enable comments support for static pages, based on the issue system of code hosting services.
- title: Multi-platform
  details: Support multiple code hosting services, including GitHub, GitLab and BitBucket.
- title: Use Vue
  details: Use Vssue as a Vue plugin, and can be integrated in your Vue App easily.
footer: MIT Licensed | Vssue
---

## Demo

::: tip
After you comment on an issue, the platform will send you emails when new comments come.  The emails might be annoying when new users come and leave comments on this demo page.

You can go to the [issue page](https://github.com/meteorlxy/vssue/issues/1) and unsubscribe the notifications.
:::

<Vssue :issue-id="1" />
