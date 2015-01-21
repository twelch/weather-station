'use strict';

angular.module('myApp.table', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/table', {
    templateUrl: 'table/table.html',
    controller: 'TableCtrl'
  });
}])

.controller('TableCtrl', ['$scope', '$http', function($scope, $http) {
  $http.get('table/testdata.json').success(function(data) {
    $scope.channel = data.channel;
    $scope.feeds = data.feeds;
  });
}]);