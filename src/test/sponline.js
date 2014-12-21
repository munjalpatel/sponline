var expect = require('chai').expect;
var SPO = require('../sponline.js');

describe('SPOnline', function () {
  it('should throw an error if no options specified', function () {
    expect(SPO.bind(SPO)).to.throw(/No options specified/);
  });

  it('should throw an error if no client id is specified', function () {
    expect(SPO.bind(SPO, {})).to.throw(/No client id specified/);
  });

  it('should throw an error if no client secret is specified', function () {
    expect(SPO.bind(SPO, {
      clientId: '1234'
    })).to.throw(/No client secret specified/);
  });

  describe('Client ID', function () {
    it('should be GUID', function () {
      expect(SPO.bind(SPO, {
        clientId: '1234',
        clientSecret: 'secret'
      })).to.throw(/1234 is not a valid client id/);
    });
  });
});