var validator = require('validator'),
  jwt = require('jwt-simple'),
  url = require('url'),
  OAuth2 = require('oauth').OAuth2;

var SP_AUTH_PATH = '/_layouts/15/OAuthAuthorize.aspx';

function SPOnline(options) {
  if (!options) throw new Error('No options specified');
  if (!options.clientId) throw new Error('No client id specified');
  if (!options.clientSecret) throw new Error('No client secret specified');

  if (!validator.isUUID(options.clientId)) throw new Error(options.clientId + ' is not a valid client id');

  this._clientId = options.clientId;
  this._clientSecret = options.clientSecret;
}

SPOnline.prototype.authenticate = function (options, callback) {
  if (!options) throw new Error('No options specified');
  if (!options.siteUrl) throw new Error('No site url is specified');
  if (!options.appToken) throw new Error('No app token is specified');

  if (!validator.isURL(options.siteUrl, {
    protocols: ['https']
  })) throw new Error(options.siteUrl + ' is not a valid site url');

  var token;

  try {
    token = eval(jwt.decode(options.appToken, '', true));
  } catch (err) {
    throw new Error(options.appToken + ' is not a valid JWT. ' + err.message);
  }

  var apptxSender = token.appctxsender.split('@');
  var spServer = url.parse(options.siteUrl)
  var resource = apptxSender[0] + '/' + spServer.host + '@' + apptxSender[1];
  var appId = this._clientId + '@' + apptxSender[1];
  var appctx = JSON.parse(token.appctx);
  var tokenServiceUri = url.parse(appctx.SecurityTokenServiceUri);
  var tokenURL = tokenServiceUri.protocol + '//' + tokenServiceUri.host + '/' + apptxSender[1] + tokenServiceUri.path;
  var authorizationURL = options.siteUrl + SP_AUTH_PATH;

  oauth2 = new OAuth2(appId, this._clientSecret, '', authorizationURL, tokenURL);
  oauth2.getOAuthAccessToken(token.refreshtoken, {
    grant_type: 'refresh_token',
    refresh_token: token.refreshtoken,
    resource: resource
  }, function (err, accessToken, refreshToken, params) {
    if (err) {
      return callback('[' + err.statusCode + '] ' + (JSON.parse(err.data)).error_description.replace(/\r\n/g, ' '));
    }

    callback(null, {
      refreshToken: token.refreshtoken,
      accessToken: accessToken
    });
  });
};

module.exports = SPOnline;