import Vssue from '../main'
import GiteaV1 from '@vssue/api-gitea-v1'

if (typeof window !== 'undefined' && (<any>window).Vue) {
  (<any>window).Vue.use(Vssue, {
    api: GiteaV1,
  })
}
