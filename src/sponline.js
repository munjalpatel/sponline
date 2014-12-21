var validator = require('validator');

function SPOnline(options) {
  if (!options) throw new Error('No options specified');
  if (!options.appId) throw new Error('No app id specified');
  if (!options.appSecret) throw new Error('No app secret specified');

  if (!validator.isUUID(options.appId)) throw new Error(options.appId + ' is not a valid app id');

  this._appId = options.appId;
  this._appSecret = options.appSecret;
}

module.exports = SPOnline;