var gulp = require('gulp'),
    rename = require('gulp-rename');
var autoprefixer = require('gulp-autoprefixer');
var concat = require('gulp-concat');
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin'),
    cache = require('gulp-cache');
var cleancss = require('gulp-clean-css');
var sass = require('gulp-sass')
var babel = require('gulp-babel');
var sourcemaps = require('gulp-sourcemaps');

gulp.task('images', function(){
  gulp.src('src/img/**/*')
    .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
    .pipe(gulp.dest('dist/img/'));
});

gulp.task('styles', function(){
  gulp.src(['src/plugins/**/*.css', 'src/css/vendor/*css', 'src/css/*css'])
    .pipe(sourcemaps.init())
      .pipe(concat('bundle.css'))
      .pipe(sass())
      .pipe(autoprefixer('last 2 versions'))
      .pipe(rename({suffix: '.min'}))
      .pipe(cleancss())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('dist/css/'))
});

gulp.task('scripts', function(){
  return gulp.src(['src/plugins/jquery.min.js', 'src/plugins/jquery-ui.min.js', 'src/plugins/bootstrap/bootstrap.min.js', 'src/js/*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(sourcemaps.init())
      .pipe(concat('bundle.js'))
      .pipe(babel({
          presets: ['env']
      }))
      .pipe(rename({suffix: '.min'}))
      .pipe(uglify())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('dist/js/'))
});

var spawn = require('child_process').spawn;
var node;
gulp.task('server', function() {
  if (node) node.kill();
  node = spawn('node', ['./bin/www'], {stdio: 'inherit'});
  node.on('close', function(code) {
    if (code === 8) {
      gulp.log('Error detected, waiting for changes...');
    }
  });  
});

gulp.task('default', ['scripts', 'styles', 'images', 'server'], function() {
  gulp.watch('src/css/**/*css', ['styles']);
  gulp.watch('src/js/**/*.js', ['scripts']);
  gulp.watch(['app.js', 'routes/**/*.js'], ['server']);
});