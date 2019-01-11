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
  }

  export interface Plugin extends PluginObject<Vssue.Options> {
    readonly version: string
    VssueComponent: Vssue.Component
  }

  export type Component = typeof Vue

  export interface GlobalStore extends Vue {
    options: Partial<Vssue.Options>
  }

  export interface LocalStore extends Vue {
    readonly version: string
    options: Vssue.Options
    API: VssueAPI.Instance | null
    accessToken: string | null
    user: VssueAPI.User | null
    issue: VssueAPI.Issue | null
    comments: VssueAPI.Comments | null
    query: VssueAPI.Query
    status: Vssue.Status
    authStatus: Vssue.AuthStatus
    init (): Promise<void>
    initCommentsByIssueTitle(issueTitle: string): Promise<void>
    initCommentsByIssueId(issueId: number | string): Promise<void>
    handleAuth (): Promise<void>
    getComments (): Promise<VssueAPI.Comments | void>
    postComment (options: { content: string }): Promise<VssueAPI.Comment | void>
    deleteComment (options: { commentId: number | string }): Promise<boolean | void>
    // putComment (options: { commentId: number | string, content: string }): Promise<VssueAPI.Comment | void>
    getCommentReactions (options: { commentId: number | string }): Promise<VssueAPI.Reactions | void>
    postCommentReaction (options: { commentId: number | string, reaction: keyof VssueAPI.Reactions }): Promise<boolean | void>
  }

  export type AuthStatus = {
    readonly isLogined: boolean
    readonly isAdmin: boolean
  }

  export type Status = {
    isInitializing: boolean
    isLoginRequired: boolean
    isLoadingComments: boolean
    isFailed: boolean
    isCreatingComment: boolean
  }
}

declare module 'vue/types/vue' {
  export interface Vue {
    $vssue?: Vssue.GlobalStore
  }
}

export default Vssue
