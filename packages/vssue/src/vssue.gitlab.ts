import Vssue from './main'
import GitlabV4 from '@vssue/api-gitlab-v4'

if (typeof window !== 'undefined' && (<any>window).Vue) {
  (<any>window).Vue.use(Vssue, {
    api: GitlabV4,
  })
}
