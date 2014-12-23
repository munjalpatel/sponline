var expect = require('chai').expect;
var SPO = require('../sponline.js');

var options = {
  clientId: process.env.SPONLINE_CLIENT_ID,
  clientSecret: process.env.SPONLINE_CLIENT_SECRET
};

describe('SPOnline', function () {
  describe('getCurrentUser()', function () {
    it('should throw an error if not authenticated', function () {
      this.timeout(5000);

      var spo = new SPO(options);
      expect(spo.getCurrentUser.bind(spo)).to.throw(/Not authenticated/);
    });

    it('should return current user profile', function (done) {
      this.timeout(5000);

      var spo = new SPO(options);
      spo.authenticate({
        siteUrl: process.env.SPONLINE_SITE_URL,
        appToken: process.env.SPONLINE_APP_TOKEN
      }, function (err) {
        spo.getCurrentUser(function (err, response) {
          expect(err).to.be.null();

          expect(response).to.have.property('id');
          expect(response.id).to.be.a('number');
          expect(response.id).to.be.above(0);
          
          expect(response).to.have.property('name');
          expect(response.name).to.be.a('string');
          expect(response.name).to.be.not.empty();
          
          expect(response).to.have.property('account');
          expect(response.account).to.be.a('string');
          expect(response.account).to.be.not.empty();
          
          expect(response).to.have.property('email');
          expect(response.email).to.be.a('string');
          expect(response.email).to.be.not.empty();
          
          done();
        });
      });
    });
  });
});