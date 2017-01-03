var socket = io.connect('http://localhost:8080');
socket.emit('background_ready');
