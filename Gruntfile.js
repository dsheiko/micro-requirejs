/*jshint node:true */
module.exports = function(grunt) {

  grunt.loadNpmTasks("grunt-contrib-jshint");
  grunt.loadNpmTasks("grunt-jscs");
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks("grunt-contrib-qunit");
  

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
          './build/jquery.micro-rjs.min.js' : ['./src/jquery.micro-rjs.js']
        }
      }
    }
  });

  grunt.registerTask("test", ["jshint", "jscs", "qunit"]);
  grunt.registerTask("default", ["test", "uglify"]);

};
