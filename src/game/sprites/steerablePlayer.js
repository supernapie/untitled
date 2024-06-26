var createSteerablePlayer = function (playerdata) {

    // private, can't set values change
    var facing = 'left';
    var idle = false;
    var jumpTimer = 0;
    var canClimb = false;
    var canClimbDown = false;
    var isClimbing = false;
    var climbTimer = 0;
    var speed = 0;

    var bunnyTimer = 0;

    var steerablePlayer = createSimplePlayer(playerdata);

    var climbDownTiles = [193,194,195, 209,210,211, 225,226,227, 241,242,243];

    game.physics.enable(steerablePlayer, Phaser.Physics.ARCADE);
    //steerablePlayer.body.bounce.y = 0.2;
    //steerablePlayer.body.allowGravity = false;
    steerablePlayer.body.collideWorldBounds = true;
    steerablePlayer.body.setSize(8, 16, 12, 16);

    steerablePlayer.speedMax = 125;
    steerablePlayer.speedChange = 10;
    steerablePlayer.layer = undefined;
    steerablePlayer.keys = {up: false, down: false, left: false, right: false, space: false};

    steerablePlayer.tagAsBunny = function () {
        if (steerablePlayer.key.indexOf('bunny') <= -1 && bunnyTimer < game.time.now) {
            steerablePlayer.loadTexture(steerablePlayer.key + '-bunny', steerablePlayer.frame, false);
            return true;
        }
        return false;
    };

    steerablePlayer.untagAsBunny = function () {
        if (steerablePlayer.key.indexOf('bunny') > -1) {
            steerablePlayer.loadTexture(steerablePlayer.key.replace('-bunny',''), steerablePlayer.frame, false);
            bunnyTimer = game.time.now + 10000;
        }
    };

    steerablePlayer.steer = function () {

        if (this.layer == undefined) {
            return;
        }

        canClimb = false;
        canClimbDown = false;
        var climbTiles = this.layer.getTiles(this.body.x, this.body.y, this.body.width, this.body.height + 4, false, false);
        for (var c = 0; c < climbTiles.length; c++) {
            if (climbTiles[c].index > 192) {
                canClimb = true;

                // you can only climb down specific tiles
                if (climbDownTiles.indexOf(climbTiles[c].index) > -1) {
                    canClimbDown = true;
                }
            }
        }

        if (isClimbing && !canClimb) {
            isClimbing = false;
            this.body.allowGravity = true;
            this.body.checkCollision.down = true;
        }

        if (!canClimbDown) {
            this.body.checkCollision.down = true;
        }

        if ((this.keys.up || this.keys.down) && game.time.now > climbTimer) {
            //console.log('x:' + this.body.x + ' y:' + this.body.y + 'w:' + this.body.width + ' h:' + this.body.height);
            //console.log(canClimb);
            if (canClimb && !isClimbing) {
                isClimbing = true;
                this.body.allowGravity = false;
                climbTimer = game.time.now + 250;
                if (canClimbDown) {
                    this.body.checkCollision.down = false;
                }
            }
        }

        game.physics.arcade.collide(this, this.layer);

        if (isClimbing) {

            this.ani = 'climb';

            if (this.keys.up) {
                this.body.velocity.x = 0;
                this.body.velocity.y = -50;
            } else if (this.keys.down) {
                this.body.velocity.x = 0;
                this.body.velocity.y = 50;
            } else if (this.keys.left) {
                this.body.velocity.x = -50;
                this.body.velocity.y = 0;
            } else if (this.keys.right) {
                this.body.velocity.x = 50;
                this.body.velocity.y = 0;
            } else {
                this.ani = 'climb-idle';
                this.body.velocity.x = 0;
                this.body.velocity.y = 0;
            }

            if (this.keys.space && game.time.now > jumpTimer) {
                this.body.velocity.y = -250;
                jumpTimer = game.time.now + 250;
                climbTimer = game.time.now + 250;
                isClimbing = false;
                this.body.allowGravity = true;
                this.body.checkCollision.down = true;
            }

        } else {

            // not climbing

            this.body.velocity.x = 0;

            if (this.keys.left) {

                speed -= this.speedChange;
                speed = Math.max(speed, -this.speedMax);
                this.body.velocity.x = speed;

                facing = 'left';
                idle = false;

            } else if (this.keys.right) {

                speed += this.speedChange;
                speed = Math.min(speed, this.speedMax);
                this.body.velocity.x = speed;

                facing = 'right';
                idle = false;

            } else {

                speed += (0 - speed) / 2;
                this.body.velocity.x = speed;

                idle = true;

            }

            if (this.keys.space && (this.body.onFloor() || this.body.onWall()) && game.time.now > jumpTimer) {
                this.body.velocity.y = -250;
                jumpTimer = game.time.now + 250;

                if (this.body.blocked.left) {
                    speed = this.speedMax;
                } else if (this.body.blocked.right) {
                    speed = -this.speedMax;
                }
            }

            if (this.body.onFloor()) {

                if (idle) {

                    if (facing === 'left') {
                        this.ani = 'idle-left';
                    } else {
                        this.ani = 'idle-right';
                    }

                } else {

                    if (facing === 'left') {
                        this.ani = 'run-left';
                    } else {
                        this.ani = 'run-right';
                    }

                }

            } else {

                if (this.body.blocked.left) {

                    this.ani = 'slide-left';

                } else if (this.body.blocked.right) {

                    this.ani = 'slide-right';

                } else if (this.body.velocity.y < 0) {

                    if (facing === 'left') {
                        this.ani = 'jump-left';
                    } else {
                        this.ani = 'jump-right';
                    }

                } else {

                    if (facing === 'left') {
                        this.ani = 'flail-left';
                    } else {
                        this.ani = 'flail-right';
                    }

                }
            }

        } // end climbing or not climbing

        // don't forget to animate :)
        this.animations.play(this.ani);

    };

    steerablePlayer.update = function () {
        this.steer();
    };

    //console.log('update');
    //console.log(steerablePlayer);

    return steerablePlayer;

};
