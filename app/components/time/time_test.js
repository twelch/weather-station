'use strict';

describe('weather.time module', function() {
  beforeEach(module('weather.time'));

  describe('time service', function() {
    it('should return current version', inject(function(version) {
      expect(version).toEqual('0.1');
    }));
  });
});
