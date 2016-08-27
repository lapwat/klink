var https = require('https');
var fs = require('fs');

var globals = require('./globals.js');


exports.sendFriendsList = function(length) {
    globals.api.getThreadList(0, length, function(err, arr) {
        var threads = [];
        var ids = [];
        for (var i = 0; i < arr.length; i++) {
            threads.push({id: arr[i].threadID, name: arr[i].name, image: arr[i].imageSrc, group: arr[i].participantIDs.length > 2});
            ids.push(arr[i].threadID);
        }
        globals.api.getUserInfo(ids, function(err, ret) {
            if(err) return console.error(err);
            for (var i = 0; i < threads.length; i++) {
                if (threads[i].name === '') {
                    if (threads[i].group) {
                        threads[i].name = 'Group of ' + arr[i].participantIDs.length + ' people';
                    } else {
                        threads[i].name = ret[threads[i].id].name;
                    }
                }
            }
            globals.socket.emit('status', 'connected');
            globals.socket.emit('user_list', threads);
        });
    });
}
