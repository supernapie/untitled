var loadState = {

    nFontChecks: 0,
    text: undefined,    

    preload: function () {

        // load any resources for the preloader here

    },

    start: function () {

        // add all game assets for preloading here
        game.load.json('gameData', 'assets/data/game.json');
        game.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js');
        //game.load.image('square', 'assets/sprites/square.png');
        //game.load.audio('sfx', 'assets/sounds/fx_mixdown.mp3');
        //game.load.audio('ambient', ['assets/audio/ambient_mixdown.mp3', 'assets/audio/ambient_mixdown.ogg']);
        // ...

        game.load.start();

    },

    create: function () {

        game.load.onLoadStart.add(this.loadStart, this);
        game.load.onLoadComplete.add(this.loadComplete, this);

        // simple percentage text
        var text = this.text = game.add.text(game.world.centerX, game.world.centerY, '0%');
        text.anchor.setTo(0.5);
        text.font = 'monospace';
        text.fontSize = 16;
        text.fill = colors.normalStroke;
        text.align = 'center';

        this.start();

    },

    update: function () {

        this.text.text = game.load.progress + '%';

    },

    loadStart: function () {

    },

    loadComplete: function () {

        // process some things like audio sprites
        //fx = game.add.audio('sfx');
        //fx.allowMultiple = true;
        //fx.addMarker('coin', 1, 0.5);
        // ...

        gameData = game.cache.getJSON('gameData');
        //console.log(gameData);
        this.checkFontLoaded();

    },

    checkFontLoaded: function () {

        loadState.nFontChecks++;
        if ((fontName == googleFontName) || (loadState.nFontChecks >= 6)) {
            game.state.start('splash');
        } else {
            setTimeout(loadState.checkFontLoaded, 500);
        }

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
