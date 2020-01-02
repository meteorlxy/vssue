/* eslint-disable @typescript-eslint/no-explicit-any */
import Vssue from '../main';
import GiteeV5 from '@vssue/api-gitee-v5';

if (typeof window !== 'undefined' && (window as any).Vue) {
  (window as any).Vue.use(Vssue, {
    api: GiteeV5,
  });
}
