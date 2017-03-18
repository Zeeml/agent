module.exports = function(app) {
    var bodyParser = require('body-parser')
    app.use(bodyParser.json())

  app.get('/', function(req, res,next) {
      res.redirect('https://slack.com/oauth/authorize?client_id=117230330418.157030337063&scope=channels:history');
  });

  app.get('/success', function(req, res,next) {
      console.log(req);
  });

  app.post('/slack/receive', function(req, res,next) {
      console.log(req.body);
      res.header("Content-Type",'application/x-www-form-urlencoded');
      res.send(req.body.challenge);
  });

}
