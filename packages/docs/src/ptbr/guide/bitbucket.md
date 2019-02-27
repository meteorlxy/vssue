# BitBucket OAuth Consumer

## Criando um novo OAuth Consumer

- Vá para __Bitbucket settings - OAuth__
- Clique em __Add consumer__

->![Set up OAuth App - Bitbucket 01](/assets/img/oauth-app-bitbucket-01.png)<-
->![Set up OAuth App - Bitbucket 02](/assets/img/oauth-app-bitbucket-02.png)<-
->![Set up OAuth App - Bitbucket 03](/assets/img/oauth-app-bitbucket-03.png)<-

- Configure `Callback URL` para a URL do seu website (Aqui nós colocamos `localhost:8080` por exemplo)
- Desmarque `This is a private consumer`
- Marque as permissões `Account - Read` e `Issues - Write`

->![Set up OAuth App - Bitbucket 04](/assets/img/oauth-app-bitbucket-04.png)<-
->![Set up OAuth App - Bitbucket 05](/assets/img/oauth-app-bitbucket-05.png)<-

## Obtendo o Client ID e Secret

Então você criou um novo OAuth Consumer, e aqui estão o __Key__ (`Client ID`) e __Secret__ (`Client Secret`).

->![Set up OAuth App - Bitbucket 06](/assets/img/oauth-app-bitbucket-06.png)<-

## Configure e inicie seu Vssue

Copie o `Client ID` e o `Client Secret`, e defina `owner` e `repo`.

> O padrão de URL do bitbucket é `https://bitbucket.org/${owner}/${repo}`

Por exemplo, para o repositório `https://bitbucket.org/meteorlxy/vssue-demo`, e `title` da issue definido como `Vssue Demo`.

->![Set up OAuth App - Bitbucket 07](/assets/img/oauth-app-bitbucket-07.png)<-

## Experimente o Vssue localmente

Execute `anywhere -h localhost 8080` para servir o `index.html` em `localhost:8080`.

Vssue está pronto aqui. Clique em `Login` para informar a conta do Bitbucket.

->![Set up OAuth App - Bitbucket 08](/assets/img/oauth-app-bitbucket-08.png)<-

Irá redirecionar para a página de autorização do Bitbucket. Clique em `Grant access`.

->![Set up OAuth App - Bitbucket 09](/assets/img/oauth-app-bitbucket-09.png)<-
->![Set up OAuth App - Bitbucket 10](/assets/img/oauth-app-bitbucket-10.png)<-

Oops, falha ao carregar comentários. Seu repositório deve ter a opção __Issue Tracker__ habilitada para que o Vssue funcione.

->![Set up OAuth App - Bitbucket 11](/assets/img/oauth-app-bitbucket-11.png)<-

Deixe um comentário nesta página ~

->![Set up OAuth App - Bitbucket 12](/assets/img/oauth-app-bitbucket-12.png)<-
->![Set up OAuth App - Bitbucket 13](/assets/img/oauth-app-bitbucket-13.png)<-

::: tip Dica
Você pode ir até o repositório [meteorlxy/vssue-demo](https://bitbucket.org/meteorlxy/vssue-demo) para obter o código desta demo. Consulte a [issue #1](https://bitbucket.org/meteorlxy/vssue-demo/issues/1) deste repo, para ver o que aconteceu.
:::
