export interface ResponseAccessToken {
  access_token: string;
}

export interface ResponseUser {
  login: string;
  full_name: string;
  avatar_url: string;
}

export interface ResponseIssue {
  number: number;
  title: string;
  body: string;
  comments: number;
}

export interface ResponseComment {
  id: number;
  user: ResponseUser;
  body: string;
  body_html?: string;
  created_at: string;
  updated_at: string;
  reactions?: unknown;
}

export interface ResponseReaction {
  content: '+1' | '-1' | 'heart' | string;
}

export interface ResponseLabel {
  id: number;
  name: string;
}

export type ResponseMarkdown = string;
