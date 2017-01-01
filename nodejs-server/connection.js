// librairies npm
var fs = require('fs')
var login = require('facebook-chat-api')

// librairies perso
var globals = require('./globals.js')
var friendslist = require('./friendslist.js')

function handleMessage(message) {
	var unrenderableMessage = ", unrenderable in Messer :("

	// seen message (not sent)
	if (!message.senderID)
		return

	var messageBody = null

	if (message.type != "message") {
		return
	}
	else if (message.body !== undefined && message.body != "") {
		console.log("New message sender " + message.senderID + ": " + message.body)
		messageBody = " - " + message.body
	}

	if (message.attachments.length == 0){
		console.log("New message from " + message.senderID + (messageBody || unrenderableMessage))
    globals.socket.emit('receive', {senderID: message.senderID, content: message.body})
  }else {
		var attachment = message.attachments[0]//only first attachment
		var attachmentType = attachment.type.replace(/\_/g, " ")
		console.log("New " + attachmentType + " from " + message.senderID + (messageBody || unrenderableMessage))
    globals.socket.emit('receive', {senderID: message.senderID, content: "New " + attachmentType + " from " + message.body})
	}

	lastThread = message.threadID
}

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
        api.listen(function (err, message) {
  				if (err) return console.error(err)
  				handleMessage(message)
  			})
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
        api.listen(function (err, message) {
  				if (err) return console.error(err)
  				handleMessage(message)
  			})
    })
}

exports.sendMessage = function(message) {
    globals.api.sendMessage(message.content, message.sendToId , function (err) {
        if (err) {
          globals.socket.emit('erreur', err)
        }else{
          globals.socket.emit('status', 'sent')
        }
    })
}
