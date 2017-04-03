# play

To install development tools:

    npm install

To run the game on you local machine:

    grunt

To run the game on a production server:

    npm start

Or run the game on a production server via pm2:

    pm2 start --name="play" npm -- start

And add a subdomain in apache and don't forget the a record for it in the DNS manager.
