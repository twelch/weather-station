/*
Weather Station Task Runner

This task runner is designed to separate source folder from build folder.  The source folder is where all of the resources for bootstrapping the app are located.  Running the default task will download dependencies, build and copy code to the build folder, and start the watch task with automatic browser reload.
*/

var gulp          = require('gulp');
var browserSync   = require('browser-sync');
var del           = require('del')
var autoprefixer  = require('gulp-autoprefixer');
var bower         = require('gulp-bower');
var filter        = require('gulp-filter');
var notify        = require('gulp-notify');
var print         = require('gulp-print');
var sass          = require('gulp-sass');
var sourcemaps    = require('gulp-sourcemaps');
var useref        = require('gulp-useref');

/******** Config ********/

var config = {  
  paths: {
    app: {
      root:   'app',
      lib:    'app/lib',
      js:     'app/js',
      cmp:    'app/components',
      scss:   'app/scss'
    },

    build: {
      root:   'build',
      lib:    'build/lib',
      js:     'build/js',
      cmp:    'build/components',
      css:    'build/css'
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
  config.paths.app.root + '/**/*.js',
  config.paths.app.root + '/**/*.html',
  config.paths.app.root + '/**/*.css',
  config.paths.app.root + '/**/*.map'
];

//Glob of all html/js/css in build dir
config.globs.build.code = [
  config.paths.build.root + '/*.html',
  config.paths.build.lib + '/**',
  config.paths.build.js + '/**',
  config.paths.build.cmp + '/**',
  config.paths.build.css + '/**'
];

//Glob of all scss in app dir
config.globs.app.scss = [               
  config.paths.app.scss + '/**/*.scss',
  config.paths.app.lib + '/bootstrap-sass/assets/stylesheets',
  config.paths.app.lib + '/fontawesome/scss',
];

/******** Tasks ********/

gulp.task('default', ['code', 'sass', 'watch']);

//Watch files and when they change, rerun build task
gulp.task('watch', ['browserSync'], function() {
  gulp.watch(config.globs.app.code, ['code']);
  gulp.watch(config.globs.app.scss, ['sass']);
});

//Build html/js/css and sync to browser
gulp.task('code', ['code:clean'], function(){
  var jsFilter  = filter('**/*.js')
    , cssFilter = filter('**/*.css')
    , htmlFilter = filter(['*.html', '**/*.html']);

  //var assets = useref.assets();

  return gulp.src(config.globs.app.code)
    //.pipe(assets)
    .pipe(jsFilter)
    //.pipe(uglify())
    .pipe(jsFilter.restore())
    .pipe(cssFilter)
    //.pipe(minifyCss())
    .pipe(cssFilter.restore())
    //.pipe(assets.restore())
    //.pipe(useref())
    .pipe(htmlFilter)
    //.pipe(minifyHtml())
    .pipe(htmlFilter.restore())
    .pipe(gulp.dest(config.paths.build.root))
    .pipe(browserSync.reload({stream:true}));
})

//Clean html/js/css
gulp.task('code:clean', function(next){
  del(config.globs.build.code, next);
});

//Build scss and sync to browser
gulp.task('sass', function() {
  return gulp.src(config.paths.app.scss + '/style.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({includePaths: config.globs.app.scss})
    .on("error", notify.onError(function (error) {          
      return "Error: " + error.message;       
    })))
    .pipe(sourcemaps.write({includeContent: false}))
    .pipe(sourcemaps.init({loadMaps: true}))
    //Autoprefixer not working with sourcemaps, one or other for now
    //.pipe(autoprefixer({ browsers: ['last 2 version'] }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(config.paths.build.css))
    .pipe(browserSync.reload({stream:true}));
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

gulp.task('clean', ['code:clean']);