# Supported Platforms

## GitHub

Guide: [Set up GitHub OAuth App](./github.md)

### Github REST API V3

- Vssue API package: [@vssue/api-github-v3](https://www.npmjs.com/package/@vssue/api-github-v3)
- Features or drawbacks:
  - [clientSecret](../options/README.md#clientsecret) is required
  - comments not sortable
  - comments editable
  - comments deletable
  - can view comments without login, but has API rate limitation
- Developer Reference: [Official Docs](https://developer.github.com/v3)

### Github GraphQL API V4

- Vssue API package: [@vssue/api-github-v4](https://www.npmjs.com/package/@vssue/api-github-v4)
- Features or drawbacks:
  - [clientSecret](../options/README.md#clientsecret) is required
  - comments sortable
  - comments editable
  - comments deletable
  - requires login to view comments
- Developer Reference: [Official Docs](https://developer.github.com/v4)

## GitLab

Guide: [Set up GitLab Application](./gitlab.md)

### Gitlab API V4 (Gitlab v11.0+)

- Vssue API package: [@vssue/api-gitlab-v4](https://www.npmjs.com/package/@vssue/api-gitlab-v4)
- Features or drawbacks:
  - comments sortable
  - comments editable
  - comments deletable
  - requires login to view comments
  - need to add redirect_uri one by one - [Ref](https://gitlab.com/gitlab-org/gitlab/issues/23054)
- Developer Reference: [Official Docs](https://docs.gitlab.com/ce/api)

## Bitbucket

Guide: [Set up Bitbucket OAuth Consumer](./bitbucket.md)

### Bitbucket API V2

- Vssue API package: [@vssue/api-bitbucket-v2](https://www.npmjs.com/package/@vssue/api-bitbucket-v2)
- Features or drawbacks:
  - comments sortable
  - comments editable
  - comments deletable
  - can view comments without login
  - cannot post emoji reactions to comments (heart, like, unlike, etc.)
- Developer Reference: [Official Docs](https://developer.atlassian.com/bitbucket/api/2/reference)

## Gitee

Guide: [Set up Gitee Third Party Application](./gitee.md)

### Gitee API V5

- Vssue API package: [@vssue/api-gitee-v5](https://www.npmjs.com/package/@vssue/api-gitee-v5)
- Features or drawbacks:
  - [clientSecret](../options/README.md#clientsecret) is required
  - comments not sortable
  - comments editable
  - comments deletable
  - can view comments without login
  - cannot post emoji reactions to comments (heart, like, unlike, etc.)
  - only support a single fixed redirect_uri - [Ref](https://gitee.com/oschina/git-osc/issues/IV0FL)
- Developer Reference: [Official Docs](https://gitee.com/api/v5/swagger)

## Gitea

Guide: [Set up Gitea Application](./gitea.md)

### Gitea API V1

- Vssue API package: [@vssue/api-gitea-v1](https://www.npmjs.com/package/@vssue/api-gitea-v1)
- Features or drawbacks:
  - [clientSecret](../options/README.md#clientsecret) is required
  - comments not sortable, and no pagination support - [Ref](https://github.com/go-gitea/gitea/issues/6132)
  - comments editable
  - comments deletable
  - can view comments without login
  - only support unicode emoji - [Ref](https://github.com/go-gitea/gitea/issues/6628)
  - only support a single fixed redirect_uri - [Ref](https://github.com/go-gitea/gitea/issues/9514)
- Developer Reference:
  - [Official Docs](https://docs.gitea.io/en-us)
  - [Official API Reference](https://gitea.com/api/swagger)
