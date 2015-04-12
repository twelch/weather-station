'use strict';

angular.module('weather.time.time-filter', [])

/*
 * Time formatting based on these specs - https://github.com/mbostock/d3/wiki/Time-Formatting
 */

.filter('longtime', ['time', function(timestamp) {
  return function(dateObj) {
    var longFormat = d3.time.format("%c");
    return longFormat(dateObj);
  };
}])

.filter('shorttime', ['time', function(timestamp) {
  return function(dateObj) {
    var longFormat = d3.time.format("%X");
    return longFormat(dateObj);
  };
}])

.filter('date', ['time', function(timestamp) {
  return function(dateObj) {
    var longFormat = d3.time.format("%x");
    return longFormat(dateObj);
  };
}])

.value('time', '0.1');
