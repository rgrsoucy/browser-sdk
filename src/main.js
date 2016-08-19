import Oauth2 from './authorization/oauth2';
import User from './entities/User';
import Device from './entities/Device';
import Group from './entities/Group';
import Model from './entities/Model';
import Transmitter from './entities/Transmitter';
import Ajax, { ajax } from './tools/ajax';

import { mqtt } from './tools/mqtt';

export {
    Oauth2, User, Device, Group, Model, Transmitter
};

const config = {
    persistToken: true,
    mqtt: {
        endpoint: 'mqtt.relayr.io'
    }
};

let currentUser;
let project;
let oauth2;
let main = {
    init: function(p, customConfig) {
        project = p;

        if (customConfig) {
            Object.assign(config, customConfig);
        }
    },

    authorize: function(optionalToken) {
        return new Promise((resolve, reject) => {

            if (!oauth2) {
                oauth2 = new Oauth2({
                    protocol: ajax.options.protocol,
                    uri: ajax.options.uri,
                    appId: project.id,
                    redirectURI: project.redirectURI,
                    persist: config.persistToken
                });
            }
            let token;
            if (!optionalToken) {
                oauth2.login();

                token = oauth2.token;

            } else {
                token = optionalToken;
            }

            ajax.options.token = token;
            currentUser = new User(config, token);
            resolve(currentUser);
        });
    },

    logout: function() {
        oauth2.logout();
    },

    getConfig: function() {
        return config;
    },

    getCurrentUser: function() {
        return currentUser;
    },

    customAjax: function(ajaxConfiguration) {
        if (ajaxConfiguration) {
            return new Ajax(ajaxConfiguration);
        }
        else {
            throw new Error('Provide the custom configuration to make a new Ajax instance');
        }

    }
};

export default main;
