# GitLab Aplicação

> Veja a [Documentação oficial do Gitlab](https://docs.gitlab.com/ce/integration/oauth_provider.html#adding-an-application-through-the-profile) para referência.

> Vssue também pode trabalhar com GitLab self-hosted (on-premisse). Configure a opção `baseURL` para sua URL Gitlab. Veja [Configuração - baseURL](../options/index.md#baseurl)

## Criando uma nova Aplicação

- Vá para [Settings - Applications](https://gitlab.com/profile/applications)

->![Set up OAuth App - Gitlab 01](/assets/img/oauth-app-gitlab-01.png)<-
->![Set up OAuth App - Gitlab 02](/assets/img/oauth-app-gitlab-02.png)<-

- Defina `Redirect URI` com a URL do seu website (Aqui temos `localhost:8080` por exemplo)
- Selecione o escopo `api`

->![Set up OAuth App - Gitlab 03](/assets/img/oauth-app-gitlab-03.png)<-

## Obtendo o Client ID e o Secret

Então você criou uma nova Aplicação, e aqui estão o __Application ID__ (`Client ID`) e o __Secret__ (`Client Secret`).

->![Set up OAuth App - Gitlab 04](/assets/img/oauth-app-gitlab-04.png)<-

## Configure e inicie seu Vssue

Copie o `Client ID` e o `Client Secret`, e defina `owner` e `repo`.

> O padrão de URL do GitLab é `https://bitbucket.org/${owner}/${repo}`

Por exemplo, para o repositório `https://gitlab.com/meteorlxy/vssue-demo`, e `title` da issue definido como `Vssue Demo`.

->![Set up OAuth App - Gitlab 05](/assets/img/oauth-app-gitlab-05.png)<-

## Experimente o Vssue localmente

Execute `anywhere -h localhost 8080` para servir o `index.html` em `localhost:8080`.

Vssue está pronto aqui. Clique em `Login` para informar a conta do Gitlab.

->![Set up OAuth App - Gitlab 06](/assets/img/oauth-app-gitlab-06.png)<-

Irá redirecionar para a página de autorização do GitLab. Clique em `Authorize`.

->![Set up OAuth App - Gitlab 07](/assets/img/oauth-app-gitlab-07.png)<-

Deixe um comentário nesta página ~

->![Set up OAuth App - Gitlab 08](/assets/img/oauth-app-gitlab-08.png)<-
->![Set up OAuth App - Gitlab 09](/assets/img/oauth-app-gitlab-09.png)<-

::: tip Dica
Você pode ir até o repositório [meteorlxy/vssue-demo](https://gitlab.com/meteorlxy/vssue-demo) para obter o código desta demo. Consulte a [issue #1](https://gitlab.com/meteorlxy/vssue-demo/issues/1) deste repo, para ver o que aconteceu.
:::
