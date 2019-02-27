# GitHub OAuth App

> Vssue também pode trabalhar com self-hosted GitHub Enterprise Server (on-premisse). Configure a opção `baseURL` para sua URL GitHub. Veja [Configuração - baseURL](../options/index.md#baseurl)

## Criando uma nova OAuth App

- Vá para [Settings - Developer Settings - OAuth Apps](https://github.com/settings/developers)
- Clique em [New OAuth App](https://github.com/settings/applications/new)

->![Set up OAuth App - Github 01](/assets/img/oauth-app-github-01.png)<-
->![Set up OAuth App - Github 02](/assets/img/oauth-app-github-02.png)<-
->![Set up OAuth App - Github 03](/assets/img/oauth-app-github-03.png)<-

- Defina `Homepage URL` e `Authorization callback URL` com a URL do seu website (Aqui temos `localhost:8080` por exemplo)

->![Set up OAuth App - Github 04](/assets/img/oauth-app-github-04.png)<-

## Obtendo o Client ID e o Secret

Então você criou uma nova OAuth App, e aqui estão o `Client ID` e o `Client Secret`.

->![Set up OAuth App - Github 05](/assets/img/oauth-app-github-05.png)<-

## Configure e inicie seu Vssue

Copie o `Client ID` e o `Client Secret`, e defina `owner` e `repo`.

> O padrão de URL do GitHub é `https://github.com/${owner}/${repo}`

Por exemplo, para o repositório `https://github.com/meteorlxy/vssue-demo`, e `title` da issue definido como `Vssue Demo`.

->![Set up OAuth App - Github 06](/assets/img/oauth-app-github-06.png)<-

## Experimente o Vssue localmente

Execute `anywhere -h localhost 8080` para servir o `index.html` em `localhost:8080`.

Vssue está pronto aqui. Clique em `Login` para informar a conta do GitHub.

->![Set up OAuth App - Github 07](/assets/img/oauth-app-github-07.png)<-

Irá redirecionar para a página de autorização do GitHub. Clique em `Authorize ${your account}`.

->![Set up OAuth App - Github 08](/assets/img/oauth-app-github-08.png)<-

Deixe um comentário nesta página ~

->![Set up OAuth App - Github 09](/assets/img/oauth-app-github-09.png)<-

->![Set up OAuth App - Github 10](/assets/img/oauth-app-github-10.png)<-

::: tip Dica
Você pode ir até o repositório [meteorlxy/vssue-demo](https://github.com/meteorlxy/vssue-demo) para obter o código desta demo. Consulte a [issue #1](https://github.com/meteorlxy/vssue-demo/issues/1) deste repo, para ver o que aconteceu.
:::
