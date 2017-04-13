var createSimplePlayer = function (playerdata) {

    var simplePlayer = game.add.sprite(playerdata.x, playerdata.y, 'tilda');

    simplePlayer.animations.add('run-left', [6, 7, 8], 12, true);
    simplePlayer.animations.add('idle-left', [5], 12, true);
    simplePlayer.animations.add('jump-left', [9], 12, true);
    simplePlayer.animations.add('slide-left', [14], 12, true);
    //simplePlayer.animations.add('flail-left', [17], 12, true);
    simplePlayer.animations.add('flail-left', [9], 12, true);
    simplePlayer.animations.add('run-right', [1, 2, 3], 12, true);
    simplePlayer.animations.add('idle-right', [0], 12, true);
    simplePlayer.animations.add('jump-right', [4], 12, true);
    simplePlayer.animations.add('slide-right', [15], 12, true);
    //simplePlayer.animations.add('flail-right', [16], 12, true);
    simplePlayer.animations.add('flail-right', [4], 12, true);
    simplePlayer.animations.add('climb', [10, 11, 12, 13], 12, true);
    simplePlayer.animations.add('climb-idle', [10], 12, true);

    simplePlayer.ani = 'idle-left';

    //console.log(simplePlayer);

    return simplePlayer;

};
