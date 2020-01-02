/* eslint-disable @typescript-eslint/no-explicit-any */
import Vssue from '../main';
import GithubV4 from '@vssue/api-github-v4';

if (typeof window !== 'undefined' && (window as any).Vue) {
  (window as any).Vue.use(Vssue, {
    api: GithubV4,
  });
}
