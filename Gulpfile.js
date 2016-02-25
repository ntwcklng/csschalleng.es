const gulp = require('gulp')
const sass = require('gulp-sass')
const jekyll = require('gulp-jekyll')
const babel = require('gulp-babel')
const cp = require("child_process")
const uglify = require('gulp-uglify')
const watch = require('gulp-watch')
const browserSync = require("browser-sync")
const include = require('gulp-include')
const autoprefixer = require('gulp-autoprefixer')

const SOURCE = {
  entry_js: './src/js/main.js',
  js_build: 'dist/main.js',
  dist: 'dist',
  css_build: './dist/main.css',
  css_file: 'main.css',
  css_mainfile: 'src/css/main.scss'
}

gulp.task('css', function () {
  return gulp.src(SOURCE.css_mainfile)
    .pipe(autoprefixer({
      browsers: ['last 2 versions']
    }))
    .pipe(sass({
      outputStyle: 'compressed'
    }).on('error', sass.logError))
    .pipe(gulp.dest(SOURCE.dist));
})

gulp.task('js', function() {
  return gulp.src(SOURCE.entry_js)
  .pipe(include())
  .pipe(babel({
    presets: ['es2015']
  }))
  .pipe(gulp.dest(SOURCE.dist))
})

gulp.task('js-uglify', ['js'], function() {
  return gulp.src(SOURCE.js_build)
    .pipe(uglify())
    .pipe(gulp.dest(SOURCE.dist))
})

gulp.task('browser-sync', function() {
  browserSync.init({
    server: {
      baseDir: "./_site/"
    }
  })
})

gulp.task('build-dev', ['js', 'css'], function(done) {
  return cp.spawn("jekyll", ['build'], {stdio: 'inherit'})
  .on("close", done)
})

gulp.task('build-deploy', ['js-uglify', 'css'], function(done) {
  return cp.spawn("jekyll", ['build'], {stdio: 'inherit'})
  .on("close", done)
})

gulp.task('deploy', ['build-deploy'], function() {
  console.log('ready for deployment');
})

gulp.task('dev', ['build-dev', 'watch'], function() {
  console.log('build done.');
})

gulp.task('watch', ['build-dev', 'browser-sync'], function() {
  gulp.watch([
    './src/*/**',
    './_includes/*/**',
    './_layouts/*/**',
    './index.html'
  ], [
    'dev-rebuild'
  ])
})

gulp.task('dev-rebuild', ['build-dev'], browserSync.reload);