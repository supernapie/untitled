var createBootState = function () {

    var that = {};

    that.create = function () {

        // do settings
        game.stage.backgroundColor = colors.normalBG;
        game.scale.scaleMode = Phaser.ScaleManager.RESIZE;
        game.scale.fullScreenScaleMode = Phaser.ScaleManager.RESIZE;
        game.stage.smoothed = false; // none pixelated effect
        game.input.mouse.capture = true;

        // do not pause game when browser window loses focus
        game.stage.disableVisibilityChange = true;

        // show fullscreen button? only on desktop and not on kongregate :(
        if (game.device.desktop && document.referrer.indexOf('kongregate') <= -1) {

            document.getElementById('fs-button').style.display = 'block';

            document.getElementById('fs-button').addEventListener('click', function (e) {
                if (game.scale.isFullScreen) {
                    game.scale.stopFullScreen();
                } else {
                    game.scale.startFullScreen(false);
                }
                document.getElementById('fs-button').style.display = 'none';
            });

            game.scale.onFullScreenChange.add(function (scale) {
                if (scale.isFullScreen) {
                    document.getElementById('fs-button').style.display = 'none';
                } else {
                    document.getElementById('fs-button').style.display = 'block';
                }
            }, this);

        }

        game.input.gamepad.start();
        pad1 = game.input.gamepad.pad1;

        // go on to preloading
        game.state.start('load');

    };

    return that;

};

var bootState = createBootState();
