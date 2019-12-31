# Gitea Application

> Vssue can also work with self-hosted Gitea. Set the `baseURL` options to your Gitea URL. See [Options Reference - baseURL](../options/README.md#baseurl)

> Gitea requires `clientSecret` because Gitea does not support implicit grant type

## Create a new Application

- Go to [Settings - Applications](https://gitea.com/user/settings/applications)

->![Set up OAuth App - Gitea 01](/assets/img/oauth-app-gitea-01.png)<-
->![Set up OAuth App - Gitea 02](/assets/img/oauth-app-gitea-02.png)<-

- Set the `Redirect URI` to your website URL (Here we take `localhost:8080` for example)
- Click `Create Application`

->![Set up OAuth App - Gitea 03](/assets/img/oauth-app-gitea-03.png)<-

## Get the Client ID and Secret

Then you've created a new Application, and here is your `Client ID` and `Client Secret`.

->![Set up OAuth App - Gitea 04](/assets/img/oauth-app-gitea-04.png)<-

## Config and start your Vssue

Copy the `Client ID` and `Client Secret`, and set `owner` and `repo`.

> The URL pattern of gitea repo is `https://gitea.com/${owner}/${repo}`

Here we take `https://gitea.com/meteorlxy/vssue-demo` for example, and set the `title` of issue to `Vssue Demo`.

Then run `anywhere -h localhost 8080` to serve the `index.html` on `localhost:8080`.

->![Set up OAuth App - Gitea 05](/assets/img/oauth-app-gitea-05.png)<-

## Try out Vssue locally

Vssue has already run here. Click `Login` to login with gitea account and `Click to create issue`.

->![Set up OAuth App - Gitea 06](/assets/img/oauth-app-gitea-06.png)<-

Redirect to Gitea Authorization page. Click `Authorize Application` to login.

->![Set up OAuth App - Gitea 07](/assets/img/oauth-app-gitea-07.png)<-

Leave a comment on this page ~

->![Set up OAuth App - Gitea 08](/assets/img/oauth-app-gitea-08.png)<-

->![Set up OAuth App - Gitea 09](/assets/img/oauth-app-gitea-09.png)<-

::: tip
You can go to the repo [meteorlxy/vssue-demo](https://gitea.com/meteorlxy/vssue-demo) to get the demo code. Check the [first issue](https://gitea.com/meteorlxy/vssue-demo/issues/1) of that repo to see what happened.
:::
