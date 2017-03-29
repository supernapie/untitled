var createGameState = function () {

    var that = {};

    that.map = undefined;
    that.layer = undefined;
    that.climbLayer = undefined;
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

    // private, can't set values change
    that.facing = 'left';
    that.jumpTimer = 0;
    that.canClimb = false;
    that.isClimbing = false;
    that.justClimbed = false;
    that.climbTimer = 0;
    that.resizeTO = 0;

    that.create = function () {

        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.physics.arcade.gravity.y = 500;

        this.map = game.add.tilemap(this.tilemapName);
        this.map.addTilesetImage(this.tilesetImageName);

        this.map.setCollisionByExclusion([14, 15, 16]);

        this.layer = this.map.createLayer('Tile Layer 1');
        //this.layer.debug = true;
        this.layer.resizeWorld();

        this.climbLayer = this.map.createLayer('Tile Layer 2');
        //this.climbLayer.debug = true;
        //this.climbLayer.resizeWorld();

        this.player = this.createSimplePlayer({x: this.startPoint.x, y: this.startPoint.y});

        game.physics.enable(this.player, Phaser.Physics.ARCADE);
        //this.player.body.bounce.y = 0.2;
        //this.player.body.allowGravity = false;
        //this.player.body.checkCollision.left = false;
        //this.player.body.checkCollision.right = false;
        //this.player.body.checkCollision.up = false;
        this.player.body.collideWorldBounds = true;
        this.player.body.setSize(8, 16, 4, 0);

        game.camera.follow(this.player);

        this.cursors = game.input.keyboard.createCursorKeys();
        this.jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

        this.otherPlayers = [];

        socket.on('updateplayer', function (playerdata) {
            //console.log('updateplayer');
            if (that.otherPlayers[playerdata.id]) {
                that.otherPlayers[playerdata.id].x = playerdata.x;
                that.otherPlayers[playerdata.id].y = playerdata.y;
                that.otherPlayers[playerdata.id].animations.play(playerdata.ani);
            } else {
                that.otherPlayers[playerdata.id] = that.createSimplePlayer(playerdata);
                that.otherPlayers[playerdata.id].animations.play(playerdata.ani);
                that.forceUpdate = true;
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

        return simplePlayer;

    }

    that.update = function () {

        this.canClimb = false;
        var climbTiles = this.climbLayer.getTiles(this.player.body.x, this.player.body.y, this.player.body.width, this.player.body.height, false, false);
        for (var c = 0; c < climbTiles.length; c++) {
            if (climbTiles[c].index > -1) {
                this.canClimb = true;
            }
        }

        if (this.isClimbing && !this.canClimb) {
            this.isClimbing = false;
            this.player.body.allowGravity = true;
        }

        if (this.cursors.up.isDown && game.time.now > this.climbTimer) {
            //console.log('x:' + this.player.body.x + ' y:' + this.player.body.y + 'w:' + this.player.body.width + ' h:' + this.player.body.height);
            //console.log(this.canClimb);
            if (this.canClimb && !this.isClimbing) {
                this.isClimbing = true;
                this.justClimbed = true;
                this.player.body.allowGravity = false;
                this.player.body.checkCollision.left = false;
                this.player.body.checkCollision.right = false;
                this.player.body.checkCollision.up = false;
                this.climbTimer = game.time.now + 750;
            }
        }

        if (!this.isClimbing && this.justClimbed && this.player.body.velocity.y > 0) {
            this.justClimbed = false;
            this.player.body.checkCollision.left = true;
            this.player.body.checkCollision.right = true;
            this.player.body.checkCollision.up = true;
        }

        game.physics.arcade.collide(this.player, this.layer);

        if (this.jumpButton.isDown && (this.player.body.onFloor() || this.isClimbing) && game.time.now > this.jumpTimer) {
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

            if (this.cursors.up.isDown) {
                this.player.body.velocity.x = 0;
                this.player.body.velocity.y = -50;
            } else if (this.cursors.down.isDown) {
                this.player.body.velocity.x = 0;
                this.player.body.velocity.y = 50;
            } else if (this.cursors.left.isDown) {
                this.player.body.velocity.x = -50;
                this.player.body.velocity.y = 0;
            } else if (this.cursors.right.isDown) {
                this.player.body.velocity.x = 50;
                this.player.body.velocity.y = 0;
            } else {
                this.player.animations.stop();
                this.player.body.velocity.x = 0;
                this.player.body.velocity.y = 0;
            }

        } else {
            // not climbing
            this.player.body.velocity.x = 0;

            if (this.cursors.left.isDown) {
                this.player.body.velocity.x = -125;

                this.facing = 'left';
                if (this.player.body.onFloor()) {
                    this.player.animations.play('run-left');
                } else {
                    this.player.animations.play('jump-left');
                }

            } else if (this.cursors.right.isDown) {
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
    };

    that.resize = function () {

        clearTimeout(that.resizeTO);
        that.resizeTO = setTimeout(function () {
            that.layer.resize(game.camera.width, game.camera.height);
            that.climbLayer.resize(game.camera.width, game.camera.height);
        }, 1000);

    };

    that.shutdown = function () {

        this.map = undefined;
        this.layer = undefined;
        this.climbLayer = undefined;
        this.player = undefined;
        this.cursors = undefined;
        this.jumpButton = undefined;

    };

    return that;

};

var gameState = createGameState();
