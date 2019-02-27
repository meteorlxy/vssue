# Plataformas Suportadas

## GitHub

Guia: [Configuração do GitHub OAuth App](./github.md)

### Github REST API V3

- Vssue API package: [@vssue/api-github-v3](https://www.npmjs.com/package/@vssue/api-github-v3)
- Recursos ou desvantagens:
   - comentários não ordenáveis
   - comentários editáveis
   - comentários deletáveis
   - pode visualizar comentários sem login, mas tem limitação de taxa de API
- Referência do desenvolvedor: [Documentação oficial](https://developer.github.com/v3)

### Github GraphQL API V4 <Badge text="preview" type="error"/>

- Vssue API package: [@vssue/api-github-v4](https://www.npmjs.com/package/@vssue/api-github-v4)
- Recursos ou desvantagens:
  - comentários ordenáveis
  - comentários não editáveis (API correspondente não foi implementada pelo Github)
  - comentários deletáveis
  - requer login para visualizar comentários
- Referência do desenvolvedor: [Documentação oficial](https://developer.github.com/v4)

## GitLab

Guia: [Configuração do GitLab Application](./gitlab.md)

### Gitlab API V4 (Gitlab v11.0+)

- Vssue API package: [@vssue/api-gitlab-v4](https://www.npmjs.com/package/@vssue/api-gitlab-v4)
- Recursos ou desvantagens:
  - comentários ordenáveis
  - comentários editáveis
  - comentários deletáveis
  - requer login para visualizar comentários
- Referência do desenvolvedor: [Documentação oficial](https://docs.gitlab.com/ce/api)

## Bitbucket

Guia: [Configuração do Bitbucket OAuth Consumer](./bitbucket.md)

### Bitbucket API V2

- Vssue API package: [@vssue/api-bitbucket-v2](https://www.npmjs.com/package/@vssue/api-bitbucket-v2)
- Recursos ou desvantagens:
  - comentários ordenáveis
  - comentários editáveis
  - comentários deletáveis
  - pode visualizar comentários sem login
  - depois do login, o token de acesso expira em uma hora
  - não é possível postar reações e emojis nos comentários (heart, like, unlike, etc.)
- Referência do desenvolvedor: [Documentação oficial](https://developer.atlassian.com/bitbucket/api/2/reference)
