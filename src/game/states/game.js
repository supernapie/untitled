var createGameState = function () {

    var that = {};

    that.text = undefined;

    that.create = function () {

        var text = this.text = game.add.text(game.world.centerX, game.world.centerY, "The game will start\nNOW!");
        text.anchor.setTo(0.5);
        text.font = fontName;
        text.fontSize = 20;
        text.fill = colors.normalStroke;
        text.align = 'center';

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

var gameState = createGameState();
