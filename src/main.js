import Oauth2 from '../authorization/oauth2';
import User from '../entities/User';
import Ajax from '../tools/ajax';
import {
    mqtt
}
from '../tools/mqtt';

export
default class Relayr {
    constructor(project, customConfig) {
        this.project = project;
        this.oauth2;

        this.config = {
            persistToken: true,
            mqtt: {
                endpoint: 'mqtt.relayr.io'
            },
            ajax: {
                uri: 'api.relayr.io',
                dataUri: 'data-api.relayr.io'
            }
        };
        if (customConfig) {
            Object.assign(this.config, customConfig);
        }
        this.currentUser;
    }

    authorize(optionalToken) {
        return new Promise((resolve, reject) => {

            const oauth2 = new Oauth2({
                uri: this.config.ajax.uri,
                appId: this.project.id,
                redirectURI: this.project.redirectURI,
                persist: this.config.persistToken
            });
            if (!optionalToken) {
                oauth2.login();

                this.config.ajax.token = oauth2.token;

            } else {
                this.config.ajax.token = optionalToken;

            }

            this.currentUser = new User(this.config);
            resolve(this.currentUser);
        });
    }

    getCurrentConfig() {
        return this.config;
    }

    customAjax(ajaxConfiguration) {
        return new Ajax(ajaxConfiguration || this.config.ajax);
    }

}

// console.log(mqtt)

// const r = new Relayr();


// let options = {
//     password: "vcG1ljmeqoSr",
//     userName: "297a005c-f11e-4b2a-92d0-1d42fa4400b6:3b383d97-8287-4a95-8bc6-c4cfeb5ddc6a",
// }
// console.log(options)
// mqtt.subscribe("/v1/50a66b82-cbea-452b-9c96-bac80b3a6538", function(sensorData) {
//     console.log("sensor data", sensorData)
// });
// mqtt.connect(options)
