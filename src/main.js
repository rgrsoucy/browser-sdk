import Oauth2 from './authorization/oauth2';
import User from './entities/User';
import Device from './entities/Device';
import Group from './entities/Group';
import Model from './entities/Model';
import Transmitter from './entities/Transmitter';
import Ajax from './tools/ajax';
import {
    mqtt
}
from './tools/mqtt';

export {
    Oauth2, User, Device, Group, Model, Transmitter, Ajax
};

const config = {
    persistToken: true,
    mqtt: {
        endpoint: 'mqtt.relayr.io'
    },
    ajax: {
        uri: 'api.relayr.io',
        dataUri: 'data-api.relayr.io',
        protocol: 'https://'
    }
};

let currentUser;
let project;
let oauth2;
export
default {
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
                    protocol: config.ajax.protocol,
                    uri: config.ajax.uri,
                    appId: project.id,
                    redirectURI: project.redirectURI,
                    persist: config.persistToken
                });
            }
            if (!optionalToken) {
                oauth2.login();

                config.ajax.token = oauth2.token;

            } else {
                config.ajax.token = optionalToken;
            }

            currentUser = new User(config);
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
        return new Ajax(ajaxConfiguration || config.ajax);
    }
};
