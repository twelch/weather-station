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
var handleErrors  = require('util/handleErrors');

/******** Config ********/

var config = {  
  paths: {
    app: {
      root:   'app',
      lib:    'app/lib',
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
    app: {},
    build: {}
  }
}

//Glob of all html/js/css in app dir
config.globs.app.code = [
  config.paths.app.root + '/*.html',
  config.paths.app.root + '/**/*.html',
  config.paths.app.root + '/**/*.css',
  config.paths.app.root + '/**/*.map'
];

config.globs.app.js = [
  config.paths.app.cmp + '/**/*.js',
  config.paths.app.js + '/**/*.js',
]

//Glob of all scss in app dir
config.globs.app.styles = [               
  config.paths.app.styles + '/**/*.scss',
  config.paths.app.lib + '/bootstrap-sass/assets/stylesheets',
  config.paths.app.lib + '/fontawesome/scss',
];

/******** Main tasks ********/

//Development
gulp.task('dev', ['clean'], function() {
  config.prod = false;
  runSequence(['js', 'code', 'sass'], 'watch');
});

//Production
gulp.task('prod', ['clean'], function() {
  config.prod = true;
  runSequence(['js', 'code', 'sass'], 'watch');
});

/******** Individual tasks ********/

//Add karma tests

gulp.task('clean', function(cb) {
  return gulp.src(config.paths.build.root+'/*').pipe(rm());
});

//Watch files and when they change, rerun build task
gulp.task('watch', ['browserSync'], function() {
  gulp.watch(config.globs.app.code, ['code']);
  gulp.watch(config.globs.app.styles, ['sass']);
});

gulp.task('js', function() {

  config.prod = false;
  return gulp.src(config.globs.app.js)
    .pipe(print())
    .pipe(gulpif(config.prod, uglify()))
    .pipe(gulp.dest(config.paths.build.js))
    .pipe(gulpif(!config.prod, browserSync.reload({stream:true})))
    .on('error', handleErrors);
});

//Build html/js/css and sync to browser
gulp.task('code', function(){
  var jsFilter  = filter(['**/*.js','!app/lib'])
    , cssFilter = filter('**/*.css')
    , htmlFilter = filter(['*.html', '**/*.html']);

  var minifyCss = map(function (buff, filename) {
    return new CleanCSS({
      //Settings here
    }).minify(buff.toString()).styles;
  });

  return gulp.src(config.globs.app.code)
    .pipe(cssFilter)
    .pipe(sourcemaps.init())
    .pipe(gulpif(config.prod, minifyCss))
    .pipe(sourcemaps.write('.'))
    .pipe(cssFilter.restore())

    .pipe(htmlFilter)
    .pipe(gulpif(config.prod, minifyHtml()))
    .pipe(htmlFilter.restore())

    .pipe(gulp.dest(config.paths.build.root))
    .pipe(gulpif(!config.prod, browserSync.reload({stream:true})))
    .on('error', notify.onError(function (error) {          
      return "Error: " + error.message;       
    }));
})

//Build scss, add sourcemaps if dev, autoprefix, and sync to browser if dev
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