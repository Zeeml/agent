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

// loading mongodb

//loading http server
process.stdout.write("Loading http server....");
try {
    var server = require(config.protocol).createServer(app);
    process.stdout.write(colors.green('OK\n'));
} catch (exception) {
    process.stdout.write(colors.red('NOK\n'));
    process.exit(1);
}

process.stdout.write("Loading the mongo db....");
try {
    db = new (require('./database/mongo'))(require('./config'))
    process.stdout.write(colors.green('OK\n'));
}  catch (exception) {
    console.log(exception);
    process.stdout.write(colors.red('NOK\n'));
    process.exit(1);
}

//Loading routes
process.stdout.write('Loading Slack bot....');
try {
    var slackBot = require('./slack/bot');
    slackBot.setDatabase(db);
    slackBot.listChannels();
    slackBot.listUsers();
    slackBot.listen()
    process.stdout.write(colors.green('OK\n'));
} catch (exception) {
    console.log(exception);
    process.stdout.write(colors.red('NOK\n'));
    process.exit(1);
}


process.stdout.write(colors.yellow('Listening on port ' + config.port + '...\n'));
server.listen(config.port);
