import format from 'date-fns/format';
import { parse, stringify } from 'qs';

export const buildURL = (
  cleanURL: string,
  params: Record<string, string | number>
): string => {
  const query = stringify(params, { addQueryPrefix: true });
  return `${cleanURL}${query}`;
};

export const concatURL = (baseURL: string, path: string): string => {
  const firstPart = baseURL.replace(/\/$/, '');
  const secondPart = path.replace(/^\//, '');
  return `${firstPart}/${secondPart}`;
};

export const getCleanURL = (fullURL: string): string => {
  const noHash = fullURL.split('#')[0] || '';
  const cleanURL = noHash.split('?')[0] || '';
  return cleanURL;
};

export const parseQuery = (URL: string): Record<string, string> =>
  parse(URL, { ignoreQueryPrefix: true });

export const buildQuery = (params: Record<string, string | number>): string =>
  stringify(params);

export const formatDateTime = (str: string): string => {
  const dateTime = format(str, 'YYYY-MM-DD HH:mm:ss');
  return dateTime;
};

// eslint-disable-next-line @typescript-eslint/no-empty-function
export const noop = (): void => {};

export default {
  buildURL,
  concatURL,
  getCleanURL,
  parseQuery,
  buildQuery,
  formatDateTime,
  noop,
};
