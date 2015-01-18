var gulp = require('gulp'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    sourcemaps = require('gulp-sourcemaps'),
    minifycss = require('gulp-minify-css');


gulp.task('sass', function() {
	return gulp.src('sass/style.sass')
        .pipe(sourcemaps.init())
        .pipe(sass({indentedSyntax: true}))
        .on('error', function (err) {
            console.log('Sass error: ' + err.message);
        })
        .pipe(sourcemaps.write({includeContent: false}))
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(autoprefixer())
        .pipe(minifycss())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('css'));
});