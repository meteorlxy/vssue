import * as tslib_1 from "tslib";
import { buildQuery, buildURL, getCleanURL, parseQuery, } from '@vssue/utils';
import axios from 'axios';
/**
 * @see https://confluence.atlassian.com/bitbucket/oauth-on-bitbucket-cloud-238027431.html
 * @see https://developer.atlassian.com/bitbucket/api/2/reference/meta/authentication
 * @see https://developer.atlassian.com/bitbucket/api/2/reference/resource/repositories/%7Busername%7D/%7Brepo_slug%7D/issues
 * @see https://developer.atlassian.com/bitbucket/api/2/reference/resource/repositories/%7Busername%7D/%7Brepo_slug%7D/issues/%7Bissue_id%7D/comments
 * @see https://developer.atlassian.com/bitbucket/api/2/reference/resource/repositories/%7Busername%7D/%7Brepo_slug%7D/issues/%7Bissue_id%7D/comments
 */
var BitbucketV2 = /** @class */ (function () {
    function BitbucketV2(_a) {
        var _b = _a.baseURL, baseURL = _b === void 0 ? 'https://api.bitbucket.org/2.0/' : _b, owner = _a.owner, repo = _a.repo, clientId = _a.clientId, clientSecret = _a.clientSecret, state = _a.state;
        this.baseURL = baseURL;
        this.owner = owner;
        this.repo = repo;
        this.clientId = clientId;
        this.clientSecret = clientSecret;
        this.state = state;
        this.$http = axios.create({
            baseURL: baseURL,
            headers: {
                'Accept': 'application/json',
            },
        });
    }
    Object.defineProperty(BitbucketV2.prototype, "platform", {
        get: function () {
            return 'bitbucket';
        },
        enumerable: true,
        configurable: true
    });
    BitbucketV2.prototype.redirectAuthorize = function () {
        window.location.href = buildURL('https://bitbucket.org/site/oauth2/authorize', {
            client_id: this.clientId,
            redirect_uri: window.location.href,
            response_type: 'code',
        });
    };
    BitbucketV2.prototype.handleAuthorize = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var query, code, replaceURL, accessToken;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        query = parseQuery(window.location.search);
                        if (!query.code) return [3 /*break*/, 2];
                        code = query.code;
                        delete query.code;
                        replaceURL = buildURL(getCleanURL(window.location.href), query) + window.location.hash;
                        window.history.replaceState(null, '', replaceURL);
                        return [4 /*yield*/, this.getAccessToken({ code: code })];
                    case 1:
                        accessToken = _a.sent();
                        return [2 /*return*/, accessToken];
                    case 2: return [2 /*return*/, null];
                }
            });
        });
    };
    BitbucketV2.prototype.getAccessToken = function (_a) {
        var code = _a.code;
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var response, accessToken;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.$http.post("https://cors-anywhere.herokuapp.com/" + 'https://bitbucket.org/site/oauth2/access_token', buildQuery({
                            grant_type: 'authorization_code',
                            redirect_uri: window.location.href,
                            code: code,
                        }), {
                            headers: {
                                'Content-Type': 'application/x-www-form-urlencoded',
                            },
                            auth: {
                                username: this.clientId,
                                password: this.clientSecret,
                            },
                        })];
                    case 1:
                        response = _b.sent();
                        accessToken = response.data.access_token;
                        return [2 /*return*/, accessToken];
                }
            });
        });
    };
    BitbucketV2.prototype.getUser = function (_a) {
        var accessToken = _a.accessToken;
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var response, user;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.$http.get('/user', {
                            headers: { 'Authorization': "Bearer " + accessToken },
                        })];
                    case 1:
                        response = _b.sent();
                        user = response.data;
                        return [2 /*return*/, normalizeUser(user)];
                }
            });
        });
    };
    BitbucketV2.prototype.getIssues = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var response, issues;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.$http.get("repositories/" + this.owner + "/" + this.repo + "/issues", {
                            params: {
                                // to avoid caching
                                timestamp: Date.now(),
                            },
                        })];
                    case 1:
                        response = _a.sent();
                        issues = response.data.values;
                        return [2 /*return*/, issues.map(normalizeIssue)];
                }
            });
        });
    };
    BitbucketV2.prototype.getComments = function (_a) {
        var issueId = _a.issueId;
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var response, comments;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.$http.get("repositories/" + this.owner + "/" + this.repo + "/issues/" + issueId + "/comments", {
                            params: {
                                // to avoid caching
                                timestamp: Date.now(),
                            },
                            headers: {
                                'Accept': [
                                    'application/vnd.github.v3.raw+json',
                                    'application/vnd.github.v3.html+json',
                                    'application/vnd.github.squirrel-girl-preview',
                                ],
                            },
                        })];
                    case 1:
                        response = _b.sent();
                        comments = response.data.values;
                        return [2 /*return*/, comments.map(normalizeComment)];
                }
            });
        });
    };
    BitbucketV2.prototype.createIssue = function (_a) {
        var title = _a.title, content = _a.content, accessToken = _a.accessToken;
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var response, issue;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.$http.post("repositories/" + this.owner + "/" + this.repo + "/issues", {
                            title: title,
                            content: {
                                raw: content,
                            },
                            priority: 'trivial',
                            type: 'task',
                        }, {
                            headers: { 'Authorization': "Bearer " + accessToken },
                        })];
                    case 1:
                        response = _b.sent();
                        issue = response.data;
                        return [2 /*return*/, normalizeIssue(issue)];
                }
            });
        });
    };
    BitbucketV2.prototype.createIssueComment = function (_a) {
        var issueId = _a.issueId, content = _a.content, accessToken = _a.accessToken;
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var response, comment;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.$http.post("repositories/" + this.owner + "/" + this.repo + "/issues/" + issueId + "/comments", {
                            content: {
                                raw: content,
                            },
                        }, {
                            headers: { 'Authorization': "Bearer " + accessToken },
                        })];
                    case 1:
                        response = _b.sent();
                        comment = response.data;
                        return [2 /*return*/, normalizeComment(comment)];
                }
            });
        });
    };
    BitbucketV2.prototype.createIssueReaction = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/];
            });
        });
    };
    BitbucketV2.prototype.createCommentReaction = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/];
            });
        });
    };
    return BitbucketV2;
}());
export default BitbucketV2;
function normalizeUser(user) {
    return {
        username: user.username,
        avatar: user.links.avatar.href,
        homepage: user.links.html.href,
    };
}
function normalizeIssue(issue) {
    return {
        id: issue.id,
        title: issue.title,
        content: issue.content.raw,
        commentsCount: null,
    };
}
function normalizeComment(comment) {
    return {
        id: comment.id,
        content: comment.content.html,
        contentRaw: comment.content.raw,
        author: normalizeUser(comment.user),
        createdAt: comment.created_on,
        updatedAt: comment.updated_on,
        reactions: null,
    };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQVNBLE9BQU8sRUFDTCxVQUFVLEVBQ1YsUUFBUSxFQUNSLFdBQVcsRUFDWCxVQUFVLEdBQ1gsTUFBTSxjQUFjLENBQUE7QUFFckIsT0FBTyxLQUVOLE1BQU0sT0FBTyxDQUFBO0FBRWQ7Ozs7OztHQU1HO0FBQ0g7SUFhRSxxQkFBYSxFQU9LO1lBTmhCLGVBQTBDLEVBQTFDLCtEQUEwQyxFQUMxQyxnQkFBSyxFQUNMLGNBQUksRUFDSixzQkFBUSxFQUNSLDhCQUFZLEVBQ1osZ0JBQUs7UUFFTCxJQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQTtRQUN0QixJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQTtRQUNsQixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQTtRQUVoQixJQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQTtRQUN4QixJQUFJLENBQUMsWUFBWSxHQUFHLFlBQVksQ0FBQTtRQUNoQyxJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQTtRQUVsQixJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUM7WUFDeEIsT0FBTyxTQUFBO1lBQ1AsT0FBTyxFQUFFO2dCQUNQLFFBQVEsRUFBRSxrQkFBa0I7YUFDN0I7U0FDRixDQUFDLENBQUE7SUFDSixDQUFDO0lBMUJELHNCQUFJLGlDQUFRO2FBQVo7WUFDRSxPQUFPLFdBQVcsQ0FBQTtRQUNwQixDQUFDOzs7T0FBQTtJQTBCRCx1Q0FBaUIsR0FBakI7UUFDRSxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksR0FBRyxRQUFRLENBQUMsNkNBQTZDLEVBQUU7WUFDN0UsU0FBUyxFQUFFLElBQUksQ0FBQyxRQUFRO1lBQ3hCLFlBQVksRUFBRSxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUk7WUFDbEMsYUFBYSxFQUFFLE1BQU07U0FDdEIs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LEVBQUUsSUFBSTtLQUNoQixDQUFBO0FBQ0gsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBWc3N1ZSwge1xuICBVc2VyLFxuICBJc3N1ZSxcbiAgQ29tbWVudCxcbiAgUmVhY3Rpb25zLFxuICBWc3N1ZUFQSSxcbiAgVnNzdWVBUElPcHRpb25zLFxufSBmcm9tICd2c3N1ZSdcblxuaW1wb3J0IHtcbiAgYnVpbGRRdWVyeSxcbiAgYnVpbGRVUkwsXG4gIGdldENsZWFuVVJMLFxuICBwYXJzZVF1ZXJ5LFxufSBmcm9tICdAdnNzdWUvdXRpbHMnXG5cbmltcG9ydCBheGlvcywge1xuICBBeGlvc0luc3RhbmNlLFxufSBmcm9tICdheGlvcydcblxuLyoqXG4gKiBAc2VlIGh0dHBzOi8vY29uZmx1ZW5jZS5hdGxhc3NpYW4uY29tL2JpdGJ1Y2tldC9vYXV0aC1vbi1iaXRidWNrZXQtY2xvdWQtMjM4MDI3NDMxLmh0bWxcbiAqIEBzZWUgaHR0cHM6Ly9kZXZlbG9wZXIuYXRsYXNzaWFuLmNvbS9iaXRidWNrZXQvYXBpLzIvcmVmZXJlbmNlL21ldGEvYXV0aGVudGljYXRpb25cbiAqIEBzZWUgaHR0cHM6Ly9kZXZlbG9wZXIuYXRsYXNzaWFuLmNvbS9iaXRidWNrZXQvYXBpLzIvcmVmZXJlbmNlL3Jlc291cmNlL3JlcG9zaXRvcmllcy8lN0J1c2VybmFtZSU3RC8lN0JyZXBvX3NsdWclN0QvaXNzdWVzXG4gKiBAc2VlIGh0dHBzOi8vZGV2ZWxvcGVyLmF0bGFzc2lhbi5jb20vYml0YnVja2V0L2FwaS8yL3JlZmVyZW5jZS9yZXNvdXJjZS9yZXBvc2l0b3JpZXMvJTdCdXNlcm5hbWUlN0QvJTdCcmVwb19zbHVnJTdEL2lzc3Vlcy8lN0Jpc3N1ZV9pZCU3RC9jb21tZW50c1xuICogQHNlZSBodHRwczovL2RldmVsb3Blci5hdGxhc3NpYW4uY29tL2JpdGJ1Y2tldC9hcGkvMi9yZWZlcmVuY2UvcmVzb3VyY2UvcmVwb3NpdG9yaWVzLyU3QnVzZXJuYW1lJTdELyU3QnJlcG9fc2x1ZyU3RC9pc3N1ZXMvJTdCaXNzdWVfaWQlN0QvY29tbWVudHNcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQml0YnVja2V0VjIgaW1wbGVtZW50cyBWc3N1ZUFQSSB7XG4gIGJhc2VVUkw6IHN0cmluZ1xuICBvd25lcjogc3RyaW5nXG4gIHJlcG86IHN0cmluZ1xuICBjbGllbnRJZDogc3RyaW5nXG4gIGNsaWVudFNlY3JldDogc3RyaW5nXG4gIHN0YXRlOiBzdHJpbmdcbiAgJGh0dHA6IEF4aW9zSW5zdGFuY2VcblxuICBnZXQgcGxhdGZvcm0gKCkge1xuICAgIHJldHVybiAnYml0YnVja2V0J1xuICB9XG5cbiAgY29uc3RydWN0b3IgKHtcbiAgICBiYXNlVVJMID0gJ2h0dHBzOi8vYXBpLmJpdGJ1Y2tldC5vcmcvMi4wLycsXG4gICAgb3duZXIsXG4gICAgcmVwbyxcbiAgICBjbGllbnRJZCxcbiAgICBjbGllbnRTZWNyZXQsXG4gICAgc3RhdGUsXG4gIH06IFZzc3VlQVBJT3B0aW9ucykge1xuICAgIHRoaXMuYmFzZVVSTCA9IGJhc2VVUkxcbiAgICB0aGlzLm93bmVyID0gb3duZXJcbiAgICB0aGlzLnJlcG8gPSByZXBvXG5cbiAgICB0aGlzLmNsaWVudElkID0gY2xpZW50SWRcbiAgICB0aGlzLmNsaWVudFNlY3JldCA9IGNsaWVudFNlY3JldFxuICAgIHRoaXMuc3RhdGUgPSBzdGF0ZVxuXG4gICAgdGhpcy4kaHR0cCA9IGF4aW9zLmNyZWF0ZSh7XG4gICAgICBiYXNlVVJMLFxuICAgICAgaGVhZGVyczoge1xuICAgICAgICAnQWNjZXB0JzogJ2FwcGxpY2F0aW9uL2pzb24nLFxuICAgICAgfSxcbiAgICB9KVxuICB9XG5cbiAgcmVkaXJlY3RBdXRob3JpemUgKCkge1xuICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gYnVpbGRVUkwoJ2h0dHBzOi8vYml0YnVja2V0Lm9yZy9zaXRlL29hdXRoMi9hdXRob3JpemUnLCB7XG4gICAgICBjbGllbnRfaWQ6IHRoaXMuY2xpZW50SWQsXG4gICAgICByZWRpcmVjdF91cmk6IHdpbmRvdy5sb2NhdGlvbi5ocmVmLFxuICAgICAgcmVzcG9uc2VfdHlwZTogJ2NvZGUnLFxuICAgIH0pXG4gIH1cblxuICBhc3luYyBoYW5kbGVBdXRob3JpemUgKCkge1xuICAgIGNvbnN0IHF1ZXJ5ID0gcGFyc2VRdWVyeSh3aW5kb3cubG9jYXRpb24uc2VhcmNoKVxuICAgIGlmIChxdWVyeS5jb2RlKSB7XG4gICAgICBjb25zdCBjb2RlID0gcXVlcnkuY29kZVxuICAgICAgZGVsZXRlIHF1ZXJ5LmNvZGVcbiAgICAgIGNvbnN0IHJlcGxhY2VVUkwgPSBidWlsZFVSTChnZXRDbGVhblVSTCh3aW5kb3cubG9jYXRpb24uaHJlZiksIHF1ZXJ5KSArIHdpbmRvdy5sb2NhdGlvbi5oYXNoXG4gICAgICB3aW5kb3cuaGlzdG9yeS5yZXBsYWNlU3RhdGUobnVsbCwgJycsIHJlcGxhY2VVUkwpXG4gICAgICBjb25zdCBhY2Nlc3NUb2tlbiA9IGF3YWl0IHRoaXMuZ2V0QWNjZXNzVG9rZW4oeyBjb2RlIH0pXG4gICAgICByZXR1cm4gYWNjZXNzVG9rZW5cbiAgICB9XG4gICAgcmV0dXJuIG51bGxcbiAgfVxuXG4gIGFzeW5jIGdldEFjY2Vzc1Rva2VuICh7IGNvZGUgfSkge1xuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgdGhpcy4kaHR0cC5wb3N0KGBodHRwczovL2NvcnMtYW55d2hlcmUuaGVyb2t1YXBwLmNvbS8keydodHRwczovL2JpdGJ1Y2tldC5vcmcvc2l0ZS9vYXV0aDIvYWNjZXNzX3Rva2VuJ31gLCBidWlsZFF1ZXJ5KHtcbiAgICAgIGdyYW50X3R5cGU6ICdhdXRob3JpemF0aW9uX2NvZGUnLFxuICAgICAgcmVkaXJlY3RfdXJpOiB3aW5kb3cubG9jYXRpb24uaHJlZixcbiAgICAgIGNvZGUsXG4gICAgfSksIHtcbiAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnLFxuICAgICAgfSxcbiAgICAgIGF1dGg6IHtcbiAgICAgICAgdXNlcm5hbWU6IHRoaXMuY2xpZW50SWQsXG4gICAgICAgIHBhc3N3b3JkOiB0aGlzLmNsaWVudFNlY3JldCxcbiAgICAgIH0sXG4gICAgfSlcbiAgICBjb25zdCBhY2Nlc3NUb2tlbiA9IHJlc3BvbnNlLmRhdGEuYWNjZXNzX3Rva2VuXG4gICAgcmV0dXJuIGFjY2Vzc1Rva2VuXG4gIH1cblxuICBhc3luYyBnZXRVc2VyICh7IGFjY2Vzc1Rva2VuIH0pIHtcbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IHRoaXMuJGh0dHAuZ2V0KCcvdXNlcicsIHtcbiAgICAgIGhlYWRlcnM6IHsgJ0F1dGhvcml6YXRpb24nOiBgQmVhcmVyICR7YWNjZXNzVG9rZW59YCB9LFxuICAgIH0pXG4gICAgY29uc3QgdXNlciA9IHJlc3BvbnNlLmRhdGFcbiAgICByZXR1cm4gbm9ybWFsaXplVXNlcih1c2VyKVxuICB9XG5cbiAgYXN5bmMgZ2V0SXNzdWVzICgpIHtcbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IHRoaXMuJGh0dHAuZ2V0KGByZXBvc2l0b3JpZXMvJHt0aGlzLm93bmVyfS8ke3RoaXMucmVwb30vaXNzdWVzYCwge1xuICAgICAgcGFyYW1zOiB7XG4gICAgICAgIC8vIHRvIGF2b2lkIGNhY2hpbmdcbiAgICAgICAgdGltZXN0YW1wOiBEYXRlLm5vdygpLFxuICAgICAgfSxcbiAgICB9KVxuICAgIGNvbnN0IGlzc3VlcyA9IHJlc3BvbnNlLmRhdGEudmFsdWVzXG4gICAgcmV0dXJuIGlzc3Vlcy5tYXAobm9ybWFsaXplSXNzdWUpXG4gIH1cblxuICBhc3luYyBnZXRDb21tZW50cyAoeyBpc3N1ZUlkIH0pIHtcbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IHRoaXMuJGh0dHAuZ2V0KGByZXBvc2l0b3JpZXMvJHt0aGlzLm93bmVyfS8ke3RoaXMucmVwb30vaXNzdWVzLyR7aXNzdWVJZH0vY29tbWVudHNgLCB7XG4gICAgICBwYXJhbXM6IHtcbiAgICAgICAgLy8gdG8gYXZvaWQgY2FjaGluZ1xuICAgICAgICB0aW1lc3RhbXA6IERhdGUubm93KCksXG4gICAgICB9LFxuICAgICAgaGVhZGVyczoge1xuICAgICAgICAnQWNjZXB0JzogW1xuICAgICAgICAgICdhcHBsaWNhdGlvbi92bmQuZ2l0aHViLnYzLnJhdytqc29uJyxcbiAgICAgICAgICAnYXBwbGljYXRpb24vdm5kLmdpdGh1Yi52My5odG1sK2pzb24nLFxuICAgICAgICAgICdhcHBsaWNhdGlvbi92bmQuZ2l0aHViLnNxdWlycmVsLWdpcmwtcHJldmlldycsXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgIH0pXG4gICAgY29uc3QgY29tbWVudHMgPSByZXNwb25zZS5kYXRhLnZhbHVlc1xuICAgIHJldHVybiBjb21tZW50cy5tYXAobm9ybWFsaXplQ29tbWVudClcbiAgfVxuXG4gIGFzeW5jIGNyZWF0ZUlzc3VlICh7XG4gICAgdGl0bGUsXG4gICAgY29udGVudCxcbiAgICBhY2Nlc3NUb2tlbixcbiAgfSkge1xuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgdGhpcy4kaHR0cC5wb3N0KGByZXBvc2l0b3JpZXMvJHt0aGlzLm93bmVyfS8ke3RoaXMucmVwb30vaXNzdWVzYCwge1xuICAgICAgdGl0bGUsXG4gICAgICBjb250ZW50OiB7XG4gICAgICAgIHJhdzogY29udGVudCxcbiAgICAgIH0sXG4gICAgICBwcmlvcml0eTogJ3RyaXZpYWwnLFxuICAgICAgdHlwZTogJ3Rhc2snLFxuICAgIH0sIHtcbiAgICAgIGhlYWRlcnM6IHsgJ0F1dGhvcml6YXRpb24nOiBgQmVhcmVyICR7YWNjZXNzVG9rZW59YCB9LFxuICAgIH0pXG4gICAgY29uc3QgaXNzdWUgPSByZXNwb25zZS5kYXRhXG4gICAgcmV0dXJuIG5vcm1hbGl6ZUlzc3VlKGlzc3VlKVxuICB9XG5cbiAgYXN5bmMgY3JlYXRlSXNzdWVDb21tZW50ICh7XG4gICAgaXNzdWVJZCxcbiAgICBjb250ZW50LFxuICAgIGFjY2Vzc1Rva2VuLFxuICB9KSB7XG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCB0aGlzLiRodHRwLnBvc3QoYHJlcG9zaXRvcmllcy8ke3RoaXMub3duZXJ9LyR7dGhpcy5yZXBvfS9pc3N1ZXMvJHtpc3N1ZUlkfS9jb21tZW50c2AsIHtcbiAgICAgIGNvbnRlbnQ6IHtcbiAgICAgICAgcmF3OiBjb250ZW50LFxuICAgICAgfSxcbiAgICB9LCB7XG4gICAgICBoZWFkZXJzOiB7ICdBdXRob3JpemF0aW9uJzogYEJlYXJlciAke2FjY2Vzc1Rva2VufWAgfSxcbiAgICB9KVxuICAgIGNvbnN0IGNvbW1lbnQgPSByZXNwb25zZS5kYXRhXG4gICAgcmV0dXJuIG5vcm1hbGl6ZUNvbW1lbnQoY29tbWVudClcbiAgfVxuXG4gIGFzeW5jIGNyZWF0ZUlzc3VlUmVhY3Rpb24gKCkge1xuICAgIC8vIG5vIHN1cHBvcnRcbiAgfVxuXG4gIGFzeW5jIGNyZWF0ZUNvbW1lbnRSZWFjdGlvbiAoKSB7XG4gICAgLy8gbm8gc3VwcG9ydFxuICB9XG59XG5cbmZ1bmN0aW9uIG5vcm1hbGl6ZVVzZXIgKHVzZXIpOiBVc2VyIHtcbiAgcmV0dXJuIHtcbiAgICB1c2VybmFtZTogdXNlci51c2VybmFtZSxcbiAgICBhdmF0YXI6IHVzZXIubGlua3MuYXZhdGFyLmhyZWYsXG4gICAgaG9tZXBhZ2U6IHVzZXIubGlua3MuaHRtbC5ocmVmLFxuICB9XG59XG5cbmZ1bmN0aW9uIG5vcm1hbGl6ZUlzc3VlIChpc3N1ZSk6IElzc3VlIHtcbiAgcmV0dXJuIHtcbiAgICBpZDogaXNzdWUuaWQsXG4gICAgdGl0bGU6IGlzc3VlLnRpdGxlLFxuICAgIGNvbnRlbnQ6IGlzc3VlLmNvbnRlbnQucmF3LFxuICAgIGNvbW1lbnRzQ291bnQ6IG51bGwsXG4gIH1cbn1cblxuZnVuY3Rpb24gbm9ybWFsaXplQ29tbWVudCAoY29tbWVudDogYW55KTogQ29tbWVudCB7XG4gIHJldHVybiB7XG4gICAgaWQ6IGNvbW1lbnQuaWQsXG4gICAgY29udGVudDogY29tbWVudC5jb250ZW50Lmh0bWwsXG4gICAgY29udGVudFJhdzogY29tbWVudC5jb250ZW50LnJhdyxcbiAgICBhdXRob3I6IG5vcm1hbGl6ZVVzZXIoY29tbWVudC51c2VyKSxcbiAgICBjcmVhdGVkQXQ6IGNvbW1lbnQuY3JlYXRlZF9vbixcbiAgICB1cGRhdGVkQXQ6IGNvbW1lbnQudXBkYXRlZF9vbixcbiAgICByZWFjdGlvbnM6IG51bGwsXG4gIH1cbn1cbiJdfQ==