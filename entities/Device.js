import ajax from '../tools/ajax.js';

export
default class Device {
  constructor(options) {
    this.deviceId = options.deviceId;
    this.name = options.name;
    this.model = options.model;
    this.owner = options.owner;
    this.openToPublic = options.public;
  }

  // getAllDevices() {
  //   if (!(this.userId)) {
  //     throw new Error('Provide the userId during instantiation');
  //   }
  //   return new Promise(function(resolve, reject) {
  //     let callConfig = {
  //       url: '/users/' + this.userId + '/devices',
  //       type: 'GET'
  //     }

  //     ajax(callConfig).then(
  //       //get the resolved promise back from ajax with json response text
  //       function(allDevicesArray) {
  //         resolve(allDevicesArray)
  //       }).catch(function(error) {
  //       reject(error); //if the ajax doesn't resolve right
  //     });
  //   });
  // }

  // getDevice() {
  //   if (!(this.deviceId)) {
  //     throw new Error('Provide the userId during instantiation');
  //   }
  //   return new Promise(function(resolve, reject) {
  //     let callConfig = {
  //       url: '/users/' + this.userId + '/devices',
  //       type: 'GET'
  //     }

  //     ajax(callConfig).then(
  //       //get the resolved promise back from ajax with json response text
  //       function(allDevicesArray) {
  //         resolve(allDevicesArray)
  //       }).catch(function(error) {
  //       reject(error); //if the ajax doesn't resolve right
  //     });
  //   });
  // }




  updateDevice() {
    //patch: devices/deviceId
    if (!(this.deviceId)) {
      throw new Error('Provide the userId during instantiation');
    }
  }
  getDeviceState() {}
  deleteDevice() {}
  sendCommand() {}
  connect() {}
};

// getDeviceState
// getAllDevices
// sendCommand