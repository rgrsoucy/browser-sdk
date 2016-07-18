import { ajax } from '../tools/ajax.js';

export
default class Group {
    constructor(config) {
        this.owner = config.owner;
        this.position = config.position;
        this.id = config.id;
        this.devices = config.devices;
        this.name = config.name;

    }

    // A group has the structure:
    // {
    //   "owner": "...",
    //   "position": ...,
    //   "id": "...",
    //   "devices": [...],
    //   "name": "..."
    // }

    getGroup() {
        if (!(this.id)) {
            throw new Error('Provide the group id during instantiation');
        }
        return new Promise((resolve, reject) => {
            ajax.get(`/groups/${this.id}`)
                .then((response) => {
                    resolve(response);
                }).catch((error) => {
                    reject(error);
                });
        });
    }

    getGroupDevices() {
        if (!(this.id)) {
            throw new Error('Provide the group id during instantiation');
        }
        return new Promise((resolve, reject) => {
            ajax.get(`/groups/${this.id}`)
                .then((response) => {
                    resolve(response.devices);
                }).catch((error) => {
                    reject(error);
                });
        });
    }

    deleteGroup(opts) {
        if (!(this.id)) {
            throw new Error('Provide the group id during instantiation');
        }
        return new Promise((resolve, reject) => {
            ajax.delete(`/groups/${this.id}`, opts)
                .then((response) => {
                    //right now the object hangs around, but on the cloud it is gone
                    resolve(response);
                }).catch((error) => {
                    reject(error);
                });
        });
    }

    //when updating a group, a patch object must be provided, with parameters which mach those that a group has, you can't add properties
    updateGroup(patch, opts) {
        if (!(this.id)) {
            throw new Error('Provide the group id during instantiation');
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
            ajax.patch(`/groups/this.id}`, patch, opts)
                .then((response) => {
                    this.owner = response.owner;
                    this.position = response.position;
                    this.id = response.id;
                    this.devices = response.devices;
                    this.name = response.name;
                    resolve(response);
                }).catch((error) => {
                    reject(error);
                });
        });
    }
};