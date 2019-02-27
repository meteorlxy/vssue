# Estilos customizados

O vssue fornece o arquivo de estilo compilado `vssue.css` / `vssue.min.css`, e você pode importá-lo para usar os estilos padrão.

Como alternativa, você pode usar estilos personalizados para o Vssue.

## Usando os estilos do Vssue

O estilo do Vssue está escrito em [Stylus](http://stylus-lang.com/), e os arquivos fonte estão localizados no diretório `vssue/src/styles`. O arquivo de estilo principal é `vssue/src/styles/index.styl`.

Você pode ejetá-lo e modificá-lo para ter estilos totalmente personalizados para o Vssue.

### Markdown Body

Como nossos comentários suportam a sintaxe markdown, precisamos definir o estilo do conteúdo de markdown parseado.

Atualmente, o Vssue usa [github-markdown-css](https://github.com/sindresorhus/github-markdown-css) como preset. Você pode notar que todo o conteúdo dos comentários no Vssue é encapsulado em `class="markdown-body"`.

No entanto, o arquivo css do `github-markdown-css` não está incluído no código stylus do Vssue. Em vez disso, ele é concatenado para o arquivo CSS compilado no momento da criação.

Então, se você quiser usar o código-fonte dos estilos Vssue, lembre-se de importar `github-markdown-css`, ou adicione seu próprio estilo em `.markdown-body`.

## Usando Variáveis ​​para personalizar o Vssue

Existem algumas [variáveis stylus](http://stylus-lang.com/docs/variables.html) pré-definidas do Vssue, e você pode verificá-las em `vssue/src/styles/_variables.styl`:

```stylus
// cor principal
$vssue-theme-color

// cor do texto (usada para texto comum)
$vssue-text-color

// cor da luz do texto (usada para texto silenciado, texto desativado, etc)
$vssue-text-light-color

// cor da borda
$vssue-border-color

// cor de progresso
$vssue-progress-color

// tamanho da fonte
$vssue-font-size

// família de fontes
$vssue-font-family

// mobile breakpoint
$vssue-breakpoint-mobile
```

Por exemplo, o Vssue usa "Vue green" (`#3eaf7c`) como a cor do tema, que é definida como o valor padrão da variável `$vssue-theme-color`. Você pode alterar a cor do tema definindo `$vssue-theme-color` antes de importar `vssue/src/styles/index.styl`.

Aqui está um exemplo de arquivo stylus mostrando como alterar a cor do tema para `red`. Supondo que você esteja usando o `webpack` com o `stylus-loader` para que você possa resolver os módulos via `~`:

```stylus
// define a variável primeiro
$vssue-theme-color = red

// importar o arquivo principal dos estilos Vssue e github-markdown-css
@import '~vssue/src/styles/index'
@import '~github-markdown-css/github-markdown.css'
```

> Veja [Markdown Body](#markdown-body) para entender por que precisamos importar `github-markdown-css`
