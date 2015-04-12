module.exports = function(config){
  config.set({

    basePath : './',

    files : [
      'app/bower_components/angular/angular.js',
      'app/bower_components/angular-route/angular-route.js',
      'app/bower_components/angular-mocks/angular-mocks.js',
      'app/bower_components/d3/d3.js',
      'app/bower_components/c3/c3.js',
      'app/bower_components/underscore/underscore-min.js',
      'app/bower_components/flat-ui/dist/js/vendor/jquery.min.js',
      'app/bower_components/flat-ui/dist/js/flat-ui.min.js',      
      'app/components/**/*.js',
      'app/dash/**/*.js'
    ],

    autoWatch : true,

    frameworks: ['jasmine'],

    browsers : ['Chrome'],

    plugins : [
            'karma-chrome-launcher',
            'karma-firefox-launcher',
            'karma-jasmine',
            'karma-junit-reporter'
            ],

    junitReporter : {
      outputFile: 'test_out/unit.xml',
      suite: 'unit'
    }

  });
};
