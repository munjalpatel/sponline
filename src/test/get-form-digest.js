var expect = require('chai').expect;
var SPO = require('../sponline.js');

var options = {
  clientId: process.env.SPONLINE_CLIENT_ID,
  clientSecret: process.env.SPONLINE_CLIENT_SECRET
};

describe('SPOnline', function () {
  describe('getFormDigest()', function () {
    it('should throw an error if not authenticated', function () {
      this.timeout(5000);

      var spo = new SPO(options);
      expect(spo.getFormDigest.bind(spo)).to.throw(/Not authenticated/);
    });

    it('should return the form digest', function (done) {
      this.timeout(5000);

      var spo = new SPO(options);
      spo.authenticate({
        siteUrl: process.env.SPONLINE_SITE_URL,
        appToken: process.env.SPONLINE_APP_TOKEN
      }, function (err) {
        spo.getFormDigest(function (err, response) {
          expect(err).to.be.null();

          expect(response).to.have.property('digest');
          expect(response.digest).to.be.a('string');
          expect(response.digest).to.be.not.empty();

          done();
        });
      });
    });
  });
});