import Model from '../entities/Model.js';

import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

var expect = chai.expect;
chai.use(sinonChai);

let modelInstance;
let fakeConfig;

describe('Model', function() {
  beforeEach(function() {
    fakeConfig = {
      ajax: {
        url: 'fakeURL',
        token: '12345',
        tokenType: 'Bearer'
      }
    };

    modelInstance = new Model(fakeConfig);

    this.xhr = sinon.useFakeXMLHttpRequest();
    // console.log(this.xhr);
    this.requests = [];

    this.xhr.onCreate = function(xhr) {
      this.requests.push(xhr);
    }.bind(this);

  });
});

describe('#getAllModels', function() {
  it('should return an object of models available on the platform', function() {

    let sampleModel = {
      "id": "ebd828dd-250c-4baf-807d-69d85bed065b",
      "name": "Wunderbar Bridge Module",
      "manufacturer": "Relayr GmbH",
      "readings": [{
        "meaning": "raw",
        "unit": "raw"
      }],
      "commands": [{
        "command": "cmd",
        "path": "led",
        "unit": "integer",
        "maximum": 1,
        "minimum": 0
      }],
      "firmwareVersions": [{
        "version": "1.0.0",
        "configuration": {
          "schema": {
            "title": "Relayr configuration schema",
            "type": "object",
            "properties": {
              "frequency": {
                "description": "Frequency of the sensor updates in milliseconds",
                "type": "integer",
                "minimum": 200
              }
            },
            "required": [
              "frequency"
            ]
          },
          "defaultValues": {
            "frequency": 1000
          }
        }
      }]
    }
    modelInstance.getAllModels().then((result) => {
      expect(result).to.include(sampleModel);
      done();
    });

  });
});