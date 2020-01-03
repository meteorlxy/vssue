export interface ResponseAccessToken {
  access_token: string;
}

export interface ResponseGraphql<T> {
  data: T;
}

export type ResponseGraphqlGetUser = ResponseGraphql<{
  viewer: ResponseUser;
}>;

export type ResponseGraphqlGetIssue = ResponseGraphql<{
  repository: {
    issue: ResponseIssue;
  };
}>;

export type ResponseGraphqlGetIssueSearch = ResponseGraphql<{
  search: {
    nodes: ResponseIssue[];
  };
}>;

export type ResponseGraphqlGetComments = ResponseGraphql<{
  repository: {
    issue: {
      comments: {
        nodes: ResponseComment[];
        pageInfo: {
          endCursor: string;
          startCursor: string;
        };
        totalCount: number;
      };
    };
  };
}>;

export type ResponseGraphqlPostComment = ResponseGraphql<{
  addComment: {
    commentEdge: {
      node: ResponseComment;
    };
  };
}>;

export type ResponseGraphqlPutComment = ResponseGraphql<{
  updateIssueComment: {
    issueComment: ResponseComment;
  };
}>;

export type ResponseGraphqlGetCommentReactions = ResponseGraphql<{
  repository: {
    issue: {
      comments: {
        nodes: Pick<ResponseComment, 'id' | 'reactionGroups'>[];
      };
    };
  };
}>;

export interface ResponseUser {
  login: string;
  url: string;
  avatarUrl: string;
}

export interface ResponseIssue {
  id: string;
  number: number;
  title: string;
  body: string;
  url: string;
}

export interface ResponseComment {
  id: number;
  author: ResponseUser;
  title: string;
  body: string;
  bodyHTML: string;
  createdAt: string;
  updatedAt: string;
  reactionGroups: ResponseReaction[];
}

export interface ResponseReaction {
  users: {
    totalCount: number;
  };
  content: 'THUMBS_UP' | 'THUMBS_DOWN' | 'HEART' | string;
}
