import Ajax from '../tools/ajax.js';
import Connection from '../tools/connection.js';
import DeviceHistory from './history/DeviceHistory';
import {
    mqtt
}
from '../tools/mqtt';

export
default class Device {
    constructor(config) {
        this.deviceId = config.deviceId;
        this.name = config.name;
        this.model = config.model;
        this.owner = config.owner;
        this.openToPublic = config.public;
        this.ajax = new Ajax(config.ajax);
        this.history = new DeviceHistory(config);
    }

    updateDevice(patch, raw) {
        if (!(this.deviceId)) {
            throw new Error('Provide the userId during instantiation');
        } else if (!(patch)) {
            throw new Error('Provide a patch of parameters to update');
        } else if (!(Object.keys(patch).length)) {
            throw new Error('Provide a patch with some parameters to update');
        }

        for (var x in patch) {
            if (!(this.hasOwnProperty(x))) {
                throw new Error('Provide a patch with relevant parameters to update');
            }
        }

        return new Promise((resolve, reject) => {
            this.ajax.patch(`/devices/${this.deviceId}`, patch, raw)
                .then((response) => {
                    this.name = response.name;
                    this.model = response.model;
                    this.owner = response.owner;
                    this.openToPublic = response.public;
                    resolve(response);
                }).catch((error) => {
                    reject(error);
                });
        });
    }

    getHistoricalData(opts) {
        return this.history.getHistoricalData(opts);
    }

    getReadings() {
        if (!(this.deviceId)) {
            throw new Error('Provid a device id');
        }
        return this.ajax.get(`${this.ajax.uri}/devices/${this.deviceId}/readings`);
    }

    deleteDevice(raw) {
        if (!(this.deviceId)) {
            throw new Error('Provide the userId during instantiation');
        }
        return new Promise((resolve, reject) => {
            this.ajax.delete(`/devices/${this.deviceId}`, null)
                .then((response) => {
                    //right now the object hangs around, but on the cloud it is gone
                    resolve(response);
                }).catch((error) => {
                    reject(error);
                });
        });
    }
    sendCommand(command, raw) {
        if (!(this.deviceId)) {
            throw new Error('Provide the deviceId during instantiation');
        } else if (!(command)) {
            throw new Error('Provide a command');
        }
        //path, name, value
        else if (!(command.path) && !(command.name) && !(command.value)) {
            throw new Error('Provide a properly formatted command');
        }

        return new Promise((resolve, reject) => {
            this.ajax.patch(`/devices/${this.deviceId}`, patch, raw)
                .then((response) => {
                    resolve(response);
                }).catch((error) => {
                    reject(error);
                });
        });
    }

    getChannel(transport) {
        return new Promise((resolve, reject) => {
            if (this._channelCredentials) {
                resolve(this._channelCredentials)
            } else {

                let body = {
                    id: this.deviceId,
                    transport: transport || "mqtt"
                }
                this.ajax.post(`/channels`, body)
                    .then((response) => {
                        this._channelCredentials = response;
                        resolve(response);
                    }).catch((error) => {
                        reject(error);
                    });
            }
        });
    }

    connect(transport = 'mqtt') {

        let connection = new Connection();
        let getChannel = this.getChannel();
        let subscribeMqtt = new Promise((resolve, reject) => {
            let options = {
                password: this._channelCredentials.credentials.password,
                userName: this._channelCredentials.credentials.user
            }
            mqtt.subscribe(this._channelCredentials.credentials.topic, connection.event);
            mqtt.connect(options).then(() => {
                resolve(connection)
            });
        })

        return new Promise((resolve, reject) => {
            Promise.all([getChannel, subscribeMqtt]).then((all) => {
                resolve(all[1])
            });
        });
    }

    getDeviceState() {
        if (!(this.deviceId)) {
            throw new Error('Provide the deviceId during instantiation');
        }
        return new Promise((resolve, reject) => {
            this.ajax.get(`/devices/${this.deviceId}/state`, null)
                .then((response) => {
                    resolve(response);
                }).catch((error) => {
                    reject(error);
                });
        });
    }

    getDeviceConfigurations() {
        // api/devices/deviceId/configurations
        if (!(this.deviceId)) {
            throw new Error('Provide the deviceId during instantiation');
        }
        return new Promise((resolve, reject) => {
            this.ajax.get(`/devices/${this.deviceId}/configurations`, null)
                .then((response) => {
                    resolve(response);
                }).catch((error) => {
                    reject(error);
                });
        });
    }

    setDeviceConfigurations() {
        // api/devices/deviceId/configurations
        //POST
    }

    getDeviceCommands() {
        // api/devices/deviceId/commands
        if (!(this.deviceId)) {
            throw new Error('Provide the deviceId during instantiation');
        }
        return new Promise((resolve, reject) => {
            this.ajax.get(`/devices/${this.deviceId}/commands`, null)
                .then((response) => {
                    resolve(response);
                }).catch((error) => {
                    reject(error);
                });
        });
    }

    setDeviceCommands() {
        // api/devices/deviceId/commands
        //POST
    }

    getDeviceMetadata() {
        // api/devices/deviceId/metadata
        if (!(this.deviceId)) {
            throw new Error('Provide the deviceId during instantiation');
        }
        return new Promise((resolve, reject) => {
            this.ajax.get(`/devices/${this.deviceId}/metadata`, null)
                .then((response) => {
                    resolve(response);
                }).catch((error) => {
                    reject(error);
                });
        });
    }

    setDeviceMetadata() {
        // api/devices/deviceId/metadata
        //POST
    }

    deleteDeviceMetadata() {
        // api/devices/deviceId/metadata
        //DELETE
        if (!(this.deviceId)) {
            throw new Error('Provide the userId during instantiation');
        }
        return new Promise((resolve, reject) => {
            this.ajax.delete(`/devices/${this.deviceId}/metadata`, null)
                .then((response) => {
                    //right now the object hangs around, but on the cloud it is gone
                    resolve(response);
                }).catch((error) => {
                    reject(error);
                });
        });
    }
};