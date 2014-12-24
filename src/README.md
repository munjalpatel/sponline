sponline
========

Node library for SharePoint Online

---
### Supported Operations

- Authenticate
- Get context user
- Get form digest

### Installation
`npm install sponline --save`

### Usage

    var SPO = require('sponline');
    
    var options = {
      clientId: process.env.SPONLINE_CLIENT_ID,
      clientSecret: process.env.SPONLINE_CLIENT_SECRET
    };
    
    var spo = new SPO(options);
    spo.authenticate({
      siteUrl: process.env.SPONLINE_SITE_URL,
      appToken: process.env.SPONLINE_APP_TOKEN
    }, function (err, response) {
      if (err) throw new Error(err);
        
      console.log('Access Token: ' + response.accessToken);
      console.log('Refresh Token: ' + response.refreshToken);
        
      spo.getCurrentUser(function (err, response) {
        if (err) throw new Error(err);
        console.log('Current User: ' + response.name);
      });
        
      spo.getFormDigest(function (err, response) {
        if (err) throw new Error(err);
        console.log('Form Digest: ' + response.digest);
      });
        
      spo.request('/web/title', function (err, response) {
        if (err) throw new Error(err);
        console.log('Web Title: ' + response._raw.Title);
      });
    });