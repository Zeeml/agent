module.exports = function() {
    //only consider message without sub type and containing url
}

var token = process.env.SLACK_API_TOKEN || '';

var RtmClient = require('@slack/client').RtmClient;
var rtm = new RtmClient(token);
rtm.start();

var WebClient = require('@slack/client').WebClient;
var web = new WebClient(token);

var channels = [];
var users = [];
var database;

module.exports.setDatabase = function(db) {
    database = db;
}

module.exports.load = function(callback) {
    var bot = this;
    bot.listUsers(function(err, data) {
        if (err) {
            process.stdout.write('Could not load list of users: ' + err);
        }
        users = data;
        bot.listChannels(function(err, data) {
            if (err) {
                process.stdout.write('Could not load list of channels: ' + err);
            } else {
                channels = data;
                for(var i in channels) {
                    bot.channelHistory(channels[i].id, function(err, data) {
                        if (!err) {
                            database.schedule(data)
                        }
                    });
                }
            }
        });
    });
}

module.exports.listChannels = function(callback) {
    var _this = this;
    web.channels.list(function(err, info) {
        var data = [];
        if (!err) {
            for(var i in info.channels) {
                data.push({id: info.channels[i].id, name: info.channels[i].name});
            }
        }
        callback(err, data);
    });
}

module.exports.listUsers = function(callback) {
    web.users.list(function(err, info) {
        var data = [];
        if (!err) {
            for(var i in info.members) {
                data.push({id: info.members[i].id, name: info.members[i].name})
            }
        }
        callback(err, data)
    });
}

var i = 0;
module.exports.channelHistory = function(channel, callback) {
    web.channels.history(channel, function(err, info) {
        if (!err) {
            for(var i in info.messages) {
                if (typeof database !== "undefined" && typeof info.messages[i].text == "string") {
                    var result = info.messages[i].text.match(/\<(https?:\/\/.*)\>/);
                    if (result && typeof result[1] !== "undefined") {
                        var user = users.find(u => u.id === info.messages[i].user);
                        callback(err, {url:result[1], user:user.name,ts: info.messages[i].ts})
                    }
                }
            }
        }
    });
}

module.exports.listen = function() {
   var RTM_EVENTS = require('@slack/client').RTM_EVENTS;
   rtm.on(RTM_EVENTS.MESSAGE, function handleRtmMessage(message) {
       if (typeof database !== "undefined" && typeof message.text == "string" && typeof message.subtype === "undefined") {
           var result = message.text.match(/\<(https?:\/\/.*)\>/);
           if (result && typeof result[1] !== "undefined") {
               database.schedule({url:result[1], user:'toto',ts: message.ts})
           }
       }
   });
}

module.exports.send = function() {

     var RTM_CLIENT_EVENTS = require('@slack/client').CLIENT_EVENTS.RTM;
     var channel = "#general";
     rtm.on(RTM_CLIENT_EVENTS.RTM_CONNECTION_OPENED, function () {
       rtm.sendMessage("Hello!", channel);
     });
}
