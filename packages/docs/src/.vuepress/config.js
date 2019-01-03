module.exports = {
  locales: {
    '/': {
      lang: 'en-US',
      title: 'Vssue',
      description: 'A Vue-powered Issue-based Comment Plugin',
    },
    '/zh/': {
      lang: 'zh-CN',
      title: 'Vssue',
      description: 'Vue 驱动的、基于 Issue 的评论插件',
    },
  },

  head: [
    ['link', { rel: 'icon', href: `/logo.png` }],
  ],

  themeConfig: {
    repo: 'meteorlxy/vssue',

    editLinks: true,

    docsDir: 'packages/docs/src',

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
          },
        ],
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
          },
        ],
      },
    },
  },

  plugins: {
    '@vuepress/plugin-back-to-top': true,
    '@vuepress/plugin-pwa': {
      serviceWorker: true,
      updatePopup: true,
    },
    '@vssue/vuepress-plugin-vssue': {
      platform: 'github',
      owner: 'meteorlxy',
      repo: 'vssue',
      clientId: 'a1097b7751127c6d1194',
      clientSecret: '5c95e2f890b6a2b80dbda17656e9b1db9e87a07b',
    },
  },
}
