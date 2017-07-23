module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            main: {
                src: ['src/chromosone.js', 'src/vector.js', 'src/core.js', 'src/storage.js',
                    'src/settings.js', 'src/ui.js'],
                dest: 'docs/assets/js/<%= pkg.name %>.js'
            },
            worker: {
                src: ['src/chromosone.js', 'src/vector.js', 'src/workers/fractaler.js'],
                dest: 'docs/assets/js/fractaler.js'
            },
            palleter: {
                src: ['src/vector.js', 'src/workers/palleter.js'],
                dest: 'docs/assets/js/palleter.js'
            }
        },
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            main: {
                files: {
                    'docs/assets/js/<%= pkg.name %>.min.js': ['docs/assets/js/<%= pkg.name %>.js']
                }
            },
            worker: {
                files: {
                    'docs/assets/js/fractaler.min.js': ['docs/assets/js/fractaler.js']
                }
            },
            palleter: {
                files: {
                    'docs/assets/js/palleter.min.js': ['docs/assets/js/palleter.js']
                }
            }
        },
        jshint: {
            files: ['Gruntfile.js', 'src/**/*.js'],
            // configure JSHint (documented at http://www.jshint.com/docs/)
            options: {
                //loopfunc: true,
                globals: {
                    jQuery: true,
                    console: true,
                    module: true
                }
            }
        },
        includes: {
            files: {
                src: ['src/templates/*.html'],
                dest: 'docs/',
                flatten: true,
                options: {
                    silent: false,
                    banner: '<!-- I am a banner <% includes.files.dest %> -->',
                    includePath: "src/"
                }
            }
        },
        copy: {
            main: {
                expand: true,
                flatten: true,
                src: 'src/dependencies/*',
                dest: 'docs/assets/js/'
            }
        }

    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-includes');

    // Default task(s).
    grunt.registerTask('default', ['jshint', 'concat', 'includes', 'uglify', 'copy']);

};