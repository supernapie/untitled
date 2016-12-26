var game;
var gameData;

var fontName = 'sans-serif';
var googleFontName = 'Varela Round';
var titleFontName = 'serif';
var titleGoogleFontName = 'Alice';

WebFontConfig = {
    active: function() { fontName = googleFontName; titleFontName = titleGoogleFontName; },
    google: { families: [ googleFontName, titleGoogleFontName ] }
};

var fx;
var ambient;
var audioFallback = (Phaser.Device.isAndroidStockBrowser()) ? true : false;
window.PhaserGlobal = { disableWebAudio: audioFallback };

var colors = {normalBG: '#2c3e50', normalStroke: '#ecf0f1'};
var tints = {normalBG: 0x2c3e50, normalStroke: 0xecf0f1};

window.onload = function() {

    game = new Phaser.Game("100%", "100%", Phaser.CANVAS, '');

    game.state.add('boot', bootState);
    game.state.add('load', loadState);
    game.state.add('splash', splashState);
    game.state.add('menu', menuState);
    game.state.add('game', gameState);

    game.state.start('boot');

    // improved experience for games in iframes
    window.focus();
    document.body.addEventListener('click',function(e) {
        window.focus();
    },false);

};
