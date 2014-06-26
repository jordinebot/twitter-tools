module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    sass: {
      dev: {
        files: {
          'app/css/style.css' : 'sass/style.scss',
          'app/css/admin.css' : 'sass/admin.scss'
        }
      },
      dist: {
        files: {
          'app/css/style.min.css' : 'sass/style.scss',
          'app/css/admin.min.css' : 'sass/admin.scss'
        },
        options: {
          'style': 'compressed'
        }
      }
    },
    coffee: {
      compile: {
        options: {
          join           : true,
          bare           : true,
          sourceMap      : false,
          sourceMapDir   : 'app/js/'
        },
        files: {
          'app/js/controllers.js': 'src/controllers/*.coffee',
          'app/js/classes.js': 'src/classes/*.coffee'
        }
      }
    },
    uglify: {
      dist: {
        files: { 'app/js/app.js' : [ 'app/js/classes.js', 'app/js/controllers.js' ] }
      }
    },
    watch: {
      css: {
        files: [ 'sass/*.scss' ],
        tasks: ['sass']
      },
      coffee: {
        files: [ 'src/controllers/*.coffee', 'src/classes/*.coffee' ],
        tasks: ['coffee', 'uglify']
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-coffee');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Default task(s).
  grunt.registerTask('default', ['watch']);

};





