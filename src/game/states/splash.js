var splashState = {

    text: undefined,

    create: function () {

        ambient = game.add.audio('ambient');
        ambient.loopFull();

        var text = this.text = game.add.text(game.world.centerX, game.world.centerY, gameData.splash.title);
        text.anchor.setTo(0.5);

        text.font = fontName;
        text.fontSize = 20;

        text.fill = colors.normalStroke;

        text.align = 'center';

        game.time.events.add(Phaser.Timer.SECOND * 3, function () {
            game.state.start('menu');
        }, this);

    },

    resize: function () {

        var text = this.text;
        text.x = game.world.centerX;
        text.y = game.world.centerY;

    },

    shutdown: function () {

        this.text = undefined;

    }

};
