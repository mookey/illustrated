'use strict';
var gulp    = require('gulp');
var sass    = require('gulp-sass');
var rev     = require('gulp-rev');
var uglify  = require('gulp-uglify');
var rimraf  = require('gulp-rimraf');

gulp.task('sass', function () {
  gulp.src('./public/assets/styles/**/*.scss')
    .pipe(sass())
    .on('error', function (err) { console.log(err.message); })
    .pipe(gulp.dest('./public/dist/styles'));
});


gulp.task('scripts', function() {
    return gulp.src(['./public/assets/scripts/**/*.js', './public/components/**/*.js'])
        .pipe(uglify())
        .pipe(gulp.dest('./public/dist/js'));
});


gulp.task('watch', function() {
    gulp.watch('./public/assets/**/*.js', ['scripts']);
    gulp.watch('./public/components/**/*.js', ['scripts']);
    gulp.watch('./public/assets/styles/**/*.scss', ['sass']);
});


gulp.task('clean', function() {
  return gulp.src('./public/dist/**/*.*', { read: false }) // much faster
    .pipe(rimraf());
});


gulp.task('default', function () {
    return gulp.src(['./public/dist/styles/style.css', './public/dist/js/main.js'])
        .pipe(rev())
        .pipe(gulp.dest('./public/dist'))  // write rev'd assets to build dir
        .pipe(rev.manifest())
        .pipe(gulp.dest('./public/dist')); // write manifest to build dir
});