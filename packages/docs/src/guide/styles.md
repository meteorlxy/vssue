# Custom Styles

Vssue provides compiled style file `vssue.css` / `vssue.min.css`, and you can import it to use the default styles.

Alternatively, you can use custom styles for Vssue.

## Use Source Code of Vssue Styles

The style of Vssue is written in [Stylus](http://stylus-lang.com/), and the source files are located in `vssue/src/styles` directory. The main style file is `vssue/src/styles/index.styl`.

You can eject and modify it to have fully customized styles for Vssue.

### Markdown Body

As our comments support markdown syntax, we need to set the style of the parsed markdown content.

Currently, Vssue use [github-markdown-css](https://github.com/sindresorhus/github-markdown-css) as the preset. You may notice that all the content of comments in Vssue is wrapped in `class="markdown-body"`.

However, the css file of `github-markdown-css` is not included in Vssue's stylus code. Instead, it is concat to the complied CSS file at build time.

So if you want to use the source code of Vssue styles, remember to import `github-markdown-css`, or add your own style under `.markdown-body`.

## Use Variables to Customize Vssue

There are some pre-defined [stylus variables](http://stylus-lang.com/docs/variables.html) of Vssue, and you can check them in `vssue/src/styles/_variables.styl`:

```stylus
// the main color
$vssue-theme-color

// the text color (used for common text)
$vssue-text-color

// the text light color (used for muted text, disabled text, etc)
$vssue-text-light-color

// the border color
$vssue-border-color

// the progress color
$vssue-progress-color

// the font size
$vssue-font-size

// the font family
$vssue-font-family

// the mobile breakpoint
$vssue-breakpoint-mobile

// the text direction (ltr / rtl) (used for RTL languages, e.g. Hebrew)
$vssue-direction
```

For example, Vssue use a "Vue green" (`#3eaf7c`) as the theme color, which is defined as the default value of variable `$vssue-theme-color`. You can change the theme color by setting `$vssue-theme-color` before import `vssue/src/styles/index.styl`.

Here is a sample stylus file showing that how to change the theme color to `red`. Assume that you are using `webpack` with `stylus-loader` so that you can resolve modules via `~` :

```stylus
// set the variable first
$vssue-theme-color = red

// import the main file of Vssue styles and github-markdown-css
@import '~vssue/src/styles/index'
@import '~github-markdown-css/github-markdown.css'
```

> See [Markdown Body](#markdown-body) for why we need to import `github-markdown-css`
