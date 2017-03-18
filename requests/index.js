
module.exports = function(app) {
  app.get('/', function(req, res,next) {
      res.send('Hello There');
  });

  app.get('/slack', function(req, res,next) {

  });

}
