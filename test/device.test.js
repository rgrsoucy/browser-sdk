import Device from '../entities/Device.js';

import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);


var expect = chai.expect;
chai.use(sinonChai);

let deviceInstance;

describe('Device', function() {
  beforeEach(function() {
    let options = {
      deviceId: 'fakeDeviceId',
      name: 'fakeDeviceName',
      model: 'fakeModel',
      owner: 'fakeOwner',
      public: false
    };

    deviceInstance = new Device(options);
  });

  describe('#updateDevice', function() {
    beforeEach(function() {
      sinon.spy(deviceInstance, 'ajax.patch');
    });

    it('should throw an error if no deviceId given to look up', function() {
      deviceInstance.deviceId = null;
      var fn = function() {
        deviceInstance.updateDevice();
      };
      expect(fn).to.throw(Error);
    });

    it('should hit the ajax with a patch and the correct url', function() {
      deviceInstance.updateDevice(options);
      expect(ajax.patch).to.have.been.calledWith(options);
    });

  });


  describe('#getDeviceState', function() {

  });

  describe('#deleteDevice', function() {

  });

  describe('#sendCommand', function() {

  });

  describe('#connect', function() {

  });


  // describe('#getAllDevices', function() {
  //   beforeEach(function() {

  //   });

  //   it('should throw an error if no deviceId given to look up', function() {
  //     deviceInstance.deviceId = null;
  //     var fn = function() {
  //       deviceInstance.getDevice();
  //     };
  //     expect(fn).to.throw(Error);
  //   });

  //   it('should hit ajax with the right options', function() {

  //   });

  //   it('should resolve the promise with an array of objects', function() {

  //   });

  //   it('should reject with the xhr object', function() {

  //   });


  // });


});