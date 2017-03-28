var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use('/code',express.static(__dirname + '/pub/code'));
app.use('/assets',express.static(__dirname + '/pub/assets'));

app.get('/', function(req, res){
    res.sendFile(__dirname + '/pub/index.html');
});

io.on('connection', function(socket){

    console.log('a player connected');

    socket.on('newplayer', function(player) {
        console.log(player);
        socket.broadcast.emit('newplayer', player);
    });

    socket.on('disconnect', function(){
        console.log('player disconnected');
    });

});

http.listen(3000, function(){
    console.log('listening on *:3000');
});
