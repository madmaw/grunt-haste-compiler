/*
 * grunt-haste-compiler
 * https://github.com/madmaw/grunt-haste-compiler
 *
 * Copyright (c) 2013 Chris Glover
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        '<%= nodeunit.tests %>',
      ],
      options: {
        jshintrc: '.jshintrc',
      },
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      tests: ['tmp'],
    },

    // Configuration to be run (and then tested).
    hastec: {
      default_options: {
        options: {
        },
        files: {
          'tmp/HelloWorld.js': ['test/fixtures/HelloWorld.hs'],
        },
      },
      custom_options: {
        options: {

        },
        files: {
          'tmp/ALibrary.js': ['test/fixtures/ALibrary.hs'],
        },
      },
      all: {
        options: {
            cleanBlobs: true,
            "opt-all": true,
        },
        files: {
          'tmp/all.js': ['test/fixtures/*.hs'],
        },
      },
    },

    // Unit tests.
    nodeunit: {
      tests: ['test/*_test.js'],
    },

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['clean', 'hastec', 'nodeunit']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test']);

};
