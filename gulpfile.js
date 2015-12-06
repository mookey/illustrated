'use strict';
var gulp        = require('gulp');
var sass        = require('gulp-sass');
var rev         = require('gulp-rev');
var uglify      = require('gulp-uglify');
var rimraf      = require('gulp-rimraf');
var sourcemaps  = require('gulp-sourcemaps');
var minifyCss   = require('gulp-minify-css');
var runSequence = require('gulp-run-sequence');
var shell       = require('gulp-shell')

gulp.task('sass', function () {
  return gulp.src('./public/assets/styles/**/*.scss')
    // .pipe(sourcemaps.init())
    .pipe(sass())
    .on('error', function (err) { console.log(err.message); this.emit('end'); })
    // .pipe(sourcemaps.write())
    .pipe(gulp.dest('./public/assets/styles'));
});


gulp.task('scripts', function() {
  return gulp.src(['./public/assets/scripts/main.js', './public/components/**/*.js'])
    .pipe(uglify())
    .pipe(gulp.dest('./public/dist/js'));
});

gulp.task('templates', shell.task([
  'handlebars public/components/blog/*.html -f public/dist/templates.js -pm'
]))


gulp.task('compress', function() {
  return gulp.src('./public/assets/styles/style.css')
    .pipe(minifyCss())
    .pipe(gulp.dest('./public/dist/styles'));
});


gulp.task('watch', function() {
    gulp.watch('./public/assets/styles/**/*.scss', ['sass', 'templates']);
});


gulp.task('clean', function() {
  return gulp.src('./public/dist', { read: false }) // much faster
    .pipe(rimraf());
});

gulp.task('bump', function () {
    return gulp.src(['./public/dist/styles/style.css', './public/dist/templates.js', './public/dist/js/main.js', './public/dist/js/blog/blog.js', './public/dist/js/cv/cv.js'])
        .pipe(rev())
        .pipe(gulp.dest('./public/dist'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('./public/dist'));
});

gulp.task('default', function(cb) {
  runSequence('clean', ['sass', 'scripts', 'templates'], 'compress', 'bump', cb);
});