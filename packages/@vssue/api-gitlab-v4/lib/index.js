import * as tslib_1 from "tslib";
import { buildURL, concatURL, getCleanURL, parseQuery, } from '@vssue/utils';
import axios from 'axios';
/**
 * @see https://docs.gitlab.com/ce/api/oauth2.html
 * @see https://docs.gitlab.com/ce/api/issues.html
 * @see https://docs.gitlab.com/ce/api/notes.html
 * @see https://docs.gitlab.com/ce/api/award_emoji.html
 */
var GitlabV4 = /** @class */ (function () {
    function GitlabV4(_a) {
        var _b = _a.baseURL, baseURL = _b === void 0 ? 'https://gitlab.com' : _b, owner = _a.owner, repo = _a.repo, labels = _a.labels, clientId = _a.clientId, clientSecret = _a.clientSecret, state = _a.state;
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
                'Accept': 'application/json',
            },
        });
    }
    Object.defineProperty(GitlabV4.prototype, "platform", {
        get: function () {
            return 'gitlab';
        },
        enumerable: true,
        configurable: true
    });
    GitlabV4.prototype.redirectAuthorize = function () {
        window.location.href = buildURL(concatURL(this.baseURL, 'oauth/authorize'), {
            client_id: this.clientId,
            redirect_uri: window.location.href,
            response_type: 'code',
            state: this.state,
        });
    };
    GitlabV4.prototype.handleAuthorize = function () {
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
                        replaceURL = buildURL(getCleanURL(), query) + window.location.hash;
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
    GitlabV4.prototype.getAccessToken = function (_a) {
        var code = _a.code;
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var response, accessToken;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.$http.post("https://cors-anywhere.herokuapp.com/" + concatURL(this.baseURL, 'oauth/token'), {
                            client_id: this.clientId,
                            client_secret: this.clientSecret,
                            code: code,
                            grant_type: 'authorization_code',
                            redirect_uri: window.location.href,
                        })];
                    case 1:
                        response = _b.sent();
                        accessToken = response.data.access_token;
                        return [2 /*return*/, accessToken];
                }
            });
        });
    };
    GitlabV4.prototype.getUser = function (_a) {
        var accessToken = _a.accessToken;
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var response, user;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.$http.get('api/v4/user', {
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
    GitlabV4.prototype.getIssues = function (_a) {
        var accessToken = _a.accessToken;
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var response, issues;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.$http.get("api/v4/projects/" + this.repo + "/issues", {
                            params: {
                                labels: this.labels,
                            },
                            headers: { 'Authorization': "Bearer " + accessToken },
                        })];
                    case 1:
                        response = _b.sent();
                        issues = response.data;
                        return [2 /*return*/, issues.map(normalizeIssue)];
                }
            });
        });
    };
    GitlabV4.prototype.getComments = function (_a) {
        var issueId = _a.issueId, accessToken = _a.accessToken;
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var e_1, _b, response, comments, comments_1, comments_1_1, comment, _c, e_1_1;
            return tslib_1.__generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, this.$http.get("api/v4/projects/" + this.repo + "/issues/" + issueId + "/notes", {
                            params: {},
                            headers: { 'Authorization': "Bearer " + accessToken },
                        })];
                    case 1:
                        response = _d.sent();
                        comments = response.data;
                        _d.label = 2;
                    case 2:
                        _d.trys.push([2, 7, 8, 9]);
                        comments_1 = tslib_1.__values(comments), comments_1_1 = comments_1.next();
                        _d.label = 3;
                    case 3:
                        if (!!comments_1_1.done) return [3 /*break*/, 6];
                        comment = comments_1_1.value;
                        _c = comment;
                        return [4 /*yield*/, this.getMarkdownContent({ contentRaw: comment.body })];
                    case 4:
                        _c.body_html = _d.sent();
                        _d.label = 5;
                    case 5:
                        comments_1_1 = comments_1.next();
                        return [3 /*break*/, 3];
                    case 6: return [3 /*break*/, 9];
                    case 7:
                        e_1_1 = _d.sent();
                        e_1 = { error: e_1_1 };
                        return [3 /*break*/, 9];
                    case 8:
                        try {
                            if (comments_1_1 && !comments_1_1.done && (_b = comments_1.return)) _b.call(comments_1);
                        }
                        finally { if (e_1) throw e_1.error; }
                        return [7 /*endfinally*/];
                    case 9: return [2 /*return*/, comments.map(normalizeComment)];
                }
            });
        });
    };
    GitlabV4.prototype.createIssue = function (_a) {
        var title = _a.title, content = _a.content, accessToken = _a.accessToken;
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var response, issue;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.$http.post("api/v4/projects/" + this.repo + "/issues", {
                            title: title,
                            description: content,
                            labels: this.labels,
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
    GitlabV4.prototype.createIssueComment = function (_a) {
        var issueId = _a.issueId, content = _a.content, accessToken = _a.accessToken;
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var response, comment;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.$http.post("api/v4/projects/" + this.repo + "/issues/" + issueId + "/notes", {
                            body: content,
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
    GitlabV4.prototype.createIssueReaction = function (_a) {
        var issueId = _a.issueId, reaction = _a.reaction, accessToken = _a.accessToken;
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var e_2;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.$http.post("api/v4/projects/" + this.repo + "/issues/" + issueId + "/award_emoji", {
                                name: normalizeReaction(reaction),
                            }, {
                                headers: { 'Authorization': "Bearer " + accessToken },
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
    GitlabV4.prototype.createCommentReaction = function (_a) {
        var issueId = _a.issueId, commentId = _a.commentId, reaction = _a.reaction, accessToken = _a.accessToken;
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var e_3;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.$http.post("api/v4/projects/" + this.repo + "/issues/" + issueId + "/notes/" + commentId + "/award_emoji", {
                                name: normalizeReaction(reaction),
                            }, {
                                headers: {
                                    'Authorization': "Bearer " + accessToken,
                                },
                            })];
                    case 1:
                        _b.sent();
                        return [2 /*return*/, true];
                    case 2:
                        e_3 = _b.sent();
                        return [2 /*return*/, false];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    GitlabV4.prototype.getMarkdownContent = function (_a) {
        var contentRaw = _a.contentRaw;
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var response, content;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.$http.post("api/v4/markdown", {
                            text: contentRaw,
                        })];
                    case 1:
                        response = _b.sent();
                        content = response.data.html;
                        return [2 /*return*/, content];
                }
            });
        });
    };
    return GitlabV4;
}());
export default GitlabV4;
function normalizeUser(user) {
    return {
        username: user.username,
        avatar: user.avatar_url,
        homepage: user.web_url,
    };
}
function normalizeIssue(issue) {
    return {
        id: issue.iid,
        title: issue.title,
        content: issue.description,
        commentsCount: issue.user_notes_count,
    };
}
function normalizeComment(comment) {
    return {
        id: comment.id,
        content: comment.body_html,
        contentRaw: comment.body,
        author: normalizeUser(comment.author),
        createdAt: comment.created_at,
        updatedAt: comment.updated_at,
        reactions: null,
    };
}
function normalizeReaction(reaction) {
    if (reaction === '+1')
        return 'thumbsup';
    if (reaction === '-1')
        return 'thumbsdown';
    return reaction;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQVNBLE9BQU8sRUFDTCxRQUFRLEVBQ1IsU0FBUyxFQUNULFdBQVcsRUFDWCxVQUFVLEdBQ1gsTUFBTSxjQUFjLENBQUE7QUFFckIsT0FBTyxLQUVOLE1BQU0sT0FBTyxDQUFBO0FBRWQ7Ozs7O0dBS0c7QUFDSDtJQWNFLGtCQUFhLEVBUUs7WUFQaEIsZUFBOEIsRUFBOUIsbURBQThCLEVBQzlCLGdCQUFLLEVBQ0wsY0FBSSxFQUNKLGtCQUFNLEVBQ04sc0JBQVEsRUFDUiw4QkFBWSxFQUNaLGdCQUFLO1FBRUwsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUE7UUFDdEIsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUE7UUFDbEIsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUE7UUFDaEIsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUE7UUFFcEIsSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUE7UUFDeEIsSUFBSSxDQUFDLFlBQVksR0FBRyxZQUFZLENBQUE7UUFDaEMsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUE7UUFFbEIsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDO1lBQ3hCLE9BQU8sU0FBQTtZQUNQLE9BQU8sRUFBRTtnQkFDUCxRQUFRLEVBQUUsa0JBQWtCO2FBQzdCO1NBQ0YsQ0FBQyxDQUFBO0lBQ0osQ0FBQztJQTVCRCxzQkFBSSw4QkFBUTthQUFaO1lBQ0UsT0FBTyxRQUFRLENBQUE7UUFDakIsQ0FBQzs7O09BQUE7SUE0QkQsb0NBQWlCLEdBQWpCO1FBQ0UsTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEdBQUcsUUFBUSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLGlCQUFpQixDQUFDLEVBQUU7WUFDMUUsU0FBUyxFQUFFLElB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QUNyQyxTQUFTLEVBQUUsT0FBTyxDQUFDLFVBQVU7UUFDN0IsU0FBUyxFQUFFLE9BQU8sQ0FBQyxVQUFVO1FBQzdCLFNBQVMsRUFBRSxJQUFJO0tBQ2hCLENBQUE7QUFDSCxDQUFDO0FBRUQsU0FBUyxpQkFBaUIsQ0FBRSxRQUFhO0lBQ3ZDLElBQUksUUFBUSxLQUFLLElBQUk7UUFBRSxPQUFPLFVBQVUsQ0FBQTtJQUN4QyxJQUFJLFFBQVEsS0FBSyxJQUFJO1FBQUUsT0FBTyxZQUFZLENBQUE7SUFDMUMsT0FBTyxRQUFRLENBQUE7QUFDakIsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIFVzZXIsXG4gIElzc3VlLFxuICBDb21tZW50LFxuICBSZWFjdGlvbnMsXG4gIFZzc3VlQVBJLFxuICBWc3N1ZUFQSU9wdGlvbnMsXG59IGZyb20gJ3Zzc3VlJ1xuXG5pbXBvcnQge1xuICBidWlsZFVSTCxcbiAgY29uY2F0VVJMLFxuICBnZXRDbGVhblVSTCxcbiAgcGFyc2VRdWVyeSxcbn0gZnJvbSAnQHZzc3VlL3V0aWxzJ1xuXG5pbXBvcnQgYXhpb3MsIHtcbiAgQXhpb3NJbnN0YW5jZSxcbn0gZnJvbSAnYXhpb3MnXG5cbi8qKlxuICogQHNlZSBodHRwczovL2RvY3MuZ2l0bGFiLmNvbS9jZS9hcGkvb2F1dGgyLmh0bWxcbiAqIEBzZWUgaHR0cHM6Ly9kb2NzLmdpdGxhYi5jb20vY2UvYXBpL2lzc3Vlcy5odG1sXG4gKiBAc2VlIGh0dHBzOi8vZG9jcy5naXRsYWIuY29tL2NlL2FwaS9ub3Rlcy5odG1sXG4gKiBAc2VlIGh0dHBzOi8vZG9jcy5naXRsYWIuY29tL2NlL2FwaS9hd2FyZF9lbW9qaS5odG1sXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEdpdGxhYlY0IGltcGxlbWVudHMgVnNzdWVBUEkge1xuICBiYXNlVVJMOiBzdHJpbmdcbiAgb3duZXI6IHN0cmluZ1xuICByZXBvOiBzdHJpbmdcbiAgbGFiZWxzOiBzdHJpbmdcbiAgY2xpZW50SWQ6IHN0cmluZ1xuICBjbGllbnRTZWNyZXQ6IHN0cmluZ1xuICBzdGF0ZTogc3RyaW5nXG4gICRodHRwOiBBeGlvc0luc3RhbmNlXG5cbiAgZ2V0IHBsYXRmb3JtICgpIHtcbiAgICByZXR1cm4gJ2dpdGxhYidcbiAgfVxuXG4gIGNvbnN0cnVjdG9yICh7XG4gICAgYmFzZVVSTCA9ICdodHRwczovL2dpdGxhYi5jb20nLFxuICAgIG93bmVyLFxuICAgIHJlcG8sXG4gICAgbGFiZWxzLFxuICAgIGNsaWVudElkLFxuICAgIGNsaWVudFNlY3JldCxcbiAgICBzdGF0ZSxcbiAgfTogVnNzdWVBUElPcHRpb25zKSB7XG4gICAgdGhpcy5iYXNlVVJMID0gYmFzZVVSTFxuICAgIHRoaXMub3duZXIgPSBvd25lclxuICAgIHRoaXMucmVwbyA9IHJlcG9cbiAgICB0aGlzLmxhYmVscyA9IGxhYmVsc1xuXG4gICAgdGhpcy5jbGllbnRJZCA9IGNsaWVudElkXG4gICAgdGhpcy5jbGllbnRTZWNyZXQgPSBjbGllbnRTZWNyZXRcbiAgICB0aGlzLnN0YXRlID0gc3RhdGVcblxuICAgIHRoaXMuJGh0dHAgPSBheGlvcy5jcmVhdGUoe1xuICAgICAgYmFzZVVSTCxcbiAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgJ0FjY2VwdCc6ICdhcHBsaWNhdGlvbi9qc29uJyxcbiAgICAgIH0sXG4gICAgfSlcbiAgfVxuXG4gIHJlZGlyZWN0QXV0aG9yaXplICgpIHtcbiAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9IGJ1aWxkVVJMKGNvbmNhdFVSTCh0aGlzLmJhc2VVUkwsICdvYXV0aC9hdXRob3JpemUnKSwge1xuICAgICAgY2xpZW50X2lkOiB0aGlzLmNsaWVudElkLFxuICAgICAgcmVkaXJlY3RfdXJpOiB3aW5kb3cubG9jYXRpb24uaHJlZixcbiAgICAgIHJlc3BvbnNlX3R5cGU6ICdjb2RlJyxcbiAgICAgIHN0YXRlOiB0aGlzLnN0YXRlLFxuICAgIH0pXG4gIH1cblxuICBhc3luYyBoYW5kbGVBdXRob3JpemUgKCkge1xuICAgIGNvbnN0IHF1ZXJ5ID0gcGFyc2VRdWVyeSh3aW5kb3cubG9jYXRpb24uc2VhcmNoKVxuICAgIGlmIChxdWVyeS5jb2RlKSB7XG4gICAgICBpZiAocXVlcnkuc3RhdGUgIT09IHRoaXMuc3RhdGUpIHtcbiAgICAgICAgcmV0dXJuIG51bGxcbiAgICAgIH1cbiAgICAgIGNvbnN0IGNvZGUgPSBxdWVyeS5jb2RlXG4gICAgICBkZWxldGUgcXVlcnkuY29kZVxuICAgICAgZGVsZXRlIHF1ZXJ5LnN0YXRlXG4gICAgICBjb25zdCByZXBsYWNlVVJMID0gYnVpbGRVUkwoZ2V0Q2xlYW5VUkwoKSwgcXVlcnkpICsgd2luZG93LmxvY2F0aW9uLmhhc2hcbiAgICAgIHdpbmRvdy5oaXN0b3J5LnJlcGxhY2VTdGF0ZShudWxsLCAnJywgcmVwbGFjZVVSTClcbiAgICAgIGNvbnN0IGFjY2Vzc1Rva2VuID0gYXdhaXQgdGhpcy5nZXRBY2Nlc3NUb2tlbih7IGNvZGUgfSlcbiAgICAgIHJldHVybiBhY2Nlc3NUb2tlblxuICAgIH1cbiAgICByZXR1cm4gbnVsbFxuICB9XG5cbiAgYXN5bmMgZ2V0QWNjZXNzVG9rZW4gKHsgY29kZSB9KSB7XG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCB0aGlzLiRodHRwLnBvc3QoYGh0dHBzOi8vY29ycy1hbnl3aGVyZS5oZXJva3VhcHAuY29tLyR7Y29uY2F0VVJMKHRoaXMuYmFzZVVSTCwgJ29hdXRoL3Rva2VuJyl9YCwge1xuICAgICAgY2xpZW50X2lkOiB0aGlzLmNsaWVudElkLFxuICAgICAgY2xpZW50X3NlY3JldDogdGhpcy5jbGllbnRTZWNyZXQsXG4gICAgICBjb2RlLFxuICAgICAgZ3JhbnRfdHlwZTogJ2F1dGhvcml6YXRpb25fY29kZScsXG4gICAgICByZWRpcmVjdF91cmk6IHdpbmRvdy5sb2NhdGlvbi5ocmVmLFxuICAgIH0pXG4gICAgY29uc3QgYWNjZXNzVG9rZW4gPSByZXNwb25zZS5kYXRhLmFjY2Vzc190b2tlblxuICAgIHJldHVybiBhY2Nlc3NUb2tlblxuICB9XG5cbiAgYXN5bmMgZ2V0VXNlciAoeyBhY2Nlc3NUb2tlbiB9KSB7XG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCB0aGlzLiRodHRwLmdldCgnYXBpL3Y0L3VzZXInLCB7XG4gICAgICBoZWFkZXJzOiB7ICdBdXRob3JpemF0aW9uJzogYEJlYXJlciAke2FjY2Vzc1Rva2VufWAgfSxcbiAgICB9KVxuICAgIGNvbnN0IHVzZXIgPSByZXNwb25zZS5kYXRhXG4gICAgcmV0dXJuIG5vcm1hbGl6ZVVzZXIodXNlcilcbiAgfVxuXG4gIGFzeW5jIGdldElzc3VlcyAoeyBhY2Nlc3NUb2tlbiB9KSB7XG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCB0aGlzLiRodHRwLmdldChgYXBpL3Y0L3Byb2plY3RzLyR7dGhpcy5yZXBvfS9pc3N1ZXNgLCB7XG4gICAgICBwYXJhbXM6IHtcbiAgICAgICAgbGFiZWxzOiB0aGlzLmxhYmVscyxcbiAgICAgIH0sXG4gICAgICBoZWFkZXJzOiB7ICdBdXRob3JpemF0aW9uJzogYEJlYXJlciAke2FjY2Vzc1Rva2VufWAgfSxcbiAgICB9KVxuICAgIGNvbnN0IGlzc3VlcyA9IHJlc3BvbnNlLmRhdGFcbiAgICByZXR1cm4gaXNzdWVzLm1hcChub3JtYWxpemVJc3N1ZSlcbiAgfVxuXG4gIGFzeW5jIGdldENvbW1lbnRzICh7XG4gICAgaXNzdWVJZCxcbiAgICBhY2Nlc3NUb2tlbixcbiAgfSkge1xuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgdGhpcy4kaHR0cC5nZXQoYGFwaS92NC9wcm9qZWN0cy8ke3RoaXMucmVwb30vaXNzdWVzLyR7aXNzdWVJZH0vbm90ZXNgLCB7XG4gICAgICBwYXJhbXM6IHtcbiAgICAgIH0sXG4gICAgICBoZWFkZXJzOiB7ICdBdXRob3JpemF0aW9uJzogYEJlYXJlciAke2FjY2Vzc1Rva2VufWAgfSxcbiAgICB9KVxuICAgIGNvbnN0IGNvbW1lbnRzID0gcmVzcG9uc2UuZGF0YVxuICAgIGZvciAoY29uc3QgY29tbWVudCBvZiBjb21tZW50cykge1xuICAgICAgY29tbWVudC5ib2R5X2h0bWwgPSBhd2FpdCB0aGlzLmdldE1hcmtkb3duQ29udGVudCh7IGNvbnRlbnRSYXc6IGNvbW1lbnQuYm9keSB9KVxuICAgIH1cbiAgICByZXR1cm4gY29tbWVudHMubWFwKG5vcm1hbGl6ZUNvbW1lbnQpXG4gIH1cblxuICBhc3luYyBjcmVhdGVJc3N1ZSAoe1xuICAgIHRpdGxlLFxuICAgIGNvbnRlbnQsXG4gICAgYWNjZXNzVG9rZW4sXG4gIH0pIHtcbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IHRoaXMuJGh0dHAucG9zdChgYXBpL3Y0L3Byb2plY3RzLyR7dGhpcy5yZXBvfS9pc3N1ZXNgLCB7XG4gICAgICB0aXRsZSxcbiAgICAgIGRlc2NyaXB0aW9uOiBjb250ZW50LFxuICAgICAgbGFiZWxzOiB0aGlzLmxhYmVscyxcbiAgICB9LCB7XG4gICAgICBoZWFkZXJzOiB7ICdBdXRob3JpemF0aW9uJzogYEJlYXJlciAke2FjY2Vzc1Rva2VufWAgfSxcbiAgICB9KVxuICAgIGNvbnN0IGlzc3VlID0gcmVzcG9uc2UuZGF0YVxuICAgIHJldHVybiBub3JtYWxpemVJc3N1ZShpc3N1ZSlcbiAgfVxuXG4gIGFzeW5jIGNyZWF0ZUlzc3VlQ29tbWVudCAoe1xuICAgIGlzc3VlSWQsXG4gICAgY29udGVudCxcbiAgICBhY2Nlc3NUb2tlbixcbiAgfSkge1xuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgdGhpcy4kaHR0cC5wb3N0KGBhcGkvdjQvcHJvamVjdHMvJHt0aGlzLnJlcG99L2lzc3Vlcy8ke2lzc3VlSWR9L25vdGVzYCwge1xuICAgICAgYm9keTogY29udGVudCxcbiAgICB9LCB7XG4gICAgICBoZWFkZXJzOiB7ICdBdXRob3JpemF0aW9uJzogYEJlYXJlciAke2FjY2Vzc1Rva2VufWAgfSxcbiAgICB9KVxuICAgIGNvbnN0IGNvbW1lbnQgPSByZXNwb25zZS5kYXRhXG4gICAgcmV0dXJuIG5vcm1hbGl6ZUNvbW1lbnQoY29tbWVudClcbiAgfVxuXG4gIGFzeW5jIGNyZWF0ZUlzc3VlUmVhY3Rpb24gKHtcbiAgICBpc3N1ZUlkLFxuICAgIHJlYWN0aW9uLFxuICAgIGFjY2Vzc1Rva2VuLFxuICB9KSB7XG4gICAgdHJ5IHtcbiAgICAgIGF3YWl0IHRoaXMuJGh0dHAucG9zdChgYXBpL3Y0L3Byb2plY3RzLyR7dGhpcy5yZXBvfS9pc3N1ZXMvJHtpc3N1ZUlkfS9hd2FyZF9lbW9qaWAsIHtcbiAgICAgICAgbmFtZTogbm9ybWFsaXplUmVhY3Rpb24ocmVhY3Rpb24pLFxuICAgICAgfSwge1xuICAgICAgICBoZWFkZXJzOiB7ICdBdXRob3JpemF0aW9uJzogYEJlYXJlciAke2FjY2Vzc1Rva2VufWAgfSxcbiAgICAgIH0pXG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIHJldHVybiBmYWxzZVxuICAgIH1cbiAgfVxuXG4gIGFzeW5jIGNyZWF0ZUNvbW1lbnRSZWFjdGlvbiAoe1xuICAgIGlzc3VlSWQsXG4gICAgY29tbWVudElkLFxuICAgIHJlYWN0aW9uLFxuICAgIGFjY2Vzc1Rva2VuLFxuICB9KSB7XG4gICAgdHJ5IHtcbiAgICAgIGF3YWl0IHRoaXMuJGh0dHAucG9zdChgYXBpL3Y0L3Byb2plY3RzLyR7dGhpcy5yZXBvfS9pc3N1ZXMvJHtpc3N1ZUlkfS9ub3Rlcy8ke2NvbW1lbnRJZH0vYXdhcmRfZW1vamlgLCB7XG4gICAgICAgIG5hbWU6IG5vcm1hbGl6ZVJlYWN0aW9uKHJlYWN0aW9uKSxcbiAgICAgIH0sIHtcbiAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICdBdXRob3JpemF0aW9uJzogYEJlYXJlciAke2FjY2Vzc1Rva2VufWAsXG4gICAgICAgIH0sXG4gICAgICB9KVxuICAgICAgcmV0dXJuIHRydWVcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICByZXR1cm4gZmFsc2VcbiAgICB9XG4gIH1cblxuICBhc3luYyBnZXRNYXJrZG93bkNvbnRlbnQgKHsgY29udGVudFJhdyB9KSB7XG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCB0aGlzLiRodHRwLnBvc3QoYGFwaS92NC9tYXJrZG93bmAsIHtcbiAgICAgIHRleHQ6IGNvbnRlbnRSYXcsXG4gICAgfSlcbiAgICBjb25zdCBjb250ZW50ID0gcmVzcG9uc2UuZGF0YS5odG1sXG4gICAgcmV0dXJuIGNvbnRlbnRcbiAgfVxufVxuXG5mdW5jdGlvbiBub3JtYWxpemVVc2VyICh1c2VyOiBhbnkpOiBVc2VyIHtcbiAgcmV0dXJuIHtcbiAgICB1c2VybmFtZTogdXNlci51c2VybmFtZSxcbiAgICBhdmF0YXI6IHVzZXIuYXZhdGFyX3VybCxcbiAgICBob21lcGFnZTogdXNlci53ZWJfdXJsLFxuICB9XG59XG5cbmZ1bmN0aW9uIG5vcm1hbGl6ZUlzc3VlIChpc3N1ZTogYW55KTogSXNzdWUge1xuICByZXR1cm4ge1xuICAgIGlkOiBpc3N1ZS5paWQsXG4gICAgdGl0bGU6IGlzc3VlLnRpdGxlLFxuICAgIGNvbnRlbnQ6IGlzc3VlLmRlc2NyaXB0aW9uLFxuICAgIGNvbW1lbnRzQ291bnQ6IGlzc3VlLnVzZXJfbm90ZXNfY291bnQsXG4gIH1cbn1cblxuZnVuY3Rpb24gbm9ybWFsaXplQ29tbWVudCAoY29tbWVudDogYW55KTogQ29tbWVudCB7XG4gIHJldHVybiB7XG4gICAgaWQ6IGNvbW1lbnQuaWQsXG4gICAgY29udGVudDogY29tbWVudC5ib2R5X2h0bWwsXG4gICAgY29udGVudFJhdzogY29tbWVudC5ib2R5LFxuICAgIGF1dGhvcjogbm9ybWFsaXplVXNlcihjb21tZW50LmF1dGhvciksXG4gICAgY3JlYXRlZEF0OiBjb21tZW50LmNyZWF0ZWRfYXQsXG4gICAgdXBkYXRlZEF0OiBjb21tZW50LnVwZGF0ZWRfYXQsXG4gICAgcmVhY3Rpb25zOiBudWxsLFxuICB9XG59XG5cbmZ1bmN0aW9uIG5vcm1hbGl6ZVJlYWN0aW9uIChyZWFjdGlvbjogYW55KSB7XG4gIGlmIChyZWFjdGlvbiA9PT0gJysxJykgcmV0dXJuICd0aHVtYnN1cCdcbiAgaWYgKHJlYWN0aW9uID09PSAnLTEnKSByZXR1cm4gJ3RodW1ic2Rvd24nXG4gIHJldHVybiByZWFjdGlvblxufVxuIl19