import { VssueAPIContructor } from './api'

export interface VssueOptions {
  api: VssueAPIContructor
  owner: string
  repo: string
  clientId: string
  clientSecret: string

  baseURL?: string
  state: string
  labels: string
  prefix: string
  admins: Array<string>
}

export interface VssueAPIOptions {
  owner: string
  repo: string
  clientId: string
  clientSecret: string

  baseURL?: string
  state: string
  labels: string
}
