var menuState = {

    menuGroup: undefined,
    spaceKey: undefined,
    switched: false,

    create: function () {

        this.menuGroup = game.add.group();
        this.menuGroup.x = game.world.centerX;
        this.menuGroup.y = game.world.centerY;

        var titleSprite = this.menuGroup.add(this.createText(0, -40, gameData.menu.title, titleFontName, 48));
        var startSprite = this.menuGroup.add(this.createText(0, 40, (game.device.touch) ? gameData.menu.start.touch : gameData.menu.start.keyboard, fontName, 24));

        //  Register the key.
        this.spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

        //  Stop the following key from propagating up to the browser
        game.input.keyboard.addKeyCapture([ Phaser.Keyboard.SPACEBAR ]);

        this.switched = false;

        if (!game.device.desktop) {
            game.input.onDown.add(this.startFullScreen, this);
        }

    },

    update: function () {

        if (this.spaceKey.downDuration(1000) && !this.switched) {
            //console.log('switched');
            this.switched = true;
            game.state.start('game');
        }
    },

    startFullScreen: function () {

        game.input.onDown.remove(this.startFullScreen, this);
        game.scale.startFullScreen(false);
        this.switched = true;
        game.state.start('game');

    },

    resize: function () {

        this.menuGroup.x = game.world.centerX;
        this.menuGroup.y = game.world.centerY;

    },

    shutdown: function () {

        this.menuGroup = undefined;
        this.spaceKey = undefined;

    },

    createText: function (x, y, text, font, size) {

        var textSprite = game.add.text(x, y, text);
        textSprite.anchor.setTo(0.5);
        textSprite.font = font;
        textSprite.fontSize = size;
        textSprite.fill = colors.normalStroke;
        textSprite.align = 'center';

        return textSprite;

    }
};
