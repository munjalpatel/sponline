var expect = require('chai').expect;
var SPO = require('../sponline.js');

var options = {
  clientId: '7d2f4c93-2421-4dcd-820d-a0ae35d3f40b',
  clientSecret: 'secret'
};

describe('SPOnline', function () {
  describe('authenticate()', function () {
    it('should throw an error if no options specified', function () {
      var spo = new SPO(options);
      expect(spo.authenticate.bind(spo)).to.throw(/No options specified/);
    });

    it('should throw an error if no site url is specified', function () {
      var spo = new SPO(options);
      expect(spo.authenticate.bind(spo, {})).to.throw(/No site url is specified/);
    });

    it('should throw an error if no token url is specified', function () {
      var spo = new SPO(options);
      expect(spo.authenticate.bind(spo, {
        siteUrl: 'https://sponline'
      })).to.throw(/No token url is specified/);
    });

    it('should throw an error if no code is specified', function () {
      var spo = new SPO(options);
      expect(spo.authenticate.bind(spo, {
        siteUrl: 'https://sponline',
        tokenUrl: 'https://sponline/token'
      })).to.throw(/No code is specified/);
    });
  });
});