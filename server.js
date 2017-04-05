var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use('/code',express.static(__dirname + '/pub/code'));
app.use('/assets',express.static(__dirname + '/pub/assets'));

app.get('/', function(req, res){
    res.sendFile(__dirname + '/pub/index.html');
});

var players = [];

io.on('connection', function(socket){

    console.log('a player connected');

    var id = players.length;
    var player = {id: id, x: 0, y: 0, ani: 'idle-left'};
    players.push(player);

    socket.on('updateplayer', function(playerdata) {
        //console.log('playerdata');
        player.x = (playerdata.x) ? playerdata.x : 0;
        player.y = (playerdata.y) ? playerdata.y : 0;
        player.ani = (playerdata.ani) ? playerdata.ani : 'idle-left';
        socket.broadcast.emit('updateplayer', player);
    });

    socket.on('disconnect', function(){
        console.log('player disconnected');
        socket.broadcast.emit('removeplayer', player);
    });

});

http.listen(3000, function(){
    console.log('listening on *:3000');
});
