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
    template:"<svg width='850' height='200'></svg>",
    link: function(scope, elem, attrs){
      var salesDataToPlot=scope[attrs.chartData];
      var padding = 20;
      var pathClass="path";
      var xScale, yScale, xAxisGen, yAxisGen, lineFun;

      var d3 = $window.d3;
      var rawSvg=elem.find('svg');
      var svg = d3.select(rawSvg[0]);

      function setChartParameters(){
        xScale = d3.scale.linear()
          .domain([salesDataToPlot[0].entry_id, salesDataToPlot[salesDataToPlot.length-1].entry_id])
          .range([padding + 5, rawSvg.attr("width") - padding]);

        yScale = d3.scale.linear()
          .domain([d3.min(salesDataToPlot, function (d) { return d.field1; })-2, d3.max(salesDataToPlot, function (d) {
            return d.field1;
          })])
          .range([rawSvg.attr("height") - padding, 0]);

          xAxisGen = d3.svg.axis()
            .scale(xScale)
            .orient("bottom")
            .ticks(salesDataToPlot.length - 1);

          yAxisGen = d3.svg.axis()
            .scale(yScale)
            .orient("left")
            .ticks(5);

          lineFun = d3.svg.line()
            .x(function (d) {
              return xScale(d.entry_id);
            })
            .y(function (d) {
              return yScale(d.field1);
            })
            .interpolate("basis");
      }
       
      function drawLineChart() {
        setChartParameters();
        svg.append("svg:g")
          .attr("class", "x axis")
          .attr("transform", "translate(0,180)")
          .call(xAxisGen);

        svg.append("svg:g")
          .attr("class", "y axis")
          .attr("transform", "translate(20,0)")
          .call(yAxisGen);

        svg.append("svg:path")
        .attr({
          d: lineFun(salesDataToPlot),
          "stroke": "blue",
          "stroke-width": 2,
          "fill": "none",
          "class": pathClass
        });
      }
      drawLineChart();              
    }
  };
});