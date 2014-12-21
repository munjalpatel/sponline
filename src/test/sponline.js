var expect = require('chai').expect;
var SPO = require('../sponline.js');

describe('SPOnline', function () {
  it('should throw an error if no options specified', function () {
    expect(SPO.bind(SPO)).to.throw(/No options specified/);
  });

  it('should throw an error if no app id is specified', function () {
    expect(SPO.bind(SPO, {})).to.throw(/No app id specified/);
  });

  it('should throw an error if no app secret is specified', function () {
    expect(SPO.bind(SPO, {
      appId: '1234'
    })).to.throw(/No app secret specified/);
  });

  describe('App ID', function () {
    it('should be GUID', function () {
      expect(SPO.bind(SPO, {
        appId: '1234',
        appSecret: 'secret'
      })).to.throw(/1234 is not a valid app id/);
    });
  });
});