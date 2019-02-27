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
    '/pt-BR/': {
      lang: 'pt-BR',
      title: 'Vssue',
      description: 'Plugin de comentários com Vue, baseado em Issues',
    },
  },

  head: [
    ['link', { rel: 'icon', href: `/logo.png` }],
  ],

  markdown: {
    extendMarkdown: md => md.use(require('markdown-it-center-text')),
  },

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
            text: 'Demo',
            link: '/demo/',
          },
          {
            text: 'Vssue Guide',
            link: '/guide/',
          },
          {
            text: 'Options Reference',
            link: '/options/',
          },
          {
            text: 'Changelog',
            link: 'https://github.com/meteorlxy/vssue/blob/master/CHANGELOG.md',
          },
        ],
        sidebar: {
          '/demo/': sidebarDemo('Vssue Demo'),
          '/guide/': sidebarGuide('Vssue Guide', 'Set up OAuth App'),
        },
      },
      '/zh/': {
        label: '简体中文',
        selectText: '选择语言',
        editLinkText: '在 GitHub 上编辑此页',
        lastUpdated: '上次更新',
        nav: [
          {
            text: 'Demo',
            link: '/zh/demo/',
          },
          {
            text: 'Vssue 指南',
            link: '/zh/guide/',
          },
          {
            text: '配置参考',
            link: '/zh/options/',
          },
          {
            text: '更新日志',
            link: 'https://github.com/meteorlxy/vssue/blob/master/CHANGELOG.md',
          },
        ],
        sidebar: {
          '/zh/demo/': sidebarDemo('Vssue Demo'),
          '/zh/guide/': sidebarGuide('Vssue 指南', '创建 OAuth App'),
        },
      },
      '/pt-BR/': {
        label: 'Português Brasil',
        selectText: 'Linguagens',
        editLinkText: 'Editar esta página no GitHub',
        lastUpdated: 'Última Atualização',
        nav: [
          {
            text: 'Demo',
            link: '/pt-BR/demo/',
          },
          {
            text: 'Guia',
            link: '/pt-BR/guide/',
          },
          {
            text: 'Configuração',
            link: '/pt-BR/options/',
          },
          {
            text: 'Log de mudanças',
            link: 'https://github.com/meteorlxy/vssue/blob/master/CHANGELOG.md',
          },
        ],
        sidebar: {
          '/pt-BR/demo/': sidebarDemo('Vssue Demo'),
          '/pt-BR/guide/': sidebarGuide('Vssue Guia', 'Configurar OAuth App'),
        },
      },
    },
  },

  plugins: [
    '@vuepress/plugin-back-to-top',
    '@vuepress/medium-zoom',
    ['@vuepress/plugin-pwa', {
      serviceWorker: true,
      updatePopup: true,
    }],
    '@vssue/vuepress-plugin-vssue',
  ],
}

function sidebarDemo (title) {
  return [
    {
      title,
      collapsable: false,
      children: [
        'bitbucket',
        'github',
        'gitlab',
      ],
    },
  ]
}

function sidebarGuide (titleGuide, titleOAuthApp) {
  return [
    {
      title: titleGuide,
      collapsable: false,
      children: [
        '',
        'getting-started',
        'supported-platforms',
        'styles',
        'vuepress',
      ],
    },
    {
      title: titleOAuthApp,
      collapsable: false,
      children: [
        'github',
        'gitlab',
        'bitbucket',
      ],
    },
  ]
}
