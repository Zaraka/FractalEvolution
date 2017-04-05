module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            main: {
                src: ['src/chromosone.js', 'src/vector.js', 'src/core.js', 'src/storage.js',
                    'src/settings.js', 'src/ui.js'],
                dest: 'public_html/<%= pkg.name %>.js'
            },
            worker: {
                src: ['src/chromosone.js', 'src/vector.js', 'src/workers/fractaler.js'],
                dest: 'public_html/fractaler.js'
            },
            palleter: {
                src: ['src/vector.js', 'src/workers/palleter.js'],
                dest: 'public_html/palleter.js'
            }
        },
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            main: {
                files: {
                    'public_html/<%= pkg.name %>.min.js': ['public_html/<%= pkg.name %>.js']
                }
            },
            worker: {
                files: {
                    'public_html/fractaler.min.js': ['public_html/fractaler.js']
                }
            },
            palleter: {
                files: {
                    'public_html/palleter.min.js': ['public_html/palleter.js']
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
        watch: {
            files: ['<%= jshint.files %>'],
            tasks: ['jshint']
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');

    // Default task(s).
    grunt.registerTask('default', ['jshint', 'concat', 'uglify']);

};