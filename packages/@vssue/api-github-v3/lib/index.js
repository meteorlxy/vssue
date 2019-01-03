import * as tslib_1 from "tslib";
import { buildURL, getCleanURL, parseQuery, } from '@vssue/utils';
import axios from 'axios';
/**
 * Github API v3
 *
 * @see https://developer.github.com/apps/building-oauth-apps/authorizing-oauth-apps/
 * @see https://developer.github.com/v3/issues/
 * @see https://developer.github.com/v3/issues/comments/
 * @see https://developer.github.com/v3/reactions/
 */
var GithubV3 = /** @class */ (function () {
    function GithubV3(_a) {
        var _b = _a.baseURL, baseURL = _b === void 0 ? 'https://api.github.com' : _b, owner = _a.owner, repo = _a.repo, labels = _a.labels, clientId = _a.clientId, clientSecret = _a.clientSecret, state = _a.state;
        this.baseURL = baseURL;
        this.owner = owner;
        this.repo = repo;
        this.labels = labels;
        this.clientId = clientId;
        this.clientSecret = clientSecret;
        this.state = state;
        this.$http = axios.create({
            baseURL: baseURL,
            headers: {
                'Accept': 'application/vnd.github.v3+json',
            },
        });
        this.$http.interceptors.response.use(function (response) {
            if (response.data.error) {
                return Promise.reject(response.data.error_description);
            }
            return response;
        });
    }
    Object.defineProperty(GithubV3.prototype, "platform", {
        get: function () {
            return 'github';
        },
        enumerable: true,
        configurable: true
    });
    GithubV3.prototype.redirectAuthorize = function () {
        window.location.href = buildURL('https://github.com/login/oauth/authorize', {
            client_id: this.clientId,
            redirect_uri: window.location.href,
            scope: 'public_repo',
            state: this.state,
        });
    };
    GithubV3.prototype.handleAuthorize = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var query, code, replaceURL, accessToken;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        query = parseQuery(window.location.search);
                        if (!query.code) return [3 /*break*/, 2];
                        if (query.state !== this.state) {
                            return [2 /*return*/, null];
                        }
                        code = query.code;
                        delete query.code;
                        delete query.state;
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
    GithubV3.prototype.getAccessToken = function (_a) {
        var code = _a.code;
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var response, accessToken;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.$http.post("https://cors-anywhere.herokuapp.com/" + 'https://github.com/login/oauth/access_token', {
                            client_id: this.clientId,
                            client_secret: this.clientSecret,
                            code: code,
                        }, {
                            headers: {
                                'Accept': 'application/json',
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
    GithubV3.prototype.getUser = function (_a) {
        var accessToken = _a.accessToken;
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var response, user;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.$http.get('/user', {
                            headers: { 'Authorization': "token " + accessToken },
                        })];
                    case 1:
                        response = _b.sent();
                        user = response.data;
                        return [2 /*return*/, normalizeUser(user)];
                }
            });
        });
    };
    GithubV3.prototype.getIssues = function (_a) {
        var accessToken = _a.accessToken;
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var options, response, issues;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        options = {
                            params: {
                                labels: this.labels,
                                // to avoid caching
                                timestamp: Date.now(),
                            },
                        };
                        if (accessToken) {
                            options.headers = {
                                'Authorization': "token " + accessToken,
                            };
                        }
                        return [4 /*yield*/, this.$http.get("repos/" + this.owner + "/" + this.repo + "/issues", options)];
                    case 1:
                        response = _b.sent();
                        issues = response.data;
                        return [2 /*return*/, issues.map(normalizeIssue)];
                }
            });
        });
    };
    GithubV3.prototype.getComments = function (_a) {
        var issueId = _a.issueId, accessToken = _a.accessToken;
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var options, response, comments;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        options = {
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
                        };
                        if (accessToken) {
                            options.headers['Authorization'] = "token " + accessToken;
                        }
                        return [4 /*yield*/, this.$http.get("repos/" + this.owner + "/" + this.repo + "/issues/" + issueId + "/comments", options)];
                    case 1:
                        response = _b.sent();
                        comments = response.data;
                        return [2 /*return*/, comments.map(normalizeComment)];
                }
            });
        });
    };
    GithubV3.prototype.createIssue = function (_a) {
        var title = _a.title, content = _a.content, accessToken = _a.accessToken;
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var response, issue;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.$http.post("repos/" + this.owner + "/" + this.repo + "/issues", {
                            title: title,
                            body: content,
                            labels: this.labels.split(','),
                        }, {
                            headers: { 'Authorization': "token " + accessToken },
                        })];
                    case 1:
                        response = _b.sent();
                        issue = response.data;
                        return [2 /*return*/, normalizeIssue(issue)];
                }
            });
        });
    };
    GithubV3.prototype.createIssueComment = function (_a) {
        var issueId = _a.issueId, content = _a.content, accessToken = _a.accessToken;
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var response, comment;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.$http.post("repos/" + this.owner + "/" + this.repo + "/issues/" + issueId + "/comments", {
                            body: content,
                        }, {
                            headers: { 'Authorization': "token " + accessToken },
                        })];
                    case 1:
                        response = _b.sent();
                        comment = response.data;
                        return [2 /*return*/, normalizeComment(comment)];
                }
            });
        });
    };
    GithubV3.prototype.createIssueReaction = function (_a) {
        var issueId = _a.issueId, reaction = _a.reaction, accessToken = _a.accessToken;
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var e_1;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.$http.post("repos/" + this.owner + "/" + this.repo + "/issues/" + issueId + "/reactions", {
                                content: reaction,
                            }, {
                                headers: { 'Authorization': "token " + accessToken },
                            })];
                    case 1:
                        _b.sent();
                        return [2 /*return*/, true];
                    case 2:
                        e_1 = _b.sent();
                        return [2 /*return*/, false];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    GithubV3.prototype.createCommentReaction = function (_a) {
        var commentId = _a.commentId, reaction = _a.reaction, accessToken = _a.accessToken;
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var e_2;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.$http.post("repos/" + this.owner + "/" + this.repo + "/issues/comments/" + commentId + "/reactions", {
                                content: reaction,
                            }, {
                                headers: {
                                    'Authorization': "token " + accessToken,
                                    'Accept': 'application/vnd.github.squirrel-girl-preview',
                                },
                            })];
                    case 1:
                        _b.sent();
                        return [2 /*return*/, true];
                    case 2:
                        e_2 = _b.sent();
                        return [2 /*return*/, false];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return GithubV3;
}());
export default GithubV3;
function normalizeUser(user) {
    return {
        username: user.login,
        avatar: user.avatar_url,
        homepage: user.html_url,
    };
}
function normalizeIssue(issue) {
    return {
        id: issue.number,
        title: issue.title,
        content: issue.body,
        commentsCount: issue.comments,
    };
}
function normalizeComment(comment) {
    return {
        id: comment.id,
        content: comment.body_html,
        contentRaw: comment.body,
        author: normalizeUser(comment.user),
        createdAt: comment.created_at,
        updatedAt: comment.updated_at,
        reactions: comment.reactions,
    };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQVNBLE9BQU8sRUFDTCxRQUFRLEVBQ1IsV0FBVyxFQUNYLFVBQVUsR0FDWCxNQUFNLGNBQWMsQ0FBQTtBQUVyQixPQUFPLEtBR04sTUFBTSxPQUFPLENBQUE7QUFFZDs7Ozs7OztHQU9HO0FBQ0g7SUFjRSxrQkFBYSxFQVFLO1lBUGhCLGVBQWtDLEVBQWxDLHVEQUFrQyxFQUNsQyxnQkFBSyxFQUNMLGNBQUksRUFDSixrQkFBTSxFQUNOLHNCQUFRLEVBQ1IsOEJBQVksRUFDWixnQkFBSztRQUVMLElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFBO1FBQ3RCLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFBO1FBQ2xCLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFBO1FBQ2hCLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFBO1FBRXBCLElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFBO1FBQ3hCLElBQUksQ0FBQyxZQUFZLEdBQUcsWUFBWSxDQUFBO1FBQ2hDLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFBO1FBRWxCLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQztZQUN4QixPQUFPLFNBQUE7WUFDUCxPQUFPLEVBQUU7Z0JBQ1AsUUFBUSxFQUFFLGdDQUFnQzthQUMzQztTQUNGLENBQUMsQ0FBQTtRQUVGLElBQUksQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsVUFBVSxRQUFRO1lBQ3JELElBQUksUUFBUSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUU7Z0JBQ3ZCLE9BQU8sT0FBTyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUE7YUFDdkQ7WUFDRCxPQUFPLFFBQVEsQ0FBQTtRQUNqQixD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QUFTLGdCQUFnQixDQUFFLE9BQVk7SUFDckMsT0FBTztRQUNMLEVBQUUsRUFBRSxPQUFPLENBQUMsRUFBRTtRQUNkLE9BQU8sRUFBRSxPQUFPLENBQUMsU0FBUztRQUMxQixVQUFVLEVBQUUsT0FBTyxDQUFDLElBQUk7UUFDeEIsTUFBTSxFQUFFLGFBQWEsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDO1FBQ25DLFNBQVMsRUFBRSxPQUFPLENBQUMsVUFBVTtRQUM3QixTQUFTLEVBQUUsT0FBTyxDQUFDLFVBQVU7UUFDN0IsU0FBUyxFQUFhLE9BQU8sQ0FBQyxTQUFTO0tBQ3hDLENBQUE7QUFDSCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgVXNlcixcbiAgSXNzdWUsXG4gIENvbW1lbnQsXG4gIFJlYWN0aW9ucyxcbiAgVnNzdWVBUEksXG4gIFZzc3VlQVBJT3B0aW9ucyxcbn0gZnJvbSAndnNzdWUnXG5cbmltcG9ydCB7XG4gIGJ1aWxkVVJMLFxuICBnZXRDbGVhblVSTCxcbiAgcGFyc2VRdWVyeSxcbn0gZnJvbSAnQHZzc3VlL3V0aWxzJ1xuXG5pbXBvcnQgYXhpb3MsIHtcbiAgQXhpb3NJbnN0YW5jZSxcbiAgQXhpb3NSZXF1ZXN0Q29uZmlnLFxufSBmcm9tICdheGlvcydcblxuLyoqXG4gKiBHaXRodWIgQVBJIHYzXG4gKlxuICogQHNlZSBodHRwczovL2RldmVsb3Blci5naXRodWIuY29tL2FwcHMvYnVpbGRpbmctb2F1dGgtYXBwcy9hdXRob3JpemluZy1vYXV0aC1hcHBzL1xuICogQHNlZSBodHRwczovL2RldmVsb3Blci5naXRodWIuY29tL3YzL2lzc3Vlcy9cbiAqIEBzZWUgaHR0cHM6Ly9kZXZlbG9wZXIuZ2l0aHViLmNvbS92My9pc3N1ZXMvY29tbWVudHMvXG4gKiBAc2VlIGh0dHBzOi8vZGV2ZWxvcGVyLmdpdGh1Yi5jb20vdjMvcmVhY3Rpb25zL1xuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBHaXRodWJWMyBpbXBsZW1lbnRzIFZzc3VlQVBJIHtcbiAgYmFzZVVSTDogc3RyaW5nXG4gIG93bmVyOiBzdHJpbmdcbiAgcmVwbzogc3RyaW5nXG4gIGxhYmVsczogc3RyaW5nXG4gIGNsaWVudElkOiBzdHJpbmdcbiAgY2xpZW50U2VjcmV0OiBzdHJpbmdcbiAgc3RhdGU6IHN0cmluZ1xuICAkaHR0cDogQXhpb3NJbnN0YW5jZVxuXG4gIGdldCBwbGF0Zm9ybSAoKSB7XG4gICAgcmV0dXJuICdnaXRodWInXG4gIH1cblxuICBjb25zdHJ1Y3RvciAoe1xuICAgIGJhc2VVUkwgPSAnaHR0cHM6Ly9hcGkuZ2l0aHViLmNvbScsXG4gICAgb3duZXIsXG4gICAgcmVwbyxcbiAgICBsYWJlbHMsXG4gICAgY2xpZW50SWQsXG4gICAgY2xpZW50U2VjcmV0LFxuICAgIHN0YXRlLFxuICB9OiBWc3N1ZUFQSU9wdGlvbnMpIHtcbiAgICB0aGlzLmJhc2VVUkwgPSBiYXNlVVJMXG4gICAgdGhpcy5vd25lciA9IG93bmVyXG4gICAgdGhpcy5yZXBvID0gcmVwb1xuICAgIHRoaXMubGFiZWxzID0gbGFiZWxzXG5cbiAgICB0aGlzLmNsaWVudElkID0gY2xpZW50SWRcbiAgICB0aGlzLmNsaWVudFNlY3JldCA9IGNsaWVudFNlY3JldFxuICAgIHRoaXMuc3RhdGUgPSBzdGF0ZVxuXG4gICAgdGhpcy4kaHR0cCA9IGF4aW9zLmNyZWF0ZSh7XG4gICAgICBiYXNlVVJMLFxuICAgICAgaGVhZGVyczoge1xuICAgICAgICAnQWNjZXB0JzogJ2FwcGxpY2F0aW9uL3ZuZC5naXRodWIudjMranNvbicsXG4gICAgICB9LFxuICAgIH0pXG5cbiAgICB0aGlzLiRodHRwLmludGVyY2VwdG9ycy5yZXNwb25zZS51c2UoZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICBpZiAocmVzcG9uc2UuZGF0YS5lcnJvcikge1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QocmVzcG9uc2UuZGF0YS5lcnJvcl9kZXNjcmlwdGlvbilcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXNwb25zZVxuICAgIH0pXG4gIH1cblxuICByZWRpcmVjdEF1dGhvcml6ZSAoKSB7XG4gICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSBidWlsZFVSTCgnaHR0cHM6Ly9naXRodWIuY29tL2xvZ2luL29hdXRoL2F1dGhvcml6ZScsIHtcbiAgICAgIGNsaWVudF9pZDogdGhpcy5jbGllbnRJZCxcbiAgICAgIHJlZGlyZWN0X3VyaTogd2luZG93LmxvY2F0aW9uLmhyZWYsXG4gICAgICBzY29wZTogJ3B1YmxpY19yZXBvJyxcbiAgICAgIHN0YXRlOiB0aGlzLnN0YXRlLFxuICAgIH0pXG4gIH1cblxuICBhc3luYyBoYW5kbGVBdXRob3JpemUgKCkge1xuICAgIGNvbnN0IHF1ZXJ5ID0gcGFyc2VRdWVyeSh3aW5kb3cubG9jYXRpb24uc2VhcmNoKVxuICAgIGlmIChxdWVyeS5jb2RlKSB7XG4gICAgICBpZiAocXVlcnkuc3RhdGUgIT09IHRoaXMuc3RhdGUpIHtcbiAgICAgICAgcmV0dXJuIG51bGxcbiAgICAgIH1cbiAgICAgIGNvbnN0IGNvZGUgPSBxdWVyeS5jb2RlXG4gICAgICBkZWxldGUgcXVlcnkuY29kZVxuICAgICAgZGVsZXRlIHF1ZXJ5LnN0YXRlXG4gICAgICBjb25zdCByZXBsYWNlVVJMID0gYnVpbGRVUkwoZ2V0Q2xlYW5VUkwod2luZG93LmxvY2F0aW9uLmhyZWYpLCBxdWVyeSkgKyB3aW5kb3cubG9jYXRpb24uaGFzaFxuICAgICAgd2luZG93Lmhpc3RvcnkucmVwbGFjZVN0YXRlKG51bGwsICcnLCByZXBsYWNlVVJMKVxuICAgICAgY29uc3QgYWNjZXNzVG9rZW4gPSBhd2FpdCB0aGlzLmdldEFjY2Vzc1Rva2VuKHsgY29kZSB9KVxuICAgICAgcmV0dXJuIGFjY2Vzc1Rva2VuXG4gICAgfVxuICAgIHJldHVybiBudWxsXG4gIH1cblxuICBhc3luYyBnZXRBY2Nlc3NUb2tlbiAoeyBjb2RlIH0pIHtcbiAgICAvKipcbiAgICAgKiBhY2Nlc3NfdG9rZW4gYXBpIGRvZXMgbm90IHN1cHBvcnQgY29yc1xuICAgICAqIEBzZWUgaHR0cHM6Ly9naXRodWIuY29tL2lzYWFjcy9naXRodWIvaXNzdWVzLzMzMFxuICAgICAqL1xuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgdGhpcy4kaHR0cC5wb3N0KGBodHRwczovL2NvcnMtYW55d2hlcmUuaGVyb2t1YXBwLmNvbS8keydodHRwczovL2dpdGh1Yi5jb20vbG9naW4vb2F1dGgvYWNjZXNzX3Rva2VuJ31gLCB7XG4gICAgICBjbGllbnRfaWQ6IHRoaXMuY2xpZW50SWQsXG4gICAgICBjbGllbnRfc2VjcmV0OiB0aGlzLmNsaWVudFNlY3JldCxcbiAgICAgIGNvZGUsXG4gICAgICAvKipcbiAgICAgICAqIHVzZWxlc3MgYnV0IG1lbnRpb25lZCBpbiBkb2NzXG4gICAgICAgKiBAc2VlIGh0dHBzOi8vZGV2ZWxvcGVyLmdpdGh1Yi5jb20vYXBwcy9idWlsZGluZy1vYXV0aC1hcHBzL2F1dGhvcml6aW5nLW9hdXRoLWFwcHMvIzItdXNlcnMtYXJlLXJlZGlyZWN0ZWQtYmFjay10by15b3VyLXNpdGUtYnktZ2l0aHViXG4gICAgICAgKi9cbiAgICAgIC8vIHJlZGlyZWN0X3VyaTogd2luZG93LmxvY2F0aW9uLmhyZWYsXG4gICAgICAvLyBzdGF0ZTogdGhpcy5zdGF0ZVxuICAgIH0sIHtcbiAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgJ0FjY2VwdCc6ICdhcHBsaWNhdGlvbi9qc29uJyxcbiAgICAgIH0sXG4gICAgfSlcbiAgICBjb25zdCBhY2Nlc3NUb2tlbiA9IHJlc3BvbnNlLmRhdGEuYWNjZXNzX3Rva2VuXG4gICAgcmV0dXJuIGFjY2Vzc1Rva2VuXG4gIH1cblxuICBhc3luYyBnZXRVc2VyICh7IGFjY2Vzc1Rva2VuIH0pIHtcbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IHRoaXMuJGh0dHAuZ2V0KCcvdXNlcicsIHtcbiAgICAgIGhlYWRlcnM6IHsgJ0F1dGhvcml6YXRpb24nOiBgdG9rZW4gJHthY2Nlc3NUb2tlbn1gIH0sXG4gICAgfSlcbiAgICBjb25zdCB1c2VyID0gcmVzcG9uc2UuZGF0YVxuICAgIHJldHVybiBub3JtYWxpemVVc2VyKHVzZXIpXG4gIH1cblxuICBhc3luYyBnZXRJc3N1ZXMgKHsgYWNjZXNzVG9rZW4gfSkge1xuICAgIGNvbnN0IG9wdGlvbnM6IEF4aW9zUmVxdWVzdENvbmZpZyA9IHtcbiAgICAgIHBhcmFtczoge1xuICAgICAgICBsYWJlbHM6IHRoaXMubGFiZWxzLFxuICAgICAgICAvLyB0byBhdm9pZCBjYWNoaW5nXG4gICAgICAgIHRpbWVzdGFtcDogRGF0ZS5ub3coKSxcbiAgICAgIH0sXG4gICAgfVxuICAgIGlmIChhY2Nlc3NUb2tlbikge1xuICAgICAgb3B0aW9ucy5oZWFkZXJzID0ge1xuICAgICAgICAnQXV0aG9yaXphdGlvbic6IGB0b2tlbiAke2FjY2Vzc1Rva2VufWAsXG4gICAgICB9XG4gICAgfVxuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgdGhpcy4kaHR0cC5nZXQoYHJlcG9zLyR7dGhpcy5vd25lcn0vJHt0aGlzLnJlcG99L2lzc3Vlc2AsIG9wdGlvbnMpXG4gICAgY29uc3QgaXNzdWVzID0gcmVzcG9uc2UuZGF0YVxuICAgIHJldHVybiBpc3N1ZXMubWFwKG5vcm1hbGl6ZUlzc3VlKVxuICB9XG5cbiAgYXN5bmMgZ2V0Q29tbWVudHMgKHsgaXNzdWVJZCwgYWNjZXNzVG9rZW4gfSkge1xuICAgIGNvbnN0IG9wdGlvbnMgPSB7XG4gICAgICBwYXJhbXM6IHtcbiAgICAgICAgLy8gdG8gYXZvaWQgY2FjaGluZ1xuICAgICAgICB0aW1lc3RhbXA6IERhdGUubm93KCksXG4gICAgICB9LFxuICAgICAgaGVhZGVyczoge1xuICAgICAgICAnQWNjZXB0JzogW1xuICAgICAgICAgICdhcHBsaWNhdGlvbi92bmQuZ2l0aHViLnYzLnJhdytqc29uJyxcbiAgICAgICAgICAnYXBwbGljYXRpb24vdm5kLmdpdGh1Yi52My5odG1sK2pzb24nLFxuICAgICAgICAgICdhcHBsaWNhdGlvbi92bmQuZ2l0aHViLnNxdWlycmVsLWdpcmwtcHJldmlldycsXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgIH1cbiAgICBpZiAoYWNjZXNzVG9rZW4pIHtcbiAgICAgIG9wdGlvbnMuaGVhZGVyc1snQXV0aG9yaXphdGlvbiddID0gYHRva2VuICR7YWNjZXNzVG9rZW59YFxuICAgIH1cbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IHRoaXMuJGh0dHAuZ2V0KGByZXBvcy8ke3RoaXMub3duZXJ9LyR7dGhpcy5yZXBvfS9pc3N1ZXMvJHtpc3N1ZUlkfS9jb21tZW50c2AsIG9wdGlvbnMpXG4gICAgY29uc3QgY29tbWVudHMgPSByZXNwb25zZS5kYXRhXG4gICAgcmV0dXJuIGNvbW1lbnRzLm1hcChub3JtYWxpemVDb21tZW50KVxuICB9XG5cbiAgYXN5bmMgY3JlYXRlSXNzdWUgKHtcbiAgICB0aXRsZSxcbiAgICBjb250ZW50LFxuICAgIGFjY2Vzc1Rva2VuLFxuICB9KSB7XG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCB0aGlzLiRodHRwLnBvc3QoYHJlcG9zLyR7dGhpcy5vd25lcn0vJHt0aGlzLnJlcG99L2lzc3Vlc2AsIHtcbiAgICAgIHRpdGxlLFxuICAgICAgYm9keTogY29udGVudCxcbiAgICAgIGxhYmVsczogdGhpcy5sYWJlbHMuc3BsaXQoJywnKSxcbiAgICB9LCB7XG4gICAgICBoZWFkZXJzOiB7ICdBdXRob3JpemF0aW9uJzogYHRva2VuICR7YWNjZXNzVG9rZW59YCB9LFxuICAgIH0pXG4gICAgY29uc3QgaXNzdWUgPSByZXNwb25zZS5kYXRhXG4gICAgcmV0dXJuIG5vcm1hbGl6ZUlzc3VlKGlzc3VlKVxuICB9XG5cbiAgYXN5bmMgY3JlYXRlSXNzdWVDb21tZW50ICh7XG4gICAgaXNzdWVJZCxcbiAgICBjb250ZW50LFxuICAgIGFjY2Vzc1Rva2VuLFxuICB9KSB7XG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCB0aGlzLiRodHRwLnBvc3QoYHJlcG9zLyR7dGhpcy5vd25lcn0vJHt0aGlzLnJlcG99L2lzc3Vlcy8ke2lzc3VlSWR9L2NvbW1lbnRzYCwge1xuICAgICAgYm9keTogY29udGVudCxcbiAgICB9LCB7XG4gICAgICBoZWFkZXJzOiB7ICdBdXRob3JpemF0aW9uJzogYHRva2VuICR7YWNjZXNzVG9rZW59YCB9LFxuICAgIH0pXG4gICAgY29uc3QgY29tbWVudCA9IHJlc3BvbnNlLmRhdGFcbiAgICByZXR1cm4gbm9ybWFsaXplQ29tbWVudChjb21tZW50KVxuICB9XG5cbiAgYXN5bmMgY3JlYXRlSXNzdWVSZWFjdGlvbiAoe1xuICAgIGlzc3VlSWQsXG4gICAgcmVhY3Rpb24sXG4gICAgYWNjZXNzVG9rZW4sXG4gIH0pIHtcbiAgICB0cnkge1xuICAgICAgYXdhaXQgdGhpcy4kaHR0cC5wb3N0KGByZXBvcy8ke3RoaXMub3duZXJ9LyR7dGhpcy5yZXBvfS9pc3N1ZXMvJHtpc3N1ZUlkfS9yZWFjdGlvbnNgLCB7XG4gICAgICAgIGNvbnRlbnQ6IHJlYWN0aW9uLFxuICAgICAgfSwge1xuICAgICAgICBoZWFkZXJzOiB7ICdBdXRob3JpemF0aW9uJzogYHRva2VuICR7YWNjZXNzVG9rZW59YCB9LFxuICAgICAgfSlcbiAgICAgIHJldHVybiB0cnVlXG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgcmV0dXJuIGZhbHNlXG4gICAgfVxuICB9XG5cbiAgYXN5bmMgY3JlYXRlQ29tbWVudFJlYWN0aW9uICh7XG4gICAgY29tbWVudElkLFxuICAgIHJlYWN0aW9uLFxuICAgIGFjY2Vzc1Rva2VuLFxuICB9KSB7XG4gICAgdHJ5IHtcbiAgICAgIGF3YWl0IHRoaXMuJGh0dHAucG9zdChgcmVwb3MvJHt0aGlzLm93bmVyfS8ke3RoaXMucmVwb30vaXNzdWVzL2NvbW1lbnRzLyR7Y29tbWVudElkfS9yZWFjdGlvbnNgLCB7XG4gICAgICAgIGNvbnRlbnQ6IHJlYWN0aW9uLFxuICAgICAgfSwge1xuICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgJ0F1dGhvcml6YXRpb24nOiBgdG9rZW4gJHthY2Nlc3NUb2tlbn1gLFxuICAgICAgICAgICdBY2NlcHQnOiAnYXBwbGljYXRpb24vdm5kLmdpdGh1Yi5zcXVpcnJlbC1naXJsLXByZXZpZXcnLFxuICAgICAgICB9LFxuICAgICAgfSlcbiAgICAgIHJldHVybiB0cnVlXG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgcmV0dXJuIGZhbHNlXG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIG5vcm1hbGl6ZVVzZXIgKHVzZXI6IGFueSk6IFVzZXIge1xuICByZXR1cm4ge1xuICAgIHVzZXJuYW1lOiB1c2VyLmxvZ2luLFxuICAgIGF2YXRhcjogdXNlci5hdmF0YXJfdXJsLFxuICAgIGhvbWVwYWdlOiB1c2VyLmh0bWxfdXJsLFxuICB9XG59XG5cbmZ1bmN0aW9uIG5vcm1hbGl6ZUlzc3VlIChpc3N1ZTogYW55KTogSXNzdWUge1xuICByZXR1cm4ge1xuICAgIGlkOiBpc3N1ZS5udW1iZXIsXG4gICAgdGl0bGU6IGlzc3VlLnRpdGxlLFxuICAgIGNvbnRlbnQ6IGlzc3VlLmJvZHksXG4gICAgY29tbWVudHNDb3VudDogaXNzdWUuY29tbWVudHMsXG4gIH1cbn1cblxuZnVuY3Rpb24gbm9ybWFsaXplQ29tbWVudCAoY29tbWVudDogYW55KTogQ29tbWVudCB7XG4gIHJldHVybiB7XG4gICAgaWQ6IGNvbW1lbnQuaWQsXG4gICAgY29udGVudDogY29tbWVudC5ib2R5X2h0bWwsXG4gICAgY29udGVudFJhdzogY29tbWVudC5ib2R5LFxuICAgIGF1dGhvcjogbm9ybWFsaXplVXNlcihjb21tZW50LnVzZXIpLFxuICAgIGNyZWF0ZWRBdDogY29tbWVudC5jcmVhdGVkX2F0LFxuICAgIHVwZGF0ZWRBdDogY29tbWVudC51cGRhdGVkX2F0LFxuICAgIHJlYWN0aW9uczogPFJlYWN0aW9ucz5jb21tZW50LnJlYWN0aW9ucyxcbiAgfVxufVxuIl19