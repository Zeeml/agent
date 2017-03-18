module.exports = function(app) {
    var bodyParser = require('body-parser')
    app.use(bodyParser.json())

  app.get('/', function(req, res,next) {
      res.send('Hello There');
  });

  app.post('/slack/receive', function(req, res,next) {
      console.log(req.body);
      res.header("Content-Type",'application/x-www-form-urlencoded');
      res.send(req.body.challenge);
  });

}
