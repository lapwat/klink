// librairies npm
var http = require('http');
var express = require('express');
var ecstatic = require('ecstatic');
var fileExists = require('file-exists');

// librairies perso
var globals = require('./globals.js');
var connection = require('./connection.js');
var friendslist = require('./friendslist.js');

var app = express().use(ecstatic({root: __dirname + '/public'}));
var server = http.createServer(app).listen(8080);
var io = require('socket.io').listen(server);
console.log('Listening on :8080');

// initialisation
io.sockets.on('connection', function (socket) {
    globals.socket = socket;

    // connexion au compte Facebook
    globals.socket.on('login', function(credentials) {
        socket.emit('status', 'loading');
        connection.credsLog(credentials);
    });

    globals.socket.on('background_ready', function() {
        // essai connection avec appstate.json
        if (fileExists('appstate.json')) {
            connection.autoLog();
        }
    });

    globals.socket.on('ready', function() {
        if (fileExists('appstate.json')) {
            globals.socket.emit('status', 'loading');
            // if (!globals.api) {
            //     connection.autoLog(function() {
            //         friendslist.sendFriendsList(30);
            //     });
            // } else {
                friendslist.sendFriendsList(30);
            // }

        }
    });

    // partage d'un lien
    globals.socket.on('share_order', function (message) {
        if (message.body === '') {
            globals.api.sendMessage({url: message.link}, message.id);
        } else {
            globals.api.sendMessage({body: message.body, url: message.link}, message.id);
        }
        globals.socket.emit('share_ok', message);
    });
});
