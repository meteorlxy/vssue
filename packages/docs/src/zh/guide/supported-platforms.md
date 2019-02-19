# 支持的代码托管平台

## GitHub

指南： [创建 GitHub OAuth App](./github.md)

#### Github REST API V3

- Vssue API 包： [@vssue/api-github-v3](https://www.npmjs.com/package/@vssue/api-github-v3)
- 特点 / 缺点：
  - 评论无法排序
  - 评论可以编辑
  - 评论可以删除
  - 可以不登录浏览评论，但 API 有调用频率限制
- 开发者参考： [官方文档](https://developer.github.com/v3)

#### Github GraphQL API V4 <Badge text="preview" type="error"/>

- Vssue API 包： [@vssue/api-github-v4](https://www.npmjs.com/package/@vssue/api-github-v4)
- 特点 / 缺点：
  - 评论可以排序
  - 评论无法编辑 （Github 还没有实现相应的 API）
  - 评论可以删除
  - 要求登陆后才能浏览评论
- 开发者参考： [官方文档](https://developer.github.com/v4)

## GitLab

指南： [创建 GitLab Application](./gitlab.md)

#### Gitlab API V4 (Gitlab v11.0+)

- Vssue API 包： [@vssue/api-gitlab-v4](https://www.npmjs.com/package/@vssue/api-gitlab-v4)
- 特点 / 缺点：
  - 评论可以排序
  - 评论可以编辑
  - 评论可以删除
  - 要求登陆后才能浏览评论
- 开发者参考： [官方文档](https://docs.gitlab.com/ce/api)

## Bitbucket

指南： [创建 Bitbucket OAuth Cousumer](./bitbucket.md)

#### Bitbucket API V2

- Vssue API 包： [@vssue/api-bitbucket-v2](https://www.npmjs.com/package/@vssue/api-bitbucket-v2)
- 特点 / 缺点：
  - 评论可以排序
  - 评论可以编辑
  - 评论可以删除
  - 可以不登录浏览评论
  - 登陆后 Access Token 在 1 小时后过期
  - 不能对评论做出 emoji 响应 （喜欢、点赞、踩 等）
- 开发者参考： [官方文档](https://developer.atlassian.com/bitbucket/api/2/reference)

## Coding

指南： []()

#### Coding API

- Vssue API 包： [@vssue/api-coding](https://www.npmjs.com/package/@vssue/api-coding)
- 特点 / 缺点：
  - 
- 开发者参考：  [官方文档](https://coding.net/help/doc/account/oauth.html)
