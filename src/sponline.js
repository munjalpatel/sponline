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
  if (!options.tokenUrl) throw new Error('No token url is specified');
  if (!options.code) throw new Error('No code is specified');
};

module.exports = SPOnline;