const gulp = require('gulp');
const jade = require('gulp-jade');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const eslint = require('gulp-eslint');
const less = require('gulp-less');
const cleanCSS = require('gulp-clean-css');
const prefix = require('gulp-autoprefixer');
const imageminPngquant = require('imagemin-pngquant');
const imageminJpegtran = require('imagemin-jpegtran');
const svgmin = require('gulp-svgmin');
const del = require('del');
const bSync = require('browser-sync');
const mainBowerFiles = require('main-bower-files');
const babel = require('gulp-babel');

gulp.task('templates', () => {
    const YOUR_LOCALS = {};
    return gulp.src('app/*.jade')
        .pipe(jade({
            locals: YOUR_LOCALS
        }))
        .pipe(gulp.dest('dist'))
});

gulp.task('lint', () => {
  return gulp.src([
      'app/scripts/**/*.js'
    ])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('babel-compile', () => {
  return gulp.src('app/scripts/**/*.js')
    .pipe(babel({
      presets: ['es2015'<% if (includeReact) { %>, 'react' <% } %>]
    }))
    .pipe(gulp.dest('dist'));
});

gulp.task('scripts',
  gulp.series('lint', 'babel-compile', function scriptsInternal() {
    const glob = mainBowerFiles(/.*\.js/);
    glob.push('app/scripts/**/*.js');
    return gulp.src(glob)
      .pipe(concat('main.min.js'))
      .pipe(uglify())
      .pipe(gulp.dest('dist/scripts'));
}));

gulp.task('styles', () => {
  return gulp.src('app/styles/main.less')
    .pipe(less())
    .pipe(cleanCSS())
    .pipe(prefix())
    .pipe(gulp.dest('dist/styles'));
});

gulp.task('pngMin', () => {
  return gulp.src('app/images/*.png')
    .pipe(imageminPngquant({quality: '65-80', speed: 4})())
    .pipe(gulp.dest('dist/images'));
});

gulp.task('jpegMin', () => {
  return gulp.src('app/images/*.jpg')
    .pipe(imageminJpegtran({progressive: true})())
    .pipe(gulp.dest('dist/images'));
});

gulp.task('svgMin', () => {
  return gulp.src('app/images/*.svg')
    .pipe(svgmin())
    .pipe(gulp.dest('dist/images'));
});

gulp.task('images', gulp.parallel('pngMin', 'jpegMin', 'svgMin'));

gulp.task('clean', () => {
  return del(['dist']);
});

gulp.task('server', (done) => {
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
