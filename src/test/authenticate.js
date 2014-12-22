var expect = require('chai').expect;
var SPO = require('../sponline.js');

var options = {
  clientId: process.env.SPONLINE_CLIENT_ID,
  clientSecret: process.env.SPONLINE_CLIENT_SECRET
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

    it('should have the Refresh Token and Access Token in response', function (done) {
      this.timeout(5000);

      var spo = new SPO(options);
      spo.authenticate({
        siteUrl: process.env.SPONLINE_SITE_URL,
        appToken: process.env.SPONLINE_APP_TOKEN
      }, function (err, response) {
        expect(err).to.be.null();
        
        expect(response).to.have.property('refreshToken');
        expect(response.refreshToken).to.be.a('string');
        expect(response.refreshToken.length).to.be.at.least(1);
        
        expect(response).to.have.property('accessToken');
        expect(response.accessToken).to.be.a('string');
        expect(response.accessToken.length).to.be.at.least(1);
        
        done();
      });
    });
  });
});