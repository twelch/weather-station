'use strict';

angular.module('weather.dash', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/dash', {
    templateUrl: 'dash/dash.html',
    controller: 'DashCtrl'
  });
}])

/*
 * feedService - manage feed data via Thingspeak API
 */
.service('FeedService', ['$http', function($http) {
  this.getFeed = function() {
    return $http.get('dash/testdata.json')
      .then(
        //Success
        function (response) {
          //Enhance channel
          response.data.channel.timeFormatStr = '%Y-%m-%dT%H:%M:%SZ';

          //Postprocess feed events
          //Add date objects
          var timeFormat = d3.time.format(response.data.channel.timeFormatStr);
          _.each(response.data.feeds, function(rec, index, list) {
            rec.created_date = timeFormat.parse(rec.created_at);
          })
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
      var chartTimeFormat = '%I:%M:%S %p';
      var chart = c3.generate({
        bindto: "#chart",
        data: {
          x: 'x',
          xFormat: scope["channel"].timeFormatStr,
          json: scope[attrs.chartData],
          keys: {
            value:['field1', 'field2'],
            x: 'created_at'
          },
          names: {
            field1: 'Temperature',
            field2: 'Humidity',
          }
        },
        axis: {
          x: {
            type: 'timeseries',
            tick: {
              format: chartTimeFormat,
              fit: true,
              culling: {
                max: 8 // the number of tick texts will be adjusted to less than this value
              }
            }
          }
        }
      });
    }
  };
});