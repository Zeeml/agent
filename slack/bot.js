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

module.exports.listChannels = function() {
    var _this = this;
    web.channels.list(function(err, info) {
       if (err) {
           console.log('Error:', err);
       } else {
           for(var i in info.channels) {
               channels.push({id: info.channels[i].id, name: info.channels[i].name});
               _this.channelHistory(info.channels[i].id);
           }
       }
    });
}

module.exports.listUsers = function() {
    web.users.list(function(err, info) {
       if (err) {
           console.log('Error:', err);
       } else {
           for(var i in info.members) {
               users.push({id: info.members[i].id, name: info.members[i].name})
           }
       }
    });
}

var i = 0;
module.exports.channelHistory = function(channel) {
    web.channels.history(channel, function(err, info) {
        for(var i in info.messages) {
            if (typeof database !== "undefined" && typeof info.messages[i].text == "string") {
                var result = info.messages[i].text.match(/\<(https?:\/\/.*)\>/);
                if (result && typeof result[1] !== "undefined") {
                    database.schedule({url:result[1], user:'toto',ts: info.messages[i].ts})
                    console.log(result[1]);
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
