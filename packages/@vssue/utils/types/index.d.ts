import queryString from 'query-string';
export declare const buildURL: (cleanURL: string, params: Object) => string;
export declare const concatURL: (baseURL: string, path: string) => string;
export declare const getCleanURL: (fullURL?: string) => string;
export declare const parseQuery: (URL: string) => queryString.OutputParams;
export declare const buildQuery: (params: Object) => string;
export declare const formatDateTime: (str: string) => string;
export declare const noop: () => void;
