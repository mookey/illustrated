'use strict';
var gulp        = require('gulp');
var sass        = require('gulp-sass');
var rev         = require('gulp-rev');
var uglify      = require('gulp-uglify');
var rimraf      = require('gulp-rimraf');
var sourcemaps  = require('gulp-sourcemaps');
var minifyCss   = require('gulp-minify-css');
var runSequence = require('gulp-run-sequence');

gulp.task('sass', function () {
  return gulp.src('./public/assets/styles/**/*.scss')
    // .pipe(sourcemaps.init())
    .pipe(sass())
    .on('error', function (err) { console.log(err.message); })
    // .pipe(sourcemaps.write())
    .pipe(gulp.dest('./public/assets/styles'));
});


gulp.task('scripts', function() {
    return gulp.src(['./public/assets/scripts/main.js', './public/components/**/*.js'])
        .pipe(uglify())
        .pipe(gulp.dest('./public/dist/js'));
});


gulp.task('compress', function() {
  return gulp.src('./public/assets/styles/style.css')
    .pipe(minifyCss())
    .pipe(gulp.dest('./public/dist/styles'));
});


gulp.task('watch', function() {
    gulp.watch('./public/assets/styles/**/*.scss', ['sass']);
});


gulp.task('clean', function() {
  return gulp.src('./public/dist', { read: false }) // much faster
    .pipe(rimraf());
});


gulp.task('bump', function () {
    return gulp.src(['./public/dist/styles/style.css', './public/dist/js/main.js'])
        .pipe(rev())
        .pipe(gulp.dest('./public/dist'))  // write rev'd assets to build dir
        .pipe(rev.manifest())
        .pipe(gulp.dest('./public/dist')); // write manifest to build dir
});

gulp.task('default', function(cb) {
  runSequence('clean', ['sass', 'scripts'], 'compress', 'bump', cb);
});