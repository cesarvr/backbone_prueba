var app = require('express')();


var Emitter = function(app){


//server.listen(1183);

var server = require('http').Server(app);
var io = require('socket.io')(server);
server.listen(3001);

app.get('/emitter', function (req, res) {
 // res.sendfile(__dirname + '/index.html');
 res.send('emitter listen here!');
});

return {

	sendRefresh: function(){
		console.log('sending signal..');
		//io.on('connection', function (socket) {
  			io.emit('refresh', { for: 'everyone' });
		//});
	}

}

	

}

module.exports = Emitter;