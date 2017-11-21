module.exports = function(grunt) {

    grunt.loadNpmTasks('grunt-open');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            dist: {
                src: [  "src/lib/**/*.min.js",
                        "src/game/plugins/**/*.js",
                        "src/game/sprites/**/*.js",
                        "src/game/states/**/*.js",
                        "src/game/substates/**/*.js",
                        "src/game/main.js"

                     ],
                dest: 'pub/code/game.js'
            }
        },
        uglify: {
            options: {
                mangle: false,
                banner: '/*! <%= pkg.name %> v<%= pkg.version %> - <%= pkg.author %> - ' + '<%= grunt.template.today("yyyy-mm-dd") %> */'+'\n\n/*! Phaser v2.7.5 - http://phaser.io - @photonstorm - (c) 2017 Photon Storm Ltd. */\n\n'
            },
            src_target: {
                files: {
                    'pub/code/game.min.js': ['pub/code/game.js']
                }
            }
        },
        open: {
            dev: {
                path: 'http://localhost:3000/'
            }
        },
        watch: {
            files: 'src/**/*.js',
            tasks: ['concat', 'uglify:src_target']
        },
    });

    grunt.registerTask('server', 'Start the dev web server', function() {
        require('./server.js');
    });

    grunt.registerTask('default', ['concat', 'uglify:src_target', 'server', 'open', 'watch']);
    //grunt.registerTask('default', ['concat', 'uglify:src_target', 'server', 'watch']);

    grunt.registerTask('compile', ['concat', 'uglify:src_target']);

};
