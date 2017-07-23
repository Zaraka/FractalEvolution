module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            main: {
                src: ['src/chromosone.js', 'src/vector.js', 'src/core.js', 'src/storage.js',
                    'src/settings.js', 'src/ui.js'],
                dest: 'public_html/assets/js/<%= pkg.name %>.js'
            },
            worker: {
                src: ['src/chromosone.js', 'src/vector.js', 'src/workers/fractaler.js'],
                dest: 'public_html/assets/js/fractaler.js'
            },
            palleter: {
                src: ['src/vector.js', 'src/workers/palleter.js'],
                dest: 'public_html/assets/js/palleter.js'
            }
        },
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            main: {
                files: {
                    'public_html/assets/js/<%= pkg.name %>.min.js': ['public_html/assets/js/<%= pkg.name %>.js']
                }
            },
            worker: {
                files: {
                    'public_html/assets/js/fractaler.min.js': ['public_html/assets/js/fractaler.js']
                }
            },
            palleter: {
                files: {
                    'public_html/assets/js/palleter.min.js': ['public_html/assets/js/palleter.js']
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
                dest: 'public_html/',
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
                dest: 'public_html/assets/js/'
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