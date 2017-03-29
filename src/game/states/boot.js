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

        // go on to preloading
        game.state.start('load');

    };

    return that;

};

var bootState = createBootState();
