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

    it('should throw an error if no app token is specified', function () {
      var spo = new SPO(options);
      expect(spo.authenticate.bind(spo, {
        siteUrl: 'https://sponline'
      })).to.throw(/No app token is specified/);
    });

    describe('Site URL', function () {
      it('should be URL', function () {
        var spo = new SPO(options);
        expect(spo.authenticate.bind(spo, {
          siteUrl: 'sponline',
          appToken: '1234'
        })).to.throw(/sponline is not a valid site url/);
      });

      it('should use HTTPS protocol', function () {
        var spo = new SPO(options);
        expect(spo.authenticate.bind(spo, {
          siteUrl: 'http://sponline.com',
          appToken: '1234'
        })).to.throw(/http:\/\/sponline.com is not a valid site url/);
      });
    });

    describe('App Token', function () {
      it('should be a valid JWT', function () {
        var spo = new SPO(options);
        expect(spo.authenticate.bind(spo, {
          siteUrl: 'https://sponline.com',
          appToken: '1234'
        })).to.throw(/1234 is not a valid JWT/);
      });
    });

    it('should return an error if authentication was not successful', function (done) {
      this.timeout(5000);

      var spo = new SPO(options);
      spo.authenticate({
        siteUrl: 'https://sponline.com',
        appToken: process.env.SPONLINE_APP_TOKEN
      }, function (err) {
        console.log('\t' + err);
        expect(err).to.be.a('string');
        expect(err.length).to.be.at.least(1);
        done();
      });
    });

    //    it('should have the Refresh Token in response', function (done) {
    //      
    //    });
  });
});