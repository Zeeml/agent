
module.exports = function(app) {
    var bodyParser = require('body-parser')
    app.use(bodyParser.json())

  app.get('/', function(req, res,next) {
        var WebClient = require('@slack/client').WebClient;
        var token = process.env.SLACK_API_TOKEN || ''; //see section above on sensitive data
        var web = new WebClient(token);
        web.chat.postMessage('C1232456', 'Hello there', function(err, res) {
          if (err) {
              console.log('Error:', err);
          } else {
              console.log('Message sent: ', res);
          }
        });
  });
}
