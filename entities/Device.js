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
            _ajax(callConfig, function(deviceInstance) {
                resolve(deviceInstance);
            }, function(error) {
                reject(error);
            });
        });
    }

    _ajax(callConfig) {

    }
};

// getDeviceState
// getAllDevices
// sendCommand