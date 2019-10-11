import Vssue from '../main'
import GithubV4 from '@vssue/api-github-v4'

if (typeof window !== 'undefined' && (<any>window).Vue) {
  (<any>window).Vue.use(Vssue, {
    api: GithubV4,
  })
}
