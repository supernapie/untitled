var createNonPlayer = function (playerdata) {

    var nonPlayer = createSteerablePlayer(playerdata);

    nonPlayer.keys.right = true;

    var tryJumpTimer = 0;

    nonPlayer.navigate = function () {

        game.physics.arcade.collide(this, this.layer);

        if (this.body.blocked.left) {

            if (tryJumpTimer < game.time.now) {
                this.keys.space = true;
                tryJumpTimer = game.time.now + 500 + Math.random() * 3000;
            } else if (tryJumpTimer - 2000 < game.time.now) {
                this.keys.left = false;
                this.keys.right = true;
            }

        } else if (this.body.blocked.right) {

            if (tryJumpTimer < game.time.now) {
                this.keys.space = true;
                tryJumpTimer = game.time.now + 500 + Math.random() * 3000;
            } else if (tryJumpTimer - 2000 < game.time.now) {
                this.keys.left = true;
                this.keys.right = false;
            }

        }

    };

    nonPlayer.update = function () {

        this.navigate();
        this.steer();

        this.keys.space = false;

    };

    //console.log('update');
    //console.log(nonPlayer);

    return nonPlayer;

};
