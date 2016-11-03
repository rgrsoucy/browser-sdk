import { ajax } from '../tools/ajax.js';
import Device from './Device';

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
        const { name: device_name, description: device_description, ids: device_ids, modelId: model_id, firmwareVersion: firmware_version } = opts.query;
        return new Promise((resolve, reject) => {
            ajax.get('/devices', {
                queryObj: {
                    device_name,
                    device_description,
                    device_ids,
                    model_id,
                    firmware_version
                }
            }).then((response) => {
                if (opts.asClasses) {
                    resolve(response.map((device) => {
                        return new Device(device, this.config);
                    }));
                } else {
                    resolve(response);
                }
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

    getMyApps() {
        return new Promise((resolve, reject) => {
            this.getMyPublishers().then((res)=>{
                this.getPublisherApps(res).then((res2)=>{
                    resolve(res2);
                }, (err)=>{reject(err)}
                );
            }, (err)=>{reject(err)
            });
        });
    }

    getMyPublishers(){
        return new Promise((resolve, reject) => {
            this.getUserInfo().then(() => {
                ajax.get(`/users/${this.userInfo.id}/publishers`)
                .then((response) => {
                    resolve(response);
                })
                .catch((error) => {
                    reject(error);
                });
            });
        });                        
    }

    getPublisherApps(pubsArray){
        return new Promise((resolve, reject) => {
            let appsArray = [];
            pubsArray.forEach(
                function(element, i){
                    ajax.get(`/publishers/${element.id}/apps`).then(
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
