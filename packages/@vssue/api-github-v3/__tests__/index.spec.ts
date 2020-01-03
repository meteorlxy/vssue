import { VssueAPI } from 'vssue';
import MockAdapter from 'axios-mock-adapter';
import fixtures from './fixtures';
import GithubV3 from '../src/index';
import {
  normalizeUser,
  normalizeIssue,
  normalizeComment,
  normalizeReactions,
} from '../src/utils';

const baseURL = 'https://github.com';
const APIEndpoint = 'https://api.github.com';

const options = {
  owner: 'owner',
  repo: 'repo',
  clientId: 'clientId',
  clientSecret: 'clientSecret',
  state: 'state',
  labels: fixtures.issue.labels.map(item => item.name),
  proxy: url => `https://porxy/${url}`,
};

const API = new GithubV3(options);

const mock = new MockAdapter(API.$http);
const mockCode = 'test-code';
const mockToken = 'test-token';

describe('properties', () => {
  test('common properties', () => {
    expect(API.owner).toBe(options.owner);
    expect(API.repo).toBe(options.repo);
    expect(API.clientId).toBe(options.clientId);
    expect(API.clientSecret).toBe(options.clientSecret);
    expect(API.state).toBe(options.state);
    expect(API.labels).toBe(options.labels);
    expect(API.proxy).toBe(options.proxy);
    expect(API.platform.name).toBe('GitHub');
    expect(API.platform.version).toBe('v3');
  });

  test('with default baseURL', () => {
    expect(API.baseURL).toBe(baseURL);
    expect(API.platform.link).toBe(baseURL);
    expect(API.$http.defaults.baseURL).toBe(APIEndpoint);
  });

  test('with custom baseURL', () => {
    const customBaseURL = 'https://github.vssue.com';
    const customAPIEndPoint = `${customBaseURL}/api/v3`;
    const customAPI = new GithubV3({
      baseURL: customBaseURL,
      ...options,
    });
    expect(customAPI.baseURL).toBe(customBaseURL);
    expect(customAPI.platform.link).toBe(customBaseURL);
    expect(customAPI.$http.defaults.baseURL).toBe(customAPIEndPoint);
  });
});

describe('methods', () => {
  afterEach(() => {
    mock.reset();
  });

  test('error', async () => {
    mock.onGet(new RegExp('/error')).reply(200, {
      error: 'error',
      error_description: 'error_description',
    });

    await expect(API.$http.get('/error')).rejects.toThrowError(
      'error_description'
    );
  });

  test('redirectAuth', () => {
    // to make `window.location` writable
    const location = window.location;
    delete window.location;

    const url = 'https://vssue.js.org';
    window.location = { href: url } as any;
    API.redirectAuth();
    expect(window.location.href).toBe(
      `${baseURL}/login/oauth/authorize?client_id=${
        options.clientId
      }&redirect_uri=${encodeURIComponent(url)}&scope=public_repo&state=${
        options.state
      }`
    );

    // reset `window.location`
    window.location = location;
  });

  describe('handleAuth', () => {
    beforeEach(() => {
      mock.onPost(new RegExp('login/oauth/access_token')).reply(200, {
        access_token: mockToken,
      });
    });

    test('without code', async () => {
      const url = `https://vssue.js.org/`;
      window.history.replaceState(null, '', url);
      const token = await API.handleAuth();
      expect(mock.history.post.length).toBe(0);
      expect(window.location.href).toBe(url);
      expect(token).toBe(null);
    });

    test('with matched state', async () => {
      const url = `https://vssue.js.org/?code=${mockCode}&state=${options.state}`;
      window.history.replaceState(null, '', url);
      const token = await API.handleAuth();
      expect(mock.history.post.length).toBe(1);
      expect(window.location.href).toBe('https://vssue.js.org/');
      expect(token).toBe(mockToken);
    });

    test('with unmatched state', async () => {
      const url = `https://vssue.js.org/?code=${mockCode}&state=${options.state}-unmatched`;
      window.history.replaceState(null, '', url);
      const token = await API.handleAuth();
      expect(mock.history.post.length).toBe(0);
      expect(window.location.href).toBe(url);
      expect(token).toBe(null);
    });

    describe('getAccessToken', () => {
      test('with function proxy', async () => {
        const token = await API.getAccessToken({ code: mockCode });
        expect(mock.history.post.length).toBe(1);
        const request = mock.history.post[0];
        const data = JSON.parse(request.data);
        expect(request.url).toBe(
          options.proxy(`${baseURL}/login/oauth/access_token`)
        );
        expect(request.method).toBe('post');
        expect(data.client_id).toBe(options.clientId);
        expect(data.client_secret).toBe(options.clientSecret);
        expect(data.code).toBe(mockCode);
        expect(token).toBe(mockToken);
      });

      test('with string proxy', async () => {
        const proxy = `https://string.proxy?target=${baseURL}/login/oauth/access_token`;
        API.proxy = proxy;
        const token = await API.getAccessToken({ code: mockCode });
        expect(mock.history.post.length).toBe(1);
        const request = mock.history.post[0];
        const data = JSON.parse(request.data);
        expect(request.url).toBe(proxy);
        expect(request.method).toBe('post');
        expect(data.client_id).toBe(options.clientId);
        expect(data.client_secret).toBe(options.clientSecret);
        expect(data.code).toBe(mockCode);
        expect(token).toBe(mockToken);
        API.proxy = options.proxy;
      });
    });
  });

  test('getUser', async () => {
    mock.onGet(new RegExp('/user$')).reply(200, fixtures.user);
    const user = await API.getUser({ accessToken: mockToken });
    expect(mock.history.get.length).toBe(1);
    const request = mock.history.get[0];
    expect(request.method).toBe('get');
    expect(request.headers.Authorization).toBe(`token ${mockToken}`);
    expect(user).toEqual(normalizeUser(fixtures.user));
  });

  describe('getIssue', () => {
    describe('with issue id', () => {
      const issueId = fixtures.issue.number;

      describe('issue exists', () => {
        beforeEach(() => {
          mock
            .onGet(
              new RegExp(
                `repos/${options.owner}/${options.repo}/issues/${issueId}$`
              )
            )
            .reply(200, fixtures.issue);
        });

        test('login', async () => {
          const issue = (await API.getIssue({
            issueId,
            accessToken: mockToken,
          })) as VssueAPI.Issue;
          expect(mock.history.get.length).toBe(1);
          const request = mock.history.get[0];
          expect(request.method).toBe('get');
          expect(request.headers.Authorization).toBe(`token ${mockToken}`);
          expect(issue).toEqual(normalizeIssue(fixtures.issue));
        });

        test('not login', async () => {
          const issue = (await API.getIssue({
            issueId,
            accessToken: null,
          })) as VssueAPI.Issue;
          expect(mock.history.get.length).toBe(1);
          const request = mock.history.get[0];
          expect(request.method).toBe('get');
          expect(request.headers.Authorization).toBeUndefined();
          expect(issue).toEqual(normalizeIssue(fixtures.issue));
        });
      });

      test('issue does not exist', async () => {
        mock
          .onGet(
            new RegExp(
              `repos/${options.owner}/${options.repo}/issues/${issueId}$`
            )
          )
          .reply(404);
        const issue = await API.getIssue({
          issueId,
          accessToken: null,
        });
        expect(mock.history.get.length).toBe(1);
        const request = mock.history.get[0];
        expect(request.method).toBe('get');
        expect(issue).toBe(null);
      });

      test('error', async () => {
        mock
          .onGet(
            new RegExp(
              `repos/${options.owner}/${options.repo}/issues/${issueId}$`
            )
          )
          .reply(500);
        await expect(
          API.getIssue({
            issueId,
            accessToken: null,
          })
        ).rejects.toThrow();
        expect(mock.history.get.length).toBe(1);
        const request = mock.history.get[0];
        expect(request.method).toBe('get');
      });
    });

    describe('with issue title', () => {
      const issueTitle = fixtures.issues.items[0].title;

      describe('issue exists', () => {
        beforeEach(() => {
          mock.onGet(new RegExp(`search/issues$`)).reply(200, fixtures.issues);
        });

        test('login', async () => {
          const issue = (await API.getIssue({
            issueTitle,
            accessToken: mockToken,
          })) as VssueAPI.Issue;
          expect(mock.history.get.length).toBe(1);
          const request = mock.history.get[0];
          expect(request.method).toBe('get');
          expect(request.headers.Authorization).toBe(`token ${mockToken}`);
          expect(request.params.q).toEqual(expect.stringContaining(issueTitle));
          expect(issue).toEqual(normalizeIssue(fixtures.issues.items[0]));
        });

        test('not login', async () => {
          const issue = (await API.getIssue({
            issueTitle,
            accessToken: null,
          })) as VssueAPI.Issue;
          expect(mock.history.get.length).toBe(1);
          const request = mock.history.get[0];
          expect(request.method).toBe('get');
          expect(request.headers.Authorization).toBeUndefined();
          expect(request.params.q).toEqual(expect.stringContaining(issueTitle));
          expect(issue).toEqual(normalizeIssue(fixtures.issues.items[0]));
        });
      });

      test('issue does not exist', async () => {
        mock.onGet(new RegExp(`search/issues$`)).reply(200, { items: [] });
        const issue = await API.getIssue({
          issueTitle,
          accessToken: null,
        });
        expect(mock.history.get.length).toBe(1);
        const request = mock.history.get[0];
        expect(request.method).toBe('get');
        expect(issue).toBe(null);
      });
    });
  });

  test('postIssue', async () => {
    const title = fixtures.issue.title;
    const content = fixtures.issue.body;
    mock
      .onPost(new RegExp(`repos/${options.owner}/${options.repo}/issues$`))
      .reply(201, fixtures.issue);
    const issue = (await API.postIssue({
      title,
      content,
      accessToken: mockToken,
    })) as VssueAPI.Issue;
    expect(mock.history.post.length).toBe(1);
    const request = mock.history.post[0];
    expect(request.method).toBe('post');
    expect(request.headers.Authorization).toBe(`token ${mockToken}`);
    const data = JSON.parse(request.data);
    expect(data.title).toBe(title);
    expect(data.body).toBe(content);
    expect(data.labels).toEqual(options.labels);
    expect(issue).toEqual(normalizeIssue(fixtures.issue));
  });

  describe('getComments', () => {
    const issueId = 1;

    beforeEach(() => {
      mock
        .onGet(
          new RegExp(
            `repos/${options.owner}/${options.repo}/issues/${issueId}$`
          )
        )
        .reply(200, fixtures.issue)
        .onGet(
          new RegExp(
            `repos/${options.owner}/${options.repo}/issues/${issueId}/comments$`
          )
        )
        .reply(200, fixtures.comments, { link: null });
    });

    test('login', async () => {
      /* eslint-disable-next-line no-unused-expressions */
      (await API.getComments({
        issueId,
        accessToken: mockToken,
      })) as VssueAPI.Comments;
      expect(mock.history.get.length).toBe(2);

      const requestIssue = mock.history.get[0];
      expect(requestIssue.method).toBe('get');
      expect(requestIssue.headers.Authorization).toBe(`token ${mockToken}`);

      const requestComments = mock.history.get[1];
      expect(requestComments.method).toBe('get');
      expect(requestComments.headers.Authorization).toBe(`token ${mockToken}`);
    });

    test('not login', async () => {
      /* eslint-disable-next-line no-unused-expressions */
      (await API.getComments({
        issueId,
        accessToken: null,
      })) as VssueAPI.Comments;
      expect(mock.history.get.length).toBe(2);

      const requestIssue = mock.history.get[0];
      expect(requestIssue.method).toBe('get');
      expect(requestIssue.headers.Authorization).toBeUndefined();

      const requestComments = mock.history.get[1];
      expect(requestComments.method).toBe('get');
      expect(requestComments.headers.Authorization).toBeUndefined();
    });

    describe('query', () => {
      const query = {
        page: 1,
        perPage: 10,
      };

      test('common', async () => {
        const comments = (await API.getComments({
          issueId,
          accessToken: mockToken,
          query,
        })) as VssueAPI.Comments;
        const request = mock.history.get[1];
        expect(request.method).toBe('get');
        expect(request.headers.Accept).toEqual(
          expect.arrayContaining([
            'application/vnd.github.v3.raw+json',
            'application/vnd.github.v3.html+json',
            'application/vnd.github.squirrel-girl-preview',
          ])
        );
        expect(request.params.page).toBe(query.page);
        expect(request.params.per_page).toBe(query.perPage);
        expect(request.params.sort).toBeUndefined();
        expect(comments.count).toEqual(fixtures.comments.length);
        expect(comments.page).toEqual(query.page);
        expect(comments.perPage).toEqual(query.perPage);
        expect(comments.data).toEqual(
          fixtures.comments.slice(0, query.perPage).map(normalizeComment)
        );
      });

      test('default value', async () => {
        /* eslint-disable-next-line no-unused-expressions */
        (await API.getComments({
          issueId,
          accessToken: mockToken,
          query: {},
        })) as VssueAPI.Comments;
        const request = mock.history.get[1];
        expect(request.params.page).toBe(1);
        expect(request.params.per_page).toBe(10);
        expect(request.params.sort).toBeUndefined();
      });
    });
  });

  test('postComment', async () => {
    const issueId = 1;
    const content = fixtures.comment.body;
    mock
      .onPost(
        new RegExp(
          `repos/${options.owner}/${options.repo}/issues/${issueId}/comments$`
        )
      )
      .reply(201, fixtures.comment);
    const comment = (await API.postComment({
      issueId,
      content,
      accessToken: mockToken,
    })) as VssueAPI.Comment;
    expect(mock.history.post.length).toBe(1);
    const request = mock.history.post[0];
    expect(request.method).toBe('post');
    expect(request.headers.Authorization).toBe(`token ${mockToken}`);
    expect(request.headers.Accept).toEqual(
      expect.arrayContaining([
        'application/vnd.github.v3.raw+json',
        'application/vnd.github.v3.html+json',
        'application/vnd.github.squirrel-girl-preview',
      ])
    );
    const data = JSON.parse(request.data);
    expect(data.body).toBe(content);
    expect(comment).toEqual(normalizeComment(fixtures.comment));
  });

  test('putComment', async () => {
    const issueId = 1;
    const commentId = fixtures.comment.id;
    const content = fixtures.comment.body;
    mock
      .onPatch(
        new RegExp(
          `repos/${options.owner}/${options.repo}/issues/comments/${commentId}$`
        )
      )
      .reply(200, fixtures.comment);
    const comment = (await API.putComment({
      issueId,
      commentId,
      content,
      accessToken: mockToken,
    })) as VssueAPI.Comment;
    expect(mock.history.patch.length).toBe(1);
    const request = mock.history.patch[0];
    expect(request.method).toBe('patch');
    expect(request.headers.Authorization).toBe(`token ${mockToken}`);
    expect(request.headers.Accept).toEqual(
      expect.arrayContaining([
        'application/vnd.github.v3.raw+json',
        'application/vnd.github.v3.html+json',
        'application/vnd.github.squirrel-girl-preview',
      ])
    );
    const data = JSON.parse(request.data);
    expect(data.body).toBe(content);
    expect(comment).toEqual(normalizeComment(fixtures.comment));
  });

  test('deleteComment', async () => {
    const issueId = 1;
    const commentId = fixtures.comment.id;
    mock
      .onDelete(
        new RegExp(
          `repos/${options.owner}/${options.repo}/issues/comments/${commentId}$`
        )
      )
      .reply(204);
    const success = await API.deleteComment({
      issueId,
      commentId,
      accessToken: mockToken,
    });
    expect(mock.history.delete.length).toBe(1);
    const request = mock.history.delete[0];
    expect(request.method).toBe('delete');
    expect(request.headers.Authorization).toBe(`token ${mockToken}`);
    expect(success).toBe(true);
  });

  test('getCommentReactions', async () => {
    const issueId = 1;
    const commentId = fixtures.comment.id;
    mock
      .onGet(
        new RegExp(
          `repos/${options.owner}/${options.repo}/issues/comments/${commentId}$`
        )
      )
      .reply(200, fixtures.comment);
    const reactions = (await API.getCommentReactions({
      issueId,
      commentId,
      accessToken: mockToken,
    })) as VssueAPI.Reactions;
    expect(mock.history.get.length).toBe(1);
    const request = mock.history.get[0];
    expect(request.method).toBe('get');
    expect(request.headers.Authorization).toBe(`token ${mockToken}`);
    expect(request.headers.Accept).toBe(
      'application/vnd.github.squirrel-girl-preview'
    );
    expect(reactions).toEqual(normalizeReactions(fixtures.comment.reactions));
  });

  describe('postCommentReaction', () => {
    test('created', async () => {
      const issueId = 1;
      const commentId = fixtures.comment.id;
      mock
        .onPost(
          new RegExp(
            `repos/${options.owner}/${options.repo}/issues/comments/${commentId}/reactions$`
          )
        )
        .reply(201);
      const success = (await API.postCommentReaction({
        issueId,
        commentId,
        accessToken: mockToken,
        reaction: 'like',
      })) as VssueAPI.Reactions;
      expect(mock.history.post.length).toBe(1);
      const request = mock.history.post[0];
      expect(request.method).toBe('post');
      expect(request.headers.Authorization).toBe(`token ${mockToken}`);
      expect(request.headers.Accept).toBe(
        'application/vnd.github.squirrel-girl-preview'
      );
      expect(success).toBe(true);
    });

    test('deleted', async () => {
      const issueId = 1;
      const commentId = fixtures.comment.id;
      const reactionId = fixtures.reaction.id;
      mock
        .onPost(
          new RegExp(
            `repos/${options.owner}/${options.repo}/issues/comments/${commentId}/reactions$`
          )
        )
        .reply(200, fixtures.reaction)
        .onDelete(new RegExp(`reactions/${reactionId}$`))
        .reply(204);

      const success = (await API.postCommentReaction({
        issueId,
        commentId,
        accessToken: mockToken,
        reaction: 'like',
      })) as VssueAPI.Reactions;

      expect(mock.history.post.length).toBe(1);
      expect(mock.history.delete.length).toBe(1);
      const request = mock.history.delete[0];
      expect(request.method).toBe('delete');
      expect(request.headers.Authorization).toBe(`token ${mockToken}`);
      expect(request.headers.Accept).toBe(
        'application/vnd.github.squirrel-girl-preview'
      );

      expect(success).toBe(true);
    });
  });
});
