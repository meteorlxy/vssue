import { VssueAPIContructor } from './api'

export interface VssueOptions {
  baseURL?: string
  labels?: string
  state?: string
  owner?: string
  repo?: string
  clientId?: string
  clientSecret?: string
}

export interface VssueAPIOptions extends VssueOptions {
  owner: string
  repo: string
  clientId: string
  clientSecret: string
  labels: string
  state: string
}

export interface VssueUseOptions extends VssueOptions {
  api: VssueAPIContructor
}
