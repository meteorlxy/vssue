import { VssueAPIOptions } from './option'

export type User = {
  username: string
  avatar?: string
  homepage?: string
}

export type Issue = {
  id: string
  title: string
  content: string
}

export type Comment = {
  id: string
  content: string
  contentRaw: string
  author: User
  createdAt: string
  updatedAt: string
  reactions?: Reactions | null
}

export type Reactions = {
  like?: number
  unlike?: number
  heart?: number
}

export interface VssueAPI {
  readonly platform: {
    name: string
    link: string
    version: string
  }

  redirectAuthorize (): void

  handleAuthorize (): Promise<string | null>

  getAccessToken (options: {
    code: string
  }): Promise<string>

  getUser (options: {
    accessToken: string | null
  }): Promise<User>

  getIssues (options?: {
    accessToken?: string | null
  }): Promise<Array<Issue>>

  getComments (options: {
    issueId: string
    accessToken?: string | null
  }): Promise<Array<Comment>>

  createIssue (options: {
    title: string
    content: string
    accessToken: string | null
  }): any

  createIssueComment (options: {
    issueId: string
    content: string
    accessToken: string | null
  }): any

  createIssueReaction (options: {
    issueId: string
    reaction: string
    accessToken: string | null
  }): any

  createCommentReaction (options: {
    issueId: string
    commentId: string
    reaction: string
    accessToken: string | null
  }): any
}

export interface VssueAPIContructor {
  new (options: VssueAPIOptions): VssueAPI
}

export default VssueAPI
