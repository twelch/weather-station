'use strict';

angular.module('myApp.chart', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/chart', {
    templateUrl: 'chart/chart.html',
    controller: 'ChartCtrl'
  });
}])

.controller('ChartCtrl', [function() {

}]);