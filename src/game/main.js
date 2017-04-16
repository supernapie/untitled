var game;
var gameData;

var pad1;
var gameIndex = 1;
var myIp = '';
var myId = 0;

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

var colors = {normalBG: '#91d2d9', normalStroke: '#f2785c'};
var tints = {normalBG: 0x91d2d9, normalStroke: 0xf2785c};

var socket = io();

window.onload = function() {

    //var isInIframe = (parent !== window);
    //console.log(isInIframe);
    //console.log(document.referrer);

    game = new Phaser.Game("100%", "100%", Phaser.CANVAS, '');

    game.state.add('boot', bootState);
    game.state.add('load', loadState);
    game.state.add('splash', splashState);
    game.state.add('menu', menuState);
    game.state.add('game', gameState);
    game.state.add('sandbox', sandboxState);

    game.state.start('boot');

    // improved experience for games in iframes
    window.focus();
    document.body.addEventListener('click',function(e) {
        window.focus();
    },false);

};
