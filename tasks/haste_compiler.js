/*
 * grunt-haste-compiler
 * https://github.com/madmaw/grunt-haste-compiler
 *
 * Copyright (c) 2013 Chris Glover
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

    var shell = require("shelljs");

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

    grunt.registerMultiTask('haste_compiler', 'Grunt plugin for the Haste Compiler, turns Haskell into JavaScript', function() {
        // Merge task-specific and/or target-specific options with these defaults.
        var options = this.options({
        });

        if( !shell.which("hastec")) {
            grunt.fail.fatal("hastec must be installed");
        }

        var args = ["hastec"];
        var cleanBlobs = false;

        for( var key in options ) {
            var value = options[key];
            if( key = "cleanBlobs" ) {
                cleanBlobs = value;
            } else {
                if( value !== false ) {
                    // just add the option as is
                    var arg = " --"+key;
                    if( value !== true ) {
                        arg += "="+value;
                    }
                    args.push(arg);
                }
            }
        }


        var _this = this;

        // Iterate over all specified file groups.
        this.files.forEach(function(f) {

            var _args = [];
            for( var i in args ) {
                _args.push(args[i]);
            }
            if(f.dest) {
                _args.push("--out="+ f.dest);
                // ensure that the path exists (hastec won't)
                var index = f.dest.lastIndexOf('/');
                if( index >= 0 ) {
                    var dir = f.dest.substring(0, index);
                    if( !grunt.file.exists(dir) ) {
                        grunt.file.mkdir(dir);
                    }
                }
            }

            var files = [];
            // get specified files
            f.src.filter(function(filepath) {
                // Warn on and remove invalid source files (if nonull was set).
                if (!grunt.file.exists(filepath)) {
                    grunt.log.warn('Source file "' + filepath + '" not found.');
                    return false;
                } else {
                    return true;
                }
            }).forEach(function(file) {
                _args.push(file);
                files.push(file);
            });
            var done = _this.async();
            var cmd = _args.join(" ");
            grunt.verbose.writeln(cmd);
            shell.exec(cmd, function(code, output) {
                var success = code === 0;
                /* not required, already gets pumped out
                 if( success ) {
                 grunt.fail.fatal(output, code);
                 } else {
                 grunt.log.writeln(output);
                 }
                 */
                // clean up the blobs
                if( cleanBlobs ) {
                    grunt.verbose.writeln("cleaning blobs");
                    for( var i in files ) {
                        var file = files[i];
                        var dotIndex = file.lastIndexOf(".");
                        if( dotIndex >= 0 ) {
                            var filePrefix = file.substring(0, dotIndex+1);
                            grunt.verbose.writeln(filePrefix);
                            var hiFile = filePrefix + "hi";
                            var oFile = filePrefix + "o";
                            if( grunt.file.exists(hiFile) ) {
                                grunt.file.delete(hiFile);
                            }
                            if( grunt.file.exists(oFile) ) {
                                grunt.file.delete(oFile);
                            }
                        }
                    }
                }
                done(success);
            });

        });
    });

};
