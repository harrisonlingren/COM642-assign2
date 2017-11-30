var gulp = require('gulp'),
    rename = require('gulp-rename');
var autoprefixer = require('gulp-autoprefixer');
var concat = require('gulp-concat');
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin'),
    cache = require('gulp-cache');
var minifycss = require('gulp-minify-css');
var sass = require('gulp-sass');
var pug = require('gulp-pug');
var babel = require('gulp-babel');
var gutil = require('gulp-util');
var server = require('gulp-express');

gulp.task('views', function buildHTML() {
  return gulp.src('views/*.pug')
    .pipe(pug())
    .pipe(gulp.dest('dist/'));
});

gulp.task('images', function(){
  gulp.src('src/img/**/*')
    .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
    .pipe(gulp.dest('dist/img/'));
});

gulp.task('styles', function(){
  gulp.src(['src/plugins/**/*.css', 'src/css/**/*.scss', 'src/css/**/*.css'])
    .pipe(concat('bundle.css'))
    .pipe(sass())
    .pipe(autoprefixer('last 2 versions'))
    .pipe(gulp.dest('dist/css/'))
    .pipe(rename({suffix: '.min'}))
    .pipe(minifycss())
    .pipe(gulp.dest('dist/css/'))
});

gulp.task('scripts', function(){
  return gulp.src(['src/plugins/bootstrap.min.js', 'src/js/**/*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(concat('bundle.js'))
    .pipe(babel({
        presets: ['env']
    }))
    .pipe(gulp.dest('dist/js/'))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
      .on('error', function (err) { gutil.log(gutil.colors.red('[Error]'), err.toString()); })
    .pipe(gulp.dest('dist/js/'))
});

gulp.task('run', function(){
  gulp.task('server', function () {
    // Start the server at the beginning of the task 
    server.run(['app.js']);
 
    // Restart the server when file changes 
    gulp.watch(['views/**/*.pug'], server.notify);
    gulp.watch(['src/css/**/*.css'], ['styles']); 
    gulp.watch(['src/js/**/*.js'], ['jshint', 'scripts']);
    gulp.watch(['src/img/**/*'], server.notify);
    gulp.watch(['app.js', 'routes/**/*.js'], [server.run]);
  });
});

gulp.task('default', ['scripts', 'styles', 'images', 'run']);