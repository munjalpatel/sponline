var validator = require('validator'),
  jwt = require('jwt-simple'),
  url = require('url'),
  https = require('https'),
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

SPOnline.prototype.request = function (path, callback) {
  if (!this._accessToken) return callback('Not authenticated');
  if (!path) throw new Error('No path specified');

  var spServer = url.parse(this._siteUrl);

  var options = {
    host: spServer.hostname,
    port: spServer.port || 443,
    path: spServer.path + '/_api' + path,
    method: 'GET',
    agent: false,
    ciphers: 'RC4',
    secureOptions: require('constants').SSL_OP_NO_TLSv1_2,
    headers: {
      'Authorization': 'Bearer ' + this._accessToken,
      'Accept': 'application/json;odata=verbose'
    }
  };

  https.get(options, function (res) {
    res.setEncoding('utf8');
    var _data = '';

    res.on('data', function (data) {
      _data += data;
    });

    res.on('end', function () {
      callback(null, JSON.parse(_data).d);
    });

    res.on('error', function (err) {
      callback(err);
    });
  });
};

SPOnline.prototype.authenticate = function (options, callback) {
  if (!options) throw new Error('No options specified');
  if (!options.siteUrl) throw new Error('No site url is specified');
  if (!options.appToken) throw new Error('No app token is specified');

  if (!validator.isURL(options.siteUrl, {
    protocols: ['https']
  })) throw new Error(options.siteUrl + ' is not a valid site url');

  var _this = this;
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

    _this._siteUrl = options.siteUrl;
    _this._refreshToken = token.refreshToken;
    _this._accessToken = accessToken;

    callback(null, {
      refreshToken: token.refreshtoken,
      accessToken: accessToken
    });
  });
};

SPOnline.prototype.getCurrentUser = function (callback) {
  if (!this._accessToken) throw new Error('Not authenticated');
  this.request('/web/currentuser', function (err, response) {
    if (err) return callback(err);

    var profile = {
      id: response.Id,
      name: response.Title,
      account: response.LoginName,
      email: response.Email,
      raw: response
    };

    callback(null, profile);
  });
};

module.exports = SPOnline;