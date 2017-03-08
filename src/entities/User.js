import { ajax } from '../tools/ajax.js';
import Device from './Device';
import App from './App';
import Publisher from './Publisher';
import Group from './Group';
import Transmitter from './Transmitter';

export default class User {
    constructor(config) {
        this.config = config;
        this.token = ajax.options.token;
    }

    getUserInfo() {
        return new Promise((resolve, reject) => {
            if (this.userInfo) {
                resolve(this.userInfo);
            } else {
                ajax.get('/oauth2/user-info').then((response) => {
                    this.userInfo = Object.assign({}, response, {
                        token: ajax.options.token
                    });
                    resolve(this.userInfo);
                }).catch((error) => {
                    reject(error);
                });

            }
        });
    }

    getMyDevices(opts = {}) {
        return new Promise((resolve, reject) => {
            this.getUserInfo().then(() => {

                ajax.get(`/users/${this.userInfo.id}/devices`).then((response) => {
                    if (opts.asClasses) {
                        resolve(response.map((device) => {
                            return new Device(device, this.config);
                        }));
                    } else {
                        this.devicesCache = response;
                        resolve(response);
                    }
                }).catch(reject);
            });
        });
    }

    searchForDevices(opts = {}) {
        if (!opts.query) {
            throw new Error('Please provide a query object');
        }
        const {
            name: device_name,
            description: device_description,
            ids: device_ids,
            modelId: model_id,
            firmwareVersion: firmware_version,
            owner,
            shared
        } = opts.query;

        return new Promise((resolve, reject) => {
            ajax.get('/devices', {
                queryObj: {
                    device_name,
                    device_description,
                    device_ids,
                    model_id,
                    firmware_version,
                    owner,
                    shared
                }
            }).then((response) => {
                const { data: devices } = response;
                if (opts.asClasses) {
                    resolve(devices.map((device) => {
                        return new Device(device, this.config);
                    }));
                } else {
                    resolve(devices);
                }
            }, reject);
        });
    }

    //extended version of searchForDevices function
    //parameters: opts: device search options
    //            nextPageURL: url which is used to retreived devices
    //return    : {devices: array of found devices, links: link for the next page of devices}
    searchForDevicesEx(opts = {}, nextPageURL) {
        if (!opts.query) {
            throw new Error('Please provide a query object');
        }

        const { name: device_name, description: device_description, ids: device_ids, modelId: model_id, firmwareVersion: firmware_version, owner, shared } = opts.query;

        if (nextPageURL==undefined || nextPageURL.length<=0) {
             nextPageURL = "/devices"
        }

        return new Promise((resolve, reject) => {
            ajax.get(nextPageURL, {
                queryObj: {
                    device_name,
                    device_description,
                    device_ids,
                    model_id,
                    firmware_version,
                    owner,
                    shared
                }
            }).then((response) => {
                const { data: devices, links} = response;

                let devicesData = {};
                if(links) {
                    devicesData.links = links;
                }

                if (opts.asClasses) {
                    devicesData.devices = devices.map((device) => {
                          return new Device(device, this.config);
                    });
                } else {
                    devicesData.devices = devices;
                }

                resolve(devicesData);
            }, reject);
        });
    }

    getMyGroups() {
        return new Promise((resolve, reject) => {
            this.getUserInfo().then(() => {
                ajax.get(`/users/${this.userInfo.id}/groups`).then((response) => {
                    resolve(response);
                }).catch((error) => {
                    reject(error);
                });
            });
        });
    }

    getMyTransmitters() {
        return new Promise((resolve, reject) => {
            this.getUserInfo().then(() => {
                ajax.get(`/users/${this.userInfo.id}/transmitters`).then((response) => {
                    resolve(response);
                }).catch((error) => {
                    reject(error);
                });
            });
        });
    }

    getMyApps(opts = {}) {
        return new Promise((resolve, reject) => {
            this.getMyPublishers().then((res)=>{
                this._getPublisherApps(res).then((res2)=>{
                    if (opts.asClasses) {
                        resolve(res2.map((item) => {
                            return new App(item, this.config);
                        }));
                    } else {
                        resolve(res2);
                    }
                }, (err)=>{reject(err)}
                );
            }, (err)=>{reject(err)
            });
        });
    }

    getMyPublishers(opts = {}){
        return new Promise((resolve, reject) => {
            this.getUserInfo().then(() => {
                ajax.get(`/users/${this.userInfo.id}/publishers`)
                .then((response) => {
                    if (opts.asClasses) {
                        resolve(response.map((item) => {
                            return new Publisher(item, this.config);
                        }));
                    } else {
                        resolve(response);
                    }
                    resolve(response);
                })
                .catch((error) => {
                    reject(error);
                });
            });
        });
    }

    _getPublisherApps(pubsArray){
        return new Promise((resolve, reject) => {
            let appsArray = [];
            pubsArray.forEach(
                function(element, i){
                    ajax.get(`/publishers/${element.id}/apps/extended`).then(
                        (response) => {
                            let concatResult = appsArray.concat(response);
                            appsArray = concatResult;
                            if (i===pubsArray.length-1){
                                resolve(appsArray);
                            }
                        }).catch((err)=>{
                            return err
                        }
                    );
                }
            );
        });
    }

    _getConfig() {
        return this.config;
    }

    getCachedDevices() {
        return new Promise((resolve, reject) => {
            if (this.devicesCache){
                    resolve(this.devicesCache);
            } else {
                    resolve([]);
                }
        });
    }
}
