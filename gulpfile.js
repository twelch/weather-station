var gulp         = require('gulp');
var browserSync  = require('browser-sync');
var sass         = require('gulp-sass');
var sourcemaps   = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var notify       = require('gulp-notify');

var config = {
     sassPath: './resources/sass',
    buildPath: './app/assets'
}

gulp.task('icons', function() { 
    return gulp.src(config.bowerDir + '/fontawesome/fonts/**.*') 
        .pipe(gulp.dest(config.buildPath+'/fonts')); 
});

gulp.task('css', function() { 
    return gulp.src(config.sassPath + '/style.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({
             includePaths: [
                 config.sassPath,
                 config.bowerDir + '/bootstrap-sass/assets/stylesheets',
                 config.bowerDir + '/fontawesome/scss',
             ]
         }) 
        .on("error", notify.onError(function (error) {
           return "Error: " + error.message;
         }))) 
        .pipe(sourcemaps.write({includeContent: false}))
        .pipe(sourcemaps.init({loadMaps: true}))
        //Not working with sourcemaps .pipe(autoprefixer({ browsers: ['last 2 version'] }))
        .pipe(sourcemaps.write())
         .pipe(gulp.dest(config.buildPath)); 
});

// Rerun the task when a file changes
 gulp.task('watch', function() {
     gulp.watch(config.sassPath + '/**/*.scss', ['css']); 
});

  gulp.task('default', ['icons', 'css']);