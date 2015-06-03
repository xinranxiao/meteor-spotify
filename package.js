Package.describe({
  name: 'xinranxiao:spotify',
  version: '0.0.1',
  summary: 'An oauth wrapper for Spotify on Meteor',
  git: 'https://github.com/xinranxiao/meteor-spotify',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.0');

  api.use('oauth2', ['client', 'server']);
  api.use('oauth', ['client', 'server']);
  api.use('http', ['server']);
  api.use(['underscore', 'service-configuration'], ['client', 'server']);
  api.use(['random', 'templating'], 'client');

  // TODO add variable export.

  api.addFiles(
    ['spotify_configure.html', 'spotify_configure.js'],
    'client');
  api.addFiles('spotify_common.js', ['client', 'server']);
  api.addFiles('spotify_server.js', 'server');
  api.addFiles('spotify_client.js', 'client');
});