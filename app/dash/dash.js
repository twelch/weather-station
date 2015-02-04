'use strict';

angular.module('weather.dash', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/dash', {
    templateUrl: 'dash/dash.html',
    controller: 'DashCtrl'
  });
}])

//feedService - manages data from Thingspeak
.service('FeedService', ['$http', function($http) {
  this.getFeed = function() {
    return $http.get('dash/testdata.json')
      .then(
        //Success
        function (response) {
          return response.data;
        },
        //Fail
        function (httpError) {
           throw httpError.status + " : " + httpError.data;;           
        });
  }
}])

.controller('DashCtrl', ['$scope', 'FeedService', function($scope, FeedService) {
  FeedService.getFeed()
    .then(function(feedData) {
      $scope.channel = feedData.channel;
      $scope.feeds = feedData.feeds;
      $scope.feedLoaded = true;
    });    
}])

.directive('linearChart', function($window){
  return{
    restrict:'EA',
    template:"<div id='chart'></div>",
    link: function(scope, elem, attrs){

      var chart = c3.generate({
          bindto: "#chart",
          data: {
            x: 'x',
            json: scope[attrs.chartData],
            keys: {
              value:['field1', 'field2'],
              x: 'entry_id'
            },
            names: {
              field1: 'Temperature',
              field2: 'Humidity',
            }
          }          
      });
    }
  };
});