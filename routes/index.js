
module.exports = function(app) {
    var bodyParser = require('body-parser')
    app.use(bodyParser.json())

  app.get('/', function(req, res,next) {
      res.send('Hello There');
  });

  app.post('/slack/receive', function(req, res,next) {
      console.log(request.body);
      response.send(request.body.challenge);
  });

}
