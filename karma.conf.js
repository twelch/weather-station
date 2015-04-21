module.exports = function(config){
  config.set({

    basePath : './',

    files : [
      'app/assets/depend/angular/angular.js',
      'app/assets/depend/angular-route/angular-route.js',
      'app/assets/depend/angular-mocks/angular-mocks.js',
      'app/assets/depend/d3/d3.js',
      'app/assets/depend/c3/c3.js',
      'app/assets/depend/underscore/underscore-min.js',
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
