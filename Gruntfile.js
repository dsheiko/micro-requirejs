/*jshint node:true */
module.exports = function( grunt ) {

  grunt.loadNpmTasks("grunt-contrib-jshint");
  grunt.loadNpmTasks("grunt-jscs");
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks("grunt-contrib-qunit");
  grunt.loadNpmTasks("grunt-contrib-concat");

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      options: {
        jshintrc: ".jshintrc"
      },
      all: ["./src/**/*.js", "./tests/**/*.js"]
    },
    jscs: {
        options: {
            "standard": "Jquery"
        },
        all: ["./src"]
    },
    concat: {
      dist: {
        src: ['./src/**/*.js'],
        dest: './build/micro-rjs-ie6.js'
      }
    },
    qunit: {
      all: ["tests/index.html"]
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      my_target: {
        files: {
          './build/micro-rjs.min.js' : ['./src/micro-rjs.js'],
          './build/micro-rjs-ie6.min.js' : ['./build/micro-rjs-ie6.js']
        }
      }
    }
  });

  grunt.registerTask("test", ["jshint", "jscs", "qunit"]);
  grunt.registerTask("default", ["test", "concat", "uglify"]);

};
