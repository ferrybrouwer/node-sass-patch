var exec = require('child_process').exec,
    Q = require('q');

/**
 * Start child process
 *
 * @author Ferry Brouwer <ferry.brouwer@gmail.com>
 * @param {string} cmd
 * @param {boolean} silence
 * @returns {promise|Q.promise}
 */
module.exports = function (cmd, silence) {
    'use strict';

    silence = silence || false;

    // start defer promise
    var deferred = Q.defer();

    // start child process, and kill when it afterwards
    var p = exec(cmd, function (error, stdout, stderr) {
        if (error) {
            deferred.reject(stderr);
        } else {
            deferred.resolve(stdout);
        }
    });

    // when in verbose mode, set encoding type to `utf8` and pipe output stream to current process
    if (!silence) {
        p.stdout.setEncoding('utf8');
        p.stdout.pipe(process.stdout);
        p.stderr.pipe(process.stderr);
    }

    // return promise
    return deferred.promise;
};