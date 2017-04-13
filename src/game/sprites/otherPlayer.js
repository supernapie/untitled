var createOtherPlayer = function (playerdata) {

    var otherPlayer = createSimplePlayer(playerdata);

    otherPlayer.receive = function (playerdata) {

        otherPlayer.xHome = playerdata.x;
        otherPlayer.yHome = playerdata.y;
        otherPlayer.ani = playerdata.ani;

    };

    otherPlayer.receive(playerdata);

    otherPlayer.update = function () {

        otherPlayer.x += (otherPlayer.xHome - otherPlayer.x) / 2;
        otherPlayer.y += (otherPlayer.yHome - otherPlayer.y) / 2;
        otherPlayer.animations.play(otherPlayer.ani);

    };

    //console.log(otherPlayer);

    return otherPlayer;

};
