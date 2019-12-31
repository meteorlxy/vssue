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
    ['link', { rel: 'icon', href: `/favicon.ico` }],
    // <link rel="manifest" href="/manifest.json">
    ['link', { rel: 'manifest', href: `/manifest.json` }],
    // <meta name="theme-color" content="#34c88a">
    ['meta', { name: 'theme-color', content: '#34c88a' }],
    // <link rel="icon" type="image/png" sizes="32x32" href="/assets/icons/favicon-32x32.png">
    ['link', { rel: 'icon', type: 'image/png', sizes: '32x32', href: `/assets/icons/favicon-32x32.png` }],
    // <link rel="icon" type="image/png" sizes="16x16" href="/assets/icons/favicon-16x16.png">
    ['link', { rel: 'icon', type: 'image/png', sizes: '16x16', href: `/assets/icons/favicon-16x16.png` }],
    // <link rel="apple-touch-icon" sizes="180x180" href="/assets/icons/apple-touch-icon.png">
    ['link', { rel: 'apple-touch-icon', sizes: '180x180', href: `/assets/icons/apple-touch-icon.png` }],
    // <meta name="application-name" content="Vssue">
    ['meta', { name: 'application-name', content: 'Vssue' }],
    // <meta name="apple-mobile-web-app-title" content="Vssue">
    ['meta', { name: 'apple-mobile-web-app-title', content: 'Vssue' }],
    ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
    ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black' }],
    // <meta name="msapplication-TileColor" content="#34c88a">
    ['meta', { name: 'msapplication-TileColor', content: '#34c88a' }],
    ['meta', { name: 'msapplication-TileImage', content: '/assets/icons/mstile-150x150.png' }],
    // <link rel="mask-icon" href="/assets/icons/safari-pinned-tab.svg" color="#34c88a">
    ['link', { rel: 'mask-icon', href: '/assets/icons/safari-pinned-tab.svg', color: '#34c88a' }],
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
            text: 'Guide',
            link: '/guide/',
          },
          {
            text: 'Options',
            link: '/options/',
          },
          {
            text: 'Changelog',
            link: 'https://github.com/meteorlxy/vssue/blob/master/CHANGELOG.md',
          },
        ],
        sidebar: {
          '/demo/': sidebarDemo('Demo'),
          '/guide/': sidebarGuide('Guide', 'Set up OAuth App', 'Static Site Tools'),
        },
      },
      '/zh/': {
        label: '简体中文',
        selectText: '选择语言',
        editLinkText: '在 GitHub 上编辑此页',
        lastUpdated: '上次更新',
        nav: [
          {
            text: '演示',
            link: '/zh/demo/',
          },
          {
            text: '指南',
            link: '/zh/guide/',
          },
          {
            text: '配置',
            link: '/zh/options/',
          },
          {
            text: '更新日志',
            link: 'https://github.com/meteorlxy/vssue/blob/master/CHANGELOG.md',
          },
        ],
        sidebar: {
          '/zh/demo/': sidebarDemo('演示'),
          '/zh/guide/': sidebarGuide('指南', '创建 OAuth App', '静态网站工具'),
        },
      },
    },
  },

  plugins: [
    '@vuepress/plugin-back-to-top',
    ['@vuepress/plugin-pwa', {
      serviceWorker: true,
      updatePopup: true,
    }],
    ['@vuepress/google-analytics', {
      'ga': 'UA-132770851-3',
    }],
    '@vssue/vuepress-plugin-vssue',
    'vuepress-plugin-medium-zoom',
  ],

  chainWebpack: (config, isServer) => {
    if (isServer === false) {
      config.optimization.splitChunks({
        maxInitialRequests: 5,
        cacheGroups: {
          2: {
            test: /[\\/]node_modules[\\/](vue-i18n|vue-class-component|nprogress|@vuepress)[\\/]/,
            name: 'vendor.2',
            chunks: 'all',
          },
          1: {
            test: /[\\/]node_modules[\\/](vue|vue-router)[\\/]/,
            name: 'vendor.1',
            chunks: 'all',
          },
          0: {
            test: /[\\/]node_modules[\\/]/,
            priority: -10,
            name: 'vendor.0',
            chunks: 'all',
          },
        },
      })
    }
  },
}

function sidebarDemo (title) {
  return [
    {
      title,
      collapsable: false,
      children: [
        'bitbucket',
        'gitea',
        'gitee',
        'github',
        'github-v4',
        'gitlab',
      ],
    },
  ]
}

function sidebarGuide (titleGuide, titleOAuthApp, titleSiteTools) {
  return [
    {
      title: titleGuide,
      collapsable: false,
      children: [
        '',
        'getting-started',
        'supported-platforms',
        'styles',
        'developer',
      ],
    },
    {
      title: titleOAuthApp,
      collapsable: false,
      children: [
        'github',
        'gitlab',
        'bitbucket',
        'gitee',
        'gitea',
      ],
    },
    {
      title: titleSiteTools,
      collapsable: false,
      children: [
        'vuepress',
        'nuxt',
        'gridsome',
      ],
    },
  ]
}
