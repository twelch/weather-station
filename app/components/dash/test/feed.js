'use strict';

angular.module('mockedFeed', [])
  .value('mockedJSON', {
    "channel": {
      "id": 22967,
      "name": "Home Weather Station 1",
      "description": "Temperature and humidity data from AM2302 sensor",
      "field1": "Temperature",
      "field2": "Humidity",
      "created_at": "2015-01-11T05:18:39Z",
      "updated_at": "2015-01-20T06:00:42Z",
      "last_entry_id": 82
    },
    "feeds": [
      {
        "created_at": "2015-01-11T18:49:07Z",
        "entry_id": 1,
        "field1": "69",
        "field2": "49"
      },
      {
        "created_at": "2015-01-11T18:49:21Z",
        "entry_id": 2,
        "field1": "69",
        "field2": "45"
      },
      {
        "created_at": "2015-01-11T18:49:36Z",
        "entry_id": 3,
        "field1": "69",
        "field2": "44"
      }
    ]
  });