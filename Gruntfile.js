module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
/*    curl:{
      'vendor/mqttws31.min.js': 'http://git.eclipse.org/c/paho/org.eclipse.paho.mqtt.javascript.git/plain/src/mqttws31.js',
    },*/
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },

      build: {
        src: ["lib/relayr.js", "vendor/mqttws31.min.js"],
        dest: 'build/relayr.min.js'
      }
    },
    concat:{
      dist:{
        src: ["build/relayr.min.js"],
        dest: "build/<%= pkg.name %>.min.js"
      }
    },
    jshint: {
      all: ['Gruntfile.js', 'lib/*.js']
    }

  });

  // Load the plugin that provides the "uglify" task. 
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-curl');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  // Default task(s).
  grunt.registerTask('default', ['jshint','uglify','concat']);

};