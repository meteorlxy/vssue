"use strict";
var path = require('path');
module.exports = function (_a) {
    var _b = _a.platform, platform = _b === void 0 ? 'github' : _b, clientId = _a.clientId, clientSecret = _a.clientSecret, owner = _a.owner, repo = _a.repo;
    var platformAPI = {
        'github': '@vssue/api-github-v3',
        'gitlab': '@vssue/api-gitlab-v4',
        'bitbucket': '@vssue/api-bitbucket-v2',
    };
    var apiPkg = platformAPI[platform];
    if (!apiPkg) {
        throw new Error("[@vssue/vuepress-plugin-vssue] Platform '" + platform + "' is not supported. Available platforms: github, gitlab, bitbucket.");
    }
    try {
        require.resolve(apiPkg);
    }
    catch (e) {
        throw new Error("[@vssue/vuepress-plugin-vssue] " + apiPkg + " is not installed. Run 'npm install " + apiPkg + "' or 'yarn add " + apiPkg + "' to install it.");
    }
    return {
        name: 'vssue',
        enhanceAppFiles: [
            path.resolve(__dirname, 'enhanceApp.js'),
        ],
        define: {
            'VSSUE_CLIENT_ID': clientId,
            'VSSUE_CLIENT_SECRET': clientSecret,
            'VSSUE_OWNER': owner,
            'VSSUE_REPO': repo,
        },
        alias: {
            'vssue$': 'vssue/dist/vssue.esm.js',
            '@vssue/api$': require.resolve(apiPkg),
        },
    };
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLElBQU0sSUFBSSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQTtBQUU1QixNQUFNLENBQUMsT0FBTyxHQUFHLFVBQUMsRUFNakI7UUFMQyxnQkFBbUIsRUFBbkIsd0NBQW1CLEVBQ25CLHNCQUFRLEVBQ1IsOEJBQVksRUFDWixnQkFBSyxFQUNMLGNBQUk7SUFFSixJQUFNLFdBQVcsR0FBRztRQUNsQixRQUFRLEVBQUUsc0JBQXNCO1FBQ2hDLFFBQVEsRUFBRSxzQkFBc0I7UUFDaEMsV0FBVyxFQUFFLHlCQUF5QjtLQUN2QyxDQUFBO0lBRUQsSUFBTSxNQUFNLEdBQUcsV0FBVyxDQUFDLFFBQVEsQ0FBQyxDQUFBO0lBRXBDLElBQUksQ0FBQyxNQUFNLEVBQUU7UUFDWCxNQUFNLElBQUksS0FBSyxDQUFDLDhDQUE0QyxRQUFRLHdFQUFxRSxDQUFDLENBQUE7S0FDM0k7SUFFRCxJQUFJO1FBQ0YsT0FBTyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQTtLQUN4QjtJQUFDLE9BQU8sQ0FBQyxFQUFFO1FBQ1YsTUFBTSxJQUFJLEtBQUssQ0FBQyxvQ0FBa0MsTUFBTSw0Q0FBdUMsTUFBTSx1QkFBa0IsTUFBTSxxQkFBa0IsQ0FBQyxDQUFBO0tBQ2pKO0lBRUQsT0FBTztRQUNMLElBQUksRUFBRSxPQUFPO1FBRWIsZUFBZSxFQUFFO1lBQ2YsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLEVBQUUsZUFBZSxDQUFDO1NBQ3pDO1FBRUQsTUFBTSxFQUFFO1lBQ04saUJBQWlCLEVBQUUsUUFBUTtZQUMzQixxQkFBcUIsRUFBRSxZQUFZO1lBQ25DLGFBQWEsRUFBRSxLQUFLO1lBQ3BCLFlBQVksRUFBRSxJQUFJO1NBQ25CO1FBRUQsS0FBSyxFQUFFO1lBQ0wsUUFBUSxFQUFFLHlCQUF5QjtZQUNuQyxhQUFhLEVBQUUsT0FBTyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUM7U0FDdkM7S0FDRixDQUFBO0FBQ0gsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKVxuXG5tb2R1bGUuZXhwb3J0cyA9ICh7XG4gIHBsYXRmb3JtID0gJ2dpdGh1YicsXG4gIGNsaWVudElkLFxuICBjbGllbnRTZWNyZXQsXG4gIG93bmVyLFxuICByZXBvLFxufSkgPT4ge1xuICBjb25zdCBwbGF0Zm9ybUFQSSA9IHtcbiAgICAnZ2l0aHViJzogJ0B2c3N1ZS9hcGktZ2l0aHViLXYzJyxcbiAgICAnZ2l0bGFiJzogJ0B2c3N1ZS9hcGktZ2l0bGFiLXY0JyxcbiAgICAnYml0YnVja2V0JzogJ0B2c3N1ZS9hcGktYml0YnVja2V0LXYyJyxcbiAgfVxuXG4gIGNvbnN0IGFwaVBrZyA9IHBsYXRmb3JtQVBJW3BsYXRmb3JtXVxuXG4gIGlmICghYXBpUGtnKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGBbQHZzc3VlL3Z1ZXByZXNzLXBsdWdpbi12c3N1ZV0gUGxhdGZvcm0gJyR7cGxhdGZvcm19JyBpcyBub3Qgc3VwcG9ydGVkLiBBdmFpbGFibGUgcGxhdGZvcm1zOiBnaXRodWIsIGdpdGxhYiwgYml0YnVja2V0LmApXG4gIH1cblxuICB0cnkge1xuICAgIHJlcXVpcmUucmVzb2x2ZShhcGlQa2cpXG4gIH0gY2F0Y2ggKGUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYFtAdnNzdWUvdnVlcHJlc3MtcGx1Z2luLXZzc3VlXSAke2FwaVBrZ30gaXMgbm90IGluc3RhbGxlZC4gUnVuICducG0gaW5zdGFsbCAke2FwaVBrZ30nIG9yICd5YXJuIGFkZCAke2FwaVBrZ30nIHRvIGluc3RhbGwgaXQuYClcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgbmFtZTogJ3Zzc3VlJyxcblxuICAgIGVuaGFuY2VBcHBGaWxlczogW1xuICAgICAgcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJ2VuaGFuY2VBcHAuanMnKSxcbiAgICBdLFxuXG4gICAgZGVmaW5lOiB7XG4gICAgICAnVlNTVUVfQ0xJRU5UX0lEJzogY2xpZW50SWQsXG4gICAgICAnVlNTVUVfQ0xJRU5UX1NFQ1JFVCc6IGNsaWVudFNlY3JldCxcbiAgICAgICdWU1NVRV9PV05FUic6IG93bmVyLFxuICAgICAgJ1ZTU1VFX1JFUE8nOiByZXBvLFxuICAgIH0sXG5cbiAgICBhbGlhczoge1xuICAgICAgJ3Zzc3VlJCc6ICd2c3N1ZS9kaXN0L3Zzc3VlLmVzbS5qcycsXG4gICAgICAnQHZzc3VlL2FwaSQnOiByZXF1aXJlLnJlc29sdmUoYXBpUGtnKSxcbiAgICB9LFxuICB9XG59XG4iXX0=