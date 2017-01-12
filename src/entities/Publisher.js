import { ajax } from '../tools/ajax.js';

export default class Publisher {
    constructor(config={}) {
        this.config = config;
        this.name = config.name;
        this.publisherId = config.id;
        this.owner = config.owner;
    }

    newPublisher(postBody) {
        //POST /publishers, (name, publisher, redirectUri, description)
        if (!(postBody)) {
            throw new Error('Provide a body of parameters to post');
        } else if (
            !(postBody.hasOwnProperty('name')) && 
            !(postBody.hasOwnProperty('owner'))) {
            throw new Error('Provide a body with parameters name and owner for the Publisher');
        }
        
        return new Promise((resolve, reject) => {
            ajax.post('/publishers', postBody)
            .then((response) => {
                this.publisherId = response.id;
                this.name = response.name;
                this.owner = response.owner;
                resolve(response);
            })
            .catch((error) => {
                reject(error);
            });
        });
    }

    deletePublisher() {
        //DELETE /publishers/{publisherId}
        if (!(this.publisherId)) {
            throw new Error('Provide the device id during instantiation');
        }
        return new Promise((resolve, reject) => {
            ajax.delete(`/publishers/${this.publisherId}`)
                .then((response) => {
                    //right now the object hangs around, but on the cloud it is gone
                    resolve(response);
                }).catch((error) => {
                    reject(error);
                });
        });
    }

    updatePublisher(patchBody) {
         //POST /publishers/{publisherId}, optional:(name, publisher, redirectUri, description)
        if (!this.publisherId) {
            throw new Error('Please provide an publisherId');
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
            ajax.patch(`/publishers/${this.publisherId}`, patchBody)
            .then((response) => {
                this.name = response.name;
                this.owner = response.owner;
                resolve(response);
            })
            .catch((error) => {
                reject(error);
            });
        });
    }
}
