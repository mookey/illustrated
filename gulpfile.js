'use strict';
var gulp        = require('gulp');
var sass        = require('gulp-sass');
var rev         = require('gulp-rev');
var uglify      = require('gulp-uglify');
var rimraf      = require('gulp-rimraf');
var sourcemaps  = require('gulp-sourcemaps');
var minifyCss   = require('gulp-minify-css');
var runSequence = require('gulp-run-sequence');
// var handlebars  = require('gulp-handlebars');
// var wrap        = require('gulp-wrap');
// var concat      = require('gulp-concat');
// var path        = require('path');

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


gulp.task('compress', function() {
  return gulp.src('./public/assets/styles/style.css')
    .pipe(minifyCss())
    .pipe(gulp.dest('./public/dist/styles'));
});


gulp.task('watch', function() {
    gulp.watch('./public/assets/styles/**/*.scss', ['sass']);
});

// gulp.task('handlebars', function() {
//   return gulp.src(['public/components/blog/**/*.html', 'public/components/generic/**/*.html'])
//     .pipe(handlebars())
//     .pipe(wrap('Handlebars.registerPartial(<%= processPartialName(file.relative) %>, Handlebars.template(<%= contents %>));', {}, {
//       imports: {
//         processPartialName: function(fileName) {
//           // Strip the extension and the underscore
//           // Escape the output with JSON.stringify
//           if ( fileName.indexOf('close') > -1 ) {
//             return JSON.stringify('generic/' + fileName.replace('.js', ''));
//           }
//           return JSON.stringify('blog/' + fileName.replace('.js', ''));
//         }
//       }
//     }))
//     .pipe(concat('templates.js'))
//     .pipe(uglify())
//     .pipe(gulp.dest('public/assets/scripts'));
// });

gulp.task('clean', function() {
  return gulp.src('./public/dist', { read: false }) // much faster
    .pipe(rimraf());
});

gulp.task('bump', function () {
    return gulp.src(['./public/dist/styles/style.css', './public/dist/js/main.js', './public/dist/js/blog/blog.js', './public/dist/js/cv/cv.js'])
        .pipe(rev())
        .pipe(gulp.dest('./public/dist'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('./public/dist'));
});

gulp.task('default', function(cb) {
  runSequence('clean', ['sass', 'scripts'], 'compress', 'bump', cb);
});