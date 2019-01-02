import { User, Issue, Comment, VssueAPI, VssueAPIOptions } from 'vssue';
import { AxiosInstance } from 'axios';
/**
 * Github API v3
 *
 * @see https://developer.github.com/apps/building-oauth-apps/authorizing-oauth-apps/
 * @see https://developer.github.com/v3/issues/
 * @see https://developer.github.com/v3/issues/comments/
 * @see https://developer.github.com/v3/reactions/
 */
export default class GithubV3 implements VssueAPI {
    baseURL: string;
    owner: string;
    repo: string;
    labels: string;
    clientId: string;
    clientSecret: string;
    state: string;
    $http: AxiosInstance;
    readonly platform: string;
    constructor({ baseURL, owner, repo, labels, clientId, clientSecret, state, }: VssueAPIOptions);
    redirectAuthorize(): void;
    handleAuthorize(): Promise<any>;
    getAccessToken({ code }: {
        code: any;
    }): Promise<any>;
    getUser({ accessToken }: {
        accessToken: any;
    }): Promise<User>;
    getIssues({ accessToken }: {
        accessToken: any;
    }): Promise<any>;
    getComments({ issueId, accessToken }: {
        issueId: any;
        accessToken: any;
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
    createIssueReaction({ issueId, reaction, accessToken, }: {
        issueId: any;
        reaction: any;
        accessToken: any;
    }): Promise<boolean>;
    createCommentReaction({ commentId, reaction, accessToken, }: {
        commentId: any;
        reaction: any;
        accessToken: any;
    }): Promise<boolean>;
}
