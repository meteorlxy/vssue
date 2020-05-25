import { stringify } from 'qs';

export const buildQuery = (params: Record<string, string | number>): string =>
  stringify(params);
