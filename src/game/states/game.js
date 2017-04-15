var createGameState = function () {

    var that = {};

    that.map = undefined;
    that.layer = undefined;
    that.player = undefined;
    that.cursors = undefined;
    that.jumpButton = undefined;

    that.otherPlayers = undefined;
    that.lastUpdate = undefined;
    that.forceUpdate = false;

    // can/must set values in substate
    that.tilemapName = 'levelx';
    that.tilesetImageName = 'tilesx';
    that.startPoint = {x: 32, y: 32};
    that.tileOnlyUp = [161,162,163, 177,178,179, 193,194,195, 209,210,211, 225,226,227, 241,242,243];

    // private, can't set values change
    that.resizeTO = 0;

    that.create = function () {

        game.time.advancedTiming = true; // for debuging the fps

        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.physics.arcade.gravity.y = 500;

        this.map = game.add.tilemap(this.tilemapName);
        this.map.addTilesetImage(this.tilesetImageName);

        this.map.setCollisionBetween(1, 112); // always collide on all sides(walls,solid platforms,ceilings,...)
        this.map.forEach(this.setCollisionOnlyUp, this, 0, 0, 128, 128); // only collide things falling on it(tops of climbing walls,...)

        this.layer = this.map.createLayer('baselayer');
        //this.layer.debug = true;
        this.layer.resizeWorld();

        this.player = createSteerablePlayer({x: this.startPoint.x, y: this.startPoint.y});
        this.player.layer = this.layer;

        game.camera.follow(this.player);

        this.cursors = game.input.keyboard.createCursorKeys();
        this.jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

        game.touchControl = this.game.plugins.add(Phaser.Plugin.TouchControl);
        game.touchControl.inputEnable();

        this.otherPlayers = [];

        socket.on('updateplayer', function (playerdata) {
            //console.log('updateplayer');
            if (that.otherPlayers[playerdata.id]) {
                that.otherPlayers[playerdata.id].receive(playerdata);
            } else {
                that.otherPlayers[playerdata.id] = createOtherPlayer(playerdata);
                that.forceUpdate = true;
            }
        });

        socket.on('removeplayer', function (playerdata) {
            if (that.otherPlayers[playerdata.id]) {
                that.otherPlayers[playerdata.id].destroy();
                that.otherPlayers[playerdata.id] = undefined;
            }
        });

        this.lastUpdate = {x: 0, y: 0, ani: 'idle-left'};

    };

    that.setCollisionOnlyUp = function (tile) {
        //console.log(tile.index);
        tile.collideUp = (that.tileOnlyUp.indexOf(tile.index) > -1) ? true : tile.collideUp;
        tile.collideDown = (that.tileOnlyUp.indexOf(tile.index) > -1) ? false : tile.collideDown;
        tile.collideLeft = (that.tileOnlyUp.indexOf(tile.index) > -1) ? false : tile.collideLeft;
        tile.collideRight = (that.tileOnlyUp.indexOf(tile.index) > -1) ? false : tile.collideRight;
    };

    that.update = function () {

        // pass player input

        this.player.keys.up = this.cursors.up.isDown
                || game.touchControl.cursors.up
                || pad1.isDown(Phaser.Gamepad.XBOX360_DPAD_UP)
                || pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y) < -0.1;

        this.player.keys.down = this.cursors.down.isDown
                || game.touchControl.cursors.down
                || pad1.isDown(Phaser.Gamepad.XBOX360_DPAD_DOWN)
                || pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y) > 0.1;

        this.player.keys.left = this.cursors.left.isDown
                || game.touchControl.cursors.left
                || pad1.isDown(Phaser.Gamepad.XBOX360_DPAD_LEFT)
                || pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) < -0.1;

        this.player.keys.right = this.cursors.right.isDown
                || game.touchControl.cursors.right
                || pad1.isDown(Phaser.Gamepad.XBOX360_DPAD_RIGHT)
                || pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) > 0.1;

        this.player.keys.space = this.jumpButton.isDown
                || game.touchControl.cursors.space
                || pad1.justPressed(Phaser.Gamepad.XBOX360_A);

        // send update to socket.io

        if (this.forceUpdate || this.player.x !== this.lastUpdate.x || this.player.y !== this.lastUpdate.y || this.player.ani !== this.lastUpdate.ani) {
            this.lastUpdate.x = this.player.x;
            this.lastUpdate.y = this.player.y;
            this.lastUpdate.ani = this.player.ani;
            socket.emit('updateplayer', this.lastUpdate);
            this.forceUpdate = false;
        }

    };

    that.resize = function () {

        clearTimeout(that.resizeTO);
        that.resizeTO = setTimeout(function () {
            that.layer.resize(game.camera.width, game.camera.height);
        }, 1000);

    };

    that.shutdown = function () {

        this.map = undefined;
        this.layer = undefined;
        this.player = undefined;
        this.cursors = undefined;
        this.jumpButton = undefined;

    };

    that.render = function () {

        game.debug.text('FPS: ' + game.time.fps, 32, 32, "#ffffff");
        //game.debug.text('physicsElapsed: ' + game.time.physicsElapsed, 32, 32, "#ffffff");
        //game.debug.spriteInfo(this.player, 32, 64);

    };

    return that;

};

var gameState = createGameState();
