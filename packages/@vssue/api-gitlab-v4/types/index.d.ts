import { User, Issue, Comment, VssueAPI, VssueAPIOptions } from 'vssue';
import { AxiosInstance } from 'axios';
/**
 * @see https://docs.gitlab.com/ce/api/oauth2.html
 * @see https://docs.gitlab.com/ce/api/issues.html
 * @see https://docs.gitlab.com/ce/api/notes.html
 * @see https://docs.gitlab.com/ce/api/award_emoji.html
 */
export default class GitlabV4 implements VssueAPI {
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
    getComments({ issueId, accessToken, }: {
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
    createCommentReaction({ issueId, commentId, reaction, accessToken, }: {
        issueId: any;
        commentId: any;
        reaction: any;
        accessToken: any;
    }): Promise<boolean>;
    getMarkdownContent({ contentRaw }: {
        contentRaw: any;
    }): Promise<any>;
}
