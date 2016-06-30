import Ajax from '../tools/ajax.js';

export
default class Transmitter {
    constructor(config) {
        this.transmitterId = config.transmitterId;
        this.secret = config.secret;
        this.name = config.name;
        this.topic = config.topic;
        this.owner = config.owner;
        this.integrationType = config.integrationType;
        this.ajax = new Ajax(config.ajax);
    }

    deleteTransmitter(opts) {
        if (!(this.transmitterId)) {
            throw new Error('Provide the transmitterId during instantiation');
        }
        return new Promise((resolve, reject) => {
            this.ajax.delete(`/transmitters/${this.transmitterId}`, opts)
                .then((response) => {
                    //right now the object hangs around, but on the cloud it is gone
                    resolve(response);
                }).catch((error) => {
                    reject(error);
                });
        });
    }

    updateTransmitter(patchBody, opts) {
        if (!(this.transmitterId)) {
            throw new Error('Provide the transmitterId during instantiation');
        } else if (!(patchBody)) {
            throw new Error('Provide a patch of parameters to update');
        } else if (!(Object.keys(patchBody).length)) {
            throw new Error('Provide a patch with some parameters to update');
        }

        for (var x in patchBody) {
            if (!(this.hasOwnProperty(x))) {
                throw new Error('Provide a patch with relevant parameters to update');
            }
        }

        return new Promise((resolve, reject) => {
            console.log('================================', `${this.transmitterId}`);
            this.ajax.patch(`/transmitters/${this.transmitterId}`, patchBody, opts)
                .then((response) => {
                    this.transmitterId = response.transmitterId,
                    this.secret = response.secret,
                    this.name = response.name,
                    this.topic = response.topic,
                    this.owner = response.owner,
                    this.integrationType = response.integrationType,
                    resolve(response);
                }).catch((error) => {
                    reject(error);
                });
        });
    }
};