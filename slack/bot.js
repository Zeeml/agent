module.exports = function() {

}

var token = process.env.SLACK_API_TOKEN || '';

var RtmClient = require('@slack/client').RtmClient;
var rtm = new RtmClient(token);
rtm.start();

var WebClient = require('@slack/client').WebClient;
var web = new WebClient(token);

var channels = [];
var users = [];

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
           console.log(channels);
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
           console.log(users);
       }
    });
}

module.exports.channelHistory = function(channel) {
    web.channels.history(channel, function(err, info) {
       console.log(info);
    });
}

module.exports.listen = function() {
   var RTM_EVENTS = require('@slack/client').RTM_EVENTS;
   rtm.on(RTM_EVENTS.MESSAGE, function handleRtmMessage(message) {
     console.log('Message:', message); //this is no doubt the lamest possible message handler, but you get the idea
   });
}

module.exports.send = function() {

     var RTM_CLIENT_EVENTS = require('@slack/client').CLIENT_EVENTS.RTM;
     var channel = "#general";
     rtm.on(RTM_CLIENT_EVENTS.RTM_CONNECTION_OPENED, function () {
       rtm.sendMessage("Hello!", channel);
     });
}
