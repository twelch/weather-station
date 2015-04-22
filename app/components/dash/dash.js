'use strict';

angular.module('weather.dash', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/dash', {
    templateUrl: 'components/dash/dash.html',
    controller: 'DashCtrl'
  });
}])

/*
 * feedService - manage feed data via Thingspeak API
 */
.service('FeedService', ['$http', 'feedConfig', function($http, feedConfig) {
  this.getFeed = function() {
    return $http.get('https://thingspeak.com/channels/22967/feeds.json?results=500')
      .then(
        //Success
        function (response) {
          return response.data;
        },
        //Fail
        function (httpError) {
           throw httpError.status + " : " + httpError.data;;           
        });
  },
  this.processFeed = function(rawFeedData) {
    //Add date objects
    var timeFormat = d3.time.format(feedConfig.feedTimeFormat);
    rawFeedData.feeds = _.each(rawFeedData.feeds, function(rec, index, list) {
      rec.created_date = timeFormat.parse(rec.created_at);
    });
    return rawFeedData;
  }
}])

.controller('DashCtrl', ['$scope', 'FeedService', 'feedConfig', 'chartConfig', function($scope, FeedService, feedConfig, chartConfig) {
  FeedService.getFeed()
    .then(function(rawFeedData) {
      var feedData = FeedService.processFeed(rawFeedData, feedConfig.feedTimeFormat);
      $scope.chartConfig = chartConfig;
      $scope.feedConfig = feedConfig;
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
        scope: {
            feedConfig: "@",
            chartConfig: "@"
        },
        data: {
          x: 'x',
          xFormat: scope.feedConfig.feedTimeFormat,
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
              format: scope.chartConfig.chartTimeFormat,
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
})

.constant('feedConfig', {
  feedTimeFormat: '%Y-%m-%dT%H:%M:%SZ'
})
.constant('chartConfig', {
  chartTimeFormat: '%I:%M:%S %p'
});