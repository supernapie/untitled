var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use('/code',express.static(__dirname + '/pub/code'));
app.use('/img',express.static(__dirname + '/pub/img'));
app.use('/assets',express.static(__dirname + '/pub/assets'));
app.use('/icons',express.static(__dirname + '/pub/icons'));

app.get('/', function(req, res){
    res.sendFile(__dirname + '/pub/index.html');
});

var players = [];

io.on('connection', function(socket){

    console.log('a player connected');

    var id = players.length;
    var player = {id: id, x: 0, y: 0, ani: 'idle-left', key: 'tilda', ip: socket.request.connection.remoteAddress};
    console.log(player);
    players.push(player);

    socket.on('whoami', function(data) {
        // if there isn't a bunny already the player can be it
        player.key = 'tilda-bunny';
        players.forEach(function (otherPlayer) {
            if (otherPlayer !== undefined && otherPlayer.id !== id && otherPlayer.key.indexOf('bunny') > -1) {
                player.key = 'tilda';
            }
        });
        socket.emit('me', player);
    });

    socket.on('updateplayer', function(playerdata) {
        //console.log('playerdata');
        player.x = (playerdata.x) ? playerdata.x : 0;
        player.y = (playerdata.y) ? playerdata.y : 0;
        player.ani = (playerdata.ani) ? playerdata.ani : 'idle-left';
        player.key = (playerdata.key) ? playerdata.key : 'tilda';
        socket.broadcast.emit('updateplayer', player);
    });

    socket.on('newbunny', function(playerdata) {
        //console.log('playerdata');
        player.x = (playerdata.x) ? playerdata.x : 0;
        player.y = (playerdata.y) ? playerdata.y : 0;
        player.ani = (playerdata.ani) ? playerdata.ani : 'idle-left';
        player.key = (playerdata.key) ? playerdata.key : 'tilda';
        socket.broadcast.emit('newbunny', player);
    });

    socket.on('disconnect', function(){
        console.log('player disconnected');
        socket.broadcast.emit('removeplayer', player);
        players[id] = undefined;
    });

});

http.listen(3000, function(){
    console.log('listening on *:3000');
});
