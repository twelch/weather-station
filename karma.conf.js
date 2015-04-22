module.exports = function(config){
  config.set({

    basePath : './build',

    files : [
      'lib/angular/angular.js',
      'lib/angular-route/angular-route.js',
      'lib/angular-mocks/angular-mocks.js',
      'lib/d3/d3.js',
      'lib/c3/c3.js',
      'lib/underscore/underscore-min.js',
      'components/**/*.js',
      'components/dash/**/*.js'
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
