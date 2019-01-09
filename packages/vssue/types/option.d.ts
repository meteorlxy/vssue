import { VssueAPI } from './api'

export interface VssueOptions {
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

export interface VssueAPIOptions {
  owner: string
  repo: string
  clientId: string
  clientSecret: string

  baseURL?: string
  state: string
  labels: Array<string>
}
