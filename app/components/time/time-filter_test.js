'use strict';

describe('weather.time module', function() {
  beforeEach(module('weather.time.time-filter'));

  describe('shorttime filter', function() {
    beforeEach(module(function($provide) {
      $provide.value('version', 'TEST_VER');
    }));

    it('should replace VERSION', inject(function(shorttime) {
      expect(shorttime('before %VERSION% after')).toEqual('before TEST_VER after');
    }));
  });
});
