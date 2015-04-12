'use strict';

describe('weather.dash module', function() {

  describe('weather controller', function(){
    var scope, dashCtrl, $httpBackend;

    beforeEach(module('weather.dash', 'mockedFeed'));
    beforeEach(inject(function(_$httpBackend_, $rootScope, $controller, mockedJSON) {
      $httpBackend = _$httpBackend_;
      $httpBackend.expectGET(new RegExp('https://thingspeak.com/channels/22967/feeds.json*')).
          respond(mockedJSON);

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

    it('should set feedLoaded to true after data load', function() {
      expect(scope.feedLoaded).toBeUndefined();
      $httpBackend.flush();
      expect(scope.feedLoaded).toBeDefined();
      expect(scope.feedLoaded).toEqual(true);
    })  

  });
});