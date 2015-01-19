var fs = require('fs'),
    readline = require('readline');
    Q = require('q');

/**
 * Toggle line comment
 *
 * @author Ferry Brouwer <ferry.brouwer@gmail.com>
 * @param {string}              filePath
 * @param {string|number}       line
 * @param {boolean}             addComment
 * @returns {promise|Q.promise}
 */
module.exports = function(filePath, line, addComment) {
    'use strict';

    addComment = addComment || false;

    var linenumber = 0,
        lines = [],
        deferred = Q.defer();

    // create readline interface
    var rd = readline.createInterface({
        input: fs.createReadStream(filePath),
        terminal: false
    });

    // manipulate line comment
    var manipulateLine = function(linedata) {
        linenumber++;
        if ((isNaN(line) && linedata.indexOf(line) !== -1) || line === linenumber) {
            if (addComment === true && linedata.indexOf('//') === -1) {
                linedata = linedata.replace(linedata, '// ' + linedata);
            }
            if (addComment === false && linedata.indexOf('// ') !== -1) {
                linedata = linedata.replace('// ', '');
            }
        }
        lines.push(linedata);
    };

    // read and manipulate lines of file
    rd.on('line', manipulateLine);

    // when there's an error, reject deferred promise
    rd.input.once('error', function(err){
        deferred.reject(err);
    });

    // write new lines to file when all lines are read
    rd.input.once('end', function() {
        rd.removeListener('line', manipulateLine);
        fs.writeFile(filePath, lines.join('\n'), function (err) {
            if (err) {
                deferred.reject(err);
            } else {
                deferred.resolve();
            }
        });
    });

    // return promise
    return deferred.promise;
};