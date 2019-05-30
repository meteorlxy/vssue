import browserApiFile from './saber-browser'

const name = 'vssue'

const apply = (api, {
  platform = 'github',
  ...options
} = {}) => {
  const platformAPI = {
    'github': '@vssue/api-github-v3',
    'gitlab': '@vssue/api-gitlab-v4',
    'bitbucket': '@vssue/api-bitbucket-v2',
    'gitee': '@vssue/api-gitee-v5',
  }

  const apiPkg = platformAPI[platform]

  if (!apiPkg) {
    throw new Error(`[@vssue/saber-plugin-vssue] Platform '${platform}' is not supported. Available platforms: github, gitlab, bitbucket, gitee.`)
  }

  try {
    require.resolve(apiPkg)
  } catch (e) {
    throw new Error(`[@vssue/saber-plugin-vssue] ${apiPkg} is not installed. Run 'npm install ${apiPkg}' or 'yarn add ${apiPkg}' to install it.`)
  }

  api.hooks.chainWebpack.tap(name, config => {
    config.resolve.alias.set('@vssue/api$', require.resolve(apiPkg))

    config.plugin('constants').tap(([constants]) => [{
      ...constants,
      'VSSUE_OPTIONS': JSON.stringify(options),
    }])
  })

  // register saber-browser.ts
  api.browserApi.add(browserApiFile)
}

export default {
  name,
  apply,
}
