/*jshint node:true */
module.exports = function( grunt ) {

  grunt.loadNpmTasks( "grunt-contrib-jshint" );
  grunt.loadNpmTasks( "grunt-jscodesniffer" );
  grunt.loadNpmTasks( "grunt-contrib-uglify" );
  grunt.loadNpmTasks( "grunt-contrib-qunit" );
  grunt.loadNpmTasks( "grunt-mocha-test" );

  grunt.initConfig({
    pkg: grunt.file.readJSON( "package.json" ),
    jshint: {
      options: {
        jshintrc: ".jshintrc"
      },
      all: [ "./rjs.js", "./tests/**/*.js" ]
    },
    jscs: {
			app: {
				options: {
					standard: "Jquery"
				},
				files: {
					src: [ "./rjs.js", "./tests/tests.js" ]
				}
			},
      test: {
				options: {
					standard: "Jquery",
          reportFull: true
				},
				files: {
					src: [ "./rjs.js", "./tests/tests.js" ]
				}
			}
    },
    mochaTest: {
      test: {
        options: {
          quiet: false
        },
        src: [ "./tests/tests.js" ]
      }
    },
    uglify: {
      options: {
        banner: "/*! <%= pkg.name %> <%= grunt.template.today(\"yyyy-mm-dd\") %> */\n"
      },
      app: {
        files: {
          "./rjs.min.js" : ["./rjs.js"]
        }
      }
    }
  });

  grunt.registerTask( "test", [ "jshint", "jscs", "mochaTest" ] );
  grunt.registerTask( "default", [ "test", "uglify" ] );

};
