import Vue, { PluginObject } from 'vue'
import { VssueAPI } from './api'

export namespace Vssue {
  export type Options = {
    api: VssueAPI.Contructor
    owner: string
    repo: string
    clientId: string
    clientSecret: string
    baseURL?: string
    state: string
    labels: Array<string>
    prefix: string
    admins: Array<string>
    perPage: number
    locale?: string
  }

  export interface Plugin extends PluginObject<Vssue.Options> {
    readonly version: string
    installed: boolean
    VssueComponent: Vssue.Component
  }

  export type Component = typeof Vue

  export interface Store extends Vue {
    readonly version: string
    options: Vssue.Options | null
    API: VssueAPI.Instance | null
    accessToken: string | null
    user: VssueAPI.User | null
    issue: VssueAPI.Issue | null
    comments: VssueAPI.Comments | null
    query: VssueAPI.Query
    status: Vssue.Status
    computedStatus: Vssue.ComputedStatus
    setOptions (options: Partial<Vssue.Options>): void
    init (): Promise<void>
    initCommentsByIssueTitle(issueTitle: string): Promise<void>
    initCommentsByIssueId(issueId: number | string): Promise<void>
    handleAuth (): Promise<void>
    getComments (): Promise<VssueAPI.Comments | void>
    postComment (options: { content: string }): Promise<VssueAPI.Comment | void>
    deleteComment (options: { commentId: number | string }): Promise<boolean | void>
    putComment (options: { commentId: number | string, content: string }): Promise<VssueAPI.Comment | void>
    getCommentReactions (options: { commentId: number | string }): Promise<VssueAPI.Reactions | void>
    postCommentReaction (options: { commentId: number | string, reaction: keyof VssueAPI.Reactions }): Promise<boolean | void>
  }

  export type ComputedStatus = {
    readonly isLogined: boolean
    readonly isAdmin: boolean
    readonly isPending: boolean
  }

  export type Status = {
    isInitializing: boolean
    isLoginRequired: boolean
    isFailed: boolean
    isLoadingComments: boolean
    isCreatingComment: boolean
    isUpdatingComment: boolean
  }
}

export default Vssue
