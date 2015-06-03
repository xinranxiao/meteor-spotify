var OAuth = Package.oauth.OAuth;

/*
  Registers the oauth service.
 */
OAuth.registerService('spotify', 2, null, function(query) {

});

/*
  Helper function that returns an object with:
    accessToken (token itself)
    expiresIn (token lifespan)
 */
var getTokens = function(query) {

};

// Helper function that fetches and returns the user's Spotify profile.
var getIdentity = function(accessToken) {

}

Spotify.retrieveCredential = function(credentialToken, credentialSecret) {
  return OAuth.retrieveCredential(credentialToken, credentialSecret);
};