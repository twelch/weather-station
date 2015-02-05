'use strict';

angular.module('weather.time.time-filter', [])

.filter('interpolate', ['time', function(version) {
  return function(text) {
    return 'foo';
  };
}])

.filter('longtime', ['time', function(timestamp) {
  return function(dateObj) {
    var longFormat = d3.time.format("%c");
    return longFormat(dateObj);
  };
}]);
