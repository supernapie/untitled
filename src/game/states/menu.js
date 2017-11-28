var createMenuState = function () {

    var that = {};

    that.menuGroup = undefined;
    that.spaceKey = undefined;
    that.switched = false;
    that.startText = undefined;
    that.blinkCount = 0;

    that.create = function () {

        this.menuGroup = game.add.group();
        this.menuGroup.x = game.world.centerX;
        this.menuGroup.y = game.world.centerY;

        var titleText = this.menuGroup.add(this.createText(0, -40, gameData.menu.title, titleFontName, 48));
        this.startText = this.menuGroup.add(this.createText(0, 40, (game.device.touch) ? gameData.menu.start.touch : gameData.menu.start.keyboard, fontName, 24));

        //  Register the key.
        this.spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

        //  Stop the following key from propagating up to the browser
        game.input.keyboard.addKeyCapture([ Phaser.Keyboard.SPACEBAR ]);

        this.switched = false;

        if (!game.device.desktop) {
            game.input.onDown.add(this.startFullScreen, this);
        }

    };

    that.update = function () {
        
        clouds.tilePosition.x += 1;

        if ((pad1.justPressed(Phaser.Gamepad.XBOX360_A) || this.spaceKey.downDuration(1000)) && !this.switched) {
            //console.log('switched');
            this.switched = true;
            game.state.start('sandbox');
        }

        this.blinkCount++;
        if (this.blinkCount > 15) {
            this.blinkCount = 0;
            this.startText.visible = !this.startText.visible;
        }

    };

    that.startFullScreen = function () {

        game.input.onDown.remove(this.startFullScreen, this);
        game.scale.startFullScreen(false);
        this.switched = true;
        // play the sounds on this interaction otherwise they won't start on mobile, because of stupid human interface guidelines
        //ambient.loopFull();
        //fx.play('coin');
        game.state.start('sandbox');

    };

    that.resize = function () {

        this.menuGroup.x = game.world.centerX;
        this.menuGroup.y = game.world.centerY;

    };

    that.shutdown = function () {

        this.menuGroup = undefined;
        this.spaceKey = undefined;
        this.startText = undefined;

    };

    that.createText = function (x, y, text, font, size) {

        var textSprite = game.add.text(x, y, text);
        textSprite.anchor.setTo(0.5);
        textSprite.font = font;
        textSprite.fontSize = size;
        textSprite.fill = colors.normalStroke;
        textSprite.align = 'center';

        return textSprite;

    };

    return that;

};

var menuState = createMenuState();
