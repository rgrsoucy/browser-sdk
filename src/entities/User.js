import { ajax } from '../tools/ajax.js';
import Device from './Device';

export default class User {
    constructor(config, token) {
        this.config = config;
        this.token = token;
    }

    getUserInfo() {
        return new Promise((resolve, reject) => {
            if (this.userInfo) {
                resolve(this.userInfo);
            } else {
                ajax.get('/oauth2/user-info').then((response) => {
                    this.userInfo = response;
                    resolve(response);
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

    _getConfig() {
        return this.config;
    }
}
