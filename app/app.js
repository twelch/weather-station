'use strict';

// Declare app level module which depends on views, and components
angular.module('weather', [
  'ngRoute',
  'weather.dash'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/dash'});
}]);
