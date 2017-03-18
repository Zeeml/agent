//Loading colors module to make display more readable, made global
var colors = require('colors');

//loading express
process.stdout.write("Loading express....");
try {
    var express = require('express');
    var app = express();
    process.stdout.write(colors.green('OK\n'));
} catch (exception) {
    process.stdout.write(colors.red('NOK\n'));
    process.exit(1);
}

//Loading the configuration file
process.stdout.write('Reading config file....');
try {
    var config = require('./config')
    process.stdout.write(colors.green('OK\n'));
} catch (exception) {
    process.stdout.write(colors.red('NOK\n'));
    process.exit(1);
}

//Loading routes
process.stdout.write('Loading requests....');
try {
    var requests = require('./requests')(app);
    process.stdout.write(colors.green('OK\n'));
} catch (exception) {
    process.stdout.write(colors.red('NOK\n'));
    process.exit(1);
}


//loading http server
process.stdout.write("Loading http server....");
try {
    var server = require(config.protocol).createServer(app);
    process.stdout.write(colors.green('OK\n'));
} catch (exception) {
    process.stdout.write(colors.red('NOK\n'));
    process.exit(1);
}

var RtmClient = require('@slack/client').RtmClient;
var RTM_EVENTS = require('@slack/client').RTM_EVENTS;
var bot_token = process.env.SLACK_BOT_TOKEN || '';

var rtm = new RtmClient(bot_token);

rtm.on(RTM_EVENTS.MESSAGE, function handleRtmMessage(message) {
  console.log('Message:', message); //this is no doubt the lamest possible message handler, but you get the idea
});

rtm.start();

process.stdout.write(colors.yellow('Listening on port ' + config.port + '...\n'));
server.listen(config.port);
