/*
Weather Station Task Runner

This task runner is designed to separate source folder from build folder.  The source folder is where all of the resources for bootstrapping the app are located.  Running the default task will download dependencies, build and copy code to the build folder, and start the watch task with automatic browser reload.
*/

var browserSync   = require('browser-sync');
var del           = require('del')
var gulp          = require('gulp');
var autoprefixer  = require('gulp-autoprefixer');
var bower         = require('gulp-bower');
var filter        = require('gulp-filter');
var gulpif        = require('gulp-if');
var minifyHtml    = require('gulp-minify-html');
var notify        = require('gulp-notify');
var print         = require('gulp-print');
var rm            = require('gulp-rimraf');
var runSequence   = require('run-sequence');
var sass          = require('gulp-sass');
var sourcemaps    = require('gulp-sourcemaps');
var uglify        = require('gulp-uglify');

var CleanCSS      = require('clean-css');
var map           = require('vinyl-map');
var handleErrors  = require('../util/handleErrors');

/******** Config ********/

var config = {  
  paths: {
    app: {
      root:   'app',
      lib:    'lib',
      js:     'app/js',
      cmp:    'app/components',
      styles: 'app/styles'
    },

    build: {
      root:   'build',
      lib:    'build/lib',
      js:     'build/js',
      cmp:    'build/components',
      styles:    'build/styles'
    }
  },

  globs: {
    app: {
      js:     'app/**/*.js',
      css:    ['app/**/*.css','app/**/*.map'],
      html:   'app/**/*.html',
      styles:  ['app/**/*.scss','lib/bootstrap-sass/assets/stylesheets','lib/fontawesome/scss'],
      lib:    ['lib/**/*']
    }
  }
}

/******** Main tasks ********/

//Development
gulp.task('dev', ['clean'], function() {
  config.prod = false;
  runSequence(['html', 'js', 'css', 'sass', 'lib'], 'watch');
});

//Production
gulp.task('prod', ['clean'], function() {
  config.prod = true;
  runSequence(['html', 'js', 'css', 'sass', 'lib'], 'watch');
});

/******** Individual tasks ********/

//Add karma tests

gulp.task('clean', function(cb) {
  return gulp.src(config.paths.build.root+'/*').pipe(rm());
});

//Watch files and when they change, rerun build task
gulp.task('watch', ['browserSync'], function() {
  gulp.watch(config.globs.app.html, ['html']);
  gulp.watch(config.globs.app.js, ['js']);
  gulp.watch(config.globs.app.css, ['css']);
  gulp.watch(config.globs.app.styles, ['sass']);
});

//Build html, minify if prod
gulp.task('html', function(){
  return gulp.src(config.globs.app.html)
    .pipe(gulpif(config.prod, minifyHtml()))
    .pipe(gulp.dest(config.paths.build.root))
    .pipe(gulpif(!config.prod, browserSync.reload({stream:true})))
    .on('error', handleErrors);
})

//Build JS, minify if prod
gulp.task('js', function() {
  return gulp.src(config.globs.app.js)
    .pipe(gulpif(config.prod, uglify()))
    .pipe(gulp.dest(config.paths.build.root))
    .pipe(gulpif(!config.prod, browserSync.reload({stream:true})))
    .on('error', handleErrors);
});

//Build CSS, add sourcemaps, minify if prod
gulp.task('css', function() {
  var cssFilter = filter('**/*.css');
  var minifyCss = map(function (buff, filename) {
    return new CleanCSS({
      processImport: false
    }).minify(buff.toString()).styles;
  });

  return gulp.src(config.globs.app.css)
    .pipe(cssFilter)
    .pipe(sourcemaps.init())
    .pipe(gulpif(config.prod, minifyCss))
    .pipe(sourcemaps.write('.'))
    .pipe(cssFilter.restore())
    .pipe(gulp.dest(config.paths.build.root))
    .pipe(gulpif(!config.prod, browserSync.reload({stream:true})))
    .on('error', handleErrors);
});

//Build scss, add sourcemaps if dev, compress if prod, autoprefix
gulp.task('sass', function() {
  return gulp.src(config.paths.app.styles + '/style.scss')
    .pipe(gulpif(!config.prod, sourcemaps.init()))
    .pipe(sass({
      includePaths: config.globs.app.styles,
      outputStyle: config.prod ? 'compressed' : 'nested',
      errLogToConsole: true
    }))
    .pipe(gulpif(!config.prod, sourcemaps.write({includeContent: false, sourceRoot: '.'})))
    .pipe(gulpif(!config.prod, sourcemaps.init({loadMaps: true})))
    .pipe(gulpif(!config.prod, sourcemaps.write()))
    .pipe(autoprefixer({browsers: ["last 2 versions", "> 1%", "ie 8"], cascade: false}))
    .pipe(gulp.dest(config.paths.build.styles))
    .pipe(gulpif(!config.prod, browserSync.reload({stream:true})))
    .on('error', handleErrors);
});

gulp.task('lib', function() {
  return gulp.src(config.globs.app.lib)
    .pipe(gulp.dest(config.paths.build.lib))
    .on('error', handleErrors);
});

//Load browser synching
gulp.task('browserSync', function() {
  var syncConfig = {
    server: {
      baseDir: config.paths.build.root
    }
  };
  browserSync(syncConfig);
});