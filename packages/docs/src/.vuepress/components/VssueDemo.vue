<template>
  <Vssue
    :issue-id="1"
    :options="options"
  />
</template>

<script>
import BitbucketV2 from '@vssue/api-bitbucket-v2'
import GithubV3 from '@vssue/api-github-v3'
import GitlabV4 from '@vssue/api-gitlab-v4'

const options = {
  'bitbucket': {
    api: BitbucketV2,
    owner: 'meteorlxy',
    repo: 'vssue',
    clientId: '6tKVqDXYzuvmzCnbGw',
    clientSecret: 'CnDZQZsk5UtYeKYPyCqkP2WEQPQpdWYe',
  },
  'github': {
    api: GithubV3,
    owner: 'meteorlxy',
    repo: 'vssue',
    clientId: 'a1097b7751127c6d1194',
    clientSecret: '5c95e2f890b6a2b80dbda17656e9b1db9e87a07b',
  },
  'gitlab': {
    api: GitlabV4,
    owner: 'meteorlxy',
    repo: 'vssue',
    clientId: '5a80ead2a62ec3fd3a31a78b2bf0e5602bacd0513ab3b772e580b05e15d0d2cb',
    clientSecret: 'ab95c402b8197fcdfbd1ca65cab2cbfda9337ee3983f4d8f7b82dff64e2f606a',
  },
}

export default {
  name: 'VssueDemo',

  props: {
    platform: {
      type: String,
      required: true,
    },
  },

  computed: {
    options () {
      return options[this.platform]
    },
  },
}
</script>
