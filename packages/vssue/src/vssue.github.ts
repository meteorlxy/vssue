import Vssue from './main'
import GithubV3 from '@vssue/api-github-v3'

if (typeof window !== 'undefined' && (<any>window).Vue) {
  (<any>window).Vue.use(Vssue, {
    api: GithubV3,
  })
}
