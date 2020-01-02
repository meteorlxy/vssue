/* eslint-disable @typescript-eslint/no-explicit-any */
import Vssue from '../main';
import GitlabV4 from '@vssue/api-gitlab-v4';

if (typeof window !== 'undefined' && (window as any).Vue) {
  (window as any).Vue.use(Vssue, {
    api: GitlabV4,
  });
}
