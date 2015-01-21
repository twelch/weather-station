'use strict';

describe('myApp.table module', function() {

  describe('table controller', function(){
    var scope, tableCtrl, $httpBackend;

    beforeEach(module('myApp.table'));
    beforeEach(inject(function(_$httpBackend_, $rootScope, $controller) {
      $httpBackend = _$httpBackend_;
      $httpBackend.expectGET('table/testdata.json').
          respond({"channel":{"id": 22967},"feeds":[{"entry_id": 1,"field1":"69","field2":"49"}]});

      scope = $rootScope.$new();
      tableCtrl = $controller('TableCtrl', {$scope: scope});
    }));

    it('should ....', function() {
      expect(tableCtrl).toBeDefined();
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