/*jshint node:true */
module.exports = function( grunt ) {

  grunt.loadNpmTasks( "grunt-contrib-jshint" );
  grunt.loadNpmTasks( "grunt-jscodesniffer" );
  grunt.loadNpmTasks( "grunt-contrib-uglify" );
  grunt.loadNpmTasks( "grunt-shell" );

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
					src: [ "./rjs.js", "./tests/test.js" ]
				}
			},
      test: {
				options: {
					standard: "Jquery",
          reportFull: true
				},
				files: {
					src: [ "./rjs.js", "./tests/test.js" ]
				}
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
    },

		shell: {
			"mochaTest": {
				command: "mocha-phantomjs tests/test.html"
			}
    }
  });

  grunt.registerTask( "test", [ "jshint", "jscs", "shell:mochaTest", "uglify" ] );
  grunt.registerTask( "default", [ "test", "uglify" ] );

};
