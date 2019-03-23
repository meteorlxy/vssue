export namespace VssueAPI {
  export type Options = {
    owner: string
    repo: string
    clientId: string
    clientSecret?: string
    baseURL?: string
    state: string
    labels: Array<string>
    proxy?: string | ((url: string) => string)
  }

  export type Platform = {
    name: string
    link: string
    version: string
    meta: {
      reactable: boolean
      sortable: boolean
    }
  }

  export type AccessToken = string | null

  export type User = {
    username: string
    avatar?: string
    homepage?: string
  }

  export type Issue = {
    id: string
    title: string
    content: string
    link: string
  }

  export type Comment = {
    id: string
    content: string
    contentRaw: string
    author: VssueAPI.User
    createdAt: string
    updatedAt: string
    reactions?: VssueAPI.Reactions | null
  }

  export type Comments = {
    count: number
    page: number
    perPage: number
    data: Array<VssueAPI.Comment>
  }

  export type Reactions = {
    like?: number
    unlike?: number
    heart?: number
  }

  export type Query = {
    page: number
    perPage: number
    sort: string
  }

  export interface Instance {
    /**
     * The platform api info
     */
    readonly platform: VssueAPI.Platform

    /**
     * Redirect to the authorization page of platform.
     */
    redirectAuth (): void

    /**
     * Handle authorization.
     *
     * @remarks
     * If the `code` and `state` exist in the query, and the `state` matches, remove them from query, and try to get the access token.
     *
     * @return A string for access token, `null` for no authorization code
     */
    handleAuth (): Promise<VssueAPI.AccessToken>

    /**
     * Get the logined user with access token.
     *
     * @param options.accessToken - User access token
     *
     * @return The user
     */
    getUser (options: {
      accessToken: VssueAPI.AccessToken
    }): Promise<VssueAPI.User>

    /**
     * Get issue according to id or title
     *
     * @param options.accessToken - User access token
     * @param options.issueId - The id of issue
     * @param options.issueTitle - The title of issue
     *
     * @return The comments
     */
    getIssue (options: {
      accessToken: VssueAPI.AccessToken
      issueId?: string | number
      issueTitle?: string
    }): Promise<VssueAPI.Issue | null>

    /**
     * Create a new issue
     *
     * @param options.accessToken - User access token
     * @param options.title - The title of issue
     * @param options.content - The content of issue
     *
     * @return The created issue
     */
    postIssue (options: {
      accessToken: VssueAPI.AccessToken
      title: string
      content: string
    }): Promise<VssueAPI.Issue>

    /**
     * Get comments of issue according to the issue id
     *
     * @param options.accessToken - User access token
     * @param options.issueId - The id of issue
     * @param options.query - The query parameters
     *
     * @return The comments
     */
    getComments (options: {
      accessToken: VssueAPI.AccessToken
      issueId: string | number
      query?: Partial<VssueAPI.Query>
    }): Promise<VssueAPI.Comments>

    /**
     * Create a new comment
     *
     * @param options.accessToken - User access token
     * @param options.issueId - The id of issue
     * @param options.content - The content of comment
     *
     * @return The created comment
     */
    postComment (options: {
      accessToken: VssueAPI.AccessToken
      issueId: string | number
      content: string
    }): Promise<VssueAPI.Comment>

    /**
     * Edit a comment
     *
     * @param options.accessToken - User access token
     * @param options.issueId - The id of issue
     * @param options.commentId - The id of comment
     * @param options.content - The content of comment
     *
     * @return The edited comment
     */
    putComment (options: {
      accessToken: VssueAPI.AccessToken
      issueId: string | number
      commentId: string | number
      content: string
    }): Promise<VssueAPI.Comment>

    /**
     * Delete a comment
     *
     * @param options.accessToken - User access token
     * @param options.issueId - The id of issue
     * @param options.commentId - The id of comment
     *
     * @return `true` if succeed, `false` if failed
     */
    deleteComment (options: {
      accessToken: VssueAPI.AccessToken
      issueId: string | number
      commentId: string | number
    }): Promise<boolean>

    /**
     * Get reaction of a comment
     *
     * @param options.accessToken - User access token
     * @param options.issueId - The id of issue
     * @param options.commentId - The id of comment
     *
     * @return `true` if succeed, `false` if failed
     */
    getCommentReactions (options: {
      accessToken: VssueAPI.AccessToken
      issueId: string | number
      commentId: string | number
    }): Promise<VssueAPI.Reactions>

    /**
     * Create a new reaction of a comment
     *
     * @param options.accessToken - User access token
     * @param options.issueId - The id of issue
     * @param options.commentId - The id of comment
     * @param options.reaction - The reaction
     *
     * @return `true` if succeed, `false` if failed
     */
    postCommentReaction (options: {
      accessToken: VssueAPI.AccessToken
      issueId: string | number
      commentId: string | number
      reaction: keyof VssueAPI.Reactions
    }): Promise<boolean>
  }

  export interface Constructor {
    new (options: VssueAPI.Options): VssueAPI.Instance
  }
}

export default VssueAPI
