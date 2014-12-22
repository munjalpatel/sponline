var validator = require('validator');

function SPOnline(options) {
  if (!options) throw new Error('No options specified');
  if (!options.clientId) throw new Error('No client id specified');
  if (!options.clientSecret) throw new Error('No client secret specified');

  if (!validator.isUUID(options.clientId)) throw new Error(options.clientId + ' is not a valid client id');

  this._clientId = options.clientId;
  this._clientSecret = options.clientSecret;
}

SPOnline.prototype.authenticate = function (options) {
  if (!options) throw new Error('No options specified');
  if (!options.siteUrl) throw new Error('No site url is specified');
  if (!options.appToken) throw new Error('No app token is specified');
};

module.exports = SPOnline;