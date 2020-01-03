import { VssueAPI } from 'vssue';
import MockAdapter from 'axios-mock-adapter';
import fixtures from './fixtures';
import GiteaV1 from '../src/index';
import {
  normalizeUser,
  normalizeIssue,
  normalizeComment,
  normalizeReactions,
} from '../src/utils';

const baseURL = 'https://gitea.com';
const APIEndpoint = `${baseURL}/api/v1`;

const options = {
  owner: 'owner',
  repo: 'repo',
  clientId: 'clientId',
  clientSecret: 'clientSecret',
  state: 'state',
  labels: fixtures.issue.labels.map(item => item.name),
  proxy: url => `https://porxy/${url}`,
};

const API = new GiteaV1(options);

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
    expect(API.platform.name).toBe('Gitea');
    expect(API.platform.version).toBe('v1');
  });

  test('with default baseURL', () => {
    expect(API.baseURL).toBe(baseURL);
    expect(API.platform.link).toBe(baseURL);
    expect(API.$http.defaults.baseURL).toBe(APIEndpoint);
  });

  test('with custom baseURL', () => {
    const customBaseURL = 'https://gitea.vssue.com';
    const customAPIEndPoint = `${customBaseURL}/api/v1`;
    const customAPI = new GiteaV1({
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
      }&redirect_uri=${encodeURIComponent(url)}&response_type=code&state=${
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
    expect(request.headers.Authorization).toBe(`bearer ${mockToken}`);
    expect(user).toEqual(normalizeUser(fixtures.user, baseURL));
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
          expect(request.headers.Authorization).toBe(`bearer ${mockToken}`);
          expect(issue).toEqual(
            normalizeIssue(fixtures.issue, baseURL, options.owner, options.repo)
          );
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
          expect(issue).toEqual(
            normalizeIssue(fixtures.issue, baseURL, options.owner, options.repo)
          );
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
      const issueTitle = fixtures.issues[0].title;

      describe('issue exists', () => {
        beforeEach(() => {
          mock
            .onGet(new RegExp(`repos/${options.owner}/${options.repo}/issues$`))
            .reply(200, fixtures.issues)
            .onGet(new RegExp(`repos/${options.owner}/${options.repo}/labels$`))
            .reply(200, fixtures.issue.labels);
        });

        test('login', async () => {
          const issue = (await API.getIssue({
            issueTitle,
            accessToken: mockToken,
          })) as VssueAPI.Issue;

          expect(mock.history.get.length).toBe(2);
          const request = mock.history.get[1];
          expect(request.method).toBe('get');
          expect(request.headers.Authorization).toBe(`bearer ${mockToken}`);
          expect(request.params.q).toEqual(expect.stringContaining(issueTitle));
          expect(issue).toEqual(
            normalizeIssue(
              fixtures.issues[0],
              baseURL,
              options.owner,
              options.repo
            )
          );
        });

        test('not login', async () => {
          const issue = (await API.getIssue({
            issueTitle,
            accessToken: null,
          })) as VssueAPI.Issue;
          expect(mock.history.get.length).toBe(2);
          const request = mock.history.get[1];
          expect(request.method).toBe('get');
          expect(request.headers.Authorization).toBeUndefined();
          expect(request.params.q).toEqual(expect.stringContaining(issueTitle));
          expect(issue).toEqual(
            normalizeIssue(
              fixtures.issues[0],
              baseURL,
              options.owner,
              options.repo
            )
          );
        });
      });

      test('issue does not exist', async () => {
        mock
          .onGet(new RegExp(`repos/${options.owner}/${options.repo}/issues$`))
          .reply(200, [])
          .onGet(new RegExp(`repos/${options.owner}/${options.repo}/labels$`))
          .reply(200, []);

        const issue = await API.getIssue({
          issueTitle,
          accessToken: null,
        });

        expect(mock.history.get.length).toBe(2);
        const request = mock.history.get[1];
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

    fixtures.issue.labels.forEach(item => {
      mock
        .onPost(new RegExp(`repos/${options.owner}/${options.repo}/labels$`))
        .replyOnce(201, item);
    });

    const issue = (await API.postIssue({
      title,
      content,
      accessToken: mockToken,
    })) as VssueAPI.Issue;

    expect(mock.history.post.length).toBe(fixtures.issue.labels.length + 1);

    const request = mock.history.post[fixtures.issue.labels.length];

    expect(request.method).toBe('post');
    expect(request.headers.Authorization).toBe(`bearer ${mockToken}`);
    const data = JSON.parse(request.data);
    expect(data.title).toBe(title);
    expect(data.body).toBe(content);
    expect(data.labels).toEqual(fixtures.issue.labels.map(item => item.id));
    expect(issue).toEqual(
      normalizeIssue(fixtures.issue, baseURL, options.owner, options.repo)
    );
  });

  describe('getComments', () => {
    const issueId = 1;

    beforeEach(() => {
      mock
        .onGet(
          new RegExp(
            `repos/${options.owner}/${options.repo}/issues/${issueId}/comments$`
          )
        )
        .reply(200, fixtures.comments)
        .onPost(new RegExp(`markdown$`))
        .reply(200, { html: '<p>Faked HTML body</p>' })
        .onGet(
          new RegExp(
            `repos/${options.owner}/${options.repo}/issues/comments/\\d*/reactions$`
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
      expect(mock.history.get.length).toBe(fixtures.comments.length + 1);
      expect(mock.history.post.length).toBe(fixtures.comments.length);

      const request = mock.history.get[0];
      expect(request.method).toBe('get');
      expect(request.headers.Authorization).toBe(`bearer ${mockToken}`);
    });

    test('not login', async () => {
      /* eslint-disable-next-line no-unused-expressions */
      (await API.getComments({
        issueId,
        accessToken: null,
      })) as VssueAPI.Comments;
      expect(mock.history.get.length).toBe(fixtures.comments.length + 1);
      expect(mock.history.post.length).toBe(fixtures.comments.length);

      const request = mock.history.get[0];
      expect(request.method).toBe('get');
      expect(request.headers.Authorization).toBeUndefined();
    });

    // describe('query', () => {
    // });
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
    expect(request.headers.Authorization).toBe(`bearer ${mockToken}`);
    const data = JSON.parse(request.data);
    expect(data.body).toBe(content);
    expect(comment).toEqual(normalizeComment(fixtures.comment, baseURL));
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
      .reply(201, fixtures.comment);

    const comment = (await API.putComment({
      issueId,
      commentId,
      content,
      accessToken: mockToken,
    })) as VssueAPI.Comment;
    expect(mock.history.patch.length).toBe(1);
    const request = mock.history.patch[0];
    expect(request.method).toBe('patch');
    expect(request.headers.Authorization).toBe(`bearer ${mockToken}`);
    const data = JSON.parse(request.data);
    expect(data.body).toBe(content);
    expect(comment).toEqual(normalizeComment(fixtures.comment, baseURL));
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
    expect(request.headers.Authorization).toBe(`bearer ${mockToken}`);
    expect(success).toBe(true);
  });

  describe('getCommentReactions', () => {
    const issueId = 1;
    const commentId = fixtures.comment.id;

    test('reactions', async () => {
      mock
        .onGet(
          new RegExp(
            `repos/${options.owner}/${options.repo}/issues/comments/${commentId}/reactions$`
          )
        )
        .reply(200, fixtures.reactions);
      const reactions = (await API.getCommentReactions({
        issueId,
        commentId,
        accessToken: mockToken,
      })) as VssueAPI.Reactions;

      expect(mock.history.get.length).toBe(1);
      const request = mock.history.get[0];
      expect(request.method).toBe('get');
      expect(request.headers.Authorization).toBe(`bearer ${mockToken}`);
      expect(reactions).toEqual(normalizeReactions(fixtures.reactions));
    });

    test('null', async () => {
      mock
        .onGet(
          new RegExp(
            `repos/${options.owner}/${options.repo}/issues/comments/${commentId}/reactions$`
          )
        )
        .reply(200, null);
      const reactions = (await API.getCommentReactions({
        issueId,
        commentId,
        accessToken: mockToken,
      })) as VssueAPI.Reactions;

      expect(mock.history.get.length).toBe(1);
      const request = mock.history.get[0];
      expect(request.method).toBe('get');
      expect(request.headers.Authorization).toBe(`bearer ${mockToken}`);
      expect(reactions).toEqual(normalizeReactions([]));
    });
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
      expect(request.headers.Authorization).toBe(`bearer ${mockToken}`);
      expect(success).toBe(true);
    });

    test('deleted', async () => {
      const issueId = 1;
      const commentId = fixtures.comment.id;
      mock
        .onPost(
          new RegExp(
            `repos/${options.owner}/${options.repo}/issues/comments/${commentId}/reactions$`
          )
        )
        .reply(500)
        .onDelete(
          new RegExp(
            `repos/${options.owner}/${options.repo}/issues/comments/${commentId}/reactions$`
          )
        )
        .reply(200);

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
      expect(request.headers.Authorization).toBe(`bearer ${mockToken}`);

      expect(success).toBe(true);
    });
  });

  describe('getLabels', () => {
    test('labels', async () => {
      mock
        .onGet(new RegExp(`repos/${options.owner}/${options.repo}/labels$`))
        .reply(200, fixtures.issue.labels);

      const labels = await API.getLabels({
        accessToken: mockToken,
      });

      expect(mock.history.get.length).toBe(1);
      const request = mock.history.get[0];
      expect(request.method).toBe('get');
      expect(request.headers.Authorization).toBe(`bearer ${mockToken}`);
      expect(labels).toEqual(fixtures.issue.labels);
    });

    test('null', async () => {
      mock
        .onGet(new RegExp(`repos/${options.owner}/${options.repo}/labels$`))
        .reply(200, null);

      const labels = await API.getLabels({
        accessToken: mockToken,
      });

      expect(mock.history.get.length).toBe(1);
      const request = mock.history.get[0];
      expect(request.method).toBe('get');
      expect(request.headers.Authorization).toBe(`bearer ${mockToken}`);
      expect(labels).toEqual([]);
    });
  });

  test('postLabel', async () => {
    mock
      .onPost(new RegExp(`repos/${options.owner}/${options.repo}/labels$`))
      .reply(201, fixtures.issue.labels[0]);

    const labels = await API.postLabel({
      accessToken: mockToken,
      label: fixtures.issue.labels[0].name,
    });

    expect(mock.history.post.length).toBe(1);
    const request = mock.history.post[0];
    expect(request.method).toBe('post');
    expect(request.headers.Authorization).toBe(`bearer ${mockToken}`);
    expect(labels).toEqual(fixtures.issue.labels[0].id);
  });
});
