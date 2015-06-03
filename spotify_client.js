/*
  Request Spotify credentials for the user.

  @param options (optional)
  @param credentialRequestCompleteCallback (callback *function* to call on completion. Takes one argument: credentialToken
    on success, or Error on error)
 */
Spotify.requestCredential = function (options, credentialRequestCompleteCallback) {
  // support both (options, callback) and (callback).
  if (!credentialRequestCompleteCallback && typeof options === 'function') {
    credentialRequestCompleteCallback = options;
    options = {};
  } else if (!options) {
    options = {};
  }

  // Fetch the config (clientId & secret)
  var config = ServiceConfiguration.configurations.findOne({service: 'spotify'});
  if (!config) {
    credentialRequestCompleteCallback && credentialRequestCompleteCallback(new ServiceConfiguration.ConfigError());
    return;
  }

  // Force the user to approve the app every time (similar to Google's `approval_prompt`).
  var showDialog = options.forceApprovalPrompt || false;

  // Figure out scopes.
  var requiredScope = ['user-read-email'];
  var scope = [];
  if (options.requestPermissions) {
    scope = options.requestPermissions;
  }
  scope = _.union(scope, requiredScope);

  // Added on security used for the `state` param.
  var credentialToken = Random.secret();
  var loginStyle = OAuth._loginStyle('spotify', config, options);

  // Generate the oauth URL.
  var loginUrl =
    'https://accounts.spotify.com/authorize' +
    '?response_type=code' +
    '&client_id=' + config.clientId +
    '&redirect_uri=' + OAuth._redirectUri('spotify', config) +
    '&state=' + OAuth._stateParam(loginStyle, credentialToken) +
    '&scope=' + '' + _.map(scope, encodeURIComponent).join('+');
    '&show_dialog=' + showDialog;

  OAuth.launchLogin({
    loginService: "spotify",
    loginStyle: loginStyle,
    loginUrl: loginUrl,
    credentialRequestCompleteCallback: credentialRequestCompleteCallback,
    credentialToken: credentialToken
  });
};