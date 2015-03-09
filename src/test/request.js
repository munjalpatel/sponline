var expect = require('chai').expect;
var SPO = require('../sponline.js');

var options = {
  clientId: process.env.SPONLINE_CLIENT_ID,
  clientSecret: process.env.SPONLINE_CLIENT_SECRET
};

describe('SPOnline', function () {
  describe('request()', function () {
    it('should throw an error if not authenticated', function (done) {
      this.timeout(5000);

      var spo = new SPO(options);
      spo.request(null, function (err) {
        expect(err).to.equal('Not authenticated');
        done();
      });
    });

    it('should throw an error if no path is specified', function () {
      this.timeout(5000);

      var spo = new SPO(options);
      spo.authenticate({
        siteUrl: process.env.SPONLINE_SITE_URL,
        appToken: process.env.SPONLINE_APP_TOKEN
      }, function (err) {
        expect(spo.request.bind(spo)).to.throw(/No path specified/);
      });
    });

    it('should successfully call SharePoint\'s REST api', function (done) {
      this.timeout(5000);

      var spo = new SPO(options);
      spo.authenticate({
        siteUrl: process.env.SPONLINE_SITE_URL,
        appToken: process.env.SPONLINE_APP_TOKEN
      }, function (err) {
        spo.request('/web/title', function (err, response) {
          expect(err).to.be.null();
          expect(response).to.be.an('object');

          expect(response).to.have.property('_raw');
          expect(response._raw).to.be.a('object');

          done();
        });
      });
    });
  });
});