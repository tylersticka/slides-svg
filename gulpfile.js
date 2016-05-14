var npmPackage = require('./package.json');
var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var sass = require('gulp-sass');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');

gulp.task('css', function () {
  return gulp.src('sass/**/*.scss')
    .pipe(sass.sync().on('error', sass.logError))
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(gulp.dest('css'))
    .pipe(browserSync.stream());
});

gulp.task('serve', ['css'], function () {
  browserSync.init({
    server: {
      baseDir: './'
    },
    logPrefix: npmPackage.name,
    logConnections: true,
    notify: false,
    reloadOnRestart: true
  });
  
  gulp.watch('sass/**/*.scss', ['css']);
  gulp.watch(['./img/**', './index.html', './js/**'])
    .on('change', browserSync.reload);
});

gulp.task('default', ['serve']);