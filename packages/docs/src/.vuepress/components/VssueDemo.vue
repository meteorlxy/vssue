<template>
  <div>
    <div class="content select-platform">
      <span>
        {{ text }}
      </span>

      <select v-model="platform">
        <option value="github">
          Github
        </option>
        <option value="gitlab">
          Gitlab
        </option>
        <option value="bitbucket">
          Bitbucket
        </option>
      </select>
    </div>

    <Vssue
      v-show="platform === 'github'"
      title="Vssue"
      :options="optionsGithub"
    />

    <Vssue
      v-show="platform === 'gitlab'"
      title="Vssue"
      :options="optionsGitlab"
    />

    <Vssue
      v-show="platform === 'bitbucket'"
      title="Vssue"
      :options="optionsBitbucket"
    />
  </div>
</template>

<script>
import GithubV3 from '@vssue/api-github-v3'
import GitlabV4 from '@vssue/api-gitlab-v4'
import BitbucketV2 from '@vssue/api-bitbucket-v2'

export default {
  name: 'VssueDemo',

  props: {
    text: {
      type: String,
      required: true,
    },
  },

  data () {
    return {
      // platform to show
      platform: 'github',

      // options for github
      optionsGithub: {
        api: GithubV3,
        owner: 'meteorlxy',
        repo: 'vssue',
        clientId: 'a1097b7751127c6d1194',
        clientSecret: '5c95e2f890b6a2b80dbda17656e9b1db9e87a07b',
      },

      // options for gitlab
      optionsGitlab: {
        api: GitlabV4,
        owner: 'meteorlxy',
        repo: 'vssue',
        clientId: '5a80ead2a62ec3fd3a31a78b2bf0e5602bacd0513ab3b772e580b05e15d0d2cb',
        clientSecret: 'ab95c402b8197fcdfbd1ca65cab2cbfda9337ee3983f4d8f7b82dff64e2f606a',
      },

      // options for bitbucket
      optionsBitbucket: {
        api: BitbucketV2,
        owner: 'meteorlxy',
        repo: 'vssue',
        clientId: '6tKVqDXYzuvmzCnbGw',
        clientSecret: 'CnDZQZsk5UtYeKYPyCqkP2WEQPQpdWYe',
      },
    }
  },
}
</script>

<style lang="stylus" scoped>
.select-platform
  text-align center
</style>
