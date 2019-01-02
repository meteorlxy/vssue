import { User, Issue, Comment, VssueAPI, VssueAPIOptions } from 'vssue';
import { AxiosInstance } from 'axios';
/**
 * @see https://confluence.atlassian.com/bitbucket/oauth-on-bitbucket-cloud-238027431.html
 * @see https://developer.atlassian.com/bitbucket/api/2/reference/meta/authentication
 * @see https://developer.atlassian.com/bitbucket/api/2/reference/resource/repositories/%7Busername%7D/%7Brepo_slug%7D/issues
 * @see https://developer.atlassian.com/bitbucket/api/2/reference/resource/repositories/%7Busername%7D/%7Brepo_slug%7D/issues/%7Bissue_id%7D/comments
 * @see https://developer.atlassian.com/bitbucket/api/2/reference/resource/repositories/%7Busername%7D/%7Brepo_slug%7D/issues/%7Bissue_id%7D/comments
 */
export default class BitbucketV2 implements VssueAPI {
    baseURL: string;
    owner: string;
    repo: string;
    clientId: string;
    clientSecret: string;
    state: string;
    $http: AxiosInstance;
    readonly platform: string;
    constructor({ baseURL, owner, repo, clientId, clientSecret, state, }: VssueAPIOptions);
    redirectAuthorize(): void;
    handleAuthorize(): Promise<any>;
    getAccessToken({ code }: {
        code: any;
    }): Promise<any>;
    getUser({ accessToken }: {
        accessToken: any;
    }): Promise<User>;
    getIssues(): Promise<any>;
    getComments({ issueId }: {
        issueId: any;
    }): Promise<any>;
    createIssue({ title, content, accessToken, }: {
        title: any;
        content: any;
        accessToken: any;
    }): Promise<Issue>;
    createIssueComment({ issueId, content, accessToken, }: {
        issueId: any;
        content: any;
        accessToken: any;
    }): Promise<Comment>;
    createIssueReaction(): Promise<void>;
    createCommentReaction(): Promise<void>;
}
