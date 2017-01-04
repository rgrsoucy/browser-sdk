import { ajax } from '../tools/ajax.js';
// import User from './User';

export default class App {
    constructor(config={}) {
        this.config = config;
        this.name = config.name;
        this.appId = config.appId;
        this.publisher = config.publisher;
        this.redirectUri = config.redirectUri;
        this.description = config.description;
    }

    updateApp(appId, patchBody) {
        if (!appId) {
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
            ajax.patch(`/apps/${appId}`, patchBody)
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
