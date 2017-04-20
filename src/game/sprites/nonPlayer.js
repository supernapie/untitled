var createNonPlayer = function (playerdata) {

    var nonPlayer = createSteerablePlayer(playerdata);

    nonPlayer.keys.right = true;

    var tryJumpTimer = 0;

    nonPlayer.navigate = function () {

        game.physics.arcade.collide(this, this.layer);

        if (this.body.blocked.left) {

            if (tryJumpTimer < game.time.now) {
                this.keys.space = true;
                tryJumpTimer = game.time.now + 2250 + Math.random() * 1750;
            } else if (tryJumpTimer - 2000 < game.time.now) {
                this.keys.left = false;
                this.keys.right = true;
                this.keys.space = false;
            }

        } else if (this.body.blocked.right) {

            if (tryJumpTimer < game.time.now) {
                this.keys.space = true;
                tryJumpTimer = game.time.now + 2250 + Math.random() * 1750;
            } else if (tryJumpTimer - 2000 < game.time.now) {
                this.keys.left = true;
                this.keys.right = false;
                this.keys.space = false;
            }

        } else if (tryJumpTimer - 1000 < game.time.now) {
            this.keys.space = false;
        }

    };

    nonPlayer.update = function () {

        this.navigate();
        this.steer();

    };

    //console.log('update');
    //console.log(nonPlayer);

    return nonPlayer;

};
