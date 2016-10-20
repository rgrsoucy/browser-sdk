import { ajax } from '../tools/ajax.js';

export
default class App {
    constructor(config) {
    	this.id = config.id;//what do you put here if you want to make a new app?
        this.name = config.name;
        this.description = config.description;
    }

    updateApp(patch, opts) {
        if (!(this.id)) {
            throw new Error('Provide the app id during instantiation');
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
            ajax.patch(`/app/this.id}`, patch, opts)
                .then((response) => {
                    this.description = response.description;
                    this.id = response.id;
                    this.name = response.name;
                    resolve(response);
                }).catch((error) => {
                    reject(error);
                });
        });
    }
}