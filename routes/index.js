
module.exports = function(app) {
    var bodyParser = require('body-parser')
    app.use(bodyParser.json())

  app.get('/', function(req, res,next) {
      res.send('Hello There');
  });

  app.get('/slack/receive', function(req, res,next) {
      response.send(request.body.challenge); 
  });

}
