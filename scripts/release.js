const fs = require('fs')
const execa = require('execa')
const { resolve } = require('path')

const rootPath = resolve(__dirname, '..')
const execaOpts = {
  cwd: rootPath,
  stdio: 'inherit',
}

const run = async (...commands) => {
  return execa(commands[0], commands.slice(1), execaOpts)
}

const release = async () => {
  try {
    await run('yarn', 'lerna', 'version', '--no-git-tag-version')
    await run('yarn', 'build')

    const version = require(resolve(rootPath, 'lerna.json')).version
    const tag = `v${version}`

    await run('git', 'add', '-A')
    await run('git', 'commit', '-m', `version ${version}`)
    await run('git', 'tag', tag, '-m', `version ${version}`)
    await run('yarn', 'conventional-changelog', '-p', 'angular', '-i', 'CHANGELOG.md', '-s', '-r', '2')

    const inFile = fs.readFileSync('CHANGELOG.md').toString()
    fs.writeFileSync('CHANGELOG.md', inFile.split('\n').slice(4).join('\n'))

    await run('git', 'add', 'CHANGELOG.md')
    await run('git', 'commit', '-m', `chore: version ${version} changelog`)
    await run('yarn', 'lerna', 'publish', 'from-package')
    await run('git', 'push', 'origin', 'master:master', '--tags')
  } catch (err) {
    console.error(err)
  }
}

release()
