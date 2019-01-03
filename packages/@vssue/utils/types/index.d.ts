export declare const buildURL: (cleanURL: string, params: Object) => string;
export declare const concatURL: (baseURL: string, path: string) => string;
export declare const getCleanURL: (fullURL: string) => string;
export declare const parseQuery: (URL: string) => any;
export declare const buildQuery: (params: Object) => string;
export declare const formatDateTime: (str: string) => string;
export declare const noop: () => void;
declare const _default: {
    buildURL: (cleanURL: string, params: Object) => string;
    concatURL: (baseURL: string, path: string) => string;
    getCleanURL: (fullURL: string) => string;
    parseQuery: (URL: string) => any;
    buildQuery: (params: Object) => string;
    formatDateTime: (str: string) => string;
    noop: () => void;
};
export default _default;
