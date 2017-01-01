// librairies npm
var fs = require('fs')
var login = require('facebook-chat-api')

// librairies perso
var globals = require('./globals.js')
var friendslist = require('./friendslist.js')

exports.credsLog = function(credentials) {
    login({email: credentials.email, password: credentials.password}, function callback (err, api) {
        if(err) {
            globals.socket.emit('status', 'disconnected')
            globals.socket.emit('erreur', err.error)
        } else {
            globals.api = api
            fs.writeFileSync('appstate.json', JSON.stringify(api.getAppState()))
            globals.socket.emit('status', 'connected')
            friendslist.sendFriendsList(50)
        }
    })
}

exports.autoLog = function() {
    login({appState: JSON.parse(fs.readFileSync('appstate.json', 'utf8'))}, function callback (err, api) {
        if(err) {
            globals.socket.emit('status', 'disconnected')
            globals.socket.emit('erreur', err)
        } else {
            globals.api = api
        }
    })
}

exports.sendMessage = function(message) {
    globals.api.sendMessage(message.content, message.sendToId , function (err) {
        if (err) {
          globals.socket.emit('erreur', err)
        }
    })
}
