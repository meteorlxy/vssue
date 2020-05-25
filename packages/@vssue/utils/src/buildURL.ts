import { stringify } from 'qs';

export const buildURL = (
  cleanURL: string,
  params: Record<string, string | number>
): string => {
  const query = stringify(params, { addQueryPrefix: true });
  return `${cleanURL}${query}`;
};
