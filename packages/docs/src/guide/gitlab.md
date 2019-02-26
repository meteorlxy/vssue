# GitLab Application

> See [Gitlab official docs](https://docs.gitlab.com/ce/integration/oauth_provider.html#adding-an-application-through-the-profile) for reference.

> Vssue can also work with self-hosted GitLab. Set the `baseURL` options to your Gitlab URL. See [Options Reference - baseURL](../options/README.md#baseurl)

## Create a new Application

- Go to [Settings - Applications](https://gitlab.com/profile/applications)

->![Set up OAuth App - Gitlab 01](/assets/img/oauth-app-gitlab-01.png)<-
->![Set up OAuth App - Gitlab 02](/assets/img/oauth-app-gitlab-02.png)<-

- Set the `Redirect URI` to your website URL (Here we take `localhost:8080` for example)
- Select `api` scope

->![Set up OAuth App - Gitlab 03](/assets/img/oauth-app-gitlab-03.png)<-

## Get the Client ID and Secret

Then you've created a new Application, and here is your __Application ID__ (`Client ID`) and __Secret__ (`Client Secret`).

->![Set up OAuth App - Gitlab 04](/assets/img/oauth-app-gitlab-04.png)<-

## Config and start your Vssue

Copy the `Client ID` and `Client Secret`, and set `owner` and `repo`.

> The URL pattern of gitlab repo is `https://gitlab.com/${owner}/${repo}`

Here we take `https://gitlab.com/meteorlxy/vssue-demo` for example, and set the `title` of issue to `Vssue Demo`.

Then run `anywhere -h localhost 8080` to serve the `index.html` on `localhost:8080`.

->![Set up OAuth App - Gitlab 05](/assets/img/oauth-app-gitlab-05.png)<-

## Try out Vssue locally

Vssue has already run here. Click `Login` to login with Gitlab account.

->![Set up OAuth App - Gitlab 06](/assets/img/oauth-app-gitlab-06.png)<-

Redirect to GitLab Authorization page. Click `Authorize` to login.

->![Set up OAuth App - Gitlab 07](/assets/img/oauth-app-gitlab-07.png)<-

Leave a comment on this page ~

->![Set up OAuth App - Gitlab 08](/assets/img/oauth-app-gitlab-08.png)<-
->![Set up OAuth App - Gitlab 09](/assets/img/oauth-app-gitlab-09.png)<-

::: tip
You can go to the repo [meteorlxy/vssue-demo](https://gitlab.com/meteorlxy/vssue-demo) to get the demo code. Check the [#1 issue](https://gitlab.com/meteorlxy/vssue-demo/issues/1) of that repo to see what happened.
:::
