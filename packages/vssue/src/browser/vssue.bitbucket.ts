/* eslint-disable @typescript-eslint/no-explicit-any */
import Vssue from '../main';
import BitbucketV2 from '@vssue/api-bitbucket-v2';

if (typeof window !== 'undefined' && (window as any).Vue) {
  (window as any).Vue.use(Vssue, {
    api: BitbucketV2,
  });
}
