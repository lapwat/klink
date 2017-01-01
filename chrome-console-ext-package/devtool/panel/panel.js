var con = new SimpleConsole({
	handleCommand: handle_command,
	placeholder: "Enter your message",
	storageID: "simple-console demo",
	sys: false// TODO: Become setting in option page, Debug function
});
document.body.appendChild(con.element);

var socket = io.connect('http://localhost:8080')
var sendToId = window.localStorage.sendToId || 0;
var try_login = false

function handle_command(command){
	socket.emit('send', {sendToId:sendToId, content: command})
}



con.sys('Initialize...')

// initialisation user list
socket.on('user_list', function(threads) {
		con.sys('user_list got')
		threads.forEach(
		function (val, i) {
				if(val.id == sendToId) con.setPlaceholder('Send message to ' + val.name);
    })
})

socket.on('status', function(status) {
		con.sys(status)
    switch (status) {
        case 'connected':
            break
        case 'loading':
            break
        case 'disconnected':
            break
        default:
    }
})

socket.on('receive', function (message) {
	if(message.senderID == sendToId)
		con.warn(message.content);
})

socket.on('share_ok', function (message) {
    con.sys('Link shared to ' + message.name + ' !')
})

socket.on('erreur', function(err) {
    switch (err) {
        case 'Wrong username/password.':
            if(!try_login && window.localStorage.account){
							con.sys('try to login ...')
              socket.emit('login',
                {
                  email: window.localStorage.account,
                  password: window.localStorage.password
                })
              try_login = true
            }else{
					    con.error('Please setup username/password on setting first!')
						}
            break
        default:
				    con.error(err)
    }
})

socket.emit('ready')
con.sys('connecting...')
