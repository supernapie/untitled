var createNonPlayer = function (playerdata) {

    var nonPlayer = createSteerablePlayer(playerdata);

    nonPlayer.keys.right = true;

    var tryJumpTimer = 0;

    nonPlayer.target = undefined; // another sprite
    nonPlayer.behavior = 'follow'; // can be follow-jumpy, follow, flee or something else in which case it's chaos

    nonPlayer.follow = function () {

        if (!this.target) {
            this.behavior = 'chaos';
            this.runInChaos();
            return;
        }

        if (this.target.x > this.x) {
            this.keys.right = true;
            this.keys.left = false;
        } else {
            this.keys.right = false;
            this.keys.left = true;
        }

    };

    nonPlayer.jumpy = function () {

        if (!this.target) {
            return;
        }

        if (this.target.y < this.y) {
            this.keys.space = true;
        }

    };

    nonPlayer.runInChaos = function () {

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

    nonPlayer.navigate = function () {

        switch (this.behavior) {
            case 'follow':
                this.follow();
                this.runInChaos();
                break;
            case 'follow-jumpy':
                this.follow();
                this.runInChaos();
                this.jumpy();
                break;
            default:
                this.runInChaos();
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
