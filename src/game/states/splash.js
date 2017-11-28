var createSplashState = function () {

    var that = {};

    that.text = undefined;

    that.create = function () {

        //ambient = game.add.audio('ambient');
        //ambient.loopFull();

        clouds = game.make.tileSprite(0, 0, game.width, game.height, 'clouds');
        game.stage.addChildAt(clouds, 0);

        var text = this.text = game.add.text(game.world.centerX, game.world.centerY, gameData.splash.title);
        text.anchor.setTo(0.5);

        text.font = fontName;
        text.fontSize = 20;

        text.fill = colors.normalStroke;

        text.align = 'center';

        game.time.events.add(Phaser.Timer.SECOND * 3, function () {
            game.state.start('menu');
        }, this);

    };

    that.update = function () {
        clouds.tilePosition.x += 1;
    };

    that.resize = function () {

        var text = this.text;
        text.x = game.world.centerX;
        text.y = game.world.centerY;

    };

    that.shutdown = function () {

        this.text = undefined;

    };

    return that;

};

var splashState = createSplashState();
