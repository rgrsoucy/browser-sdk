import ajax from '../tools/ajax.js';

export
default class Device {
  constructor(options) {
    this.deviceId = options.deviceId;
    this.userId = options.userId;
  }

  getDeviceData() {
    if (!(this.deviceId)) {
      throw new Error('Provide the deviceId during instantiation');
    }
    return new Promise(function(resolve, reject) {
      let callConfig = {
        url: 'devices/' + this.deviceId,
        type: 'GET'
      }

      //resolve does this:
      function fulfilled() {
        ajax(callConfig).then(
          //get the resolved promise back from ajax with json response text
          function() {
            resolve(device.incomingData)
          }).catch(error); //if the ajax doesn't resolve right
      },
      //reject does this;
      function rejected() {
        reject(error);
      }
    });
  }

};

// getDeviceState
// getAllDevices
// sendCommand