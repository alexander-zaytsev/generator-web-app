var gulp = require('gulp');
var jade = require('gulp-jade');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var eslint = require('gulp-eslint');
var less = require('gulp-less');
var cleanCSS = require('gulp-clean-css');
var prefix = require('gulp-autoprefixer');
var imageminPngquant = require('imagemin-pngquant');
var imageminJpegtran = require('imagemin-jpegtran');
var svgmin = require('gulp-svgmin');
var del = require('del');
var bSync = require('browser-sync');
var mainBowerFiles = require('main-bower-files');
var babel = require('gulp-babel');

gulp.task('templates', function() {
    var YOUR_LOCALS = {};
    return gulp.src('app/*.jade')
        .pipe(jade({
            locals: YOUR_LOCALS
        }))
        .pipe(gulp.dest('dist'))
});

gulp.task('lint', function () {
  return gulp.src([
      'app/scripts/**/*.js'
    ])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('babel-compile', function () {
  return gulp.src('app/scripts/**/*.js')
    .pipe(babel({
      presets: ['es2015', <% if (includeReact) { %> 'react' <% } %>]
    }))
    .pipe(gulp.dest('dist'));
});

gulp.task('scripts',
  gulp.series('lint', 'babel-compile', function scriptsInternal() {
    var glob = mainBowerFiles(/.*\.js/);
    glob.push('app/scripts/**/*.js');
    return gulp.src(glob)
      .pipe(concat('main.min.js'))
      .pipe(uglify())
      .pipe(gulp.dest('dist/scripts'));
}));

gulp.task('styles', function () {
  return gulp.src('app/styles/main.less')
    .pipe(less())
    .pipe(cleanCSS())
    .pipe(prefix())
    .pipe(gulp.dest('dist/styles'));
});

gulp.task('pngMin', function () {
  return gulp.src('app/images/*.png')
    .pipe(imageminPngquant({quality: '65-80', speed: 4})())
    .pipe(gulp.dest('dist/images'));
});

gulp.task('jpegMin', function () {
  return gulp.src('app/images/*.jpg')
    .pipe(imageminJpegtran({progressive: true})())
    .pipe(gulp.dest('dist/images'));
});

gulp.task('svgMin', function () {
  return gulp.src('app/images/*.svg')
    .pipe(svgmin())
    .pipe(gulp.dest('dist/images'));
});

gulp.task('images', gulp.parallel('pngMin', 'jpegMin', 'svgMin'));

gulp.task('clean', function () {
  return del(['dist']);
});

gulp.task('server', function (done) {
  bSync({
    server: {
      baseDir: ['dist']
    }
  });
  done();
});

gulp.task('default',
  gulp.series('clean',
    gulp.parallel('templates','styles', 'scripts', 'images'),
    'server',
    function watcher(done) {
      gulp.watch(
        'app/images',
        gulp.parallel('images')
      );
      gulp.watch(
        'app/pages',
        gulp.parallel('templates')
      );
      gulp.watch(
        'app/scripts/**/*.js',
        gulp.parallel('scripts')
      );
      gulp.watch(
        'app/styles/**/*.less',
        gulp.parallel('styles')
      );
      gulp.watch(
        'dist/**/*',
        bSync.reload
      );
      done();
    }
  )
);
