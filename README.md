# meteor-spotify
A oauth wrapper for Spotify on Meteor

## Installation
* `meteor add service-configuration`
* `meteor add xinranxiao:spotify`

## Usage

Go to Spotify's website and register an application. For your redirect URL, enter: `<yourhostname>/_oauth/spotify?close`

Configure the Spotify service (server-side):

```
ServiceConfiguration.configurations.update(
  { "service": "spotify" },
  {
    $set: {
      "clientId": "<your clientId",
      "secret": "<your secret>"
    }
  },
  { upsert: true }
);
```

This package can be used independently of `xinranxiao:accounts-spotify` if you just want to get the OAuth access token. Just run this (client-side):

```
var options = {
  showDialog: true, // Whether or not to force the user to approve the app again if they’ve already done so.
  requestPermissions: ['user-read-email'] // Spotify access scopes.
};

Spotify.requestCredential(options, function(accessToken) {
  console.log(accessToken);
});
```

## Contribution

If you have any problems with or suggestions for this package, please create a new issue.

TODO
- Add other auth methods that spotify has.