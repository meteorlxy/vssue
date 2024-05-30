export type VssueApiConstructor = new (
  options: VssueApiOptions,
) => VssueApiInstance;

export interface VssueApiInstance {
  /**
   * The platform api info
   */
  readonly platform: VssueApiPlatform;

  /**
   * Redirect to the authorization page of platform.
   */
  redirectAuth(): void;

  /**
   * Handle authorization.
   *
   * @remarks
   * If the `code` and `state` exist in the query, and the `state` matches, remove them from query, and try to get the access token.
   */
  handleAuth(): Promise<VssueApiAccessToken>;

  /**
   * Get the logged-in user with access token.
   */
  getUser(options: { accessToken: VssueApiAccessToken }): Promise<VssueApiUser>;

  /**
   * Get issue according to id or title
   */
  getIssue(options: {
    accessToken: VssueApiAccessToken;
    issueId?: number | string;
    issueTitle?: string;
  }): Promise<VssueApiIssue | null>;

  /**
   * Create a new issue
   */
  postIssue(options: {
    accessToken: VssueApiAccessToken;
    title: string;
    content: string;
  }): Promise<VssueApiIssue>;

  /**
   * Get reaction of an issue
   */
  getIssueReactions(options: {
    accessToken: VssueApiAccessToken;
    issueId?: number | string;
    issueTitle?: string;
  }): Promise<VssueApiReactions>;

  /**
   * Create a new reaction of an issue
   */
  postIssueReaction(options: {
    accessToken: VssueApiAccessToken;
    issueId?: number | string;
    issueTitle?: string;
    reaction: keyof VssueApiReactions;
  }): Promise<boolean>;

  /**
   * Get comments of issue according to the issue id
   */
  getComments(options: {
    accessToken: VssueApiAccessToken;
    issueId: number | string;
    query?: Partial<VssueApiQuery>;
  }): Promise<VssueApiComments>;

  /**
   * Create a new comment
   */
  postComment(options: {
    accessToken: VssueApiAccessToken;
    issueId: number | string;
    content: string;
  }): Promise<VssueApiComment>;

  /**
   * Edit a comment
   */
  putComment(options: {
    accessToken: VssueApiAccessToken;
    issueId: number | string;
    commentId: number | string;
    content: string;
  }): Promise<VssueApiComment>;

  /**
   * Delete a comment
   */
  deleteComment(options: {
    accessToken: VssueApiAccessToken;
    issueId: number | string;
    commentId: number | string;
  }): Promise<boolean>;

  /**
   * Get reaction of a comment
   */
  getCommentReactions(options: {
    accessToken: VssueApiAccessToken;
    issueId: number | string;
    commentId: number | string;
  }): Promise<VssueApiReactions>;

  /**
   * Create a new reaction of a comment
   */
  postCommentReaction(options: {
    accessToken: VssueApiAccessToken;
    issueId: number | string;
    commentId: number | string;
    reaction: keyof VssueApiReactions;
  }): Promise<boolean>;
}

export interface VssueApiOptions {
  owner: string;
  repo: string;
  clientId: string;
  clientSecret?: string;
  clientRedirect?: boolean;
  baseURL?: string;
  state: string;
  labels: string[];
  proxy?: string | ((url: string) => string);
}

export interface VssueApiPlatform {
  name: string;
  link: string;
  version: string;
  features: {
    reaction: boolean;
    sorting: boolean;
  };
}

export type VssueApiAccessToken = string | null;

export interface VssueApiUser {
  username: string;
  avatar?: string;
  homepage?: string;
}

export interface VssueApiIssue {
  id: number | string;
  title: string;
  content: string;
  link: string;
}

export interface VssueApiComment {
  id: number | string;
  content: string;
  contentRaw: string;
  author: VssueApiUser;
  createdAt: string;
  updatedAt: string;
  reactions?: VssueApiReactions | null;
}

export interface VssueApiComments {
  count: number;
  page: number;
  perPage: number;
  data: VssueApiComment[];
}

export interface VssueApiReactions {
  like?: number;
  unlike?: number;
  heart?: number;
}

export interface VssueApiQuery {
  page: number;
  perPage: number;
  sort: string;
}
