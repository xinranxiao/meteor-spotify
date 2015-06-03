var OAuth = Package.oauth.OAuth;

Spotify.whitelistedFields = ['display_name', 'email', 'id', 'uri', 'images'];

/*
  Registers the oauth service.
 */
OAuth.registerService('spotify', 2, null, function(query) {
  var response = getTokens(query);
  var refreshToken = response.refreshToken;
  var identity = getIdentity(accessToken);

  // Set the service data.
  var serviceData = {
    accessToken: response.accessToken,
    expiresAt: (+new Date) + (1000 * response.expiresIn)
  };

  // Set refresh token.
  if (refreshToken) {
    serviceData.refreshToken = refreshToken;
  }

  // Set any additional fields.
  var fields = _.pick(identity, Spotify.whitelistedFields);
  _.extend(serviceData, fields);

  return {
    serviceData: serviceData,
    options: { profile: fields }
  };
});

// checks whether a string parses as JSON
var isJSON = function (str) {
  try {
    JSON.parse(str);
    return true;
  } catch (e) {
    return false;
  }
};

/*
  Helper function that returns an object with:
    accessToken (token itself)
    expiresIn (token lifespan)
    refreshToken
 */
var getTokens = function(query) {
  var config = ServiceConfiguration.configurations.findOne({service: 'spotify'});
  if (!config)
    throw new ServiceConfiguration.ConfigError();

  var response;
  try {
    // Request access token.
    response = HTTP.post(
      "https://accounts.spotify.com/api/token", { params: {
        code: query.code,
        client_id: config.clientId,
        client_secret: OAuth.openSecret(config.secret),
        redirect_uri: OAuth._redirectUri('spotify', config),
        grant_type: 'authorization_code'
      }});
  } catch (err) {
    throw _.extend(new Error("Failed to complete OAuth handshake with Spotify. " + err.message), {response: err.response});
  }

  // Spotify returns responses like 'E{"error":"server_error","error_description":"Unexpected status: 415"}' on error.
  if (isJSON(response)) {
    throw new Error("Failed to complete OAuth handshake with Spotify. " + response);
  } else if (!response.data.access_token) {
    throw new Error("Failed to complete OAuth handshake with Spotify. No access_token found in response.");
  } else {
    return {
      accessToken: response.data.access_token,
      refreshToken: response.data.refresh_token,
      expiresIn: response.data.expires_in
    };
  }
};

// Helper function that fetches and returns the user's Spotify profile.
var getIdentity = function(accessToken) {
  try {
    return HTTP.get(
      "https://api.spotify.com/v1/me",
      { params: { access_token: accessToken }}).data;
  } catch (err) {
    throw _.extend(new Error("Failed to fetch identity from Spotify. " + err.message), { response: err.response });
  }
}

Spotify.retrieveCredential = function(credentialToken, credentialSecret) {
  return OAuth.retrieveCredential(credentialToken, credentialSecret);
};