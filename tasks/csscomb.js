/*
 * grunt-csscomb
 * https://github.com/t32k/grunt-csscomb
 *
 * Copyright (c) 2013 Koji Ishimoto
 * Licensed under the MIT license.
 */
'use strict';

module.exports = function (grunt) {

  grunt.registerMultiTask('csscomb', 'Sorting CSS properties in specific order.', function () {

    var done = this.async(),
        exec = require('child_process').exec,
        cssComb = 'php tasks/lib/csscomb.php -i ',
        fileSrc = '',
        fileDest = '',
        fileSort = '',
        options = this.options({
          sortOrder: null
        });

    if (options.sortOrder !== null) {
      if (grunt.file.exists(options.sortOrder)) {
        fileSort = ' -s ' + options.sortOrder;
      } else {
        grunt.log.error('Custom sort .json file not found.');
        return false;
      }
    }

    function puts(error, stdout, stderr) {
      grunt.log.ok(stdout);
      if (error !== null) {
        grunt.log.error(error);
        done(false);
      } else {
        done(true);
      }
    }

    this.files.forEach(function (file) {
      fileSrc = file.src.filter(function (filepath) {
        // Remove nonexistent files (it's up to you to filter or warn here).
        if (!grunt.file.exists(filepath)) {
          grunt.log.warn('Source file "' + filepath + '" not found.');
          return false;
        } else {
          return true;
        }
      }).map(function (filepath) {
        return filepath;
      });

      if (file.dest !== null) {
        fileDest = ' -o ' + file.dest;
      }

      var command = cssComb + fileSrc + fileDest + fileSort;
      exec(command, puts);

      grunt.log.writeln('`' + command + '` was initiated.');

    });

  });

};