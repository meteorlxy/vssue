/* eslint-disable @typescript-eslint/no-explicit-any */
import Vssue from '../main';
import GiteaV1 from '@vssue/api-gitea-v1';

if (typeof window !== 'undefined' && (window as any).Vue) {
  (window as any).Vue.use(Vssue, {
    api: GiteaV1,
  });
}
