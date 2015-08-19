module.exports = function(grunt) {
    grunt.initConfig({
        clean: {
            options: { force : true },
            dest : ['deploy/**/*'],
        },

        copy: {
            assets: {
                expand: true,
                cwd: 'src',
                src: [
                    '**/*.html',
                    'assets/{fonts,img,media,data}/**/*', 
                ],
                dest: 'deploy/',
                filter: 'isFile'
            }
        },

        concat: {
            options: {
                separator: ';\n'
            },
            dist: {
              src: ['src/assets/vendor/**/*.js', 'src/assets/**/*.js'],
              dest: 'deploy/assets/js/app.js',
            },
        },

        sass: {
            dist: {
                options : { style : 'expanded' },
                files: {
                    'deploy/assets/css/app.css': 'src/assets/custom/sass/app.scss' 
                }
            }
        },

        watch: {
            dist: {
                files: [
                    'src/**/*'
                ],
                tasks: [
                    'copy',
                    'concat',
                    'sass'
                ]
            }
        },

        browserSync: {
            files: {
                src: [
                    'deploy/**/*.{html,css,js,json,png,jpeg,jpg,gif,svg}'
                ]
            },
            options: {
                server : {
                    baseDir: 'deploy',
                },
                ghostMode: {
                    clicks: true,
                    forms: true,
                    scroll: true
                },
                port           : 3000,
                logLevel       : 'info',
                logConnections : true,
                logFileChanges : true,
                notify         : true,
                debugInfo      : true,
                watchTask      : true,
                injectChanges  : true,
                open           : false
            }
        }
    });

    // grunt plugins
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-browser-sync');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    // tasks to be executed
    grunt.registerTask('default', [
        'clean',
        'copy',
        'sass',
        'autoprefixer',
        'concat',
    ]);

    // watch
    grunt.registerTask( 'server', [ 'clean', 'copy', 'concat', 'sass', 'browserSync', 'watch' ] );
};