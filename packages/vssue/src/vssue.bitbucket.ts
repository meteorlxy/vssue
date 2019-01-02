import Vssue from './main'
import BitbucketV2 from '@vssue/api-bitbucket-v2'

if (typeof window !== 'undefined' && (<any>window).Vue) {
  (<any>window).Vue.use(Vssue, {
    api: BitbucketV2,
  })
}
