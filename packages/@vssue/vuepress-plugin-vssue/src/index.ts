const path = require('path')

module.exports = ({
  platform = 'github',
  clientId,
  clientSecret,
  owner,
  repo,
}) => {
  const platformAPI = {
    'github': '@vssue/api-github-v3',
    'gitlab': '@vssue/api-gitlab-v4',
    'bitbucket': '@vssue/api-bitbucket-v2',
  }

  const apiPkg = platformAPI[platform]

  if (!apiPkg) {
    throw new Error(`[@vssue/vuepress-plugin-vssue] Platform '${platform}' is not supported. Available platforms: github, gitlab, bitbucket.`)
  }

  try {
    require.resolve(apiPkg)
  } catch (e) {
    throw new Error(`[@vssue/vuepress-plugin-vssue] ${apiPkg} is not installed. Run 'npm install ${apiPkg}' or 'yarn add ${apiPkg}' to install it.`)
  }

  return {
    name: 'vssue',

    enhanceAppFiles: [
      path.resolve(__dirname, 'enhanceApp.js'),
    ],

    define: {
      'VSSUE_CLIENT_ID': clientId,
      'VSSUE_CLIENT_SECRET': clientSecret,
      'VSSUE_OWNER': owner,
      'VSSUE_REPO': repo,
    },

    alias: {
      'vssue$': 'vssue/dist/vssue.esm.js',
      '@vssue/api$': require.resolve(apiPkg),
    },
  }
}
