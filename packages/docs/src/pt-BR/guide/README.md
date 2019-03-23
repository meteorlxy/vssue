# Introdução

Vssue é um componente / plugin __Vue__, que pode ativar comentários para suas páginas estáticas.

Como suas páginas são "estáticas", você não tem APIs de banco de dados nem de back-end, mas ainda deseja que os usuários façam login e postem comentários. Com a ajuda da API OAuth das plataformas de hospedagem de código (por exemplo, Github, Gitlab, Bitbucket, Coding, etc.), o Vssue pode ajudar os usuários a fazer login com uma conta dessas plataformas, armazenar os comentários em seu sistema de __Issue__ e exibir os comentários na pagina atual.

É assim que o __Vssue__ recebe o seu nome: Feito com **V**ue, baseado em I**ssue**.

## Como funciona o Vssue

Após as [especificações do OAuth 2](https://tools.ietf.org/html/rfc6749), as plataformas fornecem a API OAuth. Com a ajuda deles, os usuários podem acessar o Vssue com suas contas da plataforma e acessar os comentários.

Aqui está um breve processo sobre como o Vssue funciona:

```
           Vssue                                             Platform
  ┌──────────────────────┐                            ┌────────────────────┐
  │     Click Login      ├───────── redirect ────────>│ Authorization Page │
  └──────────────────────┘                            └──────────┬─────────┘
  ┌──────────────────────┐                                       │
  │                      │<─── redirect with token / code ───────┘
  │ Handle Authorization │                            ┌────────────────────┐
  │                      │<─── (may) request token ──>│                    │
  └──────────────────────┘                            │                    │
  ┌──────────────────────┐                            │                    │
  │     Get Comments     │<─── request with token ───>│    Platform  API   │
  └──────────────────────┘                            │                    │
  ┌──────────────────────┐                            │                    │
  │     Post Comments    │<─── request with token ───>│                    │
  └──────────────────────┘                            └────────────────────┘
          ......
```

Depois que o Vssue for autorizado pelos usuários para a plataforma na página de autorização, a plataforma redirecionará de volta ao Vssue com um `código`.

O Vssue solicitará o `token` dos usuários para a plataforma, usando este `código` e armazenará o `token` no `localstorage`, o que significa que os usuários são autorizados para o Vssue com a conta da plataforma.

Então o Vssue pode obter as informações do usuário e obter os comentários desta página. E os usuários podem postar comentários também.

## Comparação com projetos similares

O __Vssue__ é inspirado no [__Gitment__](https://github.com/imsun/gitment) e no [__Gitalk__](https://github.com/gitalk/gitalk), com algumas diferenças:

- __Vssue__ suporta Github, Gitlab e Bitbucket, e pode ser estendido para outra plataforma facilmente. __Gitment__ e __Gitalk__ suportam apenas o Github.
- __Vssue__ pode postar, editar e excluir comentários. __Gitment__ e __Gitalk__ só podem postar comentários.
- __Vssue__ é baseado em [Vue.js](https://vuejs.org), portanto, pode ser integrado a projetos do Vue e fornece um [Plugin do Vuepress](./vuepress.md). __Gitment__ é baseado em javascript puro e __Gitalk__ é baseado no [Preact](https://github.com/developit/preact).
