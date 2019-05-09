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

### Github GraphQL API V4 <Badge text="preview" type="error"/>

- Vssue API package: [@vssue/api-github-v4](https://www.npmjs.com/package/@vssue/api-github-v4)
- Features or drawbacks:
  - [clientSecret](../options/README.md#clientsecret) is required
  - comments sortable
  - comments not editable (corresponding API has not been implemented by Github)
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
- Developer Reference: [Official Docs](https://docs.gitlab.com/ce/api)

## Bitbucket

Guide: [Set up Bitbucket OAuth Cousumer](./bitbucket.md)

### Bitbucket API V2

- Vssue API package: [@vssue/api-bitbucket-v2](https://www.npmjs.com/package/@vssue/api-bitbucket-v2)
- Features or drawbacks:
  - comments sortable
  - comments editable
  - comments deletable
  - can view comments without login
  - cannot post emoji reactions to comments (heart, like, unlike, etc.)
- Developer Reference: [Official Docs](https://developer.atlassian.com/bitbucket/api/2/reference)

## Coding

Guide: []()

#### Coding API

- Vssue API package: [@vssue/api-coding](https://www.npmjs.com/package/@vssue/api-coding)
- Features or drawbacks:
  - 
- Developer Reference: [Official Docs](https://coding.net/help/doc/account/oauth.html)
