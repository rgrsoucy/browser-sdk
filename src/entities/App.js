import { ajax } from '../tools/ajax.js';

export default class App {
    constructor(config={}) {
        this.config = config;
        this.name = config.name;
        this.appId = config.appId;
        this.publisher = config.publisher;
        this.redirectUri = config.redirectUri;
        this.description = config.description;
    }

    newApp(postBody) {
        //POST /apps, (name, publisher, redirectUri, description)
        if (!(postBody)) {
            throw new Error('Provide a body of parameters to post');
        } else if (
            !(postBody.hasOwnProperty('name')) && 
            !(postBody.hasOwnProperty('publisher')) &&
            !(postBody.hasOwnProperty('redirectUri')) &&
            !(postBody.hasOwnProperty('description'))) {
            throw new Error('Provide a body with parameters name, description, redirectUri, and publisher for the App');
        }
        
        return new Promise((resolve, reject) => {
            ajax.post('/apps', postBody)
            .then((response) => {
                this.appId = response.id;
                this.name = response.name;
                this.publisher = response.publisher;
                this.redirectUri = response.redirectUri;
                this.description = response.description;
                resolve(response);
            })
            .catch((error) => {
                reject(error);
            });
        });
    }

    deleteApp() {
        //DELETE /apps/{appId}
        if (!(this.appId)) {
            throw new Error('Provide the device id during instantiation');
        }
        return new Promise((resolve, reject) => {
            ajax.delete(`/apps/${this.appId}`)
                .then((response) => {
                    //right now the object hangs around, but on the cloud it is gone
                    resolve(response);
                }).catch((error) => {
                    reject(error);
                });
        });
    }

    updateApp(patchBody) {
         //POST /apps/{appId}, optional:(name, publisher, redirectUri, description)
        if (!this.appId) {
            throw new Error('Please provide an appId');
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
            ajax.patch(`/apps/${this.appId}`, patchBody)
            .then((response) => {
                this.name = response.name;
                this.publisher = response.publisher;
                this.redirectUri = response.redirectUri;
                this.description = response.description;
                resolve(response);
            })
            .catch((error) => {
                reject(error);
            });
        });
    }
}
