# 自定义样式

Vssue 提供了编译好的 CSS 样式文件 `vssue.css` / `vssue.min.css`，你可以直接引入它们来使用默认样式。

或者，你可以自定义你的 Vssue 样式。

## 使用 Vssue 样式源文件

Vssue 的样式是通过 [Stylus](http://stylus-lang.com/) 编写的，源文件在 `vssue/src/styles` 目录。样式主文件是 `vssue/src/styles/index.styl`。

你可以提取并修改它们，来自定义你的 Vssue 样式。

### Markdown Body

我们的评论功能支持 Markdown 语法，所以我们需要给解析后的 Markdown 内容设置样式。

目前，Vssue 使用 [github-markdown-css](https://github.com/sindresorhus/github-markdown-css) 作为 Markdown 样式。你可能注意到了所有的评论内容都被 `class="markdown-body"` 包裹着。

不过，`github-markdown-css` 的 CSS 文件没有在 Vssue 的 stylus 代码中引入，而是在构建时拼接到编译好的 CSS 文件后面。

因此，在你使用 Vssue 样式源文件的时候，记得引入 `github-markdown-css`，或者在 `.markdown-body` 下添加你的自定义样式。

## 使用样式变量来自定义 Vssue

Vssue 样式中预定义了一些 [Stylus 变量](http://stylus-lang.com/docs/variables.html)，你可以在 `vssue/src/styles/_variables.styl` 中查看它们：

```stylus
// 主题颜色
$vssue-theme-color

// 文字颜色 （用于普通文字）
$vssue-text-color

// 浅色文字颜色 （用于备注等文字）
$vssue-text-light-color

// 边框颜色
$vssue-border-color

// 进度条颜色
$vssue-progress-color

// 文字大小
$vssue-font-size

// 字体
$vssue-font-family

// 切换为移动端模式的屏幕宽度
$vssue-breakpoint-mobile

// 文字方向 (ltr / rtl) （为 RTL 语言使用，如希伯来语等）
$vssue-direction
```

举例来说，Vssue 默认使用一个“Vue 绿色”（`#3eaf7c`）作为主题颜色，并将其设置为 `$vssue-theme-color` 的默认值。你可以在引入 `vssue/src/styles/index.styl` 之前设置 `$vssue-theme-color` 的值来改变主题颜色。

下面是一个示例 Stylus 文件，展示了如何把主题颜色改成 `red`。假设你在使用 `webpack` 和 `stylus-loader`，可以通过 `~` 来解析模块：

```stylus
// 先设置变量
$vssue-theme-color = red

// 引入 Vssue 的样式主文件和 github-markdown-css
@import '~vssue/src/styles/index'
@import '~github-markdown-css/github-markdown.css'
```

> 查看 [Markdown Body](#markdown-body) 了解为何需要引入 `github-markdown-css`
