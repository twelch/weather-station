'use strict';

describe('weather.dash module', function() {

  describe('weather controller', function(){
    var scope, dashCtrl, $httpBackend;

    beforeEach(module('weather.dash'));
    beforeEach(inject(function(_$httpBackend_, $rootScope, $controller) {
      $httpBackend = _$httpBackend_;
      $httpBackend.expectGET('dash/testdata.json').
          respond({"channel":{"id": 22967},"feeds":[{"entry_id": 1,"field1":"69","field2":"49"}]});

      scope = $rootScope.$new();
      dashCtrl = $controller('DashCtrl', {$scope: scope});
    }));

    it('should ....', function() {
      expect(dashCtrl).toBeDefined();
    });

    it('should create "channel" model', function() {
      expect(scope.channel).toBeUndefined();
      $httpBackend.flush();
      expect(scope.channel).toBeDefined();
      expect(scope.channel.id).toBeDefined();
    });

    it('should create "feeds" model with list of feed items', function() {
      expect(scope.feeds).toBeUndefined();
      $httpBackend.flush();
      expect(scope.feeds).toBeDefined();
      expect(scope.feeds[0].field1).toEqual('69');
      expect(scope.feeds[0].field2).toEqual('49');
    });    

  });
});