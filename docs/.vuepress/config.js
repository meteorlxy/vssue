const pkg = require('../../package.json')
const path = require('path')

module.exports = {
  dest: 'docs-dist',
  locales: {
    '/': {
      lang: 'en-US',
      title: 'Vssue',
      description: 'A Vue-powered Issue-based Comment Plugin'
    },
    '/zh/': {
      lang: 'zh-CN',
      title: 'Vssue',
      description: 'Vue 驱动的、基于 Issue 的评论插件'
    }
  },
  head: [
    ['link', { rel: 'icon', href: `/logo.png` }]
  ],
  serviceWorker: true,
  themeConfig: {
    repo: 'meteorlxy/vssue',
    editLinks: true,
    docsDir: 'docs',
    locales: {
      '/': {
        label: 'English',
        selectText: 'Languages',
        editLinkText: 'Edit this page on GitHub',
        lastUpdated: 'Last Updated',
        nav: [
          {
            text: 'Guide',
            link: '/guide/',
          }
        ]
      },
      '/zh/': {
        label: '简体中文',
        selectText: '选择语言',
        editLinkText: '在 GitHub 上编辑此页',
        lastUpdated: '上次更新',
        nav: [
          {
            text: '指南',
            link: '/zh/guide/',
          }
        ]
      }
    }
  },
  chainWebpack: (config) => {
    config.resolve.alias.set('vssue', path.resolve(__dirname, '../../src/entry.component.js'))
    config
      .plugin('version')
      .use(require('webpack/lib/DefinePlugin'), [{
        __VERSION__: JSON.stringify(pkg.version)
      }])
  }
}
