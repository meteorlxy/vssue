import { VssueAPI } from 'vssue';
import MockAdapter from 'axios-mock-adapter';
import fixtures from './fixtures';
import GitlabV4 from '../src/index';
import {
  normalizeUser,
  normalizeIssue,
  normalizeComment,
  normalizeReactions,
} from '../src/utils';

const baseURL = 'https://gitlab.com';
const APIEndpoint = 'https://gitlab.com/api/v4';

const options = {
  owner: 'owner',
  repo: 'repo',
  clientId: 'clientId',
  state: 'state',
  labels: [],
};

const encodedRepo = encodeURIComponent(`${options.owner}/${options.repo}`);

const API = new GitlabV4(options);

const mock = new MockAdapter(API.$http);
const mockToken = 'test-token';

describe('properties', () => {
  test('common properties', () => {
    expect(API.owner).toBe(options.owner);
    expect(API.repo).toBe(options.repo);
    expect(API.clientId).toBe(options.clientId);
    expect(API.state).toBe(options.state);
    expect(API.platform.name).toBe('GitLab');
    expect(API.platform.version).toBe('v4');
  });

  test('with default baseURL', () => {
    expect(API.baseURL).toBe(baseURL);
    expect(API.platform.link).toBe(baseURL);
    expect(API.$http.defaults.baseURL).toBe(APIEndpoint);
  });
});

describe('methods', () => {
  afterEach(() => {
    mock.reset();
  });

  test('redirectAuth', () => {
    // to make `window.location` writable
    const location = window.location;
    delete window.location;

    const url = 'https://vssue.js.org';
    window.location = { href: url } as any;
    API.redirectAuth();
    expect(window.location.href).toBe(
      `${baseURL}/oauth/authorize?client_id=${
        options.clientId
      }&redirect_uri=${encodeURIComponent(url)}&response_type=token&state=${
        options.state
      }`
    );

    // reset `window.location`
    window.location = location;
  });

  describe('handleAuth', () => {
    test('without access_token', async () => {
      const url = `https://vssue.js.org/`;
      window.history.replaceState(null, '', url);
      const token = await API.handleAuth();
      expect(window.location.href).toBe(url);
      expect(token).toBe(null);
    });

    test('with matched state', async () => {
      const url = `https://vssue.js.org/#access_token=${mockToken}&state=${options.state}`;
      window.history.replaceState(null, '', url);
      const token = await API.handleAuth();
      expect(window.location.href).toBe('https://vssue.js.org/');
      expect(token).toBe(mockToken);
    });

    test('with unmatched state', async () => {
      const url = `https://vssue.js.org/#access_token=${mockToken}&state=${options.state}-unmatched`;
      window.history.replaceState(null, '', url);
      const token = await API.handleAuth();
      expect(window.location.href).toBe(url);
      expect(token).toBe(null);
    });

    test('with extra hash', async () => {
      const url = `https://vssue.js.org/#access_token=${mockToken}&state=${options.state}&extra=hash`;
      window.history.replaceState(null, '', url);
      const token = await API.handleAuth();
      expect(window.location.href).toBe('https://vssue.js.org/#extra=hash');
      expect(token).toBe(mockToken);
    });
  });

  test('getUser', async () => {
    mock.onGet(new RegExp('/user$')).reply(200, fixtures.user);
    const user = await API.getUser({ accessToken: mockToken });
    expect(mock.history.get.length).toBe(1);
    const request = mock.history.get[0];
    expect(request.method).toBe('get');
    expect(request.headers.Authorization).toBe(`Bearer ${mockToken}`);
    expect(user).toEqual(normalizeUser(fixtures.user));
  });

  describe('getIssue', () => {
    describe('with issue id', () => {
      const issueId = fixtures.issues[0].id;

      describe('issue exists', () => {
        beforeEach(() => {
          mock
            .onGet(new RegExp(`projects/${encodedRepo}/issues/${issueId}$`))
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
          expect(request.headers.Authorization).toBe(`Bearer ${mockToken}`);
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
          .onGet(new RegExp(`projects/${encodedRepo}/issues/${issueId}$`))
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
          .onGet(new RegExp(`projects/${encodedRepo}/issues/${issueId}$`))
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
      const issueTitle = fixtures.issues[0].title;

      describe('issue exists', () => {
        beforeEach(() => {
          mock
            .onGet(new RegExp(`projects/${encodedRepo}/issues$`))
            .reply(200, fixtures.issues);
        });

        test('login', async () => {
          const issue = (await API.getIssue({
            issueTitle,
            accessToken: mockToken,
          })) as VssueAPI.Issue;
          expect(mock.history.get.length).toBe(1);
          const request = mock.history.get[0];
          expect(request.method).toBe('get');
          expect(request.headers.Authorization).toBe(`Bearer ${mockToken}`);
          expect(issue).toEqual(normalizeIssue(fixtures.issues[0]));
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
          expect(issue).toEqual(normalizeIssue(fixtures.issues[0]));
        });
      });

      test('issue does not exist', async () => {
        mock
          .onGet(new RegExp(`projects/${encodedRepo}/issues$`))
          .reply(200, []);
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
    const content = fixtures.issue.description;
    mock
      .onPost(new RegExp(`projects/${encodedRepo}/issues$`))
      .reply(201, fixtures.issue);
    const issue = (await API.postIssue({
      title,
      content,
      accessToken: mockToken,
    })) as VssueAPI.Issue;
    expect(mock.history.post.length).toBe(1);
    const request = mock.history.post[0];
    expect(request.method).toBe('post');
    expect(request.headers.Authorization).toBe(`Bearer ${mockToken}`);
    const data = JSON.parse(request.data);
    expect(data.title).toBe(title);
    expect(data.description).toBe(content);
    expect(data.labels).toBe(options.labels.join(','));
    expect(issue).toEqual(normalizeIssue(fixtures.issue));
  });

  describe('getComments', () => {
    const issueId = 1;

    beforeEach(() => {
      mock
        .onGet(new RegExp(`projects/${encodedRepo}/issues/${issueId}/notes$`))
        .reply(200, fixtures.comments, {
          'x-total': fixtures.comments.length,
          'x-page': 1,
          'x-per-page': 10,
        })
        .onPost(new RegExp(`markdown$`))
        .reply(200, { html: '<p>Faked HTML body</p>' })
        .onGet(
          new RegExp(
            `projects/${encodedRepo}/issues/${issueId}/notes/\\d*/award_emoji$`
          )
        )
        .reply(200, fixtures.reactions);
    });

    test('login', async () => {
      /* eslint-disable-next-line no-unused-expressions */
      (await API.getComments({
        issueId,
        accessToken: mockToken,
      })) as VssueAPI.Comments;
      expect(mock.history.get.length).toBe(1 + fixtures.comments.length);
      expect(mock.history.post.length).toBe(fixtures.comments.length);

      const request = mock.history.get[0];
      expect(request.method).toBe('get');
      expect(request.headers.Authorization).toBe(`Bearer ${mockToken}`);
    });

    test('not login', async () => {
      /* eslint-disable-next-line no-unused-expressions */
      (await API.getComments({
        issueId,
        accessToken: null,
      })) as VssueAPI.Comments;
      expect(mock.history.get.length).toBe(1 + fixtures.comments.length);
      expect(mock.history.post.length).toBe(fixtures.comments.length);

      const request = mock.history.get[0];
      expect(request.method).toBe('get');
      expect(request.headers.Authorization).toBeUndefined();
    });

    describe('query', () => {
      const query = {
        page: 1,
        perPage: 10,
        sort: 'desc',
      };

      test('common', async () => {
        const comments = (await API.getComments({
          issueId,
          accessToken: mockToken,
          query,
        })) as VssueAPI.Comments;
        const request = mock.history.get[0];
        expect(request.params.page).toBe(query.page);
        expect(request.params.per_page).toBe(query.perPage);
        expect(request.params.order_by).toBe('created_at');
        expect(request.params.sort).toBe('desc');
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
        const request = mock.history.get[0];
        expect(request.params.page).toBe(1);
        expect(request.params.per_page).toBe(10);
        expect(request.params.order_by).toBe('created_at');
        expect(request.params.sort).toBe('desc');
      });

      test('sort asc', async () => {
        /* eslint-disable-next-line no-unused-expressions */
        (await API.getComments({
          issueId,
          accessToken: mockToken,
          query: {
            sort: 'asc',
          },
        })) as VssueAPI.Comments;
        const request = mock.history.get[0];
        expect(request.params.sort).toBe('asc');
      });
    });
  });

  test('postComment', async () => {
    const issueId = 1;
    const content = fixtures.comment.body;
    mock
      .onPost(new RegExp(`projects/${encodedRepo}/issues/${issueId}/notes$`))
      .reply(201, fixtures.comment);
    const comment = (await API.postComment({
      issueId,
      content,
      accessToken: mockToken,
    })) as VssueAPI.Comment;
    expect(mock.history.post.length).toBe(1);
    const request = mock.history.post[0];
    expect(request.method).toBe('post');
    expect(request.headers.Authorization).toBe(`Bearer ${mockToken}`);
    const data = JSON.parse(request.data);
    expect(data.body).toBe(content);
    expect(comment).toEqual(normalizeComment(fixtures.comment));
  });

  test('putComment', async () => {
    const issueId = 1;
    const commentId = fixtures.comment.id;
    const content = fixtures.comment.body;
    mock
      .onPut(
        new RegExp(
          `projects/${encodedRepo}/issues/${issueId}/notes/${commentId}$`
        )
      )
      .reply(201, fixtures.comment)
      .onPost(new RegExp(`markdown$`))
      .reply(200, { html: '<p>Faked HTML body</p>' })
      .onGet(
        new RegExp(
          `projects/${encodedRepo}/issues/${issueId}/notes/\\d*/award_emoji$`
        )
      )
      .reply(200, fixtures.reactions);
    const comment = (await API.putComment({
      issueId,
      commentId,
      content,
      accessToken: mockToken,
    })) as VssueAPI.Comment;
    expect(mock.history.put.length).toBe(1);
    expect(mock.history.get.length).toBe(1);
    expect(mock.history.post.length).toBe(1);
    const request = mock.history.put[0];
    expect(request.method).toBe('put');
    expect(request.headers.Authorization).toBe(`Bearer ${mockToken}`);
    const data = JSON.parse(request.data);
    expect(data.body).toBe(content);
    expect(comment).toEqual(
      normalizeComment(
        Object.assign(
          {
            body_html: '<p>Faked HTML body</p>',
            reactions: normalizeReactions(fixtures.reactions),
          },
          fixtures.comment
        )
      )
    );
  });

  test('deleteComment', async () => {
    const issueId = 1;
    const commentId = fixtures.comment.id;
    mock
      .onDelete(
        new RegExp(
          `projects/${encodedRepo}/issues/${issueId}/notes/${commentId}$`
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
    expect(request.headers.Authorization).toBe(`Bearer ${mockToken}`);
    expect(success).toBe(true);
  });

  test('getCommentReactions', async () => {
    const issueId = 1;
    const commentId = fixtures.comment.id;
    mock
      .onGet(
        new RegExp(
          `projects/${encodedRepo}/issues/${issueId}/notes/${commentId}/award_emoji$`
        )
      )
      .reply(200, fixtures.reactions);
    const reactions = await API.getCommentReactions({
      issueId,
      commentId,
      accessToken: mockToken,
    });
    expect(mock.history.get.length).toBe(1);
    const request = mock.history.get[0];
    expect(request.method).toBe('get');
    expect(request.headers.Authorization).toBe(`Bearer ${mockToken}`);
    expect(reactions).toEqual(normalizeReactions(fixtures.reactions));
  });

  test('postCommentReaction', async () => {
    const issueId = 1;
    const commentId = fixtures.comment.id;
    mock
      .onPost(
        new RegExp(
          `projects/${encodedRepo}/issues/${issueId}/notes/${commentId}/award_emoji$`
        )
      )
      .reply(201);
    const success = await API.postCommentReaction({
      issueId,
      commentId,
      accessToken: mockToken,
      reaction: 'like',
    });
    expect(mock.history.post.length).toBe(1);
    const request = mock.history.post[0];
    expect(request.method).toBe('post');
    expect(request.headers.Authorization).toBe(`Bearer ${mockToken}`);
    expect(success).toBe(true);
  });
});
