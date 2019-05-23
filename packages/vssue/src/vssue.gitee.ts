import Vssue from './main'
import GiteeV5 from '@vssue/api-gitee-v5'

if (typeof window !== 'undefined' && (<any>window).Vue) {
  (<any>window).Vue.use(Vssue, {
    api: GiteeV5,
  })
}
