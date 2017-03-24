var createLoadState =  function () {

    var that = {};

    that.nFontChecks = 0;
    that.text = undefined;

    that.preload = function () {

        // load any resources for the preloader here

    };

    that.start = function () {

        // add all game assets for preloading here
        game.load.json('gameData', 'assets/data/game.json');
        game.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js');
        //game.load.image('square', 'assets/sprites/square.png');
        //game.load.audio('sfx', 'assets/sounds/fx_mixdown.mp3');
        game.load.tilemap('sandbox', 'assets/tilemaps/data/sandbox.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.image('groundTiles', 'assets/tilemaps/tiles/groundTiles.png');
        game.load.spritesheet('tilda', 'assets/sprites/tilda.png', 16, 16);

        game.load.start();

    };

    that.create = function () {

        //game.load.onLoadStart.add(this.loadStart, this);
        game.load.onLoadComplete.add(this.loadComplete, this);

        // simple percentage text
        var text = this.text = game.add.text(game.world.centerX, game.world.centerY, '0%');
        text.anchor.setTo(0.5);
        text.font = 'monospace';
        text.fontSize = 16;
        text.fill = colors.normalStroke;
        text.align = 'center';

        this.start();

    };

    that.update = function () {

        this.text.text = game.load.progress + '%';

    };

    that.loadStart = function () {

    };

    that.loadComplete = function () {

        //game.load.onLoadStart.remove(this.loadStart, this);
        game.load.onLoadComplete.remove(this.loadComplete, this);

        // process some things like audio sprites
        //fx = game.add.audio('sfx');
        //fx.allowMultiple = true;
        //fx.addMarker('coin', 1, 0.5);
        // ...

        gameData = game.cache.getJSON('gameData');
        //console.log(gameData);
        this.checkFontLoaded();

    };

    that.checkFontLoaded = function () {

        this.nFontChecks++;
        if ((fontName == googleFontName) || (this.nFontChecks >= 6)) {
            game.state.start('splash');
        } else {
            setTimeout(that.checkFontLoaded, 500);
        }

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

var loadState = createLoadState();
