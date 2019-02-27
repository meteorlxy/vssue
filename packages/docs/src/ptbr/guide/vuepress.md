# Integração com Vuepress

> [Vuepress](https://vuepress.vuejs.org/) é um gerador de sites estáticos feito com Vue

## Vuepress Plugin

Vssue fornece um [Plugin para Vuepress](https://vuepress.vuejs.org/plugin/) - [@vssue/vuepress-plugin-vssue](https://www.npmjs.com/package/@vssue/vuepress-plugin-vssue) - que ajuda a usar Vssue no Vuepress rapidamente.

::: tip Dica
O Vuepress suporta plugins a partir da versão v1.0+.
:::

::: warning ATENÇÃO
O Vuepress 1.x está no estágio alpha e não é estável, então nosso plugin também pode ter problemas potenciais com diferentes versões do Vuepress.
:::

## Uso

### Instalação

Instalar o `@vssue/vuepress-plugin-vssue` via NPM:

```bash
npm install -D @vssue/vuepress-plugin-vssue
```

### Usando o plugin

> Veja a [Documentação oficial do Vuepress](https://vuepress.vuejs.org/plugin/using-a-plugin.html) para saber em detalhes como usar um plugin

```js
// .vuepress/config.js

module.exports = {
  plugins: {
    '@vssue/vuepress-plugin-vssue': {
      // setar `platform` em vez de` api`
      platform: 'github',

      // todas as outras opções do Vssue são permitidas
      owner: 'OWNER_OF_REPO',
      repo: 'NAME_OF_REPO',
      clientId: 'YOUR_CLIENT_ID',
      clientSecret: 'YOUR_CLIENT_SECRET',
    },
  },
}
```

::: tip Dica
A única diferença é que você deve definir `platform` ao invés de `api`.

`@vssue/vuepress-plugin-vssue` resolverá automaticamente a api correspondente de acordo com o valor de `platform`:

- platforma `github` - api package `@vssue/api-github-v3`
- platforma `gitlab` - api package `@vssue/api-gitlab-v4`
- platforma `bitbucket` - api package `@vssue/api-bitbucket-v2`
:::

::: tip Dica
Se você não definir a opção `locale`, o Vssue usará o `$lang` do Vuepress como o idioma da página atual.

> Veja [locale](../options/index.md#locale) do Vssue e [$lang](https://vuepress.vuejs.org/guide/global-computed.html#lang) do Vuepress
:::

### Usando Vssue como Componente

`Vssue` é registrado como um componente do Vue e pode ser usado diretamente no markdown do Vuepress.

```md
<!-- README.md -->

# Vssue Demo

<Vssue title="Vssue Demo" />
```

::: tip Dica
Você pode ir para o repositório [meteorlxy/vssue-demo](https://github.com/meteorlxy/vssue-demo) para obter o código de demonstração.
:::

## Variáveis Style Customizadas

Com o poder da [palette.styl](https://vuepress.vuejs.org/config/#palette-styl) do Vuepress, você pode definir [Variáveis Style no Vssue](./styles.md#usando-variaveis-​​para-personalizar-o-vssue) facilmente.

Por padrão, essas variáveis ​​do Vssue são definidas para variáveis ​​do Vuepress:

```stylus
// @vssue/vuepress-plugin-vssue/styles/index.styl

$vssue-theme-color ?= $accentColor
$vssue-text-color ?= $textColor
$vssue-border-color ?= $borderColor
$vssue-breakpoint-mobile ?= $MQMobile
```

Se você quiser sobrescrevê-los, basta defini-los em seu `palette.styl`:

```stylus
// .vuepress/styles/palette.styl

$vssue-theme-color = red
```

## Não quer usar nosso plugin?

Embora o Vssue tenha tente ser compatível com SSR, pode haver alguns problemas para usá-lo diretamente no Vuepress.

Portanto, sugerimos que você use `@vssue/vuepress-plugin-vssue` no Vuepress, que ajuda a tornar o componente `<Vssue>` 'Client-Only', e evitar esses problemas.

Se você não quiser usar o plug-in fornecido, talvez seja necessário incluir o componente `<Vssue>` no componente `<ClientOnly>` para evitar possíveis problemas, por exemplo:

```vue
<ClientOnly>
  <Vssue />
</ClientOnly>
```

> Veja [Built-in Components - ClientOnly](https://vuepress.vuejs.org/guide/using-vue.html#clientonly) do Vuepress
