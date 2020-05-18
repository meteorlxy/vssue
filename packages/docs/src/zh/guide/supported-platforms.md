# 支持的代码托管平台

## GitHub

指南： [创建 GitHub OAuth App](./github.md)

### Github REST API V3

- Vssue API 包： [@vssue/api-github-v3](https://www.npmjs.com/package/@vssue/api-github-v3)
- 特点 / 缺点：
  - 需要设置 [clientSecret](../options/README.md#clientsecret)
  - 评论无法排序
  - 评论可以编辑
  - 评论可以删除
  - 可以不登录浏览评论，但 API 有调用频率限制
- 开发者参考： [官方文档](https://developer.github.com/v3)

### Github GraphQL API V4

- Vssue API 包： [@vssue/api-github-v4](https://www.npmjs.com/package/@vssue/api-github-v4)
- 特点 / 缺点：
  - 需要设置 [clientSecret](../options/README.md#clientsecret)
  - 评论可以排序
  - 评论可以编辑
  - 评论可以删除
  - 要求登陆后才能浏览评论
- 开发者参考： [官方文档](https://developer.github.com/v4)

## GitLab

指南： [创建 GitLab Application](./gitlab.md)

### Gitlab API V4 (Gitlab v11.0+)

- Vssue API 包： [@vssue/api-gitlab-v4](https://www.npmjs.com/package/@vssue/api-gitlab-v4)
- 特点 / 缺点：
  - 评论可以排序
  - 评论可以编辑
  - 评论可以删除
  - 要求登陆后才能浏览评论
  - 需要逐个添加回调地址 - [参考](https://gitlab.com/gitlab-org/gitlab/issues/23054)
- 开发者参考： [官方文档](https://docs.gitlab.com/ce/api)

## Bitbucket

指南： [创建 Bitbucket OAuth Consumer](./bitbucket.md)

### Bitbucket API V2

- Vssue API 包： [@vssue/api-bitbucket-v2](https://www.npmjs.com/package/@vssue/api-bitbucket-v2)
- 特点 / 缺点：
  - 评论可以排序
  - 评论可以编辑
  - 评论可以删除
  - 可以不登录浏览评论
  - 不能对评论做出 emoji 响应 （喜欢、点赞、踩 等）
- 开发者参考： [官方文档](https://developer.atlassian.com/bitbucket/api/2/reference)

## Gitee

指南： [创建 Gitee 第三方应用](./gitee.md)

### Gitee API V5

- Vssue API 包： [@vssue/api-gitee-v5](https://www.npmjs.com/package/@vssue/api-gitee-v5)
- 特点 / 缺点：
  - 需要设置 [clientSecret](../options/README.md#clientsecret)
  - 评论无法排序
  - 评论可以编辑
  - 评论可以删除
  - 可以不登录浏览评论，但 API 有调用频率限制
  - 不能对评论做出 emoji 响应 （喜欢、点赞、踩 等）
  - 只支持单个固定的回调地址 - [参考](https://gitee.com/oschina/git-osc/issues/IV0FL)
- 开发者参考： [官方文档](https://gitee.com/api/v5/swagger)

## Gitea

指南： [创建 Gitea 应用](./gitea.md)

### Gitea API V1

- Vssue API 包： [@vssue/api-gitea-v1](https://www.npmjs.com/package/@vssue/api-gitea-v1)
- 特点 / 缺点：
  - 需要设置 [clientSecret](../options/README.md#clientsecret)
  - 评论无法排序，且不支持分页 - [参考](https://github.com/go-gitea/gitea/issues/6132)
  - 评论可以编辑
  - 评论可以删除
  - 可以不登录浏览评论
  - 只支持单个固定的回调地址 - [参考](https://github.com/go-gitea/gitea/issues/9514)
- 开发者参考：
  - [官方文档](https://docs.gitea.io/zh-cn)
  - [官方 API 参考](https://gitea.com/api/swagger)
