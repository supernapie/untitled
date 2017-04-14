var createSteerablePlayer = function (playerdata) {

    // private, can't set values change
    var facing = 'left';
    var idle = false;
    var jumpTimer = 0;
    var canClimb = false;
    var isClimbing = false;
    var climbTimer = 0;
    var playerSpeed = 0;

    var steerablePlayer = createSimplePlayer(playerdata);

    game.physics.enable(steerablePlayer, Phaser.Physics.ARCADE);
    //steerablePlayer.body.bounce.y = 0.2;
    //steerablePlayer.body.allowGravity = false;
    steerablePlayer.body.collideWorldBounds = true;
    steerablePlayer.body.setSize(8, 16, 12, 16);

    steerablePlayer.speedMax = 125;
    steerablePlayer.speedChange = 10;

    var keys = {up: false, down: false, left: false, right: false, space: false};

    steerablePlayer.receive = function (keys) {

        keys = keys;

    };

    steerablePlayer.update = function () {


    };

    //console.log('create');
    //console.log(steerablePlayer);

    return steerablePlayer;

};
