import Oauth2 from '../authorization/oauth2';
import User from '../entities/User';
import Ajax from '../tools/ajax';

export
default class Relayr {
    constructor(project, customConfig) {
        this.project = project;
        this.oauth2;

        this.config = {
            persistToken: true,
            mqtt: {
                endpoint: "mqtt.relayr.io"
            },
            ajax: {
                uri: "api.relayr.io"
            }
        }
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