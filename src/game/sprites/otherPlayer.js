var createOtherPlayer = function (playerdata) {

    var otherPlayer = createSimplePlayer(playerdata);

    game.physics.enable(otherPlayer, Phaser.Physics.ARCADE);
    //otherPlayer.body.bounce.y = 0.2;
    otherPlayer.body.allowGravity = false;
    otherPlayer.body.collideWorldBounds = true;
    otherPlayer.body.setSize(8, 16, 12, 16);

    otherPlayer.receive = function (playerdata) {

        otherPlayer.xHome = playerdata.x;
        otherPlayer.yHome = playerdata.y;
        otherPlayer.ani = playerdata.ani;
        if (otherPlayer.key !== playerdata.key) {
            otherPlayer.loadTexture(playerdata.key, otherPlayer.frame, false);
        }

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
