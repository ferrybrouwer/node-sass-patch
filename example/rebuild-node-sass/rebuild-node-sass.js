/**
 * This is a temporary fix `gulp-sass` package module dependency `node-sass` for node v0.11.13 and v0.11.14
 * Rebuild `node-sass` package dependency module prevent exit code 1 when installing package modules.
 *
 * @author Ferry Brouwer <ferry.brouwer@gmail.com>
 * @see https://github.com/sass/node-sass
 */

// module exports
var childprocess = require('./childprocess'),
    linecomment = require('./linecomment');

// check if current node version is v0.11.13 or v0.11.14, which means the `node-sass` should be rebuild
if (['0.11.13', '0.11.14'].indexOf(process.versions.node) !== -1) {
    console.log('Start rebuilding `node-sass` package module');

    childprocess('git clone --recursive https://github.com/sass/node-sass.git tmp_node_sass')

        .then(function () {
            console.log('Update git submodules...');
            return childprocess([
                'cd ./tmp_node_sass',
                'git submodule update --init --recursive'
            ].join(' && '));
        })

        .then(function (arguments) {
            console.log('Comment line `var binding = require(getBinding());` of `lib/index.js`...');
            return linecomment('./tmp_node_sass/lib/index.js', 'var binding', true);
        })

        .then(function () {
            console.log('Install node package modules with new source files...');
            return childprocess([
                'cd ./tmp_node_sass',
                'npm install'
            ].join(' && '));
        })

        .then(function () {
            console.log('Uncomment line `var binding = require(getBinding());` of `lib/index.js`...');
            return linecomment('./tmp_node_sass/lib/index.js', 'var binding', false);
        })

        .then(function () {
            console.log('Install `node-gyp` package module and rebuild package module...');
            return childprocess([
                'cd ./tmp_node_sass',
                'npm install -g node-gyp',
                'node-gyp rebuild'
            ].join(' && '), true);
        })

        .then(function () {
            console.log('Copy rebuilded package module `node-sass` to `gulp-sass` as dependency...');
            return childprocess([
                'rm -rf ./node_modules/gulp-sass/node_modules/node-sass',
                'find ./tmp_node_sass -name \'.*\' -delete',
                'cp -r ./tmp_node_sass ./node_modules/gulp-sass/node_modules/node-sass',
            ].join(' && '));
        })

        .then(function () {
            console.log('Cleanup cloned `node-sass` directory...');
            return childprocess('rm -rf ./tmp_node_sass');
        })

        .then(function () {
            console.log('All done. You can now use `gulp-sass` inside your `gulpfile.js`.');
        })

        .fail(function (err) {
            console.error(err);
            process.exit(code = 1);
        });
}