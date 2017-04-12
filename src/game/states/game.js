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
    that.facing = 'left';
    that.jumpTimer = 0;
    that.canClimb = false;
    that.isClimbing = false;
    that.climbTimer = 0;
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

        this.player = this.createSimplePlayer({x: this.startPoint.x, y: this.startPoint.y});

        game.physics.enable(this.player, Phaser.Physics.ARCADE);
        //this.player.body.bounce.y = 0.2;
        //this.player.body.allowGravity = false;
        this.player.body.collideWorldBounds = true;
        this.player.body.setSize(8, 16, 12, 16);

        game.camera.follow(this.player);

        this.cursors = game.input.keyboard.createCursorKeys();
        this.jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

        game.touchControl = this.game.plugins.add(Phaser.Plugin.TouchControl);
        game.touchControl.inputEnable();

        this.otherPlayers = [];

        socket.on('updateplayer', function (playerdata) {
            //console.log('updateplayer');
            if (that.otherPlayers[playerdata.id]) {
                that.otherPlayers[playerdata.id].xHome = playerdata.x;
                that.otherPlayers[playerdata.id].yHome = playerdata.y;
                that.otherPlayers[playerdata.id].ani = playerdata.ani;
            } else {
                that.otherPlayers[playerdata.id] = that.createSimplePlayer(playerdata);
                that.otherPlayers[playerdata.id].xHome = that.otherPlayers[playerdata.id].x;
                that.otherPlayers[playerdata.id].yHome = that.otherPlayers[playerdata.id].y;
                that.otherPlayers[playerdata.id].ani = playerdata.ani;
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

    that.createSimplePlayer = function (playerdata) {

        var simplePlayer = game.add.sprite(playerdata.x, playerdata.y, 'tilda');

        simplePlayer.animations.add('run-left', [6, 7, 8], 12, true);
        simplePlayer.animations.add('idle-left', [5], 12, true);
        simplePlayer.animations.add('jump-left', [9], 12, true)
        simplePlayer.animations.add('run-right', [1, 2, 3], 12, true);
        simplePlayer.animations.add('idle-right', [0], 12, true);
        simplePlayer.animations.add('jump-right', [4], 12, true)
        simplePlayer.animations.add('climb', [10, 11, 12, 13], 12, true);
        simplePlayer.animations.add('climb-idle', [10], 12, true);

        return simplePlayer;

    };

    that.setCollisionOnlyUp = function (tile) {
        //console.log(tile.index);
        tile.collideUp = (that.tileOnlyUp.indexOf(tile.index) > -1) ? true : tile.collideUp;
        tile.collideDown = (that.tileOnlyUp.indexOf(tile.index) > -1) ? false : tile.collideDown;
        tile.collideLeft = (that.tileOnlyUp.indexOf(tile.index) > -1) ? false : tile.collideLeft;
        tile.collideRight = (that.tileOnlyUp.indexOf(tile.index) > -1) ? false : tile.collideRight;
    };

    that.update = function () {

        this.canClimb = false;
        var climbTiles = this.layer.getTiles(this.player.body.x, this.player.body.y, this.player.body.width, this.player.body.height, false, false);
        for (var c = 0; c < climbTiles.length; c++) {
            if (climbTiles[c].index > 192) {
                this.canClimb = true;
            }
        }

        if (this.isClimbing && !this.canClimb) {
            this.isClimbing = false;
            this.player.body.allowGravity = true;
        }

        if ((this.cursors.up.isDown || game.touchControl.cursors.up || pad1.isDown(Phaser.Gamepad.XBOX360_DPAD_UP) || pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y) < -0.1) && game.time.now > this.climbTimer) {
            //console.log('x:' + this.player.body.x + ' y:' + this.player.body.y + 'w:' + this.player.body.width + ' h:' + this.player.body.height);
            //console.log(this.canClimb);
            if (this.canClimb && !this.isClimbing) {
                this.isClimbing = true;
                this.player.body.allowGravity = false;
                this.climbTimer = game.time.now + 750;
            }
        }

        game.physics.arcade.collide(this.player, this.layer);

        if ((this.jumpButton.isDown || game.touchControl.cursors.space || pad1.justPressed(Phaser.Gamepad.XBOX360_A)) && (this.player.body.onFloor() || this.isClimbing) && game.time.now > this.jumpTimer) {
            this.player.body.velocity.y = -300;
            this.jumpTimer = game.time.now + 750;
            if (this.isClimbing) {
                this.climbTimer = game.time.now + 750;
                this.isClimbing = false;
                this.player.body.allowGravity = true;
            }
        }


        if (this.isClimbing) {

            this.player.animations.play('climb');

            if (this.cursors.up.isDown || game.touchControl.cursors.up || pad1.isDown(Phaser.Gamepad.XBOX360_DPAD_UP) || pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y) < -0.1) {
                this.player.body.velocity.x = 0;
                this.player.body.velocity.y = -50;
            } else if (this.cursors.down.isDown || game.touchControl.cursors.down || pad1.isDown(Phaser.Gamepad.XBOX360_DPAD_DOWN) || pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y) > 0.1) {
                this.player.body.velocity.x = 0;
                this.player.body.velocity.y = 50;
            } else if (this.cursors.left.isDown || game.touchControl.cursors.left || pad1.isDown(Phaser.Gamepad.XBOX360_DPAD_LEFT) || pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) < -0.1) {
                this.player.body.velocity.x = -50;
                this.player.body.velocity.y = 0;
            } else if (this.cursors.right.isDown || game.touchControl.cursors.right || pad1.isDown(Phaser.Gamepad.XBOX360_DPAD_RIGHT) || pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) > 0.1) {
                this.player.body.velocity.x = 50;
                this.player.body.velocity.y = 0;
            } else {
                this.player.animations.play('climb-idle');
                this.player.body.velocity.x = 0;
                this.player.body.velocity.y = 0;
            }

        } else {
            // not climbing
            this.player.body.velocity.x = 0;

            if (this.cursors.left.isDown || game.touchControl.cursors.left || pad1.isDown(Phaser.Gamepad.XBOX360_DPAD_LEFT) || pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) < -0.1) {
                this.player.body.velocity.x = -125;

                this.facing = 'left';
                if (this.player.body.onFloor()) {
                    this.player.animations.play('run-left');
                } else {
                    this.player.animations.play('jump-left');
                }

            } else if (this.cursors.right.isDown || game.touchControl.cursors.right || pad1.isDown(Phaser.Gamepad.XBOX360_DPAD_RIGHT) || pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) > 0.1) {
                this.player.body.velocity.x = 125;

                this.facing = 'right';
                if (this.player.body.onFloor()) {
                    this.player.animations.play('run-right');
                } else {
                    this.player.animations.play('jump-right');
                }

            } else {

                if (this.player.body.onFloor()) {
                    if (this.facing == 'left') {
                        this.player.animations.play('idle-left');
                    } else {
                        this.player.animations.play('idle-right');
                    }
                } else {
                    if (this.facing == 'left') {
                        this.player.animations.play('jump-left');
                    } else {
                        this.player.animations.play('jump-right');
                    }
                }
            }
        }

        if (this.forceUpdate || this.player.x !== this.lastUpdate.x || this.player.y !== this.lastUpdate.y || this.player.animations.name !== this.lastUpdate.ani) {
            this.lastUpdate.x = this.player.x;
            this.lastUpdate.y = this.player.y;
            this.lastUpdate.ani = this.player.animations.name;
            socket.emit('updateplayer', this.lastUpdate);
            this.forceUpdate = false;
        }

        this.otherPlayers.forEach(this.animateOtherPlayer);
    };

    that.animateOtherPlayer = function (otherPlayer, index) {

        if (otherPlayer !== undefined) {
            otherPlayer.x += (otherPlayer.xHome - otherPlayer.x) / 2;
            otherPlayer.y += (otherPlayer.yHome - otherPlayer.y) / 2;
            otherPlayer.animations.play(otherPlayer.ani);
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
